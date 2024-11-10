// js/features/navigation-controller.js
const NavigationController = {
    destinations: [
        { 
            name: 'Golden Gate Bridge',
            icon: '🌉',
            location: LOCATIONS.GOLDEN_GATE_BRIDGE,
            marketingContent: LOCATIONS.GOLDEN_GATE_BRIDGE.marketingContent
        },
        { name: 'Exploratorium', icon: '🔬' },
        { name: "Fisherman's Wharf", icon: '🦀' },
        { name: 'Chinatown', icon: '🏮' },
        { name: 'Golden Gate Park', icon: '🌳' }
    ],

    // js/features/navigation-controller.js

    init: function() {
        console.log('NavigationController init called');
        
        // Only proceed if welcome screen is hidden
        const welcomeScreen = document.getElementById('welcomeScreen');
        
        if (!welcomeScreen) {
            console.error('Welcome screen element not found');
            return;
        }
    
        if (!welcomeScreen.classList.contains('hidden')) {
            console.log('Still on welcome screen, skipping navigation init');
            return;
        }
    
        console.log('Conditions met, proceeding with navigation init');
        
        // Clear any existing elements first
        this.clearExistingElements();
        
        // Show intro bubble
        this.showIntroBubble();
        
        // Set timeout for navigation panel
        setTimeout(() => {
            this.hideIntroBubble();
            this.showNavigationPanel();
        }, 5000);
    },

    clearExistingElements: function() {
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
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (!welcomeScreen.classList.contains('hidden')) return;
        
        console.log('Creating navigation panel');
        const panel = document.createElement('div');
        panel.className = 'navigation-panel';
        panel.innerHTML = this.createPanelContent();
        document.body.appendChild(panel);
        setTimeout(() => panel.classList.add('active'), 100);
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

    attachEventListeners: function() {
        console.log('Attaching navigation event listeners');
        const items = document.querySelectorAll('.destination-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const destinationName = item.dataset.destination;
                console.log(`Clicked destination: ${destinationName}`);
                
                // Find the destination in our destinations array
                const destination = this.destinations.find(d => d.name === destinationName);
                
                if (destination && destination.location) {
                    console.log('Found destination data:', destination);
                    
                    // Highlight selected item
                    items.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
    
                    // Ensure MapController exists and is initialized
                    if (!window.MapController || !window.MapController.moveToLocation) {
                        console.error('MapController not properly initialized');
                        return;
                    }
    
                    // Move to the location
                    console.log('Moving to location:', destination.location);
                    window.MapController.moveToLocation({
                        lat: destination.location.lat,
                        lng: destination.location.lng,
                        zoom: destination.location.zoom,
                        tilt: destination.location.tilt,
                        heading: destination.location.heading,
                        name: destination.location.name
                    });
    
                    // Show destination info
                    this.showDestinationInfo(destination);
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