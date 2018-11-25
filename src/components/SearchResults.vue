<template>
  <div>
    <h1>Results</h1>
    <h4>for "{{ keywords }}"</h4>
    <content-page v-bind:content="searchResults"/>
  </div>
</template>

<script>
import ContentPage from "./ContentPage";
export default {
  name: "SearchResults",
  components: { ContentPage },
  created: function() {
    this.$store.dispatch("doSearch", this.$route.query.keywords);
  },
  watch: {
    "$route.query.keywords"() {
      this.$store.dispatch("doSearch", this.$route.query.keywords);
    }
  },
  computed: {
    searchResults: function() {
      return this.$store.getters.searchResults;
    },
    keywords: function() {
      return this.$route.query.keywords;
    }
  }
};
</script>

<style scoped>
h1 {
  font-size: 3em;
  margin: 0;
  padding-left: 5%;
  padding-top: 2%;
  color: black;
}

h4 {
  font-size: 1.5em;
  margin: 0;
  padding-left: 5%;
}
</style>
