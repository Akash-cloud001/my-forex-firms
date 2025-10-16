import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Firm from '@/models/Firm';
import { uploadFileToBunnyCDN, deleteFileFromBunnyCDN } from '@/lib/bunnycdn';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const firm = await Firm.findById(id);
    
    if (!firm) {
      return NextResponse.json({ error: 'Firm not found' }, { status: 404 });
    }

    return NextResponse.json(firm);
  } catch (error) {
    console.error('Error fetching firm:', error);
    return NextResponse.json({ error: 'Failed to fetch firm' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const contentType = request.headers.get('content-type');
    
    let updateData: Record<string, unknown> = {};
    let logoFile: File | null = null;

    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData (with file upload)
      const formData = await request.formData();
      
      for (const [key, value] of formData.entries()) {
        if (key === 'logoFile' && value instanceof File) {
          logoFile = value;
        } else if (typeof value === 'string') {
          try {
            updateData[key] = JSON.parse(value);
          } catch {
            updateData[key] = value;
          }
        }
      }
    } else {
      // Handle JSON data
      updateData = await request.json();
    }

    // Get existing firm to check for old logo
    const existingFirm = await Firm.findById(id);
    if (!existingFirm) {
      return NextResponse.json({ error: 'Firm not found' }, { status: 404 });
    }

    // Handle logo file operations
    if (logoFile) {
      // New logo file uploaded
      try {
        // Delete old logo from BunnyCDN if it exists
        if (existingFirm.logoFile?.url) {
          await deleteFileFromBunnyCDN(existingFirm.logoFile.url);
        }

        // Upload new logo to BunnyCDN
        const fileBuffer = Buffer.from(await logoFile.arrayBuffer());
        const bunnyFile = await uploadFileToBunnyCDN(
          fileBuffer,
          logoFile.name,
          logoFile.type,
          'firm-logos'
        );

        updateData.logoUrl = bunnyFile.url;
        updateData.logoFile = bunnyFile;
      } catch (error) {
        console.error('Error handling logo upload:', error);
        return NextResponse.json(
          { error: 'Failed to upload logo file' },
          { status: 500 }
        );
      }
    } else if (updateData.logoUrl === '' || updateData.logoUrl === null || updateData.logoUrl === undefined) {
      // Logo is being removed
      if (existingFirm.logoFile?.url) {
        await deleteFileFromBunnyCDN(existingFirm.logoFile.url);
      }
      updateData.logoUrl = '';
      updateData.logoFile = null;
    }

    // Remove fields that shouldn't be updated directly
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, createdAt, createdBy, version, ...rest } = updateData as Record<string, unknown>;
    
    // Update firm in MongoDB
    const updatedFirm = await Firm.findByIdAndUpdate(
      id,
      {
        ...rest,
        lastModifiedBy: 'admin', // You might want to get this from auth
        $inc: { version: 1 },
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedFirm) {
      return NextResponse.json({ error: 'Firm not found' }, { status: 404 });
    }

    return NextResponse.json(updatedFirm);
  } catch (error: unknown) {
    console.error('Error updating firm:', error);
    return NextResponse.json(
      { error: 'Failed to update firm' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    // Get firm to delete associated files
    const firm = await Firm.findById(id);
    if (firm?.logoFile?.url) {
      await deleteFileFromBunnyCDN(firm.logoFile.url);
    }

    const deletedFirm = await Firm.findByIdAndDelete(id);
    
    if (!deletedFirm) {
      return NextResponse.json({ error: 'Firm not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Firm deleted successfully' });
  } catch (error) {
    console.error('Error deleting firm:', error);
    return NextResponse.json({ error: 'Failed to delete firm' }, { status: 500 });
  }
}