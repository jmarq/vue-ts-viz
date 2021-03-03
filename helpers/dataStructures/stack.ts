// simple implementation of stack data structure

export interface IStackNode<t> {
  data: t;
  under: IStackNode<t> | null;
}

export interface IStack<t> {
  top: IStackNode<t> | null;
  push(value: t): void;
  pop(): t | null;
}

export interface IMinStack<t> extends IStack<t> {
  min: t | null;
  minAccessor(node: t): any;
}

export default class Stack<t> implements IStack<t> {
  // constructor() {
  //   this.top = null;
  // }

  top: IStackNode<t> | null = null;
  length = 0;

  // get length() {
  //   const vals = [...this.values()];
  //   return vals.length;
  // }

  get items(): t[] {
    const vals = [...this.values()];
    return vals;
  }

  *values(): Generator<t> {
    let current = this.top;
    while (current) {
      yield current.data;
      current = current.under;
    }
  }

  push(value: t) {
    const newNode: IStackNode<t> = {
      data: value,
      under: this.top,
    };

    this.top = newNode;
    this.length += 1;
  }

  pop() {
    let result;
    if (this.top) {
      result = this.top.data;
      this.top = this.top.under;
      this.length -= 1;
    } else {
      result = null;
    }
    return result;
  }
}

export class MinStack<t> implements IMinStack<t> {
  constructor(minAccessor = (value: t) => value as any) {
    this.realStack = new Stack<t>();
    this.minStack = new Stack<t>();
    this.minAccessor = minAccessor;
  }

  minAccessor(value: t) {
    return value;
  }

  realStack: Stack<t>;
  minStack: Stack<t>;
  get top() {
    return this.realStack.top;
  }

  get min() {
    if (this.minStack.top) {
      return this.minStack.top.data;
    }
    return null;
  }

  get values() {
    return this.realStack.values;
  }

  get length() {
    return this.realStack.length;
  }

  get items() {
    return this.realStack.items;
  }

  // *values(): Generator<t> {
  //   let current = this.top;
  //   while (current) {
  //     yield current.data;
  //     current = current.under;
  //   }
  // }

  push(value: t) {
    this.realStack.push(value);
    if (
      this.minStack.top === null ||
      this.minAccessor(value) < this.minAccessor(this.minStack.top.data)
    ) {
      this.minStack.push(value);
    }
  }

  pop() {
    const result = this.realStack.pop();
    if (this.minStack.top && this.minStack.top.data === result) {
      this.minStack.pop();
    }
    return result;
  }
}
