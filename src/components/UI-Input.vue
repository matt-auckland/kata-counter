<template>
  <div class="ui-input">
    <label
      class="flex-label"
      :for="defaultenddate"
    >Default Goal End Date<input
        @change="updateDate"
        v-model="endDate"
        type="date"
      ></label>
  </div>
</template>

<style scoped>
.ui-input {
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

input {
  cursor: pointer;
  padding: 8px;
  text-align: center;
  vertical-align: center;
  color: #fff;
  background: rgba(165, 165, 165, 0.274);
  border-radius: 15px;
  border: none;
  font-size: 14px;
  font-family: sans-serif;
}
</style>