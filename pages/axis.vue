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
    <p>
      below: how axes are rendered based on how many ticks were "declared". note
      that D3 seems to take some liberties here.
    </p>
    <p>
      this seems to be because D3 .ticks() generated ticks can only be multiples
      of 2, 5, 10
    </p>
    <svg
      width="800"
      height="800"
      viewBox="0 0 800 800"
      preserveAspectRatio="none"
    >
      <g v-for="(count, i) in tickCounts" :key="count">
        <g
          :ref="`axis_${i}`"
          :data-count="count"
          :data-index="i"
          :transform="`translate(100 ${i * 100 + 50})`"
        ></g>
      </g>
      <g ref="meta-axis" transform="translate(50 50)"></g>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisLeft, axisRight, axisBottom } from 'd3-axis';

export default Vue.extend({
  data() {
    return {
      tickCounts: [1, 2, 3, 4, 5, 6, 7, 8],
    };
  },
  mounted() {
    const scale1 = scaleLinear().domain([0, 1]).range([100, 0]);
    const axis1 = axisLeft(scale1).tickSize(-100).ticks(3);
    const axis2 = axisRight(scale1).tickSize(-100).ticks(5);
    select(this.$refs.axis1 as SVGSVGElement).call(axis1);
    select(this.$refs.axis2 as SVGSVGElement).call(axis2);

    // generate an axis for each number of ticks represented in tickCounts
    const axisArrayScale = scaleLinear().domain([0, 1]).range([0, 600]);
    this.tickCounts.forEach((count, i) => {
      const newAxis = axisBottom(axisArrayScale).ticks(count);
      // inside of `v-for`s, refs become arrays.
      const theRefArray = this.$refs[`axis_${i}`] as SVGSVGElement[];
      const theRef = theRefArray[0];
      select(theRef as SVGSVGElement).call(newAxis);
    });
    // a vertical axis that describes the tick counts for the axes above.
    const metaAxisScale = scaleLinear().domain([1, 8]).range([0, 700]);
    const metaAxis = axisLeft(metaAxisScale).ticks(8);
    select(this.$refs['meta-axis'] as SVGSVGElement).call(metaAxis);
  },
});
</script>

<style scoped>
svg {
  margin: 20px;
  border: 1px solid red;
}

g >>> text {
  font-size: 16px;
}

g.right-axis >>> g.tick line {
  stroke-dasharray: 2 2;
}
</style>
