/**
 * Centralized state management store
 */

import type { User, AppConfig, Notification } from '../types/models';
import Logger from '../utils/logger';

interface AppState {
  currentRole: string;
  currentUser: User | null;
  users: User[];
  notifications: Notification[];
  config: AppConfig;
  isLoading: boolean;
}

type StateListener = (state: AppState) => void;

class Store {
  private state: AppState;
  private listeners: Set<StateListener> = new Set();

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): AppState {
    return {
      currentRole: 'admin',
      currentUser: null,
      users: [],
      notifications: [],
      config: {
        environment: 'production',
        integrationStatus: 'connected',
        unloggedCallsCount: 3,
        showVersionBanner: true,
        showSandboxWarning: true,
        showConfigWarning: false,
      },
      isLoading: false,
    };
  }

  /**
   * Get current state
   */
  getState(): Readonly<AppState> {
    return { ...this.state };
  }

  /**
   * Update state and notify listeners
   */
  setState(updates: Partial<AppState>): void {
    const prevState = this.state;
    this.state = { ...this.state, ...updates };

    Logger.debug('State updated', {
      updates,
      prevState,
      newState: this.state,
    });

    this.notifyListeners();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getState());
      } catch (error) {
        Logger.error('Error in state listener', error);
      }
    });
  }

  /**
   * Reset state to initial values
   */
  reset(): void {
    this.state = this.getInitialState();
    this.notifyListeners();
  }
}

// Export singleton instance
export const store = new Store();
export default store;
