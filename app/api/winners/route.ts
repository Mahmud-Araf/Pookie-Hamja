import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

// GET all winners
export async function GET() {
  try {
    const winnersRef = collection(db, 'winners');
    const snapshot = await getDocs(winnersRef);
    const winners = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({ winners });
  } catch (error) {
    console.error('Error fetching winners:', error);
    return NextResponse.json({ error: 'Failed to fetch winners' }, { status: 500 });
  }
}

// POST new winner
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const winnersRef = collection(db, 'winners');
    
    const docRef = await addDoc(winnersRef, {
      name: body.name,
      gift_id: body.gift_id,
      gift_name: body.gift_name,
      claimed_at: body.claimed_at
    });
    
    return NextResponse.json({ 
      message: 'Winner saved successfully',
      id: docRef.id 
    });
  } catch (error) {
    console.error('Error saving winner:', error);
    return NextResponse.json({ error: 'Failed to save winner' }, { status: 500 });
  }
}

// DELETE winner
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Winner ID is required' }, { status: 400 });
    }

    // First get the winner's data to know which gift to update
    const winnerRef = doc(db, 'winners', id);
    const winnerSnap = await getDoc(winnerRef);
    
    if (!winnerSnap.exists()) {
      return NextResponse.json({ error: 'Winner not found' }, { status: 404 });
    }

    const winnerData = winnerSnap.data();
    
    // Delete the winner
    await deleteDoc(winnerRef);
    
    // Update the gift count
    const giftRef = doc(db, 'gifts', winnerData.gift_id);
    const giftSnap = await getDoc(giftRef);
    
    if (giftSnap.exists()) {
      await updateDoc(giftRef, {
        current_count: Math.max(0, giftSnap.data().current_count - 1)
      });
    }
    
    return NextResponse.json({ 
      message: 'Winner deleted and gift count updated successfully',
      giftId: winnerData.gift_id
    });
  } catch (error) {
    console.error('Error deleting winner:', error);
    return NextResponse.json({ error: 'Failed to delete winner' }, { status: 500 });
  }
} 