import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronDown, ChevronUp, User, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatHistory({ consultation }) {
  const [isExpanded, setIsExpanded] = useState(true); // Mudado para true para mostrar por padrão

  if (!consultation.chat_messages || consultation.chat_messages.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            Histórico da Anamnese
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-center py-8">
            Nenhuma conversa registrada para esta consulta.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            Histórico da Anamnese ({consultation.chat_messages.length} mensagens)
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-xl"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Recolher
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Expandir
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {consultation.chat_messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-3 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
                      <Stethoscope className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-2xl ${message.role === "assistant" ? "order-1" : "order-2"}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        message.role === "assistant"
                          ? "bg-slate-100 text-slate-900"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                      }`}
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {/* Renderizar tópicos de forma mais clara */}
                        {message.content.split('\n').map((line, lineIndex) => {
                          if (line.trim().startsWith('•')) {
                            return (
                              <div key={lineIndex} className="flex items-start gap-2 my-1">
                                <span className="text-blue-500 font-bold">•</span>
                                <span>{line.replace('•', '').trim()}</span>
                              </div>
                            );
                          }
                          return line && <p key={lineIndex} className="my-1">{line}</p>;
                        })}
                      </div>
                    </div>
                    <p className={`text-xs mt-1 ${
                      message.role === "assistant" ? "text-slate-400" : "text-slate-500 text-right"
                    }`}>
                      {format(new Date(message.timestamp), "HH:mm")}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm order-3">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
