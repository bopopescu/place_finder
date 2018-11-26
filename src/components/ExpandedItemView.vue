<template>
  <div class="container">
    <div style="margin-top: 20px;" class="box">
      <img class="container" id="image" v-bind:src="content.data.image">
      <br>
      <!-- <div class="content columns is-multiline">
        <div class="column tag tagstyle is-narrow" v-for="tag in content.data.tags">
          <a v-on:click="search(tag)" href="#">#{{tag}}</a>
        </div>
      </div> -->
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
      <div style="margin-bottom: 15px;">
        <a style="font-size: 1.2em;" v-on:click="toggleLeaveReview">Leave a review&nbsp&nbsp
          <i class="fas fa-angle-down" v-if="!leaveReview"></i>
          <i class="fas fa-angle-up" v-if="leaveReview"></i>
        </a>
      </div>
      <transition name="expand">
        <div id="review-section" class="control" v-if="leaveReview">
          <div style="margin-bottom: 15px;" class="stars">
            <a><i id="star1" class="fas fa-star" v-on:mouseover="starOneHover" v-on:click="starOneClick" v-on:mouseleave="hoverLeave"></i></a>
            <a><i id="star2" class="fas fa-star" v-on:mouseover="starTwoHover" v-on:click="starTwoClick" v-on:mouseleave="hoverLeave"></i></a>
            <a><i id="star3" class="fas fa-star" v-on:mouseover="starThreeHover" v-on:click="starThreeClick" v-on:mouseleave="hoverLeave"></i></a>
            <a><i id="star4" class="fas fa-star" v-on:mouseover="starFourHover" v-on:click="starFourClick" v-on:mouseleave="hoverLeave"></i></a>
            <a><i id="star5" class="fas fa-star" v-on:mouseover="starFiveHover" v-on:click="starFiveClick" v-on:mouseleave="hoverLeave"></i></a>
            <span style="margin-left: 15px;">{{ this.rating }}</span>
          </div>
          <textarea class="textarea has-fixed-size" placeholder="Review..." v-model="review"></textarea>
              <a style="margin-top: 15px;" class="button is-primary" v-bind:class="{ 'is-loading': isLoading }" v-on:click="addReview(content.id)">Submit</a>
              <p style="color: red; margin-top: 15px;">{{ reviewError }}</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExpandedItemView",
  data() {
    return {
      leaveReview: false,
      review: "",
      starsClicked: false,
      rating: 0.0
    };
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
    },
    isLoading: function() {
      return this.$store.getters.isLoading;
    },
    reviewError: function() {
      return this.$store.getters.reviewError;
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
    toggleLeaveReview: function() {
      if (!this.leaveReview) {
        $("review-section").removeClass("expand-leave");
        $("#review-section").addClass("expand-transition");
      } else {
        $("#review-section").removeClass("expand-transition");
        $("review-section").addClass("expand-leave");
      }
      this.leaveReview = !this.leaveReview;
    },
    addReview: function(itemId) {
      this.$store.dispatch("addReview", {
        id: itemId,
        review: this.review,
        rating: this.rating
      });
    },
    starOneHover: function() {
      if (!this.starsClicked) {
        $("#star1").addClass("highlighted");
      }
    },
    starTwoHover: function() {
      if (!this.starsClicked) {
        $("#star1").addClass("highlighted");
        $("#star2").addClass("highlighted");
      }
    },
    starThreeHover: function() {
      if (!this.starsClicked) {
        $("#star1").addClass("highlighted");
        $("#star2").addClass("highlighted");
        $("#star3").addClass("highlighted");
      }
    },
    starFourHover: function() {
      if (!this.starsClicked) {
        $("#star1").addClass("highlighted");
        $("#star2").addClass("highlighted");
        $("#star3").addClass("highlighted");
        $("#star4").addClass("highlighted");
      }
    },
    starFiveHover: function() {
      if (!this.starsClicked) {
        $("#star1").addClass("highlighted");
        $("#star2").addClass("highlighted");
        $("#star3").addClass("highlighted");
        $("#star4").addClass("highlighted");
        $("#star5").addClass("highlighted");
      }
    },
    starOneClick: function() {
      this.starsClicked = true;
      this.rating = 1.0;
      $("#star1").addClass("highlighted");
      $("#star2").removeClass("highlighted");
      $("#star3").removeClass("highlighted");
      $("#star4").removeClass("highlighted");
      $("#star5").removeClass("highlighted");
    },
    starTwoClick: function() {
      this.starsClicked = true;
      this.rating = 2.0;
      $("#star1").addClass("highlighted");
      $("#star2").addClass("highlighted");
      $("#star3").removeClass("highlighted");
      $("#star4").removeClass("highlighted");
      $("#star5").removeClass("highlighted");
    },
    starThreeClick: function() {
      this.starsClicked = true;
      this.rating = 3.0;
      $("#star1").addClass("highlighted");
      $("#star2").addClass("highlighted");
      $("#star3").addClass("highlighted");
      $("#star4").removeClass("highlighted");
      $("#star5").removeClass("highlighted");
    },
    starFourClick: function() {
      this.starsClicked = true;
      this.rating = 4.0;
      $("#star1").addClass("highlighted");
      $("#star2").addClass("highlighted");
      $("#star3").addClass("highlighted");
      $("#star4").addClass("highlighted");
      $("#star5").removeClass("highlighted");
    },
    starFiveClick: function() {
      this.starsClicked = true;
      this.rating = 5.0;
      $("#star1").addClass("highlighted");
      $("#star2").addClass("highlighted");
      $("#star3").addClass("highlighted");
      $("#star4").addClass("highlighted");
      $("#star5").addClass("highlighted");
    },
    hoverLeave: function() {
      if (!this.starsClicked) {
        $("#star1").removeClass("highlighted");
        $("#star2").removeClass("highlighted");
        $("#star3").removeClass("highlighted");
        $("#star4").removeClass("highlighted");
        $("#star5").removeClass("highlighted");
      }
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

.fa-star {
  color: lightgray;
}

.highlighted {
  color: yellow;
}
</style>


