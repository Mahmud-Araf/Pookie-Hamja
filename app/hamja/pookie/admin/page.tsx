"use client";

import { sriracha } from "@/lib/font";
import { useState, useEffect } from "react";
import { FiTrash2, FiGift, FiUsers } from "react-icons/fi";

interface Winner {
  id: string;
  name: string;
  gift_name: string;
  claimed_at: string;
}

interface Gift {
  id: string;
  item_name: string;
  probability: number;
  total_count: number;
  current_count: number;
  image_url: string;
}

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isLoadingWinners, setIsLoadingWinners] = useState(false);
  const [activeTab, setActiveTab] = useState<'items' | 'winners'>('items');

  const fetchGifts = async () => {
    try {
      const response = await fetch('/api/gifts');
      if (!response.ok) throw new Error('Failed to fetch gifts');
      const data = await response.json();
      setGifts(data.gifts);
    } catch (error: unknown) {
      console.error('Fetch error:', error);
      if (error instanceof Error) {
        setMessage("Error fetching gifts: " + error.message);
      } else {
        setMessage("Error fetching gifts: An unknown error occurred");
      }
    }
  };

  const fetchWinners = async () => {
    setIsLoadingWinners(true);
    try {
      const response = await fetch('/api/winners');
      if (!response.ok) throw new Error('Failed to fetch winners');
      const data = await response.json();
      setWinners(data.winners);
    } catch (error) {
      console.error('Failed to fetch winners:', error);
    } finally {
      setIsLoadingWinners(false);
    }
  };

  useEffect(() => {
    fetchGifts();
    fetchWinners();
  }, []);

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset all gifts and winners?")) return;
    
    setIsLoading(true);
    setMessage("");
    
    try {
      console.log("Starting reset...");
      const response = await fetch('/api/gifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log("Response:", { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to reset');
      }
      
      setMessage("Gifts and winners reset successfully!");
      await Promise.all([fetchGifts(), fetchWinners()]); // Refresh both lists
    } catch (error: unknown) {
      console.error('Reset error:', error);
      if (error instanceof Error) {
        setMessage("Error resetting: " + error.message);
      } else {
        setMessage("Error resetting: An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWinner = async (winnerId: string) => {
    if (!confirm('Are you sure you want to delete this winner?')) return;

    try {
      const response = await fetch(`/api/winners?id=${winnerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete winner');
      
      const data = await response.json();
      
      // Update winners list
      setWinners(prev => prev.filter(w => w.id !== winnerId));
      
      // Update gift count in the gifts list
      if (data.giftId) {
        setGifts(prev => prev.map(gift => 
          gift.id === data.giftId 
            ? { ...gift, current_count: Math.max(0, gift.current_count - 1) }
            : gift
        ));
      }
    } catch (error) {
      console.error('Failed to delete winner:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-pink-200 to-pink-300 p-8">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
        <h1 className={`${sriracha.className} text-3xl text-pink-600 font-bold`}>
          Admin Panel
        </h1>
        
        {/* Tab Buttons */}
        <div className="flex gap-4 bg-white rounded-lg p-2 shadow-md">
          <button
            onClick={() => setActiveTab('items')}
            className={`${sriracha.className} flex items-center gap-2 px-6 py-3 rounded-lg transition-colors
              ${activeTab === 'items' 
                ? 'bg-pink-600 text-white' 
                : 'text-pink-600 hover:bg-pink-50'}`}
          >
            <FiGift size={20} />
            Items
          </button>
          <button
            onClick={() => setActiveTab('winners')}
            className={`${sriracha.className} flex items-center gap-2 px-6 py-3 rounded-lg transition-colors
              ${activeTab === 'winners' 
                ? 'bg-pink-600 text-white' 
                : 'text-pink-600 hover:bg-pink-50'}`}
          >
            <FiUsers size={20} />
            Winners
          </button>
        </div>

        {activeTab === 'items' ? (
          <>
            <button
              onClick={handleReset}
              disabled={isLoading}
              className={`${sriracha.className} bg-pink-600 text-white px-6 py-3 rounded-lg
                hover:bg-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? "Resetting..." : "Reset All Gifts"}
            </button>

            {message && (
              <p className={`${sriracha.className} text-lg ${
                message.includes("success") ? "text-green-600" : "text-red-600"
              }`}>
                {message}
              </p>
            )}

            <div className="w-full bg-white rounded-lg p-6 shadow-lg">
              <h2 className={`${sriracha.className} text-2xl text-pink-600 font-bold mb-4`}>
                Current Gifts ({gifts.length})
              </h2>
              <div className="grid gap-4">
                {gifts.map((gift) => (
                  <div key={gift.id} 
                    className="flex justify-between items-center border p-4 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
                    <div>
                      <h3 className="text-xl font-bold text-pink-600">{gift.item_name}</h3>
                      <p className="text-gray-600">
                        Claimed: {gift.current_count} / {gift.total_count}
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-pink-500">
                      {((gift.current_count / gift.total_count) * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full bg-white rounded-lg p-6 shadow-lg">
            <h2 className={`${sriracha.className} text-2xl text-pink-600 font-bold mb-4`}>
              Winners ({winners.length})
            </h2>
            <div className="grid gap-4">
              {winners.map((winner) => (
                <div key={winner.id} 
                  className="flex justify-between items-center border p-4 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
                  <div>
                    <h3 className="text-xl font-bold text-pink-600">{winner.name}</h3>
                    <p className="text-gray-600">Won: {winner.gift_name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(winner.claimed_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteWinner(winner.id)}
                    className="text-pink-600 hover:text-pink-700 p-2"
                    title="Delete winner"
                  >
                    <FiTrash2 size={24} />
                  </button>
                </div>
              ))}
              {winners.length === 0 && (
                <p className="text-gray-500 text-center py-8">No winners yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 