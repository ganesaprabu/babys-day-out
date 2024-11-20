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
async function initMap() {
    console.log('Initializing 3D map...');
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        throw new Error('Map container not found');
    }

    // Reset container
    mapContainer.innerHTML = '';

    const { Map3DElement } = await google.maps.importLibrary("maps3d");
    const map = new Map3DElement({
        center: { 
            lat: 0, 
            lng: 0,
            altitude: 15000000  // High altitude for global view
        },
        tilt: 0,
        heading: 0,
        range: 15000000
    });

    mapContainer.appendChild(map);
    window.BABY_APP.mapInstance = map;
    return map;
}



function loadGoogleMapsAPI() {
    console.log('Loading Google Maps API with 3D support');
    
    return new Promise((resolve, reject) => {
        try {
            (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
                key: CONFIG.GOOGLE_MAPS.API_KEY,
                v: "alpha",
                libraries: ["maps3d", "marker", "places"],
                region: "US"
            });
            
            const checkGoogleMaps = setInterval(() => {
                if (window.google && window.google.maps) {
                    clearInterval(checkGoogleMaps);
                    console.log('Google Maps API loaded successfully');
                    resolve();
                }
            }, 100);

            // Add timeout for API load
            setTimeout(() => {
                clearInterval(checkGoogleMaps);
                reject(new Error('Google Maps API load timeout'));
            }, 10000);
            
        } catch (error) {
            console.error('Error loading Google Maps API:', error);
            reject(error);
        }
    });
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