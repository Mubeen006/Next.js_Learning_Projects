import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import mongoose from 'mongoose';

/**
 * GET handler for retrieving a single user by ID
 */
export async function GET(request, { params }) {
  try {
    // Connect to the database
    await dbConnect();
    
    const { id } = params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid user ID format' 
      }, { status: 400 });
    }
    
    // Find the user by ID
    const user = await User.findById(id);
    
    // Check if user exists
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      data: user 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching user:', error);
    
    // Handle errors
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch user', 
      error: error.message 
    }, { status: 500 });
  }
}

/**
 * PUT handler for updating a user by ID
 */
export async function PUT(request, { params }) {
  try {
    // Connect to the database
    await dbConnect();
    
    const { id } = params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid user ID format' 
      }, { status: 400 });
    }
    
    // Parse the request body
    const updateData = await request.json();
    
    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    // Check if user exists
    if (!updatedUser) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'User updated successfully', 
      data: updatedUser 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating user:', error);
    
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
    
    // Handle other errors
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update user', 
      error: error.message 
    }, { status: 500 });
  }
}

/**
 * DELETE handler for removing a user by ID
 */
export async function DELETE(request, { params }) {
  try {
    // Connect to the database
    await dbConnect();
    
    const { id } = params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid user ID format' 
      }, { status: 400 });
    }
    
    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(id);
    
    // Check if user exists
    if (!deletedUser) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'User deleted successfully' 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting user:', error);
    
    // Handle errors
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete user', 
      error: error.message 
    }, { status: 500 });
  }
} 