// Realistic data generator for Dexkor tickets

const statuses = ["open", "pending", "resolved", "closed"];
const priorities = ["low", "medium", "high"];
const tagsPool = ["refund", "delay", "payment", "bug", "login", "urgent"];

let tickets = [];

for (let i = 1; i <= 50000; i++) {
  tickets.push({
    tenantId: "tenant_123",
    ticketNumber: "TICKET-" + i,
    subject: "Support issue #" + i,
    description: i % 4 === 0
      ? "Customer asked for refund due to delayed response"
      : "General support request",
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    tags: [tagsPool[i % tagsPool.length]],
    customerEmail: `customer${i}@email.com`,
    agentId: "agent_" + (i % 15),
    createdAt: new Date(2025, 0, (i % 28) + 1),
    updatedAt: new Date()
  });
}

// Insert into MongoDB
db.tickets.insertMany(tickets);
