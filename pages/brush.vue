<template>
  <div class="page-wrapper">
    <h1>D3 brushes with Vue refs</h1>
    <p>
      current selection: {{ brushStrings[0] }} -->
      {{ brushStrings[1] }}
    </p>
    <svg
      width="500px"
      height="130px"
      viewBox="0 0 500 130"
      preserveAspectRatio="none"
      overflow="visible"
    >
      <g ref="axis" transform="translate(0 100)"></g>
      <g ref="brush"></g>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { brushX, D3BrushEvent } from 'd3-brush';
import { select as d3Select } from 'd3';
import { scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';

type BrushDimensions = [[number, number], [number, number]];
const brushDimensions: [number, number] = [500, 100];
export default Vue.extend({
  data() {
    return {
      currentBrush: [0, 500],
    };
  },

  computed: {
    brushStrings() {
      return this.currentBrush.map((num) => Number(num).toFixed(2));
    },
  },

  mounted() {
    const scale = scaleLinear().domain([0, 500]).range([0, 500]);
    const axis = axisBottom(scale).ticks(5);
    const axisElement = this.$refs.axis as SVGGElement;
    const selectedAxisElement = d3Select(axisElement);
    axis(selectedAxisElement);

    const brushExtent: BrushDimensions = [[0, 0], brushDimensions];
    const brush = brushX()
      .extent(brushExtent)
      .on('end', this.brushEnd)
      .on('brush', this.brushEnd);
    const brushElement = this.$refs.brush as SVGGElement;
    const selectedBrush = d3Select(brushElement);
    brush(selectedBrush);
  },

  methods: {
    brushEnd(ev: D3BrushEvent<unknown>) {
      console.log(ev);
      if (ev.selection !== null) {
        this.currentBrush = ev.selection as [number, number];
      } else {
        this.currentBrush = [0, brushDimensions[0]];
      }
    },
  },
});
</script>

<style scoped>
svg {
  border: 1px solid rebeccapurple;
}

svg >>> .selection {
  fill: rebeccapurple;
  fill-opacity: 0.7;
}

svg >>> text {
  font-size: 16px;
}
</style>
