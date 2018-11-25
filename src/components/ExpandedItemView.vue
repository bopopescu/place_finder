<template>
  <div class="container">
    <div style="margin-top: 20px;" class="box">
      <img class="container" id="image" v-bind:src="content.data.image">
      <br>
      <div class="content columns is-multiline">
        <div class="column tag tagstyle is-narrow" v-for="tag in content.data.tags">
          <a v-on:click="search(tag)" href="#">#{{tag}}</a>
        </div>
      </div>
      <br>
      <h3>Description</h3>
      <br>
      <span><em>{{ content.data.description }}</em></span>
      <br>
      <br>
      <h4>{{ content.data.address }}</h4>
      <br>
      <img class="container" id="map" v-bind:src="mapUrl">
      <br>
      <div class="columns is-variable is-1">
        <i class="fas fa-car fa-2x column is-narrow"></i>
        <span class="column is-narrow" v-if="distance != ''">{{ distance }}&nbsp&nbsp|</span>
        <span class="column" v-if="duration != ''">{{ duration }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExpandedItemView",
  data() {
    return {};
  },
  computed: {
    content: function() {
      return this.$store.getters.expandedItemObject;
    },
    distance: function() {
      return this.$store.getters.distance;
    },
    duration: function() {
      return this.$store.getters.duration;
    },
    mapUrl: function() {
      return this.$store.getters.mapUrl;
    }
  },
  methods: {
    search: function(tag) {
      this.$store.dispatch("expandItemObject", {
        id: "",
        data: {
          image: "",
          imageName: "",
          description: "",
          tags: "",
          address: "",
          map: "",
          location: {},
          userename: "",
          upload: false
        }
      });
      this.$router.push({
        path: "search",
        query: { keywords: tag }
      });
    }
  }
};
</script>

<style scoped>
h3 {
  font-size: 2em;
}

h4 {
  font-size: 1.5em;
}

#image {
  max-width: 1280px;
  max-height: 700px;
  display: flex;
}

#map {
  max-width: 800px;
  max-height: 800px;
  display: flex;
}

.tagstyle {
  background-color: white;
  font-size: 1.2em;
}
</style>


