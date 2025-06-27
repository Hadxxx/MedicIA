import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, CreditCard } from "lucide-react";

export default function CustomerForm({ customer, onSubmit, isLoading }) {
  const [formData, setFormData] = useState(customer || {
    full_name: "",
    email: "",
    phone: "",
    document: "",
    document_type: "cpf",
    address: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipcode: ""
    }
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name) newErrors.full_name = "Nome obrigatório";
    if (!formData.email) newErrors.email = "Email obrigatório";
    if (!formData.phone) newErrors.phone = "Telefone obrigatório";
    if (!formData.document) newErrors.document = "Documento obrigatório";
    
    // Validação de CPF/CNPJ básica
    if (formData.document) {
      const cleanDoc = formData.document.replace(/\D/g, "");
      if (formData.document_type === "cpf" && cleanDoc.length !== 11) {
        newErrors.document = "CPF deve ter 11 dígitos";
      } else if (formData.document_type === "cnpj" && cleanDoc.length !== 14) {
        newErrors.document = "CNPJ deve ter 14 dígitos";
      }
    }

    if (!formData.address.street) newErrors.street = "Endereço obrigatório";
    if (!formData.address.city) newErrors.city = "Cidade obrigatória";
    if (!formData.address.state) newErrors.state = "Estado obrigatório";
    if (!formData.address.zipcode) newErrors.zipcode = "CEP obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const formatDocument = (value, type) => {
    const clean = value.replace(/\D/g, "");
    if (type === "cpf") {
      return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else {
      return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
  };

  const formatPhone = (value) => {
    const clean = value.replace(/\D/g, "");
    return clean.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const formatZipcode = (value) => {
    const clean = value.replace(/\D/g, "");
    return clean.replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Dados Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Nome Completo *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className={errors.full_name ? "border-red-500" : ""}
              />
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="document_type">Tipo de Documento</Label>
              <Select
                value={formData.document_type}
                onValueChange={(value) => setFormData({...formData, document_type: value, document: ""})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpf">CPF</SelectItem>
                  <SelectItem value="cnpj">CNPJ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="document">{formData.document_type === "cpf" ? "CPF" : "CNPJ"} *</Label>
              <Input
                id="document"
                value={formData.document}
                onChange={(e) => setFormData({
                  ...formData, 
                  document: formatDocument(e.target.value, formData.document_type)
                })}
                placeholder={formData.document_type === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"}
                className={errors.document ? "border-red-500" : ""}
              />
              {errors.document && <p className="text-red-500 text-xs mt-1">{errors.document}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})}
                placeholder="(00) 00000-0000"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="street">Rua/Avenida *</Label>
              <Input
                id="street"
                value={formData.address.street}
                onChange={(e) => setFormData({
                  ...formData, 
                  address: {...formData.address, street: e.target.value}
                })}
                className={errors.street ? "border-red-500" : ""}
              />
              {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
            </div>
            <div>
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                value={formData.address.number}
                onChange={(e) => setFormData({
                  ...formData, 
                  address: {...formData.address, number: e.target.value}
                })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={formData.address.complement}
                onChange={(e) => setFormData({
                  ...formData, 
                  address: {...formData.address, complement: e.target.value}
                })}
              />
            </div>
            <div>
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                value={formData.address.neighborhood}
                onChange={(e) => setFormData({
                  ...formData, 
                  address: {...formData.address, neighborhood: e.target.value}
                })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) => setFormData({
                  ...formData, 
                  address: {...formData.address, city: e.target.value}
                })}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
            <div>
              <Label htmlFor="state">Estado *</Label>
              <Input
                id="state"
                value={formData.address.state}
                onChange={(e) => setFormData({
                  ...formData, 
                  address: {...formData.address, state: e.target.value}
                })}
                maxLength={2}
                placeholder="SP"
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>
            <div>
              <Label htmlFor="zipcode">CEP *</Label>
              <Input
                id="zipcode"
                value={formData.address.zipcode}
                onChange={(e) => setFormData({
                  ...formData, 
                  address: {...formData.address, zipcode: formatZipcode(e.target.value)}
                })}
                placeholder="00000-000"
                className={errors.zipcode ? "border-red-500" : ""}
              />
              {errors.zipcode && <p className="text-red-500 text-xs mt-1">{errors.zipcode}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processando...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Continuar para Pagamento
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
