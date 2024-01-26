var roleHarvester = {
    run: function (creep) {
        // Example harvester logic: harvest energy from sources and transfer it to structures
        var source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        } else {
            // Transfer energy to a nearby structure, e.g., an extension
            var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (structure) => structure.structureType === STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity
            });
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
};

module.exports = roleHarvester;