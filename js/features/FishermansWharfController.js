
class FishermansWharfController {
    constructor(map) {
        console.log("Initializing Fisherman's Wharf Controller");
        this.map = map;
        this.markers = [];
        this.seaLionArea = null;
        this.location = LOCATIONS.fishermansWharf;
    }

    async initialize() {
        console.log("Setting up Fisherman's Wharf experience");
        try {
            await this.setupLocation();
            await this.createSeaLionArea();
            await this.addMarkers();
            this.setupInteractions();
            
            if (window.NarrationSystem) {
                await window.NarrationSystem.show(
                    "Welcome to Fisherman's Wharf! 🦀 Watch the playful sea lions and explore Pier 39!",
                    "",
                    4000
                );
            }
        } catch (error) {
            console.error("Error initializing Fisherman's Wharf:", error);
            if (window.NarrationSystem) {
                window.NarrationSystem.show(
                    "Having trouble loading Fisherman's Wharf. Please try refreshing the page.",
                    "⚠️",
                    4000
                );
            }
        }
    }

    async setupLocation() {
        console.log("Setting up initial camera position");
        try {
            const { center, camera } = this.location;
            
            await new Promise(resolve => {
                this.map.flyCameraTo({
                    endCamera: {
                        center,
                        tilt: camera.tilt,
                        heading: camera.heading,
                        range: camera.range
                    },
                    durationMillis: 2000
                });
                
                this.map.addEventListener('gmp-animationend', resolve, { once: true });
            });
            
            console.log("Camera position set successfully");
        } catch (error) {
            console.error("Error setting up location:", error);
            throw error;
        }
    }

    

    async createSeaLionArea() {
        console.log("Creating sea lion viewing area");
        try {
            const { Polygon3DElement } = await google.maps.importLibrary("maps3d");
            
            // Create a basic polygon first
            const polygon = new Polygon3DElement();
            await customElements.whenDefined(polygon.localName);

            // Set properties individually
            polygon.altitudeMode = "RELATIVE_TO_GROUND";
            polygon.fillColor = "rgba(30, 144, 255, 0.4)";
            polygon.strokeColor = "#1E90FF";
            polygon.strokeWidth = 2;

            // Set coordinates last
            polygon.outerCoordinates = this.location.pier39.seaLionArea.coordinates.map(coord => ({
                ...coord,
                altitude: 5 
            }));

            this.map.append(polygon);
            this.seaLionArea = polygon;
            
            console.log("Sea lion area created successfully");
        } catch (error) {
            console.error("Error creating sea lion area:", error);
            throw error;
        }
    }

    async addMarkers() {
        console.log("Adding location markers");
        try {
            const { Marker3DElement } = await google.maps.importLibrary("maps3d");
            const { PinElement } = await google.maps.importLibrary("marker");

            for (const markerInfo of this.location.pier39.markers) {
                const pinElement = new PinElement({
                    background: "#4285F4",
                    borderColor: "#2C5EA9",
                    glyphColor: "white",
                    scale: 1.2
                });

                const marker = new Marker3DElement({
                    position: markerInfo.position,
                    title: markerInfo.title,
                    collisionBehavior: google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY
                });

                marker.append(pinElement);
                this.map.append(marker);
                this.markers.push(marker);

                console.log(`Added marker: ${markerInfo.title}`);
            }
        } catch (error) {
            console.error("Error adding markers:", error);
            throw error;
        }
    }

    setupInteractions() {
        console.log("Setting up interactive elements");
        this.markers.forEach(marker => {
            marker.addEventListener('click', (event) => {
                console.log(`Marker clicked: ${event.target.title}`);
                this.showLocationInfo(event.target);
            });
        });
    }

    showLocationInfo(marker) {
        const info = document.createElement('div');
        info.innerHTML = `
            <div style="padding: 10px;">
                <h3>${marker.title}</h3>
                <p>Click to learn more about this location!</p>
            </div>
        `;
        marker.append(info);
    }
}

window.FishermansWharfController = FishermansWharfController;