// Application State Manager - Centralized state for demo controls and feature toggles

const AppState = {
    // User onboarding states
    isFirstTimeUser: false,
    hasSeenOnboarding: true,
    onboardingStep: 0,
    showFeatureTour: false,
    tourStep: 0,

    // Package version states
    currentVersion: '2.3.0',
    latestVersion: '2.5.0',
    showVersionBanner: false,
    hasViewedChangelog: false,

    // Environment states
    environment: 'production', // 'production' or 'sandbox'
    hasTestedInSandbox: false,
    showSandboxWarning: false,

    // Alert states
    unloggedCallsCount: 3,
    showUnloggedAlert: true,

    // Integration health states
    integrationStatus: 'connected', // 'connected' or 'disconnected'
    lastSyncTime: new Date(),
    showConfigWarning: false,

    // Quota states
    companyQuota: {
        dailyCallTarget: 100,
        weeklyCallTarget: 500
    },
    agentQuotas: {
        // userId: { made: X, target: Y }
        '1': { made: 45, target: 100, status: 'on-track' },
        '8': { made: 72, target: 100, status: 'on-track' },
        '9': { made: 28, target: 100, status: 'at-risk' },
        '10': { made: 15, target: 100, status: 'behind' }
    },

    // Demo controls
    demoMode: true,
    showDemoControls: false,

    // Date range filtering
    dateRange: 'today', // 'today', 'this-week', 'this-month', 'last-30-days', 'custom'
    customStartDate: null,
    customEndDate: null,

    // Drilldown context for navigation filters
    drilldownContext: null, // { page: 'calls', filter: { status: 'Missed', ... } }

    init() {
        this.loadFromStorage();
        this.attachDemoControlListeners();
    },

    loadFromStorage() {
        const stored = localStorage.getItem('dialpad_app_state');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Only override specific properties from storage
                if (parsed.isFirstTimeUser !== undefined) this.isFirstTimeUser = parsed.isFirstTimeUser;
                if (parsed.hasSeenOnboarding !== undefined) this.hasSeenOnboarding = parsed.hasSeenOnboarding;
                if (parsed.hasTestedInSandbox !== undefined) this.hasTestedInSandbox = parsed.hasTestedInSandbox;
                if (parsed.hasViewedChangelog !== undefined) this.hasViewedChangelog = parsed.hasViewedChangelog;
                if (parsed.environment !== undefined) this.environment = parsed.environment;
            } catch (e) {
                console.warn('Could not load app state from storage');
            }
        }
    },

    save() {
        const stateToSave = {
            isFirstTimeUser: this.isFirstTimeUser,
            hasSeenOnboarding: this.hasSeenOnboarding,
            hasTestedInSandbox: this.hasTestedInSandbox,
            hasViewedChangelog: this.hasViewedChangelog,
            environment: this.environment
        };
        localStorage.setItem('dialpad_app_state', JSON.stringify(stateToSave));
    },

    // State setters with event dispatch
    setFirstTimeUser(value) {
        this.isFirstTimeUser = value;
        this.save();
        this.dispatchStateChange('firstTimeUser', value);
    },

    setOnboardingComplete() {
        this.hasSeenOnboarding = true;
        this.isFirstTimeUser = false;
        this.save();
        this.dispatchStateChange('onboardingComplete', true);
    },

    setUnloggedCallsCount(count) {
        this.unloggedCallsCount = count;
        this.dispatchStateChange('unloggedCalls', count);
    },

    setEnvironment(env) {
        this.environment = env;
        this.save();
        this.dispatchStateChange('environment', env);
    },

    setIntegrationStatus(status) {
        this.integrationStatus = status;
        if (status === 'connected') {
            this.lastSyncTime = new Date();
        }
        this.dispatchStateChange('integrationStatus', status);
    },

    toggleConfigWarning() {
        this.showConfigWarning = !this.showConfigWarning;
        this.dispatchStateChange('configWarning', this.showConfigWarning);
    },

    getLastSyncTime() {
        const now = new Date();
        const diff = now - this.lastSyncTime;
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} min ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    },

    setAgentQuota(userId, made, target) {
        let status = 'on-track';
        const percentComplete = (made / target) * 100;

        if (percentComplete < 50) {
            status = 'behind';
        } else if (percentComplete < 80) {
            status = 'at-risk';
        }

        this.agentQuotas[userId] = { made, target, status };
        this.dispatchStateChange('agentQuota', { userId, made, target, status });
    },

    toggleVersionBanner() {
        this.showVersionBanner = !this.showVersionBanner;
        this.dispatchStateChange('versionBanner', this.showVersionBanner);
    },

    setVersionBanner(show) {
        this.showVersionBanner = show;
        this.dispatchStateChange('versionBanner', this.showVersionBanner);
    },

    toggleSandboxWarning() {
        this.showSandboxWarning = !this.showSandboxWarning;
        this.dispatchStateChange('sandboxWarning', this.showSandboxWarning);
    },

    toggleDemoControls() {
        this.showDemoControls = !this.showDemoControls;
        this.dispatchStateChange('demoControls', this.showDemoControls);
    },

    setDateRange(range, startDate = null, endDate = null) {
        this.dateRange = range;
        if (range === 'custom') {
            this.customStartDate = startDate;
            this.customEndDate = endDate;
        }
        this.dispatchStateChange('dateRange', { range, startDate, endDate });
    },

    setDrilldownContext(page, filter) {
        this.drilldownContext = { page, filter };
        this.dispatchStateChange('drilldownContext', { page, filter });
    },

    clearDrilldownContext() {
        this.drilldownContext = null;
        this.dispatchStateChange('drilldownContext', null);
    },

    getDrilldownContext() {
        return this.drilldownContext;
    },

    getDateRangeLabel() {
        switch(this.dateRange) {
            case 'today': return 'Today';
            case 'this-week': return 'This Week';
            case 'this-month': return 'This Month';
            case 'last-30-days': return 'Last 30 Days';
            case 'custom':
                if (this.customStartDate && this.customEndDate) {
                    return `${this.customStartDate} - ${this.customEndDate}`;
                }
                return 'Custom Range';
            default: return 'Today';
        }
    },

    getDateRangeDates() {
        const now = new Date();
        let startDate, endDate;

        switch(this.dateRange) {
            case 'today':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                endDate = new Date(now.setHours(23, 59, 59, 999));
                break;
            case 'this-week':
                const firstDay = now.getDate() - now.getDay();
                startDate = new Date(now.setDate(firstDay));
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'this-month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date();
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'last-30-days':
                endDate = new Date();
                endDate.setHours(23, 59, 59, 999);
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 30);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'custom':
                if (this.customStartDate && this.customEndDate) {
                    startDate = new Date(this.customStartDate);
                    endDate = new Date(this.customEndDate);
                } else {
                    startDate = new Date(now.setHours(0, 0, 0, 0));
                    endDate = new Date(now.setHours(23, 59, 59, 999));
                }
                break;
            default:
                startDate = new Date(now.setHours(0, 0, 0, 0));
                endDate = new Date(now.setHours(23, 59, 59, 999));
        }

        return { startDate, endDate };
    },

    dispatchStateChange(type, value) {
        window.dispatchEvent(new CustomEvent('appStateChanged', {
            detail: { type, value }
        }));
    },

    attachDemoControlListeners() {
        // Keyboard shortcut: Ctrl+Shift+D to toggle demo controls
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleDemoControls();
            }
        });
    },

    // Get quota status for display
    getQuotaStatus(userId) {
        return this.agentQuotas[userId] || { made: 0, target: this.companyQuota.dailyCallTarget, status: 'on-track' };
    },

    // Check if needs update
    needsUpdate() {
        return this.currentVersion !== this.latestVersion;
    },

    // Get at-risk agents (for supervisor dashboard)
    getAtRiskAgents(users) {
        return users.filter(user => {
            const quota = this.agentQuotas[user.id];
            return quota && (quota.status === 'at-risk' || quota.status === 'behind');
        });
    },

    // Get count of active notifications
    getNotificationCount() {
        let count = 0;

        // Package update available
        if (this.needsUpdate()) count++;

        // Integration disconnected
        if (this.integrationStatus === 'disconnected') count++;

        // Configuration warning
        if (this.showConfigWarning) count++;

        // Unlogged calls
        if (this.unloggedCallsCount > 0) count++;

        return count;
    },

    // Get all active notifications
    getNotifications() {
        const notifications = [];

        // Package update available
        if (this.needsUpdate()) {
            notifications.push({
                id: 'package-update',
                type: 'info',
                icon: 'info',
                title: 'Package Update Available',
                message: `Version ${this.latestVersion} is now available. You are currently on ${this.currentVersion}.`,
                action: 'view-changelog',
                actionLabel: 'View Changelog'
            });
        }

        // Integration disconnected
        if (this.integrationStatus === 'disconnected') {
            notifications.push({
                id: 'integration-disconnected',
                type: 'error',
                icon: 'warning',
                title: 'Integration Disconnected',
                message: 'The Dialpad integration is not connected to Salesforce. Call logging and data sync are disabled.',
                action: 'reconnect',
                actionLabel: 'Reconnect'
            });
        }

        // Configuration warning
        if (this.showConfigWarning) {
            notifications.push({
                id: 'config-warning',
                type: 'warning',
                icon: 'warning',
                title: 'Configuration Notice',
                message: 'Some settings may need review. Check the Settings tab for details.',
                action: 'view-settings',
                actionLabel: 'View Settings'
            });
        }

        // Unlogged calls
        if (this.unloggedCallsCount > 0) {
            notifications.push({
                id: 'unlogged-calls',
                type: 'warning',
                icon: 'warning',
                title: `${this.unloggedCallsCount} Unlogged Call${this.unloggedCallsCount > 1 ? 's' : ''}`,
                message: `These calls have been completed but not logged to Salesforce records:`,
                action: 'review-calls',
                actionLabel: 'Review Calls',
                showCallList: true,
                callCount: this.unloggedCallsCount
            });
        }

        return notifications;
    }
};

// Initialize on load
if (typeof window !== 'undefined') {
    window.AppState = AppState;
}
