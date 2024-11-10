// maps-config.js
console.log('Loading maps-config.js');

// Map configuration object
const mapConfig = {
    initialLocation: {
        lat: 37.7749,
        lng: -122.4194
    },
    zoom: 18,
    tilt: 45,
    heading: 320,
    mapId: CONFIG.GOOGLE_MAPS.MAP_ID,
    webgl: true,
    gestureHandling: 'greedy'
};

// Map initialization function
function initMap() {
    console.log('Initializing map...');
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

        window.BABY_APP.mapInstance = map;

        // Initialize MapController with map instance
        if (window.MapController) {
            console.log('Initializing MapController...');
            window.MapController.init(map);
        }

        // Initialize navigation after map is ready
        google.maps.event.addListenerOnce(map, 'idle', () => {
            console.log('Map is ready, initializing navigation...');
            if (window.NavigationController) {
                window.NavigationController.init();
            }
        });

    } catch (error) {
        console.error('Error creating map:', error);
    }
}

function loadGoogleMapsAPI() {
    console.log('Loading Google Maps API');
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${CONFIG.GOOGLE_MAPS.API_KEY}&v=beta&libraries=maps&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
        console.error('Failed to load Google Maps API');
        showError('Failed to load Google Maps. Please check your internet connection and try again.');
    };
    document.head.appendChild(script);
}

function showError(message) {
    console.error(message);
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

// Export functions
window.initMap = initMap;
window.loadGoogleMapsAPI = loadGoogleMapsAPI;