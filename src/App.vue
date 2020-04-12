<template>
  <div id="app">
    <header class="header">
      <div
        @click="toggleSettings"
        id="options-icon"
      >
        {{ tab == "COUNTERS" ? "⚙️" : "↩️" }}
      </div>
      <select
        v-if="tab == 'COUNTERS'"
        id="filter-dropdown"
        v-model="filterTag"
      >
        <option
          default
          :value="false"
        >Show All Kata</option>
        <option
          v-for="tag in tagPool"
          :key="tag"
          :value="tag"
        >{{
          tag | capitalize
        }}</option>
      </select>
      <h1 v-if="tab != 'COUNTERS'">
        {{ tab == "SETTINGS" ? "Settings" : `Editing ${selectedKata.name}` }}
      </h1>
      <div id="total-reps">
        <span v-if="tab == 'COUNTERS'"> Total Reps: {{ totalKataReps }} </span>
      </div>
    </header>

    <!-- Settings Page -->
    <template v-if="tab == 'SETTINGS'">
      <SettingsPage
        :settings="settings"
        @updateSetting="updateSetting"
        @updateModal="updateModalState"
      />
    </template>

    <!-- Counters Page -->
    <template v-else-if="tab == 'COUNTERS'">
      <template v-if="settings.pretendNoKata || !kataList || kataList.length < 1">
        <h2>
          Looks like you haven't added any kata! Click below to get started!
        </h2>
        <div class="setup-buttons">
          <button @click="openTemplateKataImport">
            Load kata from a template
          </button>
          <button @click="updateModalState('add-kata', 'Add a new Kata')">
            Add a kata
          </button>
          <button @click="updateModalState('import-json', 'Import Kata JSON Data')">
            Import kata from JSON
          </button>
          <button @click="importTestKata()">Load Test Data</button>
        </div>
      </template>

      <template v-else>
        <CounterButton
          v-show="!filterTag || k.tags.includes(filterTag)"
          v-for="k in kataList"
          :key="k.name"
          @increment="increment"
          @decrement="decrement"
          @edit="beginEditKata"
          :name="k.name"
          :goalReps="k.defaultGoalReps ? settings.defaultRepsGoal : k.goalReps"
          :reps="k.reps"
          :daysRemaining="
            k.defaultGoalDate
              ? daysRemaining
              : k.goalDate.diff(moment(), 'days')
          "
          :colour="k.colour ? k.colour : ''"
          :tabs="k.tabs"
        ></CounterButton>
      </template>
    </template>

    <!-- MODAL  -->
    <transition
      name="modal-wrapper"
      v-on:after-enter="triggerSlideUpModal"
    >
      <div
        class="slide-up-modal"
        v-if="modal.state != 'HIDE'"
        @click="hideModal($event, true)"
      >
        <transition
          :name="'modal-transition'"
          @after-leave="modalBodyAfterLeave"
        >
          <div
            v-if="modal.showSlideUp"
            class="slide-up-modal-body"
          >
            <h2>{{ modal.title }}</h2>
            <button
              class="close-button"
              @click="hideModal"
            >+</button>

            <template v-if="modal.state == 'ADD-KATA'">
              <KataEditor
                @saveKata="saveKata($event, true)"
                @cancelEdit="cancelEdit"
              />
            </template>

            <template v-if="modal.state == 'EDIT-KATA'">
              <KataEditor
                @saveKata="saveKata"
                @cancelEdit="cancelEdit"
                @deleteKata="deleteKata($event)"
                :targetKata="selectedKata"
              />
            </template>

            <template v-else-if="modal.state == 'IMPORT-JSON'">
              <div class="flex-col-center">
                <p>Paste in your JSON below</p>
                <textarea
                  v-model="kataJSON"
                  cols="30"
                  rows="10"
                />
                <button @click="importFromJSON">Import Kata</button>
              </div>
            </template>

            <template v-else-if="modal.state == 'EXPORT-JSON'">
              <div class="flex-col-center">
                <p>
                  Copy this JSON text and save it somewhere to back up your data
                </p>
                <textarea
                  v-model="kataJSONExport"
                  cols="30"
                  rows="10"
                  readonly
                />
                <button @click.prevent="hideModal">Close</button>
              </div>
            </template>

            <template v-else-if="modal.state == 'LOAD-TEMPLATE-DATA'">
              <template v-if="importTemplateKataStage == 1">
                <p>
                  Check the box by each kata's name to select it, then press
                  continue to confirm your selection.
                </p>

                <form>
                  <div class="template-kata-container">
                    <div
                      v-for="template in filteredTemplateKata"
                      :key="template.name"
                    >
                      {{ template.name }}
                      <hr />
                      <label
                        class="flex-label"
                        v-for="kata in template.kata"
                        :key="kata.name"
                        :for="kata.name"
                      >
                        {{ kata.name
                        }}<input
                          type="checkbox"
                          :value="kata"
                          v-model="selectedTemplateKata"
                          :name="kata.name"
                          id=""
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <button @click.prevent="hideModal">Cancel</button>
                    <button
                      @click.prevent="importTemplateKataStage++"
                      :disabled="selectedTemplateKata.length < 1"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </template>
              <div v-else-if="importTemplateKataStage == 2">
                <p>
                  These are the Kata you selected, press Back if you want to
                  edit your selection, otherwise click Add Kata.
                </p>
                <ul class="template-kata-container">
                  <li v-for="kata in selectedTemplateKata" :key="kata.id">
                    {{ kata.name }}
                  </li>
                </ul>

                <div>
                  <button @click.prevent="importTemplateKataStage--">
                    Back
                  </button>
                  <button
                    @click.prevent="importTemplateKata"
                    :disabled="selectedTemplateKata.length < 1"
                  >
                    Add Kata
                  </button>
                </div>
              </div>
            </template>

            <template v-else-if="modal.state == 'TEST'">
              <p>test</p>
            </template>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import moment from "moment";

import templateKata from "./assets/templateKata.js";

import CounterButton from "./components/CounterButton.vue";
import KataEditor from "./components/KataEditor.vue";
import SettingsPage from "./components/SettingsPage.vue";
// // import UIChip from "./components/UIChip.vue";

export default {
  name: "App",
  components: {
    CounterButton,
    SettingsPage,
    KataEditor
    // UIChip
  },
  filters: {
    capitalize(str) {
      if (!str) return "";
      return str[0].toUpperCase() + str.slice(1);
    }
  },
  methods: {
    // kata counter
    increment(kataName) {
      const kata = this.kataList.filter(k => k.name === kataName)[0];
      kata.reps++;
      this.updateStorage(this.kataList);
    },
    decrement(kataName) {
      const kata = this.kataList.filter(k => k.name === kataName)[0];
      if (kata.reps == 0) return;
      kata.reps--;
      this.updateStorage(this.kataList);
    },

    importFromJSON() {
      const parsedKata = JSON.parse(this.kataJSON);
      this.updateStorage(parsedKata);
    },

    // updateSelectedTemplateKata(kataListName) {
    //   const index = this.selectedTemplateKata.indexOf(kataListName);
    //   if (index == -1) {
    //     this.selectedTemplateKata.push(kataListName);
    //   } else {
    //     this.selectedTemplateKata.splice(index, 1);
    //   }
    //   console.log(this.selectedTemplateKata);
    // },

    importTemplateKata() {
      if (this.selectedTemplateKata.length) {
        this.selectedTemplateKata.forEach(kata => {
          this.saveKata(kata, true);
        });
      }
    },

    beginEditKata(kataName) {
      const kata = this.kataList.filter(k => k.name === kataName)[0];
      if (!kata) return;
      this.selectedKata = kata;
      this.updateModalState("edit-kata", `Editing ${kata.name}`);
    },

    importTestKata() {
      this.updateStorage(templateKata.testData.kata);
    },

    // editing kata
    saveKata(draftKata, isNewKata) {
      if (typeof draftKata.tags == "string") {
        draftKata.tags = draftKata.tags.split(",").filter(tag => tag);
      }

      if (isNewKata) {
        this.kataList.push(draftKata);
      } else {
        for (let i = 0; i < this.kataList.length; i++) {
          if (this.kataList[i].id == draftKata.id) this.kataList[i] = draftKata;
        }
      }

      this.updateStorage(this.kataList);
      this.hideModal();
      this.selectedKata = null;
    },
    deleteKata(kata) {
      if (kata && !Number.isNaN(kata.id)) {
        for (let i = 0; i < this.kataList.length; i++) {
          if (this.kataList[i].id == kata.id) {
            this.kataList.splice(i, 1);
          }
        }
      }

      this.updateStorage(this.kataList);
      this.hideModal();
      this.selectedKata = null;
    },

    cancelEdit() {
      this.hideModal();
      this.selectedKata = null;
    },

    goBack() {
      this.selectedKata = null;
    },
    toggleSettings() {
      if (this.tab != "COUNTERS") {
        this.tab = "COUNTERS";
      } else {
        this.tab = "SETTINGS";
      }
    },
    updateStorage(kataData) {
      this.storage.setItem("kata", JSON.stringify(kataData));
      this.kataList = JSON.parse(this.storage.getItem("kata"));
      this.tagPool = new Set(this.kataList.flatMap(k => k.tags));
    },

    // modal related
    updateModalState(state, title = "") {
      if (!state) return;

      this.modal.state = state.toUpperCase();
      this.modal.title = title;
    },
    hideModal($event, checkTarget) {
      if (
        checkTarget &&
        !Array.from($event.target.classList).includes("slide-up-modal")
      ) {
        return;
      }

      if (this.modal.state == "LOAD-TEMPLATE-DATA")
        this.selectedTemplateKata = [];

      this.modal.showSlideUp = false;
    },
    triggerSlideUpModal() {
      this.modal.showSlideUp = true;
    },
    modalBodyAfterLeave() {
      this.updateModalState("hide");
    },

    openTemplateKataImport() {
      this.importTemplateKataStage = 1;
      this.updateModalState("load-template-data", "Load Kata from a Template");
    },

    // Settings Page
    updateSetting(key, data) {
      if (key == "endDate") data = moment(data);

      console.log(
        `update setting: ${key} with ${data}. Currently: ${this.settings[key]}`
      );
      this.settings[key] = data;
    },
    loadData() {
      console.log("loadData");
    },
    loadSampleData() {
      console.log("loadSampleData");
    }
  },
  computed: {
    filteredTemplateKata() {
      const clone = JSON.parse(JSON.stringify(templateKata));

      delete clone.testData;

      return clone;
    },
    totalKataReps() {
      if (!this.kataList || this.kataList.length < 1) return 0;
      return this.kataList.reduce((sum, k) => Number.parseInt(k.reps) + sum, 0);
    },
    kataJSONExport() {
      return JSON.stringify(this.kataList);
    }
  },
  created() {
    this.storage = window.localStorage;
    const kata = this.storage.getItem("kata");

    if (kata) {
      this.kataList = JSON.parse(kata);
      this.tagPool = new Set(this.kataList.flatMap(k => k.tags));
    }

    this.daysRemaining = this.settings.endDate.diff(moment(), "days");
  },

  data() {
    return {
      storage: null, // localStorage reference

      daysRemaining: 0, // days till default goal
      tagPool: null,
      filterTag: false,
      kataList: [],

      settings: {
        pretendNoKata: false,
        endDate: moment("2021-01-01", "YYYY-MM-DD"),
        defaultRepsGoal: 100
      },

      modal: {
        state: "HIDE",
        title: "",
        showSlideUp: false
      },

      importTemplateKataStage: 1,
      selectedTemplateKata: [],
      selectedKata: null,
      kataJSON: null,

      //  Tab names: SETTINGS, COUNTERS
      tab: "COUNTERS"
    };
  }
};
</script>

<style>
:root {
  --modal-zindex: 10;

  /* COLOURS */
  --background-color: #282828;
  --base-font-colour: #fff;
  --base-red: #ff4848;
  --blue: #3e81ea;
  --dark-blue: #215bb7;
  --yellow: #fffb00;
  --dark-yellow: #d8d50b;
  --green: #34bd29;
  --dark-green: #1e8616;
  --brown: #522c1d;
  --dark-brown: #8c6315;
  --black: #000;

  --new-purple: #37114f;
  --new-red: #e8112d;
  --new-orange: #f28411;
  --new-brown: #9e6b05;
  --new-yellow: #f9e526;
  --new-blue: #0051ba;
  --new-green: #009e49;
  --new-black: #111111;
  --new-white: #fff;
  --new-grey: #686663;

  --material-red: #d50000;
  --material-blue: #1565c0;
  --material-purple: #6a1b9a;
  --material-yellow: #ffeb3b;
  --material-orange: #f57f17;
  --material-brown: #3e2723;
  --material-green: #1b5e20;

  --red: var(--material-red);
  --blue: var(--material-blue);
  --purple: var(--material-purple);
  --yellow: var(--material-yellow);
  --orange: var(--material-orange);
  /* --brown: var(--material-brown); */
  --green: var(--material-green);
}

body {
  color: var(--base-font-colour);
  background: var(--background-color);
  margin-top: 0;
  margin-bottom: 0;
}

#app {
  min-height: 100vh;
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--base-font-colour);
  padding: 10px;
}

#options-icon {
  cursor: pointer;
  font-size: 32px;
  flex: 1 33%;
  text-align: left;
}

#filter-dropdown {
  font-size: 18px;
  flex: 2 33%;
  text-align: center;
}

#total-reps {
  flex: 1 33%;
  text-align: right;
}
.header h1 {
  margin: 0;
}
button {
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid #ccc;
  border-radius: 9px;
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

textarea {
  width: 100%;
  border-radius: 6px;
  border: 1px solid #ccc;
  padding: 8px;
  font-size: 14px;
  line-height: 16px;
}

form {
  display: flex;
  flex-direction: column;
  max-width: 320px;
  margin: auto;
}

form > * {
  margin: 8px 0;
}

.flex-label {
  display: flex;
  justify-content: space-between;
}

.flex-col-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.template-kata-container {
  overflow-y: scroll;
  max-height: 320px;
  padding-right: 16px;
  display: block;
  text-align: left;
}

/* Modal */
.slide-up-modal {
  height: 100vh;
  width: 100vw;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: var(--modal-zindex);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  overflow: hidden;
}

.modal-wrapper-enter,
.modal-wrapper-leave-to {
  opacity: 0;
}

.slide-up-modal-body {
  position: relative;
  background: white;
  color: #333;
  border-radius: 50px 50px 0 0;
  min-height: 50%;
  max-width: 460px;
  width: 100%;
  padding: 10px 20px;
}

.slide-up-modal-body .close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 30px;
  border: none;
  background: none;
  cursor: pointer;
  transform: rotate(45deg);
}

.modal-transition-enter-active {
  transform: translateY(0);
}

.modal-transition-leave-active,
.modal-transition-enter-active {
  transition: 600ms;
}

.modal-transition-leave-active {
  transform: translateY(100%);
}

.modal-transition-enter,
.modal-transition-leave-to {
  transform: translateY(100%);
}
</style>
