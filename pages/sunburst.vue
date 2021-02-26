<template>
  <div>
    <button @click="increaseFirstChild">+1</button>
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
              increaseNode(node)
            }
          "
        />
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { arc } from 'd3-shape'
import { hierarchy, partition } from 'd3-hierarchy'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { color as d3Color } from 'd3-color'

// console.log(d3)
// const arc = d3.arc
const sunburstArcGenerator = arc()
  .startAngle((d) => d.x0)
  .endAngle((d) => d.x1)
  .innerRadius((d) => d.y0)
  .outerRadius((d) => d.y1)

const colors = schemeCategory10

export default {
  data() {
    return {
      sunburstData: {
        name: 'root',
        children: [
          {
            value: 2,
          },
          {
            name: 'child1',
            children: [
              { name: 'gc1', value: 1 },
              {
                name: 'gc2',
                children: [
                  { value: 2 },
                  { children: [{ value: 1 }, { value: 1 }] },
                ],
              },
            ],
          },
          {
            name: 'child2',
            children: [
              { name: 'gc3', value: 2 },
              { name: 'gc4', value: 1 },
            ],
          },
        ],
      },
    }
  },
  computed: {
    root() {
      console.log('computing root')
      let hierarchyRoot = hierarchy(this.sunburstData)
      hierarchyRoot.sum((d) => d.value)
      hierarchyRoot = partition().size([2 * Math.PI, 500])(hierarchyRoot)
      console.log(hierarchyRoot.descendants())
      if (colors) {
        hierarchyRoot.children.forEach((node, i) => {
          console.log(node)
          node.color = colors[i]
        })
        hierarchyRoot.color = 'white'
      }
      return hierarchyRoot
    },
  },
  methods: {
    sunburstArcGenerator,
    nodeColor(node): string {
      if (node.color) {
        return node.color || 'black'
      } else if (node.parent) {
        return (
          '' +
          d3Color(this.nodeColor(node.parent) || 'black').brighter(
            0.25 * node.depth
          )
        )
      } else {
        return 'black'
      }
    },
    increaseFirstChild() {
      console.log('increasing')
      if (
        this.sunburstData &&
        this.sunburstData.children &&
        this.sunburstData.children.length > 0 &&
        this.sunburstData.children[0].value
      )
        this.sunburstData.children[0].value += 3
    },
    increaseNode(node) {
      // this is flawed because it increments the computed node, not the source data.
      // seems like it'd need to be able to hook into a specific child in sunburstData by id/path or something
      // No! actually you can get to the underlying data using node.data, which is still observed by Vue, it seems.
      console.log('increasing node?')
      console.log(node)
      if (!node.data.children) {
        if (node.data.value) {
          node.data.value += 1
        } else {
          node.data.value = 1
        }
      }
    },
  },
}
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
