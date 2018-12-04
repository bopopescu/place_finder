<template>
  <div>
    <a style="float: left; margin-top: 45px;" v-on:click="back"><i class="fas fa-arrow-left fa-2x"></i></a>
    <div style="margin-left: 125px;">
      <h1>Results</h1>
      <h4>for "{{ user }}"</h4>
    </div>
    <content-page v-bind:content="content"/>
  </div>
</template>

<script>
import ContentPage from "./ContentPage";
export default {
  name: "UserResults",
  components: { ContentPage },
  data() {
    return {
      content: []
    };
  },
  watch: {
    "$store.getters.filters": function() {
      this.filterSearch();
    },
    "$store.getters.searchResults": function() {
      this.content = this.$store.getters.searchResults;
      if (this.$store.getters.filters.length > 0) {
        this.filterSearch();
      }
    }
  },
  created: function() {
    this.$store.dispatch("doUserSearch", this.$route.query.user).then(resp => {
      if (this.$store.getters.filters.length > 0) {
        this.filterSearch();
      }
    });
  },
  computed: {
    searchResults: function() {
      return this.$store.getters.searchResults;
    },
    user: function() {
      return this.$route.query.user;
    }
  },
  methods: {
    filterSearch: function() {
      this.content = this.$store.getters.searchResults;
      var filters = this.$store.getters.filters;
      if (filters.length === 0) {
        this.content = this.$store.getters.searchResults;
        return;
      }
      this.content = this.searchResults.filter(
        item =>
          require("lodash.intersection")(item.data.categories, filters)
            .length >= filters.length
      );
    },
    back: function() {
      this.$router.back();
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