class args {
    constructor() {
      throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }
  
    static parse(msg, prefix) {
      this.args =  msg.content.slice(prefix).trim().split(/ +/g);
      this.command = this.args.shift().toLowerCase().split(prefix)[1];
      return ({
        args: this.args,
        command: this.command
    });
  }
}
  
  module.exports = args;
  