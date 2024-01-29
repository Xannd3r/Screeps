var roleHarvester = {

    /** @param {Creep} creep **/

    run: function (creep) {
  
        // Find all creeps with the role 'filler'
        var filler = _.filter(Game.creeps, (creep) => creep.memory.role === 'filler');
        
        // Find the closest energy source
        var sources = creep.pos.findClosestByPath(FIND_SOURCES);

        // Check if the harvester's energy capacity is not full
        if (creep.store.getUsedCapacity([RESOURCE_ENERGY]) < creep.store.getCapacity([RESOURCE_ENERGY])) {
            creep.say("⛏");
            // Harvest energy from the source if not in range
            if (creep.harvest(sources) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            // Find the closest structure needing energy (e.g., LINK, SPAWN, EXTENSION, TOWER)
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_LINK || structure.structureType === STRUCTURE_SPAWN
                        || structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_TOWER)
                        && structure.store.getUsedCapacity([RESOURCE_ENERGY]) < structure.store.getCapacity([RESOURCE_ENERGY]);
                    }
            });

            // Find the closest tower
            var tower = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_TOWER;
                }
            });

            // Find any enemy creeps in the room
            var enemy = creep.room.find(FIND_HOSTILE_CREEPS);
            
            // Transfer energy to nearby fillers
            for (var i in filler) {
                if (creep.pos.isNearTo(filler[i])) {
                    creep.transfer(filler[i], RESOURCE_ENERGY);
                }
            }

            // Check if there is a tower and enemies present
            if (tower != null && enemy.length > 0) {
                // Transfer energy to the tower if not in range
                if (creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } 
            // Check if there is a storage and space available
            else if (creep.room.storage && _.sum(creep.room.storage.store) < creep.room.storage.storeCapacity && !target) {
                // Transfer energy to storage if not in range
                if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } 
            // Check if there is a target structure needing energy
            else if (target) {
                // Transfer energy to the target structure if not in range
                if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } 
            // Move to a specific location if no other conditions are met
            else {
                creep.moveTo(39, 16, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleHarvester;