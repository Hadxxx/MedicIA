import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Stethoscope } from "lucide-react";

export default function MedicalDisclaimer({ variant = "default", className = "" }) {
  const variants = {
    default: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-600",
      text: "text-amber-800"
    },
    compact: {
      bg: "bg-blue-50",
      border: "border-blue-200", 
      icon: "text-blue-600",
      text: "text-blue-800"
    },
    prominent: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-600", 
      text: "text-red-800"
    }
  };

  const style = variants[variant];

  return (
    <Alert className={`${style.bg} ${style.border} ${className}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={`w-5 h-5 ${style.icon} mt-0.5`} />
        <div>
          <h4 className={`font-semibold ${style.text} mb-1`}>
            ⚠️ Importante - Ferramenta de Auxílio Médico
          </h4>
          <AlertDescription className={`${style.text} text-sm leading-relaxed`}>
            {variant === "compact" ? (
              <>
                Este sistema é apenas uma <strong>ferramenta de auxílio</strong> para profissionais de saúde. 
                Não substitui o julgamento clínico, exame físico ou consulta médica presencial.
              </>
            ) : (
              <>
                <strong>MedAssist é uma ferramenta de auxílio</strong> destinada exclusivamente a profissionais de saúde qualificados. 
                As sugestões apresentadas não constituem diagnóstico médico final e não substituem:
                <ul className="mt-2 ml-4 space-y-1">
                  <li>• Avaliação clínica presencial</li>
                  <li>• Exame físico do paciente</li>
                  <li>• Julgamento médico profissional</li>
                  <li>• Exames complementares quando necessários</li>
                </ul>
                <p className="mt-2">
                  <strong>O diagnóstico e tratamento final devem sempre ser baseados na avaliação completa do médico responsável.</strong>
                </p>
              </>
            )}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
