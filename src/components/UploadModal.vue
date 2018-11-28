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
            <!-- <div v-if="imageData != ''">
                  <img id="preview" v-bind:src="imageData">
                </div>
                <div v-else-if="content.data.image != ''">
                  <img id="preview" v-bind:src="contentImage">
                </div> -->

                <!-- <div class="field">
                  <div class="file is-primary has-name">
                    <label class="file-label">
                    <input class="file-input" type="file" accept="image/*" v-on:change="previewImage">
                    <span class="file-cta">
                        <span class="file-icon">
                        <i class="fas fa-upload"></i>
                        </span>
                        <span class="file-label">
                        {{ fileMessage }}
                        </span>
                    </span>
                    <span class="file-name" v-if="fileName != ''">
                        {{ fileName }}
                    </span>
                    <span class="file-name" v-else-if="content.data.imageName != ''">
                        {{ contentImageName }}
                    </span>
                    </label>
                  </div>
                </div> -->



              <div v-for="index in images.length" :key="index">
                <div v-if="images[index-1].image != ''">
                  <img v-bind:src="images[index-1].image">
                </div>

                <div class="field">
                  <div class="file is-primary has-name">
                    <label class="file-label">
                    <input class="file-input" type="file" accept="image/*" v-on:change="previewImage($event,index-1)">
                    <span class="file-cta">
                      <span class="file-icon">
                        <i class="fas fa-upload"></i>
                      </span>
                      <span class="file-label">
                        {{ images[index-1].fileMessage }}
                      </span>
                    </span>
                    <!-- <span class="file-name" v-if="images[index-1].imageName != ''">
                      {{ images[index-1].imageName }}
                    </span> -->
                    </label>
                  </div>
                </div>

                <br v-if="images.length > 1">

              </div>

              <div class="columns" v-if="images.length > 1">
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

              <!-- <div style="margin-top: 10px;" class="columns" v-if="content.data.image != '' || imageData != ''">
                <div class="field has-addons column is-half">
                  <div class="control">
                    <form v-on:submit.prevent="addTag(content.data.upload ? tags : contentTags)">
                    <input class="input" type="text" placeholder="Add tag..." v-model="tagInput">
                    </form>
                  </div>
                  <div class="control">
                    <a class="button is-primary" v-on:click="addTag(content.data.upload ? tags : contentTags)">
                      <i class="fas fa-plus"></i>
                    </a>
                  </div>
                </div>
                <div class="column message is-narrow" v-if="tagError">
                  <span style="color: red;">This tag already exists!</span>
                </div>
              </div> -->

              <div class="columns is-multiline is-variable is-1" v-if="images.length > 1">
                <div class="column is-narrow" v-for="tag in tags" :key="tag">
                  <span class="tag tagger is-medium">
                    {{ tag }}
                    <button class="delete is-small" type="button" v-on:click="deleteTag(tag)"></button>
                  </span>
                </div>
              </div>

              <!-- <div class="columns is-multiline is-variable is-1" v-if="content.data.image != '' || imageData != ''">
                <div class="column is-narrow" v-for="tag in contentTags">
                  <span class="tag tagger is-medium">
                  {{ tag }}
                  <button class="delete is-small" type="button" v-on:click="deleteTag(contentTags, tag)"></button>
                  </span>
                </div>
                <div class="column is-narrow" v-for="tag in tags">
                  <span class="tag tagger is-medium">
                  {{ tag }}
                  <button class="delete is-small" type="button" v-on:click="deleteTag(tags, tag)"></button>
                  </span>
                </div>
              </div> -->

              <div class="control" v-if="images.length > 1">
                <div>
                  <textarea class="textarea has-fixed-size" placeholder="Give a description..." v-model="description"></textarea>
                </div>
                <br>
              </div>

              <!-- <div style="margin-bottom: 12px;" class="control" v-if="content.data.image != '' || imageData != ''">
                <div v-if="content.data.description != ''">
                  <textarea class="textarea has-fixed-size" placeholder="Give a description..." v-model="contentDescription"></textarea>
                </div>
                <div v-else>
                  <textarea class="textarea has-fixed-size" placeholder="Give a description..." v-model="description"></textarea>
                </div>
              </div> -->

              <div style="margin-bottom: -15px;" class="columns" v-if="images.length > 1">
                <form class="column is-full" v-on:submit.prevent="codeAddress">
                  <div class="field has-addons" v-bind:class="{ 'is-loading': mapLoading }">
                    <div class="control is-expanded">
                      <input class="input" type="text" placeholder="Address of destination..." v-model="address">
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

              <!-- <div style="margin-top: 10px;" class="columns" v-if="content.data.image != '' || imageData != ''">
                <form class="column is-full" v-on:submit.prevent="codeAddress">
                  <div class="field has-addons" v-bind:class="{ 'is-loading': mapLoading }">
                    <div class="control is-expanded">
                      <input class="input" type="text" placeholder="Address..." v-model="contentAddress" v-if="content.data.location != undefined">
                      <input class="input" type="text" placeholder="Address..." v-model="address" v-else>
                    </div>
                    <div class="control">
                      <a class="button is-primary" v-on:click="codeAddress">
                        Search
                      </a>
                    </div>
                  </div>
                </form>
              </div> -->

              <div style="margin-top: 15px;" class="columns" v-if="images.length > 1">
                <div class="column is-narrow">
                  <button class="button is-primary" v-bind:class="{ 'is-loading': isLoading }" v-if="images.length > 1">{{ content.data.upload ? 'Upload' : 'Update' }}</button>
                </div>
                <span class="column is-narrow message" v-bind:style="{ color: uploadMessage.messageColor }">{{ uploadMessage.message }}</span>
              </div>

              <!-- <div class="columns" v-if="content.data.image != '' || imageData != ''">
                <div class="column is-narrow">
                  <button class="button is-primary" v-bind:class="{ 'is-loading': isLoading }" v-if="content.data.image != '' || imageData != ''">Upload</button>
                </div>
                <span class="column is-narrow message" v-bind:style="{ color: uploadMessage.messageColor }">{{ uploadMessage.message }}</span>
              </div> -->

            </form>
        </section>
        <footer class="modal-card-foot">
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
      // file: "",
      // imagePreview: false,
      // imageData: "",
      // fileName: "",
      // fileMessage: "Choose an image...",
      tagInput: "",
      tagError: false,
      description: "",
      tags: [],
      address: "",
      addressFormatSuccess: false,
      addressFormatErrorColor: "green",
      addressFormatMessage: "",
      mapLoading: false,
      placeLat: 0.0,
      placeLng: 0.0,
      distance: "",
      duration: ""

      // contentImage: "",
      // contentImageName: "",
      // contentDescription: "",
      // contentTags: [],
      // contentAddress: "",
      // contentLat: 0.0,
      // contentLng: 0.0
    };
  },
  mounted: function() {
    this.images = [];
    this.images[0] = {
      image: "",
      imageName: "",
      fileMessage: "Choose an image..."
    };
  },
  watch: {
    "$store.getters.modalObject"() {
      this.images = [];
      for (var i = 0; i < this.content.data.images.length; i++) {
        this.images.push({
          image: this.content.data.images[i],
          imageName: "",
          fileMessage: "Choose a different image..."
        });
      }
      if (this.images.length < 5) {
        this.images.push({
          image: "",
          imageName: "",
          fileMessage: "Choose an image..."
        });
      }
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
      // this.contentImage = this.content.data.image;
      // this.contentImageName = this.content.data.imageName;
      // this.contentDescription = this.content.data.description;
      // this.contentTags = [];
      // for (var i = 0; i < this.content.data.tags.length; i++) {
      //   this.contentTags.push(this.content.data.tags[i]);
      // }
      // this.contentAddress = this.content.data.address;
      // if (this.content.data.location != undefined) {
      //   this.contentLat = this.content.data.location.lat;
      //   this.contentLng = this.content.data.location.lng;
      // }
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
    previewImage: function(event, index) {
      console.log(index);
      const input = event.target;
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // this.file = input.files[0];
        var file = input.files[0];
        console.log(file);
        // this.fileName = this.file.name;
        this.images[index].imageName = file.name;

        // create a new FileReader to read this image and convert to base64 format
        const reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = e => {
          // Read image as base64 and set to imageData

          // this.imageData = e.target.result;
          this.images[index].image = e.target.result;
          // this.imagePreview = true;

          // this.fileMessage = "Choose a different image...";
          this.images[index].fileMessage = "Choose a different image...";

          if (
            this.images.length < this.maxImages &&
            this.images[index + 1] === undefined
          ) {
            this.images.push({
              image: "",
              imageName: "",
              fileMessage: "Choose an image..."
            });
          }
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
      // this.file = "";
      // this.imageData = "";
      // this.imagePreview = false;
      // this.fileMessage = "Choose an image...";
      // this.fileName = "";
      this.images = [];
      this.images[0] = {
        image: "",
        imageName: "",
        fileMessage: "Choose an image..."
      };
      this.address = "";
      this.addressFormatSuccess = false;
      this.addressFormatErrorColor = "red";
      this.addressFormatMessage = "";
      this.address;
      this.mapLoading = false;
      this.placeLat = 0.0;
      this.placeLng = 0.0;
      this.description = "";
      this.tags = [];

      // this.contentImage = this.content.data.image;
      // this.contentImageName = this.content.data.imageName;
      // this.contentDescription = this.content.data.description;
      // this.contentTags = [];
      // for (var i = 0; i < this.content.data.tags.length; i++) {
      //   this.contentTags.push(this.content.data.tags[i]);
      // }
      // this.contentAddress = this.content.data.address;
      // this.contentLat = this.content.data.location.lat;
      // this.contentLng = this.content.data.location.lng;
    },
    closeModal: function() {
      this.$store.dispatch("modal", { show: false });
    },
    // addTag: function(tags) {
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
    // deleteTag: function(tags, tag) {
    deleteTag: function(tag) {
      for (var i = 0; i < this.tags.length; i++) {
        if (this.tags[i] === tag) {
          this.tags.splice(i, 1);
          return;
        }
      }
    },
    upload: function(id) {
      if (!this.addressFormatSuccess) {
        this.addressFormatMessage = "Please validate this address.";
        this.addressFormatErrorColor = "red";
        return;
      }
      if (id !== "") {
        this.update(id);
        return;
      }
      var blobs = [];
      var n = 0;
      if (this.images.length < 5) {
        n = this.images.length - 1;
      }
      for (var i = 0; i < n; i++) {
        console.log(this.images);
        var block = this.images[i].image.split(";");
        var contentType = block[0].split(":")[1];
        var data = block[1].split(",")[1];
        var blob = this.b64toBlob(data, contentType);
        blobs.push({ image: blob, imageName: this.images[i].imageName });
      }
      // var block = this.imageData.split(";");
      // var contentType = block[0].split(":")[1];
      // var data = block[1].split(",")[1];
      this.$store.dispatch("addUpload", {
        // image: this.b64toBlob(data, contentType),
        images: blobs,
        // imageName: this.fileName,
        description: this.description,
        tags: this.tags,
        address: this.address,
        location: { lat: this.placeLat, lng: this.placeLng }
      });
    },
    update: function(id) {
      var blobs = new Set();
      var urls = [];
      var n = 0;
      if (this.images.length < 5) {
        n = this.images.length - 1;
      }
      for (var i = 0; i < n; i++) {
        // let blob;
        console.log(this.images[i]);
        if (this.images[i].imageName !== "") {
          var block = this.images[i].image.split(";");
          var contentType = block[0].split(":")[1];
          var data = block[1].split(",")[1];
          // blob = this.b64toBlob(data, contentType);
          blobs.add({
            image: this.b64toBlob(data, contentType),
            imageName: this.images[i].imageName
          });
        } else {
          // blob = this.images[i].image;
          blobs.add({
            image: this.images[i].image,
            imageName: this.images[i].imageName
          });
        }
      }
      console.log(blobs);
      // if (this.imageData != "") {
      //   block = this.imageData.split(";");
      //   contentType = block[0].split(":")[1];
      //   data = block[1].split(",")[1];
      // }
      // var imageName;
      // var oldImageName;
      // if (this.fileName !== this.contentImageName && this.fileName !== "") {
      //   imageName = this.fileName;
      //   oldImageName = this.contentImageName;
      // } else {
      //   imageName = this.contentImageName;
      //   oldImageName = "";
      // }
      this.$store.dispatch("updateUpload", {
        id: id,
        // images: blobs,
        images: blobs,
        // urls: urls,
        // data != null ? this.b64toBlob(data, contentType) : this.contentImage,
        // imageName: imageName,
        // oldImageName: oldImageName,
        // description: this.contentDescription,
        description: this.description,
        // tags: this.contentTags,
        tags: this.tags,
        // address: this.contentAddress,
        address: this.address,
        // location: { lat: this.contentLat, lng: this.contentLng }
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
</style>