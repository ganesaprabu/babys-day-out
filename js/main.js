// Add to js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const loadingScreen = document.getElementById('loadingScreen');
    const appContainer = document.getElementById('appContainer');
    const startJourneyBtn = document.getElementById('startJourneyBtn');

    // Handle start journey button click
    startJourneyBtn.addEventListener('click', () => {
        // Hide welcome screen with fade out
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
            // Reset animation
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
            // Reset animation
            bookCoverInner.style.animation = 'none';
            bookCoverInner.offsetHeight; // Trigger reflow
            bookCoverInner.style.animation = 'bookOpen 2s ease-in-out';
        });
    }
});