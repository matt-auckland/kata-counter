<template functional>
  <span
    class="ui-chip"
    :class="{'checked': props.checked}"
    v-on="listeners"
  >
    <slot></slot>
  </span>
</template>

<script>
export default {
  props: ["checked"]
};
</script>

<style scoped>
.ui-chip {
  border: 1px solid #999;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
}
.ui-chip:hover {
  /* transform: translate3d(-3px, -3px, 0px); */
  /* box-shadow: #666 1px 2px 3px; */
  border-color: #333;
}

.ui-chip.checked {
  font-weight: bold;
}
</style>