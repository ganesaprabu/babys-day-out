

class ColosseumController {
    constructor(map) {
        console.log("Initializing Colosseum Controller");
        this.map = map;
        this.markers = [];
        this.path = null;
        this.location = {
            center: {
                lat: 41.890210,
                lng: 12.492231,
                altitude: 100
            },
            camera: {
                tilt: 60,
                heading: 0,
                range: 400
            }
        };
        this.pathCoordinates = [
            { lat: 41.890210, lng: 12.492231 }, // Colosseum
            { lat: 41.892151, lng: 12.485333 }, // Roman Forum
            { lat: 41.889157, lng: 12.487482 }, // Palatine Hill
            { lat: 41.889817, lng: 12.490725 }  // Arch of Constantine
        ];
        this.currentView = 'modern';
    }

    async initialize() {
        console.log("Setting up Colosseum experience");
        try {
            // Initial view setup
            await this.setupLocation();
            await this.createViewpoints();
            await this.createAnimatedPath();
            
            // Show welcome narration
            if (window.NarrationSystem) {
                await window.NarrationSystem.show(
                    "Welcome to the Colosseum! 🏛️ Let's explore this magnificent amphitheater through time.",
                    "",
                    4000
                );
            }

            // Start cinematic sequence
            await this.executeCinematicSequence();
            
            // Add interactive elements
            await this.addInteractiveElements();

            // Show marketing info
            if (window.NavigationController) {
                window.NavigationController.showDestinationInfo({
                    marketingContent: {
                        title: "The Colosseum",
                        subtitle: "Ancient Rome's Greatest Amphitheater",
                        description: "Step back in time to explore this iconic symbol of Imperial Rome, where gladiators once fought and history was made.",
                        features: [
                            "360° Aerial Views",
                            "Interactive Historical Markers",
                            "Ancient vs Modern Perspectives",
                            "Architectural Highlights Tour"
                        ],
                        promoMessage: "Special guided tours available!",
                        callToAction: "Start Your Journey Through Time"
                    }
                });
            }

        } catch (error) {
            console.error("Error initializing Colosseum experience:", error);
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

    async createAnimatedPath() {
        console.log("Creating animated path along road");
        try {
            const { Polyline3DElement } = await google.maps.importLibrary("maps3d");
            
            const basePath = new Polyline3DElement({
                altitudeMode: "RELATIVE_TO_GROUND",
                strokeColor: "#666666",
                strokeWidth: 8
            });
    
            const highlightSegment = new Polyline3DElement({
                altitudeMode: "RELATIVE_TO_GROUND",
                strokeColor: "#FFA500",
                strokeWidth: 8
            });
    
            await customElements.whenDefined(basePath.localName);
            await customElements.whenDefined(highlightSegment.localName);
    
            basePath.coordinates = this.pathCoordinates;
            this.map.append(basePath);
    
            this.animateSegment(highlightSegment, this.pathCoordinates);
            this.map.append(highlightSegment);
            
            this.path = [basePath, highlightSegment];
    
        } catch (error) {
            console.error("Error creating animated path:", error);
        }
    }

    animateSegment(segment, roadCoordinates) {
        const segmentLength = 0.001;
        let progress = 0;
    
        const animate = () => {
            if (progress >= 1) {
                progress = 0;
            }
    
            const currentIndex = Math.floor(progress * (roadCoordinates.length - 1));
            const nextIndex = Math.min(currentIndex + 1, roadCoordinates.length - 1);
            
            const current = roadCoordinates[currentIndex];
            const next = roadCoordinates[nextIndex];
            
            const segmentStart = {
                lat: current.lat + (next.lat - current.lat) * (progress % (1 / (roadCoordinates.length - 1))),
                lng: current.lng + (next.lng - current.lng) * (progress % (1 / (roadCoordinates.length - 1)))
            };
    
            const segmentEnd = {
                lat: segmentStart.lat + (next.lat - current.lat) * segmentLength,
                lng: segmentStart.lng + (next.lng - current.lng) * segmentLength
            };
    
            segment.coordinates = [segmentStart, segmentEnd];
            
            progress += 0.002;
            requestAnimationFrame(animate);
        };
    
        animate();
    }

    animatePath() {
        let opacity = 0.8;
        let increasing = false;

        const animate = () => {
            if (this.path) {
                if (increasing) {
                    opacity += 0.02;
                    if (opacity >= 0.8) increasing = false;
                } else {
                    opacity -= 0.02;
                    if (opacity <= 0.4) increasing = true;
                }
                
                this.path.strokeColor = `rgba(255, 215, 0, ${opacity})`;
                requestAnimationFrame(animate);
            }
        };

        animate();
    }


    async createViewpoints() {
        console.log("Creating viewpoint markers");
        try {
            const { Marker3DElement } = await google.maps.importLibrary("maps3d");
            const { PinElement } = await google.maps.importLibrary("marker");

            const viewpoints = [
                {
                    position: {
                        lat: 41.890510,
                        lng: 12.492531,
                        altitude: 0
                    },
                    title: "Main Entrance",
                    glyph: "🏛️"
                },
                {
                    position: {
                        lat: 41.889910,
                        lng: 12.492131,
                        altitude: 0
                    },
                    title: "Arena View",
                    glyph: "⚔️"
                },
                {
                    position: {
                        lat: 41.890110,
                        lng: 12.491931,
                        altitude: 0
                    },
                    title: "Underground Chambers",
                    glyph: "🔍"
                }
            ];

            for (const point of viewpoints) {
                const pinElement = new PinElement({
                    background: "#FF4141",
                    borderColor: "#8B0000",
                    glyphColor: "white",
                    scale: 1.2,
                    glyph: point.glyph
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
            // Aerial view
            await this.map.flyCameraTo({
                endCamera: {
                    center: {
                        lat: 41.890210,
                        lng: 12.492231,
                        altitude: 200
                    },
                    tilt: 45,
                    heading: 0,
                    range: 600
                },
                durationMillis: 3000
            });

            await new Promise(resolve => setTimeout(resolve, 2000));

            // Circular view
            await this.map.flyCameraAround({
                camera: {
                    center: {
                        lat: 41.890210,
                        lng: 12.492231,
                        altitude: 150
                    },
                    tilt: 60,
                    range: 400
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
            const cameraSettings = {
                "Main Entrance": {
                    tilt: 45,
                    heading: 0,
                    range: 300
                },
                "Arena View": {
                    tilt: 60,
                    heading: 90,
                    range: 200
                },
                "Underground Chambers": {
                    tilt: 75,
                    heading: 180,
                    range: 250
                }
            };

            const settings = cameraSettings[marker.title];
            
            await this.map.flyCameraTo({
                endCamera: {
                    center: {
                        ...marker.position,
                        altitude: 100
                    },
                    ...settings
                },
                durationMillis: 2000
            });

            // Show relevant narration for each viewpoint
            if (window.NarrationSystem) {
                const narrations = {
                    "Main Entrance": "The grand entrance of the Colosseum, where spectators would flood in to watch the games! 🏛️",
                    "Arena View": "The arena floor, where gladiatorial contests and spectacles took place! ⚔️",
                    "Underground Chambers": "The hypogeum - a network of underground tunnels where gladiators and animals waited! 🔍"
                };

                await window.NarrationSystem.show(narrations[marker.title], "", 3000);
            }

        } catch (error) {
            console.error("Error moving to viewpoint:", error);
        }
    }

    cleanup() {
        console.log("Cleaning up Colosseum controller");
        this.markers.forEach(marker => marker.remove());
        if (Array.isArray(this.path)) {
            this.path.forEach(pathElement => {
                if (pathElement && pathElement.parentElement) {
                    pathElement.remove();
                }
            });
        }
    }
}

// Export for use in other modules
window.ColosseumController = ColosseumController;