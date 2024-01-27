const roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // If no construction sites, repair structures
                const structuresToRepair = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                });

                if (structuresToRepair.length > 0) {
                    if (creep.repair(structuresToRepair[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(structuresToRepair[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }
            }
        } else {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    },

    spawnCreep: function() {
        const newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'builder', building: false } });
    }
};

module.exports = roleBuilder;