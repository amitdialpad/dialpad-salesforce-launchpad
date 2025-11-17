/**
 * Main application entry point
 */

import './styles/main.css';
import store from './state/store';
import roleService from './services/roleService';
import dataService from './services/dataService';
import Logger from './utils/logger';
import { AUTO_REFRESH_INTERVAL } from './utils/constants';

class Application {
  private autoRefreshInterval: number | null = null;
  private currentPage = 'home';

  async init(): Promise<void> {
    try {
      Logger.info('Initializing Dialpad Salesforce Launchpad');

      // Initialize services
      roleService.init();

      // Load initial data
      await this.loadInitialData();

      // Setup event listeners
      this.setupEventListeners();

      // Start auto-refresh
      this.startAutoRefresh();

      // Render initial UI
      this.renderApp();

      Logger.info('Application initialized successfully');
    } catch (error) {
      Logger.error('Failed to initialize application', error);
      this.showErrorMessage('Failed to load application. Please refresh the page.');
    }
  }

  private async loadInitialData(): Promise<void> {
    try {
      store.setState({ isLoading: true });

      const users = await dataService.getUsers();
      store.setState({ users, isLoading: false });

      Logger.info('Initial data loaded', { userCount: users.length });
    } catch (error) {
      Logger.error('Failed to load initial data', error);
      store.setState({ isLoading: false });
      throw error;
    }
  }

  private setupEventListeners(): void {
    // Subscribe to state changes
    store.subscribe((state) => {
      Logger.debug('State changed', { state: JSON.stringify(state) });
      // Trigger re-render when needed
    });

    // Role change handler
    window.addEventListener('roleChanged', () => {
      Logger.info('Role changed, re-rendering');
      this.renderApp();
    });

    // Page visibility handler
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAutoRefresh();
      } else {
        this.startAutoRefresh();
      }
    });
  }

  private startAutoRefresh(): void {
    if (this.autoRefreshInterval) {
      return;
    }

    this.autoRefreshInterval = window.setInterval(() => {
      if (this.currentPage === 'home') {
        dataService.simulateDataUpdate();
        this.refreshHomeData();
      }
    }, AUTO_REFRESH_INTERVAL);

    Logger.debug('Auto-refresh started', { interval: AUTO_REFRESH_INTERVAL });
  }

  private stopAutoRefresh(): void {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
      this.autoRefreshInterval = null;
      Logger.debug('Auto-refresh stopped');
    }
  }

  private async refreshHomeData(): Promise<void> {
    try {
      const users = await dataService.getUsers();
      store.setState({ users });
    } catch (error) {
      Logger.error('Failed to refresh home data', error);
    }
  }

  private renderApp(): void {
    // TODO: Implement actual rendering logic
    // This is a placeholder that will be replaced with proper component rendering
    const content = document.getElementById('main-content');
    if (!content) {
      Logger.error('Main content element not found');
      return;
    }

    const state = store.getState();
    const role = roleService.getRole();

    Logger.info('Rendering app', { page: this.currentPage, role });

    // Temporary placeholder
    content.innerHTML = `
      <div class="slds-container_fluid slds-p-around_large">
        <h1 class="slds-text-heading_large slds-m-bottom_medium">
          Welcome to Dialpad Launchpad (Production-Ready Version)
        </h1>
        <div class="slds-box slds-theme_shade">
          <p class="slds-text-body_regular slds-m-bottom_small">
            <strong>Status:</strong> TypeScript + Vite build system initialized ✓
          </p>
          <p class="slds-text-body_regular slds-m-bottom_small">
            <strong>Current Role:</strong> ${role}
          </p>
          <p class="slds-text-body_regular slds-m-bottom_small">
            <strong>Users Loaded:</strong> ${state.users.length}
          </p>
          <p class="slds-text-body_regular slds-text-color_weak slds-m-top_medium">
            The application is being migrated to a production-ready architecture.
            Component rendering will be implemented in the next phase.
          </p>
        </div>
      </div>
    `;
  }

  private showErrorMessage(message: string): void {
    const content = document.getElementById('main-content');
    if (content) {
      content.innerHTML = `
        <div class="slds-container_fluid slds-p-around_large">
          <div class="slds-notify slds-notify_alert slds-theme_error" role="alert">
            <span class="slds-assistive-text">Error</span>
            <h2>${message}</h2>
          </div>
        </div>
      `;
    }
  }
}

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new Application();
    app.init();
  });
} else {
  const app = new Application();
  app.init();
}

// Export for global access if needed
(window as any).DialpadApp = Application;
