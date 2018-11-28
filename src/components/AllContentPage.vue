<template>
  <content-page v-bind:content="allContent"/>
</template>

<script>
import ContentPage from "./ContentPage";
export default {
  name: "AllContentPage",
  components: { ContentPage },
  data() {
    return {};
  },
  computed: {
    allContent: function() {
      return this.$store.getters.allContent;
    }
  },
  mounted: function() {
    this.$store.dispatch("getAllUploads");
  }
};
</script>

<style scoped>
</style>