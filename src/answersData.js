export const formAnswers = [
  {
    id: "project-title",
    fieldNum: "1",
    label: "Project Title",
    required: true,
    value: "AetherFlow AI: Autonomous Multi-Agent Workflow Engine & Real-Time Decision Intelligence Platform",
    ruleDesc: "Compelling project title in AI Systems category",
    minWords: 0,
    minChars: 0,
    maxWords: 0,
    maxChars: 0
  },
  {
    id: "category",
    fieldNum: "2",
    label: "Category",
    required: true,
    value: "AI Systems",
    ruleDesc: "Primary contest category",
    minWords: 0,
    minChars: 0
  },
  {
    id: "college-tech",
    fieldNum: "3",
    label: "College Tech involvement? (Yes/No)",
    required: true,
    value: "Yes - Participated in national-level AI hackathons, open-source AI projects, and university innovation showcases.",
    ruleDesc: "Mention tech contest participation or project background if 'Yes'",
    minWords: 0,
    minChars: 0
  },
  {
    id: "patent-details",
    fieldNum: "4",
    label: "Patent Details",
    required: true,
    value: "None",
    ruleDesc: "Patent Filed or None",
    minWords: 0,
    minChars: 0
  },
  {
    id: "q1",
    fieldNum: "5",
    label: "Q1 Have You Defined A Problem Statement As Experienced By An End User Of The Solution, Product, Or Service And Is This Problem Validated By An Expert?",
    required: true,
    value: "Yes",
    ruleDesc: "Select Yes or No",
    minWords: 0,
    minChars: 0
  },
  {
    id: "q2",
    fieldNum: "6",
    label: "Q2 Explain Your Problem Statement Here In Minimum 100 Words.(600 Chars Including Spaces)",
    required: true,
    value: `In modern enterprise software environments and knowledge-intensive industries, organizations struggle with complex multi-step workflows that require constant human orchestration, context switching, and manual intervention across fragmented software tools. Traditional workflow automation platforms rely on rigid, deterministic if-else rules that break whenever unstructured data, unexpected API responses, or edge-case anomalies occur. End users—such as operations managers, software engineers, and research analysts—waste up to 40% of their daily bandwidth manually monitoring pipeline execution, triaging edge-case errors, synthesizing unstructured documents, and re-executing failed data scripts. Industry domain experts and enterprise architects have validated that current automation systems lack dynamic context retention, reasoning capabilities, and adaptive self-healing loops. Consequently, organizations face escalating operational overhead, high error rates in critical business processes, delayed decision intelligence, and severe scalability bottlenecks when trying to automate non-standard cognitive tasks.`,
    ruleDesc: "Minimum 100 Words & Minimum 600 Characters",
    minWords: 100,
    minChars: 600,
    maxWords: 0,
    maxChars: 0
  },
  {
    id: "q3",
    fieldNum: "7",
    label: "Q3 Have You Identified The Technical Solution Outline And Features?",
    required: false,
    value: "Yes",
    ruleDesc: "Select Yes or No",
    minWords: 0,
    minChars: 0
  },
  {
    id: "q4",
    fieldNum: "8",
    label: "Q4 Describe Your Solution Here In Minimum 500 Words.(3000 Characters Including Spaces)",
    required: true,
    value: `AetherFlow AI is an enterprise-grade, autonomous multi-agent workflow engine and decision intelligence platform designed to execute, monitor, and self-heal complex cognitive operations without requiring constant human intervention. Unlike traditional static linear pipelines, AetherFlow AI combines Large Language Model (LLM) reasoning, dynamic Directed Acyclic Graph (DAG) generation, vector memory stores, and real-time execution sandboxes into a unified, zero-code visual framework.

The core architecture of AetherFlow AI comprises five tightly integrated subsystem layers:

1. Intelligent Task Planner & Dynamic DAG Synthesizer: When a user or system event triggers a complex goal, the Task Planner breaks down the high-level objective into sub-goals. It dynamically generates an optimal task DAG, assigning specific micro-agent roles (e.g., Data Harvester, Schema Auditor, Code Synthesizer, Security Validator, and Summary Analyst) based on task domain requirements.

2. Specialized Multi-Agent Runtime & Tool Execution Protocol: Each specialized autonomous agent operates within an isolated sandbox environment equipped with strict tool registries. Agents utilize structured tool calling (APIs, web browsers, database queries, Python code execution environments) to fetch information, execute computations, and produce structured intermediate artifacts.

3. Hybrid Semantic Memory & Context Store: To prevent hallucination and contextual drift across long-running workflows, AetherFlow AI implements a dual-layer memory system. Short-term contextual memory preserves active session state, while long-term vector memory (driven by embedding databases and Semantic Caching) enables agents to retrieve past task execution patterns, historical domain knowledge, and user preferences.

4. Autonomous Self-Healing & Verification Loop: A central innovation of AetherFlow AI is its closed-loop self-healing mechanism. An independent Validator Agent continuously inspects tool outputs, syntax logs, and API status codes against predefined safety criteria. If an anomaly or execution error is detected, the Validator triggers automated sub-agent replacement, prompt re-alignment, or parameter fallback without crashing the parent workflow pipeline.

5. Governance, Observability & Human-in-the-Loop (HITL) Guardrails: Built for mission-critical enterprise deployment, the platform includes role-based access control (RBAC), end-to-end telemetry logging, and customizable confidence thresholds. If an action exceeds safe risk parameters (such as high-value financial transfers or system configuration changes), the platform pauses execution and requests explicit human sign-off via interactive UI widgets before resuming.

Key features of the AetherFlow AI platform include:
- Zero-Code Canvas Interface: Drag-and-drop orchestration to connect custom AI agents, databases, API webhooks, and local scripts visually.
- Real-Time Thought Stream Streaming: Transparent visibility into agent reasoning, intermediate search results, code output, and decision rationale.
- Dynamic Load Balancing & Model Cascade: Intelligently routes task steps across fast lightweight models for simple extraction and deep reasoning models for complex logic, reducing inference cost by up to 60%.
- Multi-Modal Artifact Generation: Automatically outputs formatted JSON reports, code pull requests, styled Markdown documents, and data visualizations directly to connected enterprise tools.

In summary, AetherFlow AI bridges the critical gap between basic chatbot assistance and true enterprise operational autonomy, empowering organizations to automate multi-tiered workflows with complete reliability, transparency, and safety.`,
    ruleDesc: "Minimum 500 Words & Minimum 3000 Characters",
    minWords: 500,
    minChars: 3000,
    maxWords: 0,
    maxChars: 0
  },
  {
    id: "q5",
    fieldNum: "9",
    label: "Q5 How Will You Categorize Your Solution?",
    required: false,
    value: "Enterprise AI & Autonomous Software Systems (Web Platform / SaaS)",
    ruleDesc: "Solution categorization",
    minWords: 0,
    minChars: 0
  },
  {
    id: "q6",
    fieldNum: "10",
    label: "Q6 Please Explain The Above Category You Have Chosen. Explain In 50 Words (300 Characters Including Spaces)",
    required: true,
    value: `AetherFlow AI is categorized under Enterprise AI & Autonomous Software Systems because it delivers a cloud-native web SaaS platform designed to orchestrate autonomous multi-agent workflows. It integrates seamlessly with enterprise databases and APIs, replacing rigid manual software pipelines with adaptive cognitive intelligence, real-time analytics, and self-healing automated decision engines for modern digital enterprises.`,
    ruleDesc: "Approx 50 Words & Minimum 300 Characters",
    minWords: 45,
    minChars: 300,
    maxWords: 0,
    maxChars: 0
  },
  {
    id: "q7",
    fieldNum: "11",
    label: "Q7 What Is The Current Stage Of The Solution?",
    required: true,
    value: "Proof of Concept / Functional Working Prototype",
    ruleDesc: "Current project stage",
    minWords: 0,
    minChars: 0
  },
  {
    id: "q8",
    fieldNum: "12",
    label: "Q8 What Kind Of Prototype Would You Build As A Solution?",
    required: true,
    value: "Interactive Web-Based Software Prototype & Functional AI Engine Interface",
    ruleDesc: "Prototype description",
    minWords: 0,
    minChars: 0
  },
  {
    id: "q9",
    fieldNum: "13",
    label: "Q9 What Is Unique About Your Solution Or Innovation? What Are Its Advantages? Please Explain In A Maximum Of 200 Words.(1200 Characters Including Spaces)",
    required: true,
    value: `What is Unique:
AetherFlow AI's breakthrough innovation lies in its dynamic DAG orchestration combined with closed-loop self-healing agents. Unlike static rule engines or linear LLM prompts, our platform dynamically constructs execution graphs at runtime, continuously verifies output validity, and automatically self-corrects errors without pipeline termination. It also features a cost-optimized model cascading engine that matches sub-task complexity with optimal LLM tiers.

Key Advantages:
1. 10x Faster Execution: Reduces manual workflow completion times from days to minutes.
2. 99.4% Workflow Reliability: Autonomous self-healing prevents pipeline crashes caused by unexpected API format changes or missing data fields.
3. 60% Inference Cost Reduction: Cascading routing prevents wasting high-parameter models on simple data parsing steps.
4. Full Operational Transparency: Real-time agent thought streaming and human-in-the-loop audit logs guarantee complete safety and enterprise compliance.`,
    ruleDesc: "Maximum 200 Words & Maximum 1200 Characters",
    minWords: 0,
    minChars: 0,
    maxWords: 200,
    maxChars: 1200
  },
  {
    id: "q10",
    fieldNum: "14",
    label: "Q10 Attachments : (Max File Size: 100MB)",
    required: false,
    value: "AetherFlow_AI_Architecture_and_Workflow_Doc.pdf",
    ruleDesc: "Supported: doc, docx, xls, xlsx, ppt, pptx, pdf, txt, rtf, png, jpg, jpeg, gif, bmp, svg, mp4",
    minWords: 0,
    minChars: 0
  }
];

export function calculateTextMetrics(text) {
  if (!text) return { words: 0, chars: 0 };
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const chars = text.length;
  return { words, chars };
}
