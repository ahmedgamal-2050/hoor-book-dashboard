<template>
  <v-container fluid>
    <template>
      <v-card>
        <v-toolbar flat color="primary" dark>
          <v-toolbar-title>التصنيفات</v-toolbar-title>
        </v-toolbar>
        <v-tabs grow show-arrows>
          <v-tab>
            <v-icon>accessibility</v-icon>
            مواصفات الجسم
          </v-tab>
          <v-tab>
            <v-icon>import_contacts</v-icon>
            المؤهلات الدراسية
          </v-tab>
          <v-tab>
            <v-icon>self_improvement</v-icon>
            الإلتزام الديني
          </v-tab>
          <v-tab>
            <v-icon>hdr_strong</v-icon>
            لون البشرة
          </v-tab>
          <v-tab>
            <v-icon>smoking_rooms</v-icon>
            التدخين
          </v-tab>
          <v-tab>
            <v-icon>dashboard</v-icon>
            اللحية
          </v-tab>
          <v-tab>
            <v-icon>dashboard</v-icon>
            الحجاب
          </v-tab>

          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <Lookup title="مواصفات الجسم" api="body-specifications" />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <Lookup
                  title="المؤهلات الدراسية"
                  api="educational-qualifications"
                />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <Lookup title="الإلتزام الديني" api="prays" />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <Lookup title="لون البشرة" api="skin-color" />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <Lookup title="التدخين" api="smokes" />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <Lookup title="اللحية" api="beards" />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <Lookup title="الحجاب" api="veil-woman" />
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </template>
  </v-container>
</template>

<script>
import Lookup from "../components/Lookup";
// import OpportunitiesCategory from "../components/categories/OpportunitiesCategory";
// import CharityCategory from "../components/categories/CharityCategory";
// import JobsCategory from "../components/categories/JobsCategory";
// import EventsCategory from "../components/categories/EventsCategory";
// import OffersCategory from "../components/categories/OffersCategory";

export default {
  components: {
    Lookup,
    // OpportunitiesCategory,
    // CharityCategory,
    // JobsCategory,
    // EventsCategory,
    // OffersCategory,
  },
  data: () => ({
    tab: "",
  }),
  methods: {
    fetchRenamingTitles() {
      this.$refs.renamingTitles.fetch();
    },
    //   fetchRenamingCategories(){
    //     this.$refs.renamingCategories.fetch();
    //   },
    //   fetchRenamingSubCategories(){
    //     this.$refs.renamingSubCategories.fetch();
    //   }
  },
};
</script>

<style scoped>
.active.tab {
  color: blue;
}
</style>
