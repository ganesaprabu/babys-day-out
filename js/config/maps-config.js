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


// In js/config/maps-config.js

// js/config/maps-config.js

// js/config/maps-config.js - Update the hideLoadingScreen function

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const appContainer = document.getElementById('appContainer');
    const welcomeScreen = document.getElementById('welcomeScreen');
    
    if (loadingScreen && welcomeScreen.classList.contains('hidden')) {
        console.log('Hiding loading screen');
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            appContainer.classList.remove('hidden');
            
            // Initialize navigation only after map is fully loaded and screens are transitioned
            console.log('Initializing NavigationController');
            if (window.NavigationController && window.NavigationController.init) {
                window.NavigationController.init();
            }
        }, 500);
    }
}

// ... rest of the code remains the same ...

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