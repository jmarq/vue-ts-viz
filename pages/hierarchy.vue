<template>
  <div>
    <h1>hierarchy layouts</h1>
    <div class="instruction">
      <p>
        Sunburst, Icicle, Circle Packing, and Treemap charts based on shared
        data. Click on a segment to increase its value in the underlying
        dataset.
      </p>
      <div>
        <button @click="randomIncrease">random increase</button>
        <button @click="randomNewChild">random new child</button>
        <button @click="randomChange">random change</button>
      </div>
    </div>
    <svg width="45vw" height="40vh" viewBox="0 0 1000 1000">
      <g transform="translate(500, 500)">
        <path
          v-for="(node, i) in partitionRoot.descendants()"
          :key="i"
          :class="{ selected: selectedNode && node.data == selectedNode.data }"
          :d="sunburstArcGenerator(node)"
          :fill="nodeColor(node)"
          stroke="black"
          stroke-width="2"
          @click="
            () => {
              increaseNode(node);
              selectNode(node);
            }
          "
        />
      </g>
    </svg>
    <svg width="45vw" height="40vh" viewBox="0 0 1000 1000">
      <g transform="translate(0, 0)">
        <rect
          v-for="(node, i) in partitionRoot.descendants()"
          :key="i"
          :class="{ selected: selectedNode && node.data == selectedNode.data }"
          :x="node.x0 * 1000"
          :y="node.y0 * 1000"
          :width="node.x1 * 1000 - node.x0 * 1000"
          :height="node.y1 * 1000 - node.y0 * 1000"
          :fill="nodeColor(node)"
          stroke="black"
          stroke-width="2"
          @click="
            () => {
              increaseNode(node);
              selectNode(node);
            }
          "
        />
      </g>
    </svg>
    <svg width="45vw" height="40vh" viewBox="0 0 1000 1000">
      <g transform="translate(0, 0)">
        <circle
          v-for="(node, i) in packRoot.descendants()"
          :key="i"
          :class="{ selected: selectedNode && node.data == selectedNode.data }"
          :fill="nodeColor(node)"
          stroke="black"
          stroke-width="2"
          :cx="node.x"
          :cy="node.y"
          :r="node.r"
          @click="
            () => {
              increaseNode(node);
              selectNode(node);
            }
          "
        />
      </g>
    </svg>
    <svg width="45vw" height="40vh" viewBox="0 0 1000 1000">
      <g transform="translate(0, 0)">
        <rect
          v-for="(node, i) in treemapRoot.descendants()"
          :key="i"
          :class="{ selected: selectedNode && node.data == selectedNode.data }"
          :x="node.x0"
          :y="node.y0"
          :width="node.x1 - node.x0"
          :height="node.y1 - node.y0"
          :fill="nodeColor(node)"
          stroke="black"
          stroke-width="2"
          @click="
            () => {
              increaseNode(node);
              selectNode(node);
            }
          "
        />
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { arc } from 'd3-shape';
import Vue from 'vue';
import {
  hierarchy as d3Hierarchy,
  partition as d3Partition,
  pack as d3Pack,
  treemap as d3Treemap,
  HierarchyRectangularNode,
  HierarchyCircularNode,
  HierarchyNode,
} from 'd3-hierarchy';
import { shuffle as d3Shuffle } from 'd3-array';
import { schemeDark2 } from 'd3-scale-chromatic';
import { color as d3Color } from 'd3-color';

export interface HierarchicalNode {
  children?: HierarchicalNode[];
  value: number;
  name?: string;
}

export interface ColoredNode {
  color?: string;
}

export interface ColoredHierarchyNode
  extends HierarchyNode<HierarchicalNode>,
    ColoredNode {}

export interface ColoredPartitionNode
  extends HierarchyRectangularNode<HierarchicalNode>,
    ColoredNode {}

export interface ColoredCircularNode
  extends HierarchyCircularNode<HierarchicalNode>,
    ColoredNode {}

const chartSpaceHeight = 1000;

const sunburstArcGenerator = arc<ColoredPartitionNode>()
  .startAngle((d) => d.x0 * Math.PI * 2)
  .endAngle((d) => d.x1 * Math.PI * 2)
  .innerRadius((d) => d.y0 * 0.5 * chartSpaceHeight)
  .outerRadius((d) => d.y1 * 0.5 * chartSpaceHeight);

const colors = schemeDark2;

export default {
  data() {
    return {
      selectedNode: undefined as
        | ColoredPartitionNode
        | ColoredHierarchyNode
        | undefined,
      hierarchyData: {
        name: 'root',
        value: 0,
        children: [
          {
            value: 2,
          },
          {
            name: 'child1',
            value: 0,
            children: [
              { name: 'gc1', value: 1 },
              {
                name: 'gc2',
                value: 0,
                children: [
                  { value: 2 },
                  { value: 0, children: [{ value: 1 }, { value: 1 }] },
                ],
              },
            ],
          },
          {
            name: 'child2',
            value: 0,
            children: [
              { name: 'gc3', value: 2 },
              { name: 'gc4', value: 1 },
            ],
          },
        ],
      },
    };
  },
  computed: {
    hierarchy() {
      console.log('computing hierarchy');
      const hierarchyRoot: ColoredHierarchyNode = d3Hierarchy<HierarchicalNode>(
        this.hierarchyData as HierarchicalNode
      );
      hierarchyRoot.sum((d) => d.value || 0);
      hierarchyRoot.children &&
        hierarchyRoot.children.forEach((node, i) => {
          node.color = colors[i];
        });
      hierarchyRoot.color = '#ccc';
      console.log(hierarchyRoot.descendants());
      return hierarchyRoot;
    },
    partitionRoot() {
      console.log('computing partition');
      const partitionRoot: ColoredPartitionNode = d3Partition<HierarchicalNode>().size(
        [1, 1]
      )(this.hierarchy);
      return partitionRoot;
    },
    packRoot() {
      console.log('computing packed layout');
      const packer = d3Pack<HierarchicalNode>().size([1000, 1000]).padding(3);
      const packed: ColoredCircularNode = packer(this.hierarchy);
      console.log({ packed });
      return packed;
    },
    treemapRoot() {
      console.log('computing treemap layout');
      const mapper = d3Treemap<HierarchicalNode>().size([1000, 1000]);
      const mapped: ColoredPartitionNode = mapper(this.hierarchy);
      console.log({ mapped });
      return mapped;
    },
  },
  methods: {
    sunburstArcGenerator,
    nodeColor(node: ColoredHierarchyNode): string {
      if (node.color) {
        return node.color;
      } else if (node.parent) {
        const parentColor = d3Color(this.nodeColor(node.parent));
        if (parentColor) {
          return '' + parentColor.brighter(0.2 * node.depth);
        } else {
          return 'black';
        }
      } else {
        return 'black';
      }
    },
    increaseNode(node: ColoredPartitionNode | ColoredHierarchyNode) {
      node.data.value += 1;
    },
    selectNode(node: ColoredPartitionNode | ColoredHierarchyNode) {
      this.selectedNode = node;
    },
    randomIncrease() {
      const nodes: ColoredHierarchyNode[] = [...this.hierarchy.descendants()];
      const shuffled = d3Shuffle(nodes);
      const nodeToIncrease = shuffled[0];
      nodeToIncrease.data.value += Math.random() * 5;
      this.selectedNode = nodeToIncrease;
    },
    randomNewChild() {
      const nodes: ColoredHierarchyNode[] = [...this.hierarchy.descendants()];
      const shuffled = d3Shuffle(nodes);
      const nodeToAddChildTo = shuffled[0].data;
      const newChild: HierarchicalNode = {
        value: 1,
        children: [],
      };
      if (nodeToAddChildTo.children) {
        nodeToAddChildTo.children.push(newChild);
      } else {
        Vue.set(nodeToAddChildTo, 'children', [newChild]);
      }
      this.selectedNode = shuffled[0];
    },
    randomChange() {
      if (Math.random() >= 0.5) {
        this.randomIncrease();
      } else {
        this.randomNewChild();
      }
    },
  },
};
</script>

<style scoped>
svg {
  border: 0px solid #444 inset;
  user-select: none;
}

g {
  fill: black;
}

h1 {
  margin-bottom: 10px;
}
p {
  margin-bottom: 10px;
}
button {
  font-size: 1em;
  padding: 10px;
}

path,
rect,
circle {
  transition: 175ms linear;
}

path:hover,
rect:hover,
circle:hover {
  stroke: cornflowerblue;
  fill: #444;
}

.selected {
  fill: #444;
}

.instruction {
  /* position: absolute; */
}
</style>
