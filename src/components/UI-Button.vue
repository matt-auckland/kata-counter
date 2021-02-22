<template>
  <button
    v-on:click="$emit('click')"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: ["clickFunc", "text", "disabled"],
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

button:disabled {
  background: rgba(165, 165, 165, 0.274);
  color: #fff;
  cursor: initial;
  border-color: black;
}
</style>