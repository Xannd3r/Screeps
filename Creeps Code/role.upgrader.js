const roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            // Collect energy from extensions
            const extensionsWithEnergy = creep.room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_EXTENSION, 
                          store: { [RESOURCE_ENERGY]: 0 } }
            });

            if (extensionsWithEnergy.length > 0) {
                if (creep.withdraw(extensionsWithEnergy[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(extensionsWithEnergy[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                // If no extensions have energy, fallback to harvesting from sources
                const sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    },

    spawnCreep: function() {
        const newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {memory: {role: 'upgrader'}});
    }
};

module.exports = roleUpgrader;