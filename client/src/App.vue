<template>
  <div id="app">
    <footballApi></footballApi>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import footballApi from "./components/footballApi.vue";

export default defineComponent({
  name: "App",
  components: {
    footballApi,
  },
});
</script>
<style>
#app {
  margin-left: 20px;
  margin-top: 60px;
}
</style>
