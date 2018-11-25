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
    return {
      userLat: 0.0,
      userLng: 0.0,
      distance: "",
      duration: "",
      mapUrl: ""
    };
  },
  computed: {
    content: function() {
      return this.$store.getters.expandedItemObject;
    }
  },
  watch: {
    "$store.getters.expandedItemObject"() {
      this.tryAPIGeolocation();
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
    },
    tryAPIGeolocation: function() {
      var vm = this;
      $.post(
        "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyB3HKFnDKKFFCM_dTgTJGsTEOtOg3PQb04",
        function(success) {
          vm.userLat = success.location.lat;
          vm.userLng = success.location.lng;
          vm.distanceMatrix();
        }
      ).fail(function(err) {
        alert("API Geolocation error! \n\n" + err);
      });
    },
    distanceMatrix: function() {
      var origin = { lat: this.userLat, lng: this.userLng };
      var destination = {
        lat: this.content.data.location.lat,
        lng: this.content.data.location.lng
      };
      this.mapUrl =
        "https://maps.googleapis.com/maps/api/staticmap?size=600x300&maptype=roadmap" +
        "&markers=color:blue%7Clabel:H%7C" +
        this.userLat +
        "," +
        this.userLng +
        "&markers=color:red%7Clabel:D%7C" +
        this.content.data.location.lat +
        "," +
        this.content.data.location.lng +
        "&key=AIzaSyB3HKFnDKKFFCM_dTgTJGsTEOtOg3PQb04";

      var service = new google.maps.DistanceMatrixService();
      var dis = "";
      var dur = "";
      var vm = this;
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: "DRIVING",
          unitSystem: google.maps.UnitSystem.IMPERIAL,
          avoidHighways: false,
          avoidTolls: false
        },
        function(response, status) {
          if (status !== "OK") {
            console.log("Error was: " + status);
          } else {
            console.log(response);
            vm.distance = response.rows[0].elements[0].distance.text;
            vm.duration = response.rows[0].elements[0].duration.text;
          }
        }
      );
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


