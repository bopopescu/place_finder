<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
  	<div class="navbar-brand">
	    <router-link to="/" class="navbar-item navbar-text" v-if="!loggedIn">
        <i class="fas fa-camera fa-2x"></i>
	    	<strong style="margin-left: 5px; font-size: 1.2em;">Pictogram</strong>
	    </router-link>
      <router-link to="/content" class="navbar-item navbar-text" v-else>
        <i class="fas fa-camera fa-2x"></i>
	    	<strong style="margin-left: 5px; font-size: 1.2em;">Pictogram</strong>
      </router-link>

	    <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
	      <span aria-hidden="true"></span>
	      <span aria-hidden="true"></span>
	      <span aria-hidden="true"></span>
	    </a>
	  </div>

      <!-- <router-link v-bind:class="{ active: $route.fullPath === '/content' }" to="/content" class="navbar-item navbar-end navbar-text">
        All Content
      </router-link> -->

	  <div id="navbarBasicExample" class="navbar-menu">
	    <div class="navbar-start">

				<form class="field navbar-item inputfield" v-on:submit.prevent="search">
					<div class="control has-icons-left">
						<input style="width: 450px;" class="input" placeholder="Search Pictogram" v-model="keywords">
						<a href="#" v-on:click="search" class="icon is-small is-left search"><i class="fas fa-search"></i></a>
					</div>
				</form>
	    </div>

			<div class="navbar-item">
				<div style="color: red;" v-if="loginError != ''">{{ loginError }}</div>
			</div>

			<div class="navbar-end" v-if="!loggedIn">
        <router-link v-bind:class="{ active: $route.fullPath === '/content' }" to="/content" class="navbar-item navbar-end navbar-text">
          All Destinations
        </router-link>
        <div class="field navbar-item inputfield">
          <p class="control has-icons-left">
            <input class="input" type="email" placeholder="Email" v-model="email" v-on:keyup.enter="login">
            <span class="icon is-small is-left">
              <i class="fas fa-envelope"></i>
            </span>
          </p>
        </div>
        <div class="field navbar-item inputfield" v-if="!loggedIn">
          <p class="control has-icons-left">
            <input class="input" type="password" placeholder="Password" v-model="password" v-on:keyup.enter="login">
            <span class="icon is-small is-left">
              <i class="fas fa-lock"></i>
            </span>
          </p>
        </div>
        <div class="buttons navbar-end navbar-item">
          <a class="button is-primary" type="button" v-on:click="login" v-bind:class="{ 'is-loading' : isLoading }">
            Log in
          </a>
        </div>
			</div>
      <div v-else class="navbar-end">
        <!-- <a v-on:click="displayModal"><i class="fas fa-plus navbar-item fa-2x"></i></a> -->
        <router-link v-bind:class="{ active: $route.fullPath === '/content' }" to="/content" class="navbar-item navbar-end navbar-text">
          All Destinations
        </router-link>
        <router-link v-bind:class="{ active: $route.fullPath === '/user' }" to="/user" class="navbar-item navbar-text">
          <a style="color: black;" v-on:click="clearItemObject">Manage Destinations</a>
        </router-link>
        <a class="navbar-item navbar-text" v-on:click="logout">
          <i style="margin-right: 5px;" class="fas fa-sign-out-alt"></i>Logout
        </a>
      </div>
	 	</div>
	</nav>
</template>

<script>
export default {
  name: "AppHeader",
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      keywords: ""
    };
  },
  watch: {
    keywords: function() {
      this.search();
    }
  },
  computed: {
    loggedIn: function() {
      return this.$store.getters.loggedIn;
    },
    loginError: function() {
      return this.$store.getters.loginError;
    },
    user: function() {
      return this.$store.getters.user;
    },
    isLoading: function() {
      return this.$store.getters.isLoading;
    },
    currExpandedItem: function() {
      return this.$store.getters.expandedItemObject;
    }
  },
  methods: {
    login: function() {
      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password
        })
        .then(user => {
          if (user !== undefined) {
            this.email = "";
            this.password = "";
            this.confirmPassword = "";
            this.$router.push({
              path: "content"
            });
          }
        });
    },
    search: function() {
      if (this.currExpandedItem.id !== "") {
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
      }
      this.$router.push({
        path: "search",
        query: { keywords: this.keywords }
      });
      if (this.keywords === "") {
        this.$router.push({
          path: "/content"
        });
      }
    },
    logout: function() {
      this.$store.dispatch("logout").then(res => {
        this.$router.push({ path: "/" });
      });
    },
    displayModal: function() {
      this.$store.dispatch("modalObject", {
        id: "",
        data: {
          images: [],
          description: "",
          tags: [],
          userename: "",
          upload: true
        }
      });
    },
    clearItemObject: function() {
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

      this.$store.dispatch("doFilter", []);
    }
  },
  mounted: function() {
    this.show = true;
  }
};
</script>

<style scoped>
.navbar-text {
  color: #000;
}

nav {
  background-color: #d8e4ff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.3);
}

.inputfield {
  margin: 0;
}

.search:hover {
  color: black;
}

.active {
  background-color: #f2f2f2;
}

.fa-plus {
  color: #35605a;
}
</style>
