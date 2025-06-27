import React, { useState, useEffect, useRef } from "react";
import { Consultation } from "@/entities/Consultation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, Save, FileText, Settings, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import ChatMessage from "../components/chat/ChatMessage";
import PatientInfoForm from "../components/chat/PatientInfoForm";
import DiagnosisPanel from "../components/chat/DiagnosisPanel";
import GPTSettings from "../components/chat/GPTSettings";
import MedicalDisclaimer from "../components/common/MedicalDisclaimer";

// Configuração da API OpenAI
const OPENAI_API_KEY = "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";
const USE_GPT4_DEFAULT = true; // Defina como false para usar o modelo gratuito por padrão

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentConsultation, setCurrentConsultation] = useState(null);
  const [showPatientForm, setShowPatientForm] = useState(true);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [gptSettings, setGptSettings] = useState({
    useGPT4: USE_GPT4_DEFAULT,
    apiKey: OPENAI_API_KEY
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startConsultation = async (patientData) => {
    const consultation = await Consultation.create({
      ...patientData,
      status: "em_andamento",
      chat_messages: []
    });
    
    setCurrentConsultation(consultation);
    setShowPatientForm(false);

    const welcomeMessage = {
      role: "assistant",
      content: `Olá! Sou o MedAssist, seu assistente de diagnóstico${gptSettings.useGPT4 ? ' (GPT-4)' : ' (Modelo Gratuito)'}. Vou ajudá-lo a conduzir a anamnese de ${patientData.patient_name}. Vamos começar com a queixa principal. O que o paciente está sentindo?`,
      timestamp: new Date().toISOString()
    };

    setMessages([welcomeMessage]);
  };

  const callGPT4 = async (prompt) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gptSettings.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente médico especializado em anamnese. Conduza uma entrevista médica profissional e estruturada em português do Brasil. Seja empático, faça perguntas específicas e relevantes sobre sintomas, duração, intensidade e fatores associados.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API OpenAI: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const conversationHistory = newMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
      
      const prompt = `Você é um assistente médico especializado em anamnese. Conduza uma entrevista médica profissional e estruturada.

Paciente: ${currentConsultation?.patient_name}, ${currentConsultation?.patient_age} anos, ${currentConsultation?.patient_gender}

Histórico da conversa:
${conversationHistory}

INSTRUÇÕES IMPORTANTES:
1. Responda de forma OBJETIVA e em TÓPICOS
2. Use bullets (•) para organizar informações
3. Seja conciso e direto
4. Foque nas perguntas mais relevantes clinicamente
5. Quando necessário, organize em seções como:
   - Sintomas principais
   - Duração e características
   - Fatores associados
   - Perguntas de seguimento

Exemplo de formato de resposta:
• Sintoma relatado: [descrição]
• Próximas perguntas importantes:
  - Há quanto tempo isso começou?
  - A dor piora com alguma atividade?
  - Existem outros sintomas associados?

Responda de forma estruturada e prática para facilitar a consulta médica:`;

      let response;
      if (gptSettings.useGPT4 && gptSettings.apiKey) {
        response = await callGPT4(prompt);
      } else {
        // Fallback para o sistema integrado com sites específicos
        const { InvokeLLM } = await import("@/integrations/Core");
        response = await InvokeLLM({
          prompt: prompt,
          add_context_from_internet: true // Isso busca em fontes médicas confiáveis
        });
      }

      const assistantMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);

      // Atualizar consulta no banco
      await Consultation.update(currentConsultation.id, {
        chat_messages: updatedMessages
      });

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage = {
        role: "assistant",
        content: "• Erro temporário no sistema\n• Tente novamente em alguns instantes\n• Se persistir, verifique sua conexão",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const generateDiagnosis = async () => {
    setIsLoading(true);
    
    try {
      const conversationText = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
      
      const prompt = `Analise esta anamnese médica e forneça uma análise completa em formato de tópicos estruturados:

Paciente: ${currentConsultation?.patient_name}, ${currentConsultation?.patient_age} anos, ${currentConsultation?.patient_gender}

Conversa da anamnese:
${conversationText}

FORMATO OBRIGATÓRIO - Responda em JSON estruturado com:
{
  "diagnoses": [
    {
      "diagnosis": "Nome do diagnóstico",
      "confidence": 85,
      "reasoning": "• Sintoma X presente\n• Idade compatível\n• Histórico sugere\n• Exame físico necessário para confirmar"
    }
  ],
  "symptoms_summary": "• Sintoma principal: [descrição]\n• Sintomas associados: [lista]\n• Duração: X dias/semanas\n• Intensidade: [escala]\n• Fatores agravantes/atenuantes",
  "recommendations": "• Conduta imediata sugerida\n• Medicações a considerar\n• Orientações ao paciente\n• Retorno em X dias",
  "refining_questions": [
    "Pergunta específica sobre sintoma X?",
    "Histórico familiar de Y?",
    "Uso de medicação Z?"
  ],
  "suggested_exams": [
    {
      "exam": "Nome do exame",
      "reason": "• Para confirmar diagnóstico X\n• Descartar complicação Y\n• Avaliar função Z",
      "priority": "alta"
    }
  ],
  "urgency_level": "media"
}

Use formato de tópicos em TODOS os campos de texto para facilitar a leitura médica.`;

      let response;
      if (gptSettings.useGPT4 && gptSettings.apiKey) {
        const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${gptSettings.apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: 'Você é um assistente médico especializado. Responda sempre em formato de tópicos organizados para facilitar a leitura clínica.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            response_format: { type: "json_object" },
            max_tokens: 1500,
            temperature: 0.3
          })
        });

        if (!gptResponse.ok) {
          throw new Error(`Erro na API OpenAI: ${gptResponse.status}`);
        }

        const gptData = await gptResponse.json();
        response = JSON.parse(gptData.choices[0].message.content);
      } else {
        const { InvokeLLM } = await import("@/integrations/Core");
        response = await InvokeLLM({
          prompt: prompt,
          add_context_from_internet: true, // Usa fontes médicas confiáveis
          response_json_schema: {
            type: "object",
            properties: {
              diagnoses: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    diagnosis: { type: "string" },
                    confidence: { type: "number" },
                    reasoning: { type: "string" }
                  }
                }
              },
              symptoms_summary: { type: "string" },
              recommendations: { type: "string" },
              refining_questions: {
                type: "array",
                items: { type: "string" }
              },
              suggested_exams: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    exam: { type: "string" },
                    reason: { type: "string" },
                    priority: { type: "string" }
                  }
                }
              },
              urgency_level: { type: "string" }
            }
          }
        });
      }

      await Consultation.update(currentConsultation.id, {
        suggested_diagnoses: response.diagnoses,
        symptoms_summary: response.symptoms_summary,
        recommendations: response.recommendations,
        refining_questions: response.refining_questions,
        suggested_exams: response.suggested_exams,
        urgency_level: response.urgency_level,
        status: "concluida"
      });

      setCurrentConsultation(prev => ({
        ...prev,
        ...response
      }));

      setShowDiagnosis(true);

    } catch (error) {
      console.error("Erro ao gerar diagnóstico:", error);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const endConsultation = () => {
    // Reset all consultation-related state to go back to the patient info form
    setMessages([]);
    setInputValue("");
    setIsLoading(false);
    setCurrentConsultation(null);
    setShowPatientForm(true);
    setShowDiagnosis(false); // Close diagnosis panel if it was open
  };

  if (showPatientForm) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="w-full max-w-md relative">
          <div className="absolute top-4 right-4">
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Settings className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configurações de IA</DialogTitle>
                </DialogHeader>
                <GPTSettings 
                  settings={gptSettings}
                  onSettingsChange={setGptSettings}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Medical Disclaimer */}
          <MedicalDisclaimer variant="compact" className="mb-6" />
          
          <PatientInfoForm onSubmit={startConsultation} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="border-b border-slate-200 p-6 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Anamnese - {currentConsultation?.patient_name}
                {gptSettings.useGPT4 && <span className="text-sm text-green-600 ml-2">(GPT-4)</span>}
              </h1>
              <p className="text-slate-500 mt-1">
                {currentConsultation?.patient_age} anos • {currentConsultation?.patient_gender}
              </p>
            </div>
            <div className="flex gap-3">
              {/* New "Nova Anamnese" button */}
              <Button
                onClick={endConsultation}
                variant="outline"
                disabled={isLoading} // Disable while any LLM operation is in progress
              >
                <Home className="w-4 h-4 mr-2" />
                Nova Anamnese
              </Button>

              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configurações de IA</DialogTitle>
                  </DialogHeader>
                  <GPTSettings 
                    settings={gptSettings}
                    onSettingsChange={setGptSettings}
                  />
                </DialogContent>
              </Dialog>
              
              <Button
                onClick={generateDiagnosis}
                disabled={isLoading || messages.length < 4}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Gerar Diagnóstico
              </Button>
            </div>
          </div>

          {/* Add disclaimer in chat header */}
          <MedicalDisclaimer variant="compact" className="mt-4" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
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

        {/* Input */}
        <div className="border-t border-slate-200 p-6 bg-white">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua resposta ou observação..."
              className="flex-1 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Diagnosis Panel */}
      {showDiagnosis && (
        <DiagnosisPanel 
          consultation={currentConsultation}
          onClose={() => setShowDiagnosis(false)}
        />
      )}
    </div>
  );
