<template>
  <div>
    <h1>bubble sort</h1>
    <p>
      an attempt at visualizing the classically inefficient bubble sort
      algorithm
    </p>
    <!-- <p><button @click="swap(3, 4)">swap</button></p>
    <p><button @click="multiSwap">multiSwap?</button></p> -->
    <p><button @click="bubbleSort">sort</button></p>
    <p>
      <label for="speed">
        slowness
        <input
          id="speed"
          v-model.number="delay"
          type="range"
          min="100"
          max="1000"
          step="100"
        />
      </label>
    </p>

    <svg
      width="1000px"
      height="120px"
      viewBox="0 0 500 60"
      preserveAspectRatio="none"
      overflow="visible"
    >
      <transition-group name="list" tag="g">
        <g v-for="(item, i) in list" :key="item.id">
          <g
            class="positioned-group"
            :transform="`translate(${squareHeight * i},0)`"
          >
            <rect
              :fill="item.color"
              :y="0"
              x="0"
              :width="squareHeight"
              :height="squareHeight"
            ></rect>
            <text x="16" y="32">
              {{ item.value }}
            </text>
          </g>
        </g>
      </transition-group>
      <circle
        :cy="squareHeight + 5"
        :cx="squareHeight * current + squareHeight / 2"
        :r="5"
        fill="red"
      ></circle>
      <circle
        :cy="squareHeight + 5"
        :cx="squareHeight * comparingWith + squareHeight / 2"
        :r="5"
        fill="green"
      ></circle>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { interpolateSpectral } from 'd3-scale-chromatic';
import { scaleLinear } from 'd3-scale';

interface VizNode {
  value: number;
  id: string | number;
  color: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const dumbId = () => '' + Math.floor(Math.random() * 1000000);
const dumbNum = () => Math.floor(Math.random() * 100);
const colorValueScale = scaleLinear().domain([0, 100]).range([0, 1]);
export const newNode = (): VizNode => {
  const value = dumbNum();
  return {
    value,
    id: dumbId(),
    color: interpolateSpectral(colorValueScale(value)),
  };
};

export default Vue.extend({
  data() {
    console.log('doin data');
    // const myData: VizNode[] = [];
    // for (let i = 0; i < 10; i += 1) {
    //   myData.push(newNode());
    // }
    return {
      // list: myData,
      list: [] as VizNode[],
      squareHeight: 50,
      current: 0,
      delay: 300,
    };
  },
  computed: {
    comparingWith(): number {
      return this.current + 1;
    },
  },
  mounted() {
    // ugly fix for SSR data prepopulation color bug
    const myData: VizNode[] = [];
    for (let i = 0; i < 10; i += 1) {
      myData.push(newNode());
    }
    Vue.set(this, 'list', myData);
  },
  methods: {
    swap(i: number, j: number) {
      const temp = this.list[i];
      this.list[i] = this.list[j];
      this.list[j] = temp;
      Vue.set(this, 'list', [...this.list]);
    },
    valueAt(i: number) {
      return this.list[i].value;
    },
    async multiSwap() {
      this.swap(this.current, this.comparingWith);
      await sleep(500);
      this.swap(this.current, this.comparingWith);
    },
    async bubbleSort() {
      if (this.list.length < 2) {
        return;
      }
      let swapsMade = true;
      while (swapsMade) {
        this.current = 0;
        await sleep(this.delay);
        swapsMade = false;
        while (this.current < this.list.length - 1) {
          await sleep(this.delay);
          if (this.valueAt(this.current) > this.valueAt(this.comparingWith)) {
            this.swap(this.current, this.comparingWith);
            await sleep(this.delay);

            swapsMade = true;
          }
          this.current += 1;
        }
      }
    },
  },
});
</script>

<style scoped>
button {
  padding: 0.7rem;
  font-size: 1rem;
  margin: 0.7rem;
}
label {
  margin: 0.7rem;
}

svg {
  margin: 0.7rem;
}
.positioned-group,
rect,
text,
circle {
  transition: 200ms linear;
}

.list-enter-active {
  stroke-width: 0.2rem;
  stroke: black;
}

.list-move {
  transition: 200ms linear;
}
</style>
