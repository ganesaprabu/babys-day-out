// js/config/config.template.js
const CONFIG = {
    GOOGLE_MAPS: {
        API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY_HERE',
        MAP_ID: 'YOUR_MAP_ID_HERE'
    },
    LOCATIONS: {
        SAN_FRANCISCO: {
            lat: 37.7749,
            lng: -122.4194,
            name: 'San Francisco',
            zoom: 18,
            tilt: 45,
            heading: 320
        }
    },
    STORY: {
        CHAPTERS: [
            'Home Base',
            'Adventure Begins',
            'Shopping Mall'
        ]
    }
};

// Prevent modification of config
Object.freeze(CONFIG);