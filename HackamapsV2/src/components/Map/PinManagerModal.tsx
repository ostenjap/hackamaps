import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { X, Save, MapPin, Loader2, AlertCircle, Linkedin, Twitter, Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import { AddressAutocomplete } from '../ui/address-autocomplete';

interface PinManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPin?: any;
    onSuccess: () => void;
}

export function PinManagerModal({ isOpen, onClose, currentPin, onSuccess }: PinManagerModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        description: '',
        linkedin_url: '',
        x_url: '',
        latitude: '',
        longitude: '',
        location_name: ''
    });
    const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (currentPin) {
            setFormData({
                description: currentPin.description || '',
                linkedin_url: currentPin.linkedin_url || '',
                x_url: currentPin.x_url || '',
                latitude: currentPin.latitude?.toString() || '',
                longitude: currentPin.longitude?.toString() || '',
                location_name: currentPin.location_name || ''
            });
            setCustomImageUrl(currentPin.custom_image_url || null);
        } else {
            setFormData({
                description: '',
                linkedin_url: '',
                x_url: '',
                latitude: '',
                longitude: '',
                location_name: ''
            });
            setCustomImageUrl(null);
        }
    }, [currentPin, isOpen]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError(null);

            if (!event.target.files || event.target.files.length === 0) return;

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `face-${user?.id}-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('face-pin-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('face-pin-images')
                .getPublicUrl(filePath);

            setCustomImageUrl(publicUrl);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setLoading(true);
            setError(null);

            if (!formData.latitude || !formData.longitude) {
                throw new Error("Please select a location on the map.");
            }

            const payload = {
                user_id: user.id,
                description: formData.description,
                linkedin_url: formData.linkedin_url,
                x_url: formData.x_url,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                custom_image_url: customImageUrl,
                updated_at: new Date().toISOString()
            };

            const { error: upsertError } = await supabase
                .from('face_pins')
                .upsert(payload, { onConflict: 'user_id' });

            if (upsertError) throw upsertError;

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to remove your pin?')) return;
        try {
            setLoading(true);
            const { error } = await supabase.from('face_pins').delete().eq('user_id', user?.id);
            if (error) throw error;
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />

            <div className="relative w-full max-w-xl bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-500" />
                            {currentPin ? 'Update My Pin' : 'Join the Face Map'}
                        </h2>
                        <p className="text-xs text-neutral-400 mt-1">Share your profile with the hacker community</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-xs">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Image Upload */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-neutral-300">Custom Profile Picture (Optional)</label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-24 h-24 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 overflow-hidden flex items-center justify-center group">
                                {customImageUrl ? (
                                    <img src={customImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-neutral-600" />
                                )}
                                <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    {uploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Plus className="w-6 h-6 text-white" />}
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                </label>
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-xs text-neutral-400">High quality square images work best. Max 2MB.</p>
                                {customImageUrl && (
                                    <button type="button" onClick={() => setCustomImageUrl(null)} className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase tracking-wider">
                                        Remove Custom Image
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Description / Bio</label>
                        <textarea
                            required
                            rows={3}
                            maxLength={160}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none resize-none transition-all"
                            placeholder="Building cool stuff with AI... Looking for a co-founder in SF!"
                        />
                        <p className="text-[10px] text-neutral-500 text-right">{formData.description.length}/160</p>
                    </div>

                    {/* Socials */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                <Linkedin className="w-4 h-4 text-blue-400" /> LinkedIn
                            </label>
                            <input
                                type="url"
                                value={formData.linkedin_url}
                                onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition-all"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                <Twitter className="w-4 h-4 text-white" /> X (Twitter)
                            </label>
                            <input
                                type="url"
                                value={formData.x_url}
                                onChange={e => setFormData({ ...formData, x_url: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition-all"
                                placeholder="https://x.com/..."
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-4 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                        <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-500" /> Base Location
                        </label>
                        <AddressAutocomplete
                            label=""
                            value={formData.location_name}
                            onChange={(val) => setFormData({ ...formData, location_name: val })}
                            onPlaceSelect={(address, lat, lng) => {
                                setFormData({
                                    ...formData,
                                    location_name: address,
                                    latitude: lat.toString(),
                                    longitude: lng.toString()
                                });
                            }}
                            placeholder="Where are you based?"
                        />
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1">
                                <p className="text-[10px] text-neutral-500 uppercase font-bold">Latitude</p>
                                <p className="text-xs text-white font-mono">{formData.latitude || 'Not set'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-neutral-500 uppercase font-bold">Longitude</p>
                                <p className="text-xs text-white font-mono">{formData.longitude || 'Not set'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        {currentPin && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold transition-all flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Remove
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> {currentPin ? 'Update Pin' : 'Publish My Pin'}</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
