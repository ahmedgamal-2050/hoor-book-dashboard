/* eslint-disable */
<template>
  <v-flex xs12>
    <div class="elevation-2">
      <v-toolbar flat color="white">
        <v-toolbar-title style="margin-left:10px">{{ title }}</v-toolbar-title>

        <!--  -->
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span>{{
                edit === true ? "تعديل عنصر" : "إضافة عنصر جديد"
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
                    v-model="item.title"
                    prepend-icon="lock"
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
        <!--  -->

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
        <template v-slot:[`item.title`]="{ item }">
          <span v-if="item.title != null">{{ item.title }}</span>
          <v-chip small v-else color="primary" dark>غير متوفر</v-chip>
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

        <!-- <v-alert slot="no-results" :value="true" color="error" icon="warning">
          there's no data found "{{ search }}"
        </v-alert> -->
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
import VTextFieldWithValidation from "./inputs/VTextFieldWithValidation";
import { mapActions } from "vuex";

export default {
  props: {
    title: {
      default: "",
      type: String,
    },
    api: {
      default: "",
      type: String,
    },
  },
  data: () => ({
    item: {
      title: "",
    },
    connecting: false,
    errors: [],
    edit: false,
    dialog: false,
    requests: [],
    totalRequests: 0,
    pagination: {},
    loading: false,
    userFocus: null,
    headers: [
      { text: "الإسم", value: "title", ...headerConst },
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
    VTextFieldWithValidation,
  },
  computed: {
    formTitle() {
      return this.edit ? "Edit user" : "Add user";
    },
    // pages() {
    //   if (
    //     this.pagination.rowsPerPage == null ||
    //     this.pagination.totalItems == null
    //   )
    //     return 0;
    //   return Math.ceil(
    //     this.pagination.totalItems / this.pagination.rowsPerPage
    //   );
    // },
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
    // pagination: {
    //   handler: function(after, before) {
    //     console.log(
    //       "detect pagination obj changed => ",
    //       _.isEqual(before, after)
    //     );

    //     console.log("before => ", before);
    //     console.log("after => ", after);
    //     if (!_.isEqual(after, before)) {
    //       this.pages = Math.ceil(after.totalItems / after.rowsPerPage);
    //       console.log("after.totalItems", after.totalItems);
    //     }
    //   },
    //   deep: true,
    // },
  },
  created() {
    if (this.loading) return;
    this.fetch();
  },
  methods: {
    ...mapActions(["showNotification"]),
    fetch() {
      this.getDataFromApi().then((data) => {
        this.requests = data.items;
        this.totalRequests = data.total;
      });
      if (this.loading) return;
    },
    getDataFromApi(res = null) {
      this.loading = true;
      return new Promise((resolve) => {
        // const {
        //   sortBy,
        //   descending,
        //   page,
        //   rowsPerPage,
        //   totalItems,
        // } = this.pagination;
        if (res != null) {
          console.log("res res => ", res);
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
          let endpoint = "";
          endpoint = `admin/${this.api}`;

          this.$http.get(endpoint).then((res) => {
            console.log(res);
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
          });
        }
      });
    },
    close() {
      this.dialog = false;
      this.item = {
        title: "",
      };
    },
    editing(process, item = this.item) {
      this.$nextTick(() => {
        this.$refs.obs.reset();
      });
      if (process === "add") {
        this.edit = false;
      } else {
        this.edit = true;
      }
      this.dialog = !this.dialog;
      this.item.id = item.id;
      this.item.title = item.title;
    },
    saveItem() {
      this.connecting = true;
      let formdata = new FormData();
      if (this.item.title) formdata.append("title", this.item.title);

      if (this.edit) {
        let endpoint = "";
        endpoint = `admin/${this.api}/${this.item.id}`;
        this.$http
          .put(endpoint, { title: this.item.title })
          .then((res) => {
            console.log(res);
            this.showNotification("تمت العملية بنجاح");
            this.fetch();
            this.alert.type = "warning";
            this.alert.message = "Edit user done";
            this.close();
            this.errors = [];
            this.item = {
              id: null,
              title: "",
            };
          })
          .catch(({ response }) => {
            this.errors = response.data.errors;
          });
      } else {
        this.$http
          .post(`admin/${this.api}`, formdata)
          .then((res) => {
            this.showNotification("تمت العملية بنجاح");
            console.log(res);
            this.fetch();
            this.alert.type = "info";
            this.alert.message = "Add user done!";
            this.close();
            this.errors = [];
            this.item = {
              id: null,
              title: "",
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
        this.$http.delete(`admin/${this.api}/${item.id}`).then((res) => {
          console.log(res);
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

<style scoped>
ul {
  list-style: none;
}
</style>
