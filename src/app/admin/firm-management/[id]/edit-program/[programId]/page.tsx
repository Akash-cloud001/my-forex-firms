import ProgramForm from '@/components/crm/firm-management/add-challange/AddProgram';
import React from 'react';

function EditProgramPage({ params }: { params: { programId: string } }) {
  return (
    <div>
      <ProgramForm programId={params.programId} />
    </div>
  );
}

export default EditProgramPage;