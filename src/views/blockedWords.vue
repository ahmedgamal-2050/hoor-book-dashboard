/* eslint-disable */
<template>
<v-flex xs12>
    <div class="elevation-2">
        <v-toolbar flat color="white">
            <v-toolbar-title style="margin-left:10px">{{ title }}</v-toolbar-title>

            <!-- Start Add/Edit Dialog blockedWords Form -->
            <v-dialog v-model="dialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span>{{
                edit === true ? "تعديل كلمات ممنوعة" : "إضافة كلمات ممنوعة"
              }}</span>
                        <v-spacer></v-spacer>
                        <v-btn icon small @click="close">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <ValidationObserver ref="obs" v-slot="{ invalid, validated, handleSubmit }">
                        <form ref="changePasswordForm" @submit.prevent="handleSubmit(saveItem)">
                            <v-card-text class="text-xs-center">
                                <ul style="list-style: none">
                                    <li class="red--text" v-for="error in errors" :key="error[0] + Math.random()">
                                        <ul style="list-style: none">
                                            <li v-for="err in error" :key="err + Math.random()">
                                                <small>{{ err }}</small>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </v-card-text>
                            <v-card-text>
                                <VTextFieldWithValidation rules="required|min:3" label="الإسم" v-model="blockedWords.title" prepend-icon="lock" type="text" />
                            </v-card-text>
                            <v-card-actions>
                                <v-btn type="submit" :disabled="invalid || !validated" :loading="connecting" color="primary">حفظ</v-btn>
                                <v-btn @click="close" color="secondary">إغلاق</v-btn>
                            </v-card-actions>
                        </form>
                    </ValidationObserver>
                </v-card>
            </v-dialog>
            <!-- End Add/Edit Dialog blockedWords Form -->

            <!-- Start Async Permissin to blockedWords Dialog Form -->
            <v-dialog v-model="asyncPermissionsblockedWordsdialog" persistent max-width="600px">
                <v-card>
                    <ValidationObserver v-slot="{ handleSubmit }">
                        <form @submit.prevent="handleSubmit(asyncPermissionsblockedWords)">
                            <v-card-text class="text-xs-center">
                                <ul style="list-style: none">
                                    <li class="red--text" v-for="error in errors" :key="error[0] + Math.random()">
                                        <ul style="list-style: none">
                                            <li v-for="err in error" :key="err + Math.random()">
                                                <small>{{ err }}</small>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </v-card-text>
                            <v-card-text>
                                <v-container fluid>
                                    <v-row>
                                        <v-col v-for="p in allPermissons" :key="p.id" cols="12" sm="4" md="4">
                                            <v-checkbox v-model="asycForm.permissions" :label="p.title" color="primary" :value="p.id" hide-details></v-checkbox>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn type="submit" :loading="connecting" color="primary">حفظ</v-btn>
                                <v-btn @click="close" color="secondary">إغلاق</v-btn>
                            </v-card-actions>
                        </form>
                    </ValidationObserver>
                </v-card>
            </v-dialog>
            <!-- End Async Permissin to blockedWords Dialog Form -->

            <!-- Start Add/Edit Dialog Permission Form -->
            <v-dialog v-model="permissionDialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span>{{
                edit === true ? "تعديل كلمات ممنوعة" : "إضافة كلمات ممنوعة"
              }}</span>
                        <v-spacer></v-spacer>
                        <v-btn icon small @click="close">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <ValidationObserver ref="permissionObs" v-slot="{ invalid, validated, handleSubmit }">
                        <form ref="PermissionForm" @submit.prevent="handleSubmit(savePermission)">
                            <v-card-text class="text-xs-center">
                                <ul style="list-style: none">
                                    <li class="red--text" v-for="error in errors" :key="error[0] + Math.random()">
                                        <ul style="list-style: none">
                                            <li v-for="err in error" :key="err + Math.random()">
                                                <small>{{ err }}</small>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </v-card-text>
                            <v-card-text>
                                <VTextFieldWithValidation rules="required|min:3" label="الإسم" v-model="permission.title" prepend-icon="lock" type="text" />
                            </v-card-text>
                            <v-card-actions>
                                <v-btn type="submit" :disabled="invalid || !validated" :loading="connecting" color="primary">حفظ</v-btn>
                                <v-btn @click="close" color="secondary">إغلاق</v-btn>
                            </v-card-actions>
                        </form>
                    </ValidationObserver>
                </v-card>
            </v-dialog>
            <!-- End Add/Edit Dialog Permission Form -->

            <!-- Start Permissions Dialog -->
            <v-dialog v-model="permissionsDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                <v-card>
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>الصلاحيات</v-toolbar-title>

                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn icon dark @click="permissionsDialog = false">
                                <v-icon>close</v-icon>
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-card-text>
                        <v-row align="center" class="mx-0 my-3 pa-">
                            <v-text-field v-model="title" :rules="rules" hint="ادخل كلمة البحث عن الصلاحية" label="بحث"></v-text-field>
                            <v-spacer></v-spacer>
                            <!-- start Add action -->
                            <v-tooltip right>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn color="primary" fab small v-bind="attrs" v-on="on" @click="editingPermission('add')">
                                        <v-icon>add</v-icon>
                                    </v-btn>
                                </template>
                                <span>اضافة عنصر جديد</span>
                            </v-tooltip>
                            <!-- end Add action -->
                        </v-row>
                    </v-card-text>
                    <v-card class="justify-center mb-6 d-flex flex-wrap" flat tile>
                        <v-card v-for="p in allPermissons" :key="p" elevation="1" class="pa-2 ma-1" outlined tile>
                            <v-card-title>{{ p.title }}</v-card-title>
                            <v-card-actions>
                                <!-- start Add-Edit action -->
                                <v-tooltip right>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn color="orange" icon x-small v-bind="attrs" v-on="on" @click="editing('edit', p)">
                                            <v-icon>edit</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>تعديل</span>
                                </v-tooltip>
                                <!-- end Add-Edit action -->

                                <!-- start delete action -->
                                <v-tooltip right>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn color="red" icon x-small v-bind="attrs" v-on="on" @click="deleteItem(p)">
                                            <v-icon>delete_forever</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>حذف</span>
                                </v-tooltip>
                                <!-- end delete action -->
                            </v-card-actions>
                        </v-card>
                    </v-card>
                </v-card>
            </v-dialog>
            <!-- End Permissions Dialog -->

            <v-spacer></v-spacer>

            <!-- start Add action -->
            <!-- <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-2"
              color="primary"
              fab
              small
              v-bind="attrs"
              v-on="on"
              @click="permissionsDialog = !permissionsDialog"
            >
              <v-icon>verified_user</v-icon>
            </v-btn>
          </template>
          <span>الصلاحيات</span>
        </v-tooltip> -->
            <!-- end Add action -->

            <!-- start Add action -->
            <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" fab small v-bind="attrs" v-on="on" @click="editing('add')">
                        <v-icon>add</v-icon>
                    </v-btn>
                </template>
                <span>اضافة عنصر جديد</span>
            </v-tooltip>
            <!-- end Add action -->
        </v-toolbar>

        <v-data-table loading-text="انتظر قليلا..." :headers="headers" :items="requests" :page.sync="page" :server-items-length="totalRequests" :loading="loading" hide-default-footer item-key="id" :options.sync="pagination">
            <template v-slot:[`item.title`]="{ item }">
                <span v-if="item.title != null">{{ item.title }}</span>
                <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
                <!-- start async blockedWords/permissions action -->

                <!-- end async blockedWords/permissions action -->

                <!-- start Add-Edit action -->
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="orange" icon x-small v-bind="attrs" v-on="on" @click="editing('edit', item)">
                            <v-icon>edit</v-icon>
                        </v-btn>
                    </template>
                    <span>تعديل</span>
                </v-tooltip>
                <!-- end Add-Edit action -->

                <!-- start delete action -->
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="red" icon x-small v-bind="attrs" v-on="on" @click="deleteItem(item)">
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
            <v-pagination total-visible="6" color="primary" v-model="page" :length="pages"></v-pagination>
        </div>
    </div>
</v-flex>
</template>

<script>
const headerConst = {
    align: "center",
    sortable: false
};
import VTextFieldWithValidation from "../components/inputs/VTextFieldWithValidation";
import {
    mapActions
} from "vuex";

export default {
    props: {
        title: {
            default: "الكلمات الممنوعة",
            type: String,
        },
        api: {
            default: "blocked-words",
            type: String,
        },
    },
    data: () => ({
        blockedWords: {
            title: "",
        },
        asycForm: {
            blockedWordsId: null,
        },
        password_show: false,
        connecting: false,
        errors: [],
        edit: false,
        dialog: false,
        requests: [],
        totalRequests: 0,
        pagination: {},
        loading: false,
        headers: [{
                text: "الإسم",
                value: "title",
                ...headerConst
            },
            {
                text: "عمليات",
                value: "actions",
                ...headerConst
            },
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
        this.getAllPermissions();
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
            this.errors = [];
            this.dialog = false;
            this.permissionDialog = false;
            this.asycForm = {
                blockedWordsId: null,
            };
            this.admin = {
                title: "",
                email: "",
                password: "",
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
            this.blockedWords.id = item.id;
            this.blockedWords.title = item.title;
        },

        saveItem() {
            this.connecting = true;
            let formdata = new FormData();
            if (this.blockedWords.title) formdata.append("title", this.blockedWords.title);

            if (this.edit) {
                let endpoint = "";
                endpoint = `admin/${this.api}/${this.blockedWords.id}`;
                this.$http
                    .put(endpoint, {
                        title: this.blockedWords.title
                    })
                    .then((res) => {
                        console.log(res);
                        this.showNotification("تمت العملية بنجاح");
                        this.fetch();
                        this.alert.type = "warning";
                        this.alert.message = "Edit user done";
                        this.close();
                        this.errors = [];
                        this.blockedWords = {
                            id: null,
                            title: "",
                        };
                    })
                    .catch(({
                        response
                    }) => {
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
                        this.blockedWords = {
                            id: null,
                            title: "",
                        };
                    })
                    .catch(({
                        response
                    }) => {
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
        savePermission() {
            this.connecting = true;
            let formdata = new FormData();
            if (this.permission.title) formdata.append("title", this.permission.title);

            if (this.edit) {
                let endpoint = "";
                endpoint = `admin/permissions/${this.permission.id}`;
                this.$http
                    .put(endpoint, {
                        title: this.permission.title
                    })
                    .then((res) => {
                        console.log(res);
                        this.showNotification("تمت العملية بنجاح");
                        this.getAllPermissions();
                        this.alert.type = "warning";
                        this.alert.message = "Edit user done";
                        this.close();
                        this.errors = [];
                        this.permission = {
                            id: null,
                            title: "",
                        };
                    })
                    .catch(({
                        response
                    }) => {
                        this.errors = response.data.errors;
                    });
            } else {
                this.$http
                    .post(`admin/permissions`, formdata)
                    .then((res) => {
                        this.showNotification("تمت العملية بنجاح");
                        console.log(res);
                        this.getAllPermissions();
                        this.alert.type = "info";
                        this.alert.message = "Add user done!";
                        this.close();
                        this.errors = [];
                        this.permission = {
                            id: null,
                            title: "",
                        };
                    })
                    .catch(({
                        response
                    }) => {
                        this.errors = response.data.errors;
                    });
            }
            this.connecting = false;
        },
        getAllPermissions() {
            this.$http
                .get(`admin/permissions`)
                .then((res) => {
                    this.allPermissons = res.data;
                })
                .catch(({
                    response
                }) => {
                    console.log(response);
                });
        },
        asyncPermissionsblockedWords() {
            let formdata = new FormData();
            formdata.append("blockedWords_id", this.asycForm.blockedWordsId);
            for (let i = 0; i < this.asycForm.permissions.length; i++) {
                formdata.append("permissions[]", this.asycForm.permissions[i]);
            }
            this.$http
                .post(`admin/async-permissin-to-blockedWords`, formdata)
                .then((res) => {
                    this.showNotification("تمت العملية بنجاح");
                    console.log(res);
                    this.fetch();
                    this.close();
                })
                .catch(({
                    response
                }) => {
                    this.errors = response.data.errors;
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.v-data-table>.v-data-table__wrapper>table>tbody>tr>td,
.v-data-table>.v-data-table__wrapper>table>tfoot>tr>td,
.v-data-table>.v-data-table__wrapper>table>thead>tr>td {
    height: 80px !important;
}
</style>
