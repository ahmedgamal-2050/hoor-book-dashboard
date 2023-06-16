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
                edit === true ? "تعديل كوبون" : "إضافة كوبون جديد"
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
                    rules="required|min:2"
                    label="الكود"
                    v-model="admin.code"
                    prepend-icon="lock"
                    type="text"
                  />
                  
                  <VSelectWithValidation
                    label="النوع"
                    rules="required"
                    :items="['fixed', 'percentage']"           
                    prepend-icon="lock"
                    v-model="admin.type"
                  />

                  <VTextFieldWithValidation
                    rules="required"
                    v-model="admin.value"
                    label="القيمة"
                    prepend-icon="mail"
                    type="text"
                  />

                  <VTextFieldWithValidation
                    rules="required"
                    v-model="admin.expiry_date"
                    label="تاريخ انتهاء الصلاحية"
                    prepend-icon="date"
                    type="date"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    type="submit"
                    :disabled="invalid || !validated || connecting"
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

        <template v-slot:[`item.code`]="{ item }">
          <div v-if="item.code != null">
            <span>{{ item.code }}</span>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.value`]="{ item }">
          <div v-if="item.value != null">
            <span>{{ item.value }}</span>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.type`]="{ item }">
          <div v-if="item.type != null">
            <span>{{ item.type }}</span>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.expiry_date`]="{ item }">
          <div v-if="item.expiry_date != null">
            <span>{{ item.expiry_date }}</span>
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
import VSelectWithValidation from "../components/inputs/VSelectWithValidation";
import { mapActions } from "vuex";
import { BASE_API } from "../config/config";

export default {
  props: {
    title: {
      default: "الكوبونات",
      type: String,
    },
    api: {
      default: "coupons",
      type: String,
    },
  },
  data: () => ({
    admin: {
      code: "",
      type: "",
      value: "",
      expiry_date: ""
    },
    filter: {
      code: "",
      type: "",
    },
    panel: [ 0 ],
    isFiltering: false,
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
      { text: "الكود", value: "code", ...headerConst },
      { text: "القيمة", value: "value", ...headerConst },
      { text: "النوع", value: "type", ...headerConst },
      { text: "تاريخ انتهاء الصلاحية", value: "expiry_date", ...headerConst },
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
    baseUrl: window.location.origin,
    baseApi: BASE_API,
  }),
  components: {
    VTextFieldWithValidation,
    VSelectWithValidation
  },
  computed: {
    formTitle() {
      return this.edit ? "Edit coupon" : "Add coupon";
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
        if (res != null) {
          let items = res.data.data;
          const total = res.data.total;
          this.pagination.rowsPerPage = res.data.per_page;
          this.pagination.totalItems = res.data.total;
          this.pages = Math.ceil(
            this.pagination.totalItems / this.pagination.rowsPerPage
          );
          this.loading = false;
          resolve({
            items,
            total,
          });
        }
        else {
          let endpoint = `${this.baseApi}/api/admin/coupon?page=${this.page}`;

          this.$http.get(endpoint).then((res) => {
            let items = res.data.data;
            let meta = res.data;
            this.loading = false;
            resolve({
              items,
              meta,
            });
          })
          .catch((error) => {
            if (error.message.includes('code 401')) {
              console.log('auth error >>');
              this.$router.push({ path: '/auth/login' })
            }
          });
        }
      });
    },
    fetchFilter() {
      this.filterDataFromApi().then((data) => {
        this.requests = JSON.parse(JSON.stringify(data.items));
        //console.log('requests >>', data.items);
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
    filterDataFromApi() {
      this.loading = true;
      return new Promise((resolve) => {
        let endpoint = `${this.baseApi}/api/admin/coupon?page=${this.page}`;
        if (this.filter.code != '') endpoint += `&code=${this.filter.code}`;
        if (this.filter.type != '') endpoint += `&type=${this.filter.type}`;

        this.$http.get(endpoint).then((res) => {
          let items = res.data.data;
          let meta = res.data;
          this.loading = false;
          resolve({
            items,
            meta,
          });
        })
        .catch((error) => {
          if (error.message.includes('code 401')) {
            console.log('auth error >>');
            this.$router.push({ path: '/auth/login' })
          }
        });
      });
    },
    clearFilter() {
      this.fetch();
      this.isFiltering = false;
      this.filter = {
        code: "",
        type: "",
      };
    },
    close() {
      this.errors = [];
      this.dialog = false;
      this.admin = {
        code: "",
        type: "",
        value: "",
        expiry_date: "",
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
      this.admin.code = item.code;
      this.admin.type = item.type;
      this.admin.value = item.value;
      this.admin.expiry_date = item.expiry_date;
    },
    saveItem() {
      this.connecting = true;
      this.admin.expiry_date = this.$moment(this.admin.expiry_date).format('YYYY-MM-DD');
      let formdata = new FormData();
      if (this.admin.code) formdata.append("code", this.admin.code);
      if (this.admin.type) formdata.append("type", this.admin.type);
      if (this.admin.value) formdata.append("value", this.admin.value);
      if (this.admin.expiry_date) formdata.append("expiry_date", this.admin.expiry_date);

      if (this.edit) {
        let endpoint = `${this.baseApi}/api/admin/coupon/${this.admin.id}`;
        this.$http
          .put(endpoint, {
            code: this.admin.code,
            type: this.admin.type,
            value: this.admin.value,
            expiry_date: this.admin.expiry_date,
          })
          .then((res) => {
            if (res.data && res.data.status && !res.data.status.status) {
              this.showNotification(res.data.status.validation_message);
              this.connecting = false;
            }
            else {
              this.showNotification("تمت العملية بنجاح");
              this.fetch();
              this.alert.type = "warning";
              this.alert.message = "Edit coupon done";
              this.close();
              this.errors = [];
              this.admin = {
                id: null,
                code: "",
                type: "",
                value: "",
                expiry_date: "",
              };
              this.connecting = false;
            }
          })
          .catch(({ response }) => {
            this.errors = response.data.errors;
            this.connecting = false;
          });
      }
      else {
        this.$http
          .post(`${this.baseApi}/api/admin/coupon`, formdata)
          .then((res) => {
            if (res.data && res.data.status && !res.data.status.status) {
              this.showNotification(res.data.status.validation_message);
              this.connecting = false;
            }
            else {
              this.showNotification("تمت العملية بنجاح");
              this.fetch();
              this.alert.type = "info";
              this.alert.message = "Add coupon done!";
              this.close();
              this.errors = [];
              this.admin = {
                id: null,
                code: "",
                type: "",
                value: "",
                expiry_date: "",
              };
              this.connecting = false;
            }
          })
          .catch(({ response }) => {
            this.errors = response.data.errors;
            this.connecting = false;
          });
      }
    },
    deleteItem(item) {
      if (confirm("هل تود حذف هذا العنصر ؟")) {
        this.$http.delete(`${this.baseApi}/api/admin/coupon/${item.id}`).then((res) => {
          this.showNotification("تمت العملية بنجاح");
          this.fetch();
          this.alert.message = "Delete coupon done";
          this.alert.type = "success";
        });
      }
    },
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
