// Location: /babys-day-out/js/ui/story-panels.js

const StoryPanel = {
    init: function() {
        const storyPanel = document.getElementById('storyPanel');
        if (storyPanel) {
            storyPanel.style.opacity = '0';
            storyPanel.style.display = 'none';
            storyPanel.classList.remove('visible');
        }
    },

    show: function() {
        const storyPanel = document.getElementById('storyPanel');
        if (storyPanel) {
            storyPanel.style.display = 'block';
            // Use setTimeout to ensure display:block takes effect before opacity transition
            setTimeout(() => {
                storyPanel.style.opacity = '1';
                storyPanel.classList.add('visible');
            }, 50);
        }
    },

    hide: function() {
        const storyPanel = document.getElementById('storyPanel');
        if (storyPanel) {
            storyPanel.style.opacity = '0';
            storyPanel.classList.remove('visible');
            setTimeout(() => {
                storyPanel.style.display = 'none';
            }, 500); // Match the transition duration
        }
    }
};

// Initialize story panel when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    StoryPanel.init();
});

window.StoryPanel = StoryPanel;