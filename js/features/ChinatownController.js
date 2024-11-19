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
        console.log("Setting up initial camera position for Chinatown overview");
        try {
            // Modified camera position for better boundary visibility
            await new Promise(resolve => {
                this.map.flyCameraTo({
                    endCamera: {
                        center: {
                            lat: 37.7941,
                            lng: -122.4078,
                            altitude: 0
                        },
                        tilt: 45,          // Reduced tilt for better overhead view
                        heading: 45,
                        range: 800         // Increased range to see more area
                    },
                    durationMillis: 2000
                });
                
                this.map.addEventListener('gmp-animationend', resolve, { once: true });
            });
            
            console.log("Camera position set for boundary visibility");
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
                altitudeMode: "RELATIVE_TO_GROUND",
                fillColor: "rgba(255, 0, 0, 0)",
                strokeColor: "#FF0000",
                strokeWidth: 4  // Increased stroke width for better visibility
            });
    
            await customElements.whenDefined(this.boundaries.localName);
            
            const baseCoordinates = this.location.boundaries.map(coord => ({
                ...coord,
                altitude: 0
            }));
            
            this.boundaries.outerCoordinates = baseCoordinates;
            this.map.append(this.boundaries);

            console.log("Pausing before animation");
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log("Starting boundary animation");
            let opacity = 0;
            const steps = 60;
            const interval = 33; // ~30fps
            
            for (let i = 0; i <= steps; i++) {
                await new Promise(resolve => setTimeout(resolve, interval));
                opacity += (0.15 / steps);  // Increased max opacity to 0.15
                
                this.boundaries.fillColor = `rgba(255, 0, 0, ${opacity})`;
                
                const altitudeProgress = i / steps;
                const currentCoords = baseCoordinates.map(coord => ({
                    ...coord,
                    altitude: 50 * altitudeProgress  // Increased max altitude to 50
                }));
                this.boundaries.outerCoordinates = currentCoords;
                
                if (i % 10 === 0) {
                    console.log(`Boundary animation progress: ${Math.round((i/steps) * 100)}%`);
                }
            }

            console.log("Boundary animation completed");

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