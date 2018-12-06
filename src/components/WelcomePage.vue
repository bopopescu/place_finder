<template>
	<div class="overlay">
		<transition name="slide-fade">
			<header class="main-header" v-if="show">
				<h1>Pictogram</h1>
				<h3>A place to share and view photography destinations.</h3>

        <div class="ia-container" style="float: left; position: absolute; margin-left: 5%;">
				
					<figure>
						<img src="../../static/adventure.jpg" alt="image01" />
						<input id="image0" type="radio" name="radio-set" checked="checked"/>
						
						<figure>
							<img src="../../static/autumn.jpg" alt="image02" />
							<input id="image1" type="radio" name="radio-set" />
							
							<figure>
								<img src="../../static/architectural.jpg" alt="image03" />
								<input id="image2" type="radio" name="radio-set" />
								
								<figure>
									<img src="../../static/autumn-leaves.jpg" alt="image04" />
									<input id="image3" type="radio" name="radio-set" />
									
									<figure>
										<img src="../../static/arch.jpg" alt="image05" />
										<input id="image4" type="radio" name="radio-set" />
										
										<figure>
											<img src="../../static/branches.jpg" alt="image06" />
											<input id="image5" type="radio" name="radio-set" />
								
											<figure>
												<img src="../../static/clouds.jpg" alt="image07" />
												<input id="image6" type="radio" name="radio-set" />									

												<figure>
													<img src="../../static/countryside.jpg" alt="image08" />
													<input id="ia-selector-last" type="radio" name="radio-set" />

												</figure>
												
											</figure>
								
										</figure>	
											
									</figure>	
										
								</figure>
									
							</figure>
							
						</figure>
						
					</figure>
					
				</div><!-- ia-container -->

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
								<a class="button is-primary is-fullwidth"  v-on:click="displayModal('Sign up')">
		          		<strong>Sign up</strong>
		        		</a>
							</div>
							<div class="column"></div>
						</div>
						<div class="columns" style="padding-bottom: 20px;">
							<div class="column"></div>
							<div class="column"></div>
							<div class="column">
								<a class="button is-fullwidth"  v-on:click="displayModal('Login')">
		          		Login
		        		</a>
							</div>
							<div class="column"></div>
						</div>

            <div class="columns" style="padding-bottom: 20px;">
							<div class="column"></div>
							<div class="column"></div>
							<div class="column">
								<router-link to="/content">
                  <a class="button is-fullwidth" style="background-color: lightgray;" v-on:click="continueAsGuest">
		          		  Continue as guest
		        		  </a>
                </router-link>
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
      signupMode: false,
      imageId: 0,
      interval: null
    };
  },
  created: function() {
    let vm = this;
    let id = 0;
    this.imageId = 0;

    this.clear();
    this.interval = setInterval(function() {
      if (id === 7) {
        $("#ia-selector-last").prop("checked", true);
      } else {
        $("#image" + id).prop("checked", true);
      }
      id = (id + 1) % 8;
    }, 2000);
  },
  methods: {
    clear: function() {
      clearInterval(this.interval);
    },
    signup: function() {
      this.clear();
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
      this.clear();
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
    continueAsGuest: function() {
      this.clear();
      this.$store.dispatch("login", {
        email: "guest@guest.com",
        password: "guestuser100"
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
  padding-top: 4%;
  color: black;
}

h3 {
  font-size: 2em;
  padding-left: 9%;
  color: black;
}

.columns {
  padding-left: 5%;
}

.ia-container {
  width: 685px;
  margin: 20px auto;
  overflow: hidden;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.08);
  border: 7px solid rgba(255, 255, 255, 0.6);
}

.ia-container figure {
  position: absolute;
  top: 0;
  left: 50px; /* width of visible piece */
  width: 335px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.6);
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

.ia-container > figure {
  position: relative;
  left: 0 !important;
}

.ia-container img {
  display: block;
  width: 100%;
  height: 300px !important;
  object-fit: cover !important;
}

.ia-container input {
  position: absolute;
  top: 0;
  left: 0;
  width: 50px; /* just cover visible part */
  height: 100%;
  cursor: pointer;
  border: 0;
  padding: 0;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
  filter: alpha(opacity=0);
  opacity: 0;
  z-index: 100;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.ia-container input:checked {
  width: 5px;
  left: auto;
  right: 0px;
}
.ia-container input:checked ~ figure {
  -webkit-transition: all 0.7s ease-in-out;
  -moz-transition: all 0.7s ease-in-out;
  -o-transition: all 0.7s ease-in-out;
  -ms-transition: all 0.7s ease-in-out;
  transition: all 0.7s ease-in-out;
  left: 335px;
}

.ia-container input:checked + figcaption,
.ia-container input:checked:hover + figcaption {
  background: rgba(87, 73, 81, 0);
}

.ia-container input:checked + figcaption span {
  -webkit-transition: all 0.4s ease-in-out 0.5s;
  -moz-transition: all 0.4s ease-in-out 0.5s;
  -o-transition: all 0.4s ease-in-out 0.5s;
  -ms-transition: all 0.4s ease-in-out 0.5s;
  transition: all 0.4s ease-in-out 0.5s;

  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=99)";
  filter: alpha(opacity=99);
  opacity: 1;

  top: 50%;
}

.ia-container #ia-selector-last:checked + figcaption span {
  -webkit-transition-delay: 0.3s;
  -moz-transition-delay: 0.3s;
  -o-transition-delay: 0.3s;
  -ms-transition-delay: 0.3s;
  transition-delay: 0.3s;
}

.ia-container input:hover + figcaption {
  background: rgba(87, 73, 81, 0.03);
}

.ia-container input:checked ~ figure input {
  z-index: 1;
}

@media screen and (max-width: 720px) {
  .ia-container {
    width: 540px;
  }

  .ia-container figure {
    left: 40px;
    width: 260px;
  }

  .ia-container input {
    width: 40px;
  }

  .ia-container input:checked ~ figure {
    left: 260px;
  }
}

@media screen and (max-width: 520px) {
  .ia-container {
    width: 320px;
  }

  .ia-container figure {
    left: 20px;
    width: 180px;
  }

  .ia-container input {
    width: 20px;
  }

  .ia-container input:checked ~ figure {
    left: 180px;
  }
}
</style>
