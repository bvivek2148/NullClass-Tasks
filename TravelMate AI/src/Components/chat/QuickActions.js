import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/Components/ui/button.jsx";
import { MapPin, Calendar, HelpCircle, BookOpen } from 'lucide-react';

const suggestions = [
  { icon: MapPin, text: "Find routes", prompt: "Show me available routes", gradient: "from-blue-500 to-blue-600" },
  { icon: Calendar, text: "Book a trip", prompt: "I want to book a trip", gradient: "from-purple-500 to-purple-600" },
  { icon: BookOpen, text: "Check my bookings", prompt: "What are my current bookings?", gradient: "from-green-500 to-green-600" },
  { icon: HelpCircle, text: "Get help", prompt: "I need help with my booking", gradient: "from-orange-500 to-orange-600" }
];

export default function QuickActions({ onSelectAction }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className="h-auto py-6 px-5 flex flex-col items-center gap-3 hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 hover:border-purple-300 transition-all duration-300 w-full group rounded-2xl"
              onClick={() => onSelectAction(suggestion.prompt)}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${suggestion.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-700">{suggestion.text}</span>
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}