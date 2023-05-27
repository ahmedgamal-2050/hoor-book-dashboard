<template>
  <v-app id="inspire">
    <v-main>
      <component :is="layout">
        <router-view />
      </component>
    </v-main>
    <!--  -->
    <v-snackbar top left v-model="Display" timeout="20000">
      {{ Message }}

      <template v-slot:action="{ attrs }">
        <!-- <v-btn color="blue" text v-bind="attrs" @click="hideNotification">
          Close
        </v-btn> -->
        <v-btn icon dark v-bind="attrs" @click="hideNotification">
          <v-icon>close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <!--  -->
  </v-app>
</template>

<script>
const defaultLayout = "default";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      drawer: false,
      key: "",
    };
  },
  computed: {
    ...mapGetters(["Display", "Message"]),
    layout() {
      return this.$route.meta.layout || defaultLayout;
    },
  },
  created() {
    this.key = process.env.API_BASE_URI;
    console.log(this.key);
  },
  methods: {
    ...mapActions(["hideNotification"]),
  },
};
</script>

<style lang="scss">
@import "./assets/sass/fonts";

*,
body {
  font-family: Cairo, "sans-serif";
}
.v-main {
  background-color: #f5f5f5;
}
</style>
