// js/features/virtual-entry-handler.js

const VirtualEntryHandler = {
    animatedElements: {
        doors: null,
        glassWalls: null
    },

    // Add the easing function at the top level of the object
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },

    async init() {
        console.log('Initializing VirtualEntryHandler');
        try {
            const { Polygon3DElement } = await google.maps.importLibrary("maps3d");
            await this.initDoors(Polygon3DElement);
            return true;
        } catch (error) {
            console.error('Error initializing VirtualEntryHandler:', error);
            return false;
        }
    },

    async initDoors(Polygon3DElement) {
        console.log('Creating virtual doors');
        try {
            // Create left door panel with updated properties
            const leftDoor = new Polygon3DElement({
                altitudeMode: "RELATIVE_TO_GROUND",  // Updated to correct format
                fillColor: "rgba(70, 130, 180, 0.8)", // Semi-transparent steel blue
                strokeColor: "#FFFFFF",
                strokeWidth: 2,
                extruded: true
            });
    
            // Create right door panel with matching properties
            const rightDoor = new Polygon3DElement({
                altitudeMode: "RELATIVE_TO_GROUND",
                fillColor: "rgba(70, 130, 180, 0.8)",
                strokeColor: "#FFFFFF",
                strokeWidth: 2,
                extruded: true
            });
    
            await customElements.whenDefined(leftDoor.localName);
            await customElements.whenDefined(rightDoor.localName);
    
            // Increased door size for better visibility
            const doorHeight = 25;
            const doorWidth = 0.00008;
    
            // Create door coordinates with larger size
            const createDoorCoords = (baseLng) => [
                { lat: 37.8019, lng: baseLng, altitude: 0 },
                { lat: 37.8019, lng: baseLng + doorWidth, altitude: 0 },
                { lat: 37.8019, lng: baseLng + doorWidth, altitude: doorHeight },
                { lat: 37.8019, lng: baseLng, altitude: doorHeight },
                { lat: 37.8019, lng: baseLng, altitude: 0 }
            ];
    
            console.log('Setting door coordinates');
            const leftDoorCoords = createDoorCoords(-122.3975);
            const rightDoorCoords = createDoorCoords(-122.39745);
    
            leftDoor.outerCoordinates = leftDoorCoords;
            rightDoor.outerCoordinates = rightDoorCoords;
    
            // Add reflection effect using fillColor instead of strokeOpacity
            const addReflection = (door) => {
                const animate = () => {
                    const time = Date.now() / 1000;
                    const baseOpacity = 0.8;
                    const variableOpacity = Math.sin(time) * 0.1;
                    // Update the fillColor with new opacity
                    door.fillColor = `rgba(70, 130, 180, ${baseOpacity + variableOpacity})`;
                    requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
            };
    
            addReflection(leftDoor);
            addReflection(rightDoor);
    
            this.animatedElements.doors = {
                left: leftDoor,
                right: rightDoor,
                isOpen: false
            };
    
            console.log('Virtual doors created successfully');
            return { leftDoor, rightDoor };
    
        } catch (error) {
            console.error('Error creating virtual doors:', error);
            throw error;
        }
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
            console.log('Adding doors to map');
            map.append(leftDoor);
            map.append(rightDoor);
        }
    
        // Increased maximum offset for more visible movement
        const duration = 1500;
        const frames = 30;
        const interval = duration / frames;
        const maxOffset = 0.0004;  // Doubled from previous value
    
        let currentFrame = 0;
        
        return new Promise((resolve) => {
            const animate = () => {
                if (currentFrame >= frames) {
                    console.log('Door animation completed');
                    this.animatedElements.doors.isOpen = isOpening;
                    resolve();
                    return;
                }
    
                // Use the easing function from this object
                const progress = this.easeInOutQuad(currentFrame / frames);
                
                const leftOffset = isOpening ? progress * maxOffset : (1 - progress) * maxOffset;
                const rightOffset = -leftOffset;
    
                const shouldLog = currentFrame % 5 === 0;
                if (shouldLog) {
                    console.log('Animation progress:', {
                        frame: currentFrame,
                        progress: progress.toFixed(2),
                        leftOffset: leftOffset.toFixed(6),
                        rightOffset: rightOffset.toFixed(6)
                    });
                }

                this.updateDoorPosition(leftDoor, leftOffset, shouldLog);
                this.updateDoorPosition(rightDoor, rightOffset, shouldLog);
    
                currentFrame++;
                setTimeout(() => requestAnimationFrame(animate), interval);
            };
    
            requestAnimationFrame(animate);
        });
    },

    updateDoorPosition(door, offset, shouldLog = false) {
        try {
            const currentCoords = door.outerCoordinates;
            const newCoords = currentCoords.map(coord => ({
                lat: coord.lat,
                lng: coord.lng + offset,
                altitude: coord.altitude
            }));
            
            if (shouldLog) {
                console.log('Updating door position', {
                    offset: Number(offset.toFixed(6)),
                    coordsCount: newCoords.length
                });
            }
            
            door.outerCoordinates = newCoords;
        } catch (error) {
            console.error('Error updating door position:', error);
            throw error;
        }
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