import Graph, { GraphNode } from './graph';

describe('Graph', () => {
  it('can provide node ids', () => {
    const myNodes = [
      new GraphNode<number>('1', 1, ['2']),
      new GraphNode<number>('2', 2, ['3']),
      new GraphNode<number>('3', 3, []),
    ];
    const myGraph = new Graph<number>(myNodes);
    const result = myGraph.nodeIds;
    expect(result).toEqual(['1', '2', '3']);
  });

  it('can provide adjacency list', () => {
    const myNodes = [
      new GraphNode<number>('1', 1, ['2']),
      new GraphNode<number>('2', 2, ['3']),
      new GraphNode<number>('3', 3, []),
    ];
    const myGraph = new Graph<number>(myNodes);
    const result = myGraph.adjacencyList;
    expect(result).toEqual({
      '1': ['2'],
      '2': ['3'],
      '3': [],
    });
  });

  it('can depth first search', () => {
    const myNodes = [
      new GraphNode<number>('1', 1, ['2', '4']),
      // 1 --> 2 --> 1 cycle
      new GraphNode<number>('2', 2, ['3', '1']),
      new GraphNode<number>('3', 3, []),
      new GraphNode<number>('4', 4, []),
    ];
    const myGraph = new Graph<number>(myNodes);
    const result = myGraph.dfs('1');
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('can depth first search using a stack', () => {
    const myNodes = [
      new GraphNode<number>('1', 1, ['2', '4']),
      // 1 --> 2 --> 1 cycle
      new GraphNode<number>('2', 2, ['3', '1']),
      new GraphNode<number>('3', 3, []),
      new GraphNode<number>('4', 4, []),
    ];
    const myGraph = new Graph<number>(myNodes);
    const result = myGraph.dfsStack('1');
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('can depth first search using a generator', () => {
    const myNodes = [
      new GraphNode<number>('1', 1, ['2', '4']),
      // 1 --> 2 --> 1 cycle
      new GraphNode<number>('2', 2, ['3', '1']),
      new GraphNode<number>('3', 3, []),
      new GraphNode<number>('4', 4, []),
    ];
    const myGraph = new Graph<number>(myNodes);
    const result = [...myGraph.dfsGenerator('1')];
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('can depth first search using a generator, waiting between visits', async () => {
    const myNodes = [
      new GraphNode<number>('1', 1, ['2', '4']),
      // 1 --> 2 --> 1 cycle
      new GraphNode<number>('2', 2, ['3', '1']),
      new GraphNode<number>('3', 3, []),
      new GraphNode<number>('4', 4, []),
    ];
    const myGraph = new Graph<number>(myNodes);

    const generator = myGraph.dfsGenerator('1');
    const results = [];
    for (const val of generator) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      console.log(val);
      results.push(val);
    }
    expect(results).toEqual([1, 2, 3, 4]);
  });

  it('can breadth first search', () => {
    const myNodes = [
      new GraphNode<number>('1', 1, ['2', '4']),
      // 1 --> 2 --> 1 cycle
      new GraphNode<number>('2', 2, ['3', '1']),
      new GraphNode<number>('3', 3, []),
      new GraphNode<number>('4', 4, []),
    ];
    const myGraph = new Graph<number>(myNodes);
    const result = myGraph.bfs('1');
    expect(result).toEqual([1, 2, 4, 3]);
  });

  it('can breadth first search using a generator', () => {
    const myNodes = [
      new GraphNode<number>('1', 1, ['2', '4']),
      // 1 --> 2 --> 1 cycle
      new GraphNode<number>('2', 2, ['3', '1']),
      new GraphNode<number>('3', 3, []),
      new GraphNode<number>('4', 4, []),
    ];
    const myGraph = new Graph<number>(myNodes);
    const result = [...myGraph.bfsGenerator('1')];
    expect(result).toEqual([1, 2, 4, 3]);
  });

  it('can breadth first search using a generator, waiting between visits', async () => {
    const myNodes = [
      new GraphNode<number>('1', 1, ['2', '4']),
      // 1 --> 2 --> 1 cycle
      new GraphNode<number>('2', 2, ['3', '1']),
      new GraphNode<number>('3', 3, []),
      new GraphNode<number>('4', 4, []),
    ];
    const myGraph = new Graph<number>(myNodes);

    const generator = myGraph.bfsGenerator('1');
    const results = [];
    for (const val of generator) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      console.log(val);
      results.push(val);
    }
    expect(results).toEqual([1, 2, 4, 3]);
  });
});
