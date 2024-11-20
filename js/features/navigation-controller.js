// js/features/navigation-controller.js
const NavigationController = {
    getControllerIfAvailable: function(controllerName) {
        return window[controllerName] || null;
    },
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
    wondersList: [
        {
            name: "Taj Mahal",
            location: LOCATIONS.SEVEN_WONDERS.wonders.find(w => w.name === "Taj Mahal").location,
            controller: null,  // Will be set dynamically when needed
            controllerName: 'TajMahalController'
        },
        {
            name: "Christ the Redeemer",
            location: {
                lat: -22.951916,
                lng: -43.210487,
                altitude: 0,
                camera: {
                    tilt: 60,
                    heading: 45,
                    range: 1000
                }
            },
            controller: null,  // Will be set dynamically when needed
            controllerName: 'ChristRedeemerController'
        },
        {
            name: "Colosseum",
            location: {
                lat: 41.890210,
                lng: 12.492231,
                altitude: 0,
                camera: {
                    tilt: 60,
                    heading: 0,
                    range: 800
                }
            },
            controller: null,  // Will be set dynamically when needed
            controllerName: 'ColosseumController'
        },
        {
            name: "Great Wall of China",
            location: {
                lat: 40.4319,
                lng: 116.5704,
                altitude: 100,
                camera: {
                    tilt: 65,
                    heading: 30,
                    range: 1000
                }
            }
        },
        {
            name: "Petra",
            location: {
                lat: 30.328611,
                lng: 35.441944,
                altitude: 0,
                camera: {
                    tilt: 60,
                    heading: 45,
                    range: 800
                }
            }
        },
        {
            name: "Machu Picchu",
            location: {
                lat: -13.163141,
                lng: -72.544963,
                altitude: 0,
                camera: {
                    tilt: 65,
                    heading: 30,
                    range: 1000
                }
            }
        },
    ],
    currentWonderIndex: 0,

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


                    // Create and show Seven Wonders intro bubble
                    const bubble = document.createElement('div');
                    bubble.className = 'intro-bubble';
                    bubble.innerHTML = `
                        <div style="text-align: center; margin-bottom: 15px;">
                            <img src="assets/images/mappy_7_wonders.png" alt="Mappy on World Tour" 
                                style="width: 360px; height: auto; border-radius: 10px;">
                        </div>
                        <p class="mappy-message">
                            <span style="font-size: 1.2em; display: block; margin-bottom: 10px; color: #4285f4;">
                                Time for a Global Adventure! ✨
                            </span>
                            Mappy's magical drone is ready for discovering the wonders of the world! 
                            Let's embark on an incredible journey to explore these magnificent monuments together! 🌎
                        </p>
                        <span class="mappy-signature">~ Mappy and my World-Traveling Drone 🗺️ 🚁</span>
                    `;
                    
                    document.body.appendChild(bubble);
                    setTimeout(() => bubble.classList.add('active'), 100);

                    // Show bubble for 5 seconds then proceed with the journey
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    
                    // Remove bubble with fade out effect
                    bubble.classList.remove('active');
                    setTimeout(() => bubble.remove(), 500);
                    
                    const navPanel = document.createElement('div');
                    navPanel.className = 'seven-wonders-nav';
                    navPanel.innerHTML = `
                        <button class="wonder-nav-btn prev-wonder" aria-label="Previous wonder">
                            <span>◀</span>
                        </button>
                        <div class="wonder-name">Taj Mahal</div>
                        <button class="wonder-nav-btn next-wonder" aria-label="Next wonder">
                            <span>▶</span>
                        </button>
                    `;
                    document.body.appendChild(navPanel);

                    // Show with animation
                    setTimeout(() => navPanel.classList.add('visible'), 100);

                    // Set up navigation handlers
                    navPanel.querySelector('.prev-wonder').addEventListener('click', () => this.navigatePreviousWonder());
                    navPanel.querySelector('.next-wonder').addEventListener('click', () => this.navigateNextWonder());

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

                    // Reset current wonder index
                    this.currentWonderIndex = 0;

                    // Start with first wonder
                    await this.navigateToWonder(0);
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
            cleanupSevenWonders(); // Add this line
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

    cleanupSevenWonders: function() {
        DEBUG.log('Cleaning up Seven Wonders navigation');
        const navPanel = document.querySelector('.seven-wonders-nav');
        if (navPanel) {
            navPanel.classList.remove('visible');
            setTimeout(() => navPanel.remove(), 300);
        }
    },

    navigatePreviousWonder() {
        DEBUG.log('Navigating to previous wonder');
        this.currentWonderIndex = (this.currentWonderIndex - 1 + this.wondersList.length) % this.wondersList.length;
        this.navigateToWonder(this.currentWonderIndex);
    },

    navigateNextWonder() {
        DEBUG.log('Navigating to next wonder');
        this.currentWonderIndex = (this.currentWonderIndex + 1) % this.wondersList.length;
        this.navigateToWonder(this.currentWonderIndex);
    },

    async navigateToWonder(index) {
        DEBUG.log(`Navigating to wonder: ${this.wondersList[index]?.name || 'Unknown'}`);
        
        if (index < 0 || index >= this.wondersList.length) {
            console.error(`Invalid wonder index: ${index}`);
            return;
        }
        
        const wonder = this.wondersList[index];
        const navPanel = document.querySelector('.seven-wonders-nav');
        
        if (navPanel) {
            const wonderNameElement = navPanel.querySelector('.wonder-name');
            wonderNameElement.textContent = wonder.name;
        }
    
        try {
            // Show transition narration
            if (window.NarrationSystem) {
                await window.NarrationSystem.show(
                    `✈️ Flying to ${wonder.name}...`,
                    "",
                    2000
                );
            }
    
            // Move camera to the wonder's location
            await MapController.moveToLocation({
                center: wonder.location,
                camera: wonder.location.camera
            });
    
            // Initialize controller if available
            if (wonder.controllerName) {
                const ControllerClass = this.getControllerIfAvailable(wonder.controllerName);
                if (ControllerClass) {
                    const controller = new ControllerClass(window.BABY_APP.mapInstance);
                    await controller.initialize();
                } else {
                    console.warn(`Controller ${wonder.controllerName} not found`);
                }
            }
    
            // Update marketing content
            this.showDestinationInfo({
                marketingContent: {
                    title: wonder.name,
                    subtitle: "Seven Wonders of the World",
                    description: this.getWonderDescription(wonder.name),
                    features: [
                        "Photorealistic 3D views",
                        "Interactive exploration",
                        "Historical insights",
                        "Guided tour experience"
                    ],
                    promoMessage: "Special guided tours available!",
                    callToAction: "Explore More"
                }
            });
    
        } catch (error) {
            console.error(`Error navigating to ${wonder.name}:`, error);
            if (window.NarrationSystem) {
                window.NarrationSystem.show(
                    "Oops! Had some trouble getting there. Let's try again! 🔄",
                    "",
                    3000
                );
            }
        }
    },    

    getWonderDescription(wonderName) {
        const descriptions = {
            "Taj Mahal": "Marvel at the breathtaking ivory-white marble mausoleum, a testament to eternal love and architectural brilliance in Agra, India.",
            "Great Wall of China": "Explore this magnificent feat of ancient engineering stretching thousands of miles across China's northern borders.",
            "Christ the Redeemer": "Witness the iconic Art Deco statue of Jesus Christ overlooking Rio de Janeiro from atop Corcovado mountain.",
            "Petra": "Discover the ancient rose-red city carved into rock faces, featuring stunning architecture and advanced water conduit systems.",
            "Machu Picchu": "Journey to this incredible Incan citadel set high in the Andes Mountains, surrounded by breathtaking mountain vistas.",
            "Colosseum": "Step into history at Rome's mighty amphitheater, an engineering marvel that has stood for nearly two millennia.",
        };
        return descriptions[wonderName] || `Experience the magnificence of ${wonderName}, one of the world's most incredible monuments.`;
    }, 
    
    cleanupSevenWonders: function() {
        DEBUG.log('Cleaning up Seven Wonders navigation');
        
        // Clean up navigation panel
        const navPanel = document.querySelector('.seven-wonders-nav');
        if (navPanel) {
            navPanel.classList.remove('visible');
            setTimeout(() => navPanel.remove(), 300);
        }
    
        // Clean up intro bubble if it exists
        const introBubble = document.querySelector('.intro-bubble');
        if (introBubble) {
            introBubble.classList.remove('active');
            setTimeout(() => introBubble.remove(), 300);
        }
    
        // Reset index
        this.currentWonderIndex = 0;
        
        // Show the regular navigation panel again
        const navigationPanel = document.querySelector('.navigation-panel');
        if (navigationPanel) {
            navigationPanel.classList.add('active');
        }
    }
};

window.NavigationController = NavigationController;