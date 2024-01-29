// Import the harvester, upgrader, and builder role modules
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

// Main game loop
module.exports.loop = function () {
    // Clear memory of dead creeps
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Define the minimum number of each role needed
    const minimumHarvesters = 2;
    const minimumUpgraders = 1;
    const minimumBuilders = 1;

    // Filter creeps by role
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');

    // Spawn creeps if the number falls below the minimum
    if (harvesters.length < minimumHarvesters) {
        spawnCreep('harvester', [WORK, CARRY, MOVE]);
    } else if (upgraders.length < minimumUpgraders) {
        spawnCreep('upgrader', [WORK, CARRY, MOVE]);
    } else if (builders.length < minimumBuilders) {
        spawnCreep('builder', [WORK, CARRY, MOVE]);
    }

    // Execute roles for each creep
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        } else if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }
};

// Function to spawn a new creep
function spawnCreep(role, body) {
    // Generate a unique name for the new creep
    const newName = role.charAt(0).toUpperCase() + role.slice(1) + Game.time;
    
    // Log the spawning of the new creep
    console.log('Spawning new ' + role + ': ' + newName);
    
    // Spawn the new creep
    Game.spawns['Spawn1'].spawnCreep(body, newName, { memory: { role: role } });
}