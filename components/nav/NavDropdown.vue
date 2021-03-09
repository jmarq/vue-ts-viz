<template>
  <div class="nav-dropdown-wrapper">
    <button
      ref="trigger"
      class="dropdown-trigger"
      @click="toggleDropdown"
      @keyup="handleKey"
      @blur="handleBlur"
    >
      Navigation
    </button>
    <transition name="dropdown">
      <ul v-if="open" ref="links" class="links" @keyup="handleKey">
        <li v-for="link in links" :key="link.path" @click="closeAndFocusButton">
          <nuxt-link :to="link.path" @blur.native="handleBlur">{{
            link.name
          }}</nuxt-link>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      open: false,
      links: [
        { path: 'hierarchy', name: 'hierarchy charts' },
        { path: 'axis', name: 'axis experiment' },
        { path: 'brush', name: 'brushing' },
        { path: 'sankey', name: 'sankey diagram' },
        { path: 'sort', name: 'bubble sort' },
        { path: 'stacks', name: 'stacks' },
        { path: 'spiral', name: 'radial spiral design' },
        { path: '/', name: 'home' },
      ],
    };
  },
  methods: {
    toggleDropdown() {
      this.open = !this.open;
    },
    closeDropdown() {
      this.open = false;
    },
    focusButton() {
      const triggerButton = this.$refs.trigger as HTMLElement;
      triggerButton.focus();
    },
    closeAndFocusButton() {
      this.closeDropdown();
      this.focusButton();
    },
    handleKey(ev: KeyboardEvent) {
      console.log(ev);
      if (ev.key === 'Escape') {
        this.closeAndFocusButton();
      }
    },
    handleBlur(ev: FocusEvent) {
      const listElement = this.$refs.links as HTMLElement;
      const newFocus = ev.relatedTarget as HTMLElement;
      if (!listElement || !listElement.contains(newFocus)) {
        this.closeDropdown();
      }
    },
  },
});
</script>

<style scoped>
.nav-dropdown-wrapper {
  position: relative;
}

ul.links {
  position: absolute;
  background-color: rgba(240, 240, 240, 0.9);
  padding: 20px;
  width: 200px;
}

ul.links a {
  display: block;
  padding: 20px;
}

ul.links a:focus {
  background-color: rgba(200, 230, 240, 0.9);
  color: red;
}

.dropdown-leave-to,
.dropdown-enter {
  transform: scaleY(0);
}

ul.links {
  transform-origin: top;
  transition: 300ms linear;
}
</style>
