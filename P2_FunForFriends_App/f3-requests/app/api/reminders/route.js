import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Reminder from '@/models/Reminder';
import Favorite from '@/models/Favorite';

export async function GET(request) {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database');
    
    console.log('Fetching reminders with populated data...');
    const reminders = await Reminder.find()
      .populate('userId')
      .populate('favoriteId')
      .sort({ date: 1 });
    
    console.log(`Found ${reminders.length} reminders`);
    return NextResponse.json({ success: true, data: reminders });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reminders', details: error.message },
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
    
    // Check if favorite exists
    console.log(`Checking if favorite exists with ID: ${body.favoriteId}`);
    const favorite = await Favorite.findById(body.favoriteId);
    if (!favorite) {
      console.log(`Favorite with ID ${body.favoriteId} not found`);
      return NextResponse.json(
        { success: false, error: 'Favorite not found' },
        { status: 404 }
      );
    }
    
    console.log(`Creating reminder for user: ${favorite.userId}`);
    const reminder = await Reminder.create({
      ...body,
      userId: favorite.userId,
    });
    console.log(`Reminder created with ID: ${reminder._id}`);
    
    return NextResponse.json({ success: true, data: reminder }, { status: 201 });
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create reminder', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, isCompleted } = body;
    
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database');
    
    console.log(`Updating reminder with ID: ${id}`);
    const reminder = await Reminder.findByIdAndUpdate(
      id,
      { isCompleted },
      { new: true }
    );
    
    if (!reminder) {
      console.log(`Reminder with ID ${id} not found`);
      return NextResponse.json(
        { success: false, error: 'Reminder not found' },
        { status: 404 }
      );
    }
    
    console.log(`Reminder updated: ${reminder._id}`);
    return NextResponse.json({ success: true, data: reminder });
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update reminder', details: error.message },
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
        { success: false, error: 'Reminder ID is required' },
        { status: 400 }
      );
    }
    
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database');
    
    console.log(`Deleting reminder with ID: ${id}`);
    const reminder = await Reminder.findByIdAndDelete(id);
    
    if (!reminder) {
      console.log(`Reminder with ID ${id} not found`);
      return NextResponse.json(
        { success: false, error: 'Reminder not found' },
        { status: 404 }
      );
    }
    
    console.log(`Reminder deleted: ${reminder._id}`);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete reminder', details: error.message },
      { status: 500 }
    );
  }
} 