
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MessageCircle, History, BarChart3, Stethoscope, Plus, CreditCard, LogOut, AlertTriangle } from "lucide-react"; // Added AlertTriangle
import { User } from "@/entities/User";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Added Dialog components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Added Tooltip

// Define TermsModal component
function TermsModal({ isOpen, onAccept, onDecline }) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}> {/* Prevent closing by clicking outside */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Termos de Uso e Disclaimer Médico</DialogTitle>
          <DialogDescription className="text-sm text-slate-600">
            Por favor, leia e aceite os termos de uso e o disclaimer médico para continuar.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 text-sm text-slate-700">
          <p className="font-semibold text-red-600">
            Aviso Médico Importante:
          </p>
          <p>
            O MedAssist é uma ferramenta de <strong>auxílio diagnóstico</strong> e não deve ser utilizado como substituto para consulta médica profissional, diagnóstico ou tratamento.
            As informações fornecidas por este sistema são baseadas em dados e algoritmos e são para fins de apoio à decisão clínica apenas.
          </p>
          <p>
            É essencial que o profissional de saúde responsável sempre realize seu próprio julgamento clínico, considerando o histórico completo do paciente, exame físico e quaisquer outros testes diagnósticos necessários.
            A responsabilidade pelo diagnóstico e tratamento final é sempre do profissional de saúde.
          </p>
          <p className="font-semibold">
            Ao aceitar, você confirma que leu, compreendeu e concorda com o acima, e que você é um profissional de saúde qualificado.
          </p>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={onDecline}>Recusar e Sair</Button>
          <Button onClick={onAccept}>Aceitar Termos</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const navigationItems = [
  {
    title: "Nova Consulta",
    url: createPageUrl("Chat"),
    icon: MessageCircle,
  },
  {
    title: "Histórico",
    url: createPageUrl("History"),
    icon: History,
  },
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
  {
    title: "Planos",
    url: createPageUrl("Plans"),
    icon: CreditCard,
  },
];

// Helper components for brand icons
const AppleIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.124,14.417c-0.219-0.672,0.188-1.344,0.188-1.344s-1.875-1.812-1.875-3.25c0-1.625,1.25-2.875,2.75-2.875 c0.5,0,1.375,0.25,2,0.625c0.125,0.063,0.25,0.125,0.375,0.188c-0.125-0.125-0.25-0.25-0.375-0.375 C18.124,6.792,17.188,6,16.25,6c-1.875,0-3.375,1.312-3.375,3.25c0,2.312,2.062,3.5,2.062,3.5s-0.5,1.688-0.5,2.25 c0,0.562,0.312,1.125,0.812,1.5c0.5,0.375,1,0.5,1.562,0.5c0.562,0,1.125-0.188,1.688-0.562c0.562-0.375,1-1,1.312-1.625 C19.374,14.854,16.124,14.417,16.124,14.417z M14.624,10.167c0.625-0.812,1-1.938,0.75-3c-1.438,0.125-2.75,1-3.25,2.062 c-0.562,1.125-1.062,2.5,0,3.375C12.124,12.604,14,11,14.624,10.167z" />
  </svg>
);

const MicrosoftIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.5,11.5H2v-9h9.5V11.5z M22,11.5h-9.5v-9H22V11.5z M11.5,22H2v-9.5h9.5V22z M22,22h-9.5v-9.5H22V22z" />
  </svg>
);

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false); // New state for terms modal

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setIsAuthenticated(true);
      
      // Check if user has accepted terms
      const hasAcceptedTerms = localStorage.getItem('medassist_terms_accepted');
      if (!hasAcceptedTerms) {
        setShowTermsModal(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  const handleAcceptTerms = () => {
    localStorage.setItem('medassist_terms_accepted', 'true');
    localStorage.setItem('medassist_terms_date', new Date().toISOString());
    setShowTermsModal(false);
  };

  const handleDeclineTerms = async () => {
    await User.logout();
  };

  const handleLogin = async () => {
    try {
      await User.login();
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  const handleLogout = async () => {
    await User.logout();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Login screen for unauthenticated users
  if (!isAuthenticated) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center p-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="w-24 h-24 bg-gradient-to-br from-white to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Stethoscope className="w-12 h-12 text-blue-900" />
            </div>
            
            <h1 className="text-5xl font-bold mb-4">MedAssist</h1>
            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
              Sistema inteligente de assistência médica para diagnósticos baseados em anamnese
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <MessageCircle className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Anamnese Inteligente</h3>
                <p className="text-blue-200 text-sm">Conduza entrevistas médicas estruturadas com IA</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <BarChart3 className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Análise Avançada</h3>
                <p className="text-blue-200 text-sm">Sugestões de diagnóstico baseadas em dados</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <History className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Histórico Completo</h3>
                <p className="text-blue-200 text-sm">Acompanhe a evolução dos pacientes</p>
              </div>
            </div>

            {/* Add disclaimer to login screen */}
            <div className="mt-8 bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-start gap-3 text-left">
                <AlertTriangle className="w-6 h-6 text-yellow-300 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-300 mb-2">
                    Importante - Ferramenta de Auxílio Médico
                  </h4>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    MedAssist é destinado exclusivamente a profissionais de saúde qualificados. 
                    É uma ferramenta de <strong>auxílio diagnóstico</strong> que não substitui 
                    a consulta médica, exame físico ou julgamento clínico profissional.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              className="bg-white text-blue-900 hover:bg-blue-50 font-semibold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg mt-6 w-full max-w-sm"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Entrar com Google
            </Button>
            
            <div className="mt-6 flex justify-center items-center gap-2">
              <div className="h-px w-16 bg-blue-600"></div>
              <p className="text-blue-300 text-sm">ou</p>
              <div className="h-px w-16 bg-blue-600"></div>
            </div>

            <Link to={createPageUrl("LandingPage")}>
              <Button
                variant="outline"
                className="border-2 border-blue-300 text-blue-100 hover:bg-blue-800 hover:text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 mt-4"
              >
                Conhecer os Planos
              </Button>
            </Link>

            <p className="text-blue-300 text-sm mt-8">
              🚀 Teste grátis por 7 dias • Cancele a qualquer momento
            </p>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  // Authenticated layout
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <Sidebar className="border-r border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">MedAssist</h2>
                <p className="text-xs text-slate-500 font-medium">Assistente de Diagnóstico</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                Navegação
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 rounded-xl h-12 ${
                          location.pathname === item.url ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                Ação Rápida
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <Link to={createPageUrl("Chat")}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl h-12">
                    <Plus className="w-5 h-5 mr-2" />
                    Iniciar Anamnese
                  </Button>
                </Link>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/60 p-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 rounded-xl p-2 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.full_name?.charAt(0) || 'Dr'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">
                      {user?.full_name || 'Dr. Médico'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.email || 'medico@email.com'}
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-xl transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">MedAssist</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Terms Modal for authenticated users */}
      <TermsModal 
        isOpen={showTermsModal}
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
      />
    </SidebarProvider>
  );
}
