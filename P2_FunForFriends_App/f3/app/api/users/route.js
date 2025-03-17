import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import f3_User from '@/models/f3_User';
import { uploadImage } from '@/lib/cloudinary';

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
    
    // Check if image is provided
    if (!userData.image) {
      return NextResponse.json({ 
        success: false, 
        message: 'Image is required' 
      }, { status: 400 });
    }
    
    // Upload image to Cloudinary
    const imageUploadResult = await uploadImage(userData.image);
    
    if (!imageUploadResult.success) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to upload image to Cloudinary',
        error: imageUploadResult.error
      }, { status: 500 });
    }
    
    // Replace base64 image with Cloudinary URL and add public ID
    userData.image = imageUploadResult.url;
    userData.imagePublicId = imageUploadResult.public_id;
    
    // Create a new user document with Cloudinary image URL
    const user = await f3_User.create(userData);
    
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
    // We no longer need to exclude the image field since it's now a URL, not base64 data
    const users = await f3_User.find({}).sort({ createdAt: -1 });
    
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