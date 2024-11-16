// js/features/narration-handler.js

const NarrationSystem = {
    currentBubble: null,
    container: null,

    init() {
        console.log('Initializing NarrationSystem');
        // Create container for narration bubbles if it doesn't exist
        if (!this.container) {
            this.container = document.querySelector('.narration-container');
            if (!this.container) {
                console.log('Creating new narration container');
                this.container = document.createElement('div');
                this.container.className = 'narration-container';
                document.body.appendChild(this.container);
            }
        }
    },

    show(message, icon = '🔬', duration = 5000) {
        console.log('Showing narration:', message);
        
        // Ensure container exists
        if (!this.container) {
            this.init();
        }

        // Remove existing bubble if any
        this.hide();

        try {
            // Create new bubble
            const bubble = document.createElement('div');
            bubble.className = 'narration-bubble';
            bubble.innerHTML = `
                <span class="narration-icon">${icon}</span>
                <div class="narration-content">${message}</div>
            `;

            this.container.appendChild(bubble);
            this.currentBubble = bubble;

            // Trigger animation
            requestAnimationFrame(() => {
                bubble.classList.add('entering');
                bubble.classList.add('active');
            });

            // Set up automatic removal if duration provided
            if (duration) {
                setTimeout(() => this.hide(), duration);
            }

            return bubble;
        } catch (error) {
            console.error('Error showing narration:', error);
        }
    },

    hide() {
        console.log('Hiding current narration');
        if (this.currentBubble) {
            this.currentBubble.classList.add('exiting');
            this.currentBubble.classList.remove('active');
            
            setTimeout(() => {
                if (this.currentBubble && this.currentBubble.parentNode) {
                    this.currentBubble.parentNode.removeChild(this.currentBubble);
                }
                this.currentBubble = null;
            }, 500);
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    NarrationSystem.init();
});

window.NarrationSystem = NarrationSystem;