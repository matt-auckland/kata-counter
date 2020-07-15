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
        @change="updateDate"
        v-model="endDate"
        type="date"
      ></label>
    <!-- <label
      class="flex-label"
      for="pretendnokata"
    >Debugger: Hide Kata
      <input
        name="pretendnokata"
        type="checkbox"
        v-model="settingsClone.pretendNoKata"
        @input="updateSetting('pretendNoKata', !settingsClone.pretendNoKata)"
      ></label> -->
    <button @click.prevent="emitUpdateModal('add-kata', 'Add a new Kata')">Add a new Kata</button>
    <button @click.prevent="emitUpdateModal('edit-tags', 'Edit Tags')">Add or delete tags</button>
    <button @click.prevent="emitUpdateModal('load-template-data', 'Load Kata from a Template')">Load Kata from a template</button>
    <button @click.prevent="emitUpdateModal('import-json', 'Import back up JSON data')">Import back up data from JSON</button>
    <button @click.prevent="emitUpdateModal('export-json', 'Back up data as JSON')">Back up data as JSON</button>
  </form>
</template>

<script>
import moment from "moment";

export default {
  props: ["settings"],
  data() {
    return {
      settingsClone: null,
      endDate: null
    };
  },
  watch: {
    settings: {
      deep: true,
      handler() {
        console.log("triggered");

        this.loadSettings();
      }
    }
  },
  created() {
    this.loadSettings();
  },
  methods: {
    updateDate($event) {
      this.updateSetting("defaultEndDate", moment($event.target.valueAsDate));
    },
    updateSetting(key, data) {
      this.$emit("updateSetting", key, data);
    },
    loadSettings() {
      this.settingsClone = JSON.parse(JSON.stringify(this.settings));

      this.endDate = moment(this.settingsClone.defaultEndDate).format(
        "YYYY-MM-DD"
      );
    },
    emitUpdateModal(key, title) {
      this.$emit("updateModal", key, title);
    }
  }
};
</script>

<style >
</style>