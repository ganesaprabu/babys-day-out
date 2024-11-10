// maps-config.js
console.log('Loading maps-config.js');

const mapConfig = {
    initialLocation: {
        lat: CONFIG.LOCATIONS.SAN_FRANCISCO.lat,
        lng: CONFIG.LOCATIONS.SAN_FRANCISCO.lng
    },
    zoom: CONFIG.LOCATIONS.SAN_FRANCISCO.zoom,
    tilt: CONFIG.LOCATIONS.SAN_FRANCISCO.tilt,
    heading: CONFIG.LOCATIONS.SAN_FRANCISCO.heading,
    mapId: CONFIG.GOOGLE_MAPS.MAP_ID,
    webgl: true,
    gestureHandling: 'greedy'
};

function initMap() {
    console.log('initMap called');
    const mapElement = document.getElementById('map');
    
    try {
        const map = new google.maps.Map(mapElement, {
            center: mapConfig.initialLocation,
            zoom: mapConfig.zoom,
            tilt: mapConfig.tilt,
            heading: mapConfig.heading,
            mapId: mapConfig.mapId,
            mapTypeId: 'roadmap',
            gestureHandling: 'greedy',
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: true,
            fullscreenControl: true
        });

        // Hide loading screen immediately after map instance is created
        hideLoadingScreen();

        // Add a single event listener for map idle state
        map.addListener('idle', () => {
            console.log('Map is fully loaded and idle');
            // Any additional initialization can go here
        });

        window.BABY_APP.mapInstance = map;

    } catch (error) {
        console.error('Error creating map:', error);
        showError('Failed to initialize map: ' + error.message);
    }
}


function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const appContainer = document.getElementById('appContainer');
    
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            
            // Show the story panel after map loads
            setTimeout(() => {
                window.StoryPanel.show();
            }, 500);
        }, 500);
    }
    
    if (appContainer) {
        appContainer.classList.remove('hidden');
    }
}

function showError(message) {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <h1>Error</h1>
                <p>${message}</p>
                <button onclick="location.reload()" style="padding: 10px; margin-top: 10px;">Retry</button>
            </div>`;
    }
}

// Load Google Maps API
document.addEventListener('DOMContentLoaded', () => {
    console.log('Loading Google Maps API');
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${CONFIG.GOOGLE_MAPS.API_KEY}&v=beta&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
});

window.initMap = initMap;