// what is the goal for this data structure?
// to represent nodes/links
// to eventually visualize
// will the nodes/links be modified after the fact?
// removing links, adding new nodes, etc.
// what might the interface look like?

// should this be a directed graph? should this support '2 way links' declared as a single link?
// or maybe "neighbors" that is source/target direction agnostic

export interface INode<t> {
  id: string;
  value: t;
}

export interface ILink {
  sourceId: string;
  targetId: string;
}

export interface IGraph<t> {
  nodes: INode<t>[];
  links: ILink[];
}

export default class Graph<t> implements IGraph<t> {
  constructor(nodes: INode<t>[] = [], links: ILink[] = []) {
    this.nodes = nodes;
    this.links = links;
  }

  getNodeById(id: string): INode<t> | undefined {
    return this.nodes.find((n) => n.id === id);
  }

  targetsFor(node: INode<t>): INode<t>[] {
    const linksForNode = this.links.filter((l) => l.sourceId === node.id);
    const targetNodes = linksForNode
      .map((l) => this.getNodeById(l.targetId))
      .filter((n) => typeof n !== 'undefined') as INode<t>[];
    return targetNodes;
  }

  sourcesFor(node: INode<t>): INode<t>[] {
    const linksForNode = this.links.filter((l) => l.targetId === node.id);
    const sourceNodes = linksForNode
      .map((l) => this.getNodeById(l.sourceId))
      .filter((n) => typeof n !== 'undefined') as INode<t>[];
    return sourceNodes;
  }

  neighborsFor(node: INode<t>): Set<INode<t>> {
    const sourcesFor = this.sourcesFor(node);
    const targetsFor = this.targetsFor(node);
    const neighbors = new Set(sourcesFor.concat(targetsFor));
    return neighbors;
  }

  *dfsGenerator(
    nodeId: string,
    yieldFunc = (node: INode<t>) => node.value as any,
    directed: boolean = false
  ) {
    const neighborFunction = directed
      ? this.targetsFor.bind(this)
      : this.neighborsFor.bind(this);
    const startNode = this.getNodeById(nodeId);
    if (startNode) {
      const visitedIds: string[] = [startNode.id];
      const toVisit = [startNode];
      while (toVisit.length > 0) {
        const currentNode = toVisit.pop();
        if (currentNode) {
          yield yieldFunc(currentNode);
          for (const neighbor of [...neighborFunction(currentNode)].reverse()) {
            if (!visitedIds.includes(neighbor.id)) {
              toVisit.push(neighbor);
              visitedIds.push(neighbor.id);
            }
          }
        }
      }
    }
  }

  *bfsGenerator(
    nodeId: string,
    yieldFunc = (node: INode<t>) => node.value as any,
    directed: boolean = false
  ) {
    const neighborFunction = directed
      ? this.targetsFor.bind(this)
      : this.neighborsFor.bind(this);

    const startNode = this.nodes.find((n) => n.id === nodeId);
    if (startNode) {
      const toVisit = [startNode];
      const visitedIds: string[] = [startNode.id];
      const visit = (visitingNode: INode<t>) => {
        // results.push(visitingNode.value);
        for (const neighbor of neighborFunction(visitingNode)) {
          if (!visitedIds.includes(neighbor.id)) {
            toVisit.unshift(neighbor);
            visitedIds.push(neighbor.id);
          }
        }
      };
      while (toVisit.length > 0) {
        const current = toVisit.pop();
        if (current) {
          yield yieldFunc(current);
          visit(current);
        }
      }
    }
  }

  nodes: INode<t>[] = [];
  links: ILink[] = [];
}
