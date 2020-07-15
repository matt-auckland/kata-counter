<template>
  <div
    id="app"
    :style="bodyStyle"
  >
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
          v-for="tag in settings.tagPool"
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
            Load Kata from a template
          </button>
          <button @click="updateModalState('add-kata', 'Add a new Kata')">
            Add a new Kata
          </button>
          <button @click="updateModalState('import-json', 'Import Backup JSON Data')">
            Import back up data from JSON
          </button>
          <button @click="importTestKata()">Load Test Data</button>
        </div>
      </template>

      <div
        class="counter-cont"
        v-else
      >
        <CounterButton
          v-for="k in filteredKataList"
          :key="k.name"
          @increment="increment"
          @decrement="decrement"
          @edit="beginEditKata"
          :kata="k"
          :goalReps="k.defaultGoalReps ? settings.defaultRepsGoal : k.goalReps"
          :daysRemaining="k.defaultGoalDate ? settings.defaultDaysRemaining : calculateDaysRemaining(k.goalDate)"
          counterStyle="card"
        />
      </div>
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
        :style="modal.style"
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
                @hideModal="hideModal"
                @cancelEdit="cancelEdit"
                :tagPool="settings.tagPool"
              />
            </template>

            <template v-if="modal.state == 'EDIT-KATA'">
              <KataEditor
                @saveKata="saveKata"
                @hideModal="hideModal"
                @cancelEdit="cancelEdit"
                @deleteKata="deleteKata($event)"
                @routeAndAddTag="routeAndAddTag"
                :targetKata="selectedKata"
                :tagPool="settings.tagPool"
              />
            </template>

            <template v-else-if="modal.state == 'IMPORT-JSON'">
              <div class="flex-col-center">
                <p>Paste your Back up Data JSON below</p>
                <p
                  class="error-text"
                  v-if="dataJSONError"
                >{{dataJSONError}}</p>
                <textarea v-model="dataJSON" />
                <button :disabled="dataJSON.length <= 0"  @click="importFromJSON">Import Data</button>
              </div>
            </template>

            <template v-else-if="modal.state == 'EXPORT-JSON'">
              <div class="flex-col-center">
                <p>
                  Copy this JSON text and save it somewhere to back up your data
                </p>
                <textarea
                  v-model="dataJSONExport"
                  id="dataJSON"
                  cols="30"
                  rows="10"
                  readonly
                />
                <button @click.prevent="copyJSON">Copy JSON</button>
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
                <div class="setup-buttons">
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

                <div class="setup-buttons">
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
            <template v-else-if="modal.state == 'EDIT-TAGS'">
              Create New Tag
              <form @submit.prevent="createNewTag">
                <label for="newTag">
                  New Tag Name
                <input type="text" name="newTag" id="newTag" placeholder="Type a new tag" v-model="draftTag">
                </label>
                <button>Add Tag</button>
              </form>
              <form @submit.prevent="() => {}">
                <div v-for="tag in settings.tagPool" :key="tag">
                  <span>{{tag | capitalize}}</span>
                  <button @click="deleteTag(tag)">Delete</button>
                </div>
              </form>
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

export default {
  name: "App",
  components: {
    CounterButton,
    SettingsPage,
    KataEditor
  },
  methods: {
    // kata counter
    updateKataHist(kata) {
      if (!kata.history) kata.history = [];
      kata.history.push({
        count: kata.reps,
        date: moment()
      });
    },
    increment(kataId) {
      const kata = this.kataList.filter(k => k.id === kataId)[0];
      kata.reps++;
      this.updateKataHist(kata);
      this.updateKataStorage(this.kataList);
    },
    decrement(kataId) {
      const kata = this.kataList.filter(k => k.id === kataId)[0];
      if (kata.reps == 0) return;
      kata.reps--;
      this.updateKataHist(kata);

      this.updateKataStorage(this.kataList);
    },

    importFromJSON() {
      this.dataJSONError = "";

      const ctrl = this;
      let parsedData;

      try {
        parsedData = JSON.parse(ctrl.dataJSON);
        this.updateKataStorage(parsedData.kata);
        this.settings = parsedData.settings;
        this.updateSettingsStorage();
        this.dataJSON = "";
        this.hideModal();
      } catch (e) {
        this.dataJSONError = "Invalid JSON data. Did you copy-paste correctly?";
      }
    },

    importTemplateKata() {
      if (this.selectedTemplateKata.length) {
        this.selectedTemplateKata.forEach(kata => {
          this.saveKata(kata, true);
        });
        this.importTemplateKataStage = 1;
      }
    },

    beginEditKata(kataId) {
      const kata = this.kataList.filter(k => k.id == kataId)[0];
      if (!kata) return;
      this.selectedKata = kata;
      this.updateModalState("edit-kata", `Editing ${kata.name}`);
    },

    importTestKata() {
      this.updateKataStorage(templateKata.testData.kata);
    },

    // editing kata
    saveKata(draftKata, isNewKata) {
      if (typeof draftKata.tags == "string") {
        draftKata.tags = draftKata.tags.split(",");
      }
      draftKata.tags = draftKata.tags.reduce((accum, tag) => {
        if (tag && !accum.includes(tag)) accum.push(tag);
        return accum;
      }, []);

      if (isNewKata) this.updateKataHist(draftKata);

      if (!draftKata.id) draftKata.id = Date.now();

      if (isNewKata) {
        this.kataList.push(draftKata);
      } else {
        for (let i = 0; i < this.kataList.length; i++) {
          if (this.kataList[i].id == draftKata.id) {
            if (this.kataList[i].reps !== draftKata.reps)
              this.updateKataHist(draftKata);

            this.kataList[i] = draftKata;
          }
        }
      }
      this.updateKataStorage(this.kataList);
    },
    deleteKata(kata) {
      if (kata && !Number.isNaN(kata.id)) {
        for (let i = 0; i < this.kataList.length; i++) {
          if (this.kataList[i].id == kata.id) {
            this.kataList.splice(i, 1);
          }
        }
      }

      this.updateKataStorage(this.kataList);
      this.hideModal();
      this.selectedKata = null;
    },

    cancelEdit() {
      this.hideModal();
      this.selectedKata = null;
    },

    // Settings
    toggleSettings() {
      if (this.tab != "COUNTERS") {
        this.tab = "COUNTERS";
      } else {
        this.tab = "SETTINGS";
      }
    },
    updateSetting(key, data) {
      if (key == "defaultEndDate") data = moment(data);

      this.settings[key] = data;
      this.updateDefaultDaysRemaining();
      this.updateSettingsStorage();
    },
    updateSettingsStorage() {
      this.storage.setItem("settings", JSON.stringify(this.settings));
      this.settings = JSON.parse(this.storage.getItem("settings"));
    },
    updateKataStorage(kataData) {
      this.storage.setItem("kata", JSON.stringify(kataData));
      this.kataList = JSON.parse(this.storage.getItem("kata"));
    },
    calculateDaysRemaining(date) {
      const daysRemaining = moment(date).diff(moment(), "days");

      if (daysRemaining < 1) return 1;
      return daysRemaining;
    },
    updateDefaultDaysRemaining() {
      this.settings.defaultDaysRemaining = this.calculateDaysRemaining(
        this.settings.defaultEndDate
      );
    },
    copyJSON() {
      var copyText = document.querySelector("#dataJSON");
      copyText.select();
      document.execCommand("copy");
    },
    routeAndAddTag() {
      this.tab = "SETTINGS";
      this.updateModalState("edit-tags", "Edit Tags");
    },
    deleteTag(tag) {
      if (this.settings.tagPool.includes(tag)) {
        this.settings.tagPool = this.settings.tagPool.filter(t => t != tag);
      }
      this.updateSettingsStorage();

      const ctrl = this;

      this.kataList.forEach(function(kata) {
        if (kata.tags.includes(tag)) {
          kata.tags = kata.tags.filter(t => t != tag);
          ctrl.saveKata(kata);
        }
      });
      if (this.filterTag == tag) this.filterTag = false;
    },
    createNewTag() {
      const newTag = this.draftTag.toLowerCase();

      if (!this.settings.tagPool.includes(newTag)) {
        this.settings.tagPool.push(newTag);
        this.settings.tagPool = this.settings.tagPool.reduce((accum, tag) => {
          if (tag && !accum.includes(tag)) accum.push(tag);
          return accum;
        }, []);
      }
      this.draftTag = null;
      this.updateSettingsStorage();
    },

    // modal related
    updateModalState(state, title = "") {
      if (!state) return;

      this.modal.state = state.toUpperCase();
      this.modal.title = title;
    },
    triggerSlideUpModal() {
      const negativeScrollTop = window.pageYOffset * -1;

      this.modal.scrollTop = window.pageYOffset;
      this.modal.style = `top: ${window.pageYOffset}px; `;

      this.bodyStyle = `top: ${negativeScrollTop}px; position: fixed; left: 0; right: 0; padding: 0 8px;`;

      this.modal.showSlideUp = true;
    },
    hideModal($event, checkTarget) {
      if (
        checkTarget &&
        !Array.from($event.target.classList).includes("slide-up-modal")
      ) {
        return;
      }

      if (this.modal.state == "LOAD-TEMPLATE-DATA") {
        this.selectedTemplateKata = [];
      }

      this.modal.showSlideUp = false;

      this.bodyStyle = "";
      this.$nextTick(() => {
        if (this.modal.scrollTop !== null) {
          window.scrollTo(0, this.modal.scrollTop);
          this.modal.scrollTop = null;
        }
      });
      this.selectedKata = null;
    },

    modalBodyAfterLeave() {
      this.updateModalState("hide");
    },

    openTemplateKataImport() {
      this.importTemplateKataStage = 1;
      this.updateModalState("load-template-data", "Load Kata from a Template");
    },

    updateDataScheme(kata) {
      if (!this.settings.schemaVersion) {
        this.settings.schemaVersion = 1;

        let parsedKata = JSON.parse(kata);
        parsedKata = parsedKata.map(k => {
          if (!k.history) {
            k.history = [
              {
                count: k.reps,
                date: k.lastUpdated || moment()
              }
            ];
            delete k.lastUpdated;
          }

          if (k.lastUpdated) delete k.lastUpdated;

          return k;
        });
        this.updateKataStorage(parsedKata);
        this.updateSettingsStorage();
      } else if (this.settings.schemaVersion < 3) {
        let tempTagPool = [];
        // Copy tags from kata to settings
        // Convert lastUpdated to history if kata doesn't have history
        let tempKata = JSON.parse(kata);
        tempKata.forEach(kata => {
          tempTagPool.push(...kata.tags);
          if (!kata.history) {
            kata.history = [];

            if (kata.lastUpdated) {
              kata.history.push({
                count: kata.reps,
                date: moment(kata.lastUpdated)
              });
              delete kata.lastUpdated;
            } else {
              kata.history.push({
                count: kata.reps,
                date: moment()
              });
            }
          }
        });

        // dedupe any tags and make them all lowercase
        this.settings.tagPool = tempTagPool.reduce((accum, tag) => {
          if (!accum.includes(tag)) accum.push(tag.toLowerCase());
          return accum;
        }, []);

        this.updateSettingsStorage();
        this.updateKataStorage(tempKata);
      }
    }
  },
  computed: {
    filteredKataList() {
      if (!this.filterTag) return this.kataList;

      return this.kataList.filter(k => k.tags.includes(this.filterTag));
    },
    filteredTemplateKata() {
      const clone = JSON.parse(JSON.stringify(templateKata));

      delete clone.testData;

      return clone;
    },
    totalKataReps() {
      if (!this.filteredKataList || this.filteredKataList.length < 1) return 0;
      return this.filteredKataList.reduce(
        (sum, k) => Number.parseInt(k.reps) + sum,
        0
      );
    },
    dataJSONExport() {
      const data = {
        kata: this.kataList,
        settings: this.settings
      };
      return JSON.stringify(data);
    }
  },
  created() {
    this.storage = window.localStorage;
    const settings = this.storage.getItem("settings");
    const kata = this.storage.getItem("kata");

    if (settings) {
      this.settings = JSON.parse(settings);
    }

    if (kata) {
      this.kataList = JSON.parse(kata);
    }
  },

  data() {
    return {
      storage: null, // localStorage reference

      draftTag: null,
      filterTag: false,
      kataList: [],

      settings: {
        pretendNoKata: null,
        defaultEndDate: null,
        defaultDaysRemaining: null,
        defaultRepsGoal: null,
        tagPool: []
      },
      bodyStyle: "",
      modal: {
        state: "HIDE",
        title: "",
        showSlideUp: false,
        style: "",
        scrollTop: null
      },

      importTemplateKataStage: 1,
      selectedTemplateKata: [],
      selectedKata: null,
      dataJSON: "",
      dataJSONError: "",

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
  --background-color: #fff;
  --base-font-colour: #282828;
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
  padding: 10px;
}

.counter-cont {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.card {
  margin: 7.5px;
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

input {
  border-radius: 6px;
  border: 1px solid #ccc;
  padding: 3px 6px;
}

.flex-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.error-text {
  color: red;
}

.setup-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.setup-buttons > * {
  margin: 5px;
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
  border-radius: 30px 30px 0 0;
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
  transition: 200ms;
}

.modal-transition-leave-active {
  transform: translateY(100%);
}

.modal-transition-enter,
.modal-transition-leave-to {
  transform: translateY(100%);
}
</style>
