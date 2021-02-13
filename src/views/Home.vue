<script>
// import draggable from "vuedraggable";
import KataCounter from "../components/KataCounter";
export default {
  components: {
    KataCounter,
    // draggable
  },
};
</script>

<template>
  <div id="home">
    <div class="kata-list">
      <!-- <draggable
        v-model="$root.kataList"
        group="kata"
        @start="drag=true"
        @end="drag=false"
      > -->
      <KataCounter
        v-for="kata in $root.kataList"
        :key="kata.name"
        :kata="kata"
      />
      <!-- </draggable> -->
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