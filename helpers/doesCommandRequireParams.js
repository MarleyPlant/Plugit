function doesCommandRequireParams(command, args, pluginManager) {
  return (
    !args.length == pluginManager.commands[command].parameters.params.length &&
    pluginManager.commands[command].parameters.params.required
  );
}

module.exports = doesCommandRequireParams;