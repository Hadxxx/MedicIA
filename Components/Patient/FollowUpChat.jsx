import React, { useState, useEffect, useRef } from "react";
import { Consultation } from "@/entities/Consultation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, Sparkles, Settings } from "lucide-react";
import ChatMessage from "../chat/ChatMessage";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import GPTSettings from "../chat/GPTSettings";

export default function FollowUpChat({ consultation, onUpdate, gptSettings, onSettingsChange }) {
  const [messages, setMessages] = useState(consultation.follow_up_chat || []);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const conversationHistory = newMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
      const consultationSummary = JSON.stringify(
        {
          patient_info: { name: consultation.patient_name, age: consultation.patient_age, gender: consultation.patient_gender },
          complaint: consultation.chief_complaint,
          symptoms: consultation.symptoms_summary,
          diagnoses: consultation.suggested_diagnoses,
          exams: consultation.suggested_exams,
          recommendations: consultation.recommendations,
        },
        null,
        2
      );

      const prompt = `Você é um assistente médico respondendo a perguntas de acompanhamento de um médico.
Contexto da Consulta:
${consultationSummary}

Histórico da conversa de acompanhamento:
${conversationHistory}

Pergunta do Médico: ${inputValue}

Instruções:
- Forneça respostas concisas e informativas baseadas estritamente no contexto fornecido.
- Se a informação não estiver disponível, informe que não pode responder com base nos dados atuais.
- Aja como um consultor especialista para o médico.

Resposta:`;

      let responseContent;
      if (gptSettings.useGPT4 && gptSettings.apiKey) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${gptSettings.apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{ role: 'system', content: prompt }],
            max_tokens: 500,
            temperature: 0.5
          })
        });
        if (!response.ok) throw new Error(`Erro na API OpenAI: ${response.status}`);
        const data = await response.json();
        responseContent = data.choices[0].message.content;
      } else {
        const { InvokeLLM } = await import("@/integrations/Core");
        responseContent = await InvokeLLM({ prompt });
      }

      const assistantMessage = {
        role: "assistant",
        content: responseContent,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);

      await Consultation.update(consultation.id, { follow_up_chat: updatedMessages });
      onUpdate({ follow_up_chat: updatedMessages });

    } catch (error) {
      console.error("Erro ao enviar mensagem de acompanhamento:", error);
      const errorMessage = {
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Chat de Acompanhamento
            {gptSettings.useGPT4 && <span className="text-sm text-green-600 ml-2">(GPT-4)</span>}
          </CardTitle>
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configurações de IA
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configurações de IA</DialogTitle>
              </DialogHeader>
              <GPTSettings 
                settings={gptSettings}
                onSettingsChange={onSettingsChange}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 border rounded-xl bg-slate-50/50">
            <AnimatePresence>
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-slate-100 rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="mt-4 flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pergunte algo sobre este caso..."
              className="flex-1 rounded-xl"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
