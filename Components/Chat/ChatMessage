import React from "react";
import { motion } from "framer-motion";
import { User, Stethoscope } from "lucide-react";
import { format } from "date-fns";

export default function ChatMessage({ message }) {
  const isAssistant = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 ${isAssistant ? "justify-start" : "justify-end"}`}
    >
      {isAssistant && (
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-md">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-2xl ${isAssistant ? "order-1" : "order-2"}`}>
        <div
          className={`rounded-2xl px-6 py-4 shadow-sm ${
            isAssistant
              ? "bg-white border border-slate-200 text-slate-900"
              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        <p className={`text-xs mt-2 ${isAssistant ? "text-slate-400" : "text-slate-500 text-right"}`}>
          {format(new Date(message.timestamp), "HH:mm")}
        </p>
      </div>

      {!isAssistant && (
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md order-3">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </motion.div>
  );
}
