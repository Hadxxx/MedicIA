
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Consultation } from "@/entities/Consultation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User, Calendar, Phone, Mail, FileText, Save, MessageCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

import ChatHistory from "../components/patient/ChatHistory";
import DiagnosisSection from "../components/patient/DiagnosisSection";
import ExamsSection from "../components/patient/ExamsSection";
import FollowUpChat from "../components/patient/FollowUpChat"; // New import
import MedicalDisclaimer from "../components/common/MedicalDisclaimer";

// Definindo as constantes aqui também para que a página funcione de forma independente
const OPENAI_API_KEY = "sk-proj-6XbEUu7Ba3fA_ZxZR0Ru0KMpEUbt9ch5O7vOjnCKtHtcTrPaGeKytGIU-si7UChZU1qNSJ6T3BlbkFJ99QOH7UplCcFrQX67n2R9yk3z9Vq6iaMIl4ksIPSpIYyk6ztSo2HmLoJ5CQ0v3mjM-BLhBEi4A"; // This is a placeholder key and should be replaced with a real, securely managed key.
const USE_GPT4_DEFAULT = true; 

export default function PatientDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // Adicionando estado para as configurações de IA
  const [gptSettings, setGptSettings] = useState({
    useGPT4: USE_GPT4_DEFAULT,
    apiKey: OPENAI_API_KEY
  });

  const consultationId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    loadConsultation();
  }, [consultationId]);

  const loadConsultation = async () => {
    if (!consultationId) {
      navigate(createPageUrl("History"));
      return;
    }

    setIsLoading(true);
    try {
      const consultations = await Consultation.list();
      const found = consultations.find(c => c.id === consultationId);
      if (found) {
        setConsultation(found);
        setDoctorNotes(found.doctor_notes || "");
        setStatus(found.status || "em_andamento");
      } else {
        navigate(createPageUrl("History"));
      }
    } catch (error) {
      console.error("Erro ao carregar consulta:", error);
      navigate(createPageUrl("History"));
    }
    setIsLoading(false);
  };

  const handleConsultationUpdate = (updatedData) => {
    setConsultation(prev => ({...prev, ...updatedData}));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Consultation.update(consultation.id, {
        doctor_notes: doctorNotes,
        status: status
      });
      
      setConsultation(prev => ({
        ...prev,
        doctor_notes: doctorNotes,
        status: status
      }));
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
    setIsSaving(false);
  };

  const getStatusColor = (currentStatus) => {
    switch (currentStatus) {
      case "concluida":
        return "bg-green-100 text-green-800 border-green-200";
      case "em_andamento":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "revisao":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "aguardando_exames":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "alta":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (currentStatus) => {
    switch (currentStatus) {
      case "concluida": return "Concluída";
      case "em_andamento": return "Em Andamento";
      case "revisao": return "Em Revisão";
      case "aguardando_exames": return "Aguardando Exames";
      case "alta": return "Alta";
      default: return currentStatus;
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "urgente":
        return "bg-red-100 text-red-800 border-red-200";
      case "alta":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baixa":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <Card className="text-center p-8">
          <CardContent>
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Consulta não encontrada</h2>
            <p className="text-slate-500 mb-4">A consulta solicitada não foi localizada.</p>
            <Button onClick={() => navigate(createPageUrl("History"))}>
              Voltar ao Histórico
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(createPageUrl("History"))}
                className="hover:bg-slate-100 rounded-xl"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {consultation.patient_name}
                </h1>
                <p className="text-slate-500">
                  {consultation.patient_age} anos • {consultation.patient_gender}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(consultation.status)} border`}>
                {getStatusText(consultation.status)}
              </Badge>
              {consultation.urgency_level && (
                <Badge className={`${getUrgencyColor(consultation.urgency_level)} border`}>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {consultation.urgency_level}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Medical Disclaimer */}
        <MedicalDisclaimer className="mb-8" />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Patient Info & Controls */}
          <div className="space-y-6">
            {/* Patient Info */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Informações do Paciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">Data da Consulta</p>
                      <p className="font-medium text-slate-900">
                        {format(new Date(consultation.created_date), "dd/MM/yyyy 'às' HH:mm")}
                      </p>
                    </div>
                  </div>
                  
                  {consultation.patient_phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500">Telefone</p>
                        <p className="font-medium text-slate-900">{consultation.patient_phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {consultation.patient_email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500">Email</p>
                        <p className="font-medium text-slate-900">{consultation.patient_email}</p>
                      </div>
                    </div>
                  )}
                </div>

                {consultation.chief_complaint && (
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-500 mb-2">Queixa Principal</p>
                    <p className="text-slate-900">{consultation.chief_complaint}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Control */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900">
                  Controle da Consulta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Status da Consulta
                  </label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                      <SelectItem value="revisao">Em Revisão</SelectItem>
                      <SelectItem value="aguardando_exames">Aguardando Exames</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Anotações do Médico
                  </label>
                  <Textarea
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    placeholder="Adicione suas observações sobre o caso..."
                    className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
                  />
                </div>

                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Diagnosis Section */}
            <DiagnosisSection consultation={consultation} />

            {/* Exams Section */}
            <ExamsSection 
              consultation={consultation}
              onUpdate={handleConsultationUpdate} 
            />
            
            {/* Follow-up Chat */}
            <FollowUpChat 
              consultation={consultation}
              onUpdate={handleConsultationUpdate}
              gptSettings={gptSettings}
              onSettingsChange={setGptSettings}
            />

            {/* Chat History */}
            <ChatHistory consultation={consultation} />
          </div>
        </div>
      </div>
    </div>
  );
}
