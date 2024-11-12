// js/features/map-controller.js

const MapController = {
    map: null,

    init: function(mapInstance) {
        console.log('Initializing MapController...');
        this.map = mapInstance;
    },

    moveToLocation: function(location, duration = 2000) {
        console.log('Moving to location in 3D:', location);
    
        if (!this.map) {
            console.error('Map not initialized');
            return;
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
            customElements.whenDefined(polyline.localName).then(() => {
                polyline.coordinates = bridgeCoordinates;
            });
        }

        this.map.flyCameraTo({
            endCamera: {
                center: { 
                    lat: location.lat, 
                    lng: location.lng,
                    altitude: 165 // Added altitude for better view
                },
                tilt: 65,
                heading: 25,
                range: 2500
            },
            durationMillis: duration
        });
    },

    setMapStyle: function(style) {
        if (!this.map) {
            console.error('Map not initialized');
            return;
        }
        this.map.setOptions({ styles: style });
    }
};

window.MapController = MapController;