// js/features/virtual-entry-handler.js

const VirtualEntryHandler = {
    animatedElements: {
        doors: null,
        glassWalls: null
    },

    async init() {
        console.log('Initializing VirtualEntryHandler');
        try {
            const { Polygon3DElement } = await google.maps.importLibrary("maps3d");
            this.initDoors(Polygon3DElement);
            return true;
        } catch (error) {
            console.error('Error initializing VirtualEntryHandler:', error);
            return false;
        }
    },

    async initDoors(Polygon3DElement) {
        console.log('Creating virtual doors');
        
        // Create left door panel
        const leftDoor = new Polygon3DElement({
            altitudeMode: "RELATIVE_TO_GROUND",
            fillColor: "rgba(192, 192, 192, 0.8)",
            strokeColor: "#FFFFFF",
            strokeWidth: 1,
            extruded: true
        });

        // Create right door panel
        const rightDoor = new Polygon3DElement({
            altitudeMode: "RELATIVE_TO_GROUND",
            fillColor: "rgba(192, 192, 192, 0.8)",
            strokeColor: "#FFFFFF",
            strokeWidth: 1,
            extruded: true
        });

        await customElements.whenDefined(leftDoor.localName);
        await customElements.whenDefined(rightDoor.localName);

        // Set door coordinates
        const leftDoorCoords = [
            { lat: 37.8019, lng: -122.3975, altitude: 0 },
            { lat: 37.8019, lng: -122.39745, altitude: 0 },
            { lat: 37.8019, lng: -122.39745, altitude: 15 },
            { lat: 37.8019, lng: -122.3975, altitude: 15 }
        ];

        const rightDoorCoords = [
            { lat: 37.8019, lng: -122.39745, altitude: 0 },
            { lat: 37.8019, lng: -122.3974, altitude: 0 },
            { lat: 37.8019, lng: -122.3974, altitude: 15 },
            { lat: 37.8019, lng: -122.39745, altitude: 15 }
        ];

        leftDoor.outerCoordinates = leftDoorCoords;
        rightDoor.outerCoordinates = rightDoorCoords;

        this.animatedElements.doors = {
            left: leftDoor,
            right: rightDoor,
            isOpen: false
        };

        return { leftDoor, rightDoor };
    },

    async animateDoors(map, isOpening = true) {
        console.log(`${isOpening ? 'Opening' : 'Closing'} virtual doors`);
        if (!this.animatedElements.doors) {
            console.warn('Doors not initialized');
            return;
        }

        const { left: leftDoor, right: rightDoor } = this.animatedElements.doors;

        // Add doors to map if not already present
        if (!leftDoor.parentElement) {
            map.append(leftDoor);
            map.append(rightDoor);
        }

        // Animation parameters
        const duration = 2000; // 2 seconds
        const frames = 60;
        const interval = duration / frames;
        const maxOffset = 0.0002; // Maximum door swing

        let currentFrame = 0;
        
        return new Promise((resolve) => {
            const animate = () => {
                if (currentFrame >= frames) {
                    this.animatedElements.doors.isOpen = isOpening;
                    resolve();
                    return;
                }

                const progress = isOpening ? 
                    currentFrame / frames : 
                    (frames - currentFrame) / frames;

                const leftOffset = progress * maxOffset;
                const rightOffset = -progress * maxOffset;

                // Update door positions
                this.updateDoorPosition(leftDoor, leftOffset);
                this.updateDoorPosition(rightDoor, rightOffset);

                currentFrame++;
                setTimeout(animate, interval);
            };

            animate();
        });
    },

    updateDoorPosition(door, offset) {
        const currentCoords = door.outerCoordinates;
        const newCoords = currentCoords.map(coord => ({
            ...coord,
            lng: coord.lng + offset
        }));
        door.outerCoordinates = newCoords;
    },

    enhanceGlassEffect() {
        if (!this.animatedElements.glassWalls) return;
        
        // Add reflection animation
        const animate = () => {
            const time = Date.now() / 1000;
            const baseOpacity = 0.2;
            const variableOpacity = Math.sin(time) * 0.1;
            
            this.animatedElements.glassWalls.fillColor = 
                `rgba(255, 255, 255, ${baseOpacity + variableOpacity})`;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    },

    cleanup() {
        console.log('Cleaning up VirtualEntryHandler');
        if (this.animatedElements.doors) {
            const { left, right } = this.animatedElements.doors;
            if (left && left.parentElement) left.remove();
            if (right && right.parentElement) right.remove();
        }
        this.animatedElements = {
            doors: null,
            glassWalls: null
        };
    }
};

// Export for use in other modules
window.VirtualEntryHandler = VirtualEntryHandler;