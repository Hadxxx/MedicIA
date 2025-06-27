
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  MessageCircle, 
  BarChart3, 
  History, 
  CheckCircle2, 
  Star,
  Users,
  Shield,
  Zap,
  ArrowRight,
  Play,
  Crown,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const handleLogin = async () => {
    try {
      await User.login();
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  const plans = [
    {
      name: "Básico",
      id: "basico",
      icon: Zap,
      price: billingCycle === "monthly" ? 49 : 490,
      originalPrice: billingCycle === "monthly" ? null : 588,
      description: "Perfeito para consultórios pequenos",
      color: "blue",
      popular: false,
      features: [
        "Até 50 consultas/mês",
        "Anamnese com IA",
        "Sugestões básicas de diagnóstico",
        "Histórico de pacientes",
        "Suporte por email"
      ]
    },
    {
      name: "Profissional",
      id: "profissional",
      icon: Crown,
      price: billingCycle === "monthly" ? 99 : 990,
      originalPrice: billingCycle === "monthly" ? null : 1188,
      description: "Ideal para médicos em crescimento",
      color: "purple",
      popular: true,
      features: [
        "Consultas ilimitadas",
        "Anamnese avançada com IA",
        "Análise completa de diagnóstico",
        "Sugestão de exames",
        "Dashboard analytics",
        "Exportação de relatórios",
        "Suporte prioritário",
        "Backup automático",
        "IA GPT-4 Premium",
        "Fontes médicas especializadas"
      ]
    }
  ];

  const colorClasses = {
    blue: {
      bg: "from-blue-500 to-blue-600",
      border: "border-blue-200",
      text: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700"
    },
    purple: {
      bg: "from-purple-500 to-purple-600", 
      border: "border-purple-200",
      text: "text-purple-600",
      button: "bg-purple-600 hover:bg-purple-700"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">MedAssist</h2>
                <p className="text-xs text-slate-500 font-medium">Assistente de Diagnóstico</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                Como Funciona
              </Button>
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                Preços
              </Button>
              <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white">
                Entrar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-blue-100 text-blue-800 mb-4">
              🚀 Agora com IA GPT-4 Integrada
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Revolucione sua
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Prática Médica
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              O MedAssist utiliza inteligência artificial avançada para auxiliar médicos na condução 
              de anamneses estruturadas e sugestões de diagnóstico, otimizando o tempo de consulta.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-2xl mx-auto mb-8">
              <p className="text-amber-800 text-sm">
                <strong>⚠️ Importante:</strong> Ferramenta de auxílio médico que não substitui 
                o julgamento clínico profissional.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleLogin}
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg"
              >
                Começar Teste Grátis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-slate-300 hover:border-slate-400 px-8 py-4 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Ver Demonstração
              </Button>
            </div>
            <p className="text-slate-500 text-sm mt-4">
              ✅ 7 dias grátis • ✅ Sem cartão de crédito • ✅ Cancele quando quiser
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Funcionalidades Avançadas
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Tudo que você precisa para uma assistência médica mais eficiente e precisa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: "Anamnese em Tópicos",
                description: "IA organiza perguntas e respostas em formato de tópicos práticos, facilitando a leitura clínica.",
                color: "blue"
              },
              {
                icon: BarChart3,
                title: "Análise Estruturada",
                description: "Diagnósticos sugeridos com justificativas em tópicos e níveis de confiança organizados.",
                color: "purple"
              },
              {
                icon: History,
                title: "Histórico Visível",
                description: "Acompanhe toda a conversa da anamnese com visualização clara e organizada.",
                color: "green"
              },
              {
                icon: Shield,
                title: "Fontes Confiáveis",
                description: "IA consulta apenas fontes médicas validadas como PubMed e diretrizes oficiais.",
                color: "red"
              },
              {
                icon: Zap,
                title: "GPT-4 Médico",
                description: "Modelo mais avançado do mundo treinado especificamente para análises médicas precisas.",
                color: "yellow"
              },
              {
                icon: Users,
                title: "Interface Prática",
                description: "Design focado na experiência médica com informações organizadas por prioridade.",
                color: "indigo"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                      <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Planos e Preços
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              Escolha o plano ideal para sua prática médica
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white rounded-2xl p-2 shadow-lg border border-slate-200">
              <Button
                variant={billingCycle === "monthly" ? "default" : "ghost"}
                onClick={() => setBillingCycle("monthly")}
                className="rounded-xl px-6 py-2"
              >
                Mensal
              </Button>
              <Button
                variant={billingCycle === "yearly" ? "default" : "ghost"}
                onClick={() => setBillingCycle("yearly")}
                className="rounded-xl px-6 py-2"
              >
                Anual
                <Badge className="ml-2 bg-green-100 text-green-700 text-xs">-17%</Badge>
              </Button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 text-sm font-semibold">
                      🔥 Mais Popular
                    </Badge>
                  </div>
                )}
                
                <Card className={`relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-2 ${
                  plan.popular ? 'border-purple-200 bg-gradient-to-b from-purple-50 to-white' : 'border-slate-200 bg-white'
                }`}>
                  <CardHeader className="text-center pb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${colorClasses[plan.color].bg} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                      {plan.name}
                    </CardTitle>
                    <p className="text-slate-500 mt-2">{plan.description}</p>
                    
                    <div className="mt-6">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-bold text-slate-900">
                          R$ {plan.price}
                        </span>
                        <span className="text-slate-500">
                          /{billingCycle === "monthly" ? "mês" : "ano"}
                        </span>
                      </div>
                      {billingCycle === "yearly" && plan.originalPrice && (
                        <p className="text-sm text-slate-500 mt-1">
                          <span className="line-through">R$ {plan.originalPrice}</span>
                          <span className="text-green-600 font-semibold ml-2">
                            Economize R$ {plan.originalPrice - plan.price}
                          </span>
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle2 className={`w-5 h-5 ${colorClasses[plan.color].text}`} />
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      onClick={handleLogin}
                      className={`w-full ${colorClasses[plan.color].button} text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      Começar com {plan.name}
                    </Button>

                    <p className="text-center text-sm text-slate-500">
                      7 dias grátis • Cancele a qualquer momento
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Pronto para Revolucionar sua Prática?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de médicos que já estão usando o MedAssist para 
            otimizar diagnósticos e melhorar o atendimento aos pacientes.
          </p>
          <Button 
            onClick={handleLogin}
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg"
          >
            Começar Teste Grátis Agora
            <Sparkles className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-blue-200 text-sm mt-4">
            Sem compromisso • Sem cartão de crédito • Suporte completo
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">MedAssist</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Assistente inteligente para diagnósticos médicos, 
                auxiliando profissionais de saúde com IA avançada.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demonstração</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Treinamento</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LGPD</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 MedAssist. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
