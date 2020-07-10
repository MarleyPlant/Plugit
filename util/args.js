class args {
    constructor() {
      throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }
  
    static parse(msg) {
      this.args =  msg.content.slice(process.env.prefix).trim().split(/ +/g);
      this.command = this.args.shift().toLowerCase();
      return this.args
    }
  }
  
  module.exports = args;
  