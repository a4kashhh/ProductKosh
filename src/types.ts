export type NodeType = 
  | 'REQUIREMENT' 
  | 'SERVICE_COMPONENT' 
  | 'API_ENDPOINT' 
  | 'DATABASE_QUERY' 
  | 'GIT_COMMIT' 
  | 'ISSUE_TICKET' 
  | 'AUTOMATED_TEST'
  | 'DISTRIBUTED_TRACE';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  role?: string;
  description: string;
  sourceFile?: string;
  gitHistory?: string;
  relatedIssues?: string[];
  relatedTests?: string[];
  confidence?: number;
  lastModified?: string;
  xPct?: number;
  yPct?: number;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  relationship: string;
}

export interface RequirementItem {
  id: string;
  code: string;
  title: string;
  description: string;
  component: string;
  functionName: string;
  testId: string;
  status: 'VERIFIED' | 'FAILED' | 'IN_PROGRESS';
}

export interface CommitItem {
  hash: string;
  author: string;
  date: string;
  message: string;
  affectedFile: string;
  relatedIssue: string;
  isBugOrigin?: boolean;
}

export interface IncidentItem {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  affectedComponentsCount: number;
  relatedTestsCount: number;
  potentialRisk: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'ACTIVE' | 'INVESTIGATING' | 'RESOLVED';
  description: string;
}
