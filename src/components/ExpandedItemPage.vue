<template>
  <div>
    <a style="float: left; margin-top: 30px; margin-left: 75px;" v-on:click="back" v-if="showExpandedView"><i class="fas fa-arrow-left fa-2x"></i></a>
    <transition id="expanded-section" name="expand">
      <expanded-item-view v-if="showExpandedView" v-bind:class="{ 'expand-transition' : showExpandedView }"/>
    </transition>

    <h1>Related content & things nearby</h1>
    <content-page v-bind:content="relatedContent"/>
  </div>
</template>

<script>
import ExpandedItemView from "./ExpandedItemView";
import ContentPage from "./ContentPage";
export default {
  name: "ExpandedItemPagee",
  components: { ExpandedItemView, ContentPage },
  data() {
    return {};
  },
  created: function() {
    this.$store.dispatch("getRelatedContent", this.$route.query.id);
  },
  watch: {
    "$route.query.id": function() {
      this.$store.dispatch("getRelatedContent", this.$route.query.id);
    }
  },
  computed: {
    showExpandedView: function() {
      return this.$store.getters.showExpandedView;
    },
    relatedContent: function() {
      return this.$store.getters.relatedContent;
    }
  },
  methods: {
    back: function() {
      this.$store.dispatch("doFilter", []);
      this.$store.dispatch("expandItemObject", {
        id: "",
        data: {
          images: [],
          description: "",
          tags: "",
          address: "",
          reviews: [],
          location: {},
          userename: "",
          upload: false
        }
      });
      this.$store.dispatch("getRelatedContent", "");
      this.$router.push({
        path: "/content"
      });
      $("expanded-section").removeClass("expand-transition");
      $("expanded-section").addClass("expand-leave");
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
</style>
