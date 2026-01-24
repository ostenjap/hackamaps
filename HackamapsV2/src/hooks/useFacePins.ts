import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { FacePin } from '../types';

export function useFacePins() {
    const [pins, setPins] = useState<FacePin[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPins = async () => {
        try {
            const { data, error } = await supabase
                .from('face_pins')
                .select(`
                    *,
                    profiles:user_id (
                        username,
                        avatar_url
                    )
                `);

            if (error) {
                console.error('Error fetching face pins:', error);
                return;
            }

            if (data) {
                const mappedPins: FacePin[] = data.map((pin: any) => ({
                    ...pin,
                    username: pin.profiles?.username,
                    avatar_url: pin.profiles?.avatar_url
                }));
                setPins(mappedPins);
            }
        } catch (err) {
            console.error('Unexpected error in fetchPins:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPins();
    }, []);

    return { pins, isLoading, refetch: fetchPins };
}
