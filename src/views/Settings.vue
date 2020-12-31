<template>
  <form action="() => {}">
    <!-- <label
      class="flex-label"
      for="defaultRepsGoal"
    >Default Goal Reps<input
        @input="updateSetting('defaultRepsGoal', settingsClone.defaultRepsGoal)"
        v-model="settingsClone.defaultRepsGoal"
        type="number"
      ></label> -->
    <UIInput
      v-model="endDate"
      label="Default Goal End Date"
      type="date"
    ></UIInput>
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

    <UIButton @click.prevent="emitUpdateModal('add-kata', 'Add a new Kata')">Add a new Kata</UIButton>
    <UIButton @click.prevent="emitUpdateModal('edit-tags', 'Edit Tags')">Add or delete tags</UIButton>
    <UIButton @click.prevent="emitUpdateModal('load-template-data', 'Load Kata from a Template')">Load Kata from a template</UIButton>
    <UIButton @click.prevent="emitUpdateModal('import-json', 'Import back up JSON data')">Import back up data from JSON</UIButton>
    <UIButton @click.prevent="emitUpdateModal('export-json', 'Back up data as JSON')">Back up data as JSON</UIButton>
  </form>
</template>

<script>
import moment from "moment";
import UIButton from "../components/UI-Button";
import UIInput from "../components/UI-Input.vue";

export default {
  components: { UIButton, UIInput },
  data() {
    return {
      settingsClone: null,
      endDate: null,
    };
  },
  watch: {
    settings: {
      deep: true,
      handler() {
        console.log("triggered");

        this.loadSettings();
      },
    },
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
    },
  },
};
</script>