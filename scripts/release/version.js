const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');

const { organization, folderNameToPackageName, runSpawn } = require('./helpers');

(async () => {
    // e.x release-contracts-v1.5
    const refName = `release-contracts-v1.5`
    // e.x contracts
    const package = refName.split('-')[1]

    // core.info(`Looping through keys and values`);

    let commandArgs = ['changeset', 'version']

    const keys = Object.keys(folderNameToPackageName);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const value = folderNameToPackageName[key]

        if (keys[i] != package) {
            commandArgs.push('--ignore')
            commandArgs.push(`${organization}/${value}`)
            // commandArgs += ` --ignore ${organization}/${value}`
        }
    }

    // core.info(commandArgs)

    await runSpawn('npx', commandArgs)
})();
