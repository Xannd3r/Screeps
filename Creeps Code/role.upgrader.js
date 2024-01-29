var room_dest;

var roleUpgrader = {

    run: function (creep) {

        // Find the spawn in the room
        var spawn = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_SPAWN;
            }
        });

        // Check if the creep needs to renew at the spawn
        if (creep.ticksToLive < 50 && !creep.memory.renew_process) {
            creep.memory.renew_process = true;
        }

        // Check if the creep has renewed and reset the renew process flag
        if (creep.ticksToLive > 500 && creep.memory.renew_process) {
            creep.memory.renew_process = false;
        }

        // Check if the creep is in a different room and not in the process of renewing
        if (creep.memory.room_dest != null && creep.room.name !== creep.memory.room_dest && !creep.memory.renew_process) {
            room_dest = creep.memory.room_dest;
            var roomName = String(room_dest);
            creep.moveTo(new RoomPosition(25, 25, roomName));
        } else {
            // Check if the creep should switch between upgrading and collecting energy
            if (creep.memory.building && creep.store.getUsedCapacity([RESOURCE_ENERGY]) === 0) {
                creep.memory.building = false;
            }
            if (!creep.memory.building && creep.store.getUsedCapacity([RESOURCE_ENERGY]) === creep.store.getCapacity([RESOURCE_ENERGY])) {
                creep.memory.building = true;
            }

            // If the creep is in upgrading mode
            if (creep.memory.building) {
                creep.say("⏏");
                // Upgrade the controller if not in range
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00B200'}, reusePath: 10});
                }
                /* Uncomment the following lines if you want the upgrader to sign the controller
                if (creep.signController(creep.room.controller, "Gebiet des Deutschen Kaiserreich") == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00B200'}});
                }
                */
            } else {
                // If not in upgrading mode
                if (!creep.memory.renew_process) {
                    creep.say("⛏");
                    var sources = creep.pos.findClosestByPath(FIND_SOURCES);
                    
                    // Check if there is enough energy in storage and move towards it
                    if (creep.room.storage && creep.room.storage.store.energy > 10000) {
                        creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffaa00'}});
                        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                    } else if (creep.harvest(sources) === ERR_NOT_IN_RANGE) {
                        // Harvest energy from the source if not in range
                        creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else {
                    // If in the process of renewing
                    if (creep.moveTo(spawn[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    } else {
                        // If energy available in the room is greater than 500, suicide, else renew
                        if (creep.room.energyAvailable > 500) {
                            creep.suicide();
                        } else {
                            spawn[0].renewCreep(creep);
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleUpgrader;