// Core data models

export interface User {
  id: number;
  name: string;
  role: UserRole;
  state?: AgentState;
  callsToday: number;
  avgCallDuration: number;
  totalTalkTime: number;
  completedCalls: number;
  missedCalls?: number;
}

export type UserRole = 'Admin' | 'Supervisor' | 'Agent';

export type AgentState = 'On Call' | 'Available' | 'Wrap-Up' | 'Break' | 'Offline';

export interface Call {
  id: string;
  time: string;
  contact: string;
  direction: 'Inbound' | 'Outbound';
  duration: string;
  disposition: string;
  agent?: string;
  status?: string;
}

export interface SMS {
  id: string;
  time: string;
  contact: string;
  direction: 'Inbound' | 'Outbound';
  message: string;
  status: 'Delivered' | 'Pending' | 'Failed';
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface AppConfig {
  environment: 'production' | 'sandbox';
  integrationStatus: 'connected' | 'disconnected';
  unloggedCallsCount: number;
  showVersionBanner: boolean;
  showSandboxWarning: boolean;
  showConfigWarning: boolean;
}
