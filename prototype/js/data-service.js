// Data Service - Handles loading and filtering mock data

const DataService = {
    calls: [],
    users: [],
    metrics: {},
    lists: [],
    cases: [],

    async init() {
        try {
            // Load all data files
            const [callsRes, usersRes, metricsRes, listsRes, casesRes] = await Promise.all([
                fetch('data/calls.json'),
                fetch('data/users.json'),
                fetch('data/metrics.json'),
                fetch('data/lists.json'),
                fetch('data/cases.json')
            ]);

            const callsData = await callsRes.json();
            const usersData = await usersRes.json();
            const metricsData = await metricsRes.json();
            const listsData = await listsRes.json();
            const casesData = await casesRes.json();

            this.calls = callsData.calls;
            this.users = usersData.users;
            this.metrics = metricsData;
            this.lists = listsData.lists;
            this.cases = casesData;

            return true;
        } catch (error) {
            console.error('Error loading data:', error);
            return false;
        }
    },

    // Get calls filtered by role and user
    getCalls(role, userId = null) {
        if (role === 'admin') {
            return this.calls;
        } else if (role === 'supervisor') {
            // Supervisor sees calls from their department
            const supervisor = this.users.find(u => u.role === 'Supervisor');
            if (supervisor) {
                return this.calls.filter(call => {
                    const user = this.users.find(u => u.id === call.userId);
                    return user && user.department === supervisor.department;
                });
            }
            return this.calls;
        } else if (role === 'agent') {
            // Agent sees only their calls
            const agent = this.users.find(u => u.role === 'Agent');
            if (agent) {
                return this.calls.filter(call => call.userId === agent.id);
            }
            return [];
        }
        return this.calls;
    },

    // Get users visible to current role
    getUsers(role) {
        if (role === 'admin') {
            return this.users;
        } else if (role === 'supervisor') {
            // Supervisor sees users in their department
            const supervisor = this.users.find(u => u.role === 'Supervisor');
            if (supervisor) {
                return this.users.filter(u => u.department === supervisor.department);
            }
            return this.users;
        }
        return this.users.filter(u => u.role === 'Agent').slice(0, 1); // Agent sees only themselves
    },

    // Get metrics for role
    getMetrics(role) {
        if (role === 'admin') {
            return this.metrics.company;
        } else if (role === 'supervisor') {
            // Calculate team metrics
            const supervisor = this.users.find(u => u.role === 'Supervisor');
            if (supervisor) {
                const teamCalls = this.getCalls('supervisor');
                return {
                    callsToday: teamCalls.length,
                    avgCallDuration: Math.round(
                        teamCalls.reduce((sum, c) => sum + c.duration, 0) / teamCalls.length
                    ),
                    missedCalls: teamCalls.filter(c => c.status === 'Missed').length,
                    teamSize: this.getUsers('supervisor').length
                };
            }
        } else if (role === 'agent') {
            // Calculate personal metrics
            const agentCalls = this.getCalls('agent');
            const totalDuration = agentCalls.reduce((sum, c) => sum + c.duration, 0);
            const avgDuration = agentCalls.length > 0 ? Math.round(totalDuration / agentCalls.length) : 0;

            // Calculate calls per hour (assuming 8 hour workday)
            const hoursWorked = 4.5; // Mock: agent has been working 4.5 hours today
            const callsPerHour = hoursWorked > 0 ? (agentCalls.length / hoursWorked).toFixed(1) : '0.0';

            return {
                calls: agentCalls.length, // Renamed from callsToday for consistency
                waitingCalls: 0, // Outbound focused, no queue
                missedCalls: agentCalls.filter(c => c.status === 'Missed').length,
                avgWaitingTime: 0, // Outbound focused
                serviceScore: 88.89, // Mock CSAT score
                callsPerHour: parseFloat(callsPerHour),
                avgCallDuration: avgDuration,
                totalTalkTime: totalDuration,
                completedCalls: agentCalls.filter(c => c.status === 'Completed').length,
                // New: Work time breakdown (in minutes)
                workTime: {
                    talkTime: Math.round(totalDuration / 60), // Convert seconds to minutes
                    wrapUpTime: 45, // Mock
                    readyTime: 90, // Mock
                    holdTime: 12, // Mock
                    total: Math.round(totalDuration / 60) + 45 + 90 + 12
                },
                // New: Call type breakdown
                callTypeBreakdown: {
                    inbound: agentCalls.filter(c => c.direction === 'Inbound').length,
                    outbound: agentCalls.filter(c => c.direction === 'Outbound').length
                }
            };
        }
        return this.metrics.company;
    },

    // Get lists for role
    getLists(role) {
        if (role === 'admin' || role === 'supervisor') {
            return this.lists;
        } else if (role === 'agent') {
            // Use the current user ID from RoleManager to filter lists
            const currentUserId = window.RoleManager?.currentUserId;
            if (currentUserId) {
                return this.lists.filter(list => list.assignedAgents.includes(currentUserId));
            }
        }
        return [];
    },

    // Format duration in seconds to MM:SS
    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    // Format timestamp to readable date
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    },

    // Get unlogged calls (simulated - returns most recent completed calls)
    getUnloggedCalls(count) {
        if (count === 0) return [];

        // Get completed calls sorted by timestamp (most recent first)
        const completedCalls = this.calls
            .filter(call => call.status === 'Completed')
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Return the requested number of calls
        return completedCalls.slice(0, count);
    },

    // Get AI CSAT trend data (7-day trend)
    getAICsatTrend() {
        const today = new Date();
        const trend = [];

        // Generate 7 days of mock data with slight variations
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            // Mock scores with realistic variation around 4.7
            const baseScore = 4.7;
            const variation = (Math.random() - 0.5) * 0.4; // +/- 0.2
            const score = Math.max(3.5, Math.min(5.0, baseScore + variation));

            trend.push({
                date: date.toISOString().split('T')[0],
                score: parseFloat(score.toFixed(1))
            });
        }

        return {
            average: 4.7,
            trend: trend,
            totalResponses: 45
        };
    },

    // Get powerdialer queue (next contacts to call)
    getPowerdialerQueue(listId = null, count = 3) {
        // Mock powerdialer queue data
        return [
            {
                id: 'contact-1',
                name: 'John Smith',
                company: 'Acme Corp',
                phone: '(555) 123-4567',
                lastActivity: '3 days ago',
                priority: 'High'
            },
            {
                id: 'contact-2',
                name: 'Jane Doe',
                company: 'TechCo Inc',
                phone: '(555) 234-5678',
                lastActivity: '1 week ago',
                priority: 'Medium'
            },
            {
                id: 'contact-3',
                name: 'Bob Wilson',
                company: 'StartupXYZ',
                phone: '(555) 345-6789',
                lastActivity: 'Never contacted',
                priority: 'Medium'
            }
        ].slice(0, count);
    },

    // Get supervisor-specific metrics for dashboard
    getSupervisorMetrics() {
        const teamCalls = this.getCalls('supervisor');
        const teamUsers = this.getUsers('supervisor');
        const agents = teamUsers.filter(u => u.role === 'Agent');

        // Calculate handled calls breakdown
        const inbound = teamCalls.filter(c => c.direction === 'Inbound').length;
        const outbound = teamCalls.filter(c => c.direction === 'Outbound').length;
        const callbacks = Math.floor(teamCalls.length * 0.12); // Mock: 12% are connected callbacks

        // Calculate AI scorecard metrics
        const aiScorecard = {
            average: 88,
            totalCalls: teamCalls.length,
            trend: [85, 83, 86, 84, 87, 86, 88, 89, 88, 87, 88] // Mock trend data by hour
        };

        // Calculate AI Agent metrics (AI bot answering calls)
        const aiAgent = {
            totalSessions: 147,
            deflectionRate: 19, // 19% of calls resolved by AI without human
            automated: Math.floor(147 * 0.19),
            notAutomated: Math.floor(147 * 0.81)
        };

        // Calculate AI CSAT
        const aiCsat = {
            score: 4.7,
            totalResponses: 156,
            trend: this.getAICsatTrend() // Reuse existing method
        };

        // Active agents calculation
        const activeAgents = agents.filter(u => u.state === 'On Call' || u.state === 'Available').length;

        return {
            handledCalls: {
                total: teamCalls.length,
                inbound,
                outbound,
                callbacks
            },
            aiScorecard,
            aiAgent,
            aiCsat,
            activeAgents: {
                active: activeAgents,
                total: agents.length
            },
            missedCalls: teamCalls.filter(c => c.status === 'Missed').length,
            avgHandleTime: Math.round(teamCalls.reduce((sum, c) => sum + c.duration, 0) / teamCalls.length),
            unloggedCalls: this.getUnloggedCalls(5) // Get first 5 unlogged calls
        };
    },

    // Get agent status for real-time monitoring
    getAgentStatusList() {
        const teamUsers = this.getUsers('supervisor');
        const agents = teamUsers.filter(u => u.role === 'Agent');

        return agents.map(agent => ({
            id: agent.id,
            name: agent.name,
            state: agent.state,
            stateDuration: this.getStateDuration(agent.state), // How long in current state
            extension: agent.extension || 'N/A'
        })).sort((a, b) => {
            // Sort by state priority: On Call > Available > Wrap-Up > Break > Offline
            const priority = { 'On Call': 1, 'Available': 2, 'Wrap-Up': 3, 'Break': 4, 'Offline': 5 };
            return (priority[a.state] || 99) - (priority[b.state] || 99);
        });
    },

    getStateDuration(state) {
        // Mock: return random durations
        const durations = ['2m', '15m', '1h 5m', '45s', '3m 20s'];
        return durations[Math.floor(Math.random() * durations.length)];
    },

    // Get cases filtered by owner
    getCases(userId = null, statusFilter = 'open') {
        let filteredCases = this.cases;

        // Filter by owner if userId provided
        if (userId) {
            filteredCases = filteredCases.filter(c => c.ownerId === userId);
        }

        // Filter by status
        if (statusFilter === 'open') {
            filteredCases = filteredCases.filter(c =>
                ['New', 'In Progress', 'Escalated'].includes(c.status)
            );
        } else if (statusFilter !== 'all') {
            filteredCases = filteredCases.filter(c => c.status === statusFilter);
        }

        // Sort by priority (High > Medium > Low) then by created date (newest first)
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        return filteredCases.sort((a, b) => {
            const priorityDiff = (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
            if (priorityDiff !== 0) return priorityDiff;
            return new Date(b.createdDate) - new Date(a.createdDate);
        });
    },

    // Get case count by status for a user
    getCaseCountsByStatus(userId = null) {
        let cases = this.cases;
        if (userId) {
            cases = cases.filter(c => c.ownerId === userId);
        }

        return {
            new: cases.filter(c => c.status === 'New').length,
            inProgress: cases.filter(c => c.status === 'In Progress').length,
            escalated: cases.filter(c => c.status === 'Escalated').length,
            total: cases.filter(c => ['New', 'In Progress', 'Escalated'].includes(c.status)).length
        };
    },

    // Get rankings by Contact Centers
    getRankingsByCCs() {
        return [
            { name: 'Support CC', score: 92, calls: 156 },
            { name: 'Billing CC', score: 91, calls: 89 },
            { name: 'CC Help Main', score: 90, calls: 134 },
            { name: 'Mobile contact', score: 89, calls: 67 },
            { name: 'Web to agent', score: 83, calls: 98 }
        ];
    },

    // Get rankings by Agents
    getRankingsByAgents() {
        const teamUsers = this.getUsers('supervisor');
        const agents = teamUsers.filter(u => u.role === 'Agent');
        const teamCalls = this.getCalls('supervisor');

        return agents.map(agent => {
            const agentCalls = teamCalls.filter(c => c.userId === agent.id);
            // Mock CSAT score per agent
            const csatScore = (4.0 + Math.random() * 1.0).toFixed(1);
            return {
                name: agent.name.split(' ')[0], // First name only
                score: parseFloat(csatScore),
                calls: agentCalls.length
            };
        }).sort((a, b) => b.score - a.score).slice(0, 5); // Top 5 agents
    },

    // Get admin-specific metrics for dashboard
    getAdminMetrics() {
        const allCalls = this.calls;
        const allUsers = this.users;

        // Calculate system health
        const systemHealth = {
            coreService: 'online',
            voice: 'online',
            chatSms: 'online',
            analytics: 'online',
            ai: 'offline', // Mock: AI service offline for demo
            salesforceIntegration: AppState.integrationStatus === 'connected' ? 'online' : 'offline'
        };

        // Calculate user stats
        const totalUsers = allUsers.length;
        const activeToday = allUsers.filter(u => u.role === 'Agent' && (u.state === 'On Call' || u.state === 'Available')).length;
        const connectionIssues = 2; // Mock: 2 users with connection problems
        const neverLoggedIn = 5; // Mock

        // OAuth / Salesforce Connection Stats (Demo Control: Show OAuth Errors)
        const oauthDisconnected = AppState.showOAuthErrors ? 5 : 0; // Mock: users not connected to Salesforce
        const oauthExpired = AppState.showOAuthErrors ? 2 : 0; // Mock: users with expired OAuth tokens
        const oauthExpiringSoon = AppState.showOAuthErrors ? 3 : 0; // Mock: tokens expiring in < 7 days
        const oauthConnected = totalUsers - oauthDisconnected - oauthExpired;
        const failedCallLogs24h = AppState.showOAuthErrors ? 12 : 0; // Mock: call logs that failed due to OAuth issues in last 24h

        // Calculate license utilization
        const licensesTotal = 50;
        const licensesUsed = totalUsers;
        const licenseUtilization = Math.round((licensesUsed / licensesTotal) * 100);

        // Calculate company-wide metrics
        const totalCalls = allCalls.length;
        const avgCallDuration = Math.round(allCalls.reduce((sum, c) => sum + c.duration, 0) / allCalls.length);
        const missedCalls = allCalls.filter(c => c.status === 'Missed').length;
        const serviceScore = 88.89;

        // Integration health (read from AppState)
        const integrationHealth = {
            status: AppState.integrationStatus,
            lastSync: AppState.integrationStatus === 'connected' ? AppState.lastSyncTime : null,
            apiUsage: AppState.integrationStatus === 'connected' ? 1234 : 0,
            apiLimit: 5000,
            errorCount24h: AppState.integrationStatus === 'disconnected' ? 1 : 0,
            permissionSetsAssigned: licensesUsed,
            permissionSetsTotal: licensesTotal
        };

        // Setup completion
        const setupSteps = [
            { id: 1, name: 'Install Dialpad package', status: 'completed' },
            { id: 2, name: 'Configure Salesforce authentication', status: 'completed' },
            { id: 3, name: 'Assign Admin permission set', status: 'completed' },
            { id: 4, name: 'Import user list', status: 'completed' },
            { id: 5, name: 'Test connection in Sandbox', status: 'completed' },
            { id: 6, name: 'Configure routing rules', status: 'in-progress' },
            { id: 7, name: 'Set up call recording policies', status: 'pending' },
            { id: 8, name: 'Schedule training sessions', status: 'pending' }
        ];

        const completedSteps = setupSteps.filter(s => s.status === 'completed').length;
        const totalSteps = setupSteps.length;
        const setupProgress = Math.round((completedSteps / totalSteps) * 100);

        // Admin alerts
        const alerts = [];
        if (AppState.integrationStatus === 'disconnected') {
            alerts.push({ type: 'error', message: 'Salesforce integration is disconnected. Call logging and data sync are disabled.', severity: 'high' });
        }

        // OAuth summary alerts (high-level awareness, details in dedicated cards)
        if (oauthDisconnected > 0) {
            alerts.push({ type: 'error', message: `${oauthDisconnected} users not connected to Salesforce - calls not logging`, severity: 'high' });
        }
        if (failedCallLogs24h > 0) {
            alerts.push({ type: 'warning', message: `${failedCallLogs24h} call logs failed to sync in last 24 hours`, severity: 'medium' });
        }

        if (systemHealth.ai === 'offline') {
            alerts.push({ type: 'warning', message: 'AI service is currently offline', severity: 'medium' });
        }
        if (connectionIssues > 0) {
            alerts.push({ type: 'warning', message: `${connectionIssues} users experiencing connection issues`, severity: 'medium' });
        }
        if (licenseUtilization > 85) {
            alerts.push({ type: 'info', message: `License utilization at ${licenseUtilization}% - consider purchasing more licenses`, severity: 'low' });
        }
        if (setupProgress < 100) {
            alerts.push({ type: 'info', message: `Setup ${setupProgress}% complete - ${totalSteps - completedSteps} steps remaining`, severity: 'low' });
        }

        // Product announcements
        const announcements = [
            {
                id: 1,
                type: 'update',
                title: 'Release 25.09.30: Auto-Restore Unsaved Fields',
                message: 'Unsaved fields like notes, subject, and dispositions are now automatically restored when the Salesforce CTI or page is refreshed.',
                date: new Date('2025-09-30'), // September 2025
                read: false
            },
            {
                id: 2,
                type: 'feature',
                title: 'Release 25.07.01: Custom Objects Screen Pop',
                message: 'Custom objects now show up with screen pop in both Dialpad and Salesforce. Incoming calls trigger the related Salesforce record tied to the caller.',
                date: new Date('2025-07-01'), // July 2025
                read: false
            },
            {
                id: 3,
                type: 'feature',
                title: 'Release 25.03.18 (V1.793): Call Dispositions',
                message: 'Dialpad Connect users can now use call dispositions in the Salesforce CTI for richer data insights and improved call tracking.',
                date: new Date('2025-03-18'), // March 2025
                read: false
            }
        ];

        // Recent activity
        const recentActivity = [
            { timestamp: new Date(Date.now() - 300000), user: 'Admin User', activity: 'Updated routing rules for Sales team', type: 'config' },
            { timestamp: new Date(Date.now() - 900000), user: 'John Smith', activity: 'Logged in from new device', type: 'user' },
            { timestamp: new Date(Date.now() - 1800000), user: 'Admin User', activity: 'Added 3 new users to Agent role', type: 'user' },
            { timestamp: new Date(Date.now() - 3600000), user: 'Sarah Johnson', activity: 'Connection failed - API timeout', type: 'error' },
            { timestamp: new Date(Date.now() - 7200000), user: 'System', activity: 'Nightly backup completed successfully', type: 'system' }
        ];

        return {
            systemHealth,
            users: {
                total: totalUsers,
                activeToday,
                connectionIssues,
                neverLoggedIn,
                connected: totalUsers - connectionIssues - neverLoggedIn
            },
            oauth: {
                connected: oauthConnected,
                disconnected: oauthDisconnected,
                expired: oauthExpired,
                expiringSoon: oauthExpiringSoon,
                failedCallLogs24h: failedCallLogs24h
            },
            licenses: {
                total: licensesTotal,
                used: licensesUsed,
                available: licensesTotal - licensesUsed,
                utilization: licenseUtilization
            },
            calls: {
                total: totalCalls,
                avgDuration: avgCallDuration,
                missed: missedCalls,
                serviceScore
            },
            integration: integrationHealth,
            setup: {
                steps: setupSteps,
                completed: completedSteps,
                total: totalSteps,
                progress: setupProgress
            },
            alerts,
            announcements,
            recentActivity
        };
    },

    // Get activity by channel for admin dashboard chart
    getActivityByChannel() {
        // Mock data for 24-hour activity chart
        const hours = [];
        for (let i = 0; i < 24; i++) {
            hours.push({
                hour: i,
                calls: Math.floor(Math.random() * 50) + 20,
                sms: Math.floor(Math.random() * 30) + 10,
                whatsapp: Math.floor(Math.random() * 20) + 5,
                email: Math.floor(Math.random() * 40) + 15
            });
        }
        return hours;
    }
};
