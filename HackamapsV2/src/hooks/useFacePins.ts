import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { FacePin } from '../types';

export function useFacePins() {
    const [pins, setPins] = useState<FacePin[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPins = async () => {
        try {
            const { data, error } = await supabase
                .from('face_pins_public')
                .select('*');

            if (error) {
                console.error('Error fetching face pins:', error);
                return;
            }

            if (data) {
                setPins(data as FacePin[]);
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
