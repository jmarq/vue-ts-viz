export class GraphNode<t> {
  constructor(id: string, val: t, neighborIds: string[] = []) {
    this.value = val;
    this.id = id;
    this.neighborIds = neighborIds;
  }

  id: string;
  value: t;
  neighborIds: string[];
  neighbors: GraphNode<t>[] = [];
}

export default class Graph<t> {
  constructor(nodes: GraphNode<t>[]) {
    this.nodes = nodes;
    for (const node of this.nodes) {
      this.assignNeighborNodes(node);
    }
  }

  assignNeighborNodes(node: GraphNode<t>) {
    node.neighbors = [];
    for (const neighborId of node.neighborIds) {
      const matchingNode: GraphNode<t> | undefined = this.nodes.find(
        (n) => n.id === neighborId
      );
      if (matchingNode) {
        node.neighbors.push(matchingNode);
      }
    }
  }

  get nodeIds(): string[] {
    return this.nodes.map((n) => n.id);
  }

  get adjacencyList(): object {
    const result: { [index: string]: string[] } = {};
    for (const node of this.nodes) {
      result[node.id] = node.neighborIds;
    }
    return result;
  }

  dfs(nodeId: string, visitedIds: string[] = []): t[] {
    let results: t[] = [];
    const startNode = this.nodes.find((n) => n.id === nodeId);
    if (startNode) {
      visitedIds.push(startNode.id);
      results.push(startNode.value);
      for (const neighborId of startNode.neighborIds) {
        if (!visitedIds.includes(neighborId)) {
          results = [...results, ...this.dfs(neighborId, visitedIds)];
        }
      }
    }
    return results;
  }

  dfsStack(nodeId: string): t[] {
    const results: t[] = [];
    const startNode = this.nodes.find((n) => n.id === nodeId);
    if (startNode) {
      const visitedIds: string[] = [startNode.id];
      const toVisit = [startNode];
      while (toVisit.length > 0) {
        const currentNode = toVisit.pop();
        if (currentNode) {
          results.push(currentNode.value);
          for (const neighbor of currentNode.neighbors.reverse()) {
            if (!visitedIds.includes(neighbor.id)) {
              toVisit.push(neighbor);
              visitedIds.push(neighbor.id);
            }
          }
        }
      }
    }
    return results;
  }

  *dfsGenerator(
    nodeId: string,
    yieldFunc = (node: GraphNode<t>) => node.value as any
  ) {
    // const results: t[] = [];
    const startNode = this.nodes.find((n) => n.id === nodeId);
    if (startNode) {
      const visitedIds: string[] = [startNode.id];
      const toVisit = [startNode];
      while (toVisit.length > 0) {
        const currentNode = toVisit.pop();
        if (currentNode) {
          // results.push(currentNode.value);
          yield yieldFunc(currentNode);
          for (const neighbor of currentNode.neighbors.reverse()) {
            if (!visitedIds.includes(neighbor.id)) {
              toVisit.push(neighbor);
              visitedIds.push(neighbor.id);
            }
          }
        }
      }
    } else {
      // yield undefined;
    }
    // return results;
  }

  bfs(nodeId: string): t[] {
    const results: t[] = [];
    const startNode = this.nodes.find((n) => n.id === nodeId);
    if (startNode) {
      const toVisit = [startNode];
      const visitedIds: string[] = [startNode.id];
      const visit = (visitingNode: GraphNode<t>) => {
        results.push(visitingNode.value);
        for (const neighbor of visitingNode.neighbors) {
          if (!visitedIds.includes(neighbor.id)) {
            toVisit.unshift(neighbor);
            visitedIds.push(neighbor.id);
          }
        }
      };
      while (toVisit.length > 0) {
        const current = toVisit.pop();
        if (current) {
          visit(current);
        }
      }
    }
    return results;
  }

  *bfsGenerator(
    nodeId: string,
    yieldFunc = (node: GraphNode<t>) => node.value as any
  ) {
    // const results: t[] = [];
    const startNode = this.nodes.find((n) => n.id === nodeId);
    if (startNode) {
      const toVisit = [startNode];
      const visitedIds: string[] = [startNode.id];
      const visit = (visitingNode: GraphNode<t>) => {
        // results.push(visitingNode.value);
        for (const neighbor of visitingNode.neighbors) {
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
    } else {
      // yield undefined;
    }
    // return results;
  }

  nodes: GraphNode<t>[] = [];
}
