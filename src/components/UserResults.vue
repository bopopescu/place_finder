<template>
  <div>
    <h1>Results</h1>
    <h4>for "{{ user }}"</h4>
    <content-page v-bind:content="searchResults"/>
  </div>
</template>

<script>
import ContentPage from "./ContentPage";
export default {
  name: "UserResults",
  components: { ContentPage },
  created: function() {
    this.$store.dispatch("doUserSearch", this.$route.query.user);
  },
  computed: {
    searchResults: function() {
      return this.$store.getters.searchResults;
    },
    user: function() {
      return this.$route.query.user;
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