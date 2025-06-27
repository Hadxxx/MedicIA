import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

export default function ExamForm({ exam, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    exam: "",
    reason: "",
    priority: "media",
  });

  useEffect(() => {
    if (exam) {
      setFormData(exam);
    } else {
      setFormData({ exam: "", reason: "", priority: "media" });
    }
  }, [exam]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="exam-name" className="text-sm font-medium">Nome do Exame</Label>
        <Input
          id="exam-name"
          value={formData.exam}
          onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
          placeholder="Ex: Hemograma completo"
          required
        />
      </div>
      <div>
        <Label htmlFor="exam-reason" className="text-sm font-medium">Justificativa</Label>
        <Textarea
          id="exam-reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="Motivo da solicitação do exame"
          required
        />
      </div>
      <div>
        <Label htmlFor="exam-priority" className="text-sm font-medium">Prioridade</Label>
        <Select
          value={formData.priority}
          onValueChange={(value) => setFormData({ ...formData, priority: value })}
        >
          <SelectTrigger id="exam-priority">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{exam ? "Salvar Alterações" : "Adicionar Exame"}</Button>
      </DialogFooter>
    </form>
  );
}
