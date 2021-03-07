import Stack, { MinStack } from './stack';

describe('Stack', () => {
  it('pops the most recent element pushed', () => {
    const subject = new Stack<number>();
    subject.push(1);
    subject.push(2);
    const result = subject.pop();
    expect(result).toEqual(2);
  });

  it('can return the count of elements', () => {
    const subject = new Stack<number>();
    subject.push(1);
    subject.push(2);
    subject.push(3);
    const result = subject.length;
    expect(result).toEqual(3);
  });

  it('can return a list of elements', () => {
    const subject = new Stack<number>();
    subject.push(1);
    subject.push(2);
    subject.push(3);
    const result = subject.items;
    expect(result).toEqual([3, 2, 1]);
  });
});

describe('MinStack', () => {
  it('can return the minimum value it contains', () => {
    const subject = new MinStack<number>();
    subject.push(1);
    subject.push(2);
    subject.push(0);
    let result = subject.min;
    expect(result).toEqual(0);
    subject.pop();
    // minimum should update after the old min was popped
    result = subject.min;
    expect(result).toEqual(1);
  });

  it('can use a custom accessor function to calculate the value to use when considering minimum', () => {
    // convert value to negative when calculating min
    const subject = new MinStack<number>((n) => -n);
    subject.push(1);
    subject.push(3);
    subject.push(2);
    const result = subject.min;
    // 3 has the "lowest" negative
    expect(result).toEqual(3);
  });
});
