<template>
  <!--  -->
  <v-menu bottom origin="center center" transition="scale-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-avatar dark v-bind="attrs" v-on="on">
        <img
          :src="`https://api.letasknoelayha.com/${admin.image}`"
          alt="صورة البروفايل"
        />
      </v-avatar>
    </template>
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  id="userProfile"
                  ref="fileInput"
                  style="display:none"
                  @change="setImage"
                />

                <img
                  v-bind="attrs"
                  v-on="on"
                  @click="$refs.fileInput.click()"
                  :src="`https://api.letasknoelayha.com/${admin.image}`"
                  alt="صورة البروفايل"
                />
              </template>
              <span>تعديل صورة الحساب</span>
            </v-tooltip>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ admin.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ admin.email }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  @click.stop="openChangePasswordDialog"
                  v-on="on"
                >
                  <v-icon>vpn_key</v-icon>
                </v-btn>
              </template>
              <span>تغيير كلمة السر</span>
            </v-tooltip>
          </v-list-item-action>
          <v-list-item-action>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="logout">
                  <v-icon>exit_to_app</v-icon>
                </v-btn>
              </template>
              <span>تسجيل الخروج</span>
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>

        <v-dialog v-model="imgDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span>تجهيز الصورة</span>
              <v-spacer></v-spacer>
              <v-btn icon small @click="imgDialog = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <vue-cropper
                      ref="cropper"
                      outputType="jpg"
                      :guides="true"
                      :view-mode="2"
                      drag-mode="crop"
                      :auto-crop-area="0.5"
                      :min-container-width="250"
                      :min-container-height="250"
                      :background="true"
                      :rotatable="true"
                      :src="imgSrc"
                      alt="Source Image"
                      :aspectRatio="1"
                      :img-style="{ width: '400px', height: '200px' }"
                    >
                    </vue-cropper>
                  </v-col>
                </v-row>
              </v-container>
              <small>ملحوظة: </small>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" :loading="handlingImage" @click="cropImage"
                >حفظ</v-btn
              >
              <v-btn color="primary" @click="imgDialog = false">إغلاق</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!--  -->
        <v-dialog v-model="changePasswordDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span>تغيير كلمة السر</span>
              <v-spacer></v-spacer>
              <v-btn icon small @click="changePasswordDialog = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <ValidationObserver
              ref="changePasswordObs"
              v-slot="{ invalid, validated, handleSubmit }"
            >
              <form
                ref="changePasswordForm"
                @submit.prevent="handleSubmit(changePassword)"
              >
                <v-card-text class="text-xs-center">
                  <ul style="list-style: none">
                    <li
                      class="red--text"
                      v-for="error in changePasswordErrors"
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
                    rules="required|min:8"
                    label="كلمة السر القديمة"
                    v-model="changePasswordForm.old_password"
                    prepend-icon="lock"
                    :type="old_password_show ? 'text' : 'password'"
                    :append-icon="
                      old_password_show ? 'visibility_off' : 'visibility'
                    "
                    @click:append="old_password_show = !old_password_show"
                  />

                  <VTextFieldWithValidation
                    rules="required|min:8"
                    label="كلمة السر الجديدة"
                    v-model="changePasswordForm.new_password"
                    prepend-icon="lock"
                    :type="new_password_show ? 'text' : 'password'"
                    :append-icon="
                      new_password_show ? 'visibility_off' : 'visibility'
                    "
                    @click:append="new_password_show = !new_password_show"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    type="submit"
                    :disabled="invalid || !validated"
                    :loading="connecting"
                    color="primary"
                    >تغيير</v-btn
                  >
                  <v-btn
                    :loading="connecting"
                    @click="changePasswordDialog = false"
                    color="primary"
                    >إغلاق</v-btn
                  >
                </v-card-actions>
              </form>
            </ValidationObserver>
          </v-card>
        </v-dialog>
        <!--  -->
      </v-list>
    </v-card>
  </v-menu>
  <!--  -->
</template>

<script>
import VTextFieldWithValidation from "../../inputs/VTextFieldWithValidation";

export default {
  data() {
    return {
      admin: {},
      imgDialog: false,
      changePasswordDialog: false,
      old_password_show: false,
      new_password_show: false,
      changePasswordForm: {
        old_password: "",
        new_password: "",
      },
      imgSrc: "",
      cropImg: "",
      imgForUpload: null,
      connecting: false,
      handlingImage: false,
      changePasswordErrors: [],
    };
  },
  components: {
    VTextFieldWithValidation,
  },
  created() {
    this.getAdmin();
  },
  methods: {
    getAdmin() {
      this.admin = this.$ls.get("admin");
    },
    logout() {
      let vm = this;
      vm.$ls.clear();
      //   vm.$ls.remove("token");
      //   vm.$ls.remove("permissions");
      console.log(
        "Axios Instance",
        vm.$http.defaults.headers.common["Authorization"]
      );
      vm.$router.push({ name: "Login" });
    },
    setImage(e) {
      this.imgDialog = true;
      // console.log(e.target.value);

      const file = e.target.files[0];
      // console.log(file)
      if (!file.type.includes("image/")) {
        alert("Please select an image file");
        return;
      }
      if (typeof FileReader === "function") {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }

      setTimeout(() => {
        e.target.value = "";
        // console.log(e.target.value);
      }, 1500);
    },
    cropImage() {
      let app = this;
      app.handlingImage = true;
      // get image data for post processing, e.g. upload or setting image src
      app.cropImg = app.$refs.cropper.getCroppedCanvas().toDataURL();
      //   app.getAvatar(app.cropImg);
      //   let img = null;
      app
        .urltoFile(app.cropImg, "image.jpg")
        .then(function(file) {
          app.imgForUpload = file;
          // console.log('imgForUpload', app.imgForUpload)
        })
        .then(() => {
          let formdata = new FormData();
          if (this.cropImg != "") {
            formdata.append("image", this.imgForUpload);
          }
          this.$http
            .post("admin/change-profile-pic", formdata)
            .then((res) => {
              if (res) {
                app.handlingImage = false;
                this.$http
                  .post("admin/auth/me")
                  .then((res) => {
                    console.log("Res From Me", res);
                    this.$ls.set("admin", res.data);
                  })
                  .then(() => {
                    this.getAdmin();
                    setTimeout(() => {
                      app.imgDialog = false;
                    }, 1000);
                  });
              }
            })
            .catch(({ response }) => {
              console.log("response", response);
            });
        });
    },
    rotate() {
      // guess what this does :)
      this.$refs.cropper.rotate(90);
    },
    urltoFile(url, filename, mimeType) {
      mimeType = mimeType || (url.match(/^data:([^;]+);/) || "")[1];
      return fetch(url)
        .then(function(res) {
          return res.arrayBuffer();
        })
        .then(function(buf) {
          let file = new File([buf], filename, { type: mimeType });
          return file;
        });
    },
    openChangePasswordDialog() {
      this.changePasswordForm.old_password = "";
      this.changePasswordForm.new_password = "";
      this.changePasswordDialog = true;
      this.$nextTick(() => {
        this.$refs.changePasswordObs.reset();
      });
    },
    changePassword() {
      var self = this;
      this.connecting = true;
      this.$http
        .post("admin/change-password", this.changePasswordForm)
        .then((res) => {
          console.log("RES => ", res.data);
          this.connecting = false;
          this.openChangePasswordDialog = false;
        })
        .catch(({ response }) => {
          console.log("response", response);
          self.changePasswordErrors = response.data.errors;
          setTimeout(() => {
            self.changePasswordErrors = [];
          }, 3000);
          this.connecting = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
