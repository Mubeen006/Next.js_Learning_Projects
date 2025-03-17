import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import f3_res_User from '@/models/User';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get('gender');
    const minAge = searchParams.get('minAge');
    const maxAge = searchParams.get('maxAge');
    const option = searchParams.get('option');

    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database');

    // Build query based on filters
    const query = {};
    
    if (gender) {
      query.gender = gender;
    }
    
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = parseInt(minAge);
      if (maxAge) query.age.$lte = parseInt(maxAge);
    }
    
    if (option) {
      query.option = option;
    }

    console.log('Executing query:', JSON.stringify(query));
    const users = await f3_res_User.find(query).sort({ createdAt: -1 });
    console.log(`Found ${users.length} users`);

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch requests', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database');
    
    console.log('Creating new user:', JSON.stringify(body));
    const user = await f3_res_User.create(body);
    console.log('User created with ID:', user._id);
    
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create request', details: error.message },
      { status: 500 }
    );
  }
} 