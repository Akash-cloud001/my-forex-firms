import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';

interface ScoreHeaderProps {
    firmName: string;
}

const ScoreHeader: React.FC<ScoreHeaderProps> = ({ firmName }) => {
    return (
        <Card className="mb-4">
            <CardHeader className="p-4">
                <h1 className="text-xl font-semibold">{firmName}</h1>
            </CardHeader>
        </Card>
    );
};

export default ScoreHeader;
