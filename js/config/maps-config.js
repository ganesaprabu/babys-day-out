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
    
    try {
        const { Map3DElement } = await google.maps.importLibrary("maps3d");
        
        const map = new Map3DElement({
            center: { 
                lat: 37.819852, 
                lng: -122.478549,
                altitude: 0
            },
            tilt: 67.5,
            heading: 80,
            range: 1000
        });

        // Add the map to the container
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            throw new Error('Map container not found');
        }

        mapContainer.innerHTML = ''; 
        mapContainer.appendChild(map);

        // Initialize MapController with the map instance
        await MapController.init(map);

        // Store map instance globally
        window.BABY_APP.mapInstance = map;

        return map;
    } catch (error) {
        console.error('Error initializing 3D map:', error);
        throw error;
    }
}

function loadGoogleMapsAPI() {
    console.log('Loading Google Maps API with 3D support');
    
    return new Promise((resolve, reject) => {
        try {
            (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
                key: CONFIG.GOOGLE_MAPS.API_KEY,
                v: "alpha"
            });
            
            // Wait for the API to load
            const checkGoogleMaps = setInterval(() => {
                if (window.google && window.google.maps) {
                    clearInterval(checkGoogleMaps);
                    resolve();
                }
            }, 100);

            // Add timeout
            setTimeout(() => {
                clearInterval(checkGoogleMaps);
                reject(new Error('Google Maps API load timeout'));
            }, 10000);
        } catch (error) {
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