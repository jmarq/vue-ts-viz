<template>
  <div class="wrapper">
    <h1>d3 axis exploration</h1>
    <p>
      below: how axes are rendered based on how many ticks were "declared". note
      that D3 seems to take some liberties here.
    </p>
    <p>
      this seems to be because D3 .ticks() generated tick values "want" to be
      multiples of 2, 5, 10
    </p>
    <hr />
    <p>
      axis scale: 0<input
        v-model.number="scaleMax"
        type="range"
        min="0"
        max="100"
        step="10"
      />100
    </p>
    <p>current scale: {{ scaleMax }}</p>

    <svg
      width="800"
      height="800"
      viewBox="0 0 800 800"
      preserveAspectRatio="auto"
      overflow="visible"
    >
      <g v-for="(count, i) in tickCounts" :key="count">
        <g
          :ref="`axis_${i}`"
          :data-count="count"
          :data-index="i"
          :transform="`translate(100 ${i * 100 + 50})`"
        ></g>
      </g>
      <g ref="meta-axis" class="meta-axis" transform="translate(70 50)"></g>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';

export default Vue.extend({
  data() {
    return {
      tickCounts: [1, 2, 3, 4, 5, 6, 7, 8],
      scaleMax: 60,
    };
  },

  watch: {
    scaleMax: {
      deep: true,
      handler() {
        this.drawAxes();
      },
    },
  },

  mounted() {
    this.drawAxes();
  },

  methods: {
    drawAxes() {
      // generate an axis for each number of ticks represented in tickCounts
      const axisArrayScale = scaleLinear()
        .domain([0, this.scaleMax])
        .range([0, 600]);
      this.tickCounts.forEach((count, i) => {
        const newAxis = axisBottom(axisArrayScale).ticks(count);
        // inside of `v-for`s, refs become arrays.
        const theRefArray = this.$refs[`axis_${i}`] as SVGSVGElement[];
        const theRef = theRefArray[0];
        select(theRef as SVGSVGElement).call(newAxis);
      });
      // a vertical axis that describes the tick counts for the axes above.
      const metaAxisScale = scaleLinear().domain([1, 8]).range([0, 700]);
      const metaAxis = axisLeft(metaAxisScale)
        .ticks(8)
        .tickFormat((val) => `.ticks(${val})`)
        .tickSize(-30);
      select(this.$refs['meta-axis'] as SVGSVGElement).call(metaAxis);
    },
  },
});
</script>

<style scoped>
.wrapper {
  margin: 20px;
}

p {
  margin-bottom: 0.5em;
  margin-top: 0.5em;
}
svg {
  /* margin: 20px; */
  /* border: 1px solid red; */
}

g >>> text {
  font-size: 16px;
}

.meta-axis >>> text {
  font-size: 16px;
  font-weight: bold;
  font-family: 'Inconsolata';
}
.meta-axis >>> g.tick line {
  stroke-dasharray: 2 2;
  stroke: #555;
}

.meta-axis >>> path.domain {
  stroke-dasharray: 2 2;
  stroke: #555;
}
</style>
