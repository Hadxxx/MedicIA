import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "@/entities/User";
import { Customer } from "@/entities/Customer";
import { Payment } from "@/entities/Payment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

import CustomerForm from "../components/payment/CustomerForm";
import PaymentForm from "../components/payment/PaymentForm";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  // Get plan and billing cycle from URL params
  const urlParams = new URLSearchParams(location.search);
  const plan = urlParams.get('plan') || 'basico';
  const billingCycle = urlParams.get('cycle') || 'monthly';

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      // Check if customer already exists
      const customers = await Customer.filter({ user_id: userData.id });
      if (customers.length > 0) {
        setCustomer(customers[0]);
        setCurrentStep(2); // Skip to payment if customer exists
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      navigate(createPageUrl("Plans"));
    }
  };

  const handleCustomerSubmit = async (customerData) => {
    setIsLoading(true);
    try {
      const newCustomer = await Customer.create({
        ...customerData,
        user_id: user.id,
        subscription_status: "trial",
        trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 dias
      });
      setCustomer(newCustomer);
      setCurrentStep(2);
    } catch (error) {
      console.error("Erro ao salvar dados do cliente:", error);
    }
    setIsLoading(false);
  };

  const handlePaymentSubmit = async (paymentData) => {
    setIsLoading(true);
    try {
      // Simular processamento de pagamento
      // Em produção, você integraria com Stripe, PagSeguro, etc.
      
      const planPrices = {
        basico: { monthly: 49, yearly: 490 },
        profissional: { monthly: 99, yearly: 990 },
        enterprise: { monthly: 199, yearly: 1990 }
      };

      const amount = planPrices[plan][billingCycle] * 100; // Converter para centavos

      // Criar registro de pagamento
      const payment = await Payment.create({
        customer_id: customer.id,
        amount: amount,
        plan_type: plan,
        billing_cycle: billingCycle,
        payment_method: paymentData.payment_method,
        status: "processing"
      });

      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simular sucesso/falha (90% sucesso)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        // Atualizar pagamento como bem-sucedido
        await Payment.update(payment.id, {
          status: "succeeded",
          paid_at: new Date().toISOString()
        });

        // Atualizar cliente com assinatura ativa
        const subscriptionStart = new Date();
        const nextBilling = new Date();
        if (billingCycle === "monthly") {
          nextBilling.setMonth(nextBilling.getMonth() + 1);
        } else {
          nextBilling.setFullYear(nextBilling.getFullYear() + 1);
        }

        await Customer.update(customer.id, {
          subscription_status: "active",
          current_plan: plan,
          subscription_starts_at: subscriptionStart.toISOString(),
          next_billing_date: nextBilling.toISOString(),
          billing_info: paymentData.payment_method === "credit_card" ? {
            card_brand: "Visa", // Detectar da bandeira real
            card_last_digits: paymentData.card_data?.number?.slice(-4) || "0000",
            card_holder_name: paymentData.card_data?.holder_name || ""
          } : null
        });

        setPaymentResult({ success: true });
      } else {
        // Atualizar pagamento como falhou
        await Payment.update(payment.id, {
          status: "failed",
          failure_reason: "Cartão recusado pelo banco emissor"
        });

        setPaymentResult({ 
          success: false, 
          error: "Pagamento não aprovado. Verifique os dados do cartão e tente novamente." 
        });
      }

      setCurrentStep(3);
    } catch (error) {
      console.error("Erro no processamento do pagamento:", error);
      setPaymentResult({ 
        success: false, 
        error: "Erro interno. Tente novamente em alguns minutos." 
      });
      setCurrentStep(3);
    }
    setIsLoading(false);
  };

  const planNames = {
    basico: "Básico",
    profissional: "Profissional",
    enterprise: "Enterprise"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(createPageUrl("Plans"))}
                className="hover:bg-slate-100 rounded-xl"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Checkout - Plano {planNames[plan]}
                </h1>
                <p className="text-slate-500">
                  {billingCycle === "monthly" ? "Cobrança Mensal" : "Cobrança Anual"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step, index) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step 
                    ? "bg-blue-600 text-white" 
                    : "bg-slate-200 text-slate-500"
                }`}>
                  {currentStep > step ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                {index < 2 && (
                  <div className={`w-16 h-1 ${
                    currentStep > step ? "bg-blue-600" : "bg-slate-200"
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CustomerForm
                customer={customer}
                onSubmit={handleCustomerSubmit}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <PaymentForm
                plan={plan}
                billingCycle={billingCycle}
                onSubmit={handlePaymentSubmit}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {currentStep === 3 && paymentResult && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Card className={`max-w-md mx-auto ${
                paymentResult.success 
                  ? "border-green-200 bg-green-50" 
                  : "border-red-200 bg-red-50"
              }`}>
                <CardContent className="p-8">
                  {paymentResult.success ? (
                    <>
                      <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-green-800 mb-2">
                        Pagamento Aprovado!
                      </h2>
                      <p className="text-green-700 mb-6">
                        Sua assinatura do plano {planNames[plan]} foi ativada com sucesso.
                        Bem-vindo ao MedAssist!
                      </p>
                      <Button 
                        onClick={() => navigate(createPageUrl("Dashboard"))}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Ir para Dashboard
                      </Button>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-red-800 mb-2">
                        Pagamento Não Aprovado
                      </h2>
                      <p className="text-red-700 mb-6">
                        {paymentResult.error}
                      </p>
                      <div className="flex gap-3 justify-center">
                        <Button 
                          variant="outline"
                          onClick={() => setCurrentStep(2)}
                        >
                          Tentar Novamente
                        </Button>
                        <Button 
                          onClick={() => navigate(createPageUrl("Plans"))}
                        >
                          Voltar aos Planos
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
