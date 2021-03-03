<template>
  <div>
    <p>
      How would you design a stack which, in addition to push and pop, has a
      function "min" which returns the minimum element? Push, pop, and min
      should all operate in O(1) time.
    </p>
    <p>perhaps by using two stacks?</p>
    <button :disabled="stack.length >= 10" @click="pushOne">
      push random value
    </button>
    <button @click="popOne">pop</button>
    <p>current min: {{ stack.min && stack.min.value }}</p>
    <div class="viz-wrapper">
      <svg
        width="50px"
        height="500px"
        viewBox="0 0 50 500"
        overflow="visible"
        preserveAspectRatio="none"
      >
        <transition-group name="stack" tag="g" class="group">
          <g v-for="(node, i) in stack.items" :key="node.id">
            <g
              :transform="`translate(0,${
                500 - squareHeight * (stack.length - i)
              })`"
            >
              <rect
                :fill="node.color"
                :y="0"
                x="0"
                :width="squareHeight"
                :height="squareHeight"
              ></rect>
              <text x="16" y="32">{{ node.value }}</text>
            </g>
          </g>
        </transition-group>
      </svg>
      <svg
        width="50px"
        height="500px"
        viewBox="0 0 50 500"
        overflow="visible"
        preserveAspectRatio="none"
      >
        <transition-group name="stack" tag="g">
          <g v-for="(node, i) in stack.minStack.items" :key="node.id">
            <g
              :transform="`translate(0,${
                500 - squareHeight * (stack.minStack.length - i)
              })`"
            >
              <rect
                :fill="node.color"
                :y="0"
                x="0"
                :width="squareHeight"
                :height="squareHeight"
              ></rect>
              <text x="16" y="32">{{ node.value }}</text>
            </g>
          </g>
        </transition-group>
      </svg>
      <ul>
        <p>nodes</p>
        <li
          v-for="(node, i) in stack.items"
          :key="node.id"
          :style="{ color: node.color }"
        >
          {{ stack.length - i }}-{{ node.value }}
        </li>
      </ul>
      <ul>
        <p>stack of minimum values</p>

        <li
          v-for="node in stack.minStack.items"
          :key="node.id"
          :style="{ color: node.color }"
        >
          {{ node.value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { interpolateSpectral } from 'd3-scale-chromatic';
import { MinStack } from '@/helpers/dataStructures/stack';

interface VizNode {
  value: number;
  id: string | number;
  color: string;
}

const dumbId = () => '' + Math.floor(Math.random() * 1000000);
const dumbNum = () => Math.floor(Math.random() * 100);

export default Vue.extend({
  data() {
    const myStack = new MinStack<VizNode>((n) => n.value);
    return {
      stack: myStack,
      squareHeight: 50,
    };
  },
  methods: {
    pushOne() {
      this.stack.push({
        value: dumbNum(),
        id: dumbId(),
        color: interpolateSpectral(Math.random()),
      });
    },
    popOne(): VizNode | null {
      return this.stack.pop();
    },
  },
});
</script>

<style scoped>
.viz-wrapper {
  display: flex;
}
p {
  font-size: 1.25rem;
}

button {
  font-size: 16px;
  padding: 10px;
}

ul {
  background-color: #222;
}

ul p {
  color: #ddd;
}

svg {
  border: 1px solid cornflowerblue;
}

.stack-enter-active,
.stack-leave-active {
  transition: 300ms linear;
}
.stack-leave-to {
  transform: translate(0, -500px);
}
.stack-enter {
  transform: translate(0, -500px);
}
</style>
