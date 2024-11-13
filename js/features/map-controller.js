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
    }
};

window.MapController = MapController;