// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const appContainer = document.getElementById('appContainer');
    const startJourneyBtn = document.getElementById('startJourneyBtn');

    // Handle start journey button click
    startJourneyBtn.addEventListener('click', () => {
        console.log('Starting journey...');
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            welcomeScreen.classList.add('hidden');
            appContainer.classList.remove('hidden');
            
            // Initialize map and navigation
            initMap();
        }, 500);
    });

    // Book cover animation handlers
    const bookImage = document.querySelector('.book-cover img');
    if (bookImage) {
        bookImage.onload = () => {
            const bookCoverInner = document.querySelector('.book-cover-inner');
            bookCoverInner.style.animation = 'none';
            bookCoverInner.offsetHeight;
            bookCoverInner.style.animation = null;
        };
    }

    const bookCover = document.querySelector('.book-cover');
    if (bookCover) {
        bookCover.addEventListener('click', () => {
            const bookCoverInner = document.querySelector('.book-cover-inner');
            bookCoverInner.style.animation = 'none';
            bookCoverInner.offsetHeight;
            bookCoverInner.style.animation = 'bookOpen 2s ease-in-out';
        });
    }
});