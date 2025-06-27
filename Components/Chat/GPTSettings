import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Zap, CheckCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function GPTSettings({ settings, onSettingsChange }) {
  const handleToggleGPT4 = (checked) => {
    onSettingsChange({
      ...settings,
      useGPT4: checked
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-blue-600" />
            Configurações de IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="gpt4-toggle" className="text-sm font-semibold">
                Usar GPT-4 (Premium)
              </Label>
              <p className="text-xs text-slate-500">
                Análises mais precisas e detalhadas com o modelo mais avançado da OpenAI
              </p>
            </div>
            <Switch
              id="gpt4-toggle"
              checked={settings.useGPT4}
              onCheckedChange={handleToggleGPT4}
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    Modelo Atual: {settings.useGPT4 ? "GPT-4" : "Modelo Gratuito"}
                  </span>
                  <Badge className={settings.useGPT4 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                    {settings.useGPT4 ? "Premium" : "Gratuito"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  {settings.useGPT4 
                    ? "Utilizando GPT-4 para análises médicas avançadas"
                    : "Utilizando modelo integrado da plataforma"
                  }
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {settings.useGPT4 
                ? "GPT-4 oferece análises mais detalhadas e precisas para diagnósticos médicos complexos."
                : "O modelo gratuito fornece análises confiáveis para a maioria dos casos de anamnese."
              }
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Info className="w-4 h-4" />
          Diferenças entre os Modelos
        </h4>
        <div className="text-blue-800 text-sm space-y-2">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-1">Modelo Gratuito:</h5>
              <ul className="space-y-1 text-xs">
                <li>• Análises médicas básicas</li>
                <li>• Sugestões de diagnóstico</li>
                <li>• Perguntas de anamnese</li>
                <li>• Sem custos adicionais</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-1">GPT-4 Premium:</h5>
              <ul className="space-y-1 text-xs">
                <li>• Análises mais detalhadas</li>
                <li>• Maior precisão diagnóstica</li>
                <li>• Contexto médico avançado</li>
                <li>• Raciocínio clínico aprimorado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
