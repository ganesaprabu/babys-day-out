

class ChristRedeemerController {
    constructor(map) {
        console.log("Initializing Christ the Redeemer Controller");
        this.map = map;
        this.markers = [];
        this.boundaries = null;
        this.location = {
            center: {
                lat: -22.951916,
                lng: -43.210487,
                altitude: 700  
            },
            camera: {
                tilt: 45,     
                heading: 45,
                range: 1200   
            }
        };
    }

    async initialize() {
        console.log("Setting up Christ the Redeemer experience");
        try {
            await this.setupLocation();
            await this.createViewpoints();
            await this.addInteractiveElements();
            
            if (window.NarrationSystem) {
                await window.NarrationSystem.show(
                    "Welcome to Christ the Redeemer! 🗿 One of the most iconic monuments in the world, standing atop Corcovado Mountain.",
                    "",
                    4000
                );
            }

            // Start the cinematic view sequence
            await this.executeCinematicSequence();
        } catch (error) {
            console.error("Error initializing Christ the Redeemer experience:", error);
        }
    }

    async setupLocation() {
        console.log("Setting up initial camera position");
        try {
            await new Promise(resolve => {
                this.map.flyCameraTo({
                    endCamera: {
                        center: this.location.center,
                        tilt: this.location.camera.tilt,
                        heading: this.location.camera.heading,
                        range: this.location.camera.range
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

    async createViewpoints() {
        console.log("Creating viewpoint markers");
        try {
            const { Marker3DElement } = await google.maps.importLibrary("maps3d");
            const { PinElement } = await google.maps.importLibrary("marker");

            const viewpoints = [
                {
                    position: {
                        lat: -22.951916,
                        lng: -43.210787,
                        altitude: 0
                    },
                    title: "Front View"
                },
                {
                    position: {
                        lat: -22.952116,
                        lng: -43.210187,
                        altitude: 0
                    },
                    title: "Side View"
                }
            ];

            for (const point of viewpoints) {
                const pinElement = new PinElement({
                    background: "#4285F4",
                    borderColor: "#2C5EA9",
                    glyphColor: "white",
                    scale: 1.2,
                    glyph: "📸"
                });

                const marker = new Marker3DElement({
                    position: point.position,
                    title: point.title,
                    collisionBehavior: google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY
                });

                marker.append(pinElement);
                this.map.append(marker);
                this.markers.push(marker);
            }
        } catch (error) {
            console.error("Error creating viewpoints:", error);
        }
    }

    async executeCinematicSequence() {
        console.log("Starting cinematic sequence");
        try {
            // Front view - closer and centered
            await this.map.flyCameraTo({
                endCamera: {
                    center: {
                        lat: -22.951916,
                        lng: -43.210487,
                        altitude: 700
                    },
                    tilt: 35,
                    heading: 0,
                    range: 400  
                },
                durationMillis: 3000
            });
    
            await new Promise(resolve => setTimeout(resolve, 2000));
    
            // Closer circular view
            await this.map.flyCameraAround({
                camera: {
                    center: {
                        lat: -22.951916,
                        lng: -43.210487,
                        altitude: 700
                    },
                    tilt: 45,
                    range: 300  
                },
                durationMillis: 8000,
                rounds: 1
            });
    
        } catch (error) {
            console.error("Error in cinematic sequence:", error);
        }
    }

    async addInteractiveElements() {
        console.log("Adding interactive elements");
        this.markers.forEach(marker => {
            marker.addEventListener('click', () => {
                console.log(`Marker clicked: ${marker.title}`);
                this.moveToViewpoint(marker);
            });
        });
    }

    async moveToViewpoint(marker) {
        console.log(`Moving to viewpoint: ${marker.title}`);
        try {
            await this.map.flyCameraTo({
                endCamera: {
                    center: {
                        ...marker.position,
                        altitude: 700  // Maintain consistent altitude
                    },
                    tilt: 35,
                    heading: marker.title === "Front View" ? 0 : 90,
                    range: 500
                },
                durationMillis: 2000
            });
        } catch (error) {
            console.error("Error moving to viewpoint:", error);
        }
    }

    cleanup() {
        console.log("Cleaning up Christ the Redeemer controller");
        this.markers.forEach(marker => marker.remove());
        if (this.boundaries) {
            this.boundaries.remove();
        }
    }
}

// Export for use in other modules
window.ChristRedeemerController = ChristRedeemerController;