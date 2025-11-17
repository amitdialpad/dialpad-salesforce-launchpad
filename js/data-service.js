// Data Service - Handles loading and filtering mock data

const DataService = {
    calls: [],
    users: [],
    metrics: {},
    lists: [],

    async init() {
        try {
            // Load all data files
            const [callsRes, usersRes, metricsRes, listsRes] = await Promise.all([
                fetch('data/calls.json'),
                fetch('data/users.json'),
                fetch('data/metrics.json'),
                fetch('data/lists.json')
            ]);

            const callsData = await callsRes.json();
            const usersData = await usersRes.json();
            const metricsData = await metricsRes.json();
            const listsData = await listsRes.json();

            this.calls = callsData.calls;
            this.users = usersData.users;
            this.metrics = metricsData;
            this.lists = listsData.lists;

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
            return {
                callsToday: agentCalls.length,
                avgCallDuration: Math.round(
                    agentCalls.reduce((sum, c) => sum + c.duration, 0) / agentCalls.length
                ),
                totalTalkTime: agentCalls.reduce((sum, c) => sum + c.duration, 0),
                completedCalls: agentCalls.filter(c => c.status === 'Completed').length
            };
        }
        return this.metrics.company;
    },

    // Get lists for role
    getLists(role) {
        if (role === 'admin' || role === 'supervisor') {
            return this.lists;
        } else if (role === 'agent') {
            const agent = this.users.find(u => u.role === 'Agent');
            if (agent) {
                return this.lists.filter(list => list.assignedAgents.includes(agent.id));
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
    }
};
