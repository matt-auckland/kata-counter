<template>
  <header v-if="$route.meta.showHeader">
    <a
      href="javascript:;"
      @click="goBack"
    >Back</a>
    <span class="page-title">
      {{pageTitle}}
    </span>
  </header>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.back();
    },
  },
};
</script>