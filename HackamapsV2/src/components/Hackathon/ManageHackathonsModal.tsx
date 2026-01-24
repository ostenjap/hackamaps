import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { X, Plus, Trash2, Edit2, Save, Calendar, MapPin, Globe, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { DateTimePicker } from '../ui/date-time-picker';
import { AddressAutocomplete } from '../ui/address-autocomplete';
import type { HackathonEvent } from '../../types';

interface ManageHackathonsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ManageHackathonsModal({ isOpen, onClose }: ManageHackathonsModalProps) {
    const { user } = useAuth();
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        latitude: '',
        longitude: '',
        start_date: '',
        end_date: '',
        website_url: '',
        prize_pool: '',
        is_online: false,
        city: '',
        country: '',
    });

    useEffect(() => {
        if (isOpen && user) {
            fetchUserHackathons();
        }
    }, [isOpen, user]);

    const fetchUserHackathons = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('hackathons')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setHackathons(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (hackathon: any) => {
        setFormData({
            name: hackathon.name || '',
            description: hackathon.description || '',
            location: hackathon.location || '',
            latitude: hackathon.latitude?.toString() || '',
            longitude: hackathon.longitude?.toString() || '',
            start_date: hackathon.start_date ? new Date(hackathon.start_date).toISOString().slice(0, 16) : '',
            end_date: hackathon.end_date ? new Date(hackathon.end_date).toISOString().slice(0, 16) : '',
            website_url: hackathon.website_url || '',
            prize_pool: hackathon.prize_pool || '',
            is_online: hackathon.is_online || false,
            city: hackathon.city || '',
            country: hackathon.country || '',
        });
        setLogoUrl(hackathon.logo_url || null);
        setEditId(hackathon.id);
        setView('edit');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this hackathon?')) return;
        try {
            const { error } = await supabase.from('hackathons').delete().eq('id', id);
            if (error) throw error;
            fetchUserHackathons();
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Helper: Add randomness to coordinates to reduce map clustering
    const addCoordinateJitter = (lat: number, lng: number) => {
        const jitterRange = { min: 0.0010, max: 0.0050 };
        const randomJitter = () => {
            const jitter = Math.random() * (jitterRange.max - jitterRange.min) + jitterRange.min;
            return Math.random() < 0.5 ? jitter : -jitter;
        };
        return {
            lat: lat + randomJitter(),
            lng: lng + randomJitter()
        };
    };

    const [uploading, setUploading] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError(null);

            if (!event.target.files || event.target.files.length === 0) {
                return;
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `hackathon-${user?.id}-${Math.random()}.${fileExt}`;

            // Upload to hackathon-logos bucket
            const { error: uploadError } = await supabase.storage
                .from('hackathon-logos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('hackathon-logos')
                .getPublicUrl(filePath);

            setLogoUrl(publicUrl);

        } catch (error: any) {
            setError(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Basic validation
            if (!formData.name || !formData.start_date) {
                console.error("Validation Failed: Name or Start Date missing", formData);
                throw new Error("Name and Start Date are required.");
            }

            // Apply coordinate jitter for new inserts to reduce clustering
            let finalLat = formData.latitude ? parseFloat(formData.latitude) : null;
            let finalLng = formData.longitude ? parseFloat(formData.longitude) : null;

            if (view === 'add' && finalLat !== null && finalLng !== null) {
                const jittered = addCoordinateJitter(finalLat, finalLng);
                finalLat = jittered.lat;
                finalLng = jittered.lng;
                console.log(`Applied coordinate jitter: Original (${formData.latitude}, ${formData.longitude}) -> Jittered (${finalLat}, ${finalLng})`);
            }

            const payload = {
                ...formData,
                user_id: user?.id,
                latitude: finalLat,
                longitude: finalLng,
                start_date: new Date(formData.start_date).toISOString(),
                end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
                categories: ['generic'], // Default for now
                logo_url: logoUrl
            };

            console.log("Submitting Payload:", payload);

            if (view === 'edit' && editId) {
                const { error: updateError } = await supabase
                    .from('hackathons')
                    .update(payload)
                    .eq('id', editId);

                if (updateError) {
                    console.error("Update Error:", updateError);
                    throw updateError;
                }
            } else {
                // Let Supabase generate the ID (defaults to gen_random_uuid())
                const { error: insertError } = await supabase
                    .from('hackathons')
                    .insert([payload]);

                if (insertError) {
                    console.error("Insert Error:", insertError);
                    throw insertError;
                }
            }

            setView('list');
            fetchUserHackathons();
        } catch (err: any) {
            console.error("Submission Exception:", err);
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '', description: '', location: '', latitude: '', longitude: '',
            start_date: '', end_date: '', website_url: '', prize_pool: '',
            is_online: false, city: '', country: ''
        });
        setLogoUrl(null);
        setEditId(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="relative p-6 pb-4 border-b border-white/5 flex justify-between items-center bg-neutral-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            {view === 'list' ? 'My Hackathons' : (view === 'add' ? 'Add Hackathon' : 'Edit Hackathon')}
                        </h2>
                        <p className="text-xs text-neutral-400 mt-1">Manage the events you organize</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {view === 'list' ? (
                            <button
                                onClick={() => { resetForm(); setView('add'); }}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add New
                            </button>
                        ) : (
                            <button
                                onClick={() => setView('list')}
                                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-xs">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : view === 'list' ? (
                        <div className="space-y-3">
                            {hackathons.length === 0 ? (
                                <div className="text-center py-12 text-neutral-500">
                                    <p>You haven't listed any hackathons yet.</p>
                                    <button onClick={() => { resetForm(); setView('add'); }} className="mt-2 text-blue-400 hover:underline text-sm">
                                        Create one now
                                    </button>
                                </div>
                            ) : (
                                hackathons.map(h => (
                                    <div key={h.id} className="group p-4 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-all flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-white">{h.name}</h3>
                                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-neutral-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(h.start_date).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {h.is_online ? 'Online' : h.location || 'TBD'}
                                                </span>
                                                {h.prize_pool && (
                                                    <span className="flex items-center gap-1 text-green-400">
                                                        <DollarSign className="w-3 h-3" />
                                                        {h.prize_pool}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(h)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(h.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-neutral-400">Event Name *</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500/50 outline-none" placeholder="e.g. HackMIT" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-neutral-400">Event Icon (Pro Feature)</label>
                                    <div className="flex items-center gap-3">
                                        <div className="relative group w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                                            {logoUrl ? (
                                                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                            ) : (
                                                <Globe className="w-5 h-5 text-neutral-500" />
                                            )}
                                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                {uploading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Plus className="w-4 h-4 text-white" />}
                                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                            </label>
                                        </div>
                                        <div className="flex-1">
                                            <input type="url" value={formData.website_url} onChange={e => setFormData({ ...formData, website_url: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500/50 outline-none" placeholder="https://..." />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <DateTimePicker
                                        label="Start Date *"
                                        date={formData.start_date ? new Date(formData.start_date) : undefined}
                                        setDate={(date: Date | undefined) => setFormData({ ...formData, start_date: date ? date.toISOString() : '' })}
                                    />
                                </div>
                                <div>
                                    <DateTimePicker
                                        label="End Date"
                                        date={formData.end_date ? new Date(formData.end_date) : undefined}
                                        setDate={(date: Date | undefined) => setFormData({ ...formData, end_date: date ? date.toISOString() : '' })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-neutral-400">Prize Pool</label>
                                    <input type="text" value={formData.prize_pool} onChange={e => setFormData({ ...formData, prize_pool: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500/50 outline-none" placeholder="$10,000" />
                                </div>
                                <div className="flex items-center gap-3 pt-6">
                                    <input type="checkbox" id="is_online" checked={formData.is_online} onChange={e => setFormData({ ...formData, is_online: e.target.checked })}
                                        className="rounded border-white/10 bg-white/5 text-blue-500 focus:ring-blue-500/50" />
                                    <label htmlFor="is_online" className="text-sm text-white cursor-pointer select-none">This is an online event</label>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-neutral-400">Description</label>
                                <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500/50 outline-none resize-none" placeholder="Brief description of the event..." />
                            </div>

                            {!formData.is_online && (
                                <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                    <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Location Details</h3>
                                    <AddressAutocomplete
                                        label="Address / Venue"
                                        value={formData.location}
                                        onChange={(value) => setFormData({ ...formData, location: value })}
                                        onPlaceSelect={(address, lat, lng, city, country) => {
                                            setFormData({
                                                ...formData,
                                                location: address,
                                                latitude: lat.toString(),
                                                longitude: lng.toString(),
                                                city,
                                                country
                                            });
                                        }}
                                        placeholder="Search for a city or address..."
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-neutral-400">Latitude</label>
                                            <input type="number" step="any" value={formData.latitude} onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500/50 outline-none" placeholder="37.7749" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-neutral-400">Longitude</label>
                                            <input type="number" step="any" value={formData.longitude} onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500/50 outline-none" placeholder="-122.4194" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-4">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Hackathon</>}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
