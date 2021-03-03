<template>
  <div>
    <p>bubble sort?</p>
    <p><button @click="swap(current, comparingWith)">swap</button></p>
    <p><button @click="multiSwap">multiSwap?</button></p>

    <svg
      width="500px"
      height="60px"
      viewBox="0 0 500 60"
      preserveAspectRatio="none"
      overflow="visible"
    >
      <transition-group name="list" tag="g">
        <g
          v-for="(item, i) in list"
          :key="item.id"
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

const newNode = (): VizNode => {
  return {
    value: dumbNum(),
    id: dumbId(),
    color: 'red',
  };
};

const myData: VizNode[] = [];
for (let i = 0; i < 10; i += 1) {
  myData.push(newNode());
}
export default Vue.extend({
  data() {
    return {
      list: myData,
      squareHeight: 50,
      current: 0,
    };
  },
  computed: {
    comparingWith() {
      return this.current + 1;
    },
  },
  methods: {
    swap(i: number, j: number) {
      const temp = this.list[i];
      this.list[i] = this.list[j];
      this.list[j] = temp;
      Vue.set(this, 'list', [...this.list]);
    },
    async multiSwap() {
      this.swap(this.current, this.comparingWith);
      await sleep(500);
      this.swap(this.current, this.comparingWith);
    },
  },
});
</script>

<style scoped>
.positioned-group,
rect,
text {
  transition: 300ms linear;
}

/* .list-move {
  transition: 300ms linear;
} */
</style>
