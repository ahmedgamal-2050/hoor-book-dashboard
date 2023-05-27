<template>
  <v-flex xs12 sm8 md6>
    <v-card elevation="10">
      <v-img
        :src="require('../assets/imgs/404.gif')"
        gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
      >
        <v-row align="end" class="lightbox white--text pa-2 fill-height">
          <v-col>
            <div class="subheading"><h2>404</h2></div>
            <div class="body-1">
              <router-link style="color: #f5f5f5" to="/"
                >العودة إلى الرئيسية</router-link
              >
            </div>
          </v-col>
        </v-row>
      </v-img>
    </v-card>
  </v-flex>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
