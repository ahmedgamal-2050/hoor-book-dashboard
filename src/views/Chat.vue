/* eslint-disable */
<template>
  <v-flex xs12>
    <div class="elevation-2" style="max-height: 70vh">
      <v-toolbar flat color="white">
        <v-toolbar-title style="margin-left:10px"
          >رسائل المستخدمين</v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-autocomplete
          v-model="user"
          :items="users"
          :loading="isSearchUsersLoading"
          :search-input.sync="search"
          clearable
          item-text="full_name"
          @change="makeTea"
          item-value="id"
          no-data-text="لا يوجد نتائج"
          label="البحث عن محادثات مستخدم بالإسم"
        >
        </v-autocomplete>
      </v-toolbar>
      <v-card-text class="chat-contaner">
        <v-container fluid>
          <v-row>
            <v-col cols="12" sm="4" md="4" lg="4" class="users-convs">
              <!--  -->
              <v-row
                v-for="conv in allConversations"
                :key="conv.id"
                class="convItem"
                :class="{ active: currentActive === conv.id }"
                @click="makeCurrent(conv.id)"
              >
                <v-col xs="5" sm="5" md="5" lg="5">
                  <v-menu
                    open-on-hover
                    bottom
                    right
                    transition="scale-transition"
                    origin="top right"
                  >
                    <template v-slot:activator="{ on }">
                      <v-chip pill v-on="on" color="primary">
                        <v-avatar left>
                          <img
                            v-if="conv.user1.gender === 'male'"
                            src="../assets/imgs/profile-img.jpg"
                            alt="صورة البروفايل"
                          />
                          <img
                            v-else
                            src="../assets/imgs/female.png"
                            alt="صورة البروفايل"
                          />
                        </v-avatar>
                        {{
                          lodash.truncate(conv.user1.full_name, {
                            length: 7,
                          })
                        }}
                      </v-chip>
                    </template>
                    <v-card width="300">
                      <v-list>
                        <v-list-item>
                          <v-list-item-avatar>
                            <img
                              v-if="conv.user1.gender === 'male'"
                              src="../assets/imgs/profile-img.jpg"
                              alt="صورة البروفايل"
                            />
                            <img
                              v-else
                              src="../assets/imgs/female.png"
                              alt="صورة البروفايل"
                            />
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title>{{
                              conv.user1.full_name
                            }}</v-list-item-title>
                            <v-list-item-subtitle>{{
                              conv.user1.email
                            }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-menu>
                </v-col>
                <v-col xs="5" sm="5" md="5" lg="5">
                  <v-menu
                    open-on-hover
                    bottom
                    right
                    transition="scale-transition"
                    origin="top left"
                  >
                    <template v-slot:activator="{ on }">
                      <v-chip pill v-on="on" color="primary">
                        {{
                          lodash.truncate(conv.user2.full_name, {
                            length: 7,
                          })
                        }}
                        <v-avatar right>
                          <img
                            v-if="conv.user2.gender === 'male'"
                            src="../assets/imgs/profile-img.jpg"
                            alt="صورة البروفايل"
                          />
                          <img
                            v-else
                            src="../assets/imgs/female.png"
                            alt="صورة البروفايل"
                          />
                        </v-avatar>
                      </v-chip>
                    </template>
                    <v-card width="300">
                      <v-list>
                        <v-list-item>
                          <v-list-item-avatar>
                            <img
                              v-if="conv.user2.gender === 'male'"
                              src="../assets/imgs/profile-img.jpg"
                              alt="صورة البروفايل"
                            />
                            <img
                              v-else
                              src="../assets/imgs/female.png"
                              alt="صورة البروفايل"
                            />
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title>{{
                              conv.user2.full_name
                            }}</v-list-item-title>
                            <v-list-item-subtitle>{{
                              conv.user2.email
                            }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-menu>
                </v-col>
                <v-col xs="2" sm="2" md="2" lg="2">
                  <v-tooltip v-if="conv.deleted_at === null" right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="orange"
                        icon
                        x-small
                        v-bind="attrs"
                        v-on="on"
                        @click="conversationDeactive(conv)"
                      >
                        <v-icon>not_interested</v-icon>
                      </v-btn>
                    </template>
                    <span> تعطيل المحادثة </span>
                  </v-tooltip>
                  <!-- end deactivate friendship action -->
                  <!-- start deactivate  friendship action -->
                  <v-tooltip v-if="conv.deleted_at !== null" right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="green"
                        icon
                        x-small
                        v-bind="attrs"
                        v-on="on"
                        @click="conversationActive(conv)"
                      >
                        <v-icon>restore</v-icon>
                      </v-btn>
                    </template>
                    <span>تنشيط المحادثة </span>
                  </v-tooltip>

                  <!-- start delete friendship action -->
                  <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="red"
                        icon
                        x-small
                        v-bind="attrs"
                        v-on="on"
                        @click="deleteItem(conv)"
                      >
                        <v-icon>delete_forever</v-icon>
                      </v-btn>
                    </template>
                    <span>حذف المحادثة </span>
                  </v-tooltip>
                  <!-- end delete action -->
                </v-col>
              </v-row>
              <!--  -->
            </v-col>
            <v-col
              cols="12"
              sm="8"
              md="8"
              lg="8"
              class="messages"
              @scroll="onScroll"
            >
              <div id="transparent"></div>
              <v-flex
                v-if="currentActive == null"
                xs12
                class="d-flex justify-center align-center mb-6"
              >
                <h1>يرجى اختيار احدى المحادثات لعرضها!</h1>
              </v-flex>
              <v-flex
                v-else-if="currentActive !== null && messages.length == 0"
                xs12
                class="d-flex justify-center mb-6"
              >
                <h1>لا تحتوي هذه المحادثة على أية رسائل</h1>
              </v-flex>
              <fragment v-else>
                <div v-for="msg in messages" :key="msg.id" class="msg-item">
                  <div
                    class="container"
                    :class="{ right: right === msg.user_id }"
                  >
                    <v-avatar>
                      <img
                        v-if="msg.user.gender === 'male'"
                        src="../assets/imgs/profile-img.jpg"
                        alt="صورة البروفايل"
                      />
                      <img
                        v-else
                        src="../assets/imgs/female.png"
                        alt="صورة البروفايل"
                      />
                    </v-avatar>
                    <div class="real-content">
                      <p class="msg-info">
                        {{ msg.user.full_name }}
                        <span class="time" style="dir: ltr"
                          >{{ msg.created_at | moment("DD, MM YYYY - h:mm A") }}
                        </span>
                      </p>
                      <p>{{ msg.message }} {{ msg.id }}</p>
                    </div>
                  </div>
                </div>
              </fragment>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </div>
  </v-flex>
</template>

<script>
// import VTextFieldWithValidation from "../components/inputs/VTextFieldWithValidation";
import { mapActions } from "vuex";

export default {
  props: {
    title: {
      default: "المديرين",
      type: String,
    },
    api: {
      default: "admins",
      type: String,
    },
  },
  data: () => ({
    user: null,
    users: [],
    search: null,
    isSearchUsersLoading: false,
    allConversations: [],
    messages: [],
    currentActive: null,
    right: null,
  }),
  components: {
    //     VTextFieldWithValidation,
  },
  computed: {},
  watch: {
    search(val) {
      console.log(val);
      // Items have already been loaded
      if (this.users.length > 0) return;

      // Items have already been requested
      if (this.isSearchUsersLoading) return;

      this.isSearchUsersLoading = true;
      this.$http
        .get(`admin/get-users-ddl?full_name=${val}`)
        .then((res) => {
          this.users = res.data;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.isSearchUsersLoading = false));
    },
  },
  created() {
    this.getConversitons();
  },
  methods: {
    ...mapActions(["showNotification"]),
    onScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
      if (scrollTop + clientHeight >= scrollHeight) {
        console.log("scrolled to end");
      }
    },
    getConversitons(user = null) {
      this.$http
        .get(`admin/conversations/${user !== null ? "?user[0]=" + user : ""}`)
        .then((res) => {
          this.allConversations = res.data.data;
        })
        .catch(({ response }) => {
          console.log(response);
        });
    },
    conversationActive(item) {
      this.approve = true;
      // const index = this.requests.indexOf(item);
      if (confirm("هل تريد إعادة تفعيل الشات لهؤلاء المستخدمين ؟")) {
        // console.log(item.conversationId);
        this.$http
          .post(
            "admin/conversation-cancel_trached/" +
              item.id +
              "?page=" +
              this.page
          )
          .then((res) => {
            console.log(res);
            this.showNotification("تمت العملية بنجاح");
            this.getConversitons();
            this.approve = false;
          });
      } else {
        this.approve = false;
      }
    },
    conversationDeactive(item) {
      this.approve = true;
      // const index = this.requests.indexOf(item);
      if (confirm("هل تريد تعطيل الشات لهؤلاء المستخدمين ؟")) {
        this.$http.post("admin/conversation-trached/" + item.id).then((res) => {
          console.log(res);
          this.getConversitons();
          this.showNotification("تمت العملية بنجاح");
          this.approve = false;
        });
      } else {
        this.approve = false;
      }
    },
    deleteItem(item) {
      if (confirm("هل تود حذف الشات ؟")) {
        // const forceDelete = this.forceDelete == true ? 1:0
        this.$http.post(`admin/conversation-destroy/${item.id}`).then((res) => {
          console.log(res);
          this.showNotification("تمت العملية بنجاح");
          this.getConversitons();
        });
      }
    },
    makeCurrent(id) {
      this.currentActive = id;
      this.$http
        .get(`admin/messages/${id}`)
        .then((res) => {
          this.messages = res.data.data;
          this.right = this.messages[0].user_id;
        })
        .catch(({ response }) => {
          console.log(response);
        });
    },
    makeTea() {
      console.log(this.user);
      this.getConversitons(this.user);
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-contaner {
  background-color: #fff;

  .users-convs {
    overflow: hidden;
    overflow-y: scroll;
    max-height: 70vh;

    @media only screen and (max-width: 600px) {
      overflow: hidden;
      overflow-y: scroll;
      max-height: 170px;
    }
  }
}

.convItem {
  background-color: var(--v-primary-base);
  border-bottom: 2px solid #ddd;
  transition: all ease-in-out 0.4s;
  opacity: 0.7;
  cursor: pointer;

  &:hover,
  &.active {
    background-color: #e9e9e9;
    opacity: 1;
    font-weight: bold;
  }
}

.messages {
  border-right: 2px solid #ddd;
  position: relative;
  overflow: hidden;
  overflow-y: scroll;
  max-height: 70vh;
  background-color: #f3f2f1;
}

.msg-item {
  .container {
    padding: 10px;
    display: flex;

    &.right {
      flex-direction: row-reverse;

      .real-content {
        background-color: #ab3bba;
        color: #fff;

        .msg-info {
          display: flex;
          flex-direction: row-reverse;
        }
      }
    }

    .real-content {
      padding: 0.5rem;
      background: #ccc;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      max-width: 70%;
      min-width: 40%;
      border-radius: 10px;

      .msg-info {
        display: flex;
        justify-content: space-between;
      }

      .time {
        font-size: 70%;
      }
    }
  }
}

.col {
  padding: 12px 5px;

  @media screen {
  }
}
</style>
