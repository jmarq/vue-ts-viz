import Queue from './queue';

describe('Queue', () => {
  it('pops the earliest element pushed', () => {
    const subject = new Queue<number>();
    subject.push(1);
    subject.push(2);
    const result = subject.pop();
    expect(result).toEqual(1);
  });

  it('can return the count of elements', () => {
    const subject = new Queue<number>();
    subject.push(1);
    subject.push(2);
    subject.push(3);
    let result = subject.length;
    expect(result).toEqual(3);
    subject.pop();
    subject.pop();
    subject.pop();
    result = subject.length;
    expect(result).toEqual(0);
  });

  it('can return a list of elements', () => {
    const subject = new Queue<number>();
    subject.push(1);
    subject.push(2);
    subject.push(3);
    const result = subject.items;
    expect(result).toEqual([1, 2, 3]);
  });
});
