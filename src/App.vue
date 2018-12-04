<template>
  <div id="app">
    <app-header/>
    <side-filter id="side-filter" v-if="$route.fullPath.includes('/content') || $route.fullPath.includes('/search') || $route.fullPath.includes('/userfeed')"/>
    <router-view/>
    <footer/>
  </div>
</template>

<script>
import AppHeader from "./components/AppHeader";
import SideFilter from "./components/SideFilter";
import Footer from "./components/Footer";
export default {
  name: "App",
  components: { AppHeader, SideFilter, Footer },
  computed: {
    user: function() {
      return this.$store.getters.user;
    }
  },
  watch: {
    $route: function() {
      // if (this.$route.fullPath === "/" && this.user) {
      //   this.$router.push({
      //     path: "/content"
      //   });
      // }
      if (this.$route.fullPath === "/") {
        this.$store.dispatch("doFilter", []);
      }
      if (this.$route.fullPath.includes("/content/")) {
        $("#side-filter").addClass("hide");
      } else {
        $("#side-filter").removeClass("hide");
      }
    }
  }
};
</script>

<style>
@import "bulma-start-master/css/main.css";
@import "https://fonts.googleapis.com/icon?family=Material+Icons";
@import url("https://fonts.googleapis.com/css?family=Catamaran");

html,
body {
  font-family: "Catamaran", sans-serif;
}

body {
  background-color: #fff;
  /*#F5EFED*/
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.7s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
	/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
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

.hide {
  display: none;
}
</style>
