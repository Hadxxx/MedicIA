export const Consultation = {
  create: async (data) => {
    const newConsultation = {
      ...data,
      id: crypto.randomUUID(),
      status: "em_andamento",
      created_at: new Date().toISOString(),
      chat_messages: [],
      follow_up_chat: [],
    };
    localStorage.setItem("currentConsultation", JSON.stringify(newConsultation));
    return newConsultation;
  },

  update: async (id, newData) => {
    const existing = JSON.parse(localStorage.getItem("currentConsultation"));
    const updated = { ...existing, ...newData };
    localStorage.setItem("currentConsultation", JSON.stringify(updated));
    return updated;
  },

  get: async (id) => {
    return JSON.parse(localStorage.getItem("currentConsultation"));
  }
};
