// Charts Service - Handle all chart rendering with Chart.js

const ChartsService = {
    charts: {},

    destroy(chartId) {
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
            delete this.charts[chartId];
        }
    },

    destroyAll() {
        Object.keys(this.charts).forEach(id => this.destroy(id));
    },

    // Calls by Department Bar Chart
    createCallsByDepartmentChart(canvasId, data) {
        this.destroy(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const deptData = {};
        data.forEach(call => {
            deptData[call.department] = (deptData[call.department] || 0) + 1;
        });

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(deptData),
                datasets: [{
                    label: 'Number of Calls',
                    data: Object.values(deptData),
                    backgroundColor: ['#0176d3', '#16325c', '#706e6b']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    },

    // Calls Over Time Line Chart
    createCallsOverTimeChart(canvasId, data) {
        this.destroy(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        // Group by hour
        const hourCounts = {};
        data.forEach(call => {
            const hour = new Date(call.timestamp).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });

        const hours = Object.keys(hourCounts).sort((a, b) => a - b);
        const counts = hours.map(h => hourCounts[h]);

        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hours.map(h => `${h}:00`),
                datasets: [{
                    label: 'Calls per Hour',
                    data: counts,
                    borderColor: '#0176d3',
                    backgroundColor: 'rgba(1, 118, 211, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    },

    // Call Dispositions Donut Chart
    createDispositionsChart(canvasId, data) {
        this.destroy(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const dispositions = {};
        data.forEach(call => {
            if (call.disposition) {
                dispositions[call.disposition] = (dispositions[call.disposition] || 0) + 1;
            }
        });

        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(dispositions),
                datasets: [{
                    data: Object.values(dispositions),
                    backgroundColor: [
                        '#0176d3', '#16325c', '#706e6b', '#c23934',
                        '#04844b', '#e07c3e', '#8b7ead', '#54698d'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' }
                }
            }
        });
    },

    // Agent Performance Comparison
    createAgentPerformanceChart(canvasId, users, calls) {
        this.destroy(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const agents = users.filter(u => u.role === 'Agent');
        const agentCalls = {};

        calls.forEach(call => {
            agentCalls[call.userId] = (agentCalls[call.userId] || 0) + 1;
        });

        const names = agents.map(a => a.name.split(' ')[0]);
        const callCounts = agents.map(a => agentCalls[a.id] || 0);

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: names,
                datasets: [{
                    label: 'Calls Made',
                    data: callCounts,
                    backgroundColor: '#0176d3'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    },

    // Calls by Office Pie Chart
    createCallsByOfficeChart(canvasId, data) {
        this.destroy(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const offices = {};
        data.forEach(call => {
            offices[call.office] = (offices[call.office] || 0) + 1;
        });

        this.charts[canvasId] = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(offices),
                datasets: [{
                    data: Object.values(offices),
                    backgroundColor: ['#0176d3', '#16325c', '#706e6b']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    },

    // Missed Calls by Hour Line Chart
    createMissedCallsChart(canvasId, data) {
        this.destroy(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const missedCalls = data.filter(c => c.status === 'Missed');
        const hourCounts = {};

        missedCalls.forEach(call => {
            const hour = new Date(call.timestamp).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });

        const hours = Object.keys(hourCounts).sort((a, b) => a - b);
        const counts = hours.map(h => hourCounts[h]);

        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hours.map(h => `${h}:00`),
                datasets: [{
                    label: 'Missed Calls',
                    data: counts,
                    borderColor: '#c23934',
                    backgroundColor: 'rgba(194, 57, 52, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    },

    // Call Direction Split (Inbound vs Outbound)
    createCallDirectionChart(canvasId, data) {
        this.destroy(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const directions = { Inbound: 0, Outbound: 0 };
        data.forEach(call => {
            directions[call.direction] = (directions[call.direction] || 0) + 1;
        });

        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Inbound', 'Outbound'],
                datasets: [{
                    data: [directions.Inbound, directions.Outbound],
                    backgroundColor: ['#04844b', '#0176d3']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
};
