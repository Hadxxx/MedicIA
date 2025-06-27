import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, FileText, AlertTriangle } from "lucide-react";

export default function TermsModal({ isOpen, onAccept, onDecline }) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);

  const canProceed = agreedToTerms && agreedToDisclaimer;

  const handleAccept = () => {
    if (canProceed) {
      onAccept();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="w-6 h-6 text-blue-600" />
            Termos de Uso e Responsabilidade Médica
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-96 pr-4">
          <div className="space-y-6">
            {/* Medical Disclaimer */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-bold text-red-800 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5" />
                AVISO MÉDICO IMPORTANTE
              </h3>
              <div className="text-red-700 text-sm space-y-2">
                <p className="font-semibold">
                  O MedAssist é uma ferramenta de AUXÍLIO DIAGNÓSTICO destinada exclusivamente a profissionais de saúde qualificados.
                </p>
                <p>
                  <strong>ESTA FERRAMENTA NÃO SUBSTITUI:</strong>
                </p>
                <ul className="ml-4 space-y-1">
                  <li>• A consulta médica presencial</li>
                  <li>• O exame físico do paciente</li>
                  <li>• O julgamento clínico profissional</li>
                  <li>• A experiência e conhecimento médico</li>
                  <li>• Exames complementares e laboratoriais</li>
                  <li>• Procedimentos diagnósticos específicos</li>
                </ul>
                <p className="font-semibold bg-red-100 p-2 rounded">
                  O DIAGNÓSTICO E TRATAMENTO FINAL DEVEM SEMPRE SER BASEADOS NA AVALIAÇÃO COMPLETA E PRESENCIAL DO MÉDICO RESPONSÁVEL.
                </p>
              </div>
            </div>

            {/* Terms of Use */}
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5" />
                TERMOS DE USO
              </h3>
              <div className="text-slate-700 text-sm space-y-3">
                <h4 className="font-semibold">1. RESPONSABILIDADE DO USUÁRIO</h4>
                <p>
                  Ao utilizar o MedAssist, você declara ser um profissional de saúde habilitado e assume total responsabilidade por:
                </p>
                <ul className="ml-4 space-y-1">
                  <li>• Todas as decisões clínicas tomadas</li>
                  <li>• O uso adequado das informações fornecidas</li>
                  <li>• A validação das sugestões através de sua expertise médica</li>
                  <li>• O cumprimento das normas éticas e legais da profissão</li>
                </ul>

                <h4 className="font-semibold">2. LIMITAÇÕES DA FERRAMENTA</h4>
                <p>O usuário reconhece que:</p>
                <ul className="ml-4 space-y-1">
                  <li>• As sugestões são baseadas em algoritmos de IA</li>
                  <li>• Podem existir erros ou imprecisões nas análises</li>
                  <li>• A ferramenta não considera todos os fatores clínicos</li>
                  <li>• Não substitui a avaliação médica completa</li>
                </ul>

                <h4 className="font-semibold">3. PRIVACIDADE E SEGURANÇA</h4>
                <p>
                  Todos os dados são tratados conforme a LGPD. As informações dos pacientes são criptografadas e protegidas, 
                  mas o usuário deve garantir o uso ético e legal das informações.
                </p>

                <h4 className="font-semibold">4. ISENÇÃO DE RESPONSABILIDADE</h4>
                <p>
                  A empresa desenvolvedora do MedAssist não se responsabiliza por danos decorrentes do uso inadequado 
                  da ferramenta ou de decisões médicas baseadas exclusivamente nas sugestões fornecidas.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
                  <p className="font-semibold text-blue-800">
                    LEMBRE-SE: Sua expertise médica é insubstituível. Use esta ferramenta como um auxílio, 
                    não como substituto do seu julgamento clínico.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={setAgreedToTerms}
              />
              <label htmlFor="terms" className="text-sm leading-relaxed">
                Li e concordo com os <strong>Termos de Uso</strong> e entendo que sou responsável por todas as decisões clínicas tomadas.
              </label>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="disclaimer" 
                checked={agreedToDisclaimer}
                onCheckedChange={setAgreedToDisclaimer}
              />
              <label htmlFor="disclaimer" className="text-sm leading-relaxed">
                <strong>Declaro que sou um profissional de saúde qualificado</strong> e compreendo que o MedAssist é apenas uma ferramenta de auxílio diagnóstico que <strong>NÃO SUBSTITUI</strong> a consulta médica, exame físico e meu julgamento clínico profissional.
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onDecline}>
              Não Aceito
            </Button>
            <Button 
              onClick={handleAccept}
              disabled={!canProceed}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Aceito os Termos
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
