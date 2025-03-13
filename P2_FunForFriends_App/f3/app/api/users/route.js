import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

/**
 * POST handler for creating a new user
 */
export async function POST(request) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Parse the request body with size limit handling
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Content type must be application/json' 
      }, { status: 415 });
    }

    // Get the request body
    let userData;
    try {
      userData = await request.json();
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid JSON in request body',
        error: error.message
      }, { status: 400 });
    }
    
    // Check if image is too large (limit to ~1MB base64)
    if (userData.image && userData.image.length > 1400000) {
      return NextResponse.json({ 
        success: false, 
        message: 'Image is too large. Please upload a smaller image (max 1MB).' 
      }, { status: 413 });
    }
    
    // Create a new user document
    const user = await User.create(userData);
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'User created successfully', 
      data: user 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      
      // Extract validation error messages
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return NextResponse.json({ 
        success: false, 
        message: 'Validation failed', 
        errors: validationErrors 
      }, { status: 400 });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json({ 
        success: false, 
        message: 'Duplicate entry', 
        error: `Duplicate value for ${Object.keys(error.keyPattern).join(', ')}` 
      }, { status: 409 });
    }
    
    // Handle other errors
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create user', 
      error: error.message 
    }, { status: 500 });
  }
}

/**
 * GET handler for retrieving all users
 */
export async function GET() {
  try {
    // Connect to the database
    await dbConnect();
    
    // Fetch all users, sorted by creation date (newest first)
    // Exclude the image field to reduce response size
    const users = await User.find({}, { image: 0 }).sort({ createdAt: -1 });
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      count: users.length, 
      data: users 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    
    // Handle errors
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch users', 
      error: error.message 
    }, { status: 500 });
  }
} 