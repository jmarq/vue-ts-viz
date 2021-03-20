<template>
  <div class="page-wrapper">
    <h1>graph traversal</h1>
    <button @click="dfs">depth first search</button>
    <button @click="bfs">breadth first search</button>
    <button @click="bothSearches">both searches</button>
    <button @click="addNode">add a node</button>
    <button @click="addNodes">add five nodes</button>

    <div>
      <svg
        :width="`${graphWidth / 1.5}px`"
        :height="`${graphHeight / 1.5}px`"
        :viewBox="`0 0 ${graphWidth} ${graphHeight}`"
      >
        <line
          v-for="link in d3Graph.links"
          :key="`${link.source.id}->${link.target.id}`"
          :stroke="bfsVisitedNodes.includes(link.source.id) ? '#822' : '#aaa'"
          stroke-width="2"
          :x1="link.source.x"
          :y1="link.source.y"
          :x2="link.target.x"
          :y2="link.target.y"
        ></line>
        <circle
          v-for="node in d3Graph.nodes"
          :key="node.id"
          r="8"
          :cx="node.x"
          :cy="node.y"
          :fill="bfsVisitedNodes.includes(node.id) ? '#f20' : '#238'"
        ></circle>
      </svg>
      <svg
        :width="`${graphWidth / 1.5}px`"
        :height="`${graphHeight / 1.5}px`"
        :viewBox="`0 0 ${graphWidth} ${graphHeight}`"
      >
        <line
          v-for="link in d3Graph.links"
          :key="`${link.source.id}->${link.target.id}`"
          :stroke="dfsVisitedNodes.includes(link.source.id) ? '#822' : '#aaa'"
          stroke-width="2"
          :x1="link.source.x"
          :y1="link.source.y"
          :x2="link.target.x"
          :y2="link.target.y"
        ></line>
        <circle
          v-for="node in d3Graph.nodes"
          :key="node.id"
          r="8"
          :cx="node.x"
          :cy="node.y"
          :fill="dfsVisitedNodes.includes(node.id) ? '#f20' : '#238'"
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

const generateNode = (): INode<number> => {
  const newId = uuid();
  const newValue = Math.floor(Math.random() * 100);
  return {
    id: newId,
    value: newValue,
  };
};

const generateLinkedNode = (
  graph: Graph<number>
): { node: INode<number>; link: ILink } => {
  const newNode = generateNode();
  const existingIds = graph.nodes.map((n) => n.id);
  const randomId = sample(existingIds) || '';
  const newLink = {
    sourceId: randomId,
    targetId: newNode.id,
  };
  return {
    node: newNode,
    link: newLink,
  };
};

const myNodes: INode<number>[] = [{ id: '1', value: 1 }];
const myLinks: ILink[] = [];

const myGraph = new Graph<number>(myNodes, myLinks);

export default Vue.extend({
  data() {
    return {
      graph: myGraph,
      visitedNodes: [] as number[],
      bfsVisitedNodes: [] as number[],
      dfsVisitedNodes: [] as number[],
      graphWidth: 1000,
      graphHeight: 700,
      msBetweenVisits: 150,
      currentRun: '',
      currentBfsRun: '',
      currentDfsRun: '',
    };
  },
  computed: {
    d3Graph() {
      const result = toD3GraphShape(this.graph);
      const simulation = forceSimulation(result.nodes as SimulationNodeDatum[])
        .force(
          'link',
          forceLink(result.links as SimulationLinkDatum<SimulationNodeDatum>[])
            .id((d) => d.id)
            .distance(35)
            .strength(2)
        )
        .force('charge', forceManyBody().strength(-50))
        .force(
          'center',
          forceCenter(this.graphWidth / 2, this.graphHeight / 2).strength(1)
        );
      simulation.stop();
      simulation.tick(100);
      return result;
    },
  },
  methods: {
    addNode() {
      const newNode = generateLinkedNode(this.graph);
      Vue.set(this.graph, 'nodes', [...this.graph.nodes, newNode.node]);
      Vue.set(this.graph, 'links', [...this.graph.links, newNode.link]);
    },
    addNodes() {
      for (let i = 0; i < 5; i += 1) {
        this.addNode();
      }
    },
    bothSearches() {
      this.dfs();
      this.bfs();
    },
    async dfs() {
      const runId = uuid();
      this.currentDfsRun = runId;
      this.dfsVisitedNodes = [];
      const generator = this.graph.dfsGenerator('1', (node) => node.id);
      for (const nodeValue of generator) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.msBetweenVisits)
        );
        if (this.currentDfsRun === runId) {
          if (nodeValue) {
            this.dfsVisitedNodes = [...this.dfsVisitedNodes, nodeValue];
          }
        } else {
          break;
        }
      }
    },
    async bfs() {
      const runId = uuid();
      this.currentBfsRun = runId;
      this.bfsVisitedNodes = [];
      const generator = this.graph.bfsGenerator('1', (node) => node.id);
      for (const nodeValue of generator) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.msBetweenVisits)
        );
        if (this.currentBfsRun === runId) {
          if (nodeValue) {
            this.bfsVisitedNodes = [...this.bfsVisitedNodes, nodeValue];
          }
        } else {
          break;
        }
      }
    },
  },
});
</script>

<style scoped>
svg {
  border: 1px solid #222;
}

circle {
  transition: 300ms linear fill;
}

line {
  transition: 300ms linear;
}
</style>
