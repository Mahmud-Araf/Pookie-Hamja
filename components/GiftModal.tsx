"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiGift, FiX, FiLoader } from "react-icons/fi";
import Image from "next/image";
import { sriracha } from "@/lib/font";

interface Gift {
  item_name: string;
  probability: number;
  total_count: number;
  current_count: number;
  image_url: string;
  id: string;
}

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GiftModal({ isOpen, onClose }: GiftModalProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [name, setName] = useState("");
  const [isNameEntered, setIsNameEntered] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);

  // Fetch gifts on mount
  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await fetch('/api/gifts');
        const data = await response.json();
        setGifts(data.gifts);
      } catch (error) {
        console.error('Failed to fetch gifts:', error);
      }
    };

    fetchGifts();
  }, []);

  const selectRandomGift = async () => {
    const availableGifts = gifts.filter(
      (gift) => gift.current_count < gift.total_count
    );

    if (availableGifts.length === 0) return null;

    const totalProbability = availableGifts.reduce(
      (sum, gift) => sum + gift.probability,
      0
    );
    
    let random = Math.random() * totalProbability;
    
    for (const gift of availableGifts) {
      random -= gift.probability;
      if (random <= 0) {
        // Update gift count in Firebase
        try {
          await fetch('/api/gifts', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              giftId: gift.id,
              current_count: gift.current_count + 1
            }),
          });
          
          // Update local state
          setGifts(prevGifts =>
            prevGifts.map(g =>
              g.id === gift.id
                ? { ...g, current_count: g.current_count + 1 }
                : g
            )
          );
          
          return gift;
        } catch (error) {
          console.error('Failed to update gift count:', error);
          return null;
        }
      }
    }
    
    return availableGifts[0];
  };

  const handleBoxClick = async () => {
    if (!isRevealed && !isRevealing) {
      setIsRevealing(true);
      try {
        const gift = await selectRandomGift();
        if (gift) {
          try {
            await fetch('/api/winners', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name,
                gift_id: gift.id,
                gift_name: gift.item_name,
                claimed_at: new Date().toISOString(),
              }),
            });
          } catch (error) {
            console.error('Failed to save winner:', error);
          }
        }
        setSelectedGift(gift);
        setIsRevealed(true);
      } catch (error) {
        console.error('Error revealing gift:', error);
      } finally {
        setIsRevealing(false);
      }
    }
  };

  const handleClose = () => {
    if (!isRevealed) {
      setIsNameEntered(false);
      setName("");
    } else {
      setIsClaimed(true);
    }
    
    onClose();
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      try {
        // Check if user has already won
        const response = await fetch(`/api/winners/check?name=${encodeURIComponent(name.trim())}`);
        const data = await response.json();
        
        if (data.hasWon) {
          setIsClaimed(true);
        } else {
          setIsNameEntered(true);
        }
      } catch (error) {
        console.error('Failed to check winner status:', error);
        setIsNameEntered(true); // Allow to continue if check fails
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-white rounded-2xl p-8 m-4 max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
            {isClaimed ? (
              <div className="flex flex-col items-center gap-6">
                <p className={`${sriracha.className} text-xl font-bold text-pink-600 mb-2`}>
                  Naughty Pookie !!!
                </p>
                <p className={`${sriracha.className} text-lg font-bold text-slate-600 mb-2 text-center`}>
                  You have already claimed your gift !
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                {!isNameEntered ? (
                  <motion.form
                    onSubmit={handleNameSubmit}
                    className="w-full space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <h3
                      className={`${sriracha.className} text-2xl text-pink-600 text-center font-bold`}
                    >
                      Enter Your Name
                    </h3>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-2 border-pink-200 text-slate-700 focus:border-pink-500 focus:outline-none"
                      placeholder="Your name..."
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-500 transition-colors"
                    >
                      Continue
                    </button>
                  </motion.form>
                ) : !isRevealed ? (
                  <>
                    <h3 className={`${sriracha.className} text-xl text-pink-600 text-center text-ellipsis font-bold mb-4`}>
                      Click to know your gift, {name}!
                    </h3>
                    <motion.button
                      whileHover={{ scale: isRevealing ? 1 : 1.05 }}
                      whileTap={{ scale: isRevealing ? 1 : 0.95 }}
                      animate={isRevealing ? {} : {
                        rotate: [0, -10, 10, -10, 10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      onClick={handleBoxClick}
                      disabled={isRevealing}
                      className={`w-32 h-32 bg-pink-600 rounded-lg flex items-center justify-center text-white
                        ${isRevealing ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                    >
                      {isRevealing ? (
                        <FiLoader size={64} className="animate-spin" />
                      ) : (
                        <FiGift size={64} />
                      )}
                    </motion.button>
                    <h3 className={`${sriracha.className} text-xl text-pink-600 text-center text-ellipsis font-bold mb-4`}>
                      Don't forget to take a screenshot!
                    </h3>
                  </>
                ) : (
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 360 }}
                    className="text-center"
                  >
                    {selectedGift ? (
                      <>
                        <h3 className={`${sriracha.className} text-xl font-bold text-pink-600`}>
                          Congratulations {name}!
                        </h3>
                        <div className="w-40 h-40 relative mx-auto mb-2">
                          <Image
                            src={selectedGift.image_url}
                            alt={selectedGift.item_name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p className={`${sriracha.className} text-xl font-bold text-slate-600 mb-2`}>
                          You won {selectedGift.item_name}!
                        </p>
                        <h3 className={`${sriracha.className} text-xl font-bold text-pink-600 mb-2`}>
                          Vote Pookie! Vote Hamja Hami!
                        </h3>
                      </>
                    ) : (
                      <p className={`${sriracha.className} text-gray-600 text-center text-xl p-3 w-full`}>
                        Sorry {name}, all gifts have been claimed!
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}