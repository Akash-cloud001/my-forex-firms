import { useState, useEffect } from 'react';
import { ScoresData } from '@/components/crm/point-evaluation/types/constant.types';

export const useScoreData = (firmId: string) => {
    const [scoresData, setScoresData] = useState<ScoresData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const res = await fetch(`/api/admin/point-eval?firmId=${firmId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.evaluation) {
                        setScoresData(data.evaluation);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch scores", error);
            } finally {
                setLoading(false);
            }
        };

        if (firmId) {
            fetchScores();
        }
    }, [firmId]);

    return { scoresData, setScoresData, loading };
};
