<template>
  <div>
    <p>click on a segment to increase its value</p>
    <svg width="100%" height="100vh" viewBox="0 0 1000 1000">
      <g transform="translate(500, 500)">
        <path
          v-for="(node, i) in root.descendants()"
          :key="i"
          :d="sunburstArcGenerator(node)"
          :fill="nodeColor(node)"
          stroke="black"
          @click="
            () => {
              increaseNode(node);
            }
          "
        />
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { arc } from 'd3-shape';
import { hierarchy, partition, HierarchyRectangularNode } from 'd3-hierarchy';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { color as d3Color } from 'd3-color';

export interface SunburstNode {
  // color?: string
  children?: SunburstNode[];
  value: number;
  name?: string;
}
export interface ColoredHierarchyNode
  extends HierarchyRectangularNode<SunburstNode> {
  color?: string;
}

// console.log(d3)
// const arc = d3.arc
const sunburstArcGenerator = arc<ColoredHierarchyNode>()
  .startAngle((d) => d.x0)
  .endAngle((d) => d.x1)
  .innerRadius((d) => d.y0)
  .outerRadius((d) => d.y1);

const colors = schemeCategory10;

export default {
  data() {
    return {
      sunburstData: {
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
    root() {
      console.log('computing root');
      const hierarchyRootUnPartitioned = hierarchy<SunburstNode>(
        this.sunburstData as SunburstNode
      );
      hierarchyRootUnPartitioned.sum((d) => d.value || 0);
      const hierarchyRoot: ColoredHierarchyNode = partition<SunburstNode>().size(
        [2 * Math.PI, 500]
      )(hierarchyRootUnPartitioned);
      if (colors) {
        hierarchyRoot.children &&
          hierarchyRoot.children.forEach((node, i) => {
            node.color = colors[i];
          });
        hierarchyRoot.color = 'white';
      }
      return hierarchyRoot;
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
          return '' + parentColor.brighter(0.25 * node.depth);
        } else {
          return 'black';
        }
      } else {
        return 'black';
      }
    },
    increaseNode(node: ColoredHierarchyNode) {
      node.data.value += 1;
    },
  },
};
</script>

<style scoped>
svg {
  border: 1px solid #444;
}
g {
  fill: black;
}
path {
  transition: 175ms linear;
}
path:hover {
  fill: #444;
}
</style>
