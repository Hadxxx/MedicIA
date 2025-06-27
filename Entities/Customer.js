export const Customer = {
  create: async (data) => {
    const newCustomer = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    localStorage.setItem("currentCustomer", JSON.stringify(newCustomer));
    return newCustomer;
  },

  update: async (id, newData) => {
    const existing = JSON.parse(localStorage.getItem("currentCustomer"));
    const updated = { ...existing, ...newData };
    localStorage.setItem("currentCustomer", JSON.stringify(updated));
    return updated;
  },

  get: async (id) => {
    return JSON.parse(localStorage.getItem("currentCustomer"));
  }
};
