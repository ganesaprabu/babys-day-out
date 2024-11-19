// js/features/ChinatownController.js

class ChinatownController {
    constructor(map) {
        console.log("Initializing Chinatown Controller");
        this.map = map;
        this.markers = [];
        this.boundaries = null;
        this.location = LOCATIONS.CHINATOWN;
    }

    async initialize() {
        console.log("Setting up Chinatown experience");
        try {
            await this.setupLocation();
            await this.createBoundaries();
            await this.addLandmarks();
            this.setupInteractions();
            
            if (window.NarrationSystem) {
                await window.NarrationSystem.show(
                    "Welcome to Chinatown! 🏮 Discover authentic culture, traditional shops, and delicious cuisine!",
                    "",
                    4000
                );
            }
        } catch (error) {
            console.error("Error initializing Chinatown:", error);
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
        } catch (error) {
            console.error("Error setting up location:", error);
            throw error;
        }
    }

    async createBoundaries() {
        console.log("Creating Chinatown boundary visualization");
        try {
            const { Polygon3DElement } = await google.maps.importLibrary("maps3d");
            
            this.boundaries = new Polygon3DElement({
                altitudeMode: "RELATIVE_TO_GROUND", // Changed to uppercase
                fillColor: "rgba(255, 0, 0, 0.1)",
                strokeColor: "#FF0000",
                strokeWidth: 2
            });
    
            await customElements.whenDefined(this.boundaries.localName);
            this.boundaries.outerCoordinates = this.location.boundaries.map(coord => ({
                ...coord,
                altitude: 10
            }));
            
            this.map.append(this.boundaries);
        } catch (error) {
            console.error("Error creating boundaries:", error);
        }
    }

    async addLandmarks() {
        console.log("Adding landmark markers");
        try {
            const { PinElement } = await google.maps.importLibrary("marker");
            const { Marker3DElement } = await google.maps.importLibrary("maps3d");

            for (const landmark of this.location.landmarks) {
                const pinElement = new PinElement({
                    background: "#FF4141",
                    borderColor: "#8B0000",
                    glyphColor: "white",
                    scale: 1.2,
                    glyph: this.getLandmarkGlyph(landmark.type)
                });

                const marker = new Marker3DElement({
                    position: landmark.position,
                    title: landmark.name,
                    collisionBehavior: google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY
                });

                marker.append(pinElement);
                this.map.append(marker);
                this.markers.push({ marker, content: landmark.marketingContent });

                console.log(`Added marker for ${landmark.name}`);
            }
        } catch (error) {
            console.error("Error adding landmarks:", error);
        }
    }

    getLandmarkGlyph(type) {
        const glyphs = {
            gate: '🏮',
            attraction: '🥠',
            shopping: '🛍️'
        };
        return glyphs[type] || '📍';
    }

    setupInteractions() {
        console.log("Setting up interactive elements");
        this.markers.forEach(({ marker, content }) => {
            marker.addEventListener('click', () => {
                console.log(`Marker clicked: ${marker.title}`);
                if (window.NavigationController) {
                    window.NavigationController.showDestinationInfo({
                        marketingContent: content
                    });
                }
            });
        });
    }

    cleanup() {
        console.log("Cleaning up Chinatown controller");
        this.markers.forEach(({ marker }) => marker.remove());
        if (this.boundaries) {
            this.boundaries.remove();
        }
    }
}

// Export for use in other modules
window.ChinatownController = ChinatownController;