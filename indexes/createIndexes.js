// Index for ticket listing dashboard 
db.tickets.createIndex({
  tenantId: 1,
  status: 1,
  createdAt: -1
});

// Index for agent workload view
db.tickets.createIndex({
  agentId: 1,
  status: 1
});

// Index for SLA / time-based queries
db.tickets.createIndex({
  createdAt: 1
});

// Index for tag-based filtering
db.tickets.createIndex({
  tags: 1
});
