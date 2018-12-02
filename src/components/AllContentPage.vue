<template>
  <content-page v-bind:content="content"/>
</template>

<script>
import ContentPage from "./ContentPage";
export default {
  name: "AllContentPage",
  components: { ContentPage },
  data() {
    return {
      content: []
    };
  },
  watch: {
    "$store.getters.filters": function() {
      this.filterContent();
    },
    "$store.getters.allContent": function() {
      this.content = this.$store.getters.allContent;
      if (this.$store.getters.filters.length > 0) {
        this.filterContent();
      }
    }
  },
  computed: {
    allContent: function() {
      return this.$store.getters.allContent;
    },
    filters: function() {
      return this.$store.getters.filters;
    }
  },
  methods: {
    filterContent: function() {
      var filters = this.$store.getters.filters;
      if (filters.length === 0) {
        this.content = this.$store.getters.allContent;
        return;
      }

      this.content = this.allContent.filter(
        item =>
          require("lodash.intersection")(item.data.categories, filters)
            .length >= filters.length
      );
    }
  },
  mounted: function() {
    this.$store.dispatch("getAllUploads");
  }
};
</script>

<style scoped>
</style>