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
        { name: "Fisherman's Wharf", icon: '🦀' },
        { name: 'Chinatown', icon: '🏮' },
        { name: 'Golden Gate Park', icon: '🌳' }
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
        console.log('Creating intro bubble');
        const bubble = document.createElement('div');
        bubble.className = 'intro-bubble';
        bubble.innerHTML = `
            <span class="mappy-icon">🗺️✨</span>
            <p class="mappy-message">
                <span style="font-size: 1.2em; display: block; margin-bottom: 10px; color: #4285f4;">
                    Hello, Adventurers! 
                </span>
                Today's a super special day! 🎉 I'm Mappy, and I'm about to start the most amazing 
                journey from my cozy home in San Francisco! We'll see the mighty Golden Gate Bridge 🌉, 
                explore fun places, and make new friends along the way!
                <br><br>
                Are you ready to join my adventure? 🌟
            </p>
            <span class="mappy-signature">~ Mappy 🗺️</span>
        `;
        document.body.appendChild(bubble);
        
        // Add sound effect (optional - uncomment if you want to use it)
        // const popSound = new Audio('assets/sounds/pop.mp3');
        // popSound.play();
        
        setTimeout(() => bubble.classList.add('active'), 100);
        
        // Add wiggle animation on hover
        bubble.addEventListener('mouseover', () => {
            bubble.style.transform = 'translateX(-50%) scale(1.02)';
        });
        
        bubble.addEventListener('mouseout', () => {
            bubble.style.transform = 'translateX(-50%) scale(1)';
        });
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
    },


    showDestinationInfo: function(destination) {
        // Remove any existing info panel
        const existingPanel = document.querySelector('.destination-info-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
    
        const infoPanel = document.createElement('div');
        infoPanel.className = 'destination-info-panel';
        infoPanel.innerHTML = `
            <div class="info-header">
                <h3>${destination.marketingContent.title}</h3>
                <span class="close-btn">×</span>
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
        
        // Add event listener for close button
        const closeBtn = infoPanel.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            infoPanel.classList.add('closing');
            setTimeout(() => infoPanel.remove(), 300);
        });
    
        // Add animation class after a brief delay
        setTimeout(() => infoPanel.classList.add('active'), 10);
    },
};

// Initialize when DOM is loaded
/*document.addEventListener('DOMContentLoaded', () => {
    NavigationController.init();
});*/

window.NavigationController = NavigationController;