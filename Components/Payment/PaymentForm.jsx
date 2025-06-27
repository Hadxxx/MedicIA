import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Shield, Lock, CheckCircle2 } from "lucide-react";

export default function PaymentForm({ plan, billingCycle, onSubmit, isLoading }) {
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
    holder_name: ""
  });
  const [errors, setErrors] = useState({});

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const validateCard = () => {
    const newErrors = {};
    
    if (paymentMethod === "credit_card") {
      if (!cardData.number || cardData.number.replace(/\s/g, "").length < 13) {
        newErrors.number = "Número do cartão inválido";
      }
      if (!cardData.expiry || cardData.expiry.length < 5) {
        newErrors.expiry = "Data de vencimento inválida";
      }
      if (!cardData.cvc || cardData.cvc.length < 3) {
        newErrors.cvc = "Código de segurança inválido";
      }
      if (!cardData.holder_name) {
        newErrors.holder_name = "Nome no cartão obrigatório";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateCard()) {
      onSubmit({
        payment_method: paymentMethod,
        card_data: paymentMethod === "credit_card" ? cardData : null
      });
    }
  };

  const planPrices = {
    basico: { monthly: 49, yearly: 490 },
    profissional: { monthly: 99, yearly: 990 },
    enterprise: { monthly: 199, yearly: 1990 }
  };

  const planNames = {
    basico: "Básico",
    profissional: "Profissional", 
    enterprise: "Enterprise"
  };

  const currentPrice = planPrices[plan][billingCycle];
  const savings = billingCycle === "yearly" ? Math.round(((planPrices[plan].monthly * 12) - currentPrice) / (planPrices[plan].monthly * 12) * 100) : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plan Summary */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-blue-900">
                Plano {planNames[plan]}
              </h3>
              <p className="text-blue-700">
                {billingCycle === "monthly" ? "Cobrança Mensal" : "Cobrança Anual"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">
                R$ {currentPrice}
              </div>
              <div className="text-sm text-blue-700">
                {billingCycle === "monthly" ? "/mês" : "/ano"}
              </div>
              {savings > 0 && (
                <Badge className="bg-green-100 text-green-800 mt-1">
                  Economize {savings}%
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Método de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="credit_card" id="credit_card" />
              <Label htmlFor="credit_card" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Cartão de Crédito
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg opacity-50">
              <RadioGroupItem value="pix" id="pix" disabled />
              <Label htmlFor="pix">PIX (Em breve)</Label>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg opacity-50">
              <RadioGroupItem value="boleto" id="boleto" disabled />
              <Label htmlFor="boleto">Boleto (Em breve)</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Credit Card Form */}
      {paymentMethod === "credit_card" && (
        <Card>
          <CardHeader>
            <CardTitle>Dados do Cartão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="card_number">Número do Cartão</Label>
              <Input
                id="card_number"
                value={cardData.number}
                onChange={(e) => setCardData({
                  ...cardData, 
                  number: formatCardNumber(e.target.value)
                })}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                className={errors.number ? "border-red-500" : ""}
              />
              {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
            </div>

            <div>
              <Label htmlFor="holder_name">Nome no Cartão</Label>
              <Input
                id="holder_name"
                value={cardData.holder_name}
                onChange={(e) => setCardData({
                  ...cardData, 
                  holder_name: e.target.value.toUpperCase()
                })}
                placeholder="NOME COMO NO CARTÃO"
                className={errors.holder_name ? "border-red-500" : ""}
              />
              {errors.holder_name && <p className="text-red-500 text-xs mt-1">{errors.holder_name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Vencimento</Label>
                <Input
                  id="expiry"
                  value={cardData.expiry}
                  onChange={(e) => setCardData({
                    ...cardData, 
                    expiry: formatExpiry(e.target.value)
                  })}
                  placeholder="MM/AA"
                  maxLength={5}
                  className={errors.expiry ? "border-red-500" : ""}
                />
                {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
              </div>
              <div>
                <Label htmlFor="cvc">CVV</Label>
                <Input
                  id="cvc"
                  value={cardData.cvc}
                  onChange={(e) => setCardData({
                    ...cardData, 
                    cvc: e.target.value.replace(/\D/g, "")
                  })}
                  placeholder="123"
                  maxLength={4}
                  className={errors.cvc ? "border-red-500" : ""}
                />
                {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Info */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-800 mb-1">
              Pagamento Seguro
            </h4>
            <p className="text-green-700 text-sm">
              Seus dados são protegidos com criptografia SSL de 256 bits. 
              Processamento via Stripe, líder mundial em segurança de pagamentos.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processando...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Confirmar Pagamento - R$ {currentPrice}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
