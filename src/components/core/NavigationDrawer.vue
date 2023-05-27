<template>
  <v-navigation-drawer v-model="toggle" fixed app right="right">
    <v-toolbar flat color="secondary" class="toolbar">
      <router-link :to="{ name: 'Home' }">
        <img src="../../assets/hb-logo.svg" width="36px" />
      </router-link>
      <router-link :to="{ name: 'Home' }" class="text"
        >ESC Admin Panel</router-link
      >
    </v-toolbar>
    <!-- <v-list>
      <v-list-tile
        v-if="can('Show Dashboard')"
        @click="changeRoute('Dashboard', 1)"
        :class="[{ 'active-li': selectedIndex === 1 }]"
      >
        <v-list-tile-action>
          <v-icon :class="[{ active: selectedIndex === 1 }]">dashboard</v-icon>
        </v-list-tile-action>
        <v-list-tile-title
          :class="[{ active: selectedIndex === 1 }, 'item-title']"
          >Dashboard</v-list-tile-title
        >
      </v-list-tile>

      <v-list-tile
        v-if="can('Show Admin')"
        @click="changeRoute('Admins', 2)"
        :class="[{ 'active-li': selectedIndex === 2 }]"
      >
        <v-list-tile-action>
          <v-icon :class="[{ active: selectedIndex === 2 }]"
            >supervised_user_circle</v-icon
          >
        </v-list-tile-action>
        <v-list-tile-title
          :class="[{ active: selectedIndex === 2 }, 'item-title']"
          >Admins</v-list-tile-title
        >
      </v-list-tile>

      <v-list-tile
        v-if="can('Show Users')"
        @click="changeRoute('Users', 3)"
        :class="[{ 'active-li': selectedIndex === 3 }]"
      >
        <v-list-tile-action>
          <v-icon :class="[{ active: selectedIndex === 3 }]"
            >people_outline</v-icon
          >
        </v-list-tile-action>
        <v-list-tile-title
          :class="[{ active: selectedIndex === 3 }, 'item-title']"
          >Users</v-list-tile-title
        >
      </v-list-tile>

      <v-list-tile
        v-if="can('Show Role')"
        @click="changeRoute('Roles', 4)"
        :class="[{ 'active-li': selectedIndex === 4 }]"
      >
        <v-list-tile-action>
          <v-icon :class="[{ active: selectedIndex === 4 }]">pan_tool</v-icon>
        </v-list-tile-action>
        <v-list-tile-title
          :class="[{ active: selectedIndex === 4 }, 'item-title']"
          >Roles</v-list-tile-title
        >
      </v-list-tile>

      <v-list-tile
        v-if="can('Show Events')"
        @click="changeRoute('Event', 5)"
        :class="[{ 'active-li': selectedIndex === 5 }]"
      >
        <v-list-tile-action>
          <v-icon :class="[{ active: selectedIndex === 5 }]">event</v-icon>
        </v-list-tile-action>
        <v-list-tile-title
          :class="[{ active: selectedIndex === 5 }, 'item-title']"
          >Events</v-list-tile-title
        >
      </v-list-tile>

      <v-list-tile
        v-if="can('Show Jobs')"
        @click="changeRoute('Jobs', 6)"
        :class="[{ 'active-li': selectedIndex === 6 }]"
      >
        <v-list-tile-action>
          <v-icon :class="[{ active: selectedIndex === 6 }]"
            >work_outline</v-icon
          >
        </v-list-tile-action>
        <v-list-tile-title
          :class="[{ active: selectedIndex === 6 }, 'item-title']"
          >Jobs</v-list-tile-title
        >
      </v-list-tile>

      <v-list-tile
        v-if="can('Show Products')"
        @click="changeRoute('Products', 7)"
        :class="[{ 'active-li': selectedIndex === 7 }]"
      >
        <v-list-tile-action>
          <v-icon :class="[{ active: selectedIndex === 7 }]">inbox</v-icon>
        </v-list-tile-action>
        <v-list-tile-title
          :class="[{ active: selectedIndex === 7 }, 'item-title']"
          >Products</v-list-tile-title
        >
      </v-list-tile>

      <v-list-tile
        v-if="can('Show Categories')"
        @click="changeRoute('Categories', 8)"
        :class="[{ 'active-li': selectedIndex === 8 }]"
      >
        <v-list-tile-action>
          <v-icon :class="[{ active: selectedIndex === 8 }]"
            >add_to_photos</v-icon
          >
        </v-list-tile-action>
        <v-list-tile-title
          :class="[{ active: selectedIndex === 8 }, 'item-title']"
          >Categories</v-list-tile-title
        >
      </v-list-tile>

      <v-list-tile
        v-if="can('Show Opportunity')"
        @click="changeRoute('Opportunity', 9)"
        :class="[{ 'active-li': selectedIndex === 9 }]"
      >
        <v-list-tile-action>
          <v-icon :class="[{ active: selectedIndex === 9 }]">work</v-icon>
        </v-list-tile-action>
        <v-list-tile-title
          :class="[{ active: selectedIndex === 9 }, 'item-title']"
          >Job Opportunites</v-list-tile-title
        >
      </v-list-tile>

      <v-list-tile
        v-if="can('Show Charity')"
        @click="changeRoute('Charity', 10)"
        :class="[{ 'active-li': selectedIndex === 10 }]"
      >
        <v-list-tile-action>
          <v-icon :class="[{ active: selectedIndex === 10 }]">favorite</v-icon>
        </v-list-tile-action>
        <v-list-tile-title
          :class="[{ active: selectedIndex === 10 }, 'item-title']"
          >Charity</v-list-tile-title
        >
      </v-list-tile>

      <v-list-tile
        v-if="can('Shiow MedicalCategory')"
        @click="changeRoute('MedicalCategory', 11)"
        :class="[{ 'active-li': selectedIndex === 11 }]"
      >
        <v-list-tile-action>
          <v-icon :class="[{ active: selectedIndex === 11 }]">bookmarks</v-icon>
        </v-list-tile-action>
        <v-list-tile-title
          :class="[{ active: selectedIndex === 11 }, 'item-title']"
          >Medical Category</v-list-tile-title
        >
      </v-list-tile>

      <v-list-tile
        v-if="can('Show MedicalUsers')"
        @click="changeRoute('MedicalUsers', 12)"
        :class="[{ 'active-li': selectedIndex === 12 }]"
      >
        <v-list-tile-action>
          <v-icon :class="[{ active: selectedIndex === 12 }]"
            >nature_people</v-icon
          >
        </v-list-tile-action>
        <v-list-tile-title
          :class="[{ active: selectedIndex === 12 }, 'item-title']"
          >Medical Users</v-list-tile-title
        >
      </v-list-tile>

      <v-list-tile
        v-if="can('Show Pages')"
        @click="changeRoute('Questions', 13)"
        :class="[{ 'active-li': selectedIndex === 13 }]"
      >
        <v-list-tile-action>
          <v-icon :class="[{ active: selectedIndex === 13 }]">security</v-icon>
        </v-list-tile-action>
        <v-list-tile-title
          :class="[{ active: selectedIndex === 13 }, 'item-title']"
          >Questions</v-list-tile-title
        >
      </v-list-tile>

      <v-list-tile
        v-if="can('Show Pages')"
        @click="changeRoute('Pages', 14)"
        :class="[{ 'active-li': selectedIndex === 14 }]"
      >
        <v-list-tile-action>
          <v-icon :class="[{ active: selectedIndex === 14 }]"
            >phone_iphone</v-icon
          >
        </v-list-tile-action>
        <v-list-tile-title
          :class="[{ active: selectedIndex === 14 }, 'item-title']"
          >Pages</v-list-tile-title
        >
      </v-list-tile>
    </v-list> -->
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    toggle: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  data() {
    return {
      selectedIndex: 1,
      secondary: "#000",
    };
  },

  methods: {
    changeRoute(routeName, selectedIndex) {
      const app = this;

      app.selectedIndex = selectedIndex;

      return app.$router.push({ name: routeName });
    },
  },
};
</script>

<style>
.toolbar {
  font-weight: bold;
  font-size: 18px;
}

.toolbar .text {
  padding-left: 15px;
  color: white;
  text-decoration: none;
}

.item-title {
  font-size: 17px;
  font-weight: 500;
}
.item-sub-title {
  font-size: 15px;
  font-weight: 500;
}

.active {
  font-weight: bold;
  color: #29306f !important;
}

.active-li {
  background: #ddd;
}
</style>
