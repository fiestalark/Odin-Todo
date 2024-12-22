export class ThemeToggle {
    constructor() {
        this.init();
    }

    init() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Set Initial toggle state
        const toggle = document.getElementById('theme-toggle');
        toggle.checked = savedTheme === 'dark';

        // Add event listener
        toggle.addEventListener('change', () => this.toggleTheme());

        // Also check system preference
        this.checkSystemPreference();
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    checkSystemPreference() {
        // Check if user has set preference
        if (!localStorage.getItem('theme')) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
            document.getElementById('theme-toggle').checked = prefersDark;
        }
    }
}
