<template>

    <div class="modal" v-bind:class="{ 'is-active': showModal }">
        <div class="modal-background"></div>
        <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">{{ content.data.upload ? 'Upload' : 'Edit' }}</p>
            <button class="delete" aria-label="close" v-on:click="closeModal"></button>
        </header>
        <section class="modal-card-body">
            <form enctype="multipart/form-data" v-on:submit.prevent="upload(content.id)">

              <div class="field">
                <div class="file is-primary">
                  <label class="file-label">
                    <input class="file-input" type="file" accept="image/*" v-on:change="previewImage">
                    <span class="file-cta">
                      <span class="file-icon">
                        <i class="fas fa-upload"></i>
                      </span>
                      <span class="file-label">
                        Choose an image...
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <p style="color: red; padding-bottom: 15px;">{{ imageErrorMessage }}</p>

              <div class="columns is-multiline is-variable is-1" v-if="images.length > 0">
                <div class="column is-narrow" v-for="index in images.length" :key="index">
                  <div v-if="images[index-1].image != ''">
                    <div>
                      <div style="position: relative;">
                        <button type="button" style="position: absolute; right: 0;" class="delete is-small" aria-label="close" v-on:click="deleteImage(index-1)"></button>
                        <img style="width: 125px; height: 100px;" v-bind:src="images[index-1].image">
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div class="columns">
                <div class="field has-addons column is-half">
                  <div class="control">
                    <form v-on:submit.prevent="addTag">
                      <input class="input" type="text" placeholder="Add tag..." v-model="tagInput">
                    </form>
                  </div>
                  <div class="control">
                    <a class="button is-primary" v-on:click="addTag">
                      <i class="fas fa-plus"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div class="columns is-multiline is-variable is-1">
                <div class="column is-narrow" v-for="tag in tags" :key="tag">
                  <span class="tag tagger is-medium">
                    {{ tag }}
                    <button class="delete is-small" type="button" v-on:click="deleteTag(tag)"></button>
                  </span>
                </div>
              </div>

              <div class="control">
                <div>
                  <textarea class="textarea has-fixed-size" placeholder="Give a description..." v-model="description"></textarea>
                </div>
                <br>
              </div>

              <div style="margin-bottom: -15px;" class="columns">
                <form class="column is-full" v-on:submit.prevent="codeAddress">
                  <div class="field has-addons" v-bind:class="{ 'is-loading': mapLoading }">
                    <div class="control is-expanded">
                      <input id="address-input" class="input" type="text" placeholder="Address of destination..." v-model="address">
                    </div>
                    <div class="control">
                      <a class="button is-primary" v-on:click="codeAddress">
                        Validate Address
                      </a>
                    </div>
                  </div>
                </form>
              </div>
              <p style="margin-top: 10px;" v-bind:style="{ color: addressFormatErrorColor }">{{ addressFormatMessage }}</p>

              <div>
                <span class="message" v-bind:style="{ color: uploadMessage.messageColor }">{{ uploadMessage.message }}</span>
              </div>

            </form>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary" v-bind:class="{ 'is-loading': isLoading }" v-on:click="upload(content.id)">{{ content.data.upload ? 'Upload' : 'Update' }}</button>
          <button class="button" v-on:click="cancelModal">Cancel</button>
        </footer>
        </div>
    </div>

</template>

<script>
const mapsClient = require("@google/maps").createClient({
  key: "AIzaSyB3HKFnDKKFFCM_dTgTJGsTEOtOg3PQb04",
  rate: { limit: 50 }
});
export default {
  name: "UploadModal",
  data() {
    return {
      images: [],
      maxImages: 5,
      tagInput: "",
      tagError: false,
      description: "",
      tags: [],
      address: "",
      imageErrorMessage: "",
      addressFormatSuccess: false,
      addressFormatErrorColor: "green",
      addressFormatMessage: "",
      mapLoading: false,
      placeLat: 0.0,
      placeLng: 0.0,
      distance: "",
      duration: ""
    };
  },
  watch: {
    "$store.getters.modalObject"() {
      this.description = this.content.data.description;
      this.tags = [];
      for (var i = 0; i < this.content.data.tags.length; i++) {
        this.tags.push(this.content.data.tags[i]);
      }
      this.address = this.content.data.address;
      if (this.content.data.location !== undefined) {
        this.placeLat = this.content.data.location.lat;
        this.placeLng = this.content.data.location.lng;

        this.addressFormatSuccess = true;
        this.addressFormatErrorColor = "green";
        this.addressFormatMessage = "";
      }
    }
  },
  computed: {
    showModal: function() {
      return this.$store.getters.showModal;
    },
    isLoading: function() {
      return this.$store.getters.isLoading;
    },
    uploadMessage: function() {
      return this.$store.getters.uploadMessage;
    },
    content: function() {
      return this.$store.getters.modalObject;
    }
  },
  methods: {
    previewImage: function(event) {
      const input = event.target;
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        var file = input.files[0];

        // create a new FileReader to read this image and convert to base64 format
        const reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = e => {
          // Read image as base64 and set to imageData

          // this.images[index].image = e.target.result;
          this.images.push({
            image: e.target.result,
            imageName: file.name
          });

          this.imageErrorMessage = "";
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0]);
      }
    },
    displayModal: function() {
      this.$store.dispatch("modal", { show: true });
    },
    cancelModal: function() {
      this.$store.dispatch("modal", { show: false });
      this.images = [];
      this.images[0] = {
        image: "",
        imageName: ""
      };
      this.address = "";
      this.imageErrorMessage = "";
      this.addressFormatSuccess = false;
      this.addressFormatErrorColor = "red";
      this.addressFormatMessage = "";
      this.address;
      this.mapLoading = false;
      this.placeLat = 0.0;
      this.placeLng = 0.0;
      this.description = "";
      this.tags = [];
    },
    closeModal: function() {
      this.$store.dispatch("modal", { show: false });
      this.imageErrorMessage = "";
      this.addressFormatSuccess = false;
      this.addressFormatErrorColor = "red";
      this.addressFormatMessage = "";
    },
    deleteImage: function(index) {
      this.images.splice(index, 1);
    },
    addTag: function() {
      for (var i = 0; i < this.tags.length; i++) {
        if (this.tags[i] === this.tagInput) {
          this.tagError = true;
          return;
        }
      }
      this.tagError = false;
      this.tags.push(this.tagInput.toLowerCase());
      this.tagInput = "";
    },
    deleteTag: function(tag) {
      for (var i = 0; i < this.tags.length; i++) {
        if (this.tags[i] === tag) {
          this.tags.splice(i, 1);
          return;
        }
      }
    },
    upload: function(id) {
      if (this.images.length === 0) {
        this.imageErrorMessage = "You must select at least one image.";
        return;
      }
      if (!this.addressFormatSuccess) {
        this.addressFormatMessage = "Please validate this address.";
        this.addressFormatErrorColor = "red";
        console.log("here");
        $("#address-input").focus();
        return;
      }
      if (id !== "") {
        this.update(id);
        return;
      }
      var blobs = [];
      for (var i = 0; i < this.images.length; i++) {
        console.log(this.images);
        var block = this.images[i].image.split(";");
        var contentType = block[0].split(":")[1];
        var data = block[1].split(",")[1];
        var blob = this.b64toBlob(data, contentType);
        blobs.push({ image: blob, imageName: this.images[i].imageName });
      }
      this.$store.dispatch("addUpload", {
        images: blobs,
        description: this.description,
        tags: this.tags,
        address: this.address,
        location: { lat: this.placeLat, lng: this.placeLng }
      });
    },
    update: function(id) {
      var blobs = new Set();
      var urls = [];
      for (var i = 0; i < this.images.length; i++) {
        console.log(this.images[i]);
        if (this.images[i].imageName !== "") {
          var block = this.images[i].image.split(";");
          var contentType = block[0].split(":")[1];
          var data = block[1].split(",")[1];
          blobs.add({
            image: this.b64toBlob(data, contentType),
            imageName: this.images[i].imageName
          });
        } else {
          blobs.add({
            image: this.images[i].image,
            imageName: this.images[i].imageName
          });
        }
      }
      console.log(blobs);
      this.$store.dispatch("updateUpload", {
        id: id,
        images: blobs,
        description: this.description,
        tags: this.tags,
        address: this.address,
        location: { lat: this.placeLat, lng: this.placeLng }
      });
    },
    b64toBlob: function(b64Data, contentType, sliceSize) {
      contentType = contentType || "";
      sliceSize = sliceSize || 512;

      var byteCharacters = atob(b64Data);
      var byteArrays = [];

      for (
        var offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays, { type: contentType });
      return blob;
    },
    codeAddress: function() {
      this.mapLoading = true;
      var address;
      if (this.contentAddress != undefined) {
        address = this.contentAddress;
      } else {
        address = this.address;
      }
      mapsClient.geocode(
        {
          address: address
        },
        (err, response) => {
          if (!err) {
            var json = response.json.results;
            if (this.contentAddress != undefined) {
              this.contentAddress = json[0]["formatted_address"];
            } else {
              this.address = json[0]["formatted_address"];
            }
            this.placeLat = json[0]["geometry"]["location"]["lat"];
            this.placeLng = json[0]["geometry"]["location"]["lng"];
            this.mapLoading = false;
            this.addressFormatSuccess = true;
            this.addressFormatMessage = "You're good to go!";
            this.addressFormatErrorColor = "green";
          } else {
            this.mapLoading = false;
            this.addressFormatSuccess = false;
            this.addressFormatErrorColor = "red";
            this.addressFormatMessage = "Please validate this address again.";
            console.log(err);
          }
        }
      );
    }
  }
};
</script>

<style scoped>
img {
  max-width: 100%;
}

.tagger {
  background-color: #d8e4ff;
  color: black !important;
}

.message {
  margin: auto;
  margin-left: 0;
  background-color: white;
}

.error {
  color: red;
}
</style>