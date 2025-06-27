
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import MedicalDisclaimer from "../common/MedicalDisclaimer";

export default function DiagnosisPanel({ consultation, onClose }) {
  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (confidence >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 80) return <CheckCircle2 className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="w-96 border-l border-slate-200 bg-white"
    >
      <div className="h-full flex flex-col">
        <div className="border-b border-slate-200 p-6 bg-slate-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Análise de Diagnóstico
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-slate-200 rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-slate-600 text-sm">
            Baseado na anamnese de <span className="font-semibold">{consultation.patient_name}</span>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Medical Disclaimer at top */}
          <MedicalDisclaimer variant="prominent" />

          {/* Diagnósticos Sugeridos */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Diagnósticos Sugeridos</h3>
            <div className="space-y-4">
              {consultation.suggested_diagnoses?.map((diagnosis, index) => (
                <Card key={index} className="border border-slate-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-slate-900 text-sm">
                        {diagnosis.diagnosis}
                      </h4>
                      <Badge className={`${getConfidenceColor(diagnosis.confidence)} border flex items-center gap-1`}>
                        {getConfidenceIcon(diagnosis.confidence)}
                        {diagnosis.confidence}%
                      </Badge>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {diagnosis.reasoning}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Perguntas de Refinamento */}
          {consultation.refining_questions && consultation.refining_questions.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Perguntas para Refinamento</h3>
              <Card className="border border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {consultation.refining_questions.map((question, index) => (
                      <li key={index} className="flex items-start gap-2 text-blue-800 text-sm">
                        <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                          {index + 1}
                        </span>
                        {question}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Exames Sugeridos */}
          {consultation.suggested_exams && consultation.suggested_exams.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Exames Sugeridos</h3>
              <div className="space-y-3">
                {consultation.suggested_exams.map((exam, index) => (
                  <Card key={index} className="border border-slate-200">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-slate-900 text-sm">
                          {exam.exam}
                        </h4>
                        <Badge className={`text-xs ${
                          exam.priority === "alta" ? "bg-red-100 text-red-800" :
                          exam.priority === "media" ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {exam.priority}
                        </Badge>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {exam.reason}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Resumo dos Sintomas */}
          {consultation.symptoms_summary && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Resumo dos Sintomas</h3>
              <Card className="border border-slate-200">
                <CardContent className="p-4">
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {consultation.symptoms_summary}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recomendações */}
          {consultation.recommendations && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Recomendações</h3>
              <Card className="border border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <p className="text-blue-800 text-sm leading-relaxed">
                    {consultation.recommendations}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Disclaimer (original, potentially redundant with MedicalDisclaimer) */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 text-sm mb-1">
                  Importante
                </h4>
                <p className="text-amber-700 text-xs leading-relaxed">
                  Esta análise é apenas uma sugestão baseada em IA. O diagnóstico final deve sempre ser feito por um médico qualificado com base em exame clínico completo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
