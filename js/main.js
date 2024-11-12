// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const appContainer = document.getElementById('appContainer');
    const startJourneyBtn = document.getElementById('startJourneyBtn');

    startJourneyBtn.addEventListener('click', () => {
        console.log('Starting journey...');
        
        // Fade out the welcome screen
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            // Hide the welcome screen and show the app container
            welcomeScreen.classList.add('hidden');
            appContainer.classList.remove('hidden');

            // Activate the navigation panel without loading the map
            const navigationPanel = document.querySelector('.navigation-panel');
            if (navigationPanel) {
                navigationPanel.classList.add('active');
            } else {
                console.error('Navigation panel not found');
            }

            // Initialize the NavigationController
            if (window.NavigationController) {
                window.NavigationController.init();
            } else {
                console.error('NavigationController not found on window');
            }
        }, 500);
    });

    // Book cover animation handlers
    const bookImage = document.querySelector('.book-cover img');
    if (bookImage) {
        bookImage.onload = () => {
            const bookCoverInner = document.querySelector('.book-cover-inner');
            if (bookCoverInner) {
                bookCoverInner.style.animation = 'none';
                bookCoverInner.offsetHeight; // Trigger reflow
                bookCoverInner.style.animation = null;
            }
        };
    }

    const bookCover = document.querySelector('.book-cover');
    if (bookCover) {
        bookCover.addEventListener('click', () => {
            const bookCoverInner = document.querySelector('.book-cover-inner');
            if (bookCoverInner) {
                bookCoverInner.style.animation = 'none';
                bookCoverInner.offsetHeight; // Trigger reflow
                bookCoverInner.style.animation = 'bookOpen 2s ease-in-out';
            }
        });
    }
});