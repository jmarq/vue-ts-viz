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
      <ul v-show="open" ref="links" class="links" @keyup="handleKey">
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
        { path: '/', name: 'home' },
        { path: 'hierarchy', name: 'hierarchy charts' },
        { path: 'axis', name: 'axis experiment' },
        { path: 'brush', name: 'brushing' },
        { path: 'sankey', name: 'sankey diagram' },
        { path: 'sort', name: 'bubble sort' },
        { path: 'stacks', name: 'stacks' },
        { path: 'spiral', name: 'radial spiral design' },
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

button.dropdown-trigger {
  background-color: white;
  font-family: 'Bree Serif';
  padding: 0.5rem;
  border-radius: 0.5rem;
}

button.dropdown-trigger:focus,
button.dropdown-trigger:hover {
  background-color: rgba(200, 230, 240, 0.9);
}

ul.links {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.9);
  /* padding: 1.25rem; */
  /* width: 12.5rem; */
  box-shadow: 0.3rem 0.3rem 0.3rem #333;
  border-radius: 0.5rem;
  list-style: none;
  padding: 0;
}

ul.links li {
  padding: 0;
}

ul.links a {
  display: block;
  width: 14rem;

  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-family: 'Bree Serif';
  font-size: 1.25em;
  color: black;
}

ul.links a:focus {
  background-color: rgba(200, 230, 240, 0.9);
  color: red;
}

ul.links a.nuxt-link-exact-active {
  background-color: rgb(251, 251, 155);
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
