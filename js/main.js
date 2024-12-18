// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const appContainer = document.getElementById('appContainer');
    const startJourneyBtn = document.getElementById('startJourneyBtn');

    // Add variable for FishermansWharfController instance
    let fishermansWharfController;

    startJourneyBtn.addEventListener('click', async () => {
        console.log('Starting journey...');
        
        // Fade out the welcome screen
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(async () => {
            // Hide the welcome screen and show the app container
            welcomeScreen.classList.add('hidden');
            appContainer.classList.remove('hidden');
    
            try {
                // Initialize map if not already done
                if (!window.BABY_APP.mapInstance) {
                    await loadGoogleMapsAPI();
                    await initMap();
                }
            
                // Ensure MapController is initialized
                if (!MapController.map) {
                    await MapController.init(window.BABY_APP.mapInstance);
                }
            
                // Initialize FishermansWharfController
                console.log("Initializing Fisherman's Wharf Controller");
                fishermansWharfController = new FishermansWharfController(window.BABY_APP.mapInstance);
            
                // Start with globe view sequence
                await MapController.startGlobeToSFSequence();
            
                // Show navigation panel after overview
                const navigationPanel = document.querySelector('.navigation-panel');
                if (navigationPanel) {
                    navigationPanel.classList.add('active');
                }
            
                // Initialize the NavigationController
                if (window.NavigationController) {
                    window.NavigationController.init();
                    
                    // Add event listener for Fisherman's Wharf navigation
                    document.addEventListener('locationChange', async (event) => {
                        if (event.detail.location === "Fisherman's Wharf") {
                            console.log("Navigating to Fisherman's Wharf");
                            try {
                                await fishermansWharfController.initialize();
                            } catch (error) {
                                console.error("Error initializing Fisherman's Wharf:", error);
                            }
                        }
                    });
                }
            } catch (error) {
                console.error('Error initializing overview:', error);
            }
        }, 500);
    });

    // Rest of your existing book cover animation handlers remain the same
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