"use client";

import dynamic from "next/dynamic";
import animationData from "@/public/pookie.json";
import { hindSiliguri, sriracha } from "@/lib/font";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GiBowTieRibbon } from "react-icons/gi";
import { FiGift } from "react-icons/fi";
import GiftModal from "./GiftModal";


const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => (
    <div className="w-[50%] aspect-square bg-gray-200/20 animate-pulse rounded-lg" />
  ),
});

const BowTie = ({
  className,
  delay,
  rotate,
  scale = 1,
}: {
  className: string;
  delay: number;
  rotate: number;
  scale?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale }}
    transition={{
      duration: 0.8,
      delay,
      ease: "easeOut",
    }}
    className={`absolute ${className}`}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    <GiBowTieRibbon />
  </motion.div>
);

export default function Landing() {
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-gradient-to-b p-5 from-pink-100 via-pink-200 to-pink-300 max-w-full min-h-screen flex flex-col items-center justify-start overflow-hidden relative">
      {/* Decorative Bow Ties */}
      <BowTie
        className="text-pink-300 text-4xl top-[5%] left-[10%]"
        delay={0.2}
        rotate={-15}
        scale={0.5}
      />
      <BowTie
        className="text-pink-400 text-5xl top-[10%] right-[5%]"
        delay={0.4}
        rotate={25}
        scale={0.5}
      />
      <BowTie
        className="text-pink-500 text-3xl bottom-[35%] left-[8%]"
        delay={0.6}
        rotate={-30}
        scale={0.8}
      />
      <BowTie
        className="text-pink-600/70 text-6xl bottom-[15%] right-[5%]"
        delay={0.8}
        rotate={45}
        scale={1.2}
      />
      <BowTie
        className="text-pink-400/50 text-7xl top-[45%] left-[3%]"
        delay={1}
        rotate={15}
        scale={0.8}
      />
      <BowTie
        className="text-pink-500/60 text-5xl top-[35%] right-[12%]"
        delay={1.2}
        rotate={-20}
        scale={0.7}
      />
      <BowTie
        className="text-pink-500/70 text-5xl bottom-[25%] left-[20%]"
        delay={1.2}
        rotate={-20}
        scale={0.7}
      />
      {/* New Bow Ties */}
      <BowTie
        className="text-pink-400/60 text-4xl top-[23%] left-[30%]"
        delay={1.3}
        rotate={35}
        scale={0.6}
      />
      <BowTie
        className="text-pink-500/50 text-6xl bottom-[40%] right-[25%]"
        delay={1.4}
        rotate={-25}
        scale={0.9}
      />
      <BowTie
        className="text-pink-300/70 text-5xl top-[60%] right-[15%]"
        delay={1.5}
        rotate={15}
        scale={0.7}
      />
      <BowTie
        className="text-pink-600/40 text-4xl bottom-[10%] left-[35%]"
        delay={1.6}
        rotate={-40}
        scale={0.6}
      />
      <BowTie
        className="text-pink-400/60 text-5xl top-[35%] left-[40%]"
        delay={1.7}
        rotate={20}
        scale={0.65}
      />

      <motion.div
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          duration: 1.2,
          ease: "easeOut",
        }}
        className={`${hindSiliguri.className} p-4 w-full text-3xl text-center md:text-4xl font-bold text-pink-600 tracking-normal
                    hover:scale-105 transition-transform duration-300 ease-in-out cursor-text
                    drop-shadow-lg relative z-10
                `}
      >
        "মিস্টার আনন্দ ২০২৫ উপলক্ষে 'পুকি' মার্কা প্রার্থী হামজা হামি এর পক্ষ থেকে নিজের উপহারটা বুঝে নিন!"
      </motion.div>

      <div className="w-full p-5 md:h-[90vh] flex flex-col-reverse md:flex-row items-center justify-start md:justify-around gap-8 relative z-10">
        <div className="flex flex-col items-center justify-center gap-0">
        <div className={`${sriracha.className} drop-shadow-lg text-2xl p-3 text-pink-600 font-bold w-full text-center text-nowrap`}>
            Vote Hamja, Your Mr.Ananda !!!
        </div>
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-[280px] h-[280px] md:w-[400px] md:h-[400px] relative group"
        >
          <img
            src="/hamza.jpg"
            alt="Hamza"
            className="w-full h-full rounded-full object-cover 
                            transition-all duration-300 ease-in-out
                            group-hover:scale-105 group-hover:shadow-xl
                            group-hover:shadow-pink-500/30
                            border-4 border-pink-200"
          />
          <div
            className="absolute inset-0 rounded-full ring-2 ring-pink-400/30 
                        group-hover:ring-4 group-hover:ring-pink-500/50
                        transition-all duration-300 ease-in-out"
          />
        </motion.div>
        </div>
        <div className="flex flex-col items-center justify-center gap-0">
           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setIsModalOpen(true)}
             className={`${sriracha.className} flex items-center gap-3 bg-pink-600 text-white text-xl md:text-2xl px-6 py-3 rounded-full 
               shadow-lg hover:shadow-xl hover:bg-pink-500 transition-all duration-300 relative z-10
               border-2 border-white/20 backdrop-blur-sm`}
           >
             <motion.div
               animate={{
                 y: [-2, 2, -2],
               }}
               transition={{
                 duration: 1.5,
                 repeat: Infinity,
                 ease: "easeInOut"
               }}
             >
               <FiGift className="text-2xl md:text-3xl" />
             </motion.div>
             Claim Your Gift
           </motion.button>
         
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-[280px] h-[280px] md:w-[400px] md:h-[400px]"
          >
            {mounted && (
              <Lottie animationData={animationData} className="w-full h-full" />
            )}
          </motion.div>
        </div>
      </div>

      <GiftModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
