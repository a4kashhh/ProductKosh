# ContextForge AI

ContextForge AI is an engineering intelligence platform designed for full-stack microservices architectures and distributed software systems. Unlike conventional AI coding tools that evaluate isolated code files, ContextForge AI aggregates software requirements, microservices architecture, application controllers, database schemas, git history, issue trackers, automated test suites, and OpenTelemetry distributed traces into a unified Engineering Context Knowledge Graph.

## Overview

Modern software engineering involves complex interactions across distributed microservices. Diagnosing systemic issues such as connection leaks, latency spikes, and cascading failures often requires tracing relationships across multiple layers. ContextForge AI provides automated root-cause analysis, dependency impact analysis, and load test validation through an interactive interface.

## Key Features

### 1. Interactive Context Knowledge Graph
- Visualizes entity relationships across eight node types: Requirements, Services, API Endpoints, Database Queries, Commits, Issues, Load Tests, and OpenTelemetry Traces.
- Supports interactive node positioning, panning, zooming, filtering by node type, and inspection of metadata.

### 2. AI Incident and Root-Cause Reasoning Engine
- Performs an eleven-stage automated reasoning traversal (parsing APM logs, tracing connection pools, mapping diffs, verifying SLAs).
- Provides confidence scoring and APM evidence citations.
- Visualizes the causal call path from traffic spikes to downstream timeout errors.

### 3. Microservice Impact and Dependency Propagation Analysis
- Analyzes upstream and downstream dependency ripple effects when modifying application logic or database queries.
- Computes risk metrics for regression probability, API SLA impact, and database load safety.

### 4. Automated Patch Generation and Code Diff Viewer
- Generates type-safe code diffs (such as connection pool recycling via try/finally blocks).
- Integrates a human review and approval workflow before deployment.

### 5. Automated Load Test and Performance Simulator
- Simulates high-throughput traffic load tests (10,000 RPS).
- Demonstrates real-time performance recovery from elevated error rates to full pass rates.

### 6. Requirements Traceability Matrix
- Maps functional and performance SLA requirements directly to API routes, controllers, tests, issues, and commits.

### 7. Executive Engineering Resolution Reports
- Generates structured summary reports containing root-cause analysis, evidence vectors, and validation results.

## Technology Stack

- **Frontend**: React 18, Vite 5, JavaScript (ES6+), Modern CSS3 Design System
- **Typography and Styling**: Custom HUD aesthetics (Orbitron, Rajdhani, JetBrains Mono)
- **Icons and Graphics**: Lucide React Icon Suite, HTML5 Canvas API
- **Domain Logic**: TypeScript definitions, Deterministic Context Graph Engine
- **Build System**: Vite, esbuild, npm

## Getting Started

### Prerequisites

- Node.js version 18.0.0 or higher
- npm version 9.0.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/a4kashhh/contextforge.git
   cd contextforge
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open the application:
   Navigate to `http://localhost:3000/` in your web browser.

### Building for Production

To create a production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## Project Structure

```text
contextforge/
├── index.html                 # HTML entry point
├── package.json               # Package configuration and dependencies
├── vite.config.js             # Vite configuration
├── README.md                  # Project documentation
└── src/
    ├── main.jsx               # Application entry point
    ├── App.jsx                # Core layout and navigation state
    ├── index.css              # Global styles and design system tokens
    ├── types.ts               # Domain types for graph nodes and system data
    ├── data/
    │   └── seedData.js        # Microservices dataset and incident data
    └── components/
        ├── Header.jsx         # Navigation header and project status
        ├── Sidebar.jsx        # Navigation menu and active incident bar
        ├── LandingPage.jsx    # Overview and system pipeline visual
        ├── Dashboard.jsx      # System metrics and active incident overview
        ├── InvestigationView.jsx # Automated reasoning traversal and evidence inspector
        ├── ContextGraph.jsx   # Interactive Canvas graph visualizer
        ├── ImpactAnalysis.jsx # Microservices dependency propagation
        ├── PatchView.jsx      # Code diff viewer and approval controls
        ├── TestSimulator.jsx  # Load test execution and score simulator
        ├── TraceabilityView.jsx # Requirements traceability matrix
        ├── VehicleTopology.jsx# Cloud microservices architecture view
        ├── TimelineView.jsx   # Git commit history and timeline
        ├── AIAssistant.jsx    # Context-aware AI copilot interface
        └── ReportModal.jsx    # Resolution report generator
```

## License

This project is open-source and available under the MIT License.
