<template>
  <div class="ui-bubble">
    <slot></slot>
    <slot name="right"></slot>
  </div>
</template>
<script>
export default {
  props: {
    label: String,
    type: String,
    value: [String, Number, Boolean],
  },
  methods: {},
};
</script>
<style scoped>
.ui-bubble {
  font-size: 14px;
  line-height: 1.3;
  text-align: left;

  user-select: none;

  background: #2c2c46b4;
  border-radius: 10px;
  padding: 10px 15px;

  color: #fff;

  border: none;
  margin: 10px 0;

  display: flex;
  justify-content: space-between;
}
</style>