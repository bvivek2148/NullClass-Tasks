import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/Components/ui/button.jsx";
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils/index.js";

export default function ChatWidget() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link to={createPageUrl("Chat")}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            size="lg"
            className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 relative"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute inset-0 rounded-full bg-purple-400 opacity-20"
            />
            <MessageCircle className="h-7 w-7 relative z-10" />
          </Button>
        </motion.div>
      </Link>
    </motion.div>
  );
}