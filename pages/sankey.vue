<template>
  <div>
    <h1>sankey diagram</h1>
    <svg
      width="100%"
      height="90vh"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
    >
      <rect
        v-for="node in sankey.nodes"
        :key="node.id"
        :x="node.x0"
        :y="node.y0"
        :width="node.x1 - node.x0"
        :height="node.y1 - node.y0"
      ></rect>
      <path
        v-for="link in sankey.links"
        :key="'' + link.to + '-' + link.from"
        class="link"
        :d="sankeyLinkHorizontal(link)"
        :stroke-width="link.width"
      ></path>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  sankey as d3Sankey,
  sankeyLinkHorizontal,
  // sankeyLeft,
} from 'd3-sankey';

const sankeyData = {
  nodes: [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
  ],
  links: [
    { source: 1, target: 2, value: 2 },
    { source: 1, target: 6, value: 2 },

    { source: 3, target: 2, value: 1 },
    { source: 4, target: 2, value: 1 },
    { source: 4, target: 5, value: 1 },
    { source: 2, target: 5, value: 1 },
    { source: 5, target: 7, value: 1 },
  ],
};

const sankeyGenerator = d3Sankey<{ id: number }, {}>()
  .nodeId((d) => d.id)
  .nodePadding(30)
  // .nodeAlign(sankeyLeft)
  .size([1000, 1000]);

const sankey = sankeyGenerator(sankeyData);

export default Vue.extend({
  data() {
    return {
      sankey,
    };
  },
  methods: {
    sankeyLinkHorizontal: sankeyLinkHorizontal(),
  },
});
</script>

<style scoped>
svg {
  border: 1px solid cornflowerblue;
  background-color: #dfd;
}

.link {
  stroke: rgba(56, 19, 116, 0.5);
  fill: none;
}

.link:hover {
  stroke: rgba(224, 8, 134, 0.7);
}

rect:hover {
  fill: rgba(195, 76, 6, 0.7);
}
</style>
