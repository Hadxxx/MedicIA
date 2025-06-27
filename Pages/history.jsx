
import React, { useState, useEffect } from "react";
import { Consultation } from "@/entities/Consultation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, User, Clock, FileText, Trash2, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function HistoryPage() {
  const [consultations, setConsultations] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [consultationToDelete, setConsultationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadConsultations();
  }, []);

  useEffect(() => {
    filterConsultations();
  }, [searchTerm, consultations]);

  const loadConsultations = async () => {
    setIsLoading(true);
    const data = await Consultation.list("-created_date");
    setConsultations(data);
    setIsLoading(false);
  };

  const filterConsultations = () => {
    if (!searchTerm) {
      setFilteredConsultations(consultations);
      return;
    }

    const filtered = consultations.filter(consultation =>
      consultation.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.chief_complaint?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredConsultations(filtered);
  };

  const handleDeleteConsultation = async () => {
    if (!consultationToDelete) return;
    
    setIsDeleting(true);
    try {
      await Consultation.delete(consultationToDelete.id);
      setConsultations(prev => prev.filter(c => c.id !== consultationToDelete.id));
      setConsultationToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar consulta:", error);
    }
    setIsDeleting(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
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

  const getStatusText = (status) => {
    switch (status) {
      case "concluida": return "Concluída";
      case "em_andamento": return "Em Andamento";
      case "revisao": return "Em Revisão";
      case "aguardando_exames": return "Aguardando Exames";
      case "alta": return "Alta";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Histórico de Consultas</h1>
            <p className="text-slate-500 mt-2">Acompanhe todas as anamneses realizadas</p>
          </div>
          <Link to={createPageUrl("Chat")}>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
              <FileText className="w-4 h-4 mr-2" />
              Nova Consulta
            </Button>
          </Link>
        </div>

        {/* Search */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Buscar por nome do paciente ou queixa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Consultations Grid */}
        <div className="grid gap-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-slate-200 rounded mb-4"></div>
                    <div className="h-3 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredConsultations.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {searchTerm ? "Nenhuma consulta encontrada" : "Nenhuma consulta realizada"}
                </h3>
                <p className="text-slate-500">
                  {searchTerm 
                    ? "Tente ajustar os termos de busca" 
                    : "Comece criando sua primeira anamnese"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredConsultations.map((consultation, index) => (
                  <motion.div
                    key={consultation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white relative group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle 
                            className="text-lg font-bold text-slate-900 flex items-center gap-2 cursor-pointer"
                            onClick={() => navigate(createPageUrl("PatientDetail") + `?id=${consultation.id}`)}
                          >
                            <User className="w-5 h-5 text-blue-600" />
                            {consultation.patient_name}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(consultation.status)} border`}>
                              {getStatusText(consultation.status)}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => navigate(createPageUrl("PatientDetail") + `?id=${consultation.id}`)}
                                >
                                  <User className="w-4 h-4 mr-2" />
                                  Ver Detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => setConsultationToDelete(consultation)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remover
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent 
                        className="space-y-4 cursor-pointer"
                        onClick={() => navigate(createPageUrl("PatientDetail") + `?id=${consultation.id}`)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(consultation.created_date), "dd/MM/yyyy 'às' HH:mm")}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="w-4 h-4" />
                            {consultation.patient_age} anos • {consultation.patient_gender}
                          </div>
                        </div>

                        {consultation.chief_complaint && (
                          <div>
                            <p className="text-sm font-medium text-slate-700 mb-1">Queixa Principal:</p>
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {consultation.chief_complaint}
                            </p>
                          </div>
                        )}

                        {consultation.suggested_diagnoses && consultation.suggested_diagnoses.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-slate-700 mb-2">Diagnósticos:</p>
                            <div className="space-y-1">
                              {consultation.suggested_diagnoses.slice(0, 2).map((diagnosis, i) => (
                                <div key={i} className="flex items-center justify-between">
                                  <span className="text-xs text-slate-600 truncate">
                                    {diagnosis.diagnosis}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {diagnosis.confidence}%
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!consultationToDelete} onOpenChange={() => setConsultationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              Remover Consulta
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover a consulta de <strong>{consultationToDelete?.patient_name}</strong>?
              <br /><br />
              Esta ação não pode ser desfeita e todos os dados da anamnese serão perdidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConsultation}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Removendo...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remover
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
