<template>
  <v-flex xs12 sm8 md4>
    <v-card class="elevation-12">
      <v-toolbar color="primary">
        <v-toolbar-title style="color:white;">
          {{ process.formTitle }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" icon dark large target="_blank">
            <v-icon large>{{ process.icon }}</v-icon>
          </v-btn>
          <span>Login</span>
        </v-tooltip>
      </v-toolbar>

      <fragment v-if="process.status === 0">
        <ValidationObserver
          ref="obs"
          v-slot="{ invalid, validated, handleSubmit }"
        >
          <form @submit.prevent="handleSubmit(sendCode)">
            <v-card-text class="text-xs-center">
              <ul style="list-style: none">
                <li
                  class="red--text"
                  v-for="error in errors"
                  :key="error[0] + Math.random()"
                >
                  <ul style="list-style: none">
                    <li v-for="err in error" :key="err + Math.random()">
                      <small>{{ err }} </small>
                    </li>
                  </ul>
                </li>
              </ul>
            </v-card-text>
            <v-card-text>
              <VTextWithValidation
                rules="required|email"
                v-model="targetEmail"
                label="البريد الإليكتروني"
                prepend-icon="mail"
                @focus="errors = []"
              />
            </v-card-text>
            <v-card-text>
              <small>
                <span>
                  <v-icon>error_outline</v-icon>
                  بعد ارسال الكود يرجى مراجعة البريد الإليكتروني لجلب الكود
                  المرسل
                </span>
              </small>
            </v-card-text>
            <v-card-actions>
              <v-btn
                type="submit"
                :loading="sendCodeLoading"
                :disabled="invalid || !validated"
                color="primary"
                >ارسل الكود</v-btn
              >
              <v-spacer></v-spacer>
              <router-link to="/auth/login">تسجيل الدخول</router-link>
            </v-card-actions>
          </form>
        </ValidationObserver>
      </fragment>

      <fragment v-else-if="process.status === 1">
        <ValidationObserver
          ref="obs"
          v-slot="{ invalid, validated, handleSubmit }"
        >
          <form @submit.prevent="handleSubmit(changePassword)">
            <v-card-text class="text-xs-center">
              <ul style="list-style: none">
                <li
                  class="red--text"
                  v-for="error in changePasswordErrors"
                  :key="error[0] + Math.random()"
                >
                  <ul style="list-style: none">
                    <li v-for="err in error" :key="err + Math.random()">
                      <small>{{ err }} </small>
                    </li>
                  </ul>
                </li>
              </ul>
            </v-card-text>
            <v-card-text v-if="resendProccessDone">
              <small>
                تم ارسال الكود مرة أخرى يرجى مراجعة البريد الإليكتروني
              </small>
            </v-card-text>
            <v-card-text>
              <VTextWithValidation
                rules="required"
                label="كود التأكد"
                v-model="vervicationForm.email_code"
                prepend-icon="vpn_key"
              />

              <VTextWithValidation
                rules="required|min:8"
                label="كلمة السر"
                v-model="vervicationForm.password"
                prepend-icon="lock"
                :type="password_show ? 'text' : 'password'"
                :append-icon="password_show ? 'visibility_off' : 'visibility'"
                @click:append="password_show = !password_show"
              />

              <VTextWithValidation
                rules="required|password:@كلمة السر"
                label="تأكيد كلمة السر"
                v-model="vervicationForm.password_confirmation"
                prepend-icon="lock"
                :type="confirm_password_show ? 'text' : 'password'"
                :append-icon="
                  confirm_password_show ? 'visibility_off' : 'visibility'
                "
                @click:append="confirm_password_show = !confirm_password_show"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn
                type="submit"
                :disabled="invalid || !validated"
                :loading="changePasswordloading"
                color="primary"
                >حفظ</v-btn
              >
              <v-btn
                @click="resendCode"
                :loading="resendCodeLoading"
                color="primary"
                >اعادة ارسال الكود</v-btn
              >
              <v-spacer></v-spacer>
              <router-link to="/auth/login">تسجيل الدخول</router-link>
            </v-card-actions>
          </form>
        </ValidationObserver>
      </fragment>
    </v-card>
  </v-flex>
</template>

<script>
import VTextWithValidation from "../../components/inputs/VTextWithValidation";

export default {
  data: () => ({
    process: {
      status: 0,
      formTitle: "كود التأكد",
      icon: "email",
    },
    targetEmail: null,
    vervicationForm: {
      email_code: null,
      password: null,
      password_confirmation: null,
    },
    password_show: false,
    confirm_password_show: false,
    errors: [],
    changePasswordErrors: [],
    connecting: false,
    sendCodeLoading: false,
    changePasswordloading: false,
    resendCodeLoading: false,
    resendProccessDone: false,
  }),
  components: {
    VTextWithValidation,
  },
  methods: {
    sendCode() {
      this.sendCodeLoading = true;
      this.$http
        .post("admin/forget-password", { email: this.targetEmail })
        .then((res) => {
          console.log("RES => ", res.data);
          this.sendCodeLoading = false;
          this.process = {
            status: 1,
            formTitle: "تغيير كلمة السر",
            icon: "lock",
          };
        })
        .catch(({ response }) => {
          console.log("response", response);
          this.errors = response.data.errors;
          setTimeout(() => {
            this.errors = [];
          }, 9000);
          this.sendCodeLoading = false;
        });
    },
    changePassword() {
      var self = this;
      this.changePasswordloading = true;
      this.$http
        .post("admin/check-forget-password-code", {
          ...this.vervicationForm,
          email: this.targetEmail,
        })
        .then((res) => {
          console.log("RES => ", res.data);
          this.changePasswordloading = false;
          this.$router.push("/login");
        })
        .catch(({ response }) => {
          console.log("response", response);
          self.changePasswordErrors = response.data.error;
          setTimeout(() => {
            self.changePasswordErrors = [];
          }, 9000);
          this.changePasswordloading = false;
        });
    },
    resendCode() {
      this.resendCodeLoading = true;
      this.$http
        .post("admin/forget-password", { email: this.targetEmail })
        .then((res) => {
          console.log("RES => ", res.data);
          this.resendCodeLoading = false;
          this.resendProccessDone = true;
          setTimeout(() => {
            this.resendProccessDone = false;
          }, 9000);
        })
        .catch(({ response }) => {
          console.log("response", response);
          this.errors = response.data.errors;
          this.resendCodeLoading = false;
        });
    },
  },
};
</script>
