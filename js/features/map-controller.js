
const MapController = {
    map: null,
    initialized: false,

    init: async function(mapInstance) {
        console.log('MapController.init called', {
            hasExistingMap: !!this.map,
            isInitialized: this.initialized,
            receivedInstance: !!mapInstance
        });
        
        if (this.initialized) {
            console.log('MapController already initialized, skipping');
            return;
        }

        if (!mapInstance) {
            console.error('No map instance provided to MapController.init');
            return;
        }

        this.map = mapInstance;
        
        try {
            // Wait for map to be ready with timeout
            if (!this.map.isReady) {
                console.log('Waiting for map to be ready...');
                await Promise.race([
                    new Promise(resolve => {
                        this.map.addEventListener('gmp-ready', () => {
                            console.log('Map ready event received');
                            resolve();
                        });
                    }),
                    new Promise(resolve => {  // Changed from (_, reject) to (resolve)
                        // Set a timeout of 5 seconds
                        setTimeout(() => {
                            console.log('Map ready timeout - proceeding anyway');
                            resolve();  // Changed from standalone resolve() to resolve()
                        }, 5000);
                    })
                ]);
            }

            this.initialized = true;
            console.log('MapController initialization complete', {
                mapReady: this.map.isReady,
                mapCenter: this.map.center,
                initialized: this.initialized
            });
            
        } catch (error) {
            console.error('Error in MapController initialization:', error);
            this.initialized = false;
            this.map = null;
            throw error;
        }
    },

    moveToLocation: async function(location, duration = 2000) {
        console.log('moveToLocation called', {
            locationName: location.name || 'Unknown Location',
            location: location,
            initialized: this.initialized
        });
    
        if (!this.map || !this.initialized) {
            console.error('Map not properly initialized');
            return;
        }
    
        try {
            console.log('Starting camera movement');
    
            // Handle both location formats
            const center = location.center ? location.center : {
                lat: location.lat,
                lng: location.lng,
                altitude: location.altitude || 165
            };
    
            const tilt = location.camera?.tilt || location.tilt || 65;
            const heading = location.camera?.heading || location.heading || 25;
            const range = location.camera?.range || location.range || 2500;
    
            console.log('Camera movement parameters:', {
                center,
                tilt,
                heading,
                range
            });
    
            // Move camera to location
            this.map.flyCameraTo({
                endCamera: {
                    center,
                    tilt,
                    heading,
                    range
                },
                durationMillis: duration
            });
    
            // Add path along bridge if it's the Golden Gate Bridge
            if (location.name === 'Golden Gate Bridge') {
                const bridgeCoordinates = [
                    {lat: 37.80515638571346, lng: -122.4032569467164},
                    {lat: 37.80337073509504, lng: -122.4012878349353},
                    {lat: 37.79925208843463, lng: -122.3976697250461},
                    {lat: 37.7989102378512, lng: -122.3983408725656},
                    {lat: 37.79887832784348, lng: -122.3987094864192}
                ];
    
                const polyline = document.querySelector('gmp-polyline-3d');
                if (polyline) {
                    await customElements.whenDefined(polyline.localName);
                    polyline.coordinates = bridgeCoordinates;
                    console.log('Bridge polyline added to map');
                }
            }
    
            console.log('Camera movement started', {
                duration,
                target: `${center.lat},${center.lng}`
            });
    
            // Return a promise that resolves when movement completes
            return new Promise((resolve) => {
                this.map.addEventListener('gmp-animationend', () => {
                    console.log('Camera movement completed');
                    resolve();
                }, { once: true });
            });
    
        } catch (error) {
            console.error('Error moving to location:', error);
            throw error;
        }
    },

    
    enhancedBridgeView: async function(initialLocation) {
        if (!this.map || !this.initialized) {
            console.error('Map not properly initialized');
            return;
        }
    
        try {
            console.log('Starting enhanced bridge view sequence');
    
            // Step 1: Initial pause at the starting position
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second pause
    
            // Step 2: Move under the bridge
            console.log('Moving under the bridge');
            this.map.flyCameraTo({
                endCamera: {
                    center: { 
                        lat: 37.819852,
                        lng: -122.478549,
                        altitude: 50  // Lower altitude to go under the bridge
                    },
                    tilt: 85,  // Looking up at the bridge
                    heading: 180,  // Facing south
                    range: 500
                },
                durationMillis: 5000  // 5 seconds for this movement
            });
    
            // Wait for the first animation to complete
            await new Promise(resolve => {
                this.map.addEventListener('gmp-animationend', resolve, { once: true });
            });
    
            // Step 3: Move to the opposite side
            console.log('Moving to opposite side');
            this.map.flyCameraTo({
                endCamera: {
                    center: { 
                        lat: 37.817852,  // Slightly south of the bridge
                        lng: -122.478549,
                        altitude: 200
                    },
                    tilt: 60,
                    heading: 0,  // Facing north
                    range: 1000
                },
                durationMillis: 5000
            });
    
            // Wait for the second animation to complete
            await new Promise(resolve => {
                this.map.addEventListener('gmp-animationend', resolve, { once: true });
            });
    
            console.log('Enhanced bridge view sequence completed');
    
        } catch (error) {
            console.error('Error in enhanced bridge view:', error);
        }
    },

    startCityOverview: async function() {
        if (!this.map || !this.initialized) {
            console.error('Map not properly initialized');
            return;
        }
    
        try {
            console.log('Starting city overview sequence');
    
            // Initial high-altitude view of San Francisco
            this.map.flyCameraTo({
                endCamera: {
                    center: {
                        lat: 37.7749,
                        lng: -122.4194,
                        altitude: 3000  // High altitude for city overview
                    },
                    tilt: 45,
                    heading: 0,
                    range: 8000
                },
                durationMillis: 3000
            });
    
            // Wait for initial movement to complete
            await new Promise(resolve => {
                this.map.addEventListener('gmp-animationend', resolve, { once: true });
            });
    
            // Add markers for key locations
            await this.addLocationMarkers();
    
            // Add pulsing effect to markers
            this.startMarkerPulseAnimation();
    
        } catch (error) {
            console.error('Error in city overview:', error);
        }
    },
    
    addLocationMarkers: async function() {
        const { Marker3DElement } = await google.maps.importLibrary("maps3d");
        
        // Add markers for each key location
        Object.values(LOCATIONS).forEach(location => {
            if (!location.lat || !location.lng) return;
    
            const marker = new Marker3DElement({
                position: {
                    lat: location.lat,
                    lng: location.lng,
                    altitude: 100
                },
                collisionBehavior: google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY
            });
    
            // Create an SVG element for the marker
            const svgString = `
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                    <!-- Outer circle with pulse animation -->
                    <circle cx="20" cy="20" r="16" fill="#4285f4" opacity="0.2">
                        <animate attributeName="r" values="16;20;16" dur="2s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="0.2;0.1;0.2" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    
                    <!-- Inner circle (main marker) -->
                    <circle cx="20" cy="20" r="12" fill="#4285f4" stroke="white" stroke-width="2"/>
                    
                    <!-- Custom icon in the center -->
                    <text x="20" y="25" font-size="14" fill="white" text-anchor="middle" alignment-baseline="middle">
                        ${location.icon || '📍'}
                    </text>
                </svg>
            `;
    
            // Create a template and parse the SVG string
            const template = document.createElement('template');
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
            template.content.appendChild(svgDoc.documentElement);
    
            marker.append(template);
            this.map.append(marker);
        });
    },
    
    startMarkerPulseAnimation: function() {
        console.log('Initializing marker animations');
    
        // Find all markers
        const markers = document.querySelectorAll('.location-marker');
        
        // Add staggered delay to create a wave effect
        markers.forEach((marker, index) => {
            const pulseRing = marker.querySelector('.pulse-ring');
            if (pulseRing) {
                // Add slight delay for each marker
                pulseRing.style.animationDelay = `${index * 0.3}s`;
            }
        });
    },

    startGlobeToSFSequence: async function() {
        if (!this.map || !this.initialized) {
            console.error('Map not properly initialized');
            return;
        }
    
        console.log('Starting globe to SF sequence');
        
        // Create and add the message element
        const messageEl = document.createElement('div');
        messageEl.className = 'globe-message';
        messageEl.textContent = 'The greatest journeys start with a dream :)';
        document.body.appendChild(messageEl);
        
        try {
            // Step 1: Global view - Reduced initial movement duration
            await this.map.flyCameraTo({
                endCamera: {
                    center: { lat: 0, lng: 0, altitude: 15000000 },
                    tilt: 0,
                    heading: 0,
                    range: 15000000
                },
                durationMillis: 1000  // Reduced from 2000 to 1000
            });
    
            // Small pause before showing message
            await new Promise(resolve => setTimeout(resolve, 500));
    
            // Show message
            console.log('Showing motivational message');
            messageEl.classList.add('visible');
    
            // Keep globe view and message visible for 5 seconds
            await new Promise(resolve => setTimeout(resolve, 5000));
    
            // Start fading out message
            messageEl.classList.remove('visible');
    
            // Brief pause for message fade out
            await new Promise(resolve => setTimeout(resolve, 1000));
    
            // Step 2: Transition to San Francisco
            console.log('Transitioning to San Francisco');
            await this.map.flyCameraTo({
                endCamera: {
                    center: { lat: 37.7749, lng: -122.4194, altitude: 1000000 },
                    tilt: 45,
                    heading: 0,
                    range: 1000000
                },
                durationMillis: 3000
            });
    
            // Remove message element
            messageEl.remove();
    
            // Wait for the animation to complete
            await new Promise(resolve => {
                this.map.addEventListener('gmp-animationend', resolve, { once: true });
            });
    
            console.log('Globe to SF sequence completed');
    
            // Now start city overview sequence
            await this.startCityOverview();
    
        } catch (error) {
            console.error('Error in globe sequence:', error);
            messageEl.remove(); // Cleanup on error
        }
    },


    createFogEffect: async function() {
        if (!this.map || !this.initialized) {
            console.error('Map not properly initialized');
            return;
        }

        try {
            const { Polygon3DElement } = await google.maps.importLibrary("maps3d");

            const existingFog = document.querySelector('gmp-polygon-3d.fog-effect');
            if (existingFog) {
                existingFog.remove();
            }

            const fogCoordinates = [
                { lat: 37.8020, lng: -122.3976, altitude: 5 },
                { lat: 37.8021, lng: -122.3977, altitude: 5 },
                { lat: 37.8021, lng: -122.3975, altitude: 5 },
                { lat: 37.8019, lng: -122.3974, altitude: 5 },
                { lat: 37.8018, lng: -122.3976, altitude: 5 }
            ];

            const fogPolygon = new Polygon3DElement();
            fogPolygon.className = 'fog-effect';
            fogPolygon.altitudeMode = 'RELATIVE_TO_GROUND';
            fogPolygon.fillColor = 'rgba(255, 255, 255, 0.6)';
            fogPolygon.strokeColor = 'rgba(255, 255, 255, 0.2)';
            fogPolygon.strokeWidth = 2;

            await customElements.whenDefined(fogPolygon.localName);
            fogPolygon.outerCoordinates = fogCoordinates;

            const animateFog = () => {
                const opacity = 0.3 + Math.sin(Date.now() / 1000) * 0.3;
                fogPolygon.fillColor = `rgba(255, 255, 255, ${opacity})`;
                requestAnimationFrame(animateFog);
            };

            this.map.append(fogPolygon);
            animateFog();

            return fogPolygon;
        } catch (error) {
            console.error('Error creating fog effect:', error);
        }
    },

    /**
     * Exploratorium Sequence:
     * 1. Initial aerial view with fog effect and overview (altitude: 300)
     * 2. Exterior exploration with glass walls
     * 3. Entry sequence with welcome narration
     * 4. Cleanup previous effects
     * 5. Tactile Dome showcase with interactive features
     */
    async exploreExploratorium(initialLocation) {
        if (!this.map || !this.initialized) {
            console.error('Error: Map not properly initialized');
            return;
        }
    
        try {
            console.log('Starting Exploratorium exploration sequence');
    
            // Step 1: Initial aerial view with fog effect
            const fogEffect = await this.createFogEffect();
            await this.showExploratoriumOverview();
    
            // Step 2: Exterior exploration with glass walls
            await this.exploreExterior();
    
            // Step 3: Entry sequence
            await this.executeEntrySequence();
    
            // Step 4: After entry is complete, clean up previous effects
            this.cleanupEffects(); // New method to clean up
    
            // Step 5: Only then show Tactile Dome
            await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause
            await this.showcaseTactileDome();
    
        } catch (error) {
            console.error('Error in Exploratorium exploration:', error);
            this.cleanupEffects(); // Ensure cleanup on error
            throw error;
        }
    },

    cleanupEffects() {
        try {
            // Remove fog effect if exists
            const existingFog = document.querySelector('gmp-polygon-3d.fog-effect');
            if (existingFog) existingFog.remove();
        
            // Remove glass walls if exist
            const glassWalls = document.querySelectorAll('gmp-polygon-3d:not(.dome)');
            glassWalls.forEach(wall => wall.remove());
            
            // Remove any existing dome
            const existingDome = document.querySelector('.dome');
            if (existingDome) {
                console.log('Removing existing dome');
                existingDome.remove();
            }
            
            // Also cleanup any existing markers
            const markers = document.querySelectorAll('gmp-marker-3d');
            markers.forEach(marker => marker.remove());
            
            console.log('Cleaned up all effects: fog, walls, dome, and markers');
        } catch (error) {
            console.error('Error in cleanup:', error);
        }
    },

    // Add this method
    async showExploratoriumOverview() {
        console.log('Starting Exploratorium overview');
        try {
            return await this.map.flyCameraTo({
                endCamera: {
                    center: { 
                        lat: 37.8025,
                        lng: -122.3980,
                        altitude: 300
                    },
                    tilt: 60,
                    heading: 120,
                    range: 800
                },
                durationMillis: 1500
            }); 
        } catch (error) {
            console.error('Error in Exploratorium overview:', error);
        }
    },

    async createWelcomeMarker() {
        try {
            console.log('Creating welcome marker for Exploratorium');
            const { Marker3DElement } = await google.maps.importLibrary("maps3d");
            const { PinElement } = await google.maps.importLibrary("marker");
    
            // Create welcome marker
            const welcomeMarker = new Marker3DElement({
                position: { 
                    lat: 37.8019, 
                    lng: -122.3975
                },
                title: "Welcome to Exploratorium!"
            });
    
            // Create custom pin with welcome animation
            const customPin = new PinElement({
                background: "#4285f4",
                scale: 1.4,
                borderColor: "#fff",
                glyphColor: "#fff",
                glyph: "👋"
            });
    
            welcomeMarker.append(customPin);
            this.map.append(welcomeMarker);
            console.log('Welcome marker created and added to map');
    
            // Remove marker after 3 seconds
            setTimeout(() => {
                console.log('Removing welcome marker');
                if (welcomeMarker.parentElement) {
                    welcomeMarker.remove();
                }
            }, 3000);
    
            return welcomeMarker;
        } catch (error) {
            console.error('Error creating welcome marker:', error);
            throw error;
        }
    },


    

    async exploreExterior() {
        console.log('Starting exterior exploration sequence with extreme aerial view');
        
        try {
            // Initialize glass wall effect
            await this.createGlassWallEffect();

            

            console.log('Camera positioned at extreme aerial view', {
                range: 15000,
                tilt: 35,
                altitude: 1000
            });

            
            return true;
        } catch (error) {
            console.error('Error in exterior exploration:', error);
            return false;
        }
    },

    async createGlassWallEffect() {
        console.log('Creating extra large glass wall effect for aerial view');
        try {
            const { Polygon3DElement } = await google.maps.importLibrary("maps3d");
            
            const glassWall = new Polygon3DElement({
                altitudeMode: "RELATIVE_TO_GROUND",
                fillColor: "rgba(255, 255, 255, 0.6)",  // Increased opacity for visibility
                strokeColor: "#4285f4",                 // Changed to Google blue for better visibility
                strokeWidth: 8,                         // Much thicker stroke
                extruded: true
            });

            await customElements.whenDefined(glassWall.localName);
            
            // Extra large glass structure for aerial visibility
            const basePoint = {
                lat: 37.8019,
                lng: -122.3975
            };
            
            const offset = 0.001;  // Much larger offset for visibility from high altitude
            const coordinates = [
                { lat: basePoint.lat - offset, lng: basePoint.lng - offset, altitude: 200 },
                { lat: basePoint.lat + offset, lng: basePoint.lng - offset, altitude: 200 },
                { lat: basePoint.lat + offset, lng: basePoint.lng + offset, altitude: 200 },
                { lat: basePoint.lat - offset, lng: basePoint.lng + offset, altitude: 200 },
                { lat: basePoint.lat - offset, lng: basePoint.lng - offset, altitude: 200 }
            ];

            console.log('Setting extra large glass wall coordinates with offset:', offset);
            glassWall.outerCoordinates = coordinates;

            console.log('Adding extra large glass wall to map');
            this.map.append(glassWall);
            return glassWall;
            
        } catch (error) {
            console.error('Error creating glass wall effect:', error);
            return null;
        }
    },

    async highlightWaterfront() {
        console.log('Highlighting waterfront view');
        try {
            const { Polyline3DElement } = await google.maps.importLibrary("maps3d");
            
            // Create waterfront highlight line using correct property name 'coordinates'
            const waterline = new Polyline3DElement({
                altitudeMode: "RELATIVE_TO_GROUND",
                strokeColor: '#4285f4',
                strokeWidth: 3
            });
    
            // Set coordinates after element is defined
            await customElements.whenDefined(waterline.localName);
            waterline.coordinates = [
                { lat: 37.8017, lng: -122.3972, altitude: 5 },
                { lat: 37.8021, lng: -122.3976, altitude: 5 }
            ];
    
            console.log('Adding waterline to map');
            this.map.append(waterline);
            
            // Add animated effect
            const animate = () => {
                const opacity = 0.3 + Math.sin(Date.now() / 1000) * 0.5;
                waterline.strokeOpacity = opacity;
                requestAnimationFrame(animate);
            };
            animate();
    
            return waterline;
        } catch (error) {
            console.error('Error creating waterfront highlight:', error);
            return null;
        }
    },

    async executeEntrySequence() {
        console.log('Starting simplified entry sequence');
        
        try {
            // Wait for camera movement to complete
            await new Promise(resolve => {
                this.map.addEventListener('gmp-animationend', resolve, { once: true });
            });
    
            // Longer pause before narration
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show narration only here, removed from exploreExterior
            if (window.NarrationSystem) {
                console.log('Showing welcome narration');
                await window.NarrationSystem.show(
                    `🏛️ Exploratorium: Welcome to a world of wonder and discovery!`,
                    "", // No need for separate icon since it's in the message
                    3000
                );
            }

            // Wait for narration to complete
            await new Promise(resolve => setTimeout(resolve, 2000));
    
        } catch (error) {
            console.error('Error in entry sequence:', error);
            await this.fallbackEntrySequence();
        }
    },

    async fallbackEntrySequence() {
        console.log('Executing fallback entry sequence');
        try {
            await this.map.flyCameraTo({
                endCamera: {
                    center: { 
                        lat: 37.8019,
                        lng: -122.3974,
                        altitude: 10
                    },
                    tilt: 60,
                    heading: 90,
                    range: 30
                },
                durationMillis: 3000
            });
        } catch (error) {
            console.error('Error in fallback entry sequence:', error);
        }
    },

    async showcaseTactileDome() {
        console.log('Starting Tactile Dome showcase');
        if (!this.map || !this.initialized) {
            console.error('Map not properly initialized');
            return;
        }

        try {
            // Clean up any existing elements first
            this.cleanupEffects();
            
            // 1. Create the dome visualization
            const { Polygon3DElement } = await google.maps.importLibrary("maps3d");
            
            // Create dome with distinct class
            const dome = new Polygon3DElement({
                altitudeMode: "RELATIVE_TO_GROUND",
                fillColor: "rgba(65, 105, 225, 0.6)",
                strokeColor: "#FFFFFF",
                strokeWidth: 2,
                extruded: true,
                className: 'dome' // Add class for identification
            });

            // Define dome coordinates
            const domeRadius = 0.00015; // Adjust size as needed
            const domeCenter = { lat: 37.8019, lng: -122.3974 };
            const domePoints = [];
            
            // Create circular dome shape
            for (let i = 0; i <= 32; i++) {
                const angle = (i / 32) * Math.PI * 2;
                domePoints.push({
                    lat: domeCenter.lat + domeRadius * Math.cos(angle),
                    lng: domeCenter.lng + domeRadius * Math.sin(angle),
                    altitude: 20 // Height of the dome
                });
            }

            await customElements.whenDefined(dome.localName);
            dome.outerCoordinates = domePoints;
            this.map.append(dome);

            // 2. Initial camera movement to showcase the dome
            await this.map.flyCameraTo({
                endCamera: {
                    center: { 
                        lat: 37.8019,
                        lng: -122.3974,
                        altitude: 30
                    },
                    tilt: 60,
                    heading: 85,
                    range: 100
                },
                durationMillis: 2000
            });

            // Wait for initial movement to complete and pause
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Starting cinematic rotation around Tactile Dome');
            
            // 3. Execute cinematic rotation
            try {
                await this.map.flyCameraAround({
                    camera: {
                        center: {
                            lat: 37.8019,
                            lng: -122.3974,
                            altitude: 25
                        },
                        tilt: 60,
                        range: 80
                    },
                    durationMillis: 8000,
                    rounds: 1
                });

                // Wait for rotation to complete
                await new Promise(resolve => {
                    this.map.addEventListener('gmp-animationend', resolve, { once: true });
                });

                console.log('Completed cinematic rotation sequence');

                // Return to front view
                await this.map.flyCameraTo({
                    endCamera: {
                        center: { 
                            lat: 37.8019,
                            lng: -122.3974,
                            altitude: 30
                        },
                        tilt: 60,
                        heading: 85,
                        range: 100
                    },
                    durationMillis: 2000
                });

            } catch (error) {
                console.error('Error during cinematic rotation:', error);
            }

            // 4. Add pulsing effect to the dome
            const animateDome = () => {
                const opacity = 0.4 + Math.sin(Date.now() / 1000) * 0.2;
                dome.fillColor = `rgba(65, 105, 225, ${opacity})`;
                requestAnimationFrame(animateDome);
            };
            animateDome();

            // 5. Show narration
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (window.NarrationSystem) {
                await window.NarrationSystem.show(
                    `🎯 The Tactile Dome: Navigate through the dark maze using only your sense of touch!`,
                    "", // No need for separate icon since it's in the message
                    4000
                );
            }

            // 6. Add interactivity
            dome.addEventListener('mouseover', () => {
                dome.fillColor = "rgba(65, 105, 225, 0.8)";
            });

            dome.addEventListener('mouseout', () => {
                dome.fillColor = "rgba(65, 105, 225, 0.6)";
            });

            dome.addEventListener('click', () => {
                if (window.NavigationController) {
                    const domeInfo = LOCATIONS.EXPLORATORIUM.viewpoints.find(v => v.name === 'Tactile Dome');
                    if (domeInfo) {
                        window.NavigationController.showDestinationInfo({
                            marketingContent: domeInfo.marketingContent
                        });
                    }
                }
            });

            return dome;

        } catch (error) {
            console.error('Error in Tactile Dome showcase:', error);
            throw error;
        }
    }

};

window.MapController = MapController;