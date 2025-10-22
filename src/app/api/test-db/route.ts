import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing MongoDB connection...');
    
    // Test connection
    await connectDB();
    
    // Test if we can perform a simple operation
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({
      status: 'success',
      message: 'MongoDB connection successful',
      database: db.databaseName,
      collections: collections.map(c => c.name),
      connectionState: mongoose.connection.readyState,
      connectionStates: {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      }
    });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'MongoDB connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      connectionState: mongoose.connection.readyState
    }, { status: 500 });
  }
}
