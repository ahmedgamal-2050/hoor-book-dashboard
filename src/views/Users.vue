/* eslint-disable */
<template>
  <v-flex xs12>
    <div class="elevation-2">
      <v-toolbar flat color="white">
        <v-toolbar-title style="margin-left:10px">المستخدمين</v-toolbar-title>

        <!-- user info dialog -->
        <v-dialog
          v-model="userInfoDialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-toolbar dark color="primary">
              <v-toolbar-title>{{
                userFocus.full_name || userFocus.nick_name
              }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn icon dark @click="userInfoDialog = false">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card class="mx-auto" outlined>
              <v-subheader>
                <v-list-item-title class="">البيانات كاملة</v-list-item-title>
              </v-subheader>
              <v-list-item three-line>
                <v-list-item-content>
                  <!-- <v-list-item-title class="">Headline 5</v-list-item-title> -->
                  <v-list-item-subtitle>
                    <span class="black--text">الإسم:</span>
                    <span v-if="userFocus.full_name !== null">
                      {{ userFocus.full_name }}
                    </span>

                    <v-chip
                      v-else
                      class="ma-2"
                      color="primary"
                      text-color="white"
                    >
                      غير متوفر
                    </v-chip>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <span class="black--text">الإسم المستعار :</span>
                    <span v-if="userFocus.nick_name !== null">
                      {{ userFocus.nick_name }}
                    </span>
                    <v-chip
                      v-else
                      class="ma-2"
                      color="primary"
                      text-color="white"
                    >
                      غير متوفر
                    </v-chip>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <span class="black--text">البريد الإليكتروني :</span>
                    <v-chip class="ma-2" color="primary" text-color="white">
                      <v-avatar left>
                        <v-icon>{{
                          userFocus.email_verified_at !== null
                            ? "check_circle"
                            : "cancel"
                        }}</v-icon>
                      </v-avatar>
                      {{ userFocus.email }}
                    </v-chip>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <span class="black--text">الهاتف :</span>
                    <v-chip class="ma-2" color="primary" text-color="white">
                      <v-avatar left>
                        <v-icon>{{
                          userFocus.sms_verified_at !== null
                            ? "check_circle"
                            : "cancel"
                        }}</v-icon>
                      </v-avatar>
                      {{ userFocus.phone }}
                    </v-chip>
                  </v-list-item-subtitle>

                  <v-list-item-subtitle>
                    <span class="black--text">الموقع :</span>
                    <span
                      v-if="
                        userFocus.country || userFocus.city || userFocus.state
                      "
                    >
                      {{ userFocus.country.title_en }}
                      {{ userFocus.city.title_en }}
                      {{ userFocus.state.title_en }}
                    </span>
                    <v-chip
                      v-else
                      class="ma-2"
                      color="primary"
                      text-color="white"
                    >
                      غير متوفر
                    </v-chip>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <span class="black--text">النوع :</span>
                    <span v-if="userFocus.gender != null">
                      <v-chip
                        class="ma-2"
                        :color="
                          userFocus.gender === 'male' ? 'primary' : 'green'
                        "
                        dark
                      >
                        {{ userFocus.gender === "male" ? "ذكر" : "أنثى" }}
                      </v-chip>
                    </span>
                    <v-chip v-else color="primary" dark>غير متوفر</v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <!-- <v-list-item-avatar tile size="100" color="grey">
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"
                  ></v-img>
                </v-list-item-avatar> -->
              </v-list-item>
            </v-card>
          </v-card>
        </v-dialog>
        <!--  -->
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>

        <!--  -->
        <v-menu
          v-model="searchMenu"
          :close-on-content-click="false"
          :nudge-width="400"
          offset-x
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" fab small dark v-bind="attrs" v-on="on">
              <v-icon>search</v-icon>
            </v-btn>
          </template>

          <v-card>
            <v-list>
              <v-list-item>
                <v-text-field
                  @keyup.native="makeSearch($event)"
                  v-model="searchFullName"
                  append-icon="search"
                  label="الإسم الكامل"
                  single-line
                  hide-details
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-text-field
                  @keyup.native="makeSearch($event)"
                  v-model="searchNickName"
                  append-icon="search"
                  label="الإسم المستعار"
                  single-line
                  hide-details
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-text-field
                  @keyup.native="makeSearch($event)"
                  v-model="searchPhone"
                  append-icon="search"
                  label="رقم الهاتف"
                  single-line
                  hide-details
                ></v-text-field>
              </v-list-item>
              <v-list-item>
                <v-radio-group @change="makeSearch" v-model="searchGender" row>
                  <v-radio label="ذكر" value="male"></v-radio>
                  <v-radio label="أنثى" value="female"></v-radio>
                  <v-radio label="الكل" value="0"></v-radio>
                </v-radio-group>
              </v-list-item>
            </v-list>

            <!-- <v-card-actions>
              <v-btn text @click="searchMenu = false">Cancel</v-btn>
              <v-btn color="primary" text @click="searchMenu = false"
                >Save</v-btn
              >
            </v-card-actions> -->
          </v-card>
        </v-menu>
        <!--  -->
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
        <template v-slot:[`item.full_name`]="{ item }">
          <span v-if="item.full_name != null">{{ item.full_name }}</span>
          <v-chip small v-else color="primary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.email`]="{ item }">
          <span v-if="item.email != null">{{ item.email }}</span>
          <v-chip small v-else color="primary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.phone`]="{ item }">
          <span v-if="item.phone != null">{{
            lodash.truncate(item.phone, { length: 15 })
          }}</span>
          <v-chip small v-else color="primary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.gender`]="{ item }">
          <span v-if="item.gender != null">
            <v-chip
              small
              :color="item.gender === 'male' ? 'primary' : 'green'"
              dark
            >
              {{ item.gender === "male" ? "ذكر" : "أنثى" }}
            </v-chip>
          </span>
          <v-chip small v-else color="primary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.user_friendships`]="{ item }">
          <!-- start deactivate action -->
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :color="item.user_friendships > 0 ? 'primary' : 'red'"
                fab
                x-small
                v-bind="attrs"
                v-on="on"
                :disabled="item.user_friendships === 0"
                @click="userFriendships(item)"
              >
                {{ item.user_friendships }}
              </v-btn>
            </template>
            <span>أصدقاء {{ item.full_name || item.nick_name }} </span>
          </v-tooltip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <!-- start deactivate action -->
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                icon
                x-small
                v-bind="attrs"
                v-on="on"
                @click="userDetails(item)"
              >
                <v-icon>assignment_ind</v-icon>
              </v-btn>
            </template>
            <span>كل بيانات {{ item.full_name || item.nick_name }} </span>
          </v-tooltip>
          <!-- start deactivate action -->
          <v-tooltip v-if="item.deleted_at === null" right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="orange"
                icon
                x-small
                v-bind="attrs"
                v-on="on"
                @click="userDeactive(item)"
              >
                <v-icon>not_interested</v-icon>
              </v-btn>
            </template>
            <span>تعطيل {{ item.full_name || item.nick_name }} </span>
          </v-tooltip>
          <!-- end deactivate action -->
          <!-- start deactivate action -->
          <v-tooltip v-if="item.deleted_at !== null" right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="green"
                icon
                x-small
                v-bind="attrs"
                v-on="on"
                @click="userActive(item)"
              >
                <v-icon>restore</v-icon>
              </v-btn>
            </template>
            <span>تنشيط {{ item.full_name || item.nick_name }} </span>
          </v-tooltip>
          <!-- end deactivate action -->

          <!-- start deactivate friendship action -->
          <v-tooltip v-if="item.can_friendship === 1" right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="orange"
                icon
                x-small
                v-bind="attrs"
                v-on="on"
                @click="userDeactiveFriendship(item)"
              >
                <v-icon>not_interested</v-icon>
              </v-btn>
            </template>
            <span> تعطيل المفضلة ل{{ item.full_name || item.nick_name }} </span>
          </v-tooltip>
          <!-- end deactivate friendship action -->
          <!-- start deactivate  friendship action -->
          <v-tooltip v-if="item.can_friendship !== 1" right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="green"
                icon
                x-small
                v-bind="attrs"
                v-on="on"
                @click="userActiveFriendship(item)"
              >
                <v-icon>restore</v-icon>
              </v-btn>
            </template>
            <span>تنشيط المفضلة ل{{ item.full_name || item.nick_name }} </span>
          </v-tooltip>
          <!-- end deactivate friendship action -->
          <!-- start delete friendship action -->
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
            <span>حذف {{ item.full_name || item.nick_name }} </span>
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
    <!--  -->
    <!-- user info dialog -->
    <v-dialog
      v-model="userFriendsDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>الأصدقاء</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="userFriendsDialog = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card class="mx-auto" outlined>
          <v-container fluid>
            <v-row>
              <v-col v-for="friend in userFriends" :key="friend.id" xs="6">
                <v-card class="mx-auto" max-width="344" outlined>
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-title class="title mb-1">
                        {{ friend.full_name }}
                      </v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-avatar>
                      <img
                        v-if="friend.gender === 'male'"
                        :src="getImgUrl('profile-img.jpg')"
                        alt="صورة البروفايل"
                      />
                      <img
                        v-else
                        :src="getImgUrl('female.png')"
                        alt="صورة البروفايل"
                      />
                    </v-list-item-avatar>
                  </v-list-item>
                  <v-list-item-group>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>phone</v-icon>
                      </v-list-item-icon>

                      <v-list-item-content>
                        <v-list-item-title
                          v-text="friend.phone"
                        ></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>email</v-icon>
                      </v-list-item-icon>

                      <v-list-item-content>
                        <v-list-item-title
                          v-text="friend.email"
                        ></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-card>
    </v-dialog>
    <!--  -->
  </v-flex>
</template>

<script>
const headerConst = {
  align: "center",
  sortable: false,
};
import { mapActions } from "vuex";
export default {
  props: {
    title: {
      default: "",
      type: String,
    },
    icon: {
      default: "",
      type: String,
    },
  },
  data: () => ({
    emailObj: {
      to: "",
      name: "",
      title: "",
      message: "",
    },
    searchMenu: false,
    errors: [],
    searchFullName: "",
    searchNickName: "",
    searchPhone: "",
    searchGender: "0",
    userInfoDialog: false,
    userFriendsDialog: false,
    userFriends: [],
    dialog: false,
    requests: [],
    totalRequests: 0,
    pagination: {},
    loading: false,
    approve: false,
    userFocus: {},
    headers: [
      {
        text: "الإسم",
        value: "full_name",
        ...headerConst,
      },
      {
        text: "البريد الإليكتروني",
        value: "email",
        ...headerConst,
      },
      {
        text: "الهاتف",
        value: "phone",
        ...headerConst,
      },
      {
        text: "النوع",
        value: "gender",
        ...headerConst,
      },
      {
        text: "عدد الأصدقاء",
        value: "user_friendships",
        ...headerConst,
      },
      {
        text: "عمليات",
        value: "actions",
        ...headerConst,
      },
    ],
    alert: {
      message: "",
      type: "success",
    },
    page: 1,
    pages: 0,
    index: null,
    filterCategory: null,
    categories: [],
  }),
  computed: {},
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
    userDetails(item) {
      this.userFocus = item;
      this.userInfoDialog = true;
    },
    deleteuser(item) {
      this.approve = true;
      // const index = this.requests.indexOf(item);
      if (confirm("هل تريد حساب هذا المستخدم نهائيا ؟")) {
        // console.log(item.userId);
        this.$http
          .delete("admin/user-destroy/" + item.id + "?page=" + this.page)
          .then((res) => {
            console.log(res);
            this.showNotification("تمت العملية بنجاح");
            this.fetch();
            this.approve = false;
          });
      } else {
        this.approve = false;
      }
    },
    userActive(item) {
      this.approve = true;
      // const index = this.requests.indexOf(item);
      if (confirm("هل تريد إعادة تفعيل حساب هذا المستخدم ؟")) {
        // console.log(item.userId);
        this.$http
          .post("admin/user-cancel_trached/" + item.id + "?page=" + this.page)
          .then((res) => {
            console.log(res);
            this.showNotification("تمت العملية بنجاح");
            this.fetch();
            this.approve = false;
          });
      } else {
        this.approve = false;
      }
    },
    userDeactive(item) {
      this.approve = true;
      // const index = this.requests.indexOf(item);
      if (confirm("هل تريد تعطيل حساب هذا المستخدم ؟")) {
        this.$http.post("admin/user-trached/" + item.id).then((res) => {
          console.log(res);
          this.fetch();
          this.showNotification("تمت العملية بنجاح");
          this.approve = false;
        });
      } else {
        this.approve = false;
      }
    },
    userActiveFriendship(item) {
      this.approve = true;
      // const index = this.requests.indexOf(item);
      if (confirm("هل تريد إعادة تفعيل المفضلة لحساب هذا المستخدم  ؟")) {
        // console.log(item.userId);
        this.$http
          .post("admin/can-friendship/" + item.id + "?page=" + this.page)
          .then((res) => {
            console.log(res);
            this.showNotification("تمت العملية بنجاح");
            this.fetch();
            this.approve = false;
          });
      } else {
        this.approve = false;
      }
    },
    userDeactiveFriendship(item) {
      this.approve = true;
      // const index = this.requests.indexOf(item);
      if (confirm("هل تريد تعطيل المفضلة لحساب هذا المستخدم ؟")) {
        this.$http.post("admin/can-friendship/" + item.id).then((res) => {
          console.log(res);
          this.fetch();
          this.showNotification("تمت العملية بنجاح");
          this.approve = false;
        });
      } else {
        this.approve = false;
      }
    },
    makeSearch() {
      this.fetch();
    },
    filteration() {
      this.pagination.page = 1;
      this.getDataFromApi().then((data) => {
        this.requests = data.items;
        this.totalRequests = data.total;
      });
    },
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
          let searchFullName =
            this.searchFullName !== ""
              ? `full_name=${this.searchFullName}`
              : "";
          let searchNickName =
            this.searchNickName !== ""
              ? `&nick_name=${this.searchNickName}`
              : "";
          let searchGender =
            this.searchGender !== "0" ? `&gender=${this.searchGender}` : "";
          endpoint = `admin/users?${searchFullName}${searchNickName}${searchGender}&page=${this.page}`;

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
    deleteItem(item) {
      const index = this.requests.indexOf(item);
      if (confirm("هل تود حذف مستخدم ؟")) {
        // const forceDelete = this.forceDelete == true ? 1:0
        this.$http.post(`admin/user-destroy/${item.id}`).then((res) => {
          console.log(res);
          this.showNotification("تمت العملية بنجاح");
          this.fetch();
          this.requests.splice(index, 1);
        });
      }
    },
    close() {
      this.dialog = false;
    },

    userFriendships(item) {
      this.userFriends = [];
      this.userFriendsDialog = true;
      this.getUserFriends(item.id);
    },
    getUserFriends(userId, page = 0) {
      let endPoint = `admin/get-friends/${userId}`;
      this.$http.get(endPoint).then((res) => {
        this.userFriends = res.data.data;
      });
    },
    getImgUrl(pic) {
      return require("../assets/imgs/" + pic);
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
}
</style>
