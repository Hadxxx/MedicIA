export const Payment = {
  create: async (data) => {
    const newPayment = {
      ...data,
      id: crypto.randomUUID(),
      status: "pendente",
      created_at: new Date().toISOString(),
    };
    localStorage.setItem("lastPayment", JSON.stringify(newPayment));
    return newPayment;
  },

  update: async (id, newData) => {
    const existing = JSON.parse(localStorage.getItem("lastPayment"));
    const updated = { ...existing, ...newData };
    localStorage.setItem("lastPayment", JSON.stringify(updated));
    return updated;
  },

  get: async (id) => {
    return JSON.parse(localStorage.getItem("lastPayment"));
  }
};
