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
    const winnersRef = collection(db, 'winners');
    
    // Delete all existing winners first
    console.log('Fetching existing winners...');
    const winnersSnapshot = await getDocs(winnersRef);
    console.log(`Found ${winnersSnapshot.docs.length} winners to delete`);
    
    const deleteWinnersPromises = winnersSnapshot.docs.map(doc => {
      console.log(`Deleting winner ${doc.id}...`);
      return deleteDoc(doc.ref);
    });
    await Promise.all(deleteWinnersPromises);
    console.log('All winners deleted');
    
    // Delete all existing gifts
    console.log('Fetching existing gifts...');
    const giftsSnapshot = await getDocs(giftsRef);
    console.log(`Found ${giftsSnapshot.docs.length} gifts to delete`);
    
    const deleteGiftsPromises = giftsSnapshot.docs.map(doc => {
      console.log(`Deleting gift ${doc.id}...`);
      return deleteDoc(doc.ref);
    });
    await Promise.all(deleteGiftsPromises);
    console.log('All gifts deleted');
    
    // Add new gifts from gifts.json
    console.log('Adding new gifts...');
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
    
    return NextResponse.json({ message: 'Gifts and winners reset successfully' });
  } catch (error) {
    console.error('Error in POST /api/gifts:', error);
    return NextResponse.json({ 
      error: 'Failed to reset gifts and winners',
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