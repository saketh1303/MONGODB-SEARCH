
db.tickets.find({
  tenantId: "tenant_123",
  status: "open",
  createdAt: { $gte: ISODate("2025-01-01") }
})
.sort({ createdAt: -1 })
.limit(20)
.explain("executionStats");

// Query 2
db.tickets.find({
  description: { $regex: "refund", $options: "i" }
})
.explain("executionStats");
