export interface IQueueNode<t> {
  data: t;
  next: IQueueNode<t> | null;
}

export interface IQueue<t> {
  push(val: t): void;
  pop(): t | null;
  items: t[];
  head: IQueueNode<t> | null;
  tail: IQueueNode<t> | null;
  length: number;
}

export default class Queue<t> implements IQueue<t> {
  head: IQueueNode<t> | null = null;
  tail: IQueueNode<t> | null = null;
  length = 0;
  get items() {
    return [...this.values()];
  }

  *values() {
    let current: IQueueNode<t> | null = this.head;
    while (current) {
      yield current.data;
      current = current.next;
    }
  }

  push(val: t) {
    const newNode: IQueueNode<t> = {
      data: val,
      next: null,
    };
    if (!this.head) {
      this.head = newNode;
    }
    if (this.tail) {
      this.tail.next = newNode;
    }
    this.tail = newNode;
    this.length += 1;
  }

  pop() {
    if (!this.head) {
      return null;
    }
    const result = this.head;
    this.head = this.head.next;
    if (this.head == null) {
      this.tail = null;
    }
    this.length -= 1;
    return result.data;
  }
}
