<template>
  <div class="container" style="display: flex;">
    <div>
      <div style="margin-top: 20px;" class="box">
        <div style="position: relative">
          <a><img class="container" id="image" v-bind:src="content.data.images[currImageIndex]" v-on:click="toggleModal"></a>
          <a v-on:click="rightArrowClick" v-if="content.data.images.length > 1"><i class="far fa-arrow-alt-circle-right fa-3x right-arrow"></i></a>
          <a v-on:click="leftArrowClick" v-if="content.data.images.length > 1"><i class="far fa-arrow-alt-circle-left fa-3x left-arrow"></i></a>
        </div>
        <span style="float: right; font-size: 1.1em;" v-if="content.data.images.length > 1">{{ currImageIndex + 1 }} / {{ content.data.images.length }}</span>


        <div class="modal" v-bind:class="{ 'is-active': showImageModal }">
          <div class="modal-background" v-on:click="toggleModal">
            <a v-on:click.stop="rightArrowClick" v-if="content.data.images.length > 1"><i class="far fa-arrow-alt-circle-right fa-3x right-arrow-modal"></i></a>
            <a v-on:click.stop="leftArrowClick" v-if="content.data.images.length > 1"><i class="far fa-arrow-alt-circle-left fa-3x left-arrow-modal"></i></a>
          </div>
          <div class="modal-image">
            <p class="image">
              <img style="max-height: 1000px; max-width: 900px;" v-bind:src="content.data.images[currImageIndex]">
            </p>
          </div>
          <button class="modal-close is-large" aria-label="close" v-on:click="toggleModal"></button>
        </div>


        <br>
        <h3 v-if="reviews !== undefined">{{ averageRating }} / 5 ({{ reviews.length }} reviews)</h3>
        <br>
        <h3>Description</h3>
        <br>
        <span v-if="content.data.description == ''"><em>No description.</em></span>
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
          <a style="font-size: 1.2em;" v-on:click="toggleSeeReviews">Reviews&nbsp&nbsp
            <i class="fas fa-angle-down" v-if="!seeReviews"></i>
            <i class="fas fa-angle-up" v-if="seeReviews"></i>
          </a>
        </div>
        <transition name="expand">
          <div id="review-section" class="control" v-if="seeReviews">
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
        <transition name="exapnd">
          <div id="reviews-section" v-if="seeReviews">
            <div v-for="review in reviews">
              <a style="font-size: 1.3em;" v-on:click="searchUser(review.user)">@{{ review.user }}</a>&nbsp&nbsp
              <span style="font-size: 1.3em;"><strong>{{ review.rating }} / 5</strong></span>&nbsp&nbsp
              <span style="font-size: 1.1em;">{{ review.created }}</span>
              <br>
              <em>{{ review.review }}</em>
              <hr>
            </div>
          </div>
        </transition>
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExpandedItemView",
  data() {
    return {
      review: "",
      starsClicked: false,
      rating: 0.0,
      seeReviews: false,
      currImageIndex: 0,
      showImageModal: false
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
    },
    reviews: function() {
      return this.$store.getters.currReviews;
    },
    averageRating: function() {
      return this.$store.getters.averageRating;
    }
  },
  methods: {
    searchUser: function(username) {
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
      this.$router.push({
        path: "userfeed",
        query: { user: username }
      });
    },
    leftArrowClick: function() {
      if (this.currImageIndex == 0) {
        this.currImageIndex = this.content.data.images.length - 1;
      } else {
        this.currImageIndex--;
      }
    },
    rightArrowClick: function() {
      if (this.currImageIndex == this.content.data.images.length - 1) {
        this.currImageIndex = 0;
      } else {
        this.currImageIndex++;
      }
    },
    toggleModal: function() {
      this.showImageModal = !this.showImageModal;
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
    toggleSeeReviews: function() {
      if (!this.seeReviews) {
        $("reviews-section").removeClass("expand-leave");
        $("#reviews-section").addClass("expand-transition");
      } else {
        $("#reviews-section").removeClass("expand-transition");
        $("reviews-section").addClass("expand-leave");
      }
      this.seeReviews = !this.seeReviews;
    },
    addReview: function(itemId) {
      this.$store
        .dispatch("addReview", {
          id: itemId,
          review: this.review,
          rating: this.rating
        })
        .then(() => {
          if (
            this.$store.getters.reviewError !==
              "An error occurred. Please try again." ||
            this.$store.getters.reviewError !==
              "You must be logged in to leave a review"
          ) {
            this.rating = 0.0;
            this.review = "";
            this.starsClicked = false;
            this.hoverLeave();
          }
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
  max-width: 600px;
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

.right-arrow {
  position: absolute;
  z-index: 1;
  right: 0;
  top: 45%;
  margin-right: 15px;
  color: rgba(51, 51, 51, 0.6);
}

.right-arrow:hover,
.right-arrow-modal:hover {
  color: blue;
}

.right-arrow-modal {
  position: absolute;
  z-index: 1;
  right: 0;
  top: 45%;
  margin-right: 15px;
  color: white;
}

.left-arrow {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 45%;
  margin-left: 15px;
  color: rgba(51, 51, 51, 0.6);
}

.left-arrow:hover,
.left-arrow-modal:hover {
  color: blue;
}

.left-arrow-modal {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 45%;
  margin-left: 15px;
  color: white;
}
</style>


