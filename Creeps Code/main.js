const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

module.exports.loop = function () {
    // Clear memory of dead creeps
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Automatic spawning
    const minimumHarvesters = 2;
    const minimumUpgraders = 1;
    const minimumBuilders = 1;

    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');

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

function spawnCreep(role, body) {
    const newName = role.charAt(0).toUpperCase() + role.slice(1) + Game.time;
    console.log('Spawning new ' + role + ': ' + newName);
    Game.spawns['Spawn1'].spawnCreep(body, newName, { memory: { role: role } });
}