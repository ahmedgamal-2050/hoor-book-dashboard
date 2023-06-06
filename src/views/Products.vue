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
                edit === true ? "تعديل منتج" : "إضافة منتج جديد"
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
                <!-- Show Error -->
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
                    label="الإسم بالعربي"
                    v-model="admin.name_ar"
                    prepend-icon="lock"
                    type="text"
                  />

                  <VTextFieldWithValidation
                    rules="required"
                    v-model="admin.desc"
                    label="الوصف"
                    prepend-icon="mail"
                  />

                  <VTextFieldWithValidation
                    rules="required"
                    label="المخزون"
                    v-model="admin.stock"
                    prepend-icon="lock"
                    type="number"
                  />

                  <VTextFieldWithValidation
                    rules="required"
                    label=" سعر  القطعة للمستخدم"
                    v-model="admin.user_price_of_piece"
                    prepend-icon="lock"
                    type="number"
                  />

                  <VTextFieldWithValidation
                    rules="required"
                    label="سعر القطعة للمكتبة"
                    v-model="admin.library_price_of_piece"
                    prepend-icon="lock"
                    type="number"
                  />

                  <VTextFieldWithValidation
                    rules="required"
                    label="عدد الرزم"
                    v-model="admin.packet_pieces"
                    prepend-icon="lock"
                    type="number"
                  />

                  <VTextFieldWithValidation
                    rules="required"
                    label="سعر الرزمة للمستخدم"
                    v-model="admin.user_price_of_packet"
                    prepend-icon="lock"
                    type="number"
                  />

                  <VTextFieldWithValidation
                    rules="required"
                    label="سعر الرزمة للمكتبة"
                    v-model="admin.library_price_of_packet"
                    prepend-icon="lock"
                    type="number"
                  />
                  
                  <VFileInputWithValidation
                    rules="required"
                    label="الصورة"
                    variant="filled"
                    prepend-icon="camera"
                    v-model="admin.image"
                  />

                  <VTextFieldWithValidation
                    label="الخصم"
                    v-model="admin.offer"
                    prepend-icon="lock"
                    type="number"
                  />
                  
                  <VSelectWithValidation
                    label="الفئات #"
                    rules="required"
                    :items="category_ids"
                    item-text="name"
                    item-value="id"
                    prepend-icon="lock"
                    v-model="admin.category_id"
                  />
                                  
                </v-card-text>

                <hr/>

                <!-- Media -->
                <v-card-text>
                  <div class="d-flex align-items-center">
                    <h4>الوسائط</h4>

                    <v-spacer></v-spacer>
                    
                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          fab
                          small
                          v-bind="attrs"
                          v-on="on"
                          @click="addMedia()"
                        >
                          <v-icon>add</v-icon>
                        </v-btn>
                      </template>
                      <span>اضافة عنصر جديد</span>
                    </v-tooltip>
                  </div>

                  <div v-for="(find, index) in admin.media">
                    <div class="d-flex align-items-center">
                      <VFileInputWithValidation
                        class="w-100"
                        rules="required"
                        label="صورة الوسائط"
                        variant="filled"
                        prepend-icon="camera"
                        v-model="find.value" 
                        :key="index"
                      />
                      
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="mx-3"
                            color="red"
                            icon
                            x-small
                            v-bind="attrs"
                            v-on="on"
                            @click="deleteMedia(index)"
                          >
                            <v-icon>delete_forever</v-icon>
                          </v-btn>
                        </template>
                        <span>حذف</span>
                      </v-tooltip>
                    </div>
                    <div class="fz12 text-red" v-if="showMediaError">
                      يجب ادخال وسيط واحد على الأقل
                    </div>
                  </div>
                </v-card-text>

                <hr/>

                <!-- Colors -->
                <v-card-text>  
                  <div class="d-flex align-items-center">
                    <h4>الألوان</h4>

                    <v-spacer></v-spacer>
                    
                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          fab
                          small
                          v-bind="attrs"
                          v-on="on"
                          @click="addColor()"
                        >
                          <v-icon>add</v-icon>
                        </v-btn>
                      </template>
                      <span>اضافة لون جديد</span>
                    </v-tooltip>
                  </div>

                  <!-- Colors Field List -->
                  <div v-for="(color, index) in admin.colors">
                    <div class="d-flex align-items-center mt-3">
                      <!-- Color Field Item -->
                      <div class="w-100">
                        <VTextFieldWithValidation
                          rules="required"
                          prepend-icon="lock"
                          v-model="color.stock" 
                          :key="index"
                          label="المخزون"
                          type="number"
                        />

                        <VSelectWithValidation
                          label="الألوان #"
                          rules="required"
                          :items="color_ids"
                          item-text="code"
                          item-value="id"
                          prepend-icon="lock"
                          v-model="color.color_id" 
                          :key="index"
                        />

                        <!-- Color Media Field List -->
                        <div class="d-flex align-items-center">
                          <!-- Add Color Media -->
                          <v-tooltip left>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn 
                                class="ml-2"
                                color="primary"
                                fab
                                small
                                v-bind="attrs"
                                v-on="on"
                                @click="addColorMedia(index)"
                              >
                                <v-icon>add</v-icon>
                              </v-btn>
                            </template>
                            <span>اضافة صورة لون جديد</span>
                          </v-tooltip>

                          <!-- Color Media List -->
                          <div class="w-100">
                            <div v-for="(med, key) in color.media">
                              <div class="d-flex align-items-center">
                                <div class="w-100">
                                  <VFileInputWithValidation
                                    label="صورة الوسائط"
                                    prepend-icon="camera"
                                    v-model="med.value" 
                                    :key="key"
                                  />
                                </div>

                                <!-- Delete Color Media -->
                                <div left>
                                  <v-tooltip>
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn
                                        class="mx-3"
                                        color="red"
                                        icon
                                        x-small
                                        v-bind="attrs"
                                        v-on="on"
                                        @click="deleteColorMedia(index, key)"
                                      >
                                        <v-icon>delete_forever</v-icon>
                                      </v-btn>
                                    </template>
                                    <span>حذف صورة لون</span>
                                  </v-tooltip>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Delete Color Item -->
                      <div left>
                        <v-tooltip>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              class="mx-3"
                              color="red"
                              icon
                              small
                              v-bind="attrs"
                              v-on="on"
                              @click="deleteColor(key)"
                            >
                              <v-icon>delete_forever</v-icon>
                            </v-btn>
                          </template>
                          <span>حذف لون</span>
                        </v-tooltip>
                      </div>
                    </div>
                    <div class="fz12 text-warning" v-if="showColorError">
                      هل أنت متأكد من أنك لا تريد إضافة لون
                    </div>

                    <hr/>
                  </div>
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

        <!-- Start View Description Dialog Form -->
        <v-dialog v-model="viewDescriptionDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span>وصف المنتج</span>
              <v-spacer></v-spacer>
              <v-btn icon small @click="close">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="text-xs-center">
              {{ productDiscription }}
            </v-card-text>
            <hr/>
            <v-card-text v-if="reviews && reviews.length > 0">
              <div v-for="review in reviews">
                <h3 class="mt-3">{{ review.user.name }}</h3>
                <div><span class="fbold">التقييم: </span><span class="text-warning">{{ review.review }}</span>/5</div>
                <div class="mt-3 mb-3"><span class="fbold">التعليق: </span> "{{ review.comment }}"</div>
                <hr/>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="close" color="primary">إغلاق</v-btn>
            </v-card-actions>
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

        <template v-slot:[`item.image`]="{ item }">
          <!--  -->
          <v-avatar dark v-bind="attrs" v-on="on">
            <img
              v-if="item.image === null"
              src="../assets/imgs/profile-img.jpg"
              alt="صورة المنتج"
            />
            <a v-else :href="`${baseApi}/${item.image}`" target="_blank">
              <img
                class="of-cover"
                :src="`${baseApi}/${item.image}`"
                alt="صورة المنتج"
              />
            </a>
          </v-avatar>
        </template>

        <template v-slot:[`item.name`]="{ item }">
          <span v-if="item.name != null">{{ item.name }}</span>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.category`]="{ item }">
          <div v-if="item.category != null">
            <div><b># </b>{{ item.category.id }}</div>
            <div><b>الاسم: </b>{{ item.category.name }}</div>
            <div>
              <a :href="`${baseUrl}/${item.category.image}`" target="_blank">
                <img
                  :src="`${baseUrl}/${item.category.image}`" class="of-cover"
                  alt="صورة الفئة"
                />
              </a>
            </div>
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.colors`]="{ item }">
          <span v-if="item.colors != null">{{ item.colors.length }}</span>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.media`]="{ item }">
          <span v-if="item.media != null">{{ item.media.length }}</span>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.packet_pieces`]="{ item }">
          <div v-if="item.packet_pieces != null">
            <b>العدد: </b> {{ item.packet_pieces }}
          </div>
          <div v-if="item.user_price_of_packet != null">
            <b>سعر الدستة بالنسبة للمستخدم: </b> {{ item.user_price_of_packet }}
          </div>
          <div v-if="item.library_price_of_packet != null">
            <b>سعر الدستة بالنسبة للمكتبة: </b> {{ item.library_price_of_packet }}
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.user_price_of_piece`]="{ item }">
          <div v-if="item.user_price_of_piece != null">
            <b>سعر القطعة بالنسبة للمستخدم: </b> {{ item.user_price_of_piece }}
          </div>
          <div v-if="item.library_price_of_piece != null">
            <b>سعر القطعة بالنسبة للمكتبة: </b> {{ item.library_price_of_piece }}
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.reviews_avg`]="{ item }">
          <div v-if="item.reviews_avg != null">
            <b>متوسط التقييمات: </b> {{ item.reviews_avg }}
          </div>
          <div v-if="item.reviews.length != null">
            <b>عدد التقييمات: </b> {{ item.reviews.length }}
          </div>
          <div v-if="item.stock != null">
            <b>المخزون: </b> {{ item.stock }}
          </div>
          <div v-if="item.offer != null">
            <b>الخصم: </b> {{ item.offer }}%
          </div>
          <v-chip v-else small color="secondary" dark>غير متوفر</v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <!-- start async admin/role action -->
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="blue"
                icon
                x-small
                v-bind="attrs"
                v-on="on"
                @click="viewDescription(item)"
              >
                <v-icon>verified_user</v-icon>
              </v-btn>
            </template>
            <span>عرض وصف المنتج</span>
          </v-tooltip>
          <!-- end async admin/role action -->

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
import VSelectWithValidation from "../components/inputs/VSelectWithValidation";
import { mapActions } from "vuex";
import { BASE_API } from "../config/config";

export default {
  props: {
    title: {
      default: "المنتجات",
      type: String,
    },
    api: {
      default: "products",
      type: String,
    },
  },
  data: () => ({
    admin: {
      name: "",
      name_ar: "",
      desc: "",
      stock: null,
      user_price_of_piece: null,
      library_price_of_piece: null,
      packet_pieces: null,
      user_price_of_packet: null,
      library_price_of_packet: null,
      offer: null,
      image: "",
      category_id: null,
      media: [],
      colors: []
    },
    productDiscription: "",
    reviews: [],
    viewDescriptionDialog: false,
    connecting: false,
    errors: [],
    edit: false,
    dialog: false,
    requests: [],
    category_ids: [],
    color_ids: [],
    totalRequests: 0,
    pagination: {},
    loading: false,
    headers: [
      { text: "#", value: "id", ...headerConst },
      { text: "الصورة", value: "image", ...headerConst },
      { text: "الإسم", value: "name", ...headerConst },
      { text: "الفئة", value: "category", ...headerConst },
      { text: "الألوان", value: "colors", ...headerConst },
      { text: "الوسائط", value: "media", ...headerConst },
      { text: "الدستة", value: "packet_pieces", ...headerConst },
      { text: "القطعة", value: "user_price_of_piece", ...headerConst },
      { text: "معلومات اضافية", value: "reviews_avg", ...headerConst },
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
    showMediaError: false,
    showColorError: false,
    showColorMediaError: false,
    baseUrl: window.location.origin,
    baseApi: BASE_API,
  }),
  components: {
    VTextFieldWithValidation,
    VFileInputWithValidation,
    VSelectWithValidation,
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
    this.getCategoriesId();
    this.getColorIds();
  },
  methods: {
    ...mapActions(["showNotification"]),
    fetch() {
      this.getDataFromApi().then((data) => {
        this.requests = JSON.parse(JSON.stringify(data.items));
        //console.log('getDataFromApi requests >>', data.items);
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
          let endpoint = `${this.baseApi}/api/admin/products?page=${this.page}`;

          this.$http.get(endpoint).then((res) => {
            let items = res.data.data;
            //console.log('getDataFromApi items >>', items);
            let meta = res.data.meta;
            this.loading = false;
            resolve({
              items,
              meta,
            });
          })
          .catch((error) => {
            if (error.message.includes('code 401')) {
              //console.log('auth error >>');
              this.$router.push({ path: '/auth/login' })
            }
          });
        }
      });
    },
    close() {
      this.errors = [];
      this.dialog = false;
      this.viewDescriptionDialog = false;
      this.admin = {
        name: "",
        name_ar: "",
        desc: "",
        stock: null,
        user_price_of_piece: null,
        library_price_of_piece: null,
        packet_pieces: null,
        user_price_of_packet: null,
        library_price_of_packet: null,
        offer: null,
        image: "",
        category_id: null,
        media: [],
        colors: []
      };
      this.productDiscription = "";
      this.reviews = [];
    },
    editing(process, item = this.admin) {
      if (process === "add") {
        this.addMedia();
        this.addColor();
        this.$nextTick(() => {
          this.$refs.obs.reset();
        });
        this.edit = false;
      }
      else {
        this.edit = true;
        this.$nextTick(() => {
          this.$refs.obs.validate();
        });
      }
      this.dialog = !this.dialog;
      this.admin.id = item.id;
      this.admin.name = item.name;
      this.admin.name_ar = item.name;
      this.admin.desc = item.desc;
      this.admin.stock = item.stock;
      this.admin.user_price_of_piece = item.user_price_of_piece;
      this.admin.library_price_of_piece = item.library_price_of_piece;
      this.admin.packet_pieces = item.packet_pieces;
      this.admin.user_price_of_packet = item.user_price_of_packet;
      this.admin.library_price_of_packet = item.library_price_of_packet;
      this.admin.offer = item.offer;
      this.admin.image = item.image;
      this.admin.category_id = item.category.id;
      this.admin.media = item.media;
      if (item.colors && item.colors.length > 0) {
        for (var i = 0; i < item.colors.length; i++) {
          this.addColor(item.colors[i]);
          //console.log('color media >>', item.colors[i].media);
          if (item.colors[i].media && item.colors[i].media.length > 0) {
            this.addColorMedia(i, item.colors[i].media);
          }
        }
      }
    },
    saveItem() {
      this.connecting = true;
      let formdata = new FormData();
      if (this.admin.name) formdata.append("name", this.admin.name);
      if (this.admin.name_ar) formdata.append("name_ar", this.admin.name_ar);
      if (this.admin.desc) formdata.append("desc", this.admin.desc);
      if (this.admin.stock) formdata.append("stock", this.admin.stock);
      if (this.admin.user_price_of_piece) formdata.append("user_price_of_piece", this.admin.user_price_of_piece);
      if (this.admin.library_price_of_piece) formdata.append("library_price_of_piece", this.admin.library_price_of_piece);
      if (this.admin.packet_pieces) formdata.append("packet_pieces", this.admin.packet_pieces);
      if (this.admin.user_price_of_packet) formdata.append("user_price_of_packet", this.admin.user_price_of_packet);
      if (this.admin.library_price_of_packet) formdata.append("library_price_of_packet", this.admin.library_price_of_packet);
      if (this.admin.offer) formdata.append("offer", this.admin.offer);
      if (this.admin.image) formdata.append("image", this.admin.image);
      if (this.admin.category_id) formdata.append("category_id", this.admin.category_id);
      //if (this.admin.media) formdata.append("media[]", this.admin.media);
      if (this.admin.media && this.admin.media.length > 0) {
        for (var i = 0; i < this.admin.media.length; i++) {
          formdata.append('media[]', this.admin.media[i].value);
        }
      }
      if (this.admin.colors && this.admin.colors.length > 0) {
        for (var i = 0; i < this.admin.colors.length; i++) {
          formdata.append(`colors.${i}.color_id`, this.admin.colors[i].color_id);
          formdata.append(`colors.${i}.stock`, this.admin.colors[i].stock);
          if (this.admin.colors[i].media) formdata.append(`colors.${i}.media`, this.admin.colors[i].media);
        }
      }

      if (this.edit) {
        let endpoint = `${this.baseApi}/api/admin/products/${this.admin.id}`;
        this.$http
          .post(endpoint, {
            name: this.admin.name,
            name_ar: this.admin.name_ar,
            desc: this.admin.desc,
            stock: this.admin.stock,
            user_price_of_piece: this.admin.user_price_of_piece,
            library_price_of_piece: this.admin.library_price_of_piece,
            packet_pieces: this.admin.packet_pieces,
            user_price_of_packet: this.admin.user_price_of_packet,
            library_price_of_packet: this.admin.library_price_of_packet,
            offer: (this.admin.offer) ? this.admin.offer : null,
            image: this.admin.image,
            category_id: this.admin.category_id,
            media: this.admin.media,
            colors: (this.admin.colors && this.admin.colors.length > 0) ? this.admin.colors : null,
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
              name: "",
              name_ar: "",
              desc: "",
              stock: null,
              user_price_of_piece: null,
              library_price_of_piece: null,
              packet_pieces: null,
              user_price_of_packet: null,
              library_price_of_packet: null,
              offer: null,
              image: "",
              category_id: null,
              media: [],
              colors: []
            };
          })
          .catch(({ response }) => {
            this.errors = response.data.errors;
          });
      }
      else {
        this.$http
          .post(`${this.baseApi}/api/admin/products`, formdata)
          .then((res) => {
            if (res && res.data && res.data.status && !res.data.status.status) { 
              this.showNotification(res.data.status.validation_message);
            }
            else {
              this.showNotification("تمت العملية بنجاح");
              this.fetch();
              this.alert.type = "info";
              this.alert.message = "Add user done!";
              this.close();
              this.errors = [];
              this.admin = {
                id: null,
                name: "",
                name_ar: "",
                desc: "",
                stock: null,
                user_price_of_piece: null,
                library_price_of_piece: null,
                packet_pieces: null,
                user_price_of_packet: null,
                library_price_of_packet: null,
                offer: null,
                image: "",
                category_id: null,
                media: [],
                colors: []
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
      // const index = this.requests.indexOf(item);
      if (confirm("هل تود حذف هذا العنصر ؟")) {
        this.$http.delete(`${this.baseApi}/api/admin/products/${item.id}`).then((res) => {
          this.showNotification("تمت العملية بنجاح");
          this.fetch();
          this.alert.message = "Delete user done";
          this.alert.type = "success";
        });
      }
    },
    viewDescription(item) {
      this.viewDescriptionDialog = !this.viewDescriptionDialog;
      this.productDiscription = item.desc;
      this.reviews = item.reviews
    },
    getCategoriesId(res = null) {
      this.loading = true;
      return new Promise(() => {
        if (res == null) {
          let endpoint = `${this.baseApi}/api/admin/categories?noPaginate=1`;

          this.$http.get(endpoint).then((res) => {
            let items = res.data.map((item) => {
              return {
                id: item.id,
                name: item.name_ar
              };
            });
            this.category_ids = items;
          });
        }
      });
    },
    getColorIds(res = null) {
      this.loading = true;
      return new Promise(() => {
        if (res == null) {
          let endpoint = `${this.baseApi}/api/admin/colors?noPaginate=1`;

          this.$http.get(endpoint).then((res) => {
            let items = res.data.map((item) => {
              return {
                id: item.id,
                code: item.code
              };
            });
            //console.log('getColorIds items >>', items);
            this.color_ids = items;
          });
        }
      });
    },
    addMedia: function () {
      this.admin.media.push({ value: '' });
      this.showMediaError = false;
    },
    deleteMedia: function (index) {
      if (this.admin.media.length > 1) {
        this.admin.media.splice(index, 1);
        this.showMediaError = false;
      }
      else {
        this.showMediaError = true;
      }
    },
    addColor: function (item) {
      if (!item) {
        this.admin.colors.push({
          color_id: null,
          stock: null,
          media: []
        });
        this.addColorMedia(this.admin.colors.length - 1);
      }
      else {
        this.admin.colors.push(
          {
            color_id: item.id,
            stock: item.stock,
            media: item.media
          }
        );
      }
      this.showColorError = false;
    },
    deleteColor: function (index) {
      this.admin.colors.splice(index, 1);
      if (this.admin.colors.length < 1) {
        this.showColorError = true;
      }
      else {
        this.showColorError = false;
      }
    },
    addColorMedia: function (index, item) {
      if (!item) {
        this.admin.colors[index].media.push({ value: '' });
      }
      else {
        //console.log('color media item >>', item);
        this.admin.colors[index].media.push({ value: item });
      }
      this.showColorError = false;
    },
    deleteColorMedia: function (colorIndex, mediaIndex) {
      this.admin.colors[colorIndex].media.splice(mediaIndex, 1);
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

.d-flex {
  display: flex;
}
.w-100 {
  width: 100%;
}
.align-items-center {
  align-items: center;
}
.mx-3 {
  margin-inline: 1rem;
}
.fz12 {
  font-size: 12px;
} 
.text-red {
  color: red;
}
.text-warning {
  color: goldenrod;
}
.ml-2 {
  margin-left: 0.5rem;
}
.mt-3 {
  margin-top: 1rem;
}
.mb-3 {
  margin-bottom: 1rem;
}
.fbold {
  font-weight: 700 !important; 
}
.of-cover {
  object-fit: cover;
  -o-object-fit: cover;
  width: 100%;
  height: 48px;
  margin-top: 8px;
}
</style>
