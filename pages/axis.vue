<template>
  <div>
    <p>d3 axis exploration</p>
    <svg
      width="120px"
      height="110px"
      viewBox="0 0 120 110"
      preserveAspectRatio="none"
      overflow="visible"
    >
      <g transform="translate(20,5)">
        <rect x="0" y="0" width="100" height="100" fill="#ccc"></rect>
      </g>
      <g
        ref="axis1"
        class="left-axis"
        transform="translate(20,5)"
        stroke-width="1"
        font-size="16px"
      ></g>
      <g
        ref="axis2"
        class="right-axis"
        transform="translate(120,5)"
        stroke-width="1"
        font-size="16px"
      ></g>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisLeft, axisRight } from 'd3-axis';

export default Vue.extend({
  mounted() {
    console.log('mounted');
    const scale1 = scaleLinear().domain([0, 1]).range([100, 0]);
    const axis1 = axisLeft(scale1).tickSize(-100).ticks(3);
    const axis2 = axisRight(scale1).tickSize(-100).ticks(5);
    select(this.$refs.axis1 as SVGSVGElement).call(axis1);
    select(this.$refs.axis2 as SVGSVGElement).call(axis2);
  },
});
</script>

<style scoped>
svg {
  margin: 20px;
}

g >>> text {
  font-size: 16px;
}

g.right-axis >>> g.tick line {
  stroke-dasharray: 2 2;
}
</style>
