import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Favorite from '@/models/Favorite';
import f3_res_User from '@/models/User';

export async function GET(request) {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database');
    
    console.log('Fetching favorites with populated user data...');
    const favorites = await Favorite.find().populate('userId').sort({ createdAt: -1 });
    console.log(`Found ${favorites.length} favorites`);
    
    return NextResponse.json({ success: true, data: favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch favorites', details: error.message },
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
    
    // Check if user exists
    console.log(`Checking if user exists with ID: ${body.userId}`);
    const user = await f3_res_User.findById(body.userId);
    if (!user) {
      console.log(`User with ID ${body.userId} not found`);
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if already favorited
    console.log(`Checking if user is already favorited: ${body.userId}`);
    const existingFavorite = await Favorite.findOne({ userId: body.userId });
    if (existingFavorite) {
      console.log(`User ${body.userId} is already in favorites`);
      return NextResponse.json(
        { success: false, error: 'User already in favorites' },
        { status: 400 }
      );
    }
    
    console.log(`Adding user ${body.userId} to favorites`);
    const favorite = await Favorite.create(body);
    console.log(`Favorite created with ID: ${favorite._id}`);
    
    return NextResponse.json({ success: true, data: favorite }, { status: 201 });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to favorites', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, notes } = body;
    
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database');
    
    console.log(`Updating favorite with ID: ${id}`);
    const favorite = await Favorite.findByIdAndUpdate(
      id,
      { notes },
      { new: true }
    );
    
    if (!favorite) {
      console.log(`Favorite with ID ${id} not found`);
      return NextResponse.json(
        { success: false, error: 'Favorite not found' },
        { status: 404 }
      );
    }
    
    console.log(`Favorite updated: ${favorite._id}`);
    return NextResponse.json({ success: true, data: favorite });
  } catch (error) {
    console.error('Error updating favorite:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update favorite', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Favorite ID is required' },
        { status: 400 }
      );
    }
    
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database');
    
    console.log(`Deleting favorite with ID: ${id}`);
    const favorite = await Favorite.findByIdAndDelete(id);
    
    if (!favorite) {
      console.log(`Favorite with ID ${id} not found`);
      return NextResponse.json(
        { success: false, error: 'Favorite not found' },
        { status: 404 }
      );
    }
    
    console.log(`Favorite deleted: ${favorite._id}`);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove favorite', details: error.message },
      { status: 500 }
    );
  }
} 