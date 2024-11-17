// js/features/map-controller.js
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
            coordinates: `${location.lat},${location.lng}`,
            initialized: this.initialized
        });
    
        if (!this.map || !this.initialized) {
            console.error('Map not properly initialized');
            return;
        }

        try {
            console.log('Starting camera movement');

            // Coordinates to outline the Golden Gate Bridge
            const bridgeCoordinates = [
                {lat: 37.80515638571346, lng: -122.4032569467164},
                {lat: 37.80337073509504, lng: -122.4012878349353},
                {lat: 37.79925208843463, lng: -122.3976697250461},
                {lat: 37.7989102378512, lng: -122.3983408725656},
                {lat: 37.79887832784348, lng: -122.3987094864192}
            ];

            // Move camera to location
            this.map.flyCameraTo({
                endCamera: {
                    center: { 
                        lat: location.lat, 
                        lng: location.lng,
                        altitude: location.altitude || 165
                    },
                    tilt: location.tilt || 65,
                    heading: location.heading || 25,
                    range: location.range || 2500
                },
                durationMillis: duration
            });

            console.log('Camera movement started', {
                duration,
                target: `${location.lat},${location.lng}`
            });

            // Add path along bridge
            const polyline = document.querySelector('gmp-polyline-3d');
            if (polyline) {
                await customElements.whenDefined(polyline.localName);
                polyline.coordinates = bridgeCoordinates;
                console.log('Polyline added to map');
            }

            // Listen for movement completion
            this.map.addEventListener('gmp-animationend', () => {
                console.log('Camera movement completed');
            }, { once: true });

        } catch (error) {
            console.error('Error moving to location:', error);
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
        
        // Step 1: Global view
        await this.map.flyCameraTo({
            endCamera: {
                center: { lat: 0, lng: 0, altitude: 15000000 },
                tilt: 0,
                heading: 0,
                range: 15000000
            },
            durationMillis: 2000
        });
    
        // Pause for user experience
        await new Promise(resolve => setTimeout(resolve, 2000));
    
        // Step 2: Transition to San Francisco
        await this.map.flyCameraTo({
            endCamera: {
                center: { lat: 37.7749, lng: -122.4194, altitude: 1000000 },
                tilt: 45,
                heading: 0,
                range: 1000000
            },
            durationMillis: 3000
        });
    
        // Wait for the animation to complete
        await new Promise(resolve => {
            this.map.addEventListener('gmp-animationend', resolve, { once: true });
        });
    
        console.log('Globe to SF sequence completed');
    
        // Now start city overview sequence
        await this.startCityOverview();
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

    async exploreExploratorium(initialLocation) {
        if (!this.map || !this.initialized) {
            console.error('Error: Map not properly initialized for Exploratorium exploration');
            return;
        }
    
        try {
            console.log('Starting Exploratorium exploration sequence');
    
            // Create fog effect
            const fogEffect = this.createFogEffect();
    
            // 1. Initial approach view
            console.log('Moving to initial Exploratorium overview position');
            await this.map.flyCameraTo({
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
    
            await new Promise(resolve => {
                this.map.addEventListener('gmp-animationend', resolve, { once: true });
                console.log('Completed initial aerial view');
            });
    
            // Explore exterior - removing initial narration from here
            console.log('Starting exterior exploration sequence');
            await this.exploreExterior();
    
            // Execute entry sequence
            console.log('Initiating entry sequence');
            try {
                await this.executeEntrySequence();
            } catch (error) {
                console.error('Error during entry sequence:', error);
            }
    
            // Wait a moment before final positioning
            await new Promise(resolve => setTimeout(resolve, 1000));
    
            // Final position
            console.log('Moving to final viewing position');
            await this.map.flyCameraTo({
                endCamera: {
                    center: { 
                        lat: 37.8017,
                        lng: -122.3973,
                        altitude: 100
                    },
                    tilt: 60,
                    heading: 75,
                    range: 400
                },
                durationMillis: 3000
            });
    
            console.log('Completed Exploratorium exploration sequence');
    
        } catch (error) {
            console.error('Error in Exploratorium exploration:', error);
            throw error;
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
        console.log('Starting exterior exploration sequence');
        
        try {
            // Initialize glass wall effect
            await this.createGlassWallEffect();
    
            // Smooth approach to entrance
            await this.map.flyCameraTo({
                endCamera: {
                    center: { 
                        lat: 37.8019,
                        lng: -122.3975,
                        altitude: 80
                    },
                    tilt: 75,
                    heading: 85,
                    range: 150
                },
                durationMillis: 3000
            });
    
            // Add waterfront highlight
            await this.highlightWaterfront();
    
            return true;
        } catch (error) {
            console.error('Error in exterior exploration:', error);
            return false;
        }
    },
    
    async createGlassWallEffect() {
        console.log('Creating glass wall effect');
        try {
            const { Polygon3DElement } = await google.maps.importLibrary("maps3d");
            
            // Create glass wall polygon with correct properties
            const glassWall = new Polygon3DElement({
                // Change from 'relative-to-ground' to 'RELATIVE_TO_GROUND'
                altitudeMode: "RELATIVE_TO_GROUND",
                fillColor: "rgba(255, 255, 255, 0.2)",
                strokeColor: "#FFFFFF",
                strokeWidth: 1,
                extruded: true
            });
    
            // Set coordinates using outerCoordinates property
            await customElements.whenDefined(glassWall.localName);
            glassWall.outerCoordinates = [
                { lat: 37.8018, lng: -122.3974, altitude: 30 },
                { lat: 37.8019, lng: -122.3975, altitude: 30 },
                { lat: 37.8020, lng: -122.3974, altitude: 30 },
                { lat: 37.8019, lng: -122.3973, altitude: 30 },
                { lat: 37.8018, lng: -122.3974, altitude: 30 }  // Close the polygon
            ];
    
            console.log('Adding glass wall to map');
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
            // Step 1: Move to entrance position
            console.log('Moving to entrance position');
            await this.map.flyCameraTo({
                endCamera: {
                    center: { 
                        lat: 37.8019,
                        lng: -122.3975,
                        altitude: 20
                    },
                    tilt: 65,
                    heading: 85,
                    range: 50
                },
                durationMillis: 2000
            });
    
            await new Promise(resolve => setTimeout(resolve, 500));
    
            // Step 2: Smooth transition inside
            console.log('Transitioning inside');
            await this.map.flyCameraTo({
                endCamera: {
                    center: { 
                        lat: 37.8019,
                        lng: -122.3974,
                        altitude: 15
                    },
                    tilt: 60,
                    heading: 90,
                    range: 40
                },
                durationMillis: 2500
            });
    
            // Wait for camera movement to complete
            await new Promise(resolve => {
                this.map.addEventListener('gmp-animationend', resolve, { once: true });
            });
    
            // Show narration only here, removed from exploreExterior
            if (window.NarrationSystem) {
                console.log('Showing welcome narration');
                await window.NarrationSystem.show(
                   // "Welcome to the Exploratorium! Get ready to discover amazing exhibits and interactive experiences! 🔬✨",
                   "Welcome to the Exploratorium!!!",
                    "🏛️",
                    1000
                );
            }
    
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
    }

};

window.MapController = MapController;