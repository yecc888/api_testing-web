<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
        <!-- <keep-alive> -->
                  <!-- <router-view :key="key"></router-view> -->
        <!-- </keep-alive> -->
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // key() {
    //   return this.$route.path
    // }
  }
}
</script>
