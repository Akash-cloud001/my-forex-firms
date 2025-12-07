import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ScoreHeaderProps {
    firmName: string;
    ptiScore?: number;
}

const ScoreHeader: React.FC<ScoreHeaderProps> = ({ firmName, ptiScore }) => {
    const router = useRouter();

    return (
        <Card className="mb-4">
            <CardHeader className="p-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-semibold">{firmName}</h1>
                </div>

                {ptiScore !== undefined && (
                    <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                        <span className="text-sm font-medium text-muted-foreground">PTI Score:</span>
                        <span className="text-xl font-bold text-primary">{ptiScore.toFixed(2)}</span>
                    </div>
                )}
            </CardHeader>
        </Card>
    );
};

export default ScoreHeader;
