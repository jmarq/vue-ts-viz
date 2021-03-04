<template>
  <div>
    <h1>bubble sort</h1>
    <!-- <p><button @click="swap(3, 4)">swap</button></p>
    <p><button @click="multiSwap">multiSwap?</button></p> -->
    <p><button @click="bubbleSort">sort?</button></p>

    <svg
      width="500px"
      height="60px"
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
        fill="blue"
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
const newNode = (): VizNode => {
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
      list: [],
      squareHeight: 50,
      current: 0,
    };
  },
  computed: {
    comparingWith() {
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
      // const temp = this.list[i];
      // this.list[i] = this.list[j];
      // this.list[j] = temp;
      // Vue.set(this, 'list', [...this.list]);
      Vue.set(this, 'list', [
        ...this.list.slice(0, i),
        this.list[j],
        this.list[i],
        ...this.list.slice(j + 1),
      ]);
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
      const delay = 300;
      if (this.list.length < 2) {
        return;
      }
      let swapsMade = true;
      while (swapsMade) {
        this.current = 0;
        await sleep(delay);
        swapsMade = false;
        while (this.current < this.list.length - 1) {
          await sleep(delay);
          if (this.valueAt(this.current) > this.valueAt(this.comparingWith)) {
            this.swap(this.current, this.comparingWith);
            await sleep(delay);

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
.positioned-group,
rect,
text,
circle {
  transition: 200ms linear;
}

.list-enter-active {
  stroke-width: 3px;
  stroke: black;
}

.list-move {
  transition: 200ms linear;
}
</style>
