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

    exploreExploratorium: async function(initialLocation) {
        if (!this.map || !this.initialized) {
            console.error('Map not properly initialized');
            return;
        }
    
        try {
            console.log('Starting enhanced Exploratorium exploration sequence');
    
            // Create fog effect and marker immediately
            const fogEffect = this.createFogEffect();
            const welcomeMarker = this.createWelcomeMarker();
    
            // 1. Quick Initial Aerial View
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
                durationMillis: 1500  // Reduced from 3000 to 1500
            });
    
            await new Promise(resolve => {
                this.map.addEventListener('gmp-animationend', resolve, { once: true });
            });
    
            // 2. Faster Close-up View
            await this.map.flyCameraTo({
                endCamera: {
                    center: { 
                        lat: 37.8019,
                        lng: -122.3975,
                        altitude: 50
                    },
                    tilt: 70,
                    heading: 90,
                    range: 200
                },
                durationMillis: 2000  // Reduced from 4000 to 2000
            });
    
            await new Promise(resolve => {
                this.map.addEventListener('gmp-animationend', resolve, { once: true });
            });
    
            // Shorter pause
            await new Promise(resolve => setTimeout(resolve, 1000)); // Reduced from 3000 to 1000
    
            // 3. Quick Final Position
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
                durationMillis: 1500  // Reduced from 3000 to 1500
            });
    
            console.log('Enhanced Exploratorium sequence completed');
    
        } catch (error) {
            console.error('Error in enhanced Exploratorium exploration:', error);
        }
    },

    async createWelcomeMarker() {
        try {
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

            // Create custom pin
            const customPin = new PinElement({
                background: "#4285f4",
                scale: 1.4,
                borderColor: "#fff",
                glyphColor: "#fff",
                glyph: "👋"
            });

            welcomeMarker.append(customPin);
            this.map.append(welcomeMarker);

            return welcomeMarker;
        } catch (error) {
            console.error('Error creating welcome marker:', error);
        }
    },
};

window.MapController = MapController;