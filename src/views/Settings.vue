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
                edit === true ? "تعديل الاعداد" : "إضافة محافظة جديد"
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
                    rules="regex:^[0-9.]*$"
                    label="السعر"
                    v-model="admin.price"
                    prepend-icon="lock"
                    type="text"
                  />

                  <VTextFieldWithValidation
                    rules="regex:^[0-9.]*$"
                    label="النقط"
                    v-model="admin.points"
                    prepend-icon="lock"
                    type="text"
                  />
                  <VTextFieldWithValidation
                    rules="regex:^[0-9.]*$"
                    label="سعر النقطة"
                    v-model="admin.point_price"
                    prepend-icon="lock"
                    type="text"
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
      </v-toolbar>

      <!-- Filter -->
      <!-- <div class="pa-3">
        <v-expansion-panels v-model="panel" multiple>
          <v-expansion-panel>
            <v-expansion-panel-header>
              فلتر
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ValidationObserver
                ref="obs"
                v-slot="{ handleSubmit }">
                <form
                  ref="filterForm"
                  @submit.prevent="handleSubmit(fetchFilter)">
                  <v-card-text>
                    <v-row
                      align="center"
                      no-gutters
                    >
                      <v-col class="pa-2" cols="12" lg="4" sm="6">
                        <VTextFieldWithValidation
                          label="الإسم"
                          v-model="filter.name"
                          prepend-icon="lock"
                          type="text"
                        />
                      </v-col>
                    </v-row>      
                  </v-card-text>

                  <v-card-actions>
                    <v-btn
                      type="submit"
                      color="primary">
                      فلتر
                    </v-btn>
                    
                    <v-btn
                      @click="clearFilter"
                      color="secondary">
                      مسح الفلتر
                    </v-btn>
                  </v-card-actions>
                </form>
              </ValidationObserver>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

      </div> -->

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

        <template v-slot:[`item.type`]="{ item }">
          <div v-if="item.type != null">
            <span>{{ item.type }}</span>
          </div>

          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.value`]="{ item }">
          <div class="py-3">
            <div v-if="JSON.parse(item.value).price != null">
              <div class="font-weight-bold">السعر:</div>
              {{ JSON.parse(item.value).price }}
            </div>
            <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>

            <div v-if="JSON.parse(item.value).points != null">
              <div class="font-weight-bold">النقاط:</div>
              {{ JSON.parse(item.value).points }}
            </div>
            <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>

            <div v-if="JSON.parse(item.value).point_price != null">
              <div class="font-weight-bold">سعر النقطة:</div>
              {{ JSON.parse(item.value).point_price }}
            </div>
            <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
          </div>
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
          <!-- <v-tooltip right>
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
          </v-tooltip> -->
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
import { mapActions } from "vuex";
import { BASE_API } from "../config/config";

export default {
  props: {
    title: {
      default: "الاعدادات",
      type: String,
    },
    api: {
      default: "settings",
      type: String,
    },
  },
  data: () => ({
    admin: {
      price: 0,
      points: 0,
      point_price: 0,
    },
    filter: {
      name: "",
    },
    panel: [0],
    isFiltering: false,
    connecting: false,
    errors: [],
    edit: false,
    dialog: false,
    requests: [],
    totalRequests: 0,
    pagination: {},
    loading: false,
    apiLoading: false,
    headers: [
      { text: "#", value: "id", ...headerConst },
      { text: "النوع", value: "type", ...headerConst },
      { text: "القيمة", value: "value", ...headerConst },
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
  },
  computed: {
    formTitle() {
      return this.edit ? "Edit setting" : "Add setting";
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
      if (this.isFiltering) {
        this.fetchFilter();
      } else {
        this.fetch();
      }
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
        console.log("getDataFromApi requests >>", data.items);
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
          this.isFiltering = false;
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
        } else {
          let endpoint = `${this.baseApi}/api/admin/settings?page=${this.page}`;

          this.$http
            .get(endpoint)
            .then((res) => {
              let items = res.data.data;
              let meta = res.data;
              this.loading = false;
              resolve({
                items,
                meta,
              });
            })
            .catch((error) => {
              if (error.message.includes("code 401")) {
                console.log("auth error >>");
                this.$router.push({ path: "/auth/login" });
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
        let endpoint = `${this.baseApi}/api/admin/settings?page=${this.page}`;
        if (this.filter.name != "") endpoint += `&name=${this.filter.name}`;

        this.$http
          .get(endpoint)
          .then((res) => {
            this.isFiltering = true;
            let items = res.data.data;
            let meta = res.data;
            this.loading = false;
            resolve({
              items,
              meta,
            });
          })
          .catch((error) => {
            if (error.message.includes("code 401")) {
              console.log("auth error >>");
              this.$router.push({ path: "/auth/login" });
            }
          });
      });
    },
    clearFilter() {
      this.page = 1;
      this.fetch();
      this.isFiltering = false;
      this.filter = {
        name: "",
      };
    },
    close() {
      this.errors = [];
      this.dialog = false;
      this.admin = {
        points: 0,
        price: 0,
        points_price: 0,
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
      this.admin.points = item.points;
      this.admin.price = item.price;
      this.admin.point_price = item.point_price;
    },
    saveItem() {
      this.connecting = true;
      this.apiLoading = true;
      let formdata = new FormData();
      if (this.admin.point_price)
        formdata.append("point_price", this.admin.point_price);
      if (this.admin.price) formdata.append("price", this.admin.price);
      if (this.admin.points) formdata.append("points", this.admin.points);

      if (this.edit) {
        let endpoint = `${this.baseApi}/api/admin/settings/${this.admin.id}`;
        this.$http
          .put(endpoint, {
            point_price: this.admin.point_price,
            points: this.admin.points,
            price: this.admin.price,
          })
          .then((res) => {
            this.apiLoading = false;
            if (res.data && res.data.status && !res.data.status.status) {
              this.showNotification(res.data.status.validation_message);
              this.connecting = false;
            } else {
              this.showNotification("تمت العملية بنجاح");
              if (this.isFiltering) {
                this.fetchFilter();
              } else {
                this.fetch();
              }
              this.alert.type = "warning";
              this.alert.message = "Edit setting done";
              this.close();
              this.errors = [];
              this.admin = {
                id: null,
                points: 0,
                price: 0,
                point_price: 0,
              };
              this.connecting = false;
            }
          })
          .catch(({ response }) => {
            this.apiLoading = false;
            this.errors = response.data.errors;
            this.connecting = false;
          });
      } else {
        this.$http
          .post(`${this.baseApi}/api/admin/settings`, formdata)
          .then((res) => {
            this.apiLoading = false;
            if (res.data && res.data.status && !res.data.status.status) {
              this.showNotification(res.data.status.validation_message);
              this.connecting = false;
            } else {
              this.showNotification("تمت العملية بنجاح");
              this.fetch();
              this.alert.type = "info";
              this.alert.message = "Add setting done!";
              this.close();
              this.errors = [];
              this.admin = {
                id: null,
                points: 0,
                price: 0,
                point_price: 0,
              };
              this.connecting = false;
            }
          })
          .catch(({ response }) => {
            this.apiLoading = false;
            this.errors = response.data.errors;
            this.connecting = false;
          });
      }
    },
    deleteItem(item) {
      if (confirm("هل تود حذف هذا العنصر ؟")) {
        this.$http
          .delete(`${this.baseApi}/api/admin/settings/${item.id}`)
          .then((res) => {
            this.showNotification("تمت العملية بنجاح");
            this.fetch();
            this.alert.message = "Delete setting done";
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
