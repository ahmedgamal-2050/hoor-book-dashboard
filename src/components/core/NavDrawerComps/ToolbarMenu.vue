<template>
  <!--  -->
  <v-menu bottom origin="center center" transition="scale-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-avatar dark v-bind="attrs" v-on="on">
        <img
          v-if="admin.image === null"
          src="../../../assets/imgs/profile-img.jpg"
          alt="صورة البروفايل"
        />
        <img
          v-else
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
                <v-menu
                  v-bind="attrs"
                  v-on="on"
                  open-on-hover
                  offsetY
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <img
                      v-if="admin.image === null"
                      v-bind="attrs"
                      v-on="on"
                      src="../../../assets/imgs/profile-img.jpg"
                      alt="صورة البروفايل"
                    />
                    <img
                      v-else
                      v-bind="attrs"
                      v-on="on"
                      :src="`https://api.letasknoelayha.com/${admin.image}`"
                      alt="صورة البروفايل"
                    />
                  </template>
                  <!--  -->
                  <v-card>
                    <v-list>
                      <v-list-item>
                        <v-btn
                          v-if="admin.image !== null"
                          class="mx-2"
                          fab
                          dark
                          x-small
                          color="primary"
                          @click="previewImgDialog = true"
                        >
                          <v-icon dark>settings_overscan</v-icon>
                        </v-btn>
                        <v-btn
                          class="mx-2"
                          fab
                          dark
                          x-small
                          color="primary"
                          @click="$refs.fileInput.click()"
                        >
                          <v-icon dark>add_photo_alternate</v-icon>
                        </v-btn>
                        <v-btn
                          v-if="admin.image !== null"
                          class="mx-2"
                          fab
                          dark
                          x-small
                          color="primary"
                          @click="deleteFprofileImg"
                        >
                          <v-icon dark>delete_forever</v-icon>
                        </v-btn>
                      </v-list-item>
                    </v-list>
                  </v-card>
                  <!--  -->
                </v-menu>
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

        <!--  -->
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

        <!--  -->
        <v-dialog v-model="previewImgDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span>الصورة</span>
              <v-spacer></v-spacer>
              <v-btn icon small @click="previewImgDialog = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-img
                      :src="`https://api.letasknoelayha.com/${admin.image}`"
                      alt="صورة البروفايل"
                      aspect-ratio="1.7"
                      contain
                    ></v-img>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <!--  -->

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
                    @focus="changePasswordErrors = []"
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
                    @focus="changePasswordErrors = []"
                  />

                  <VTextFieldWithValidation
                    rules="required|password:@كلمة السر الجديدة"
                    label="تأكيد كلمة السر"
                    v-model="changePasswordForm.password_confirmation"
                    prepend-icon="lock"
                    :type="confirm_password_show ? 'text' : 'password'"
                    :append-icon="
                      confirm_password_show ? 'visibility_off' : 'visibility'
                    "
                    @click:append="
                      confirm_password_show = !confirm_password_show
                    "
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
import { mapActions } from "vuex";

export default {
  data() {
    return {
      admin: {},
      previewImgDialog: false,
      imgDialog: false,
      changePasswordDialog: false,
      old_password_show: false,
      new_password_show: false,
      confirm_password_show: false,
      changePasswordForm: {
        old_password: "",
        new_password: "",
        password_confirmation: "",
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
    // this.getAdmin();
  },
  mounted() {
    this.getAdmin();
  },
  methods: {
    ...mapActions(["showNotification", "hideNotification"]),
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
                this.showNotification("تمت العملية بنجاح");
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
    deleteFprofileImg() {
      let app = this;

      let formdata = new FormData();
      formdata.append("image", "");
      this.$http
        .post("admin/change-profile-pic")
        .then((res) => {
          if (res) {
            app.handlingImage = false;
            this.showNotification("تمت العملية بنجاح");
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
    },
    openChangePasswordDialog() {
      this.changePasswordErrors = [];
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
          this.changePasswordDialog = false;
          this.showNotification("تمت العملية بنجاح");
        })
        .catch(({ response }) => {
          console.log("response", response);
          self.changePasswordErrors = response.data.errors;
          // setTimeout(() => {
          //   self.changePasswordErrors = [];
          // }, 3000);
          this.connecting = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
