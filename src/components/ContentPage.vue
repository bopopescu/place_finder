<template>
  <div>
    <a style="float: left; margin-top: 30px; margin-left: 75px;" v-on:click="back" v-if="showExpandedView"><i class="fas fa-arrow-left fa-2x"></i></a>
    <transition name="expand">
        <expanded-item-view v-if="showExpandedView" v-bind:class="{ 'expand-transition' : showExpandedView }"/>
    </transition>
    <section>
      <div class="columns is-multiline">
        <div class="column is-one-quarter" v-for="item in content">
          <div class="card">
            <div class="card-image">
              <figure class="image is-3by2">
                <a v-on:click="togglePic(item.data.image)"><img v-bind:src="item.data.image" alt="Loading..."></a>
              </figure>
            </div>

            <div class="modal" v-bind:class="{ 'is-active': showPic }">
              <div class="modal-background"></div>
              <div class="modal-content">
                <p class="image is-4by3">
                  <img v-bind:src="image" alt="">
                </p>
              </div>
              <button class="modal-close is-large" aria-label="close" v-on:click="togglePic"></button>
            </div>

            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <p class="title is-4">{{ item.data.username }}</p>
                  <p class="subtitle is-6"><a v-on:click="searchUser(item.data.username)">@{{ item.data.username }}</a></p>
                </div>
                <div v-if="$route.fullPath == '/user'">
                  <a v-on:click="edit(item)"><i class="fas fa-edit fa-2x"></i></a>
                  <a class="delete is-large" v-on:click="del(item)"></a>
                </div>
              </div>
              <span id="description">{{ item.data.description }}</span>
              <div class="content columns is-multiline">
                <div class="column tag tagstyle is-narrow" v-for="tag in item.data.tags">
                  <a v-on:click="search(tag)" href="#">#{{tag}}</a>
                </div>
              </div>
                <br>
                <span><em>{{ item.data.address }}</em></span>
                <br>
                <time>Added: {{ item.data.created }}</time>
                <a v-if="$route.fullPath != '/user'" v-on:click="info(item)"><i class="fas fa-info"></i></a>
            </div>
          </div>
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
      showPic: false,
      image: ""
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
          image: item.data.image,
          imageName: item.data.imageName,
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
      this.$router.push({
        path: "search",
        query: { keywords: tag }
      });
    },
    searchUser: function(username) {
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
      this.$store.dispatch("expandItemObject", {
        id: item.id,
        data: {
          image: item.data.image,
          imageName: item.data.imageName,
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
    back: function() {
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

/* always present */
.expand-transition {
  transition: all 0.3s ease;
  max-height: auto;
  padding: 10px;
  /* background-color: #fff; */
  overflow: hidden;
}
/* .expand-enter defines the starting state for entering */
/* .expand-leave defines the ending state for leaving */
.expand-enter,
.expand-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}
</style>