<template>
  <div>
    <span
      v-for="(letter, index) in message.split('')"
      :key="index"
      :class="$style.large"
      :style="`color: ${colors[index % 10]}`"
      >{{ letter }}</span
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { schemeCategory10 } from 'd3-scale-chromatic';

export default Vue.extend({
  data() {
    return {
      message: 'hello from vue/d3',
      colors: schemeCategory10,
    };
  },
  mounted() {
    console.log('hello');
  },
});
</script>

<style module>
.large {
  font-size: 4.5rem;
}
</style>
