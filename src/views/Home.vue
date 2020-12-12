<script>
import KataCounter from "../components/KataCounter";
export default {
  components: { KataCounter },
  watch: {
    "$root.kataList": {
      deep: true,
      handler() {
        this.$root.kataList.sort((a, b) => a.listPosition - b.listPosition);
      },
    },
  },
  methods: {
    changeKataPosition() {},
  },
};
</script>

<template>
  <div id="home">
    <div class="kata-list">
      <KataCounter
        v-for="kata in $root.kataList"
        :key="kata.name"
        :kata="kata"
      />
    </div>
  </div>
</template>

<style scoped>
.kata-list {
  display: flex;
  gap: 15px;
  flex-direction: column;
}
</style>