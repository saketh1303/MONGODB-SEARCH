/***************************************
 * Dexkor MongoDB Assignment
 * Queries Used
 ***************************************/

use dexkor;

/* ------------------------------------
   Part 1: Data Verification
------------------------------------ */

// Count total tickets
db.tickets.countDocuments();


/* ------------------------------------
   Part 2: Slow Queries (Before Indexing)
------------------------------------ */

// Query 1: Ticket listing (slow)
db.tickets.find({
  tenantId: "tenant_123",
  status: "open",
  createdAt: { $gte: ISODate("2025-01-01") }
})
.sort({ createdAt: -1 })
.limit(20);

// Explain (before index)
db.tickets.find({
  tenantId: "tenant_123",
  status: "open",
  createdAt: { $gte: ISODate("2025-01-01") }
})
.sort({ createdAt: -1 })
.limit(20)
.explain("executionStats");


// Query 2: Regex search (slow)
db.tickets.find({
  description: { $regex: "refund", $options: "i" }
});

// Explain (before index)
db.tickets.find({
  description: { $regex: "refund", $options: "i" }
})
.explain("executionStats");


/* ------------------------------------
   Part 3: Index Creation
------------------------------------ */

// Ticket dashboard index
db.tickets.createIndex({
  tenantId: 1,
  status: 1,
  createdAt: -1
});

// Agent workload index
db.tickets.createIndex({
  agentId: 1,
  status: 1
});

// SLA escalation index
db.tickets.createIndex({
  createdAt: 1
});

// Tag filtering index
db.tickets.createIndex({
  tags: 1
});


/* ------------------------------------
   Part 2: Queries After Indexing
------------------------------------ */

// Query 1 after indexing
db.tickets.find({
  tenantId: "tenant_123",
  status: "open",
  createdAt: { $gte: ISODate("2025-01-01") }
})
.sort({ createdAt: -1 })
.limit(20)
.explain("executionStats");

// Query 2 after indexing (still slow)
db.tickets.find({
  description: { $regex: "refund", $options: "i" }
})
.explain("executionStats");


/* ------------------------------------
   Part 4: MongoDB Full-Text Search
------------------------------------ */

// Create text index
db.tickets.createIndex({
  subject: "text",
  description: "text",
  tags: "text"
});

// Text search query
db.tickets.find(
  { $text: { $search: "refund delayed response" } },
  { score: { $meta: "textScore" } }
)
.sort({ score: { $meta: "textScore" } });

// Optional explain for text search
db.tickets.find(
  { $text: { $search: "refund delayed response" } }
)
.explain("executionStats");
