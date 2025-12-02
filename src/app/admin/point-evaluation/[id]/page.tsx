import CompactScoresAdmin from '@/components/crm/point-evaluation/ScoreDetail'
import React from 'react'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div><CompactScoresAdmin firmId={id} /></div>
    )
}