// HardStop приводит к тому, что будет возвращена "нулевая ссылка" на следующее состояние
function HardStop() { }

// MoveToCommand приводит к тому, что будет возвращена ссылка на состояние MoveTo
function MoveToCommand(targetQueue) { }

// RunCommand приводит к тому, что будет возвращена ссылка на "обычное" состояние.
function RunCommand() { }

module.exports = { HardStop, MoveToCommand, RunCommand };

