#  MongoDB Performance Optimization Assignment

## Overview
This project demonstrates how to analyze and optimize slow MongoDB queries
in a high-volume, multi-tenant customer support system.

The focus is on query performance, index design, and full-text search.

---

## Dataset
- Collection: tickets
- Documents inserted: ~100,000
- Each ticket includes tenant, status, priority, timestamps, and text fields

---

## Part 2: Slow Query Analysis

### Query 1: Ticket Listing
This query filtered tickets by tenantId, status, and createdAt, then sorted
by createdAt in descending order.

**Problem (Before Indexing):**
- Full collection scan (COLLSCAN)
- In-memory sort
- 100,000 documents examined

**Fix:**
A compound index was created on:
- tenantId
- status
- createdAt

**Result (After Indexing):**
- Index scan (IXSCAN)
- Only 20 documents examined
- Significant performance improvement

---

### Query 2: Search Using Regex

**Problem:**
- Regex search caused full collection scan
- High CPU usage
- Slow response time

This query remained slow even after indexing because regex cannot use
standard MongoDB indexes.

---

## Part 3: Index Design

### Indexes Created

1. **Tenant Dashboard Index**
   - tenantId + status + createdAt
   - Supports filtering and sorting efficiently

2. **Agent Workload Index**
   - agentId + status
   - Helps fetch tickets assigned to an agent quickly

3. **SLA Index**
   - createdAt
   - Supports time-based escalation queries

4. **Tag Index**
   - tags
   - Enables tag-based filtering

Index field order was chosen based on equality filters first, followed by
range and sort fields.

---

## Part 4: MongoDB Full-Text Search

### Text Index
A native MongoDB text index was created on:
- subject
- description
- tags

This allows fast word-based searching across ticket content.

### Text Search Query
The following query was used to search tickets:

db.tickets.find(
  { $text: { $search: "refund delayed response" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } });

### How MongoDB Text Scoring Works
MongoDB assigns a relevance score based on:
- Frequency of search terms
- Fields in which the terms appear
- Overall document relevance

Documents with higher scores are returned first.

### Why $text Search Is Faster Than Regex
- Uses an inverted index
- Avoids full collection scans
- Lower CPU usage
- Optimized for text searching

### Limitations of Native Text Search
- Only one text index per collection
- No fuzzy or typo matching
- No partial word matching
- Limited compared to MongoDB Atlas Search
