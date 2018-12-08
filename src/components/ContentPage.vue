<template>
  <div>
    <!-- <a style="float: left; margin-top: 30px; margin-left: 75px;" v-on:click="back" v-if="showExpandedView"><i class="fas fa-arrow-left fa-2x"></i></a>
    <transition id="expanded-section" name="expand">
        <expanded-item-view v-if="showExpandedView" v-bind:class="{ 'expand-transition' : showExpandedView }"/>
    </transition> -->
    <section>
      <div class="columns is-multiline">
        <div class="column is-one-quarter" v-for="item in content">
          <a v-on:click.stop="info(item)"><div class="card">
            <div class="card-image">
              <figure class="image is-3by2">
                <a><img style="object-fit: cover;" v-bind:src="item.data.images[0]" alt="Loading..."></a>
              </figure>
            </div>

            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <p class="title is-4">{{ item.data.address }}</p>
                  <p class="subtitle is-6"><a v-on:click.stop="searchUser(item.data.username)">@{{ item.data.username }}</a></p>
                </div>
                <div v-if="$route.fullPath == '/user'">
                  <a v-on:click.stop="edit(item)"><i class="fas fa-edit fa-2x"></i></a>
                  <a class="delete is-large" v-on:click.stop="del(item)"></a>
                </div>
              </div>
              <span id="description">{{ item.data.description }}</span>
              <div class="content columns is-multiline is-variable is-1">
                <div class="column tag tagstyle is-narrow" v-for="tag in item.data.tags">
                  <a v-on:click.stop="search(tag)">#{{tag}}</a>
                </div>
              </div>
                <br>
                <span style="position: absolute; bottom: 0; margin: 10px; margin-left: -10px;"><time>Added: {{ item.data.created }}</time></span>
                <br>
                <p style="float: right; bottom: 0; right: 0; position: absolute; font-size: 1.1em; margin: 10px;">{{ item.data.images.length}} photo<span v-if="item.data.images.length > 1">s</span></p>
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
    return {};
  },
  computed: {
    showExpandedView: function() {
      return this.$store.getters.showExpandedView;
    }
  },
  watch: {
    $route: function() {
      if (this.$route.fullPath === "/content") {
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
      } else {
        var id = this.$route.fullPath.split("/")[2];
        // this.$store.dispatch("searchForItemObject", id);
      }
    }
  },
  methods: {
    edit: function(item) {
      this.$store.dispatch("modalObject", {
        id: item.id,
        data: {
          images: item.data.images,
          categories: item.data.categories,
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
      scroll(0, 0);
      this.$store
        .dispatch("expandItemObject", {
          id: item.id,
          data: {
            images: item.data.images,
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

          this.$router.push({
            // path: "/content/" + item.id,
            path: "/item",
            query: { id: item.id }
          });
        });
    },
    back: function() {
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
        path: "/content"
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
  height: 100%; /* change to 'height' to make all cards same height */
}

.fa-edit {
  color: #006064;
}

.fa-edit:hover {
  color: #428e92;
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