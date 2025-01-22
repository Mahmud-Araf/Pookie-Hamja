"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiGift, FiX } from "react-icons/fi";
import giftData from "@/data/gifts.json";
import Image from "next/image";
import { sriracha } from "@/lib/font";

interface Gift {
  item_name: string;
  probability: number;
  total_count: number;
  current_count: number;
  image_url: string;
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

  useEffect(() => {
    const claim = localStorage.getItem("claim");
    if (claim) {
      setIsClaimed(true);
    }
  }, []);

  const selectRandomGift = () => {
    const availableGifts = giftData.gifts.filter(
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
        gift.current_count++;
        return gift;
      }
    }

    return availableGifts[0];
  };

  const handleBoxClick = () => {
    if (!isRevealed) {
      const gift = selectRandomGift();
      setSelectedGift(gift);
      setIsRevealed(true);
    }
  };

  const handleClose = () => {
    if (!isRevealed) {
      setIsNameEntered(false);
      setName("");
    }
    else {
        setIsClaimed(true);
        localStorage.setItem("claim", "true");
    }
    
    onClose();
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setIsNameEntered(true);
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
                <p
                  className={`${sriracha.className} text-xl font-bold text-pink-600 mb-2`}
                >
                  Naughty Pookie !!!
                </p>
                <p
                  className={`${sriracha.className} text-lg font-bold text-slate-600 mb-2 text-center`}
                >
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
                    <h3
                      className={`${sriracha.className} text-xl text-pink-600 text-center text-ellipsis font-bold mb-4`}
                    >
                      Click to know your gift, {name}!
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        rotate: [0, -10, 10, -10, 10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      onClick={handleBoxClick}
                      className="w-32 h-32 bg-pink-600 rounded-lg flex items-center justify-center text-white cursor-pointer"
                    >
                      <FiGift size={64} />
                    </motion.button>
                    <h3
                      className={`${sriracha.className} text-xl text-pink-600 text-center text-ellipsis font-bold mb-4`}
                    >
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
                        <h3
                          className={`${sriracha.className} text-xl font-bold text-pink-600`}
                        >
                          Congratulations {name} !
                        </h3>
                        <div className="w-40 h-40 relative mx-auto mb-2">
                          <Image
                            src={selectedGift.image_url}
                            alt={selectedGift.item_name}
                            fill
                            className="object-contain"
                          />
                        </div>

                        <p
                          className={`${sriracha.className} text-xl font-bold text-slate-600 mb-2`}
                        >
                          {" "}
                          You won {selectedGift.item_name}!
                        </p>
                        <h3
                          className={`${sriracha.className} text-xl font-bold text-pink-600 mb-2`}
                        >
                          Vote Pookie ! Vote Hamja Hami !
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
