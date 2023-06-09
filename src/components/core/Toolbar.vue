<template>
  <div class="overflow-hidden" height="300">
    <v-app-bar color="secondary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Hoor Book</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>notifications</v-icon>
      </v-btn>

      <ToolbarMenu />
    </v-app-bar>

    <v-navigation-drawer right v-model="drawer" fixed temporary>
      <v-toolbar flat color="secondary" class="toolbar">
        <router-link :to="{ name: 'Home' }">
          <img src="../../assets/hb-logo.svg" width="36px" />
        </router-link>
        <router-link :to="{ name: 'Home' }" class="text mx10"
          >لوحة التحكم</router-link
        >
      </v-toolbar>
      <v-list nav dense>
        <LinksGroup
          v-for="(link, index) in links"
          :key="index"
          :title="link.title"
          :links="link.links"
          :devider="link.devider"
        />
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import links from "../../router/describeAppLinks";
import LinksGroup from "../core/NavDrawerComps/LinksGroup";
import ToolbarMenu from "../core/NavDrawerComps/ToolbarMenu";

export default {
  data: () => ({
    drawer: false,
    selectedIndex: 1,
    links: links,
    fav: true,
  }),
  components: {
    LinksGroup,
    ToolbarMenu,
  },
  created() {
    //console.log("links => ", links);
  },
  methods: {
    changeRoute(routeName, selectedIndex) {
      const app = this;

      app.selectedIndex = selectedIndex;

      return app.$router.push({ name: routeName });
    },
  },
};
</script>

<style lang="scss">
.aref_ruqaa {
  font-family: Aref_Ruqaa, "sans-serif";
}

.mx10 {
  margin-inline: 10px !important;
}
</style>
