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
                edit === true ? "تعديل طلب" : "إضافة طلب جديد"
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
                  
                  <VSelectWithValidation
                    label="الحالة"
                    rules="required"
                    :items="['Pending','Processing','Shipped','Delivered','Cancelled','Refunded']"           
                    prepend-icon="lock"
                    v-model="admin.status"
                  />
                  
                  <VSelectWithValidation
                    label="شركات الشحن #"
                    rules="required"
                    :items="shipping_companies_ids"           
                    prepend-icon="lock"
                    v-model="admin.shipping_companies_id"
                  />
                  
                  <VSelectWithValidation
                    label="حالة الدفع"
                    rules="required"
                    :items="['Pending','Paid']"           
                    prepend-icon="lock"
                    v-model="admin.payment_status"
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
                  <v-btn @click="close" color="primary">إغلاق</v-btn>
                </v-card-actions>
              </form>
            </ValidationObserver>
          </v-card>
        </v-dialog>
        <!-- End Add/Edit Dialog Form -->
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
      
      <template v-slot:[`item.status`]="{ item }">
        <div v-if="item.status != null">
          <span>{{ item.status }}</span>
        </div>
        <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
      </template>

      <template v-slot:[`item.shipping_companies_id`]="{ item }">
        <div v-if="item.shipping_companies_id != null">
          <span>{{ item.shipping_companies_id }}</span>
        </div>
        <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
      </template>

      <template v-slot:[`item.payment_status`]="{ item }">
        <div v-if="item.payment_status != null">
          <span>{{ item.payment_status }}</span>
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
import VSelectWithValidation from "../components/inputs/VSelectWithValidation";
import { mapActions } from "vuex";

export default {
  props: {
    title: {
      default: "الطلبات",
      type: String,
    },
    api: {
      default: "orders",
      type: String,
    },
  },
  data: () => ({
    admin: {
      status: "",
      shipping_companies_id: "",
      payment_status: "",
    },
    connecting: false,
    errors: [],
    edit: false,
    dialog: false,
    requests: [],
    shipping_companies_ids: [],
    totalRequests: 0,
    pagination: {},
    loading: false,
    userFocus: null,
    headers: [
      { text: "#", value: "id", ...headerConst },
      { text: "الحالة", value: "status", ...headerConst },
      { text: "شركة الشحن #", value: "shipping_companies_id", ...headerConst },
      { text: "حالة الدفع", value: "status", ...headerConst },
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
  }),
  components: {
    VSelectWithValidation
  },
  computed: {
    formTitle() {
      return this.edit ? "Edit user" : "Add user";
    },
  },
  watch: {
    dialog(val) {
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
      this.getShippingCampaniesId();
      if (this.loading) return;
    },
    getDataFromApi(res = null) {
      this.loading = true;
      return new Promise((resolve) => {
        if (res == null) {
          let endpoint = `http://143.110.170.3/api/admin/orders?page=${this.page}`;

          this.$http.get(endpoint).then((res) => {
            let items = res.data.data;
            console.log('getDataFromApi items >>', items);
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
    getShippingCampaniesId(res = null) {
      this.loading = true;
      return new Promise(() => {
        if (res == null) {
          let endpoint = `http://143.110.170.3/api/admin/shipping-companies?noPaginate=1`;

          this.$http.get(endpoint).then((res) => {
            let items = res.data.map((item) => {
              return item.id;
            });
            console.log('getDataFromApi items >>', items);
            this.shipping_companies_ids = items;
          });
        }
      });
    },
    close() {
      this.errors = [];
      this.dialog = false;
      this.admin = {
        status: "",
        shipping_companies_id: "",
        payment_status: "",
      };
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
      this.admin.status = item.status;
      this.admin.shipping_companies_id = item.shipping_companies_id;
      this.admin.payment_status = item.payment_status;
    },
    saveItem() {
      this.connecting = true;
      let formdata = new FormData();
      if (this.admin.status) formdata.append("status", this.admin.status);
      if (this.admin.shipping_companies_id) formdata.append("shipping_companies_id", this.admin.shipping_companies_id);
      if (this.admin.payment_status) formdata.append("payment_status", this.admin.payment_status);

      if (this.edit) {
        let endpoint = "";
        endpoint = `http://143.110.170.3/api/admin/orders/${this.admin.id}`;
        this.$http
          .put(endpoint, {
            status: this.admin.status,
            shipping_companies_id: this.admin.shipping_companies_id,
            payment_status: this.admin.payment_status,
          })
          .then((res) => {
            this.showNotification("تمت العملية بنجاح");
            this.fetch();
            this.alert.type = "warning";
            this.alert.message = "Edit user done";
            this.close();
            this.errors = [];
            this.admin = {
              id: null,
              status: "",
              shipping_companies_id: "",
              payment_status: "",
            };
          })
          .catch(({ response }) => {
            this.errors = response.data.errors;
          });
      } else {
        this.$http
          .post(`http://143.110.170.3/api/admin/orders`, formdata)
          .then((res) => {
            this.showNotification("تمت العملية بنجاح");
            this.fetch();
            this.alert.type = "info";
            this.alert.message = "Add user done!";
            this.close();
            this.errors = [];
            this.admin = {
              id: null,
              status: "",
              shipping_companies_id: "",
              payment_status: "",
            };
          })
          .catch(({ response }) => {
            this.errors = response.data.errors;
          });
      }
      this.connecting = false;
    },
    deleteItem(item) {
      // const index = this.requests.indexOf(item);
      if (confirm("هل تود حذف هذا العنصر ؟")) {
        this.$http.delete(`http://143.110.170.3/api/admin/orders/${item.id}`).then((res) => {
          this.showNotification("تمت العملية بنجاح");
          this.fetch();
          this.alert.message = "Delete user done";
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
