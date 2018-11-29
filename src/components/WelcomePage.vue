<template>
	<div class="overlay">
		<transition name="slide-fade">
			<header class="main-header" v-if="show">
				<h1>Pictogram</h1>
				<h3>A place to share and view photography destinations.</h3>

				<transition name="slide-fade">
					<div v-if="!loggedIn">
						<div class="columns" style="padding-bottom: 20px;"></div>
						<div class="columns" style="padding-bottom: 20px;"></div>
						<div class="columns" style="padding-bottom: 20px;"></div>
						<div class="columns" style="padding-bottom: 20px;"></div>
						<div class="columns"></div>
						<div class="columns" style="padding-bottom: 20px;">
							<div class="column"></div>
							<div class="column"></div>
							<div class="column">
								<a class="button is-primary is-fullwidth" style="border-radius: 290486px;" v-on:click="displayModal('Sign up')">
		          		<strong>Sign up</strong>
		        		</a>
							</div>
							<div class="column"></div>
						</div>
						<div class="columns" style="padding-bottom: 20px;">
							<div class="column"></div>
							<div class="column"></div>
							<div class="column">
								<a class="button is-fullwidth" style="border-radius: 290486px;" v-on:click="displayModal('Login')">
		          		Login
		        		</a>
							</div>
							<div class="column"></div>
						</div>
					</div>
				</transition>

			</header>
		</transition>

		<div class="modal" v-bind:class="{ 'is-active': showModal }" v-if="!loggedIn">
		  <div class="modal-background"></div>
		  <div class="modal-card">
		    <header class="modal-card-head">
		      <p class="modal-card-title">{{ modalTitle }}</p>
		      <button class="delete" aria-label="close" v-on:click="closeModal"></button>
		    </header>
		    <section class="modal-card-body">
		    	<div class="field" style="padding-bottom: 20px;" v-if="signupMode">
					  <div class="control has-icons-left has-icons-right">
					    <input class="input" type="text" placeholder="Username" v-model="username">
					    <span class="icon is-small is-left">
					      <i class="fas fa-user"></i>
					    </span>
					  </div>
					</div>
		      <div class="field" style="padding-bottom: 20px;">
					  <p class="control has-icons-left">
					    <input class="input" type="email" placeholder="Email" v-model="email">
					    <span class="icon is-small is-left">
					      <i class="fas fa-envelope"></i>
					    </span>
					  </p>
					</div>
					<div class="field">
					  <p class="control has-icons-left">
					    <input class="input" type="password" placeholder="Password" v-model="password">
					    <span class="icon is-small is-left">
					      <i class="fas fa-lock"></i>
					    </span>
					  </p>
					</div>
					<div v-if="(signupMode && registerError != '') || (!signupMode && loginError != '')">
						<p style="color: red;" v-if="registerError != ''">{{ registerError }}</p>
						<p style="color: red;" v-else-if="loginError != ''">{{ loginError}}</p>
					</div>
		    </section>
		    <footer class="modal-card-foot">
		      <button class="button is-primary" v-bind:class="{ 'is-loading' : isLoading }" v-on:click="submitModal"><strong>{{ modalTitle }}</strong></button>
		      <button class="button" v-on:click="closeModal">Cancel</button>
		    </footer>
		  </div>
		</div>

	</div>
</template>

<script>
export default {
  name: "WelcomePage",
  data() {
    return {
      show: false,
      username: "",
      email: "",
      password: "",
      modalTitle: "",
      signupMode: false
    };
  },
  methods: {
    signup: function() {
      this.$store
        .dispatch("signup", {
          username: this.username,
          email: this.email,
          password: this.password
        })
        .then(user => {
          if (user !== undefined) {
            this.username = "";
            this.email = "";
            this.password = "";
          }
        });
    },
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
          }
        });
    },
    displayModal: function(type) {
      this.signupMode = type === "Sign up";
      this.modalTitle = type;
      this.$store.dispatch("modal", { show: true });
    },
    closeModal: function() {
      this.signupMode = false;
      this.modalTitle = "";
      this.$store.dispatch("modal", { show: false });
    },
    submitModal: function() {
      if (this.signupMode) {
        this.signup();
      } else {
        this.login();
      }
    }
  },
  computed: {
    loggedIn: function() {
      return this.$store.getters.loggedIn;
    },
    isLoading: function() {
      return this.$store.getters.isLoading;
    },
    showModal: function() {
      return this.$store.getters.showModal;
    },
    registerError: function() {
      return this.$store.getters.registerError;
    },
    loginError: function() {
      return this.$store.getters.loginError;
    }
  },
  mounted: function() {
    this.show = true;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-header {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("../../static/park2.jpg");
  size: 100% 100%;
  height: 860px;
}

.signup-form {
  background: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9));
}

a {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.3);
}

h1 {
  font-size: 5em;
  margin: 0;
  padding-left: 5%;
  padding-top: 5%;
  color: white;
}

h3 {
  font-size: 2em;
  padding-left: 10%;
  color: white;
}

.columns {
  padding-left: 5%;
}
</style>
