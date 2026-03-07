import { useState, useRef, useEffect } from "react";
import { ChevronRight, Check } from "lucide-react";
import { motion } from "motion/react";

interface PaymentSwipeProps {
  onComplete: () => void;
  amount: number;
}

export function PaymentSwipe({ onComplete, amount }: PaymentSwipeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxPosition = useRef(0);

  useEffect(() => {
    if (containerRef.current) {
      maxPosition.current = containerRef.current.offsetWidth - 64; // 64px is button width
    }
  }, []);

  const handleDragEnd = () => {
    setIsDragging(false);
    
    // If dragged more than 80% of the way, complete
    if (position > maxPosition.current * 0.8) {
      setPosition(maxPosition.current);
      setIsCompleted(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    } else {
      // Reset to start
      setPosition(0);
    }
  };

  if (isCompleted) {
    return (
      <div className="relative bg-green-500 rounded-full h-16 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2 text-white"
        >
          <Check className="w-6 h-6" />
          <span className="font-bold text-lg">Payment Confirmed!</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-gradient-to-r from-orange-500 to-orange-600 rounded-full h-16 flex items-center overflow-hidden"
    >
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
        <motion.span
          animate={{ opacity: position > maxPosition.current * 0.5 ? 0 : 1 }}
        >
          Swipe to Pay ${amount.toFixed(2)}
        </motion.span>
      </div>

      {/* Progress Fill */}
      <motion.div
        className="absolute left-0 top-0 h-full bg-orange-700 rounded-full"
        style={{ width: position + 64 }}
        animate={{ opacity: position > 0 ? 1 : 0 }}
      />

      {/* Draggable Button */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: maxPosition.current }}
        dragElastic={0}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        onDrag={(_, info) => {
          setPosition(Math.max(0, Math.min(maxPosition.current, info.point.x - 32)));
        }}
        className="absolute left-0 w-16 h-16 bg-white rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg z-10"
        whileDrag={{ scale: 1.1 }}
      >
        <ChevronRight className="w-6 h-6 text-orange-600" />
      </motion.div>

      {/* Arrow hints */}
      <div className="absolute right-4 flex gap-1 pointer-events-none">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.3, 1, 0.3],
              x: [0, 5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
