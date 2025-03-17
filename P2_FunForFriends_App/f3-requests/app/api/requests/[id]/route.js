import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import f3_res_User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  // Await params before destructuring
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;
  
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid user ID format' }, { status: 400 });
    }
    
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database');
    
    console.log(`Fetching user with ID: ${id}`);
    const user = await f3_res_User.findById(id);
    
    if (!user) {
      console.log(`User with ID ${id} not found`);
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    
    console.log(`Found user: ${user.name}`);
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch user', details: error.message }, { status: 500 });
  }
} 