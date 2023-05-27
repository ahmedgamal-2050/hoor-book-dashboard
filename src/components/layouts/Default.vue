<template>
  <fragment>
    <toolbar />
    <v-main>
      <v-container fluid>
        <v-layout justify-center>
          <slot></slot>
        </v-layout>
      </v-container>
    </v-main>
    <v-footer color="primary" app>
      <v-spacer></v-spacer>

      <span class="white--text"
        >لتسكنوا &copy; {{ new Date().getFullYear() }}
      </span>
    </v-footer>
  </fragment>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
