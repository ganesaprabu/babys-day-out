// js/config/locations.js

const LOCATIONS = {
    // Base locations
    SAN_FRANCISCO: {
        lat: 37.7749,
        lng: -122.4194,
        name: 'San Francisco',
        zoom: 18,
        tilt: 45,
        heading: 320,
        description: 'Welcome to San Francisco, where our adventure begins!',
        marketingTag: 'Start your journey from the heart of innovation'
    },

    // Landmarks
    GOLDEN_GATE_BRIDGE: {
        lat: 37.819852,
        lng: -122.478549,
        name: 'Golden Gate Bridge',
        zoom: 17,
        tilt: 67.5,
        heading: 80,
        description: 'An iconic suspension bridge spanning the Golden Gate strait',
        marketingTag: 'Experience the majestic Golden Gate Bridge in stunning 3D!',
        type: 'landmark',
        category: 'attractions',
        marketingContent: {
            title: 'Golden Gate Bridge',
            subtitle: 'San Francisco\'s Most Iconic Landmark',
            description: 'Experience the engineering marvel that has become the symbol of San Francisco.',
            features: [
                'Stunning 3D views of the bridge',
                'Interactive viewpoints',
                'Historical information'
            ],
            callToAction: 'Take a virtual tour',
            promoMessage: 'Special tours available!'
        },
        viewpoints: [
            {
                name: 'Bridge Front View',
                lat: 37.819852,
                lng: -122.478549,
                zoom: 17,
                tilt: 67.5,
                heading: 80
            },
            {
                name: 'Aerial View',
                lat: 37.819852,
                lng: -122.478549,
                zoom: 16,
                tilt: 45,
                heading: 120
            }
        ]
    }
};

// Additional location categories can be grouped
const LOCATION_CATEGORIES = {
    LANDMARKS: ['GOLDEN_GATE_BRIDGE'],
    SHOPPING: [],
    PARKS: [],
    ENTERTAINMENT: []
};

// Prevent modifications
Object.freeze(LOCATIONS);
Object.freeze(LOCATION_CATEGORIES);

// Export for use in other files
window.LOCATIONS = LOCATIONS;
window.LOCATION_CATEGORIES = LOCATION_CATEGORIES;