// js/features/map-controller.js

const MapController = {
    map: null,

    init: async function(mapInstance) {
        console.log('Initializing MapController with map instance:', mapInstance);
        
        if (!mapInstance) {
            console.error('No map instance provided to MapController.init');
            return;
        }

        this.map = mapInstance;

        // Wait for map to be ready
        if (!this.map.isReady) {
            await new Promise(resolve => {
                this.map.addEventListener('gmp-ready', () => {
                    console.log('Map is ready');
                    resolve();
                });
            });
        }

        console.log('MapController initialization complete');
    },

    moveToLocation: async function(location, duration = 2000) {
        console.log('Moving to location in 3D:', location);
    
        if (!this.map) {
            console.error('Map not initialized');
            return;
        }

        try {
            // Ensure map is ready before moving
            if (!this.map.isReady) {
                await new Promise(resolve => {
                    this.map.addEventListener('gmp-ready', resolve);
                });
            }

            // Coordinates to outline the Golden Gate Bridge
            const bridgeCoordinates = [
                {lat: 37.80515638571346, lng: -122.4032569467164},
                {lat: 37.80337073509504, lng: -122.4012878349353},
                {lat: 37.79925208843463, lng: -122.3976697250461},
                {lat: 37.7989102378512, lng: -122.3983408725656},
                {lat: 37.79887832784348, lng: -122.3987094864192}
            ];

            // Add path along bridge
            const polyline = document.querySelector('gmp-polyline-3d');
            if (polyline) {
                await customElements.whenDefined(polyline.localName);
                polyline.coordinates = bridgeCoordinates;
            }

            // Move camera to location
            this.map.flyCameraTo({
                endCamera: {
                    center: { 
                        lat: location.lat, 
                        lng: location.lng,
                        altitude: location.altitude || 165 // Use provided altitude or default
                    },
                    tilt: location.tilt || 65,
                    heading: location.heading || 25,
                    range: location.range || 2500
                },
                durationMillis: duration
            });

            console.log('Camera movement initiated');

        } catch (error) {
            console.error('Error moving to location:', error);
        }
    },

    setMapStyle: function(style) {
        if (!this.map) {
            console.error('Map not initialized');
            return;
        }
        this.map.setOptions({ styles: style });
    }
};

// Update the navigation controller to properly initialize the map
window.MapController = MapController;