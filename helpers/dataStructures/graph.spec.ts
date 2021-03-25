import Graph, { INode } from './graph';

describe('Graph v2', () => {
  it('initializes empty if no args passed to constructor', () => {
    const testGraph = new Graph<number>();
    expect(testGraph.nodes).toEqual([]);
    expect(testGraph.links).toEqual([]);
  });

  it('can provide target neighbors', () => {
    const testNodes = [
      { value: 1, id: '1' },
      { value: 2, id: '2' },
      { value: 3, id: '3' },
    ];

    const testLinks = [
      { sourceId: '1', targetId: '2' },
      { sourceId: '1', targetId: '3' },
      { sourceId: '2', targetId: '3' },
    ];
    const testGraph = new Graph<number>(testNodes, testLinks);
    const node1 = testGraph.getNodeById('1') as INode<number>;
    const results = testGraph.targetsFor(node1).map((n) => n.id);
    expect(results).toEqual(['2', '3']);
  });

  it('can provide source neighbors', () => {
    const testNodes = [
      { value: 1, id: '1' },
      { value: 2, id: '2' },
      { value: 3, id: '3' },
    ];

    const testLinks = [
      { sourceId: '1', targetId: '2' },
      { sourceId: '1', targetId: '3' },
      { sourceId: '2', targetId: '3' },
    ];
    const testGraph = new Graph<number>(testNodes, testLinks);
    const node3 = testGraph.getNodeById('3') as INode<number>;
    const results = testGraph.sourcesFor(node3).map((n) => n.id);
    expect(results).toEqual(['1', '2']);
  });

  it('can provide all neighbors', () => {
    const testNodes = [
      { value: 1, id: '1' },
      { value: 2, id: '2' },
      { value: 3, id: '3' },
    ];

    const testLinks = [
      { sourceId: '1', targetId: '2' },
      { sourceId: '1', targetId: '3' },
      { sourceId: '2', targetId: '3' },
    ];
    const testGraph = new Graph<number>(testNodes, testLinks);
    const node2 = testGraph.getNodeById('2') as INode<number>;
    const results = new Set(
      [...testGraph.neighborsFor(node2)].map((n) => n.id)
    );
    expect(results).toEqual(new Set(['1', '3']));
  });

  it('can depth first search using a generator, waiting between visits', async () => {
    const testNodes = [
      { value: 1, id: '1' },
      { value: 2, id: '2' },
      { value: 3, id: '3' },
      { value: 4, id: '4' },
    ];

    const testLinks = [
      { sourceId: '1', targetId: '2' },
      { sourceId: '1', targetId: '4' },
      { sourceId: '2', targetId: '3' },
    ];
    const testGraph = new Graph<number>(testNodes, testLinks);

    const generator = testGraph.dfsGenerator('1');
    const results = [];
    for (const val of generator) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      console.log(val);
      results.push(val);
    }
    expect(results).toEqual([1, 2, 3, 4]);
  });

  it('can breadth first search using a generator, waiting between visits', async () => {
    const testNodes = [
      { value: 1, id: '1' },
      { value: 2, id: '2' },
      { value: 3, id: '3' },
      { value: 4, id: '4' },
    ];

    const testLinks = [
      { sourceId: '1', targetId: '2' },
      { sourceId: '1', targetId: '4' },
      { sourceId: '2', targetId: '3' },
    ];
    const testGraph = new Graph<number>(testNodes, testLinks);

    const generator = testGraph.bfsGenerator('1');
    const results = [];
    for (const val of generator) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      console.log(val);
      results.push(val);
    }
    expect(results).toEqual([1, 2, 4, 3]);
  });
});
