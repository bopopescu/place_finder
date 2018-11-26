<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
  	<div class="navbar-brand">
	    <router-link to="/" class="navbar-item navbar-text">
        <i class="fas fa-camera fa-2x"></i>
	    	<strong style="margin-left: 5px; font-size: 1.2em;">Pictogram</strong>
	    </router-link>

	    <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
	      <span aria-hidden="true"></span>
	      <span aria-hidden="true"></span>
	      <span aria-hidden="true"></span>
	    </a>
	  </div>

	  <div id="navbarBasicExample" class="navbar-menu">
	    <div class="navbar-start">

	      <router-link to="/content" class="navbar-item navbar-text">
	        All Content
	      </router-link>

				<form class="field navbar-item inputfield" v-on:submit.prevent="search">
					<div class="control has-icons-left">
						<input class="input" placeholder="Search" v-model="keywords">
						<a href="#" v-on:click="search" class="icon is-small is-left search"><i class="fas fa-search"></i></a>
					</div>
				</form>
	    </div>


			<div class="navbar-item">
				<div style="color: red;" v-if="loginError != ''">{{ loginError }}</div>
			</div>
			<div class="navbar-end" v-if="!loggedIn">
				<div class="field navbar-item inputfield">
					<p class="control has-icons-left">
						<input class="input" type="email" placeholder="Email" v-model="email">
						<span class="icon is-small is-left">
							<i class="fas fa-envelope"></i>
						</span>
					</p>
				</div>
				<div class="field navbar-item inputfield" v-if="!loggedIn">
					<p class="control has-icons-left">
						<input class="input" type="password" placeholder="Password" v-model="password">
						<span class="icon is-small is-left">
							<i class="fas fa-lock"></i>
						</span>
					</p>
				</div>
			</div>

			<div class="navbar-item" v-if="!loggedIn">
				<div class="buttons">
					<a class="button is-primary" v-on:click="login" v-bind:class="{ 'is-loading' : isLoading }">
						Log in
					</a>
				</div>
			</div>
			<div class="navbar-item has-dropdown is-hoverable" v-else>
				<a class="navbar-link">
					<i class="fa fa-user" aria-hidden="true"></i> &nbsp&nbsp{{ user.displayName }}
				</a>

        <div class="navbar-dropdown is-right">
          <router-link to="/user" class="navbar-item">
            Manage Uploads
          </router-link>
          <a class="navbar-item" v-on:click="logout">
            Logout
          </a>
        </div>
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
    }
  },
  methods: {
    login: function() {
      if (this.email.length == 0 || this.password.length == 0) {
        return;
      } else {
        this.$store
          .dispatch("login", {
            email: this.email,
            password: this.password
          })
          .then(user => {
            this.email = "";
            this.password = "";
            this.confirmPassword = "";
          });
      }
    },
    search: function() {
      this.$router.push({
        path: "search",
        query: { keywords: this.keywords }
      });
      this.keywords = "";
    },
    logout: function() {
      this.$store.dispatch("logout").then(res => {
        this.$router.push({ path: "/" });
      });
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
</style>
