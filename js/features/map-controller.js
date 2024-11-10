// js/features/map-controller.js

const MapController = {
    // Current map instance
    map: null,

    // Initialize with Google Maps instance
    init: function(mapInstance) {
        console.log('Initializing MapController...');
        this.map = mapInstance;
    },

    // Smooth camera movement to location
    moveToLocation: function(location, duration = 2000) {
        console.log('MapController.moveToLocation called with:', location);
    
        if (!this.map) {
            console.error('Map not initialized in MapController');
            return;
        }

        if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
            console.error('Invalid location data:', location);
            return;
        }

        console.log('Starting camera movement to:', location);

        const startPos = this.map.getCenter();
        const startZoom = this.map.getZoom();
        const startTilt = this.map.getTilt();
        const startHeading = this.map.getHeading();

        // Create a smooth animation
        const steps = Math.floor(duration / 16); // 60fps
        let currentStep = 0;

        const animate = () => {
            currentStep++;
            const progress = currentStep / steps;
            
            // Ease-in-out function for smooth acceleration and deceleration
            const easeProgress = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            // Interpolate all camera values
            const currentLat = startPos.lat() + (location.lat - startPos.lat()) * easeProgress;
            const currentLng = startPos.lng() + (location.lng - startPos.lng()) * easeProgress;
            const currentZoom = startZoom + (location.zoom - startZoom) * easeProgress;
            const currentTilt = startTilt + (location.tilt - startTilt) * easeProgress;
            const currentHeading = startHeading + (location.heading - startHeading) * easeProgress;

            // Update camera position
            this.map.moveCamera({
                center: { lat: currentLat, lng: currentLng },
                zoom: currentZoom,
                tilt: currentTilt,
                heading: currentHeading
            });

            // Continue animation if not complete
            if (currentStep < steps) {
                requestAnimationFrame(animate);
            }
        };

        // Start animation
        requestAnimationFrame(animate);
    },

    // Method to smoothly transition between map styles
    setMapStyle: function(style) {
        if (!this.map) {
            console.error('Map not initialized');
            return;
        }
        this.map.setOptions({ styles: style });
    }
};

// Make MapController globally accessible
window.MapController = MapController;