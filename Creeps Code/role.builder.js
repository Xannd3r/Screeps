var roleBuilder = {
    run: function (creep) {
        // If the creep is carrying resources, it will try to build
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] > 0) {
            // Find construction sites
            var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);

            if (constructionSites.length > 0) {
                // Move to and build the first construction site
                if (creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSites[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // If no construction sites, perform repair tasks
                roleBuilder.repair(creep);
            }
        }
        // If the creep is not carrying resources, it will gather them
        else {
            roleBuilder.harvest(creep);
        }
    },

    // Function for the builder to gather resources
    harvest: function (creep) {
        // Find energy sources (e.g., energy containers, harvesters, etc.)
        var sources = creep.room.find(FIND_SOURCES);

        // Move to and harvest energy from the first source
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    },

    // Function for the builder to repair structures
    repair: function (creep) {
        // Find structures that need repair
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });

        // If there are structures to repair, move to and repair the first one
        if (targets.length > 0) {
            if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};

module.exports = roleBuilder;