<template>
  <!-- <transition name="fade"> -->
      <transition name="fade-transform" mode="out-in">
    <router-view></router-view>
  </transition>
</template>

<script>
  export default {
  }
</script>
