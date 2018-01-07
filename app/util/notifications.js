class notifications {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  static warn(msg, text) {
    if (process.env.warnings) {
      msg.guild.owner.send(text)
    }
  }
}

module.exports = notifications;
