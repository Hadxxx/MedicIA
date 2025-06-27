import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

export default function DiagnosisSection({ consultation }) {
  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (confidence >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 80) return <CheckCircle2 className="w-4 h-4" />;
    if (confidence >= 60) return <AlertCircle className="w-4 h-4" />;
    return <HelpCircle className="w-4 h-4" />;
  };

  if (!consultation.suggested_diagnoses || consultation.suggested_diagnoses.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Análise de Diagnóstico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-center py-8">
            Análise de diagnóstico ainda não foi realizada para esta consulta.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Análise de Diagnóstico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Diagnoses */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-4">Diagnósticos Sugeridos</h3>
          <div className="space-y-4">
            {consultation.suggested_diagnoses.map((diagnosis, index) => (
              <div key={index} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-slate-900">
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
              </div>
            ))}
          </div>
        </div>

        {/* Refining Questions */}
        {consultation.refining_questions && consultation.refining_questions.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Perguntas para Refinamento</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
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
            </div>
          </div>
        )}

        {/* Symptoms Summary */}
        {consultation.symptoms_summary && (
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Resumo dos Sintomas</h3>
            <div className="border border-slate-200 rounded-xl p-4">
              <p className="text-slate-600 text-sm leading-relaxed">
                {consultation.symptoms_summary}
              </p>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {consultation.recommendations && (
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Recomendações</h3>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-800 text-sm leading-relaxed">
                {consultation.recommendations}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
