<template>

  <div>
    <a v-on:click="displayModal"><fab :position="position" :bg-color="bgColor" z-index="1"/></a>
    <content-page v-bind:content="userContent"/>
  </div>

</template>

<script>
import fab from "vue-fab";
import ContentPage from "./ContentPage";
export default {
  name: "UserPage",
  components: { ContentPage, fab },
  data() {
    return {
      bgColor: "#006064",
      position: "bottom-right",
      fabAction: []
    };
  },
  created: function() {
    this.$store.dispatch("getUserUploads");
  },
  computed: {
    userContent: function() {
      return this.$store.getters.userContent;
    }
  },
  methods: {
    displayModal: function() {
      this.$store.dispatch("modalObject", {
        id: "",
        data: {
          images: [],
          categories: [],
          description: "",
          tags: [],
          userename: "",
          upload: true
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
