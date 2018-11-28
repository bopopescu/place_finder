<template>
  <div>
    <a style="float: left; margin-top: 30px; margin-left: 75px;" v-on:click="back" v-if="showExpandedView"><i class="fas fa-arrow-left fa-2x"></i></a>
    <transition id="expanded-section" name="expand">
        <expanded-item-view v-if="showExpandedView" v-bind:class="{ 'expand-transition' : showExpandedView }"/>
    </transition>
    <section>
      <div class="columns is-multiline">
        <div class="column is-one-quarter" v-for="item in content">
          <a v-on:click="info(item)"><div class="card">
            <div class="card-image">
              <figure class="image is-3by2">
                <a><img v-bind:src="item.data.images[0]" alt="Loading..."></a> <!--v-on:click="togglePic(item.data.image)"-->
              </figure>
            </div>

            <!-- <div class="modal" v-bind:class="{ 'is-active': showPic }">
              <div class="modal-background"></div>
              <div class="modal-content">
                <p class="image is-4by3">
                  <img v-bind:src="image" alt="">
                </p>
              </div>
              <button class="modal-close is-large" aria-label="close" v-on:click="togglePic"></button>
            </div> -->

            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <p class="title is-4">{{ item.data.username }}</p>
                  <p class="subtitle is-6"><a v-on:click.stop="searchUser(item.data.username)">@{{ item.data.username }}</a></p>
                </div>
                <div v-if="$route.fullPath == '/user'">
                  <a v-on:click.stop="edit(item)"><i class="fas fa-edit fa-2x"></i></a>
                  <a class="delete is-large" v-on:click.stop="del(item)"></a>
                </div>
              </div>
              <span id="description">{{ item.data.description }}</span>
              <div class="content columns is-multiline">
                <div class="column tag tagstyle is-narrow" v-for="tag in item.data.tags">
                  <a v-on:click.stop="search(tag)" href="#">#{{tag}}</a>
                </div>
              </div>
                <br>
                <span><em>{{ item.data.address }}</em></span>
                <br>
                <time>Added: {{ item.data.created }}</time>
            </div>
          </div></a>
        </div>
      </div>
    </section>
    <upload-modal/>
  </div>
</template>

<script>
import UploadModal from "./UploadModal";
import ExpandedItemView from "./ExpandedItemView";
export default {
  name: "ContentPage",
  components: { UploadModal, ExpandedItemView },
  props: ["content"],
  data() {
    return {
      // showPic: false,
      // image: ""
    };
  },
  computed: {
    showExpandedView: function() {
      return this.$store.getters.showExpandedView;
    }
  },
  methods: {
    edit: function(item) {
      this.$store.dispatch("modalObject", {
        id: item.id,
        data: {
          images: item.data.images,
          description: item.data.description,
          tags: item.data.tags,
          address: item.data.address,
          map: item.data.map,
          location: item.data.location,
          userename: item.data.username,
          upload: false
        }
      });
    },
    del: function(item) {
      this.$store.dispatch("deleteUpload", item);
    },
    search: function(tag) {
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
      $("expanded-section").removeClass("expand-transition");
      $("expanded-section").addClass("expand-leave");
      this.$router.push({
        path: "search",
        query: { keywords: tag }
      });
    },
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
      $("expanded-section").removeClass("expand-transition");
      $("expanded-section").addClass("expand-leave");
      this.$router.push({
        path: "userfeed",
        query: { user: username }
      });
    },
    togglePic: function(image) {
      this.showPic = !this.showPic;
      this.image = image;
    },
    info: function(item) {
      if (this.$route.fullPath === "/user") {
        return;
      }
      this.$store
        .dispatch("expandItemObject", {
          id: item.id,
          data: {
            images: item.data.images,
            // imageName: item.data.imageName,
            description: item.data.description,
            tags: item.data.tags,
            address: item.data.address,
            reviews: item.data.reviews,
            location: item.data.location,
            userename: item.data.username,
            upload: false
          }
        })
        .then(() => {
          this.$store.dispatch("tryAPIGeolocation");

          $("expanded-section").removeClass("expand-leave");
          $("expanded-section").addClass("expand-transition");
        });
    },
    back: function() {
      this.$store.dispatch("expandItemObject", {
        id: "",
        data: {
          images: [],
          // imageName: "",
          description: "",
          tags: "",
          address: "",
          reviews: [],
          location: {},
          userename: "",
          upload: false
        }
      });
      $("expanded-section").removeClass("expand-transition");
      $("expanded-section").addClass("expand-leave");
    }
  }
};
</script>

<style scoped>
.column {
  margin-top: 10px;
  margin-bottom: -10px;
}

.tagstyle {
  background-color: white;
  font-size: 1em;
}

section {
  padding: 10px;
}

.card {
  display: flex;
  flex-direction: column;
  max-height: 100%; /* change to 'height' to make all cards same height */
}

.fa-edit {
  color: #35605a;
}

.fa-edit:hover {
  color: #6b818c;
}

.delete {
  background-color: red;
}

.delete:hover {
  background-color: lightcoral;
}

.fa-info {
  color: blue;
  float: right;
}

.fa-info:hover {
  color: rgb(107, 107, 255);
}

#description {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
}
</style>