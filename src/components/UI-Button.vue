<template>
  <button v-on:click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: ["clickFunc", "text"],
};
</script>

<style scoped>
button {
  font-size: 14px;
  line-height: 1.3;
  text-align: center;

  user-select: none;

  background: #2c2c46b4;
  border-radius: 10px;
  padding: 10px 15px;

  color: #fff;

  border: none;
  margin: 10px 0;
}

button:hover {
  border-color: black;
  cursor: pointer;
}

button:disabled:hover {
  border-color: #ccc;
  cursor: initial;
}
</style>