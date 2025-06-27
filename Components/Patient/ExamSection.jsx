import React, { useState } from "react";
import { Consultation } from "@/entities/Consultation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, AlertCircle, ArrowUp, Minus, Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ExamForm from "./ExamForm";

export default function ExamsSection({ consultation, onUpdate }) {
  const [exams, setExams] = useState(consultation.suggested_exams || []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [examToEdit, setExamToEdit] = useState(null);
  const [examToDelete, setExamToDelete] = useState(null);

  const handleSaveExams = async (updatedExams) => {
    try {
      await Consultation.update(consultation.id, { suggested_exams: updatedExams });
      onUpdate({ suggested_exams: updatedExams });
      setExams(updatedExams);
    } catch (error) {
      console.error("Erro ao salvar exames:", error);
    }
  };

  const handleFormSubmit = (examData) => {
    let updatedExams;
    if (examToEdit) {
      updatedExams = exams.map(e => e === examToEdit ? examData : e);
    } else {
      updatedExams = [...exams, examData];
    }
    handleSaveExams(updatedExams);
    setIsFormOpen(false);
    setExamToEdit(null);
  };

  const handleDelete = () => {
    if (!examToDelete) return;
    const updatedExams = exams.filter(e => e !== examToDelete);
    handleSaveExams(updatedExams);
    setIsAlertOpen(false);
    setExamToDelete(null);
  };

  const openDeleteAlert = (exam) => {
    setExamToDelete(exam);
    setIsAlertOpen(true);
  };

  const openForm = (exam = null) => {
    setExamToEdit(exam);
    setIsFormOpen(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "alta": return "bg-red-100 text-red-800 border-red-200";
      case "media": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baixa": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "alta": return <AlertCircle className="w-4 h-4" />;
      case "media": return <ArrowUp className="w-4 h-4" />;
      case "baixa": return <Minus className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <>
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Exames Sugeridos
          </CardTitle>
          <Button size="sm" onClick={() => openForm()}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Exame
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exams.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                Nenhum exame foi sugerido para esta consulta.
              </p>
            ) : (
              exams.map((exam, index) => (
                <div key={index} className="border border-slate-200 rounded-xl p-4 group">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-slate-900">{exam.exam}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getPriorityColor(exam.priority)} border flex items-center gap-1`}>
                        {getPriorityIcon(exam.priority)}
                        {exam.priority}
                      </Badge>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openForm(exam)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600 hover:text-red-700" onClick={() => openDeleteAlert(exam)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{exam.reason}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{examToEdit ? "Editar Exame" : "Adicionar Novo Exame"}</DialogTitle>
          </DialogHeader>
          <ExamForm 
            exam={examToEdit}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o exame "{examToDelete?.exam}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
