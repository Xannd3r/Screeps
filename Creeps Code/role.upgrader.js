var roleUpgrader = {
    run: function (creep) {
        // Example upgrader logic: upgrade the controller
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
};

module.exports = roleUpgrader;