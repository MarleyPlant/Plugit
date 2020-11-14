function getProperUsageText(prefix, command, pluginManager) {
    return `\nThe proper usage would be: \`${prefix}${pluginManager.commands[command].name} ${pluginManager.commands[command].parameters.params}\``;
}

module.exports = getProperUsageText;