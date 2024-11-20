// js/features/navigation-controller.js
const NavigationController = {
    destinations: [
        { 
            name: 'Golden Gate Bridge',
            icon: '🌉',
            location: LOCATIONS.GOLDEN_GATE_BRIDGE,
            marketingContent: LOCATIONS.GOLDEN_GATE_BRIDGE.marketingContent
        },
        {
            name: 'Exploratorium',
            icon: '🔬',
            location: LOCATIONS.EXPLORATORIUM,
            marketingContent: LOCATIONS.EXPLORATORIUM.marketingContent
        },
        { 
            name: "Fisherman's Wharf", 
            icon: '🦀',
            location: LOCATIONS.fishermansWharf,
            marketingContent: {
                title: "Fisherman's Wharf",
                subtitle: "San Francisco's Famous Waterfront Destination",
                description: "Experience the vibrant atmosphere of Fisherman's Wharf, where you can watch playful sea lions, explore unique shops, and enjoy fresh seafood!",
                features: [
                    "Famous Sea Lion Viewing Area",
                    "Vibrant Shopping at Pier 39",
                    "Interactive Sea Life Experiences",
                    "Waterfront Dining Options"
                ],
                callToAction: "Start Exploring",
                promoMessage: "Special seasonal events happening now!"
            }
        },
        { 
            name: 'Chinatown', 
            icon: '🏮',
            location: LOCATIONS.CHINATOWN,
            marketingContent: LOCATIONS.CHINATOWN.marketingContent
        }
    ],

    // js/features/navigation-controller.js

    init: function() {
        console.log('NavigationController init called');
        
        // Remove the welcome screen check since we're on the second page
        this.clearExistingElements();
        this.showNavigationPanel();
        
        // Schedule intro bubble after a short delay
        setTimeout(() => {
            this.showIntroBubble();
        }, 1000);

        // Schedule hiding intro bubble and ensuring nav panel
        setTimeout(() => {
            this.hideIntroBubble();
            // Make sure navigation panel is visible
            const navPanel = document.querySelector('.navigation-panel');
            if (navPanel && !navPanel.classList.contains('active')) {
                navPanel.classList.add('active');
            }
        }, 6000);
    },

    clearExistingElements: function() {
        DEBUG.log('Clearing existing elements');
        // Remove any existing intro bubbles
        const existingBubbles = document.querySelectorAll('.intro-bubble');
        existingBubbles.forEach(bubble => bubble.remove());

        // Remove any existing navigation panels
        const existingPanels = document.querySelectorAll('.navigation-panel');
        existingPanels.forEach(panel => panel.remove());
    },

    showIntroBubble: function() {
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (!welcomeScreen.classList.contains('hidden')) return;
        
        console.log('Creating intro bubble with magical drone story');
        const bubble = document.createElement('div');
        bubble.className = 'intro-bubble';
        bubble.innerHTML = `
            <div style="text-align: center; margin-bottom: 15px;">
                <img src="assets/images/mappy_on_magical_drone.png" alt="Mappy on Magical Drone" 
                    style="width: 360px; height: auto; border-radius: 10px;">
            </div>
            <p class="mappy-message">
                <span style="font-size: 1.2em; display: block; margin-bottom: 10px; color: #4285f4;">
                    Hello, Adventurers! ✨
                </span>
                Today's a super special day! 🎉 I've got my magical drone ready to take us on an 
                amazing journey through San Francisco! We'll soar past the Golden Gate Bridge 🌉, 
                glide through exciting places, and make wonderful discoveries together!
            </p>
            <span class="mappy-signature">~ Mappy and my Magical Drone 🗺️ 🚁</span>
        `;
        
        document.body.appendChild(bubble);
        setTimeout(() => bubble.classList.add('active'), 100);
    },

    hideIntroBubble: function() {
        const bubble = document.querySelector('.intro-bubble');
        if (bubble) {
            bubble.classList.remove('active');
            setTimeout(() => bubble.remove(), 500);
        }
    },

    showNavigationPanel: function() {
        DEBUG.log('Showing navigation panel');
        console.log('Creating navigation panel');
        
        // Remove any existing panel first
        const existingPanel = document.querySelector('.navigation-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        const panel = document.createElement('div');
        panel.className = 'navigation-panel';
        panel.innerHTML = this.createPanelContent();
        document.body.appendChild(panel);
        
        // Force a reflow
        panel.offsetHeight;
        
        // Add active class after a brief delay
        setTimeout(() => {
            panel.classList.add('active');
        }, 100);
        
        this.attachEventListeners();
    },

    createPanelContent: function() {
        return `
            <div class="panel-header">
                <h2 class="panel-title">Mappy's San Francisco Tour</h2>
            </div>
            <ul class="destination-list">
                ${this.destinations.map(dest => `
                    <li class="destination-item" data-destination="${dest.name}">
                        <span class="destination-icon">${dest.icon}</span>
                        <span class="destination-name">${dest.name}</span>
                    </li>
                `).join('')}
            </ul>
            <div class="action-buttons">
                <button id="sevenWondersBtn" class="special-action-btn">
                    SEVEN WONDERS TOUR
                </button>
            </div>
        `;
    },

    // Update the attachEventListeners method in NavigationController

    attachEventListeners: function() {
        console.log('Attaching navigation event listeners');
        const items = document.querySelectorAll('.destination-item');
        
        items.forEach(item => {
            item.addEventListener('click', async () => {
                const destinationName = item.dataset.destination;
                console.log(`Clicked destination: ${destinationName}`);
    
                // First, remove any existing info panels
                this.removeExistingInfoPanels();
                
                const destination = this.destinations.find(d => d.name === destinationName);
    
                if (destination && destination.location) {
                    try {
                        items.forEach(i => i.classList.remove('active'));
                        item.classList.add('active');
                
                        // If map not initialized, initialize it
                        if (!window.BABY_APP.mapInstance) {
                            await loadGoogleMapsAPI();
                            await initMap();
                        }
                
                        // Ensure MapController is initialized
                        if (!MapController.map) {
                            await MapController.init(window.BABY_APP.mapInstance);
                        }
                        
                        // Regular move to location first
                        await MapController.moveToLocation(destination.location);
                        
                        // Special sequences for specific locations
                        if (destination.name === 'Golden Gate Bridge') {
                            await MapController.enhancedBridgeView(destination.location);
                        } else if (destination.name === 'Exploratorium') {
                            await MapController.exploreExploratorium(destination.location);
                        } else if (destinationName === 'Chinatown') {
                            const chinatownController = new ChinatownController(window.BABY_APP.mapInstance);
                            await chinatownController.initialize();
                        } else if (destinationName === "Fisherman's Wharf") {
                            const fishermansWharfController = new FishermansWharfController(window.BABY_APP.mapInstance);
                            await fishermansWharfController.initialize();
                        }
                        
                        this.showDestinationInfo(destination);
                
                    } catch (error) {
                        console.error('Error handling destination click:', error);
                        alert('Sorry, we encountered an error loading the map. Please try again.');
                    }
                } else {
                    console.warn('No location data found for:', destinationName);
                }
            });
        });
    
        // Add Seven Wonders button listener
        console.log('Setting up Seven Wonders button listener');
        const sevenWondersBtn = document.getElementById('sevenWondersBtn');
        if (sevenWondersBtn) {
            sevenWondersBtn.addEventListener('click', async () => {
                console.log('Seven Wonders button clicked - Starting journey');
                try {
                    // First, remove any existing info panels
                    this.removeExistingInfoPanels();
                    const navigationPanel = document.querySelector('.navigation-panel');
                    if (navigationPanel) {
                        navigationPanel.classList.remove('active'); // This will hide the right panel
                    }
                    // Remove active state from other destinations
                    items.forEach(i => i.classList.remove('active'));
    
                    if (window.NarrationSystem) {
                        await window.NarrationSystem.show(
                            "Get ready for an incredible journey to the Seven Wonders of the World! 🌎✨",
                            "",
                            4000
                        );
                    }
                    
                    // Ensure map is initialized
                    if (!window.BABY_APP.mapInstance) {
                        await loadGoogleMapsAPI();
                        await initMap();
                    }
            
                    if (!MapController.map) {
                        await MapController.init(window.BABY_APP.mapInstance);
                    }
                    
                    // Move to Seven Wonders initial location
                    console.log('Moving to Seven Wonders initial location');
                    await MapController.moveToLocation(LOCATIONS.SEVEN_WONDERS);
                    
                    // Show destination info
                    console.log('Showing Seven Wonders destination info');
                    this.showDestinationInfo({
                        marketingContent: LOCATIONS.SEVEN_WONDERS.marketingContent
                    });
                    
                } catch (error) {
                    console.error('Error starting Seven Wonders journey:', error);
                    alert('Sorry, we encountered an error starting the Seven Wonders journey. Please try again.');
                }
            });
        } else {
            console.warn('Seven Wonders button not found in DOM');
        }
    },

    removeExistingInfoPanels: function() {
        console.log('Removing existing destination info panels');
        const existingPanels = document.querySelectorAll('.destination-info-panel');
        existingPanels.forEach(panel => {
            panel.classList.add('closing');
            setTimeout(() => {
                if (panel && panel.parentNode) {
                    panel.remove();
                }
            }, 300); // Match the closing animation duration
        });
    },

    showDestinationInfo: function(destination) {
        // Previous code remains the same until the event handlers...
    
        // Remove any existing panels first
        this.removeExistingInfoPanels();

        const infoPanel = document.createElement('div');
        infoPanel.className = 'destination-info-panel';
        
        // Update HTML structure with initial downward arrow
        infoPanel.innerHTML = `
        <div class="info-header">
            <h3>${destination.marketingContent.title}</h3>
            <div class="header-buttons">
                <button class="toggle-minimize" aria-label="Toggle panel">▼</button>
                <button class="close-btn" aria-label="Close panel">×</button>
            </div>
        </div>
            <div class="info-content">
                <p class="subtitle">${destination.marketingContent.subtitle}</p>
                <p class="description">${destination.marketingContent.description}</p>
                <div class="features">
                    ${destination.marketingContent.features.map(feature => 
                        `<div class="feature-item">✓ ${feature}</div>`
                    ).join('')}
                </div>
                <div class="promo-message">${destination.marketingContent.promoMessage}</div>
                <button class="cta-button">${destination.marketingContent.callToAction}</button>
            </div>
        `;
        
        document.body.appendChild(infoPanel);
        
        // Update event listeners
        const closeBtn = infoPanel.querySelector('.close-btn');
        const toggleBtn = infoPanel.querySelector('.toggle-minimize');
        const header = infoPanel.querySelector('.info-header');
    
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            infoPanel.classList.add('closing');
            setTimeout(() => infoPanel.remove(), 300);
        });

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            infoPanel.classList.toggle('minimized');
            toggleBtn.innerHTML = infoPanel.classList.contains('minimized') ? '▲' : '▼';
        });
    
        header.addEventListener('click', () => {
            if (infoPanel.classList.contains('minimized')) {
                infoPanel.classList.remove('minimized');
                toggleBtn.innerHTML = '▼';
            }
        });
    
        // Animation and auto-minimize
        setTimeout(() => infoPanel.classList.add('active'), 10);
    
        // Auto-minimize all destination info panels after 3 seconds
        setTimeout(() => {
            if (infoPanel && document.body.contains(infoPanel)) {
                console.log(`Auto-minimizing ${destination.name} info panel`);
                infoPanel.classList.add('minimized');
                toggleBtn.innerHTML = '▲';
            }
        }, 2000); // Reduced from 5000ms to 3000ms
    },
};

window.NavigationController = NavigationController;