



// js/config/locations.js

const LOCATIONS = {
    // Existing locations remain the same
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

    GOLDEN_GATE_BRIDGE: {
        lat: 37.819852,
        lng: -122.478549,
        altitude: 0,
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
    },

    // Adding new Exploratorium location
    EXPLORATORIUM: {
        lat: 37.8017,
        lng: -122.3973,
        altitude: 0,
        name: 'Exploratorium',
        zoom: 18,
        tilt: 60,
        heading: 75,
        description: 'A world-renowned science museum at Pier 15',
        marketingTag: 'Discover the wonders of science and perception!',
        type: 'museum',
        category: 'attractions',
        marketingContent: {
            title: 'Exploratorium',
            subtitle: 'Where Science, Art, and Human Perception Meet',
            description: 'Explore a magical world of interactive exhibits, hands-on experiments, and mind-bending experiences at San Francisco\'s famous waterfront science museum.',
            features: [
                'Interactive Science Exhibits',
                'Stunning Bay Views',
                'Famous Fog Bridge',
                'Tactile Dome Experience',
                'Educational Demonstrations'
            ],
            callToAction: 'Start Exploring',
            promoMessage: 'Special exhibits now open!'
        },
        viewpoints: [
            {
                name: 'Museum Front',
                lat: 37.8017,
                lng: -122.3973,
                zoom: 18,
                tilt: 60,
                heading: 75,
                altitude: 100
            },
            {
                name: 'Bay View',
                lat: 37.8020,
                lng: -122.3978,
                zoom: 17,
                tilt: 45,
                heading: 120,
                altitude: 200
            },
            {
                name: 'Fog Bridge View',
                lat: 37.8019,
                lng: -122.3975,
                zoom: 19,
                tilt: 70,
                heading: 90,
                altitude: 50
            }
        ]
    }
};

// Update location categories
const LOCATION_CATEGORIES = {
    LANDMARKS: ['GOLDEN_GATE_BRIDGE'],
    MUSEUMS: ['EXPLORATORIUM'],
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