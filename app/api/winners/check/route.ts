import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const winnersRef = collection(db, 'winners');
    const q = query(winnersRef, where('name', '==', name.trim()));
    const snapshot = await getDocs(q);
    
    return NextResponse.json({ 
      hasWon: !snapshot.empty,
      winner: !snapshot.empty ? {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      } : null
    });
  } catch (error) {
    console.error('Error checking winner:', error);
    return NextResponse.json({ error: 'Failed to check winner' }, { status: 500 });
  }
} 