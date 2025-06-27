import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function PatientInfoForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    patient_name: "",
    patient_age: "",
    patient_gender: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.patient_name && formData.patient_age && formData.patient_gender) {
      onSubmit({
        ...formData,
        patient_age: parseInt(formData.patient_age)
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Informações do Paciente
          </CardTitle>
          <p className="text-slate-500 mt-2">
            Preencha os dados básicos para iniciar a anamnese
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                Nome Completo
              </Label>
              <Input
                id="name"
                value={formData.patient_name}
                onChange={(e) => setFormData({...formData, patient_name: e.target.value})}
                placeholder="Digite o nome do paciente"
                className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-semibold text-slate-700">
                Idade
              </Label>
              <Input
                id="age"
                type="number"
                min="0"
                max="120"
                value={formData.patient_age}
                onChange={(e) => setFormData({...formData, patient_age: e.target.value})}
                placeholder="Digite a idade"
                className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Gênero
              </Label>
              <Select
                value={formData.patient_gender}
                onValueChange={(value) => setFormData({...formData, patient_gender: value})}
                required
              >
                <SelectTrigger className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Iniciar Anamnese
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
