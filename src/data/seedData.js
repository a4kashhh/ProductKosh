export const systemStats = {
  loc: "48,321 LOC",
  functions: 1284, // API Endpoints & Functions
  tests: 427,     // E2E & Integration Tests
  dependencies: 163, // Microservices & NPM Dependencies
  commits: 2891,  // Git Commits
  issues: 314,    // GitHub Issues / Jira Tickets
  reliabilityScore: "95.2%",
  testCoverage: "88%",
  dependencyRisk: "LOW",
  securityRisk: "LOW",
  architectureRisk: "MEDIUM",
  regressionRisk: "LOW",
  aiConfidence: 93
};

export const activeIncident = {
  id: "INC-2026-7719",
  title: "Cascading 504 Gateway Timeout & Database Connection Pool Exhaustion under Peak Traffic",
  severity: "CRITICAL",
  confidence: 93,
  affectedComponentsCount: 4,
  relatedTestsCount: 18,
  potentialRisk: "HIGH",
  status: "ACTIVE",
  description: "High-throughput API token validation requests (10,000 RPS) trigger cascading 504 Gateway Timeouts across the microservices architecture due to a leaked PostgreSQL connection pool client in AuthService.validateToken() when Redis cache misses occur."
};

export const requirementsList = [
  {
    id: "req-1",
    code: "REQ-104",
    title: "Sub-200ms Auth Token Validation SLA under 10k RPS",
    description: "The API Gateway and Auth Service shall validate incoming JWT bearer tokens within 200ms at 99.9th percentile latency under 10,000 requests per second.",
    component: "AuthService",
    functionName: "validateToken()",
    testId: "TEST-AUTH-092",
    status: "FAILED"
  },
  {
    id: "req-2",
    code: "REQ-088",
    title: "Database Connection Pool Auto-Recycling & Timeout Guard",
    description: "PostgreSQL client pool shall automatically recycle idle connections after 3000ms and throw explicit pool exhaustion exceptions without blocking main event loop.",
    component: "DatabasePool",
    functionName: "pgPool.acquire()",
    testId: "TEST-DB-014",
    status: "VERIFIED"
  },
  {
    id: "req-3",
    code: "REQ-209",
    title: "Redis Distributed Session Cache Fallback Circuit Breaker",
    description: "If Redis cluster latency exceeds 50ms, Auth Service must fallback gracefully to memory-cached public key verification.",
    component: "CacheLayer",
    functionName: "RedisCluster.get()",
    testId: "TEST-REDIS-003",
    status: "VERIFIED"
  },
  {
    id: "req-4",
    code: "REQ-140",
    title: "OpenTelemetry Distributed Trace Propagation",
    description: "All incoming HTTP requests must inject traceparent headers across API Gateway, Auth Service, and User Database calls.",
    component: "APIGateway",
    functionName: "TelemetryMiddleware()",
    testId: "TEST-TRACE-001",
    status: "VERIFIED"
  }
];

export const gitCommitsList = [
  {
    hash: "c91f04",
    author: "A. Vance <a.vance@cloud-fullstack.com>",
    date: "2026-03-02 15:10",
    message: "refactor(auth): bypass Redis cache on token verification miss to fetch user roles",
    affectedFile: "services/auth-service/src/controllers/tokenController.ts",
    relatedIssue: "BUG-3049",
    isBugOrigin: true
  },
  {
    hash: "e88d12",
    author: "J. Miller <j.miller@cloud-fullstack.com>",
    date: "2026-02-20 11:45",
    message: "feat(gateway): enable HTTP/2 multiplexing for microservice API gateway",
    affectedFile: "services/api-gateway/src/router.ts",
    relatedIssue: "FEAT-1029",
    isBugOrigin: false
  }
];

export const timelineEvents = [
  { date: "2026-01-15", label: "Full-Stack Microservices V5.0 Released", type: "refactor" },
  { date: "2026-02-10", label: "Issue BUG-3049 filed: High latency spike under load", type: "issue" },
  { date: "2026-03-02", label: "Commit c91f04 merged: Bypass Redis cache on token miss", type: "regression", highlight: true },
  { date: "2026-03-04", label: "CI Load Test flagged 504 Gateway Timeouts", type: "incident", highlight: true },
  { date: "2026-03-05", label: "Current incident INC-2026-7719 logged: DB Pool Exhaustion", type: "critical", highlight: true }
];

export const graphNodesList = [
  {
    id: "n-req104",
    label: "REQ-104",
    type: "REQUIREMENT",
    description: "Sub-200ms Auth Token Validation SLA under 10k RPS requirement.",
    sourceFile: "docs/specs/REQ-104.md",
    confidence: 100,
    lastModified: "2026-01-15",
    xPct: 0.1, yPct: 0.25
  },
  {
    id: "n-comp-gateway",
    label: "API Gateway",
    type: "SERVICE_COMPONENT",
    description: "Express / Next.js Microservices API Gateway Router.",
    sourceFile: "services/api-gateway/src/router.ts",
    confidence: 98,
    lastModified: "2026-02-20",
    xPct: 0.35, yPct: 0.15
  },
  {
    id: "n-func-validate",
    label: "validateToken()",
    type: "API_ENDPOINT",
    description: "Validates incoming JWT token & fetches permissions.",
    sourceFile: "services/auth-service/src/controllers/tokenController.ts:L48",
    gitHistory: "Commit c91f04 (A. Vance)",
    relatedIssues: ["BUG-3049", "INC-2026-7719"],
    relatedTests: ["TEST-AUTH-092"],
    confidence: 93,
    lastModified: "2026-03-02",
    xPct: 0.55, yPct: 0.2
  },
  {
    id: "n-comp-auth",
    label: "Auth Service",
    type: "SERVICE_COMPONENT",
    description: "Node.js JWT Authentication & RBAC Microservice.",
    sourceFile: "services/auth-service/src/app.ts",
    confidence: 96,
    lastModified: "2026-03-02",
    xPct: 0.35, yPct: 0.5
  },
  {
    id: "n-db-query",
    label: "PostgreSQL Pool",
    type: "DATABASE_QUERY",
    description: "SELECT * FROM users WHERE token = $1 (Connection Pool Exhausted)",
    sourceFile: "services/auth-service/src/db/client.ts:L22",
    gitHistory: "Commit c91f04",
    confidence: 95,
    lastModified: "2026-03-02",
    xPct: 0.6, yPct: 0.55
  },
  {
    id: "n-commit-c91f04",
    label: "Commit c91f04",
    type: "GIT_COMMIT",
    description: "refactor(auth): bypass Redis cache on token verification miss (introduced connection leak)",
    sourceFile: "git:c91f0492a1",
    confidence: 99,
    lastModified: "2026-03-02",
    xPct: 0.78, yPct: 0.22
  },
  {
    id: "n-issue-3049",
    label: "Issue BUG-3049",
    type: "ISSUE_TICKET",
    description: "504 Gateway Timeout during peak traffic spikes",
    confidence: 94,
    lastModified: "2026-02-10",
    xPct: 0.82, yPct: 0.5
  },
  {
    id: "n-test-auth92",
    label: "TEST-AUTH-092",
    type: "AUTOMATED_TEST",
    description: "K6 Load Test: 10,000 RPS token verification benchmark",
    sourceFile: "tests/load/auth_benchmark.k6.js:L34",
    confidence: 100,
    lastModified: "2026-01-20",
    xPct: 0.62, yPct: 0.8
  },
  {
    id: "n-log-trace",
    label: "APM Trace #TR-9901",
    type: "DISTRIBUTED_TRACE",
    description: "HTTP 504 Gateway Timeout | FATAL: remaining connection slots reserved",
    sourceFile: "logs/opentelemetry/trace_9901.json",
    confidence: 100,
    lastModified: "2026-03-05",
    xPct: 0.35, yPct: 0.85
  }
];

export const graphEdgesList = [
  { from: "n-req104", to: "n-comp-gateway", relationship: "SPECIFIES_SLA" },
  { from: "n-comp-gateway", to: "n-func-validate", relationship: "ROUTES_TO" },
  { from: "n-comp-auth", to: "n-func-validate", relationship: "CONTAINS" },
  { from: "n-func-validate", to: "n-db-query", relationship: "EXHAUSTS_POOL" },
  { from: "n-func-validate", to: "n-commit-c91f04", relationship: "MODIFIED_BY" },
  { from: "n-commit-c91f04", to: "n-issue-3049", relationship: "ASSOCIATED_WITH" },
  { from: "n-test-auth92", to: "n-func-validate", relationship: "LOAD_TESTS" },
  { from: "n-log-trace", to: "n-db-query", relationship: "OBSERVES_FAIL" }
];

export const originalCodeSnippet = `// File: services/auth-service/src/controllers/tokenController.ts
export async function validateToken(req: Request, res: Response) {
    const token = req.headers.authorization?.split(' ')[1];
    
    // COMMIT c91f04: Bypasses Redis cache on miss to query DB directly
    // BUG ORIGIN: Acquires DB pool client without try/finally release block!
    const client = await pgPool.connect(); // <-- LEAKED CONNECTION HERE
    const user = await client.query('SELECT * FROM users WHERE token = $1', [token]);

    if (!user.rows.length) {
        return res.status(401).json({ error: 'Invalid Token' });
        // MISSING client.release() ON EARLY RETURN!
    }

    return res.status(200).json({ user: user.rows[0] });
    // MISSING client.release() BEFORE RETURN!
}`;

export const patchedCodeSnippet = `// File: services/auth-service/src/controllers/tokenController.ts (AI-PROPOSED PATCH)
export async function validateToken(req: Request, res: Response) {
    const token = req.headers.authorization?.split(' ')[1];
    
    // FIX: Always acquire DB client within a try/finally block to guarantee release
    const client = await pgPool.connect();
    try {
        const user = await client.query('SELECT * FROM users WHERE token = $1', [token]);
        if (!user.rows.length) {
            return res.status(401).json({ error: 'Invalid Token' });
        }
        return res.status(200).json({ user: user.rows[0] });
    } finally {
        client.release(); // SAFE RECOVERY: Guarantees connection returned to pool!
    }
}`;
