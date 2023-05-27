/* eslint-disable */
<template>
  <v-flex xs12>
    <div class="elevation-2">
      <v-toolbar flat color="white">
        <v-toolbar-title style="margin-left:10px">{{ title }}</v-toolbar-title>

        <!-- Start Add/Edit Dialog Form -->
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span>{{
                edit === true ? "تعديل فئة" : "إضافة فئة جديد"
              }}</span>
              <v-spacer></v-spacer>
              <v-btn icon small @click="close">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <ValidationObserver
              ref="obs"
              v-slot="{ invalid, validated, handleSubmit }"
            >
              <form
                ref="changePasswordForm"
                @submit.prevent="handleSubmit(saveItem)"
              >
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
                    rules="required|min:3"
                    label="الإسم"
                    v-model="admin.name"
                    prepend-icon="lock"
                    type="text"
                  />

                  <VTextFieldWithValidation
                    rules="required|min:3"
                    v-model="admin.name_ar"
                    label="الإسم بالعربي"
                    prepend-icon="mail"
                    type="text"
                  />  
                  
                  <VFileInputWithValidation
                    label="الصورة"
                    variant="filled"
                    prepend-icon="camera"
                    rules="required"
                    v-model="admin.image"
                  />
                  <div>
                    <v-avatar dark v-bind="attrs" v-on="on">
                      <span v-if="admin.image === null">لا يوجد صورة</span>

                      <img
                        v-else
                        :src="`http://localhost:8080/${admin.image}`"
                        alt="صورة المنتج"
                      />
                    </v-avatar>
                  </div>

                  <VTextFieldWithValidation
                    v-model="admin.parent_id"
                    label="أصل #"
                    prepend-icon="mail"
                    type="text"
                  />
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    type="submit"
                    :disabled="invalid || !validated"
                    :loading="connecting"
                    color="primary"
                    >حفظ</v-btn
                  >
                  <v-btn @click="close" color="secondary">إغلاق</v-btn>
                </v-card-actions>
              </form>
            </ValidationObserver>
          </v-card>
        </v-dialog>
        <!-- End Add/Edit Dialog Form -->

        <v-spacer></v-spacer>

        <!-- start Add action -->
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              fab
              small
              v-bind="attrs"
              v-on="on"
              @click="editing('add')"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </template>
          <span>اضافة عنصر جديد</span>
        </v-tooltip>
        <!-- end Add action -->
      </v-toolbar>

      <v-data-table
        loading-text="انتظر قليلا..."
        :headers="headers"
        :items="requests"
        :page.sync="page"
        :server-items-length="totalRequests"
        :loading="loading"
        hide-default-footer
        item-key="id"
        :options.sync="pagination"
      >
      
        <template v-slot:[`item.id`]="{ item }">
          <span v-if="item.id != null">{{ item.id }}</span>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.parent_id`]="{ item }">
          <div v-if="item.parent_id != null">
            <span>{{ item.parent_id }}</span>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.image`]="{ item }">
          <!--  -->
          <v-avatar dark v-bind="attrs" v-on="on">
            <img
              v-if="item.image === null"
              src="../assets/imgs/profile-img.jpg"
              alt="صورة المنتج"
            />
            <img
              v-else
              :src="`https://api.letasknoelayha.com/${item.image}`"
              alt="صورة المنتج"
            />
          </v-avatar>
        </template>
        
        <template v-slot:[`item.name`]="{ item }">
          <div v-if="item.name != null">
            <span>{{ item.name }}</span>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.name_ar`]="{ item }">
          <div v-if="item.name_ar != null">
            <span>{{ item.name_ar }}</span>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.products_count`]="{ item }">
          <div v-if="item.products_count != null">
            <span>{{ item.products_count }}</span>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.created_at`]="{ item }">
          <span v-if="item.created_at != null">{{ item.created_at | moment("dddd, MMMM Do YYYY") }}</span>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.updated_at`]="{ item }">
          <span v-if="item.updated_at != null">{{ item.updated_at | moment("dddd, MMMM Do YYYY") }}</span>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <!-- start Add-Edit action -->
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="orange"
                icon
                x-small
                v-bind="attrs"
                v-on="on"
                @click="editing('edit', item)"
              >
                <v-icon>edit</v-icon>
              </v-btn>
            </template>
            <span>تعديل</span>
          </v-tooltip>
          <!-- end Add-Edit action -->

          <!-- start delete action -->
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="red"
                icon
                x-small
                v-bind="attrs"
                v-on="on"
                @click="deleteItem(item)"
              >
                <v-icon>delete_forever</v-icon>
              </v-btn>
            </template>
            <span>حذف</span>
          </v-tooltip>
          <!-- end delete action -->
        </template>
        
        <template slot="pageText" slot-scope="props">
          Pages {{ props.pageStart }} - {{ props.pageStop }} من
          {{ props.itemsLength }}
        </template>

        <template slot="no-data" class="text-xs-center">
          <v-alert :value="true" color="error" class="text-xs-center" outlined>
            <v-icon class="red--text">
              warning
            </v-icon>
            لا يوجد عناصر
          </v-alert>
        </template>
      </v-data-table>

      <div class="text-xs-center pt-2">
        <v-pagination
          total-visible="6"
          color="primary"
          v-model="page"
          :length="pages"
        ></v-pagination>
      </div>
    </div>
  </v-flex>
</template>

<script>
const headerConst = { align: "center", sortable: false };
import VTextFieldWithValidation from "../components/inputs/VTextFieldWithValidation";
import VFileInputWithValidation from "../components/inputs/VFileInputWithValidation";
import { mapActions } from "vuex";

export default {
  props: {
    title: {
      default: "الفئات",
      type: String,
    },
    api: {
      default: "categories",
      type: String,
    },
  },
  data: () => ({
    admin: {
      name: "",
      name_ar: "",
      image: "",
      parent_id: ""
    },
    connecting: false,
    errors: [],
    edit: false,
    dialog: false,
    requests: [],
    totalRequests: 0,
    pagination: {},
    loading: false,
    
    headers: [
      { text: "#", value: "id", ...headerConst },
      { text: "أصل #", value: "parent_id", ...headerConst },
      { text: "الصورة", value: "image", ...headerConst },
      { text: "الاسم", value: "name", ...headerConst },
      { text: "الاسم بالعربية", value: "name_ar", ...headerConst },
      { text: "عدد المنتجات", value: "products_count", ...headerConst },
      { text: "أنشئت في", value: "created_at", ...headerConst },
      { text: "تم التحديث في", value: "updated_at", ...headerConst },
      { text: "عمليات", value: "actions", ...headerConst },
    ],
    editedItem: null,
    alert: {
      message: "",
      type: "success",
    },
    page: 1,
    pages: 0,
    index: null,
    file: null,

  }),
  components: {
    VTextFieldWithValidation,
    VFileInputWithValidation
  },
  computed: {
    formTitle() {
      return this.edit ? "Edit category" : "Add category";
    },
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.package = {
          id: null,
          package: null,
          bidBiddersCount: null,
        };
      }
      val || this.close();
    },
    page(val) {
      this.pagination.page = val;
      this.fetch();
    },
  },
  created() {
    if (this.loading) return;
    this.fetch();
  },
  methods: {
    ...mapActions(["showNotification"]),
    fetch() {
      this.getDataFromApi().then((data) => {
        this.requests = JSON.parse(JSON.stringify(data.items));
        console.log('getDataFromApi requests >>', data.items);
        let meta = data.meta;
        this.totalRequests = meta.total;
        this.pagination.rowsPerPage = meta.per_page;
        this.pagination.totalItems = meta.total;
        this.pages = Math.ceil(
          this.pagination.totalItems / this.pagination.rowsPerPage
        );
      });
      if (this.loading) return;
    },
    getDataFromApi(res = null) {
      this.loading = true;
      return new Promise((resolve) => {
        if (res == null) {
          let endpoint = `http://143.110.170.3/api/admin/categories?page=${this.page}`;

          this.$http.get(endpoint).then((res) => {
            let items = res.data.data;
            let meta = res.data;
            this.loading = false;
            resolve({
              items,
              meta,
            });
          });
        }
      });
    },
    close() {
      this.errors = [];
      this.dialog = false;
      this.admin = {
        name: "",
        name_ar: "",
        image: "",
        parent_id: null
      };
      this.productDiscription = "";
    },
    editing(process, item = this.admin) {
      if (process === "add") {
        this.$nextTick(() => {
          this.$refs.obs.reset();
        });
        this.edit = false;
      } else {
        this.edit = true;
        this.$nextTick(() => {
          this.$refs.obs.validate();
        });
      }
      this.dialog = !this.dialog;
      this.admin.id = item.id;
      this.admin.name = item.name;
      this.admin.name_ar = item.name_ar;
      this.admin.image = item.image;
      this.admin.parent_id = item.parent_id;
    },
    saveItem() {
      this.connecting = true;
      let formdata = new FormData();
      if (this.admin.name) formdata.append("name", this.admin.name);
      if (this.admin.name_ar) formdata.append("name_ar", this.admin.name_ar);
      if (this.admin.image) formdata.append("image", this.admin.image);
      if (this.admin.parent_id) formdata.append("parent_id", this.admin.parent_id);

      if (this.edit) {
        let endpoint = `http://143.110.170.3/api/admin/categories/${this.admin.id}`;
        this.$http
          .post(endpoint, formdata)
          .then((res) => {
            if (!res.data.status.status) {
              this.showNotification(res.data.status.validation_message);
            }
            else {
              this.showNotification("تمت العملية بنجاح");
              this.fetch();
              this.alert.type = "warning";
              this.alert.message = "Edit category done";
              this.close();
              this.errors = [];
              this.admin = {
                id: null,
                name: "",
                name_ar: "",
                image: "",
                parent_id: null
              };
            }
          })
          .catch(({ response }) => {
            this.errors = response.data.errors;
          });
      } else {
        this.$http
          .post(`http://143.110.170.3/api/admin/categories`, formdata)
          .then((res) => {
            if (!res.data.status.status) {
              this.showNotification(res.data.status.validation_message);
            }
            else {
              this.showNotification("تمت العملية بنجاح");
              this.fetch();
              this.alert.type = "info";
              this.alert.message = "Add category done!";
              this.close();
              this.errors = [];
              this.admin = {
                id: null,
                name: "",
                name_ar: "",
                image: "",
                parent_id: "",
              };
            }
          })
          .catch(({ response }) => {
            this.errors = response.data.errors;
          });
      }
      this.connecting = false;
    },
    deleteItem(item) {
      if (confirm("هل تود حذف هذا العنصر ؟")) {
        this.$http.delete(`http://143.110.170.3/api/admin/categories/${item.id}`).then((res) => {
          this.showNotification("تمت العملية بنجاح");
          this.fetch();
          this.alert.message = "Delete category done";
          this.alert.type = "success";
        });
      }
    },
    onChangeFileUpload($event) {
      console.log('onChangeFileUpload e >>', $event);
      if ($event && $event.files && $event.files.length > 0) {
        this.file = $event.files[0]
        console.log('onChangeFileUpload file >>', this.file);
        this.encodeImage(this.file)
      }
      else {
        this.admin.image = $event
      }
    },
    encodeImage (input) {
      if (input) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.admin.image = e.target.result
          console.log('onChangeFileUpload image >>', e.target.result);
        }
        reader.readAsDataURL(input)
      }
    }
  },
};
</script>

<style scoped lang="scss">
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
.v-data-table > .v-data-table__wrapper > table > tfoot > tr > td,
.v-data-table > .v-data-table__wrapper > table > thead > tr > td {
  height: 80px !important;
}
</style>
