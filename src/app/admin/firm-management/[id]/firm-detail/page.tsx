"use client"
import FirmDetails from '@/components/crm/firm-management/firm-detail/FirmDetails'
import { useParams } from 'next/navigation'
import React from 'react'

function Page() {
      const params = useParams()
  const id = params?.id as string

  return (
    <div>
      <FirmDetails id={id} />
    </div>
  )
}

export default Page