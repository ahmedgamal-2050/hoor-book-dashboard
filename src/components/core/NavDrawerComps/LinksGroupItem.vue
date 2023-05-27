<template>
  <fragment>
    <v-list-item>
      <router-link :to="link.path" class="drawerLink">
        <v-list-item-icon>
          <!-- :class="[{ active: selectedIndex === 1 }]"  -->
          <v-icon >
            {{ link.icon }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ link.title }}</v-list-item-title>
      </router-link>
    </v-list-item>
  </fragment>
</template>

<script>
export default {
  props: {
    link: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.drawerLink {
  width: 100%;
  display: flex;
  text-decoration: none;
  color: #888;
  transition: all ease-in-out 0.3s;
  padding: 0 0.5rem;
  border-radius: 5px;
  &:hover {
    color: rgba(0, 0, 0, 0.54);
    background-color: #eee;
  }
  &.router-link-exact-active.router-link-active {
    background-color: #eee;
  }
}
</style>
