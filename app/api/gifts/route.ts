import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import giftData from '@/data/gifts.json';

// GET all gifts
export async function GET() {
  try {
    const giftsRef = collection(db, 'gifts');
    const snapshot = await getDocs(giftsRef);
    const gifts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({ gifts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gifts' }, { status: 500 });
  }
}

// POST initial gifts data
export async function POST(request: Request) {
  try {
    console.log('Starting reset process...');
    const giftsRef = collection(db, 'gifts');
    
    // Delete all existing documents first
    console.log('Fetching existing documents...');
    const snapshot = await getDocs(giftsRef);
    console.log(`Found ${snapshot.docs.length} documents to delete`);
    
    const deletePromises = snapshot.docs.map(doc => {
      console.log(`Deleting document ${doc.id}...`);
      return deleteDoc(doc.ref);
    });
    await Promise.all(deletePromises);
    console.log('All documents deleted');
    
    // Add gifts from gifts.json with their specific IDs
    console.log('Adding new documents...');
    const addPromises = giftData.gifts.map(gift => {
      console.log(`Adding gift: ${gift.item_name}`);
      return setDoc(doc(giftsRef, gift.id), {
        item_name: gift.item_name,
        probability: gift.probability,
        total_count: gift.total_count,
        current_count: 0,
        image_url: gift.image_url
      });
    });
    
    await Promise.all(addPromises);
    console.log('All documents added successfully');
    
    return NextResponse.json({ message: 'Gifts reset successfully' });
  } catch (error) {
    console.error('Error in POST /api/gifts:', error);
    return NextResponse.json({ 
      error: 'Failed to reset gifts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT update gift count
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { giftId } = body;
    
    const giftRef = doc(db, 'gifts', giftId);
    await updateDoc(giftRef, {
      current_count: body.current_count
    });
    
    return NextResponse.json({ message: 'Gift updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update gift' }, { status: 500 });
  }
} 