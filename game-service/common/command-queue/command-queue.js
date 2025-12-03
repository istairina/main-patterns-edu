const { ICommand } = require('../command-interface/command');

// Нода для создания очереди, value - команда, next - следующий элемент очереди
class Node {
  constructor(value = null, next = null) {
    this.value = value;
    this.next = next;
  }
}

// Класс для создания очереди вызова команд. Методы получения элемента, добавления, проверки на пустоту и получения размера.
class ListQueue {
  constructor() {
    this.sizeQ = 0;
    this.head;
    this.tail;
  }

  isEmpty() {
    return this.sizeQ === 0;
  }

  get() {
    if (this.isEmpty()) return;

    const elem = this.head.value;

    this.head = this.head.next;
    this.sizeQ -= 1;

    return elem;
  }

  put(cmd, ...args) {
    if (this.isEmpty()) {
      this.head = new Node(new ICommand(cmd, args));
      this.tail = this.head;
    } else {
      this.tail.next = new Node(new ICommand(cmd, args));
      this.tail = this.tail.next;
    }

    this.sizeQ += 1;
  }

  get size() {
    return this.sizeQ;
  }
}

module.exports = { ListQueue };