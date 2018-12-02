<template>
  <aside class="menu">
    <p class="menu-label">
      Filters
    </p>
    <ul class="menu-list" v-for="(filter, index) in filters" :key="index">
      <li><a :id="'item-' + index" v-on:click="itemClick(index)">{{ filter }}</a></li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: "SideFilter",
  data() {
    return {
      filters: [
        "Family",
        "Bridals",
        "Engagements",
        "Wedding",
        "Portrait",
        "Landscape",
        "Couples",
        "Adventure",
        "Wildlife"
      ],
      currFilters: []
    };
  },
  methods: {
    itemClick: function(index) {
      if ($("#item-" + index).hasClass("is-active")) {
        $("#item-" + index).removeClass("is-active");
        var indexOf = this.currFilters.indexOf(this.filters[index]);
        this.currFilters.splice(indexOf, 1);
      } else {
        $("#item-" + index).addClass("is-active");
        this.currFilters.push(this.filters[index]);
      }

      this.$store.dispatch("doFilter", this.currFilters);
    }
  }
};
</script>

<style scoped>
aside {
  float: left;
  padding-top: 20px;
  padding-left: 10px;
}
</style>
