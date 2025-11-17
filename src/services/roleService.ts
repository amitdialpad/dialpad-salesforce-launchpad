/**
 * Role management service
 */

import store from '../state/store';
import { STORAGE_KEYS } from '../utils/constants';
import Logger from '../utils/logger';

class RoleService {
  /**
   * Initialize role from localStorage or default
   */
  init(): void {
    const savedRole = localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE);
    if (savedRole) {
      store.setState({ currentRole: savedRole });
      Logger.info('Loaded saved role from localStorage', { role: savedRole });
    }
  }

  /**
   * Get current role
   */
  getRole(): string {
    return store.getState().currentRole;
  }

  /**
   * Set current role and persist to localStorage
   */
  setRole(role: string): void {
    store.setState({ currentRole: role });
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
    Logger.info('Role changed', { role });

    // Dispatch custom event for backward compatibility
    window.dispatchEvent(
      new CustomEvent('roleChanged', {
        detail: { role },
      })
    );
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    return this.getRole() === role;
  }

  /**
   * Check if user has one of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.includes(this.getRole());
  }
}

// Export singleton instance
export const roleService = new RoleService();
export default roleService;
