// Интрефейс для создания отдельной команды
class ICommand {
  constructor(cmd, args) {
    this.cmd = cmd;
    this.args = args;
  }

  get funcName() {
    return this.cmd.name;
  }

  execute() {
    return this.cmd(...this.args);
  }
}

module.exports = { ICommand };