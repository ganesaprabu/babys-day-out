const CONFIG = {
    GOOGLE_MAPS: {
        API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY_HERE',
        MAP_ID: 'YOUR_MAP_ID_HERE'
    },
    STORY: {
        CHAPTERS: [
            'Home Base',
            'Adventure Begins',
            'Shopping Mall'
        ]
    },
    ANIMATION: {
        CAMERA_MOVEMENT_DURATION: 2000,
        TRANSITION_DELAY: 500
    },
    UI: {
        PANEL_TRANSITION_DURATION: 300
    }
};

// Prevent modification of config
Object.freeze(CONFIG);