<template>
  <form action="() => {}">
    <label
      class="flex-label"
      for="defaultRepsGoal"
    >Default Goal Reps<input
        @input="updateSetting('defaultRepsGoal', settingsClone.defaultRepsGoal)"
        v-model="settingsClone.defaultRepsGoal"
        type="number"
      ></label>
    <label
      class="flex-label"
      for="defaultenddate"
    >Default Goal End Date<input
        @input="updateSetting('endDate', settingsClone.endDate)"
        v-model="settingsClone.endDate"
        type="date"
      ></label>
    <label
      class="flex-label"
      for="pretendnokata"
    >Debugger: Hide Kata
      <input
        name="pretendnokata"
        type="checkbox"
        v-model="settingsClone.pretendNoKata"
        @input="updateSetting('pretendNoKata', !settingsClone.pretendNoKata)"
      ></label>
    <button @click.prevent="loadSampleData">Load sample data</button>
    <button @click.prevent="exportData">Export data as JSON</button>
    <button @click.prevent="loadData">Import data from JSON</button>
  </form>
</template>

<script>
import moment from "moment";

export default {
  props: ["settings"],
  data() {
    return {
      settingsClone: null
    };
  },
  watch: {
    settings: {
      deep: true,
      handler() {
        console.log("load", this.settings.pretendNoKata);
        this.loadSettings();
      }
    }
  },
  created() {
    this.loadSettings();
  },
  methods: {
    updateSetting(key, data) {
      console.log("emit", key, data);
      this.$emit("updateSetting", key, data);
    },
    loadSettings() {
      this.settingsClone = JSON.parse(JSON.stringify(this.settings));
      this.settingsClone.endDate = moment(this.settingsClone.endDate).format(
        "YYYY-MM-DD"
      );
    }
  }
};
</script>

<style >
</style>