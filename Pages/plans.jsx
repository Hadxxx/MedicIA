
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PlansPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const navigate = useNavigate();

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
        "Histórico de consultas", // Changed from "Histórico de pacientes"
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
        "IA GPT-4 Premium", // Added feature
        "Fontes médicas especializadas" // Added feature
      ]
    }
    // Removed "Enterprise" plan
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
    // Removed "gold" color class
  };

  const handleSelectPlan = (planId) => {
    navigate(createPageUrl("Checkout") + `?plan=${planId}&cycle=${billingCycle}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl("Dashboard")}>
                <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-xl">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Planos MedAssist</h1>
                <p className="text-slate-500">Escolha o plano ideal para sua prática médica</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Billing Toggle */}
        <div className="text-center mb-12">
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

        {/* Plans Grid - Now only 2 plans */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
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
                        <Check className={`w-5 h-5 ${colorClasses[plan.color].text}`} />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full ${colorClasses[plan.color].button} text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    Escolher {plan.name}
                  </Button>

                  <p className="text-center text-sm text-slate-500">
                    7 dias grátis • Cancele a qualquer momento
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-slate-900">
              Perguntas Frequentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Como funciona o período de teste?
                </h3>
                <p className="text-slate-600 text-sm">
                  Você tem 7 dias para testar todas as funcionalidades gratuitamente. 
                  Não cobramos nada durante este período.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Posso trocar de plano a qualquer momento?
                </h3>
                <p className="text-slate-600 text-sm">
                  Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento 
                  através do painel de controle.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Os dados ficam seguros?
                </h3>
                <p className="text-slate-600 text-sm">
                  Sim, utilizamos criptografia de ponta e seguimos todas as normas de segurança 
                  e privacidade médica (LGPD).
                </p>
              </div>
              {/* Added new FAQ entry, removed old one */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Que tipo de fontes a IA utiliza?
                </h3>
                <p className="text-slate-600 text-sm">
                  A IA consulta fontes médicas confiáveis como PubMed, diretrizes médicas 
                  e literatura científica validada.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
