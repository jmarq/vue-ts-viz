<template>
  <div>
    <p class="instruction">
      Sunburst and Icicle charts based on shared data. Click on a segment to
      increase its value in the underlying dataset.
    </p>
    <svg width="45%" height="99vh" viewBox="0 0 1000 1000">
      <g transform="translate(500, 500)">
        <path
          v-for="(node, i) in root.descendants()"
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
    <svg width="45%" height="99vh" viewBox="0 0 1000 1000">
      <g transform="translate(0, 0)">
        <rect
          v-for="(node, i) in root.descendants()"
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
  </div>
</template>

<script lang="ts">
import { arc } from 'd3-shape';
import { hierarchy, partition, HierarchyRectangularNode } from 'd3-hierarchy';
import { schemeDark2 } from 'd3-scale-chromatic';
import { color as d3Color } from 'd3-color';

export interface SunburstNode {
  children?: SunburstNode[];
  value: number;
  name?: string;
}
export interface ColoredHierarchyNode
  extends HierarchyRectangularNode<SunburstNode> {
  color?: string;
}

const chartSpaceHeight = 1000;

const sunburstArcGenerator = arc<ColoredHierarchyNode>()
  .startAngle((d) => d.x0 * Math.PI * 2)
  .endAngle((d) => d.x1 * Math.PI * 2)
  .innerRadius((d) => d.y0 * 0.5 * chartSpaceHeight)
  .outerRadius((d) => d.y1 * 0.5 * chartSpaceHeight);

const colors = schemeDark2;

export default {
  data() {
    return {
      selectedNode: undefined as ColoredHierarchyNode | undefined,
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
        [1, 1]
      )(hierarchyRootUnPartitioned);

      // colorize first level of children, so their descendents can inherit the hue.
      hierarchyRoot.children &&
        hierarchyRoot.children.forEach((node, i) => {
          node.color = colors[i];
        });
      hierarchyRoot.color = '#ccc';
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
          return '' + parentColor.brighter(0.3 * node.depth);
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
    selectNode(node: ColoredHierarchyNode) {
      this.selectedNode = node;
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
path,
rect {
  transition: 175ms linear;
}
path:hover,
rect:hover {
  stroke: cornflowerblue;
  fill: #444;
}

.selected {
  fill: #444;
}

.instruction {
  position: absolute;
}
</style>
