<template>
  <div class="page-wrapper">
    <h1>graph traversal</h1>
    <button @click="dfs">depth first search</button>
    <button @click="bfs">breadth first search</button>
    <div>
      <svg width="500px" height="500px" viewBox="0 0 500 500">
        <line
          v-for="link in d3Graph.links"
          :key="`${link.source.id}->${link.target.id}`"
          stroke="black"
          stroke-width="2"
          :x1="link.source.x"
          :y1="link.source.y"
          :x2="link.target.x"
          :y2="link.target.y"
        ></line>
        <circle
          v-for="node in d3Graph.nodes"
          :key="node.id"
          r="5"
          :cx="node.x"
          :cy="node.y"
          :fill="visitedNodes.includes(node.id) ? 'red' : 'black'"
        ></circle>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Graph, { GraphNode } from '@/helpers/dataStructures/graph';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  SimulationNodeDatum,
  SimulationLinkDatum,
} from 'd3-force';

// hmmm is this constructor making things more difficult than it needs to?
// do I need to declare the links as part of the nodes themselves?
// maybe nodes and links could be declared separately, and passed in and managed by the Graph
const myNodes = [
  new GraphNode<number>('1', 1, ['2', '4']),
  // 1 --> 2 --> 1 cycle
  new GraphNode<number>('2', 2, ['3', '8']),
  new GraphNode<number>('3', 3, ['5']),
  new GraphNode<number>('4', 4, ['8']),
  new GraphNode<number>('5', 5, []),
  new GraphNode<number>('6', 6, ['7', '9']),
  new GraphNode<number>('7', 7, []),
  new GraphNode<number>('8', 8, ['6']),
  new GraphNode<number>('9', 9, []),
];

const myGraph = new Graph<number>(myNodes);

interface D3Node {
  id: string;
}
interface D3Link {
  source: string;
  target: string;
}
interface D3GraphShape {
  nodes: D3Node[];
  links: D3Link[];
}

const toD3GraphShape = (graph: Graph<any>): D3GraphShape => {
  const nodes = graph.nodes.map((node) => ({
    id: node.id,
    value: node.value,
  }));
  const links = [];
  for (const node of graph.nodes) {
    for (const neighborId of node.neighborIds) {
      links.push({
        source: node.id,
        target: neighborId,
      });
    }
  }
  return {
    nodes,
    links,
  };
};

export default Vue.extend({
  data() {
    return {
      graph: myGraph,
      visitedNodes: [] as number[],
    };
  },
  computed: {
    d3Graph() {
      const width = 500;
      const height = 500;
      const result = toD3GraphShape(this.graph);
      const simulation = forceSimulation(result.nodes as SimulationNodeDatum[])
        .force(
          'link',
          forceLink(
            result.links as SimulationLinkDatum<SimulationNodeDatum>[]
          ).id((d) => d.id)
        )
        .force('charge', forceManyBody())
        .force('center', forceCenter(width / 2, height / 2));
      simulation.stop();
      simulation.tick(500);
      console.log(result);
      return result;
    },
  },
  methods: {
    async dfs() {
      const msBetweenVisits = 125;
      this.visitedNodes = [];
      const generator = this.graph.dfsGenerator('1', (node) => node.id);
      for (const nodeValue of generator) {
        await new Promise((resolve) => setTimeout(resolve, msBetweenVisits));
        if (nodeValue) {
          this.visitedNodes = [...this.visitedNodes, nodeValue];
        }
      }
    },
    async bfs() {
      const msBetweenVisits = 125;
      this.visitedNodes = [];
      const generator = this.graph.bfsGenerator('1', (node) => node.id);
      for (const nodeValue of generator) {
        await new Promise((resolve) => setTimeout(resolve, msBetweenVisits));
        if (nodeValue) {
          this.visitedNodes = [...this.visitedNodes, nodeValue];
        }
      }
    },
  },
});
</script>

<style scoped>
svg {
  border: 1px solid red;
}
</style>
