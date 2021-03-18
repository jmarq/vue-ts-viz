<template>
  <div class="page-wrapper">
    <button @click="dfs">depth first search</button>
    <ul>
      <li v-for="node in graph.nodes" :key="node.id">{{ node.value }}</li>
    </ul>
    <ul>
      <li v-for="node in visitedNodes" :key="node">{{ node }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Graph, { GraphNode } from '@/helpers/dataStructures/graph';

const myNodes = [
  new GraphNode<number>('1', 1, ['2', '4']),
  // 1 --> 2 --> 1 cycle
  new GraphNode<number>('2', 2, ['3', '1']),
  new GraphNode<number>('3', 3, []),
  new GraphNode<number>('4', 4, []),
];

const myGraph = new Graph<number>(myNodes);
export default Vue.extend({
  data() {
    return {
      graph: myGraph,
      visitedNodes: [] as number[],
    };
  },
  methods: {
    async dfs() {
      const msBetweenVisits = 500;
      this.visitedNodes = [];
      const generator = this.graph.dfsGenerator(
        '1',
        (node) => '' + node.id + '-' + node.value
      );
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

<style scoped></style>
