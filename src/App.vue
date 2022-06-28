<script lang="ts">
import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export default defineComponent({
  components: {
    RouterView,
  },
  mounted() {},
});
</script>

<template>
  <div>
    <router-view />
  </div>
</template>

