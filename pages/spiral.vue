<template>
  <div>
    <svg width="100%" height="90vh" viewBox="0 0 1000 1000">
      <path
        transform="translate(500, 500)"
        :d="spiralPath"
        stroke="black"
        stroke-width="2"
        fill="rgba(0,100,0,0.5)"
      ></path>
      <g transform="translate(500, 500)">
        <path
          class="rotate"
          :d="spiralPath"
          stroke="black"
          stroke-width="2"
          fill="rgba(0,0,100,0.5)"
        ></path>
      </g>
      <g transform="translate(500, 500)">
        <path
          class="rotate-reverse"
          :d="spiralPath"
          stroke="black"
          stroke-width="2"
          fill="rgba(100,0,0,0.5)"
        ></path>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { lineRadial } from 'd3-shape';

const spiralData = [];
const angleStep = (Math.PI * 2) / 180;
const radiusStep = 100 / 360;
const numSteps = 360 * 5;
let currentAngle = 0;
let currentRadius = 0;
spiralData.push([currentAngle, currentRadius]);
for (let i = 0; i < numSteps; i += 1) {
  currentAngle += angleStep;
  currentRadius += radiusStep;
  const radiusToPush = i % 9 === 0 ? 0 : currentRadius;
  spiralData.push([currentAngle, radiusToPush]);
}

const spiralPath = lineRadial()(spiralData as [number, number][]);

export default Vue.extend({
  data() {
    return { spiralPath };
  },
  methods: {},
});
</script>

<style scoped>
svg {
  /* border: 1px solid cornflowerblue; */
  /* background-color: #dfd; */
}
.rotate {
  animation-name: rotate;
  animation-duration: 10000ms;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.rotate-reverse {
  animation-name: rotate;
  animation-duration: 15000ms;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  /* animation-direction: reverse; */
}

@keyframes rotate {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
</style>
