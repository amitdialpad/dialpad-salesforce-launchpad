// Role Manager - Handles role switching and persistence

const RoleManager = {
    currentRole: 'admin', // default role

    init() {
        // Load role from localStorage
        const savedRole = localStorage.getItem('dialpad_current_role');
        if (savedRole) {
            this.currentRole = savedRole;
        }
        this.updateUI();
        this.attachEventListeners();
    },

    setRole(role) {
        this.currentRole = role;
        localStorage.setItem('dialpad_current_role', role);
        this.updateUI();
        // Trigger role change event
        window.dispatchEvent(new CustomEvent('roleChanged', { detail: { role } }));
    },

    getRole() {
        return this.currentRole;
    },

    updateUI() {
        // Update checked state on role radio buttons
        document.querySelectorAll('input[name="role"]').forEach(radio => {
            const radioRole = radio.value;
            if (radioRole === this.currentRole) {
                radio.checked = true;
            } else {
                radio.checked = false;
            }
        });

        // Update role indicator in header
        const roleIndicator = document.getElementById('current-role-indicator');
        if (roleIndicator) {
            const roleText = this.currentRole.charAt(0).toUpperCase() + this.currentRole.slice(1);
            roleIndicator.textContent = `(${roleText})`;
        }
    },

    attachEventListeners() {
        // Role radio buttons
        document.querySelectorAll('input[name="role"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    const role = e.target.value;
                    this.setRole(role);
                }
            });
        });
    }
};
