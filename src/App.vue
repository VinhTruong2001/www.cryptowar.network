<script setup>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <!--  <img loading="lazy" alt="Vue logo" src="./assets/logo.png" />-->
  <!--  <HelloWorld msg="Hello Vue 3 + Vite" />-->

  <!-- preloader area start -->
  <div class="preloader hide" id="preloader">
    <div class="loader loader-1">
      <div class="loader-outter"></div>
      <div class="loader-inner"></div>
    </div>
  </div>
  <!-- preloader area end -->

  <!-- Header Area Start  -->
  <Header></Header>
  <!-- Header Area End  -->

  <router-view />

  <!-- Footer Area Start -->
  <Footer></Footer>
  <!-- Footer Area End -->
</template>


<style>
@import "./assets/css/bootstrap.min.css";
@import "./assets/css/style.css";
@import "./assets/css/responsive.css";
</style>
<script>
import emitter from 'tiny-emitter/instance';

export default {
  name: "App",
  mounted() {
    // document.body.classList.add("is-loaded");

    emitter.once("updateWalletClient", async (callbackHandler) => {
      await callbackHandler();
    });
  }
};
</script>
