// simple implementation of stack data structure

export interface IStackNode<t> {
  data: t;
  under: IStackNode<t> | null;
}

export interface IStack<t> {
  top: IStackNode<t> | null;
  push(value: t): void;
  pop(): t | null;
  items: t[];
}

export interface IMinStack<t> extends IStack<t> {
  min: t | null;
  minAccessor(node: t): any;
  minStack: IStack<t>;
}

export default class Stack<t> implements IStack<t> {
  top: IStackNode<t> | null = null;
  length = 0;

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

/*
inspired by the question:
How would you design a stack which, in addition to push and pop, has a
function "min" which returns the minimum element? Push, pop, and min
should all operate in O(1) time.
*/

export class MinStack<t> extends Stack<t> implements IMinStack<t> {
  constructor(minAccessor = (value: t) => value as any) {
    super();
    this.minStack = new Stack<t>();
    this.minAccessor = minAccessor;
  }

  minStack: Stack<t>;

  minAccessor(value: t) {
    return value;
  }

  get min() {
    if (this.minStack.top) {
      return this.minStack.top.data;
    }
    return null;
  }

  push(value: t) {
    super.push(value);
    if (
      this.minStack.top === null ||
      this.minAccessor(value) < this.minAccessor(this.minStack.top.data)
    ) {
      this.minStack.push(value);
    }
  }

  pop() {
    const result = super.pop();
    if (this.minStack.top && this.minStack.top.data === result) {
      this.minStack.pop();
    }
    return result;
  }
}
