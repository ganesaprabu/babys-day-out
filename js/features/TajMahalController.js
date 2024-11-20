

class TajMahalController {
    constructor(map) {
        console.log("Initializing Taj Mahal Controller");
        this.map = map;
        this.location = LOCATIONS.SEVEN_WONDERS.wonders.find(w => w.name === "Taj Mahal");
    }

    async initialize() {
        console.log("Setting up Taj Mahal overview experience");
        try {
            // Move narration to start of sequence
            if (window.NarrationSystem) {
                window.NarrationSystem.show(
                    "Welcome to the Taj Mahal! 🏰 One of the world's most beautiful monuments...",
                    "",
                    4000
                );
            }

            // Chain promises to ensure sequence
            await this.executeSimpleSequence();
        } catch (error) {
            console.error("Error initializing Taj Mahal experience:", error);
        }
    }

    async executeSimpleSequence() {
        console.log("Starting Taj Mahal simple overview sequence");
        try {
            // Initial aerial view
            await this.moveCamera({
                center: {
                    lat: 27.175015,
                    lng: 78.042155,
                    altitude: 300
                },
                tilt: 0,  // Top-down view
                heading: 0,
                range: 1000
            }, 3000);
            
            await this.pause(2000);

            // Slightly closer view
            await this.moveCamera({
                center: {
                    lat: 27.175015,
                    lng: 78.042155,
                    altitude: 200
                },
                tilt: 0,  // Keeping top-down view
                heading: 0,
                range: 800
            }, 3000);

            // Show narration immediately after camera move completes
            await window.NarrationSystem.show(
                "Admire this architectural masterpiece from above! ✨",
                "",
                4000
            );

            // Show marketing info immediately
            if (window.NavigationController) {
                window.NavigationController.showDestinationInfo({
                    marketingContent: LOCATIONS.SEVEN_WONDERS.marketingContent
                });
            }

        } catch (error) {
            console.error("Error in Taj Mahal sequence:", error);
        }
    }

    
    async moveCamera(endCamera, duration) {
        console.log("Moving camera to:", endCamera);
        try {
            // Use the Promise.race to handle both animation completion and timeout
            await Promise.race([
                new Promise((resolve) => {
                    const animation = this.map.flyCameraTo({
                        endCamera,
                        durationMillis: duration
                    });
                    
                    // Use the animation promise instead of event listener
                    animation.then(() => {
                        console.log('Camera movement completed via promise');
                        resolve();
                    });
                }),
                // Add a safety timeout
                new Promise(resolve => setTimeout(resolve, duration + 500))
            ]);
            
            console.log('Camera movement and safety timeout completed');
        } catch (error) {
            console.error('Error during camera movement:', error);
        }
    }

    async pause(duration) {
        console.log(`Pausing for ${duration}ms`);
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    cleanup() {
        console.log("Cleaning up Taj Mahal controller");
    }
}

window.TajMahalController = TajMahalController;