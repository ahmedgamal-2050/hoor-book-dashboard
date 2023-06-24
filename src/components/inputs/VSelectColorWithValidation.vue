<template>
  <ValidationProvider
    :name="$attrs.label"
    :rules="rules"
    v-slot="{ errors, valid }"
>                
    <v-select
      v-model="innerValue"
      :error-messages="errors"
      :success="valid"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-slot:item="{ item }">
        <span>{{ item['code'] }}</span>
        <span :style="{'background': item['code'] ? item['code'] : 'red'}" style="width: 16px; height: 16px; margin-inline: 5px; display: inline-block; border-radius: 4px;"></span>
      </template>
      <template v-slot:selection="{ item }">
        <span>{{ item['code'] }}</span>
        <span :style="{'background': item['code'] ? item['code'] : 'red'}" style="width: 16px; height: 16px; margin-inline: 5px; display: inline-block; border-radius: 4px;"></span>
      </template>
    </v-select>
  </ValidationProvider>
</template>

<script>
export default {
  props: {
    rules: {
      type: [Object, String],
      default: "",
    },
    // must be included in props
    value: {
      type: null,
    },
  },
  data: () => ({
    innerValue: "",
  }),
  watch: {
    // Handles internal model changes.
    innerValue(newVal) {
      this.$emit("input", newVal);
    },
    // Handles external model changes.
    value(newVal) {
      this.innerValue = newVal;
    },
  },
  created() {
    if (this.value) {
      this.innerValue = this.value;
    }
  },
};
</script>
