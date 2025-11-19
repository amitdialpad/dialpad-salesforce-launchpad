// UI Helper Functions - Reusable UI utilities for card rendering and formatting

const UIHelpers = {
    /**
     * Get status badge class based on status value
     * @param {string} status - Status value ('online', 'offline', 'connected', 'disconnected')
     * @returns {string} CSS class name
     */
    getStatusClass(status) {
        if (status === 'online' || status === 'connected') return 'status-connected';
        if (status === 'offline' || status === 'disconnected') return 'status-disconnected';
        return 'status-wrap-up';
    },

    /**
     * Get agent state badge class
     * @param {string} state - Agent state ('On Call', 'Available', 'Wrap-Up', 'Break', 'Offline')
     * @returns {string} CSS class name
     */
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

    /**
     * Get icon name for agent state
     * @param {string} state - Agent state
     * @returns {string} Icon name for SLDS sprite
     */
    getStateIcon(state) {
        const iconMap = {
            'On Call': 'phone',
            'Available': 'success',
            'Wrap-Up': 'clock',
            'Break': 'away',
            'Offline': 'offline'
        };
        return iconMap[state] || 'user';
    },

    /**
     * Get alert icon based on type
     * @param {string} type - Alert type ('warning', 'error', 'info', 'success')
     * @returns {string} Icon name
     */
    getAlertIcon(type) {
        if (type === 'warning') return 'warning';
        if (type === 'error') return 'error';
        if (type === 'success') return 'check';
        return 'info';
    },

    /**
     * Get alert icon CSS class
     * @param {string} type - Alert type
     * @returns {string} CSS class name
     */
    getAlertIconClass(type) {
        if (type === 'warning') return 'slds-icon-text-warning';
        if (type === 'error') return 'slds-icon-text-error';
        if (type === 'success') return 'slds-icon-text-success';
        return 'slds-icon-text-default';
    },

    /**
     * Get utilization color based on percentage
     * @param {number} utilization - Utilization percentage (0-100)
     * @returns {string} Hex color code
     */
    getUtilizationColor(utilization) {
        if (utilization > 85) return '#c23934'; // Red
        if (utilization > 70) return '#e07c3e'; // Orange
        return '#04844b'; // Green
    },

    /**
     * Format relative time from date
     * @param {Date} date - Date object
     * @returns {string} Formatted relative time string
     */
    formatRelativeTime(date) {
        const now = new Date();
        const diff = Math.floor((now - date) / 1000); // seconds

        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    },

    /**
     * Create a clickable card with hover effects
     * @param {string} content - Inner HTML content
     * @param {string} href - Navigation URL (hash)
     * @returns {string} HTML string for clickable card wrapper
     */
    makeClickableCard(content, href = '#') {
        return `
            <div class="slds-card clickable-card"
                 style="cursor: pointer; transition: all 0.2s ease; height: 100%;"
                 onclick="window.location.hash='${href}'"
                 onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.15)'"
                 onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow=''">
                ${content}
            </div>
        `;
    },

    /**
     * Render card header
     * @param {string} title - Card title
     * @param {string} subtitle - Card subtitle (optional)
     * @param {string} actionHTML - HTML for action buttons (optional)
     * @returns {string} HTML for card header
     */
    renderCardHeader(title, subtitle = null, actionHTML = null) {
        return `
            <div class="slds-card__header slds-grid">
                <header class="slds-media slds-media_center slds-has-flexi-truncate">
                    <div class="slds-media__body">
                        <h2 class="slds-card__header-title">${title}</h2>
                        ${subtitle ? `<p class="slds-text-body_small slds-text-color_weak">${subtitle}</p>` : ''}
                    </div>
                </header>
                ${actionHTML ? `<div class="slds-no-flex">${actionHTML}</div>` : ''}
            </div>
        `;
    },

    /**
     * Render a metric display with value and label
     * @param {string|number} value - Metric value
     * @param {string} label - Metric label
     * @param {string} subtext - Optional subtext (e.g., trend info)
     * @param {string} color - Optional text color for value
     * @returns {string} HTML for metric display
     */
    renderMetric(value, label, subtext = null, color = '#001642') {
        return `
            <div>
                <div style="font-size: 2rem; font-weight: 700; color: ${color};">${value}</div>
                <div class="slds-text-body_small slds-text-color_weak">${label}</div>
                ${subtext ? `<div class="slds-text-body_small">${subtext}</div>` : ''}
            </div>
        `;
    },

    /**
     * Render a progress bar
     * @param {number} percent - Progress percentage (0-100)
     * @param {string} label - Label text
     * @param {string} color - Bar color (optional)
     * @returns {string} HTML for progress bar
     */
    renderProgressBar(percent, label = null, color = null) {
        const barColor = color || (percent > 85 ? '#c23934' : percent > 70 ? '#e07c3e' : '#3A49DA');
        return `
            ${label ? `<div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span class="slds-text-body_regular">${label}</span>
                <span class="slds-text-body_regular" style="color: ${barColor}; font-weight: 600;">${percent}%</span>
            </div>` : ''}
            <div class="slds-progress-bar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}" role="progressbar">
                <span class="slds-progress-bar__value" style="width: ${percent}%; background-color: ${barColor};">
                    <span class="slds-assistive-text">${percent}%</span>
                </span>
            </div>
        `;
    },

    /**
     * Render an SLDS badge
     * @param {string} text - Badge text
     * @param {string} cssClass - Additional CSS class
     * @returns {string} HTML for badge
     */
    renderBadge(text, cssClass = '') {
        return `<div class="slds-badge ${cssClass}" style="display: inline-block;">${text}</div>`;
    },

    /**
     * Render an icon
     * @param {string} iconName - SLDS icon name
     * @param {string} size - Size class ('x-small', 'small', 'medium', 'large')
     * @param {string} color - Fill color (optional)
     * @returns {string} HTML for icon
     */
    renderIcon(iconName, size = 'small', color = null) {
        const sizeClass = `slds-icon_${size}`;
        const styleAttr = color ? ` style="fill: ${color};"` : '';
        const basePath = window.BASE_PATH || '/';
        return `
            <svg class="slds-icon ${sizeClass}"${styleAttr} aria-hidden="true">
                <use xlink:href="${basePath}assets/icons/utility-sprite/svg/symbols.svg#${iconName}"></use>
            </svg>
        `;
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.UIHelpers = UIHelpers;
}
