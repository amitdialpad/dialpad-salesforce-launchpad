/**
 * Application constants
 */

export const APP_NAME = 'Dialpad for Salesforce';

export const ROLES = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  AGENT: 'agent',
} as const;

export const AGENT_STATES = {
  ON_CALL: 'On Call',
  AVAILABLE: 'Available',
  WRAP_UP: 'Wrap-Up',
  BREAK: 'Break',
  OFFLINE: 'Offline',
} as const;

export const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds

export const STORAGE_KEYS = {
  CURRENT_ROLE: 'dialpad_current_role',
  APP_STATE: 'dialpad_app_state',
  HAS_SEEN_ONBOARDING: 'dialpad_has_seen_onboarding',
} as const;

export const API_ENDPOINTS = {
  CALLS: '/api/calls',
  SMS: '/api/sms',
  USERS: '/api/users',
  ANALYTICS: '/api/analytics',
} as const;

export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
} as const;
