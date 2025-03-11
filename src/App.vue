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

@media print {
  main, .v-card__title, .v-card__actions {
    display: none !important;
  }

  body .v-dialog__content {
    align-items: start;
    justify-content: start;
  }

  .v-dialog__content .v-dialog {
    box-shadow: none !important;
    margin: 0;
    border-radius: 0px !important;
    width: 6cm;
    height: 4cm;
    overflow-y: hidden;
    padding: 0;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .v-dialog .v-card {
    box-shadow: none !important;
    padding-top: 6px;
    width: 100% !important;
    height: 100% !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .v-dialog .v-card__text {
    padding-left: 0 !important;
    padding-right: 0 !important;
    font-size: 9.5px !important;
    color: #000 !important;
  }

  * {
    line-height: 1.45 !important;
  }
  
  .printing-padding {
  margin-top: 30px; /* Apply margin to top */
}
}
</style>
