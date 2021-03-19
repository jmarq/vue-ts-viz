<template>
  <div class="page-wrapper">
    <h1>graph traversal</h1>
    <button @click="dfs">depth first search</button>
    <button @click="bfs">breadth first search</button>
    <button @click="addNode">add a node</button>

    <div>
      <svg width="500px" height="500px" viewBox="0 0 500 500">
        <line
          v-for="link in d3Graph.links"
          :key="`${link.source.id}->${link.target.id}`"
          stroke="black"
          stroke-width="1"
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
import { v4 as uuid } from 'uuid';
import Graph, { INode, ILink } from '@/helpers/dataStructures/graph2';
import sample from 'lodash/sample';
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
const myNodes: INode<number>[] = [
  { id: '1', value: 1 },
  { id: '2', value: 2 },
  { id: '3', value: 3 },
];
const myLinks: ILink[] = [
  { sourceId: '1', targetId: '2' },
  { sourceId: '2', targetId: '3' },
  { sourceId: '3', targetId: '1' },
];

const myGraph = new Graph<number>(myNodes, myLinks);

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
  return {
    nodes: graph.nodes.map((n) => ({
      id: n.id,
    })),
    links: graph.links.map((l) => ({ source: l.sourceId, target: l.targetId })),
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
        .force('charge', forceManyBody().strength(-50))
        .force('center', forceCenter(width / 2, height / 2).strength(1));
      simulation.stop();
      simulation.tick(5000);
      console.log(result);
      return result;
    },
  },
  methods: {
    addNode() {
      const newId = uuid();
      const existingIds = this.graph.nodes.map((n) => n.id);
      const randomId = sample(existingIds);
      const newLink = {
        sourceId: randomId,
        targetId: newId,
      };
      Vue.set(this.graph, 'nodes', [
        ...this.graph.nodes,
        { id: newId, value: 1 },
      ]);
      Vue.set(this.graph, 'links', [...this.graph.links, newLink]);
    },
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
