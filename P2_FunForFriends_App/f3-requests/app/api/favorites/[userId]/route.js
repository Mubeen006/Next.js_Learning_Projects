import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Favorite from '@/models/Favorite';

export async function DELETE(request, { params }) {
  try {
    // Await params before destructuring
    const resolvedParams = await Promise.resolve(params);
    const { userId } = resolvedParams;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database');
    
    console.log(`Deleting favorite for user: ${userId}`);
    const deletedFavorite = await Favorite.findOneAndDelete({ userId });
    
    if (!deletedFavorite) {
      console.log(`Favorite for user ${userId} not found`);
      return NextResponse.json(
        { success: false, error: 'Favorite not found' },
        { status: 404 }
      );
    }
    
    console.log(`Favorite deleted: ${deletedFavorite._id}`);
    return NextResponse.json({ success: true, data: deletedFavorite });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove favorite', details: error.message },
      { status: 500 }
    );
  }
} 