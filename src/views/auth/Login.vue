<template>
  <v-flex xs12 sm8 md4>
    <v-card class="elevation-12">
      <v-toolbar color="primary">
        <v-toolbar-title style="color:white;">
          لوحة تحكم Hoor Book
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" icon dark large target="_blank">
            <v-icon large>person</v-icon>
          </v-btn>
          <span>Login</span>
        </v-tooltip>
      </v-toolbar>
      <ValidationObserver
        ref="obs"
        v-slot="{ invalid, validated, handleSubmit }"
      >
        <form @submit.prevent="handleSubmit(login)">
          <v-card-text class="text-xs-center">
            <ul style="list-style: none">
              <li
                class="red--text"
                v-for="error in errors"
                :key="error[0] + Math.random()"
              >
                <ul style="list-style: none">
                  <li v-for="err in error" :key="err + Math.random()">
                    <small>{{ err }}</small>
                  </li>
                </ul>
              </li>
            </ul>
          </v-card-text>
          <v-card-text>
            <VTextFieldWithValidation
              rules="required|email"
              v-model="user.email"
              label="البريد الإليكتروني"
              prepend-icon="mail"
            />

            <VTextFieldWithValidation
              rules="required"
              v-model="user.password"
              label="كلمة السر"
              prepend-icon="lock"
              :type="password_show ? 'text' : 'password'"
              :append-icon="password_show ? 'visibility_off' : 'visibility'"
              @click:append="password_show = !password_show"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn
              type="submit"
              :loading="connecting"
              :disabled="invalid || !validated"
              color="primary"
              >تسجيل الدخول</v-btn
            >
            <v-spacer></v-spacer>
            <router-link to="/auth/forget-password"
              >استعادة كلمة السر</router-link
            >
          </v-card-actions>
        </form>
      </ValidationObserver>
    </v-card>
  </v-flex>
</template>

<script>
import VTextFieldWithValidation from "../../components/inputs/VTextFieldWithValidation";
import { BASE_URL, BASE_API } from "../../config/config";


export default {
  data: () => ({
    user: {
      name: "",
      email: null,
      password: null,
    },
    password_show: false,
    errors: [],
    connecting: false,
    baseUrl: BASE_URL,
    baseApi: BASE_API,
  }),
  components: {
    VTextFieldWithValidation,
  },
  beforeCreate() {},
  methods: {
    login() {
      // var self = this;
      this.connecting = true;
      this.$http
        .post("${this.baseApi}/api/admin/login", this.user)
        .then((res) => {
          // console.log("RES => ", res.data);
          // console.log("access_token => ", res.data.data.access_token);
          this.$ls.set("token", res.data.data.access_token);
          this.$ls.set("admin", res.data.data.admin);
          
          //localStorage.setItem("tokenLS", JSON.stringify(res.data.access_token));
          this.$http.defaults.headers.common["Authorization"] =
            "Bearer " + this.$ls.get("token", null);

          this.$router.push("/");
          this.connecting = false;
        })
        .catch(({ response }) => {
          console.log("response => ", response);
          this.errors = response.data.errors;
          setTimeout(() => {
            this.errors = [];
          }, 3000);
          this.connecting = false;
        });
    },
  },
};
</script>
