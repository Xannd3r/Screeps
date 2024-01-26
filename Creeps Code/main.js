// Import required modules
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

// Main loop
module.exports.loop = function () {
    // Count existing creeps for each role
    var harvesterCount = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester').length;
    var upgraderCount = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader').length;
    var builderCount = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder').length;

    // Desired number of each role
    var desiredHarvesters = 2;
    var desiredUpgraders = 2;
    var desiredBuilders = 2;

    // Spawn new harvesters if needed
    if (harvesterCount < desiredHarvesters) {
        spawnCreep('harvester');
    }

    // Spawn new upgraders if needed
    if (upgraderCount < desiredUpgraders) {
        spawnCreep('upgrader');
    }

    // Spawn new builders if needed
    if (builderCount < desiredBuilders) {
        spawnCreep('builder');
    }

    // Run logic for existing creeps
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        // Run role-specific logic
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        } else if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }
};

// Function to spawn a creep
function spawnCreep(role) {
    // Define body parts for each role
    var harvesterBody = [WORK, CARRY, MOVE];
    var upgraderBody = [WORK, CARRY, MOVE];
    var builderBody = [WORK, CARRY, MOVE];

    // Generate a unique name for the new creep
    var newName = role.charAt(0).toUpperCase() + role.slice(1) + Game.time;

    // Choose body parts based on the role
    var body;
    if (role === 'harvester') {
        body = harvesterBody;
    } else if (role === 'upgrader') {
        body = upgraderBody;
    } else if (role === 'builder') {
        body = builderBody;
    }

    // Spawn the new creep
    var spawnResult = Game.spawns['Spawn1'].spawnCreep(body, newName, { memory: { role: role } });

    // Log spawn result
    if (spawnResult === OK) {
        console.log('Spawning new ' + role + ': ' + newName);
    } else {
        console.log('Error spawning ' + role + ': ' + spawnResult);
    }
}