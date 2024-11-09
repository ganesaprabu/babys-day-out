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
});