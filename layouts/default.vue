<template>
  <div>
    <div class="top-bar">
      <nav-dropdown></nav-dropdown>
      <div class="site-title">
        <em>Vue/Nuxt/D3/Visualization sketches</em>
        <a
          :href="`https://github.com/jmarq/vue-ts-viz/blob/master/pages/${whichPage}.vue`"
          target="_blank"
          title="view this page's code on GitHub"
        >
          <svg
            width="1rem"
            height="1rem"
            overflow="visible"
            viewBox="0 0 32 32"
            alt="GitHub logo"
          >
            <g transform="rotate(180 0 0) translate(-16 0)">
              <path
                fill="black"
                d="m 0,0 c -8.995,0 -16.288,-7.293 -16.288,-16.29 0,-7.197 4.667,-13.302 11.14,-15.457 0.815,-0.149 1.112,0.354 1.112,0.786 0,0.386 -0.014,1.411 -0.022,2.77 -4.531,-0.984 -5.487,2.184 -5.487,2.184 -0.741,1.881 -1.809,2.382 -1.809,2.382 -1.479,1.011 0.112,0.991 0.112,0.991 1.635,-0.116 2.495,-1.679 2.495,-1.679 1.453,-2.489 3.813,-1.77 4.741,-1.354 0.148,1.053 0.568,1.771 1.034,2.178 -3.617,0.411 -7.42,1.809 -7.42,8.051 0,1.778 0.635,3.232 1.677,4.371 -0.168,0.412 -0.727,2.068 0.159,4.311 0,0 1.368,0.438 4.48,-1.67 1.299,0.361 2.693,0.542 4.078,0.548 1.383,-0.006 2.777,-0.187 4.078,-0.548 3.11,2.108 4.475,1.67 4.475,1.67 0.889,-2.243 0.33,-3.899 0.162,-4.311 1.044,-1.139 1.675,-2.593 1.675,-4.371 0,-6.258 -3.809,-7.635 -7.438,-8.038 0.585,-0.503 1.106,-1.497 1.106,-3.017 0,-2.177 -0.02,-3.934 -0.02,-4.468 0,-0.436 0.293,-0.943 1.12,-0.784 6.468,2.159 11.131,8.26 11.131,15.455 C 16.291,-7.293 8.997,0 0,0"
              ></path>
            </g>
          </svg>
        </a>
      </div>
    </div>
    <Nuxt />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import NavDropdown from '@/components/nav/NavDropdown.vue';
export default Vue.extend({
  components: {
    NavDropdown,
  },
  computed: {
    whichPage(): string | null | undefined {
      const result = this.$route.name;
      return result;
    },
  },
});
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 1rem;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

body {
  background-color: #fff;
  color: #222;
  margin: 20px;
  margin-top: 8px;
  font-family: 'Ubuntu';
}
.top-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.site-title {
  font-family: 'Bree Serif';
  text-align: right;
}
</style>
