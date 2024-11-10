// Location: /babys-day-out/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // Force hide story panel immediately
    const storyPanel = document.getElementById('storyPanel');
    if (storyPanel) {
        storyPanel.style.display = 'none';
        storyPanel.style.opacity = '0';
        storyPanel.style.visibility = 'hidden'; // Add extra hiding
    }
    
    const welcomeScreen = document.getElementById('welcomeScreen');
    const loadingScreen = document.getElementById('loadingScreen');
    const appContainer = document.getElementById('appContainer');
    const startJourneyBtn = document.getElementById('startJourneyBtn');

    // Ensure StoryPanel exists before initializing
    if (window.StoryPanel && typeof window.StoryPanel.init === 'function') {
        window.StoryPanel.init();
    } else {
        DEBUG.error('StoryPanel not loaded properly');
    }

    // Handle start journey button click
    startJourneyBtn.addEventListener('click', () => {
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            welcomeScreen.classList.add('hidden');
            loadingScreen.classList.remove('hidden');
            
            // Initialize the map and load resources
            window.BABY_APP.init();
        }, 500);
    });

    // Add class to trigger animation when image is loaded
    const bookImage = document.querySelector('.book-cover img');
    if (bookImage) {
        bookImage.onload = () => {
            const bookCoverInner = document.querySelector('.book-cover-inner');
            bookCoverInner.style.animation = 'none';
            bookCoverInner.offsetHeight; // Trigger reflow
            bookCoverInner.style.animation = null;
        };
    }

    // Add replay animation on click
    const bookCover = document.querySelector('.book-cover');
    if (bookCover) {
        bookCover.addEventListener('click', () => {
            const bookCoverInner = document.querySelector('.book-cover-inner');
            bookCoverInner.style.animation = 'none';
            bookCoverInner.offsetHeight; // Trigger reflow
            bookCoverInner.style.animation = 'bookOpen 2s ease-in-out';
        });
    }
});