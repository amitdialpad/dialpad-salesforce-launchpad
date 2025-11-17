// Main App Logic - Handles navigation and page rendering

const App = {
    currentPage: 'home',

    async init() {
        // Initialize data service
        await DataService.init();

        // Initialize role manager
        RoleManager.init();

        // Update tab visibility based on role
        this.updateTabVisibility();

        // Initialize app state
        AppState.init();

        // Attach navigation listeners
        this.attachNavigationListeners();

        // Attach demo control listeners
        this.attachDemoControlListeners();

        // Attach notification listeners
        this.attachNotificationListeners();

        // Listen for role changes
        window.addEventListener('roleChanged', () => {
            this.updateTabVisibility();
            this.renderCurrentPage();
        });

        // Listen for app state changes
        window.addEventListener('appStateChanged', (e) => {
            this.handleStateChange(e.detail);
        });

        // Start auto-refresh
        this.startAutoRefresh();

        // Render initial page
        this.renderPage('home');

        // Show onboarding if first time user
        if (AppState.isFirstTimeUser && !AppState.hasSeenOnboarding) {
            setTimeout(() => this.showOnboardingModal(), 1000);
        }
    },

    startAutoRefresh() {
        setInterval(() => {
            // Only auto-refresh on home page
            if (this.currentPage === 'home') {
                this.simulateDataUpdate();
                this.renderCurrentPage();
            }
        }, 30000); // Refresh every 30 seconds
    },

    simulateDataUpdate() {
        // Randomly update some metrics to simulate real-time changes
        const users = DataService.users;

        // Randomly change 1-2 agent states
        const agents = users.filter(u => u.role === 'Agent');
        const states = ['On Call', 'Available', 'Wrap-Up', 'Break'];

        if (agents.length > 0) {
            const randomAgent = agents[Math.floor(Math.random() * agents.length)];
            randomAgent.state = states[Math.floor(Math.random() * states.length)];
        }

        // Slightly increase call counts
        users.forEach(user => {
            if (Math.random() > 0.7) { // 30% chance
                user.callsToday += 1;
            }
        });
    },

    attachNavigationListeners() {
        const tabs = document.querySelectorAll('[data-page]');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                this.renderPage(page);
            });
        });
    },

    renderPage(page) {
        this.currentPage = page;

        // Update alert banners
        this.renderAlertBanners();

        // Update notification badge
        this.updateNotificationBadge();

        // Update active tab in context bar
        document.querySelectorAll('.slds-context-bar__item[data-page], .slds-context-bar__item a[data-page]').forEach(item => {
            const contextBarItem = item.hasAttribute('data-page') ? item.parentElement : item;
            if (contextBarItem && contextBarItem.classList.contains('slds-context-bar__item')) {
                contextBarItem.classList.remove('slds-is-active');
            }
        });
        const activeLink = document.querySelector(`[data-page="${page}"]`);
        if (activeLink) {
            const activeTab = activeLink.closest('.slds-context-bar__item');
            if (activeTab) {
                activeTab.classList.add('slds-is-active');
            }
        }

        // Show loading state
        const content = document.getElementById('main-content');
        content.innerHTML = this.renderLoadingState();

        // Simulate loading delay for realistic feel
        setTimeout(() => {
            const role = RoleManager.getRole();

            switch(page) {
                case 'home':
                    content.innerHTML = this.renderHomePage(role);
                    this.renderHomeCharts(role);
                    break;
                case 'calls':
                    content.innerHTML = this.renderCallsPage(role);
                    setTimeout(() => this.attachCallsPageListeners(), 0);
                    break;
                case 'sms':
                    content.innerHTML = this.renderSmsPage(role);
                    break;
                case 'powerdialer':
                    content.innerHTML = this.renderPowerdialerPage(role);
                    break;
                case 'reports':
                    content.innerHTML = this.renderReportsPage(role);
                    break;
                case 'settings':
                    content.innerHTML = this.renderSettingsPage(role);
                    setTimeout(() => this.attachSettingsPageListeners(), 0);
                    break;
                case 'voicemail':
                    content.innerHTML = this.renderComingSoonPage('Voicemail', 'View and manage your voicemail messages with transcription and playback.');
                    break;
                case 'recordings':
                    content.innerHTML = this.renderComingSoonPage('Recordings', 'Access and search all call recordings with filters and sharing options.');
                    break;
                case 'contacts':
                    content.innerHTML = this.renderComingSoonPage('Contacts', 'Standard Salesforce Contacts view with click-to-dial integration.');
                    break;
                case 'accounts':
                    content.innerHTML = this.renderComingSoonPage('Accounts', 'Standard Salesforce Accounts view with communication history.');
                    break;
                case 'leads':
                    content.innerHTML = this.renderComingSoonPage('Leads', 'Standard Salesforce Leads view with call tracking and conversion.');
                    break;
                case 'opportunities':
                    content.innerHTML = this.renderComingSoonPage('Opportunities', 'Standard Salesforce Opportunities view with call insights.');
                    break;
                case 'analytics':
                    content.innerHTML = this.renderComingSoonPage('Analytics', 'Advanced analytics with AI-powered insights, predictions, and trends.');
                    break;
                case 'team':
                    content.innerHTML = this.renderComingSoonPage('Team', 'Manage team members, assign quotas, and view real-time agent status.');
                    break;
                default:
                    content.innerHTML = '<p>Page not found</p>';
            }

            // Re-attach notification listeners after page render
            setTimeout(() => this.attachNotificationListeners(), 0);
        }, 300);
    },

    renderAlertBanners() {
        const bannersContainer = document.getElementById('alert-banners');
        if (!bannersContainer) return;

        let bannersHTML = '';

        // Package version banner - Using SLDS scoped notification for proper contrast
        if (AppState.showVersionBanner && AppState.needsUpdate()) {
            bannersHTML += `
                <div class="slds-scoped-notification slds-scoped-notification_light version-banner" role="status">
                    <div class="version-banner__content">
                        <div class="slds-media slds-media_center">
                            <div class="slds-media__figure">
                                <span class="slds-icon_container slds-icon-utility-info" title="information">
                                    <svg class="slds-icon slds-icon-text-default slds-icon_small" aria-hidden="true">
                                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#info"></use>
                                    </svg>
                                </span>
                            </div>
                            <div class="slds-media__body">
                                <p>
                                    <strong>New Version Available: ${AppState.latestVersion}</strong>
                                    <span class="slds-m-left_xx-small">
                                        You're currently on version ${AppState.currentVersion}.
                                    </span>
                                    <a href="#" id="view-changelog-link" class="slds-m-left_xx-small">
                                        View what's new
                                    </a>
                                    <span class="slds-m-horizontal_xx-small">|</span>
                                    <a href="#" id="update-package-link">
                                        Update now
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="version-banner__dismiss">
                        <a href="#" id="close-version-banner" class="slds-text-link">Dismiss</a>
                    </div>
                </div>
            `;
        }

        // Sandbox warning banner - Using SLDS scoped notification with warning theme
        if (AppState.showSandboxWarning && AppState.environment === 'production' && !AppState.hasTestedInSandbox) {
            bannersHTML += `
                <div class="slds-scoped-notification slds-media slds-media_center slds-theme_warning" role="alert">
                    <div class="slds-media__figure">
                        <span class="slds-icon_container" title="warning" style="font-size: 1.5rem; color: #706e6b;">
                            ⚠
                        </span>
                    </div>
                    <div class="slds-media__body">
                        <p>
                            <strong>Testing in Production Environment</strong>
                            <span class="slds-m-left_xx-small">
                                We strongly recommend testing package updates in a Sandbox environment first.
                            </span>
                            <a href="#" id="sandbox-guide-link" class="slds-m-left_xx-small">
                                Learn how
                            </a>
                        </p>
                    </div>
                    <div class="slds-media__figure slds-media__figure_reverse">
                        <button class="slds-button slds-button_icon slds-button_icon-border" id="close-sandbox-warning" title="Dismiss">
                            <span class="slds-icon_container">
                                <span aria-hidden="true">✕</span>
                            </span>
                            <span class="slds-assistive-text">Dismiss</span>
                        </button>
                    </div>
                </div>
            `;
        }

        bannersContainer.innerHTML = bannersHTML;

        // Attach banner event listeners
        setTimeout(() => {
            const changelogLink = document.getElementById('view-changelog-link');
            if (changelogLink) {
                changelogLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showChangelogModal();
                });
            }

            const updateLink = document.getElementById('update-package-link');
            if (updateLink) {
                updateLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    alert('In a real implementation, this would redirect to Salesforce AppExchange or package installation page.');
                });
            }

            const closeVersionBtn = document.getElementById('close-version-banner');
            if (closeVersionBtn) {
                closeVersionBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    AppState.showVersionBanner = false;
                    this.renderAlertBanners();
                });
            }

            const closeSandboxBtn = document.getElementById('close-sandbox-warning');
            if (closeSandboxBtn) {
                closeSandboxBtn.addEventListener('click', () => {
                    AppState.showSandboxWarning = false;
                    this.renderAlertBanners();
                });
            }

            const sandboxGuideLink = document.getElementById('sandbox-guide-link');
            if (sandboxGuideLink) {
                sandboxGuideLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    alert('Sandbox Testing Guide:\n\n1. Create a Sandbox copy of your Production org\n2. Install the latest package version in Sandbox\n3. Test all features thoroughly\n4. Once verified, install in Production\n\nThis prevents any issues from affecting your live environment.');
                });
            }
        }, 0);
    },

    updateNotificationBadge() {
        const count = AppState.getNotificationCount();
        const badge = document.getElementById('notification-badge');

        if (badge) {
            badge.textContent = count;
            if (count > 0) {
                badge.classList.remove('slds-hide');
            } else {
                badge.classList.add('slds-hide');
            }
        }
    },

    renderNotifications() {
        const notifications = AppState.getNotifications();
        const notificationsList = document.getElementById('notifications-list');

        if (!notificationsList) return;

        if (notifications.length === 0) {
            notificationsList.innerHTML = `
                <li class="slds-dropdown__item" role="presentation">
                    <div class="slds-text-align_center slds-p-around_medium">
                        <p class="slds-text-body_small slds-text-color_weak">No notifications</p>
                    </div>
                </li>
            `;
            return;
        }

        notificationsList.innerHTML = notifications.map(notification => {
            let iconColor = '#0176d3';
            let textColorClass = 'slds-text-color_default';
            if (notification.type === 'error') {
                iconColor = '#c23934';
                textColorClass = 'slds-text-color_error';
            }
            if (notification.type === 'warning') {
                iconColor = '#fe9339';
                textColorClass = 'slds-text-color_error';
            }

            // If this is unlogged calls notification, show the call list
            let callListHTML = '';
            if (notification.showCallList) {
                const unloggedCalls = DataService.getUnloggedCalls(notification.callCount);
                callListHTML = `
                    <div class="slds-box slds-box_x-small slds-theme_shade slds-m-vertical_x-small">
                        ${unloggedCalls.map((call, index) => `
                            <div class="slds-p-vertical_x-small ${index < unloggedCalls.length - 1 ? 'slds-border_bottom' : ''}">
                                <div class="slds-grid slds-grid_vertical-align-start">
                                    <div class="slds-col slds-has-flexi-truncate">
                                        <p class="slds-text-body_small slds-text-title slds-m-bottom_xxx-small">${call.contact}</p>
                                        <p class="slds-text-body_small slds-text-color_weak">
                                            ${call.userName} • ${DataService.formatTimestamp(call.timestamp)}
                                        </p>
                                    </div>
                                    <div class="slds-col slds-no-flex slds-text-align_right">
                                        <p class="slds-text-body_small slds-text-title ${textColorClass} slds-m-bottom_xxx-small">${DataService.formatDuration(call.duration)}</p>
                                        <p class="slds-text-body_small slds-text-color_weak">${call.direction}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            return `
                <li class="slds-dropdown__item" role="presentation">
                    <div class="slds-media slds-media_center slds-p-around_small slds-border_bottom">
                        <div class="slds-media__figure">
                            <span class="slds-icon_container" style="background-color: ${iconColor};">
                                <svg class="slds-icon slds-icon_x-small slds-icon-text-default" aria-hidden="true">
                                    <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#${notification.icon}"></use>
                                </svg>
                            </span>
                        </div>
                        <div class="slds-media__body">
                            <p class="slds-text-body_small slds-text-title slds-m-bottom_xxx-small">${notification.title}</p>
                            <p class="slds-text-body_small slds-text-color_weak slds-m-bottom_x-small">${notification.message}</p>
                            ${callListHTML}
                            <button class="slds-button slds-button_neutral slds-button_stretch" data-notification-action="${notification.action}">
                                ${notification.actionLabel}
                            </button>
                        </div>
                    </div>
                </li>
            `;
        }).join('');

        // Attach action listeners
        setTimeout(() => {
            document.querySelectorAll('[data-notification-action]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = e.target.getAttribute('data-notification-action');
                    this.handleNotificationAction(action);
                });
            });
        }, 0);
    },

    handleNotificationAction(action) {
        const dropdown = document.getElementById('notifications-dropdown');

        // Close dropdown
        if (dropdown) {
            dropdown.classList.add('slds-hide');
        }

        switch(action) {
            case 'view-changelog':
                this.showChangelogModal();
                break;
            case 'reconnect':
                alert('This would open the integration settings to reconnect the Dialpad integration to Salesforce.');
                break;
            case 'view-settings':
                this.renderPage('settings');
                break;
            case 'review-calls':
                alert('This would show a list of unlogged calls to review and log manually.');
                break;
        }
    },

    renderLoadingState() {
        return `
            <div class="loading-container">
                <div role="status" class="slds-spinner slds-spinner_medium slds-spinner_brand">
                    <span class="slds-assistive-text">Loading...</span>
                    <div class="slds-spinner__dot-a"></div>
                    <div class="slds-spinner__dot-b"></div>
                </div>
                <p class="slds-text-align_center slds-m-top_medium">Loading...</p>
            </div>
        `;
    },

    renderCurrentPage() {
        this.renderPage(this.currentPage);
    },

    renderHomePage(role) {
        if (role === 'admin') {
            return this.renderAdminDashboard();
        } else if (role === 'supervisor') {
            return this.renderSupervisorDashboard();
        } else {
            return this.renderAgentDashboard();
        }
    },

    renderAdminDashboard() {
        const metrics = DataService.getMetrics('admin');
        const users = DataService.getUsers('admin');

        return `
            <div class="slds-page-header">
                <div class="slds-page-header__row">
                    <div class="slds-page-header__col-title">
                        <div class="slds-media">
                            <div class="slds-media__body">
                                <h1 class="slds-page-header__title slds-truncate" title="Admin Dashboard">Admin Dashboard</h1>
                                <p class="slds-page-header__meta-text">Last updated: ${new Date().toLocaleTimeString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="slds-card metric-card">
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="metric-label">Calls Today</div>
                        <div class="metric-value">${metrics.callsToday}</div>
                        <div class="metric-subtext">+12% vs yesterday</div>
                    </div>
                </div>
                <div class="slds-card metric-card">
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="metric-label">Active Users</div>
                        <div class="metric-value">${metrics.activeUsers}</div>
                        <div class="metric-subtext">${metrics.connectedUsers} connected</div>
                    </div>
                </div>
                <div class="slds-card metric-card">
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="metric-label">Avg Call Duration</div>
                        <div class="metric-value">${DataService.formatDuration(metrics.avgCallDuration)}</div>
                        <div class="metric-subtext">Across all calls</div>
                    </div>
                </div>
                <div class="slds-card metric-card">
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="metric-label">Missed Calls</div>
                        <div class="metric-value">${metrics.missedCalls}</div>
                        <div class="metric-subtext">${Math.round((metrics.missedCalls / metrics.callsToday) * 100)}% of total</div>
                    </div>
                </div>
                <div class="slds-card metric-card">
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="metric-label">Pickup Rate</div>
                        <div class="metric-value">${Math.round(((metrics.callsToday - metrics.missedCalls) / metrics.callsToday) * 100)}%</div>
                        <div class="metric-subtext metric-positive">Above target</div>
                    </div>
                </div>
                <div class="slds-card metric-card">
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="metric-label">Avg Wait Time</div>
                        <div class="metric-value">45s</div>
                        <div class="metric-subtext">Before pickup</div>
                    </div>
                </div>
                <div class="slds-card metric-card">
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="metric-label">SLA Compliance</div>
                        <div class="metric-value">94%</div>
                        <div class="metric-subtext metric-positive">Target: 90%</div>
                    </div>
                </div>
                <div class="slds-card metric-card">
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="metric-label">Calls This Week</div>
                        <div class="metric-value">${metrics.callsThisWeek}</div>
                        <div class="metric-subtext">Across all users</div>
                    </div>
                </div>
            </div>

            <div class="slds-grid slds-wrap slds-gutters">
                <div class="slds-col slds-size_1-of-1 slds-medium-size_2-of-3">
                    <div class="slds-card">
                        <div class="slds-card__header slds-grid">
                            <header class="slds-media slds-media_center slds-has-flexi-truncate">
                                <div class="slds-media__body">
                                    <h2 class="slds-card__header-title">User Status</h2>
                                </div>
                            </header>
                        </div>
                        <div class="slds-card__body slds-card__body_inner">
                            <table class="slds-table slds-table_bordered slds-table_cell-buffer">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Role</th>
                                        <th scope="col">Department</th>
                                        <th scope="col">State</th>
                                        <th scope="col">Calls</th>
                                        <th scope="col">Pickup Rate</th>
                                        <th scope="col">Avg Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${users.map(user => {
                                        const stateClass = this.getAgentStateClass(user.state);
                                        return `
                                            <tr>
                                                <td>${user.name}</td>
                                                <td>${user.role}</td>
                                                <td>${user.department}</td>
                                                <td>
                                                    <span class="slds-badge ${stateClass}">
                                                        ${user.state || 'Offline'}
                                                    </span>
                                                </td>
                                                <td>${user.callsToday}</td>
                                                <td>${user.pickupRate ? user.pickupRate + '%' : 'N/A'}</td>
                                                <td>${user.avgCallDuration ? DataService.formatDuration(user.avgCallDuration) : 'N/A'}</td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-3">
                    ${this.renderUnloggedCallsAlert()}
                </div>
            </div>

            <div class="slds-grid slds-wrap slds-gutters slds-m-top_medium">
                <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-2">
                    <div class="slds-card">
                        <div class="slds-card__header slds-grid">
                            <header class="slds-media slds-media_center slds-has-flexi-truncate">
                                <div class="slds-media__body">
                                    <h2 class="slds-card__header-title">Calls by Department</h2>
                                </div>
                            </header>
                        </div>
                        <div class="slds-card__body slds-card__body_inner">
                            <canvas id="admin-chart-dept" height="250"></canvas>
                        </div>
                    </div>
                </div>
                <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-2">
                    <div class="slds-card">
                        <div class="slds-card__header slds-grid">
                            <header class="slds-media slds-media_center slds-has-flexi-truncate">
                                <div class="slds-media__body">
                                    <h2 class="slds-card__header-title">Calls Over Time</h2>
                                </div>
                            </header>
                        </div>
                        <div class="slds-card__body slds-card__body_inner">
                            <canvas id="admin-chart-time" height="250"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <div class="slds-grid slds-wrap slds-gutters slds-m-top_medium">
                <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-2">
                    <div class="slds-card">
                        <div class="slds-card__header slds-grid">
                            <header class="slds-media slds-media_center slds-has-flexi-truncate">
                                <div class="slds-media__body">
                                    <h2 class="slds-card__header-title">Agent Performance</h2>
                                </div>
                            </header>
                        </div>
                        <div class="slds-card__body slds-card__body_inner">
                            <canvas id="admin-chart-agents" height="300"></canvas>
                        </div>
                    </div>
                </div>
                <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-2">
                    <div class="slds-card">
                        <div class="slds-card__header slds-grid">
                            <header class="slds-media slds-media_center slds-has-flexi-truncate">
                                <div class="slds-media__body">
                                    <h2 class="slds-card__header-title">Call Direction Split</h2>
                                </div>
                            </header>
                        </div>
                        <div class="slds-card__body slds-card__body_inner">
                            <canvas id="admin-chart-direction" height="250"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <div class="slds-grid slds-wrap slds-gutters slds-m-top_medium">
                <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-2">
                    <div class="slds-card">
                        <div class="slds-card__header slds-grid">
                            <header class="slds-media slds-media_center slds-has-flexi-truncate">
                                <div class="slds-media__body">
                                    <h2 class="slds-card__header-title">Call Dispositions</h2>
                                </div>
                            </header>
                        </div>
                        <div class="slds-card__body slds-card__body_inner">
                            <canvas id="admin-chart-dispositions" height="250"></canvas>
                        </div>
                    </div>
                </div>
                <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-2">
                    <div class="slds-card">
                        <div class="slds-card__header slds-grid">
                            <header class="slds-media slds-media_center slds-has-flexi-truncate">
                                <div class="slds-media__body">
                                    <h2 class="slds-card__header-title">Calls by Office</h2>
                                </div>
                            </header>
                        </div>
                        <div class="slds-card__body slds-card__body_inner">
                            <canvas id="admin-chart-office" height="250"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderSupervisorDashboard() {
        const metrics = DataService.getMetrics('supervisor');
        const calls = DataService.getCalls('supervisor').slice(0, 10);
        const lists = DataService.getLists('supervisor').filter(l => l.status === 'Active');

        return `
            <div class="slds-page-header">
                <div class="slds-page-header__row">
                    <div class="slds-page-header__col-title">
                        <div class="slds-media">
                            <div class="slds-media__body">
                                <h1 class="slds-page-header__title slds-truncate" title="Supervisor Dashboard">Supervisor Dashboard</h1>
                                <p class="slds-page-header__meta-text">Last updated: ${new Date().toLocaleTimeString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="slds-card metric-card">
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="metric-label">Team Calls Today</div>
                        <div class="metric-value">${metrics.callsToday}</div>
                    </div>
                </div>
                <div class="slds-card metric-card">
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="metric-label">Avg Call Duration</div>
                        <div class="metric-value">${DataService.formatDuration(metrics.avgCallDuration)}</div>
                    </div>
                </div>
                <div class="slds-card metric-card">
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="metric-label">Missed Calls</div>
                        <div class="metric-value">${metrics.missedCalls}</div>
                    </div>
                </div>
                <div class="slds-card metric-card">
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="metric-label">Team Size</div>
                        <div class="metric-value">${metrics.teamSize}</div>
                    </div>
                </div>
            </div>

            <div class="slds-grid slds-wrap slds-gutters">
                <div class="slds-col slds-size_1-of-1 slds-medium-size_2-of-3">
                    <div class="slds-card">
                        <div class="slds-card__header slds-grid">
                            <header class="slds-media slds-media_center slds-has-flexi-truncate">
                                <div class="slds-media__body">
                                    <h2 class="slds-card__header-title">Recent Team Calls</h2>
                                </div>
                            </header>
                        </div>
                        <div class="slds-card__body slds-card__body_inner">
                            <table class="slds-table slds-table_bordered slds-table_cell-buffer">
                                <thead>
                                    <tr>
                                        <th scope="col">Time</th>
                                        <th scope="col">Contact</th>
                                        <th scope="col">Agent</th>
                                        <th scope="col">Duration</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${calls.map(call => `
                                        <tr>
                                            <td>${DataService.formatTimestamp(call.timestamp)}</td>
                                            <td>${call.contact}</td>
                                            <td>${call.userName}</td>
                                            <td>${DataService.formatDuration(call.duration)}</td>
                                            <td>${call.status}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-3">
                    ${this.renderAtRiskAgents()}
                    ${this.renderTeamAlerts()}
                    ${this.renderCoachingOpportunities()}
                </div>
            </div>

            <div class="slds-grid slds-wrap slds-gutters slds-m-top_medium">
                <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-2">
                    <div class="slds-card">
                        <div class="slds-card__header slds-grid">
                            <header class="slds-media slds-media_center slds-has-flexi-truncate">
                                <div class="slds-media__body">
                                    <h2 class="slds-card__header-title">Team Calls Over Time</h2>
                                </div>
                            </header>
                        </div>
                        <div class="slds-card__body slds-card__body_inner">
                            <canvas id="supervisor-chart-time" height="250"></canvas>
                        </div>
                    </div>
                </div>
                <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-2">
                    <div class="slds-card">
                        <div class="slds-card__header slds-grid">
                            <header class="slds-media slds-media_center slds-has-flexi-truncate">
                                <div class="slds-media__body">
                                    <h2 class="slds-card__header-title">Call Dispositions</h2>
                                </div>
                            </header>
                        </div>
                        <div class="slds-card__body slds-card__body_inner">
                            <canvas id="supervisor-chart-dispositions" height="250"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <div class="slds-grid slds-wrap slds-gutters slds-m-top_medium">
                <div class="slds-col slds-size_1-of-1">
                    <div class="slds-card">
                        <div class="slds-card__header slds-grid">
                            <header class="slds-media slds-media_center slds-has-flexi-truncate">
                                <div class="slds-media__body">
                                    <h2 class="slds-card__header-title">Agent Performance Comparison</h2>
                                </div>
                            </header>
                        </div>
                        <div class="slds-card__body slds-card__body_inner">
                            <canvas id="supervisor-chart-agents" height="300"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderAgentDashboard() {
        const metrics = DataService.getMetrics('agent');
        const calls = DataService.getCalls('agent').slice(0, 10);
        const lists = DataService.getLists('agent');

        return `
            <div class="slds-page-header">
                <div class="slds-page-header__row">
                    <div class="slds-page-header__col-title">
                        <div class="slds-media">
                            <div class="slds-media__body">
                                <h1 class="slds-page-header__title slds-truncate" title="My Dashboard">My Dashboard</h1>
                                <p class="slds-page-header__meta-text">Last updated: ${new Date().toLocaleTimeString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="slds-card metric-card">
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="metric-label">Calls Today</div>
                        <div class="metric-value">${metrics.callsToday}</div>
                    </div>
                </div>
                <div class="slds-card metric-card">
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="metric-label">Avg Duration</div>
                        <div class="metric-value">${DataService.formatDuration(metrics.avgCallDuration)}</div>
                    </div>
                </div>
                <div class="slds-card metric-card">
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="metric-label">Total Talk Time</div>
                        <div class="metric-value">${DataService.formatDuration(metrics.totalTalkTime)}</div>
                    </div>
                </div>
                <div class="slds-card metric-card">
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="metric-label">Completed</div>
                        <div class="metric-value">${metrics.completedCalls}</div>
                    </div>
                </div>
            </div>

            <div class="slds-grid slds-wrap slds-gutters">
                <div class="slds-col slds-size_1-of-1 slds-medium-size_2-of-3">
                    ${this.renderQuotaProgress()}

                    <div class="slds-card slds-m-top_medium">
                        <div class="slds-card__header slds-grid">
                            <header class="slds-media slds-media_center slds-has-flexi-truncate">
                                <div class="slds-media__body">
                                    <h2 class="slds-card__header-title">My Recent Calls</h2>
                                </div>
                            </header>
                        </div>
                        <div class="slds-card__body slds-card__body_inner">
                            <table class="slds-table slds-table_bordered slds-table_cell-buffer">
                                <thead>
                                    <tr>
                                        <th scope="col">Time</th>
                                        <th scope="col">Contact</th>
                                        <th scope="col">Direction</th>
                                        <th scope="col">Duration</th>
                                        <th scope="col">Disposition</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${calls.map(call => `
                                        <tr>
                                            <td>${DataService.formatTimestamp(call.timestamp)}</td>
                                            <td>${call.contact}</td>
                                            <td>${call.direction}</td>
                                            <td>${DataService.formatDuration(call.duration)}</td>
                                            <td>${call.disposition}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-3">
                    ${this.renderUnloggedCallsAlert()}
                    ${this.renderTodaysTasks()}
                    ${this.renderQuickActions()}
                </div>
            </div>

            <div class="slds-grid slds-wrap slds-gutters slds-m-top_medium">
                <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-2">
                    <div class="slds-card">
                        <div class="slds-card__header slds-grid">
                            <header class="slds-media slds-media_center slds-has-flexi-truncate">
                                <div class="slds-media__body">
                                    <h2 class="slds-card__header-title">My Calls Over Time</h2>
                                </div>
                            </header>
                        </div>
                        <div class="slds-card__body slds-card__body_inner">
                            <canvas id="agent-chart-time" height="250"></canvas>
                        </div>
                    </div>
                </div>
                <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-2">
                    <div class="slds-card">
                        <div class="slds-card__header slds-grid">
                            <header class="slds-media slds-media_center slds-has-flexi-truncate">
                                <div class="slds-media__body">
                                    <h2 class="slds-card__header-title">My Call Direction</h2>
                                </div>
                            </header>
                        </div>
                        <div class="slds-card__body slds-card__body_inner">
                            <canvas id="agent-chart-direction" height="250"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderCallsPage(role) {
        const calls = DataService.getCalls(role);

        return `
            <div class="slds-page-header">
                <div class="slds-page-header__row">
                    <div class="slds-page-header__col-title">
                        <div class="slds-media">
                            <div class="slds-media__body">
                                <h1 class="slds-page-header__title slds-truncate" title="Calls">Calls</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="filters-section">
                <div class="slds-grid slds-wrap slds-gutters">
                    <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-5">
                        <label class="slds-form-element__label">Search</label>
                        <input type="text" id="filter-search" class="slds-input" placeholder="Search contact or agent..." />
                    </div>
                    <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-5">
                        <label class="slds-form-element__label">Date</label>
                        <input type="date" id="filter-date" class="slds-input" />
                    </div>
                    <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-5">
                        <label class="slds-form-element__label">Status</label>
                        <select id="filter-status" class="slds-select">
                            <option value="">All</option>
                            <option value="Completed">Completed</option>
                            <option value="Missed">Missed</option>
                        </select>
                    </div>
                    <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-5">
                        <label class="slds-form-element__label">Direction</label>
                        <select id="filter-direction" class="slds-select">
                            <option value="">All</option>
                            <option value="Inbound">Inbound</option>
                            <option value="Outbound">Outbound</option>
                        </select>
                    </div>
                    <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-5">
                        <label class="slds-form-element__label">&nbsp;</label>
                        <button class="slds-button slds-button_neutral" id="clear-filters">Clear Filters</button>
                    </div>
                </div>
            </div>

            <div class="slds-card">
                <div class="slds-card__header slds-grid">
                    <header class="slds-media slds-media_center slds-has-flexi-truncate">
                        <div class="slds-media__body">
                            <h2 class="slds-card__header-title" id="calls-count">Call History (${calls.length} records)</h2>
                        </div>
                    </header>
                    <div class="slds-no-flex">
                        <button class="slds-button slds-button_neutral" id="export-calls">Export</button>
                    </div>
                </div>
                <div class="slds-card__body">
                    <table class="slds-table slds-table_bordered slds-table_cell-buffer">
                        <thead>
                            <tr>
                                <th scope="col" class="sortable" data-sort="timestamp">Time <span class="sort-indicator"></span></th>
                                <th scope="col" class="sortable" data-sort="contact">Contact <span class="sort-indicator"></span></th>
                                <th scope="col" class="sortable" data-sort="direction">Direction <span class="sort-indicator"></span></th>
                                <th scope="col" class="sortable" data-sort="duration">Duration <span class="sort-indicator"></span></th>
                                <th scope="col" class="sortable" data-sort="status">Status <span class="sort-indicator"></span></th>
                                <th scope="col" class="sortable" data-sort="disposition">Disposition <span class="sort-indicator"></span></th>
                                ${role !== 'agent' ? '<th scope="col" class="sortable" data-sort="userName">User <span class="sort-indicator"></span></th>' : ''}
                            </tr>
                        </thead>
                        <tbody id="calls-table-body">
                            ${calls.map(call => `
                                <tr>
                                    <td>${DataService.formatTimestamp(call.timestamp)}</td>
                                    <td>${call.contact}</td>
                                    <td>${call.direction}</td>
                                    <td>${DataService.formatDuration(call.duration)}</td>
                                    <td>${call.status}</td>
                                    <td>${call.disposition}</td>
                                    ${role !== 'agent' ? `<td>${call.userName}</td>` : ''}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderSmsPage(role) {
        return `
            <div class="slds-page-header">
                <div class="slds-page-header__row">
                    <div class="slds-page-header__col-title">
                        <div class="slds-media">
                            <div class="slds-media__body">
                                <h1 class="slds-page-header__title slds-truncate" title="SMS">SMS</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="slds-card">
                <div class="slds-card__body slds-card__body_inner">
                    <p>SMS page - Similar structure to Calls page</p>
                    <p>Would show SMS message history with role-based filtering</p>
                </div>
            </div>
        `;
    },

    renderPowerdialerPage(role) {
        const lists = DataService.getLists(role);

        if (role === 'agent') {
            return `
                <div class="slds-page-header">
                    <div class="slds-page-header__row">
                        <div class="slds-page-header__col-title">
                            <div class="slds-media">
                                <div class="slds-media__body">
                                    <h1 class="slds-page-header__title slds-truncate" title="Powerdialer">Powerdialer</h1>
                                </div>
                            </div>
                        </div>
                        </div>
                </div>

                <div class="slds-grid slds-wrap slds-gutters">
                    <div class="slds-col slds-size_1-of-1 slds-medium-size_2-of-3">
                        <div class="slds-card">
                            <div class="slds-card__header slds-grid">
                                <header class="slds-media slds-media_center slds-has-flexi-truncate">
                                    <div class="slds-media__body">
                                        <h2 class="slds-card__header-title">My Assigned Lists</h2>
                                    </div>
                                </header>
                            </div>
                            <div class="slds-card__body slds-card__body_inner">
                                <table class="slds-table slds-table_bordered slds-table_cell-buffer">
                                    <thead>
                                        <tr>
                                            <th scope="col">List Name</th>
                                            <th scope="col">Total Contacts</th>
                                            <th scope="col">Completed</th>
                                            <th scope="col">Progress</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${lists.map(list => {
                                            const progress = Math.round((list.completedContacts / list.totalContacts) * 100);
                                            return `
                                                <tr>
                                                    <td>${list.name}</td>
                                                    <td>${list.totalContacts}</td>
                                                    <td>${list.completedContacts}</td>
                                                    <td>${progress}%</td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-3">
                        <div class="slds-card">
                            <div class="slds-card__header slds-grid">
                                <header class="slds-media slds-media_center slds-has-flexi-truncate">
                                    <div class="slds-media__body">
                                        <h2 class="slds-card__header-title">Next Up</h2>
                                    </div>
                                </header>
                            </div>
                            <div class="slds-card__body slds-card__body_inner">
                                <strong>John Smith</strong><br>
                                Company: Acme Corp<br>
                                Phone: (415) 555-0123<br>
                                List: Q4 Prospects<br><br>
                                <button class="slds-button slds-button_brand">Call Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Supervisor/Admin view
            return `
                <div class="slds-page-header">
                    <div class="slds-page-header__row">
                        <div class="slds-page-header__col-title">
                            <div class="slds-media">
                                <div class="slds-media__body">
                                    <h1 class="slds-page-header__title slds-truncate" title="Powerdialer">Powerdialer</h1>
                                </div>
                            </div>
                        </div>
                        <div class="slds-page-header__col-actions">
                            <div class="slds-page-header__controls">
                                <div class="slds-page-header__control">
                                    <button id="notifications-trigger" class="slds-button slds-button_neutral">
                                        Notifications${AppState.getNotificationCount() > 0 ? ` <span class="slds-badge slds-badge_inverse slds-badge_small">${AppState.getNotificationCount()}</span>` : ''}
                                    </button>
                                </div>
                                <div class="slds-page-header__control">
                                    <button class="slds-button slds-button_brand">Create List</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="slds-card">
                    <div class="slds-card__header slds-grid">
                        <header class="slds-media slds-media_center slds-has-flexi-truncate">
                            <div class="slds-media__body">
                                <h2 class="slds-card__header-title">Manage Lists</h2>
                            </div>
                        </header>
                    </div>
                    <div class="slds-card__body">
                        <table class="slds-table slds-table_bordered slds-table_cell-buffer">
                            <thead>
                                <tr>
                                    <th scope="col">List Name</th>
                                    <th scope="col">Total Contacts</th>
                                    <th scope="col">Completed</th>
                                    <th scope="col">Assigned Agents</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${lists.map(list => {
                                    const progress = Math.round((list.completedContacts / list.totalContacts) * 100);
                                    return `
                                        <tr>
                                            <td>${list.name}</td>
                                            <td>${list.totalContacts}</td>
                                            <td>${list.completedContacts} (${progress}%)</td>
                                            <td>${list.assignedAgents.length}</td>
                                            <td><span class="slds-badge">${list.status}</span></td>
                                            <td>
                                                <button class="slds-button slds-button_neutral">Edit</button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }
    },

    renderSettingsPage(role) {
        if (role !== 'admin') {
            return `
                <div class="slds-page-header">
                    <div class="slds-page-header__row">
                        <div class="slds-page-header__col-title">
                            <div class="slds-media">
                                <div class="slds-media__body">
                                    <h1 class="slds-page-header__title slds-truncate" title="Settings">Settings</h1>
                                </div>
                            </div>
                        </div>
                        </div>
                </div>

                <div class="slds-card">
                    <div class="slds-card__body slds-card__body_inner">
                        <p>Settings are only accessible to administrators.</p>
                    </div>
                </div>
            `;
        }

        return `
            <div class="slds-page-header">
                <div class="slds-page-header__row">
                    <div class="slds-page-header__col-title">
                        <div class="slds-media">
                            <div class="slds-media__body">
                                <h1 class="slds-page-header__title slds-truncate" title="Settings">Settings</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="slds-card">
                <div class="slds-card__header slds-grid">
                    <header class="slds-media slds-media_center slds-has-flexi-truncate">
                        <div class="slds-media__body">
                            <h2 class="slds-card__header-title">Call Logging Settings</h2>
                        </div>
                    </header>
                </div>
                <div class="slds-card__body slds-card__body_inner">
                    <div class="slds-form">
                        <div class="slds-form-element">
                            <label class="slds-checkbox_toggle">
                                <input type="checkbox" checked />
                                <span class="slds-checkbox_faux_container">
                                    <span class="slds-checkbox_faux"></span>
                                    <span class="slds-checkbox_on">Enabled</span>
                                    <span class="slds-checkbox_off">Disabled</span>
                                </span>
                                <span class="slds-form-element__label">Auto-log all calls</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="slds-card slds-m-top_medium">
                <div class="slds-card__header slds-grid">
                    <header class="slds-media slds-media_center slds-has-flexi-truncate">
                        <div class="slds-media__body">
                            <h2 class="slds-card__header-title">Quota Configuration</h2>
                        </div>
                    </header>
                </div>
                <div class="slds-card__body slds-card__body_inner">
                    <div class="slds-form slds-form_stacked">
                        <div class="slds-form-element">
                            <label class="slds-form-element__label" for="daily-quota">
                                Daily Call Target (per agent)
                            </label>
                            <div class="slds-form-element__control">
                                <input type="number" id="daily-quota" class="slds-input"
                                    value="${AppState.companyQuota.dailyCallTarget}"
                                    min="0" max="500" />
                            </div>
                            <div class="slds-form-element__help">
                                Default daily call target for all agents
                            </div>
                        </div>

                        <div class="slds-form-element slds-m-top_medium">
                            <label class="slds-form-element__label" for="weekly-quota">
                                Weekly Call Target (per agent)
                            </label>
                            <div class="slds-form-element__control">
                                <input type="number" id="weekly-quota" class="slds-input"
                                    value="${AppState.companyQuota.weeklyCallTarget}"
                                    min="0" max="2000" />
                            </div>
                            <div class="slds-form-element__help">
                                Default weekly call target for all agents
                            </div>
                        </div>

                        <div class="slds-form-element slds-m-top_medium">
                            <label class="slds-checkbox_toggle">
                                <input type="checkbox" id="quota-tracking-enabled" checked />
                                <span class="slds-checkbox_faux_container">
                                    <span class="slds-checkbox_faux"></span>
                                    <span class="slds-checkbox_on">Enabled</span>
                                    <span class="slds-checkbox_off">Disabled</span>
                                </span>
                                <span class="slds-form-element__label">Enable Quota Tracking</span>
                            </label>
                            <div class="slds-form-element__help">
                                Show quota progress on agent dashboards and at-risk alerts for supervisors
                            </div>
                        </div>

                        <div class="slds-m-top_medium">
                            <button class="slds-button slds-button_brand" id="save-quota-settings">
                                Save Quota Settings
                            </button>
                            <button class="slds-button slds-button_neutral slds-m-left_small" id="reset-quota-settings">
                                Reset to Defaults
                            </button>
                        </div>

                        <div class="slds-box slds-box_x-small slds-theme_info slds-m-top_medium">
                            <p class="slds-text-body_small">
                                <strong>Note:</strong> Individual agent quotas can be customized.
                                These defaults apply to new agents or agents without custom targets.
                                Changes will be reflected in agent dashboards and supervisor coaching views.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="slds-card slds-m-top_medium">
                <div class="slds-card__header slds-grid">
                    <header class="slds-media slds-media_center slds-has-flexi-truncate">
                        <div class="slds-media__body">
                            <h2 class="slds-card__header-title">Integration Status</h2>
                        </div>
                    </header>
                </div>
                <div class="slds-card__body slds-card__body_inner">
                    <p>Status: <span class="slds-badge status-connected">Connected</span></p>
                    <p>Last Sync: Nov 17, 2025 3:45 PM</p>
                </div>
            </div>
        `;
    },

    renderHomeCharts(role) {
        // Destroy existing charts first
        ChartsService.destroyAll();

        // Wait for DOM to be ready, then render charts
        setTimeout(() => {
            const calls = DataService.getCalls(role);
            const users = DataService.getUsers(role);

            if (role === 'admin') {
                ChartsService.createCallsByDepartmentChart('admin-chart-dept', calls);
                ChartsService.createCallsOverTimeChart('admin-chart-time', calls);
                ChartsService.createAgentPerformanceChart('admin-chart-agents', users, calls);
                ChartsService.createCallDirectionChart('admin-chart-direction', calls);
                ChartsService.createDispositionsChart('admin-chart-dispositions', calls);
                ChartsService.createCallsByOfficeChart('admin-chart-office', calls);

                // Attach admin dashboard widget listeners
                this.attachAdminDashboardWidgetListeners();
            } else if (role === 'supervisor') {
                ChartsService.createCallsOverTimeChart('supervisor-chart-time', calls);
                ChartsService.createDispositionsChart('supervisor-chart-dispositions', calls);
                ChartsService.createAgentPerformanceChart('supervisor-chart-agents', users, calls);
            } else {
                ChartsService.createCallsOverTimeChart('agent-chart-time', calls);
                ChartsService.createCallDirectionChart('agent-chart-direction', calls);
            }
        }, 100);
    },

    attachAdminDashboardWidgetListeners() {
        // View Changelog button in Package Update widget
        const changelogWidgetBtn = document.getElementById('view-changelog-widget');
        if (changelogWidgetBtn) {
            changelogWidgetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showChangelogModal();
            });
        }
    },

    renderReportsPage(role) {
        const reports = this.getReportsForRole(role);

        return `
            <div class="slds-page-header">
                <div class="slds-page-header__row">
                    <div class="slds-page-header__col-title">
                        <div class="slds-media">
                            <div class="slds-media__body">
                                <h1 class="slds-page-header__title slds-truncate" title="Reports Library">Reports Library</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="slds-grid slds-wrap slds-gutters">
                ${reports.map(report => `
                    <div class="slds-col slds-size_1-of-1 slds-medium-size_1-of-2 slds-large-size_1-of-3">
                        <div class="slds-card">
                            <div class="slds-card__header slds-grid">
                                <header class="slds-media slds-media_center slds-has-flexi-truncate">
                                    <div class="slds-media__body">
                                        <h2 class="slds-card__header-title">${report.name}</h2>
                                    </div>
                                </header>
                            </div>
                            <div class="slds-card__body slds-card__body_inner">
                                <p class="slds-m-bottom_small">${report.description}</p>
                                <p class="slds-text-color_weak slds-m-bottom_medium">
                                    <small>Category: ${report.category}</small>
                                </p>
                                <div class="slds-grid slds-grid_align-spread">
                                    <button class="slds-button slds-button_brand">Run Report</button>
                                    <button class="slds-button slds-button_neutral">Customize</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    getReportsForRole(role) {
        const allReports = [
            // Call Activity Reports
            { name: 'Call Volume by Time', category: 'Call Activity', description: 'Analyze call patterns throughout the day', roles: ['admin', 'supervisor', 'agent'] },
            { name: 'Call Duration Analysis', category: 'Call Activity', description: 'Average and total call duration metrics', roles: ['admin', 'supervisor', 'agent'] },
            { name: 'Missed Calls Report', category: 'Call Activity', description: 'Track and analyze missed call trends', roles: ['admin', 'supervisor'] },
            { name: 'Call Disposition Summary', category: 'Call Activity', description: 'Breakdown of call outcomes and dispositions', roles: ['admin', 'supervisor', 'agent'] },
            { name: 'Inbound vs Outbound', category: 'Call Activity', description: 'Compare inbound and outbound call metrics', roles: ['admin', 'supervisor'] },
            { name: 'Peak Hours Analysis', category: 'Call Activity', description: 'Identify busiest calling hours', roles: ['admin', 'supervisor'] },

            // Agent Performance Reports
            { name: 'Agent Performance Dashboard', category: 'Performance', description: 'Comprehensive agent metrics overview', roles: ['admin', 'supervisor'] },
            { name: 'Agent Productivity Report', category: 'Performance', description: 'Calls per hour and efficiency metrics', roles: ['admin', 'supervisor'] },
            { name: 'Agent State Timeline', category: 'Performance', description: 'Time spent in each agent state', roles: ['admin', 'supervisor'] },
            { name: 'Personal Performance', category: 'Performance', description: 'Your individual call statistics', roles: ['agent'] },
            { name: 'Agent Leaderboard', category: 'Performance', description: 'Top performing agents by metrics', roles: ['admin', 'supervisor'] },
            { name: 'Call Handling Time', category: 'Performance', description: 'Average handle time per agent', roles: ['admin', 'supervisor'] },

            // Department & Office Reports
            { name: 'Department Comparison', category: 'Organization', description: 'Compare metrics across departments', roles: ['admin'] },
            { name: 'Office Performance', category: 'Organization', description: 'Call metrics by office location', roles: ['admin'] },
            { name: 'Team Performance', category: 'Organization', description: 'Your team metrics and trends', roles: ['supervisor'] },

            // Quality & Compliance
            { name: 'SLA Compliance Report', category: 'Quality', description: 'Service level agreement adherence', roles: ['admin', 'supervisor'] },
            { name: 'First Call Resolution', category: 'Quality', description: 'Rate of issues resolved on first call', roles: ['admin', 'supervisor'] },
            { name: 'Call Quality Score', category: 'Quality', description: 'Quality metrics and ratings', roles: ['admin', 'supervisor'] },

            // Powerdialer Reports
            { name: 'Powerdialer List Progress', category: 'Powerdialer', description: 'Track completion of calling lists', roles: ['admin', 'supervisor', 'agent'] },
            { name: 'List Performance Comparison', category: 'Powerdialer', description: 'Compare success rates across lists', roles: ['admin', 'supervisor'] },
            { name: 'Contact Disposition by List', category: 'Powerdialer', description: 'Outcomes for each calling list', roles: ['admin', 'supervisor'] }
        ];

        return allReports.filter(report => report.roles.includes(role));
    },

    attachCallsPageListeners() {
        // Attach filter listeners
        const searchInput = document.getElementById('filter-search');
        const dateInput = document.getElementById('filter-date');
        const statusSelect = document.getElementById('filter-status');
        const directionSelect = document.getElementById('filter-direction');
        const clearButton = document.getElementById('clear-filters');
        const exportButton = document.getElementById('export-calls');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterCalls());
        }
        if (dateInput) {
            dateInput.addEventListener('change', () => this.filterCalls());
        }
        if (statusSelect) {
            statusSelect.addEventListener('change', () => this.filterCalls());
        }
        if (directionSelect) {
            directionSelect.addEventListener('change', () => this.filterCalls());
        }
        if (clearButton) {
            clearButton.addEventListener('click', () => this.clearFilters());
        }
        if (exportButton) {
            exportButton.addEventListener('click', () => this.exportCalls());
        }

        // Attach sorting listeners
        const sortableHeaders = document.querySelectorAll('.sortable');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                const sortField = e.currentTarget.getAttribute('data-sort');
                this.sortCalls(sortField);
            });
        });
    },

    attachSettingsPageListeners() {
        // Save quota settings button
        const saveButton = document.getElementById('save-quota-settings');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                const dailyTarget = parseInt(document.getElementById('daily-quota')?.value || '100');
                const weeklyTarget = parseInt(document.getElementById('weekly-quota')?.value || '500');

                AppState.companyQuota.dailyCallTarget = dailyTarget;
                AppState.companyQuota.weeklyCallTarget = weeklyTarget;

                // Show success message
                this.showToast('Quota settings saved successfully!', 'success');
            });
        }

        // Reset quota settings button
        const resetButton = document.getElementById('reset-quota-settings');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                document.getElementById('daily-quota').value = '100';
                document.getElementById('weekly-quota').value = '500';
                document.getElementById('quota-tracking-enabled').checked = true;

                AppState.companyQuota.dailyCallTarget = 100;
                AppState.companyQuota.weeklyCallTarget = 500;

                // Show info message
                this.showToast('Quota settings reset to defaults', 'info');
            });
        }
    },

    showToast(message, type = 'success') {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'slds-notify-container';
        toastContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000;';

        const themeClass = type === 'success' ? 'slds-theme_success' :
                          type === 'error' ? 'slds-theme_error' :
                          type === 'warning' ? 'slds-theme_warning' : 'slds-theme_info';

        toastContainer.innerHTML = `
            <div class="slds-notify slds-notify_toast ${themeClass}" role="alert">
                <span class="slds-assistive-text">${type}</span>
                <div class="slds-notify__content">
                    <h2 class="slds-text-heading_small">${message}</h2>
                </div>
                <button class="slds-button slds-button_icon slds-notify__close">
                    <span class="slds-assistive-text">Close</span>
                    ✕
                </button>
            </div>
        `;

        document.body.appendChild(toastContainer);

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            toastContainer.remove();
        }, 3000);

        // Close button
        const closeBtn = toastContainer.querySelector('.slds-notify__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toastContainer.remove();
            });
        }
    },

    filterCalls() {
        const role = RoleManager.getRole();
        let calls = DataService.getCalls(role);

        // Apply search filter
        const search = document.getElementById('filter-search')?.value.toLowerCase();
        if (search) {
            calls = calls.filter(call =>
                call.contact.toLowerCase().includes(search) ||
                (call.userName && call.userName.toLowerCase().includes(search))
            );
        }

        // Apply date filter
        const date = document.getElementById('filter-date')?.value;
        if (date) {
            calls = calls.filter(call => {
                const callDate = new Date(call.timestamp).toISOString().split('T')[0];
                return callDate === date;
            });
        }

        // Apply status filter
        const status = document.getElementById('filter-status')?.value;
        if (status) {
            calls = calls.filter(call => call.status === status);
        }

        // Apply direction filter
        const direction = document.getElementById('filter-direction')?.value;
        if (direction) {
            calls = calls.filter(call => call.direction === direction);
        }

        this.updateCallsTable(calls);
    },

    sortCalls(field) {
        if (!this.sortState) {
            this.sortState = { field: null, direction: 'asc' };
        }

        // Toggle direction if same field, otherwise default to asc
        if (this.sortState.field === field) {
            this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortState.field = field;
            this.sortState.direction = 'asc';
        }

        const role = RoleManager.getRole();
        let calls = DataService.getCalls(role);

        // Apply current filters first
        const search = document.getElementById('filter-search')?.value.toLowerCase();
        const date = document.getElementById('filter-date')?.value;
        const status = document.getElementById('filter-status')?.value;
        const direction = document.getElementById('filter-direction')?.value;

        if (search) {
            calls = calls.filter(call =>
                call.contact.toLowerCase().includes(search) ||
                (call.userName && call.userName.toLowerCase().includes(search))
            );
        }
        if (date) {
            calls = calls.filter(call => {
                const callDate = new Date(call.timestamp).toISOString().split('T')[0];
                return callDate === date;
            });
        }
        if (status) {
            calls = calls.filter(call => call.status === status);
        }
        if (direction) {
            calls = calls.filter(call => call.direction === direction);
        }

        // Sort calls
        calls.sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];

            if (field === 'timestamp') {
                aVal = new Date(aVal).getTime();
                bVal = new Date(bVal).getTime();
            } else if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (this.sortState.direction === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        // Update sort indicators
        document.querySelectorAll('.sort-indicator').forEach(el => el.textContent = '');
        const activeHeader = document.querySelector(`[data-sort="${field}"] .sort-indicator`);
        if (activeHeader) {
            activeHeader.textContent = this.sortState.direction === 'asc' ? ' ▲' : ' ▼';
        }

        this.updateCallsTable(calls);
    },

    updateCallsTable(calls) {
        const role = RoleManager.getRole();
        const tbody = document.getElementById('calls-table-body');
        const countHeader = document.getElementById('calls-count');

        if (tbody) {
            tbody.innerHTML = calls.map(call => `
                <tr>
                    <td>${DataService.formatTimestamp(call.timestamp)}</td>
                    <td>${call.contact}</td>
                    <td>${call.direction}</td>
                    <td>${DataService.formatDuration(call.duration)}</td>
                    <td>${call.status}</td>
                    <td>${call.disposition}</td>
                    ${role !== 'agent' ? `<td>${call.userName}</td>` : ''}
                </tr>
            `).join('');
        }

        if (countHeader) {
            countHeader.textContent = `Call History (${calls.length} records)`;
        }
    },

    clearFilters() {
        document.getElementById('filter-search').value = '';
        document.getElementById('filter-date').value = '';
        document.getElementById('filter-status').value = '';
        document.getElementById('filter-direction').value = '';
        this.filterCalls();
    },

    exportCalls() {
        const role = RoleManager.getRole();
        const calls = DataService.getCalls(role);

        // Create CSV content
        const headers = role !== 'agent'
            ? ['Time', 'Contact', 'Direction', 'Duration', 'Status', 'Disposition', 'User']
            : ['Time', 'Contact', 'Direction', 'Duration', 'Status', 'Disposition'];

        const csvRows = [headers.join(',')];

        calls.forEach(call => {
            const row = [
                DataService.formatTimestamp(call.timestamp),
                call.contact,
                call.direction,
                DataService.formatDuration(call.duration),
                call.status,
                call.disposition
            ];
            if (role !== 'agent') {
                row.push(call.userName);
            }
            csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `calls-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    },

    getAgentStateClass(state) {
        const stateMap = {
            'On Call': 'state-on-call',
            'Available': 'state-available',
            'Wrap-Up': 'state-wrap-up',
            'Break': 'state-break',
            'Offline': 'state-offline'
        };
        return stateMap[state] || 'state-offline';
    },

    attachDemoControlListeners() {
        // Toggle demo controls panel
        const trigger = document.getElementById('demo-controls-trigger');
        const panel = document.getElementById('demo-controls-panel');
        const closeBtn = document.getElementById('close-demo-controls');

        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                panel.style.display = 'none';
            });
        }

        // Onboarding trigger
        const onboardingBtn = document.getElementById('trigger-onboarding');
        if (onboardingBtn) {
            onboardingBtn.addEventListener('click', () => {
                this.showOnboardingModal();
            });
        }

        // Feature tour trigger
        const tourBtn = document.getElementById('trigger-tour');
        if (tourBtn) {
            tourBtn.addEventListener('click', () => {
                this.startFeatureTour();
            });
        }

        // Version banner toggle
        const versionToggle = document.getElementById('toggle-version-banner');
        if (versionToggle) {
            versionToggle.addEventListener('change', (e) => {
                AppState.showVersionBanner = e.target.checked;
                this.renderCurrentPage();
            });
        }

        // Changelog trigger
        const changelogBtn = document.getElementById('show-changelog');
        if (changelogBtn) {
            changelogBtn.addEventListener('click', () => {
                this.showChangelogModal();
            });
        }

        // Environment radio buttons
        const envRadios = document.querySelectorAll('input[name="environment"]');
        envRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                AppState.setEnvironment(e.target.value);
                this.renderCurrentPage();
            });
        });

        // Sandbox warning toggle
        const sandboxToggle = document.getElementById('toggle-sandbox-warning');
        if (sandboxToggle) {
            sandboxToggle.addEventListener('change', (e) => {
                AppState.showSandboxWarning = e.target.checked;
                this.renderCurrentPage();
            });
        }

        // Integration status radio buttons
        const integrationRadios = document.querySelectorAll('input[name="integration-status"]');
        integrationRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                AppState.setIntegrationStatus(e.target.value);
                this.renderCurrentPage();
            });
        });

        // Config warning toggle
        const configWarningToggle = document.getElementById('toggle-config-warning');
        if (configWarningToggle) {
            configWarningToggle.addEventListener('change', (e) => {
                AppState.showConfigWarning = e.target.checked;
                this.renderCurrentPage();
            });
        }

        // Unlogged calls slider
        const unloggedSlider = document.getElementById('unlogged-count');
        const unloggedValue = document.getElementById('unlogged-value');
        if (unloggedSlider) {
            unloggedSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                unloggedValue.textContent = value;
                AppState.setUnloggedCallsCount(value);
                this.renderCurrentPage();
            });
        }

        // Quota progress slider
        const quotaSlider = document.getElementById('quota-progress');
        const quotaValue = document.getElementById('quota-value');
        if (quotaSlider) {
            quotaSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                quotaValue.textContent = value;
                AppState.setAgentQuota('1', value, 100);
                this.renderCurrentPage();
            });
        }

        // Reset demo state
        const resetBtn = document.getElementById('reset-demo-state');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Reset all demo states to defaults?')) {
                    localStorage.clear();
                    location.reload();
                }
            });
        }
    },

    attachNotificationListeners() {
        const notificationsTrigger = document.getElementById('notifications-trigger');
        const notificationsDropdown = document.getElementById('notifications-dropdown');

        if (notificationsTrigger && notificationsDropdown) {
            // Remove existing listener if any
            const oldTrigger = notificationsTrigger.cloneNode(true);
            notificationsTrigger.parentNode.replaceChild(oldTrigger, notificationsTrigger);

            const trigger = document.getElementById('notifications-trigger');
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isVisible = !notificationsDropdown.classList.contains('slds-hide');

                if (isVisible) {
                    notificationsDropdown.classList.add('slds-hide');
                } else {
                    notificationsDropdown.classList.remove('slds-hide');
                    this.renderNotifications();
                }
            });

            // Close dropdown when clicking outside (only add once)
            if (!this._notificationClickHandlerAttached) {
                document.addEventListener('click', (e) => {
                    const trigger = document.getElementById('notifications-trigger');
                    if (trigger && !trigger.contains(e.target) && !notificationsDropdown.contains(e.target)) {
                        notificationsDropdown.classList.add('slds-hide');
                    }
                });
                this._notificationClickHandlerAttached = true;
            }
        }
    },

    handleStateChange(detail) {
        // Handle state changes from AppState
        console.log('State changed:', detail.type, detail.value);
        // Re-render current page to reflect state changes
        if (['unloggedCalls', 'agentQuota', 'environment'].includes(detail.type)) {
            this.renderCurrentPage();
        }
        // Update notification badge for relevant state changes
        if (['unloggedCalls', 'integrationStatus', 'configWarning'].includes(detail.type)) {
            this.updateNotificationBadge();
        }
    },

    showOnboardingModal() {
        const modalsContainer = document.getElementById('modals-container');
        if (!modalsContainer) return;

        AppState.onboardingStep = 1;
        this.renderOnboardingModal();
    },

    renderOnboardingModal() {
        const modalsContainer = document.getElementById('modals-container');
        const step = AppState.onboardingStep;

        const steps = [
            {
                title: 'Welcome to Dialpad for Salesforce!',
                content: `
                    <div class="slds-text-align_center slds-m-bottom_large">
                        <div class="slds-illustration slds-illustration_large" style="margin: 0 auto;">
                            <svg class="slds-illustration__svg" viewBox="0 0 468 194" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" fill-rule="evenodd">
                                    <g transform="translate(0 5)">
                                        <circle cx="150" cy="94" r="94" fill="#E3F3FF"/>
                                        <path d="M150,20 C150,20 180,60 180,94 C180,128 165,150 150,150 C135,150 120,128 120,94 C120,60 150,20 150,20 Z" fill="#0176D3"/>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                    <p class="slds-text-body_regular slds-m-bottom_medium">
                        Get the most out of your Dialpad integration with this quick setup guide.
                        We'll walk you through best practices and key features in just a few steps.
                    </p>
                    <div class="slds-box slds-box_x-small slds-theme_shade slds-m-top_medium">
                        <p class="slds-text-body_small"><strong>Estimated time:</strong> 3 minutes</p>
                    </div>
                `
            },
            {
                title: 'Test in Sandbox First',
                content: `
                    <div class="slds-media slds-media_center slds-m-bottom_medium">
                        <div class="slds-media__figure">
                            <span class="slds-icon_container slds-icon-utility-warning" style="background-color: #FE9339;">
                                <span style="font-size: 2rem;">⚠️</span>
                            </span>
                        </div>
                        <div class="slds-media__body">
                            <h3 class="slds-text-heading_small">Always test in Sandbox before Production</h3>
                        </div>
                    </div>
                    <p class="slds-m-bottom_medium">
                        We strongly recommend testing all package updates and configurations in a Sandbox environment before deploying to Production.
                    </p>
                    <div class="slds-box slds-theme_shade slds-m-bottom_medium">
                        <h4 class="slds-text-heading_small slds-m-bottom_small">Best practices:</h4>
                        <ul class="slds-list_dotted">
                            <li>Create a full copy Sandbox of your Production org</li>
                            <li>Install or update the Dialpad package in Sandbox</li>
                            <li>Test all features with real users</li>
                            <li>Verify call logging and data sync</li>
                            <li>Only then deploy to Production</li>
                        </ul>
                    </div>
                    <label class="slds-checkbox">
                        <input type="checkbox" id="sandbox-acknowledge" />
                        <span class="slds-checkbox_faux"></span>
                        <span class="slds-form-element__label">I understand and will test in Sandbox first</span>
                    </label>
                `
            },
            {
                title: 'Configure Call Logging',
                content: `
                    <p class="slds-m-bottom_medium">
                        Dialpad can automatically log all your calls to Salesforce. Let's make sure it's configured correctly.
                    </p>
                    <div class="slds-box slds-theme_default slds-m-bottom_medium">
                        <div class="slds-media">
                            <div class="slds-media__figure">
                                <span class="slds-icon_container slds-icon-standard-task" style="background-color: #0176D3;">
                                    <span style="font-size: 1.5rem; color: white;">✓</span>
                                </span>
                            </div>
                            <div class="slds-media__body">
                                <h4 class="slds-text-heading_small">Recommended Settings</h4>
                                <ul class="slds-list_dotted slds-m-top_x-small">
                                    <li>Enable auto-log for all calls</li>
                                    <li>Set default call owner to user making the call</li>
                                    <li>Log calls to related Contact or Lead</li>
                                    <li>Include call recordings (if enabled)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <button class="slds-button slds-button_neutral" onclick="App.goToSettings()">
                        Go to Settings
                    </button>
                `
            },
            {
                title: 'Explore Your Dashboard',
                content: `
                    <p class="slds-m-bottom_medium">
                        Your dashboard shows different metrics based on your role. You can switch roles using the links in the header.
                    </p>
                    <div class="slds-grid slds-wrap slds-gutters_small slds-m-bottom_medium">
                        <div class="slds-col slds-size_1-of-3">
                            <div class="slds-box slds-box_x-small slds-text-align_center">
                                <div class="slds-m-bottom_x-small" style="font-size: 2rem;">👤</div>
                                <div class="slds-text-heading_small">Admin</div>
                                <p class="slds-text-body_small">Company-wide metrics, user management</p>
                            </div>
                        </div>
                        <div class="slds-col slds-size_1-of-3">
                            <div class="slds-box slds-box_x-small slds-text-align_center">
                                <div class="slds-m-bottom_x-small" style="font-size: 2rem;">👥</div>
                                <div class="slds-text-heading_small">Supervisor</div>
                                <p class="slds-text-body_small">Team performance, agent monitoring</p>
                            </div>
                        </div>
                        <div class="slds-col slds-size_1-of-3">
                            <div class="slds-box slds-box_x-small slds-text-align_center">
                                <div class="slds-m-bottom_x-small" style="font-size: 2rem;">📞</div>
                                <div class="slds-text-heading_small">Agent</div>
                                <p class="slds-text-body_small">Personal stats, call history, quotas</p>
                            </div>
                        </div>
                    </div>
                    <div class="slds-box slds-theme_info slds-theme_alert-texture">
                        <p class="slds-text-body_small">
                            <strong>Tip:</strong> Data refreshes automatically every 30 seconds on the Home page.
                        </p>
                    </div>
                `
            },
            {
                title: 'Access Pre-built Reports',
                content: `
                    <p class="slds-m-bottom_medium">
                        We've included 20 pre-built reports to help you analyze your call data. Find them in the Reports tab.
                    </p>
                    <div class="slds-box slds-theme_shade slds-m-bottom_medium">
                        <h4 class="slds-text-heading_small slds-m-bottom_small">Report Categories:</h4>
                        <div class="slds-grid slds-wrap slds-gutters_xx-small">
                            <div class="slds-col slds-size_1-of-2">
                                <span class="slds-badge slds-theme_default">Call Activity</span>
                            </div>
                            <div class="slds-col slds-size_1-of-2">
                                <span class="slds-badge slds-theme_default">Performance</span>
                            </div>
                            <div class="slds-col slds-size_1-of-2">
                                <span class="slds-badge slds-theme_default">Quality</span>
                            </div>
                            <div class="slds-col slds-size_1-of-2">
                                <span class="slds-badge slds-theme_default">Powerdialer</span>
                            </div>
                        </div>
                    </div>
                    <div class="slds-box slds-theme_success slds-theme_alert-texture">
                        <p class="slds-text-body_small">
                            ✓ All reports sync with your Dialpad analytics dashboard
                        </p>
                    </div>
                    <button class="slds-button slds-button_neutral slds-m-top_small" onclick="App.goToReports()">
                        View Reports
                    </button>
                `
            },
            {
                title: 'You\'re All Set!',
                content: `
                    <div class="slds-text-align_center slds-m-bottom_large">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
                        <h3 class="slds-text-heading_medium slds-m-bottom_small">Setup Complete!</h3>
                        <p class="slds-text-body_regular">You\'re ready to start using Dialpad for Salesforce.</p>
                    </div>
                    <div class="slds-box slds-theme_shade">
                        <h4 class="slds-text-heading_small slds-m-bottom_small">What's next?</h4>
                        <ul class="slds-list_dotted">
                            <li>Make test calls and verify they log correctly</li>
                            <li>Set up agent quotas in Settings</li>
                            <li>Customize your dashboard widgets</li>
                            <li>Train your team on the new features</li>
                            <li>Explore the Reports library</li>
                        </ul>
                    </div>
                    <div class="slds-box slds-theme_info slds-theme_alert-texture slds-m-top_medium">
                        <p class="slds-text-body_small">
                            <strong>Need help?</strong> Visit our Help Center or contact Support.
                        </p>
                    </div>
                `
            }
        ];

        const currentStep = steps[step - 1];
        const progressPercent = Math.round((step / steps.length) * 100);

        modalsContainer.innerHTML = `
            <section role="dialog" tabindex="-1" class="slds-modal slds-fade-in-open slds-modal_large" aria-modal="true">
                <div class="slds-modal__container">
                    <header class="slds-modal__header">
                        <h2 class="slds-modal__title slds-hyphenate">
                            ${currentStep.title}
                        </h2>
                        <p class="slds-m-top_x-small">Step ${step} of ${steps.length}</p>
                        <div class="slds-progress-bar slds-progress-bar_x-small slds-m-top_small" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progressPercent}">
                            <span class="slds-progress-bar__value" style="width: ${progressPercent}%;"></span>
                        </div>
                    </header>
                    <div class="slds-modal__content slds-p-around_medium">
                        ${currentStep.content}
                    </div>
                    <footer class="slds-modal__footer">
                        ${step > 1 ? '<button class="slds-button slds-button_neutral" id="onboarding-prev">Previous</button>' : ''}
                        <button class="slds-button slds-button_neutral" id="onboarding-skip">Skip Tutorial</button>
                        ${step < steps.length ?
                            '<button class="slds-button slds-button_brand" id="onboarding-next">Next</button>' :
                            '<button class="slds-button slds-button_brand" id="onboarding-finish">Get Started</button>'
                        }
                    </footer>
                </div>
            </section>
            <div class="slds-backdrop slds-backdrop_open"></div>
        `;

        // Attach event listeners
        setTimeout(() => {
            const nextBtn = document.getElementById('onboarding-next');
            const prevBtn = document.getElementById('onboarding-prev');
            const skipBtn = document.getElementById('onboarding-skip');
            const finishBtn = document.getElementById('onboarding-finish');

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    // On step 2, check if sandbox acknowledged
                    if (step === 2) {
                        const checkbox = document.getElementById('sandbox-acknowledge');
                        if (!checkbox.checked) {
                            alert('Please acknowledge that you will test in Sandbox first.');
                            return;
                        }
                        AppState.hasTestedInSandbox = true;
                    }
                    AppState.onboardingStep++;
                    this.renderOnboardingModal();
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    AppState.onboardingStep--;
                    this.renderOnboardingModal();
                });
            }

            if (skipBtn) {
                skipBtn.addEventListener('click', () => {
                    if (confirm('Are you sure you want to skip the tutorial?')) {
                        this.closeOnboardingModal();
                    }
                });
            }

            if (finishBtn) {
                finishBtn.addEventListener('click', () => {
                    AppState.setOnboardingComplete();
                    this.closeOnboardingModal();
                });
            }
        }, 0);
    },

    closeOnboardingModal() {
        const modalsContainer = document.getElementById('modals-container');
        if (modalsContainer) {
            modalsContainer.innerHTML = '';
        }
    },

    goToSettings() {
        this.closeOnboardingModal();
        this.renderPage('settings');
    },

    goToReports() {
        this.closeOnboardingModal();
        this.renderPage('reports');
    },

    startFeatureTour() {
        alert('Feature Tour: Interactive tooltips will guide you through:\n- Switching roles\n- Using filters\n- Exploring reports\n- Exporting data\n\n(Feature tours with popovers can be added in Phase 2)');
    },

    showChangelogModal() {
        const modalsContainer = document.getElementById('modals-container');
        if (!modalsContainer) return;

        modalsContainer.innerHTML = `
            <section role="dialog" tabindex="-1" class="slds-modal slds-fade-in-open slds-modal_large" aria-modal="true">
                <div class="slds-modal__container">
                    <header class="slds-modal__header">
                        <button class="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse" id="close-changelog">
                            <span class="slds-icon_container">✕</span>
                            <span class="slds-assistive-text">Close</span>
                        </button>
                        <h2 class="slds-modal__title slds-hyphenate">
                            What's New in Dialpad for Salesforce
                        </h2>
                    </header>
                    <div class="slds-modal__content slds-p-around_medium">

                        <!-- Version 2.5.0 -->
                        <article class="slds-box slds-m-bottom_medium">
                            <div class="slds-media slds-media_center slds-m-bottom_small">
                                <div class="slds-media__figure">
                                    <span class="slds-badge slds-theme_success">LATEST</span>
                                </div>
                                <div class="slds-media__body">
                                    <h3 class="slds-text-heading_small">Version 2.5.0</h3>
                                    <p class="slds-text-color_weak">Released November 15, 2025</p>
                                </div>
                            </div>

                            <div class="slds-m-bottom_medium">
                                <h4 class="slds-text-title_caps slds-m-bottom_x-small">✨ New Features</h4>
                                <ul class="slds-list_dotted">
                                    <li><strong>Real-time Agent State Tracking:</strong> Monitor agent availability with 5 color-coded states</li>
                                    <li><strong>20 Pre-built Reports:</strong> Comprehensive report library across 5 categories</li>
                                    <li><strong>Advanced Filtering:</strong> Real-time search and multi-criteria filtering on Calls page</li>
                                    <li><strong>Quota Tracking:</strong> Visual progress bars for agent daily/weekly quotas</li>
                                    <li><strong>Unlogged Call Alerts:</strong> Automatic detection and notifications for unlogged calls</li>
                                    <li><strong>Auto-refresh Dashboard:</strong> Live updates every 30 seconds</li>
                                </ul>
                            </div>

                            <div class="slds-m-bottom_medium">
                                <h4 class="slds-text-title_caps slds-m-bottom_x-small">🔧 Improvements</h4>
                                <ul class="slds-list_dotted">
                                    <li>Dashboard loading performance improved by 40%</li>
                                    <li>Chart rendering now uses Chart.js 4.4.0 for better visuals</li>
                                    <li>Enhanced user table with pickup rates and avg duration</li>
                                    <li>Sortable columns on all data tables</li>
                                    <li>CSV export with filtered data support</li>
                                </ul>
                            </div>

                            <div>
                                <h4 class="slds-text-title_caps slds-m-bottom_x-small">🐛 Bug Fixes</h4>
                                <ul class="slds-list_dotted">
                                    <li>Fixed call logging sync issues with recordings</li>
                                    <li>Resolved timezone display inconsistencies</li>
                                    <li>Fixed Powerdialer list assignment permissions</li>
                                    <li>Corrected report calculations to match Dialpad analytics</li>
                                </ul>
                            </div>
                        </article>

                        <!-- Version 2.3.0 -->
                        <article class="slds-box slds-theme_shade slds-m-bottom_medium">
                            <div class="slds-media slds-media_center slds-m-bottom_small">
                                <div class="slds-media__body">
                                    <h3 class="slds-text-heading_small">Version 2.3.0</h3>
                                    <p class="slds-text-color_weak">Released October 1, 2025</p>
                                </div>
                            </div>

                            <div class="slds-m-bottom_medium">
                                <h4 class="slds-text-title_caps slds-m-bottom_x-small">✨ New Features</h4>
                                <ul class="slds-list_dotted">
                                    <li>Role-based dashboards for Admin, Supervisor, and Agent</li>
                                    <li>7 interactive chart types</li>
                                    <li>SMS message logging and history</li>
                                    <li>Powerdialer integration with list management</li>
                                </ul>
                            </div>

                            <div>
                                <h4 class="slds-text-title_caps slds-m-bottom_x-small">🔧 Improvements</h4>
                                <ul class="slds-list_dotted">
                                    <li>Upgraded to Salesforce Lightning Design System 2.24</li>
                                    <li>Improved mobile responsiveness</li>
                                    <li>Better error handling and logging</li>
                                </ul>
                            </div>
                        </article>

                        <!-- Version 2.1.0 -->
                        <article class="slds-box slds-theme_shade">
                            <div class="slds-media slds-media_center slds-m-bottom_small">
                                <div class="slds-media__body">
                                    <h3 class="slds-text-heading_small">Version 2.1.0</h3>
                                    <p class="slds-text-color_weak">Released August 12, 2025</p>
                                </div>
                            </div>

                            <div class="slds-m-bottom_medium">
                                <h4 class="slds-text-title_caps slds-m-bottom_x-small">✨ New Features</h4>
                                <ul class="slds-list_dotted">
                                    <li>Basic call logging to Salesforce records</li>
                                    <li>Click-to-dial from Salesforce</li>
                                    <li>Call history view</li>
                                </ul>
                            </div>
                        </article>

                    </div>
                    <footer class="slds-modal__footer">
                        <button class="slds-button slds-button_neutral" id="close-changelog-btn">Close</button>
                        <button class="slds-button slds-button_brand" id="update-now-btn">Update to 2.5.0</button>
                    </footer>
                </div>
            </section>
            <div class="slds-backdrop slds-backdrop_open"></div>
        `;

        // Attach event listeners
        setTimeout(() => {
            const closeBtn = document.getElementById('close-changelog');
            const closeFooterBtn = document.getElementById('close-changelog-btn');
            const updateBtn = document.getElementById('update-now-btn');

            const closeModal = () => {
                modalsContainer.innerHTML = '';
                AppState.hasViewedChangelog = true;
            };

            if (closeBtn) closeBtn.addEventListener('click', closeModal);
            if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeModal);

            if (updateBtn) {
                updateBtn.addEventListener('click', () => {
                    alert('In a real implementation, this would redirect to:\n\nSalesforce AppExchange:\nhttps://appexchange.salesforce.com/dialpad\n\nOr directly to package installation URL.');
                    closeModal();
                });
            }
        }, 0);
    },

    renderUnloggedCallsAlert() {
        const count = AppState.unloggedCallsCount;

        if (count === 0) {
            return `
                <div class="slds-card">
                    <div class="slds-card__header slds-grid">
                        <header class="slds-media slds-media_center slds-has-flexi-truncate">
                            <div class="slds-media__body">
                                <h2 class="slds-card__header-title">Call Logging</h2>
                            </div>
                        </header>
                    </div>
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="slds-text-align_center slds-p-around_medium">
                            <div style="font-size: 3rem; color: #04844b; margin-bottom: 0.5rem;">✓</div>
                            <p class="slds-text-heading_small slds-m-bottom_x-small">All Calls Logged</p>
                            <p class="slds-text-body_small slds-text-color_weak">Great job! No unlogged calls detected.</p>
                        </div>
                    </div>
                </div>
            `;
        }

        const unloggedCalls = DataService.getUnloggedCalls(count);

        return `
            <div class="slds-card">
                <div class="slds-card__header slds-grid">
                    <header class="slds-media slds-media_center slds-has-flexi-truncate">
                        <div class="slds-media__body">
                            <h2 class="slds-card__header-title">Unlogged Calls</h2>
                        </div>
                    </header>
                </div>
                <div class="slds-card__body slds-card__body_inner">
                    <div class="slds-text-align_center slds-p-vertical_medium slds-m-bottom_medium slds-border_bottom">
                        <div class="slds-text-heading_large slds-text-color_error slds-m-bottom_xxx-small">${count}</div>
                        <p class="slds-text-body_small slds-text-color_default">
                            ${count === 1 ? 'call needs' : 'calls need'} to be logged
                        </p>
                    </div>

                    <div class="slds-m-vertical_small">
                        ${unloggedCalls.map((call, index) => `
                            <div class="slds-p-around_small ${index < unloggedCalls.length - 1 ? 'slds-border_bottom' : ''}">
                                <div class="slds-grid slds-grid_vertical-align-start slds-m-bottom_xxx-small">
                                    <div class="slds-col slds-has-flexi-truncate">
                                        <p class="slds-text-body_small slds-text-title">${call.contact}</p>
                                    </div>
                                    <div class="slds-col slds-no-flex slds-text-align_right">
                                        <p class="slds-text-body_small slds-text-title slds-text-color_error">${DataService.formatDuration(call.duration)}</p>
                                    </div>
                                </div>
                                <div class="slds-grid slds-grid_vertical-align-start">
                                    <div class="slds-col">
                                        <p class="slds-text-body_small slds-text-color_weak">
                                            ${call.userName}
                                        </p>
                                    </div>
                                    <div class="slds-col slds-no-flex slds-text-align_right">
                                        <p class="slds-text-body_small slds-text-color_weak">
                                            ${call.direction} • ${DataService.formatTimestamp(call.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <button class="slds-button slds-button_brand slds-button_stretch" onclick="alert('This would open a modal to review and log these calls to Salesforce.')">
                        Log All Calls
                    </button>
                </div>
            </div>
        `;
    },

    renderPackageUpdateStatus() {
        const needsUpdate = AppState.needsUpdate();

        if (needsUpdate) {
            return `
                <div class="slds-card slds-m-top_medium">
                    <div class="slds-card__header slds-grid">
                        <header class="slds-media slds-media_center slds-has-flexi-truncate">
                            <div class="slds-media__body">
                                <h2 class="slds-card__header-title">Package Update</h2>
                            </div>
                        </header>
                    </div>
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="slds-box slds-box_small slds-theme_shade slds-m-bottom_small" style="border-left: 4px solid #0176d3;">
                            <div class="slds-p-around_small">
                                <p class="slds-text-heading_small slds-m-bottom_x-small">Update Available</p>
                                <p class="slds-text-body_small slds-text-color_default">
                                    Version ${AppState.latestVersion} is available
                                </p>
                                <p class="slds-text-body_small slds-text-color_weak slds-m-top_xx-small">
                                    Current: ${AppState.currentVersion}
                                </p>
                            </div>
                        </div>
                        <p class="slds-text-body_small slds-m-bottom_small">
                            A new version of the Dialpad package is available with bug fixes and feature improvements.
                        </p>
                        <button class="slds-button slds-button_brand slds-button_stretch" id="view-changelog-widget">
                            View Changelog
                        </button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="slds-card slds-m-top_medium">
                <div class="slds-card__header slds-grid">
                    <header class="slds-media slds-media_center slds-has-flexi-truncate">
                        <div class="slds-media__body">
                            <h2 class="slds-card__header-title">Package Version</h2>
                        </div>
                    </header>
                </div>
                <div class="slds-card__body slds-card__body_inner">
                    <div class="slds-text-align_center slds-p-around_medium">
                        <div style="font-size: 3rem; color: #04844b; margin-bottom: 0.5rem;">✓</div>
                        <p class="slds-text-heading_small slds-m-bottom_x-small">Up to Date</p>
                        <p class="slds-text-body_small slds-text-color_weak">
                            Running version ${AppState.currentVersion}
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    renderIntegrationHealth() {
        const isConnected = AppState.integrationStatus === 'connected';
        const lastSync = AppState.getLastSyncTime();
        const hasWarning = AppState.showConfigWarning;

        if (!isConnected) {
            return `
                <div class="slds-card slds-m-top_medium">
                    <div class="slds-card__header slds-grid">
                        <header class="slds-media slds-media_center slds-has-flexi-truncate">
                            <div class="slds-media__body">
                                <h2 class="slds-card__header-title">Integration Health</h2>
                            </div>
                        </header>
                    </div>
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="slds-box slds-box_small slds-theme_shade slds-m-bottom_small" style="border-left: 4px solid #c23934;">
                            <div class="slds-text-align_center slds-p-around_small">
                                <div class="slds-text-heading_large" style="font-size: 2.5rem; font-weight: bold; color: #c23934;">!</div>
                                <p class="slds-text-heading_small slds-text-color_default">
                                    Disconnected
                                </p>
                            </div>
                        </div>
                        <p class="slds-text-body_small slds-m-bottom_small">
                            The Dialpad integration is not connected to Salesforce. Call logging and data sync are disabled.
                        </p>
                        <button class="slds-button slds-button_brand slds-button_stretch" onclick="alert('This would open connection settings to troubleshoot the issue.')">
                            Reconnect Integration
                        </button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="slds-card slds-m-top_medium">
                <div class="slds-card__header slds-grid">
                    <header class="slds-media slds-media_center slds-has-flexi-truncate">
                        <div class="slds-media__body">
                            <h2 class="slds-card__header-title">Integration Health</h2>
                        </div>
                    </header>
                </div>
                <div class="slds-card__body slds-card__body_inner">
                    <div class="slds-text-align_center slds-p-around_medium slds-m-bottom_small">
                        <div style="font-size: 3rem; color: #04844b; margin-bottom: 0.5rem;">✓</div>
                        <p class="slds-text-heading_small slds-m-bottom_x-small">Connected</p>
                        <p class="slds-text-body_small slds-text-color_weak">
                            Last sync: ${lastSync}
                        </p>
                    </div>
                    ${hasWarning ? `
                        <div class="slds-box slds-box_small slds-theme_shade" style="border-left: 4px solid #ffb75d;">
                            <p class="slds-text-body_small slds-text-color_default">
                                <strong>Configuration Notice:</strong> Some settings may need review in the Settings tab.
                            </p>
                        </div>
                    ` : ''}
                    <button class="slds-button slds-button_neutral slds-button_stretch slds-m-top_x-small" onclick="alert('This would test the Salesforce connection and show detailed status.')">
                        Test Connection
                    </button>
                </div>
            </div>
        `;
    },

    renderQuotaProgress() {
        const userId = RoleManager.currentUserId || '1';
        const quota = AppState.getQuotaStatus(userId);
        const percentComplete = Math.round((quota.made / quota.target) * 100);

        let statusClass = 'slds-progress-bar__value_success';
        let statusText = 'On Track';
        let statusColor = '#04844b';

        if (quota.status === 'behind') {
            statusClass = 'slds-theme_error';
            statusText = 'Behind Target';
            statusColor = '#c23934';
        } else if (quota.status === 'at-risk') {
            statusClass = 'slds-theme_warning';
            statusText = 'At Risk';
            statusColor = '#fe9339';
        }

        return `
            <div class="slds-card">
                <div class="slds-card__header slds-grid">
                    <header class="slds-media slds-media_center slds-has-flexi-truncate">
                        <div class="slds-media__body">
                            <h2 class="slds-card__header-title">Daily Quota Progress</h2>
                        </div>
                    </header>
                </div>
                <div class="slds-card__body slds-card__body_inner">
                    <div class="slds-grid slds-grid_align-spread slds-m-bottom_x-small">
                        <span class="slds-text-heading_large">${quota.made}</span>
                        <span class="slds-text-body_small slds-text-color_weak">/ ${quota.target} calls</span>
                    </div>
                    <div class="slds-progress-bar slds-progress-bar_large slds-m-bottom_small" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percentComplete}">
                        <span class="slds-progress-bar__value ${statusClass}" style="width: ${percentComplete}%;"></span>
                    </div>
                    <div class="slds-grid slds-grid_align-spread">
                        <span class="slds-badge" style="background-color: ${statusColor}; color: white;">${statusText}</span>
                        <span class="slds-text-body_small slds-text-color_weak">${percentComplete}% complete</span>
                    </div>
                    ${quota.status === 'behind' ? `
                        <div class="slds-box slds-box_small slds-theme_shade slds-m-top_small" style="border-left: 4px solid #c23934;">
                            <p class="slds-text-body_small slds-text-color_default">
                                <strong>Action Needed:</strong> You need ${quota.target - quota.made} more calls to meet your daily quota.
                            </p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    renderAtRiskAgents() {
        const users = DataService.getUsers('supervisor');
        const atRiskAgents = AppState.getAtRiskAgents(users);

        if (atRiskAgents.length === 0) {
            return `
                <div class="slds-card">
                    <div class="slds-card__header slds-grid">
                        <header class="slds-media slds-media_center slds-has-flexi-truncate">
                            <div class="slds-media__body">
                                <h2 class="slds-card__header-title">Team Performance</h2>
                            </div>
                        </header>
                    </div>
                    <div class="slds-card__body slds-card__body_inner">
                        <div class="slds-text-align_center slds-p-around_medium">
                            <div style="font-size: 3rem; color: #04844b; margin-bottom: 0.5rem;">✓</div>
                            <p class="slds-text-heading_small slds-m-bottom_x-small">All Agents On Track</p>
                            <p class="slds-text-body_small slds-text-color_weak">Everyone is meeting their quotas!</p>
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="slds-card">
                <div class="slds-card__header slds-grid">
                    <header class="slds-media slds-media_center slds-has-flexi-truncate">
                        <div class="slds-media__body">
                            <h2 class="slds-card__header-title">⚠️ Agents Needing Support</h2>
                        </div>
                    </header>
                </div>
                <div class="slds-card__body slds-card__body_inner">
                    <table class="slds-table slds-table_bordered slds-table_cell-buffer slds-table_fixed-layout">
                        <thead>
                            <tr>
                                <th scope="col">Agent</th>
                                <th scope="col">Progress</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${atRiskAgents.map(agent => {
                                const quota = AppState.getQuotaStatus(agent.id);
                                const percent = Math.round((quota.made / quota.target) * 100);
                                const statusColor = quota.status === 'behind' ? '#c23934' : '#fe9339';
                                const statusText = quota.status === 'behind' ? 'Behind' : 'At Risk';

                                return `
                                    <tr>
                                        <td>${agent.name}</td>
                                        <td>
                                            <div class="slds-grid slds-grid_vertical-align-center">
                                                <span class="slds-text-body_small">${quota.made}/${quota.target}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="slds-badge" style="background-color: ${statusColor}; color: white;">
                                                ${statusText}
                                            </span>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                    <button class="slds-button slds-button_neutral slds-button_stretch slds-m-top_small" onclick="alert('This would show detailed agent performance and coaching recommendations.')">
                        View Coaching Plan
                    </button>
                </div>
            </div>
        `;
    },

    renderTeamAlerts() {
        const unloggedCount = AppState.unloggedCallsCount;
        const missedCalls = 2; // Mock data
        const overdueFollowups = 1; // Mock data

        return `
            <div class="slds-card slds-m-top_medium">
                <div class="slds-card__header slds-grid">
                    <header class="slds-media slds-media_center slds-has-flexi-truncate">
                        <div class="slds-media__body">
                            <h2 class="slds-card__header-title">Team Alerts</h2>
                        </div>
                    </header>
                </div>
                <div class="slds-card__body slds-card__body_inner">
                    ${unloggedCount > 0 ? `
                        <div class="slds-scoped-notification slds-media slds-media_center slds-m-bottom_x-small" role="status" style="background-color: #fef7e5; border-left: 3px solid #fe9339;">
                            <div class="slds-media__body">
                                <p class="slds-text-body_small" style="color: #080707;">
                                    <strong>${unloggedCount} Unlogged Call${unloggedCount > 1 ? 's' : ''}</strong>
                                </p>
                            </div>
                        </div>
                    ` : ''}
                    ${missedCalls > 0 ? `
                        <div class="slds-scoped-notification slds-media slds-media_center slds-m-bottom_x-small" role="status" style="background-color: #feded8; border-left: 3px solid #c23934;">
                            <div class="slds-media__body">
                                <p class="slds-text-body_small" style="color: #080707;">
                                    <strong>${missedCalls} Missed Callback${missedCalls > 1 ? 's' : ''}</strong>
                                </p>
                            </div>
                        </div>
                    ` : ''}
                    ${overdueFollowups > 0 ? `
                        <div class="slds-scoped-notification slds-media slds-media_center slds-m-bottom_x-small" role="status" style="background-color: #d8edff; border-left: 3px solid #0176d3;">
                            <div class="slds-media__body">
                                <p class="slds-text-body_small" style="color: #080707;">
                                    <strong>${overdueFollowups} Overdue Follow-up${overdueFollowups > 1 ? 's' : ''}</strong>
                                </p>
                            </div>
                        </div>
                    ` : ''}
                    ${unloggedCount === 0 && missedCalls === 0 && overdueFollowups === 0 ? `
                        <p class="slds-text-body_small slds-text-color_weak slds-text-align_center">
                            All clear! No alerts at this time.
                        </p>
                    ` : `
                        <button class="slds-button slds-button_neutral slds-button_stretch slds-m-top_x-small" onclick="alert('This would show all team alerts and allow bulk actions.')">
                            View All Alerts
                        </button>
                    `}
                </div>
            </div>
        `;
    },

    renderCoachingOpportunities() {
        const atRiskAgents = AppState.getAtRiskAgents(DataService.getUsers('supervisor'));

        return `
            <div class="slds-card slds-m-top_medium">
                <div class="slds-card__header slds-grid">
                    <header class="slds-media slds-media_center slds-has-flexi-truncate">
                        <div class="slds-media__body">
                            <h2 class="slds-card__header-title">Coaching Opportunities</h2>
                        </div>
                    </header>
                </div>
                <div class="slds-card__body slds-card__body_inner">
                    ${atRiskAgents.length > 0 ? atRiskAgents.slice(0, 2).map(agent => {
                        const quota = AppState.getQuotaStatus(agent.id);
                        const percentComplete = Math.round((quota.made / quota.target) * 100);
                        const reason = percentComplete < 50 ? 'Below quota for 3 days' : 'Below target pace';

                        return `
                            <div class="slds-m-bottom_medium">
                                <div class="slds-grid slds-grid_vertical-align-start slds-m-bottom_xxx-small">
                                    <div class="slds-col slds-has-flexi-truncate">
                                        <p class="slds-text-body_small slds-text-title">${agent.name}</p>
                                    </div>
                                </div>
                                <p class="slds-text-body_small slds-text-color_weak slds-m-bottom_x-small">
                                    ${reason}
                                </p>
                                <div class="slds-grid slds-gutters_xx-small">
                                    <div class="slds-col">
                                        <button class="slds-button slds-button_neutral slds-button_stretch" onclick="alert('This would open a messaging interface to send a message to ${agent.name}.')">
                                            Send Message
                                        </button>
                                    </div>
                                    <div class="slds-col">
                                        <button class="slds-button slds-button_neutral slds-button_stretch" onclick="alert('This would open a scheduling interface for a 1:1 with ${agent.name}.')">
                                            Schedule 1:1
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('') : `
                        <p class="slds-text-body_small slds-text-color_weak slds-text-align_center">
                            Great job! All agents are on track.
                        </p>
                    `}
                </div>
            </div>
        `;
    },

    renderTodaysTasks() {
        const tasks = [
            { contact: 'John Smith', type: 'Follow-up', time: '10:00 AM' },
            { contact: 'Sarah Johnson', type: 'Demo Call', time: '2:30 PM' },
            { contact: 'Mike Chen', type: 'Callback', time: '4:00 PM' }
        ];

        return `
            <div class="slds-card slds-m-top_medium">
                <div class="slds-card__header slds-grid">
                    <header class="slds-media slds-media_center slds-has-flexi-truncate">
                        <div class="slds-media__body">
                            <h2 class="slds-card__header-title">Today's Tasks</h2>
                        </div>
                    </header>
                </div>
                <div class="slds-card__body slds-card__body_inner">
                    ${tasks.map((task, index) => `
                        <div class="slds-p-around_x-small ${index < tasks.length - 1 ? 'slds-border_bottom' : ''}">
                            <div class="slds-grid slds-grid_vertical-align-start slds-m-bottom_xxx-small">
                                <div class="slds-col slds-has-flexi-truncate">
                                    <p class="slds-text-body_small slds-text-title">${task.contact}</p>
                                </div>
                                <div class="slds-col slds-no-flex">
                                    <p class="slds-text-body_small slds-text-color_weak">${task.time}</p>
                                </div>
                            </div>
                            <p class="slds-text-body_small slds-text-color_weak">${task.type}</p>
                        </div>
                    `).join('')}
                    <button class="slds-button slds-button_neutral slds-button_stretch slds-m-top_x-small" onclick="alert('This would show all tasks for today.')">
                        View All Tasks
                    </button>
                </div>
            </div>
        `;
    },

    renderQuickActions() {
        return `
            <div class="slds-card slds-m-top_medium">
                <div class="slds-card__header slds-grid">
                    <header class="slds-media slds-media_center slds-has-flexi-truncate">
                        <div class="slds-media__body">
                            <h2 class="slds-card__header-title">Quick Actions</h2>
                        </div>
                    </header>
                </div>
                <div class="slds-card__body slds-card__body_inner">
                    <div class="slds-grid slds-grid_vertical">
                        <button class="slds-button slds-button_neutral slds-button_stretch slds-m-bottom_xx-small" onclick="alert('This would open the dialer to start a new call.')">
                            Start New Call
                        </button>
                        <button class="slds-button slds-button_neutral slds-button_stretch slds-m-bottom_xx-small" onclick="alert('This would show recent voicemails.')">
                            Check Voicemail
                        </button>
                        <button class="slds-button slds-button_neutral slds-button_stretch" onclick="alert('This would open the SMS interface.')">
                            Send SMS
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    renderComingSoonPage(title, description) {
        return `
            <div class="slds-container_fluid slds-p-around_large">
                <div style="max-width: 800px; margin: 0 auto; text-align: center; padding-top: 4rem;">
                    <div class="slds-illustration slds-illustration_large">
                        <svg class="slds-illustration__svg" viewBox="0 0 454 300" style="width: 300px; height: 200px; margin: 0 auto;">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g transform="translate(-67.000000, -100.000000)">
                                    <g>
                                        <g transform="translate(125.000000, 200.000000)">
                                            <circle fill="#E0E5EE" cx="169" cy="100" r="100"></circle>
                                            <path d="M169,50 L169,150 M119,100 L219,100" stroke="#0176D3" stroke-width="8" stroke-linecap="round"></path>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <div class="slds-m-top_large">
                        <h1 class="slds-text-heading_large slds-m-bottom_medium">${title}</h1>
                        <p class="slds-text-body_regular slds-text-color_weak slds-m-bottom_large" style="font-size: 1.125rem;">
                            ${description}
                        </p>
                        <div class="slds-box slds-theme_shade slds-p-around_medium" style="max-width: 600px; margin: 0 auto;">
                            <p class="slds-text-body_small slds-text-color_weak">
                                <strong>Coming Soon</strong><br>
                                This feature is currently under development. Check back soon for updates.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderLiveSentimentMonitor() {
        return `
            <div class="slds-card slds-m-top_medium">
                <div class="slds-card__header slds-grid">
                    <header class="slds-media slds-media_center slds-has-flexi-truncate">
                        <div class="slds-media__body">
                            <h2 class="slds-card__header-title">
                                Live Sentiment Monitor
                            </h2>
                        </div>
                        <div class="slds-no-flex">
                            <span class="slds-badge" style="background-color: #c23934; color: white;">2 At-Risk</span>
                        </div>
                    </header>
                </div>
                <div class="slds-card__body slds-card__body_inner">
                    <p class="slds-text-body_small slds-text-color_weak slds-m-bottom_small">
                        Active calls with negative sentiment
                    </p>

                    <div class="slds-box slds-box_x-small slds-m-bottom_small" style="background-color: #feded8; border-left: 3px solid #c23934;">
                        <div class="slds-grid slds-grid_vertical-align-start">
                            <div class="slds-col slds-has-flexi-truncate">
                                <p class="slds-text-body_small slds-text-title slds-m-bottom_xxx-small">
                                    <span style="color: #c23934; font-weight: 600;">😞 Negative</span> • Mike Chen
                                </p>
                                <p class="slds-text-body_small slds-m-bottom_xxx-small">
                                    Call with ABC Corp - 12 min
                                </p>
                                <p class="slds-text-body_small slds-text-color_weak">
                                    AI detected: pricing objection, competitor mention
                                </p>
                            </div>
                        </div>
                        <div class="slds-grid slds-gutters_xx-small slds-m-top_x-small">
                            <div class="slds-col">
                                <button class="slds-button slds-button_neutral slds-button_stretch" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">
                                    View Live Transcript
                                </button>
                            </div>
                            <div class="slds-col">
                                <button class="slds-button slds-button_brand slds-button_stretch" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">
                                    Join Call
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="slds-box slds-box_x-small" style="background-color: #feded8; border-left: 3px solid #c23934;">
                        <div class="slds-grid slds-grid_vertical-align-start">
                            <div class="slds-col slds-has-flexi-truncate">
                                <p class="slds-text-body_small slds-text-title slds-m-bottom_xxx-small">
                                    <span style="color: #c23934; font-weight: 600;">😞 Negative</span> • Sarah Johnson
                                </p>
                                <p class="slds-text-body_small slds-m-bottom_xxx-small">
                                    Call with XYZ Inc - 8 min
                                </p>
                                <p class="slds-text-body_small slds-text-color_weak">
                                    AI detected: billing dispute, escalation request
                                </p>
                            </div>
                        </div>
                        <div class="slds-grid slds-gutters_xx-small slds-m-top_x-small">
                            <div class="slds-col">
                                <button class="slds-button slds-button_neutral slds-button_stretch" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">
                                    View Live Transcript
                                </button>
                            </div>
                            <div class="slds-col">
                                <button class="slds-button slds-button_brand slds-button_stretch" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">
                                    Join Call
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="slds-text-align_center slds-m-top_small">
                        <a href="#" class="slds-text-link">View All Active Calls (12)</a>
                    </div>
                </div>
            </div>
        `;
    },

    renderAiPlaybookAdherence() {
        return `
            <div class="slds-card slds-m-top_medium">
                <div class="slds-card__header slds-grid">
                    <header class="slds-media slds-media_center slds-has-flexi-truncate">
                        <div class="slds-media__body">
                            <h2 class="slds-card__header-title">
                                AI Playbook Adherence
                            </h2>
                        </div>
                        <div class="slds-no-flex">
                            <span class="slds-badge slds-theme_warning">78%</span>
                        </div>
                    </header>
                </div>
                <div class="slds-card__body slds-card__body_inner">
                    <p class="slds-text-body_small slds-text-color_weak slds-m-bottom_small">
                        BANT Methodology - Last 7 Days
                    </p>

                    <div class="slds-m-bottom_small">
                        <div class="slds-grid slds-grid_vertical-align-center slds-m-bottom_xxx-small">
                            <div class="slds-col slds-has-flexi-truncate">
                                <p class="slds-text-body_small">Budget Discussed</p>
                            </div>
                            <div class="slds-col slds-no-flex">
                                <span class="slds-badge" style="background-color: #4bca81; color: white;">85%</span>
                            </div>
                        </div>
                        <div class="slds-progress-bar" style="height: 6px;">
                            <span class="slds-progress-bar__value" style="width: 85%; background-color: #4bca81;"></span>
                        </div>
                    </div>

                    <div class="slds-m-bottom_small">
                        <div class="slds-grid slds-grid_vertical-align-center slds-m-bottom_xxx-small">
                            <div class="slds-col slds-has-flexi-truncate">
                                <p class="slds-text-body_small">Authority Confirmed</p>
                            </div>
                            <div class="slds-col slds-no-flex">
                                <span class="slds-badge" style="background-color: #ffb75d; color: white;">72%</span>
                            </div>
                        </div>
                        <div class="slds-progress-bar" style="height: 6px;">
                            <span class="slds-progress-bar__value" style="width: 72%; background-color: #ffb75d;"></span>
                        </div>
                    </div>

                    <div class="slds-m-bottom_small">
                        <div class="slds-grid slds-grid_vertical-align-center slds-m-bottom_xxx-small">
                            <div class="slds-col slds-has-flexi-truncate">
                                <p class="slds-text-body_small">Need Identified</p>
                            </div>
                            <div class="slds-col slds-no-flex">
                                <span class="slds-badge" style="background-color: #4bca81; color: white;">91%</span>
                            </div>
                        </div>
                        <div class="slds-progress-bar" style="height: 6px;">
                            <span class="slds-progress-bar__value" style="width: 91%; background-color: #4bca81;"></span>
                        </div>
                    </div>

                    <div class="slds-m-bottom_small">
                        <div class="slds-grid slds-grid_vertical-align-center slds-m-bottom_xxx-small">
                            <div class="slds-col slds-has-flexi-truncate">
                                <p class="slds-text-body_small">Timing Captured</p>
                            </div>
                            <div class="slds-col slds-no-flex">
                                <span class="slds-badge" style="background-color: #c23934; color: white;">64%</span>
                            </div>
                        </div>
                        <div class="slds-progress-bar" style="height: 6px;">
                            <span class="slds-progress-bar__value" style="width: 64%; background-color: #c23934;"></span>
                        </div>
                    </div>

                    <div class="slds-text-align_center slds-m-top_small">
                        <a href="#" class="slds-text-link">View Agent Breakdown</a>
                    </div>
                </div>
            </div>
        `;
    },

    renderAgentAiActionItems() {
        return `
            <div class="slds-card slds-m-top_medium">
                <div class="slds-card__header slds-grid">
                    <header class="slds-media slds-media_center slds-has-flexi-truncate">
                        <div class="slds-media__body">
                            <h2 class="slds-card__header-title">
                                <span class="slds-icon_container slds-icon-utility-checklist" style="margin-right: 0.5rem;">
                                    <svg class="slds-icon slds-icon_x-small" aria-hidden="true" style="width: 16px; height: 16px; fill: #3A49DA;">
                                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#checklist"></use>
                                    </svg>
                                </span>
                                AI Action Items
                            </h2>
                        </div>
                        <div class="slds-no-flex">
                            <span class="slds-badge slds-theme_warning">3 Pending</span>
                        </div>
                    </header>
                </div>
                <div class="slds-card__body slds-card__body_inner">
                    <div class="slds-m-bottom_small">
                        <div class="slds-grid slds-grid_vertical-align-start slds-m-bottom_x-small">
                            <div class="slds-col slds-has-flexi-truncate">
                                <div class="slds-form-element">
                                    <div class="slds-form-element__control">
                                        <div class="slds-checkbox">
                                            <input type="checkbox" id="action-1" />
                                            <label class="slds-checkbox__label" for="action-1">
                                                <span class="slds-checkbox_faux"></span>
                                                <span class="slds-form-element__label slds-text-body_small">Send pricing quote to Acme Corp</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p class="slds-text-body_small slds-text-color_weak" style="margin-left: 1.5rem;">
                            <span style="color: #c23934; font-weight: 600;">Due: Today 5pm</span> • From call at 2:15pm
                        </p>
                    </div>

                    <div class="slds-m-bottom_small">
                        <div class="slds-grid slds-grid_vertical-align-start slds-m-bottom_x-small">
                            <div class="slds-col slds-has-flexi-truncate">
                                <div class="slds-form-element">
                                    <div class="slds-form-element__control">
                                        <div class="slds-checkbox">
                                            <input type="checkbox" id="action-2" />
                                            <label class="slds-checkbox__label" for="action-2">
                                                <span class="slds-checkbox_faux"></span>
                                                <span class="slds-form-element__label slds-text-body_small">Schedule demo for Tech Solutions Inc</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p class="slds-text-body_small slds-text-color_weak" style="margin-left: 1.5rem;">
                            <span style="color: #ffb75d; font-weight: 600;">Due: Tomorrow</span> • From call at 11:30am
                        </p>
                    </div>

                    <div class="slds-m-bottom_small">
                        <div class="slds-grid slds-grid_vertical-align-start slds-m-bottom_x-small">
                            <div class="slds-col slds-has-flexi-truncate">
                                <div class="slds-form-element">
                                    <div class="slds-form-element__control">
                                        <div class="slds-checkbox">
                                            <input type="checkbox" id="action-3" />
                                            <label class="slds-checkbox__label" for="action-3">
                                                <span class="slds-checkbox_faux"></span>
                                                <span class="slds-form-element__label slds-text-body_small">Send case study to Global Industries</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p class="slds-text-body_small slds-text-color_weak" style="margin-left: 1.5rem;">
                            <span style="color: #4bca81; font-weight: 600;">Due: Friday</span> • From call yesterday
                        </p>
                    </div>

                    <div class="slds-text-align_center slds-m-top_small">
                        <a href="#" class="slds-text-link">View All Action Items (5)</a>
                    </div>
                </div>
            </div>
        `;
    },

    renderAgentAiRecaps() {
        return `
            <div class="slds-card slds-m-top_medium">
                <div class="slds-card__header slds-grid">
                    <header class="slds-media slds-media_center slds-has-flexi-truncate">
                        <div class="slds-media__body">
                            <h2 class="slds-card__header-title">
                                <span class="slds-icon_container" style="margin-right: 0.5rem;">
                                    <svg class="slds-icon slds-icon_x-small" aria-hidden="true" style="width: 16px; height: 16px; fill: #3A49DA;">
                                        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#bundle_config"></use>
                                    </svg>
                                </span>
                                Recent AI Recaps
                            </h2>
                        </div>
                    </header>
                </div>
                <div class="slds-card__body slds-card__body_inner">
                    <div class="slds-box slds-box_x-small slds-theme_shade slds-m-bottom_small">
                        <div class="slds-grid slds-grid_vertical-align-start">
                            <div class="slds-col">
                                <p class="slds-text-body_small slds-text-title slds-m-bottom_xxx-small">
                                    <span class="slds-badge" style="background-color: #4bca81; color: white; margin-right: 0.25rem;">92% 😊</span>
                                    John Smith - 3:45pm
                                </p>
                                <p class="slds-text-body_small slds-m-bottom_xxx-small">
                                    Customer inquired about Enterprise pricing. Provided quote and discussed volume discounts. Follow-up scheduled.
                                </p>
                                <p class="slds-text-body_small slds-text-color_weak">
                                    <strong>Outcome:</strong> Quote Sent • <strong>Duration:</strong> 8 min
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="slds-box slds-box_x-small slds-theme_shade slds-m-bottom_small">
                        <div class="slds-grid slds-grid_vertical-align-start">
                            <div class="slds-col">
                                <p class="slds-text-body_small slds-text-title slds-m-bottom_xxx-small">
                                    <span class="slds-badge" style="background-color: #ffb75d; color: white; margin-right: 0.25rem;">78% 😐</span>
                                    Sarah Johnson - 2:15pm
                                </p>
                                <p class="slds-text-body_small slds-m-bottom_xxx-small">
                                    Support call regarding billing issue. Resolved duplicate charge, applied $50 credit to account.
                                </p>
                                <p class="slds-text-body_small slds-text-color_weak">
                                    <strong>Outcome:</strong> Issue Resolved • <strong>Duration:</strong> 12 min
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="slds-box slds-box_x-small slds-theme_shade">
                        <div class="slds-grid slds-grid_vertical-align-start">
                            <div class="slds-col">
                                <p class="slds-text-body_small slds-text-title slds-m-bottom_xxx-small">
                                    <span class="slds-badge" style="background-color: #4bca81; color: white; margin-right: 0.25rem;">95% 😊</span>
                                    Mike Chen - 11:30am
                                </p>
                                <p class="slds-text-body_small slds-m-bottom_xxx-small">
                                    Product demo completed successfully. Customer very interested in integration features. Next step: technical call with engineering.
                                </p>
                                <p class="slds-text-body_small slds-text-color_weak">
                                    <strong>Outcome:</strong> Demo Completed • <strong>Duration:</strong> 45 min
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="slds-text-align_center slds-m-top_small">
                        <a href="#" class="slds-text-link">View All Recaps</a>
                    </div>
                </div>
            </div>
        `;
    },

    updateTabVisibility() {
        const currentRole = RoleManager.getRole();

        // Show/hide tabs based on role visibility
        document.querySelectorAll('.slds-context-bar__item[data-role-visibility]').forEach(tabItem => {
            const visibleRoles = tabItem.getAttribute('data-role-visibility').split(',');
            if (visibleRoles.includes(currentRole)) {
                tabItem.style.display = '';
            } else {
                tabItem.style.display = 'none';
            }
        });
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
