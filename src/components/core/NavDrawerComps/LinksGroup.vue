<template>
  <div>
    <fragment>
      <v-subheader v-if="title !== ''">{{ title }}</v-subheader>
      <LinksGroupItem
        v-for="(link, index) in links"
        :key="index"
        :link="link"
      />
      <v-divider v-if="devider"></v-divider>
    </fragment>
  </div>
</template>

<script>
import LinksGroupItem from "./LinksGroupItem";
export default {
  props: {
    title: {
      type: String,
      required: false,
    },
    links: {
      type: Array,
      required: true,
    },
    devider: {
      type: Boolean,
      required: false,
    },
  },
  components: {
    LinksGroupItem,
  },
};
</script>

<style lang="scss" scoped></style>
