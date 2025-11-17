/**
 * Data service for fetching and managing application data
 * TODO: Replace mock data with real API calls
 */

import type { User } from '../types/models';
import Logger from '../utils/logger';

class DataService {
  // Mock data - TODO: Replace with API calls
  private users: User[] = [
    {
      id: 1,
      name: 'John Admin',
      role: 'Admin',
      callsToday: 45,
      avgCallDuration: 324,
      totalTalkTime: 14580,
      completedCalls: 42,
    },
    {
      id: 2,
      name: 'Sarah Supervisor',
      role: 'Supervisor',
      state: 'Available',
      callsToday: 32,
      avgCallDuration: 256,
      totalTalkTime: 8192,
      completedCalls: 30,
    },
    {
      id: 3,
      name: 'Mike Agent',
      role: 'Agent',
      state: 'On Call',
      callsToday: 28,
      avgCallDuration: 298,
      totalTalkTime: 8344,
      completedCalls: 25,
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      role: 'Agent',
      state: 'Available',
      callsToday: 45,
      avgCallDuration: 312,
      totalTalkTime: 14040,
      completedCalls: 42,
    },
    {
      id: 5,
      name: 'Mike Chen',
      role: 'Agent',
      state: 'Wrap-Up',
      callsToday: 38,
      avgCallDuration: 289,
      totalTalkTime: 10982,
      completedCalls: 35,
    },
  ];

  /**
   * Get all users
   */
  async getUsers(): Promise<User[]> {
    try {
      Logger.debug('Fetching users');
      // TODO: Replace with actual API call
      // const response = await fetch('/api/users');
      // return await response.json();

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 100));
      return [...this.users];
    } catch (error) {
      Logger.error('Failed to fetch users', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find((u) => u.id === id);
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: string): Promise<User[]> {
    const users = await this.getUsers();
    return users.filter((u) => u.role === role);
  }

  /**
   * Update user data
   */
  updateUser(userId: number, updates: Partial<User>): void {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      Object.assign(user, updates);
      Logger.debug('User updated', { userId, updates });
    }
  }

  /**
   * Simulate data updates for demo
   */
  simulateDataUpdate(): void {
    const agents = this.users.filter((u) => u.role === 'Agent');
    const states = ['On Call', 'Available', 'Wrap-Up', 'Break'];

    if (agents.length > 0) {
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      randomAgent.state = states[Math.floor(Math.random() * states.length)] as any;
    }

    this.users.forEach((user) => {
      if (Math.random() > 0.7) {
        user.callsToday += 1;
      }
    });

    Logger.debug('Data simulated update completed');
  }
}

// Export singleton instance
export const dataService = new DataService();
export default dataService;
