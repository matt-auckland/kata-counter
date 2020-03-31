<template>
  <div id="app">
    <header class="header">
      <div
        @click="toggleSettings"
        class="options-icon"
      >{{tab == 'COUNTERS' ? '⚙️' : '↩️'}}</div>
      <select
        v-if="tab == 'COUNTERS'"
        class="filter-dropdown"
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
        >{{ tag | capitalize }}</option>
      </select>
      <h1 v-if="tab != 'COUNTERS'">{{ tab == 'SETTINGS' ? 'Settings' : `Editing ${selectedKata.name}`}}</h1>
      <div></div>
    </header>

    <!-- Settings Page -->
    <template v-if="tab == 'SETTINGS'">
      settings
    </template>

    <!-- Counters Page -->
    <template v-else-if="tab == 'COUNTERS'">
      <counter-button
        v-show="!filterTag || k.tags.includes(filterTag)"
        v-for="k in kata"
        :key="k.name"
        @increment="increment"
        @decrement="decrement"
        @edit="editKata"
        :name="k.name"
        :goal="k.goal ? k.goal : goal"
        :count="k.count"
        :daysRemaining="daysRemaining"
        :colour="k.colour ? k.colour : ''"
        :tabs="k.tabs"
      ></counter-button>
    </template>

    <!-- Edit Page -->
    <template v-else-if="tab == 'EDIT'">
      <form>
        <label for="name">
          <span>Kata Name:</span>
          <input
            type="text"
            name="name"
            v-model="selectedKata.name"
          ></label>
        <label for="reps">
          <span>Repetitions:</span>
          <input
            type="number"
            name="reps"
            v-model.number="selectedKata.count"
          ></label>
        <label for="goal">
          <span>Goal:</span>
          <input
            type="number"
            name="goal"
            v-model.number="selectedKata.goal"
          ></label>
        <label for="colour">
          <span>Colour:</span>
        </label>
        <div class="colour-container">
          <div
            v-for="colour in colours"
            :key="colour"
            class="colour-circle"
            :class="kataColourClass(colour)"
            @click="selectColour(colour)"
          ></div>
        </div>
        <label for="tabs">
          <span>Tabs:</span>
          <input
            type="number"
            name="tabs"
            v-model.number="selectedKata.tabs"
          ></label>

        <button @click.prevent="saveKata">Save</button>
        <button @click.prevent="goBack">Cancel</button>
      </form>
    </template>
  </div>
</template>

<script>
import moment from "moment";
import CounterButton from "./components/CounterButton.vue";

const testData = [
  {
    name: "Gekisai Dai Ichi",
    tags: ["goju", "kaishugata"],
    count: 26,
    colour: "blue",
    tabs: 0
  },
  {
    name: "Gekisai Dai Ni",
    tags: ["goju", "kaishugata"],
    count: 15,
    colour: "dark-blue",
    tabs: 0,
    goal: 0
  },
  { name: "Saifa", tags: ["goju", "kaishugata"], count: 15, colour: "yellow" },
  {
    name: "Seiyunchin",
    tags: ["goju", "kaishugata"],
    count: 23,
    colour: "dark-green",
    tabs: 0
  },
  {
    name: "Shisochin",
    tags: ["goju", "kaishugata"],
    count: 19,
    colour: "dark-brown",
    tabs: 0
  },
  {
    name: "Sanseiru",
    tags: ["goju", "kaishugata"],
    count: 22,
    colour: "black"
  },
  { name: "Seipai", tags: ["goju", "kaishugata"], count: 23, colour: "black" },
  { name: "Sanchin", tags: ["goju", "heishugata"], count: 14, colour: "black" },
  {
    name: "Sanchin Dai Ni",
    tags: ["goju", "heishugata"],
    count: 3,
    colour: "black"
  },
  { name: "Tensho", tags: ["goju", "heishugata"], count: 12, colour: "black" },
  {
    name: "Akimine Kihon Bo Ichi",
    tags: ["weapons", "bo"],
    count: 10,
    colour: "dark-green",
    goal: 30
  },
  {
    name: "Akimine Kihon Sai",
    tags: ["weapons", "sai"],
    count: 10,
    colour: "dark-green",
    goal: 30,
    tabs: 1
  },
  {
    name: "Akimine Kihon Bo Ichi (Left Handed)",
    tags: ["weapons", "bo"],
    count: 10,
    colour: "dark-brown",
    goal: 30
  },
  {
    name: "Akimine Kihon Sai Ni",
    tags: ["weapons", "sai"],
    count: 10,
    colour: "dark-brown",
    goal: 15,
    tabs: 0
  },
  {
    name: "Maezato no Tekko",
    tags: ["weapons", "tekko"],
    count: 10,
    colour: "dark-brown",
    goal: 15,
    tabs: 0
  },
  {
    name: "Akimine Kihon Bo Ni",
    tags: ["weapons", "bo"],
    count: 10,
    colour: "dark-brown",
    goal: 30,
    tabs: 0
  },
  {
    name: "Akimine Kihon Bo Ni (Left handed)",
    tags: ["weapons", "bo"],
    count: 10,
    colour: "dark-brown",
    goal: 30,
    tabs: 0
  },
  {
    name: "Shushi no Kon (Sho)",
    tags: ["weapons", "bo"],
    count: 10,
    colour: "dark-brown",
    goal: 15,
    tabs: 0
  },
  {
    name: "Chikin Shita Haku no Sai",
    tags: ["weapons", "sai"],
    count: 10,
    colour: "dark-brown",
    goal: 15,
    tabs: 2
  },
  {
    name: "Maezato no Nunchaku",
    tags: ["weapons", "nunchaku"],
    count: 10,
    colour: "dark-brown",
    goal: 20
  },
  {
    name: "Akimine no Nunchaku",
    tags: ["weapons", "nunchaku"],
    count: 10,
    colour: "black",
    goal: 20
  }
];

export default {
  name: "App",
  components: {
    CounterButton
  },
  filters: {
    capitalize(str) {
      if (!str) return "";
      return str[0].toUpperCase() + str.slice(1);
    }
  },
  methods: {
    increment(kataName) {
      const kata = this.kata.filter(k => k.name === kataName)[0];
      kata.count++;
      this.updateStorage(this.kata);
    },
    decrement(kataName) {
      const kata = this.kata.filter(k => k.name === kataName)[0];
      if (kata.count == 0) return;
      kata.count--;
      this.updateStorage(this.kata);
    },
    editKata(kataName) {
      const kata = this.kata.filter(k => k.name === kataName)[0];
      if (kata.count == 0) return;
      this.selectedKata = kata;
      this.tab = "EDIT";
    },
    saveKata() {
      this.updateStorage(this.kata);
      this.goBack();
    },
    goBack() {
      this.selectedKata = null;
      this.tab = "COUNTERS";
    },
    toggleSettings() {
      if (this.tab != "COUNTERS") {
        this.tab = "COUNTERS";
      } else {
        this.tab = "SETTINGS";
      }
    },
    calcTotalReps() {
      const ctrl = this;
      const reps = this.kata.map(k => ctrl.calcReps(k.reps));
      return Math.round(reps.reduce((total, rep) => total + rep, 0));
    },
    updateStorage(kataData) {
      // eslint-disable-next-line no-debugger
      debugger;
      this.storage.setItem("kata", JSON.stringify(kataData));
      this.kata = JSON.parse(this.storage.getItem("kata"));
      this.tagPool = new Set(this.kata.flatMap(k => k.tags));
    },
    selectColour(colour) {
      this.selectedKata.colour = colour;
    },
    kataColourClass(colour) {
      const classes = [];
      if (colour) {
        classes.push(colour.toString());
      }
      if (this.selectedKata && this.selectedKata.colour == colour) {
        classes.push("selected-colour");
      }
      return classes;
    }
  },
  created() {
    this.storage = window.localStorage;
    const kata = this.storage.getItem("kata");

    if (!kata) this.updateStorage(testData);
    else {
      this.kata = JSON.parse(kata);
      this.tagPool = new Set(this.kata.flatMap(k => k.tags));
    }
    this.daysRemaining = this.endDate.diff(this.startDate, "days");
  },
  data() {
    return {
      storage: null,
      endDate: moment("2021-01-01", "YYYY-MM-DD"),
      startDate: moment(),
      daysRemaining: 0,
      tagPool: null,
      filterTag: false,
      goal: 100,
      selectedKata: null,
      kata: null,
      // SETTINGS, COUNTERS, EDIT
      tab: "COUNTERS",
      colours: [
        "white",
        "blue",
        "dark-blue",
        "yellow",
        "dark-yellow",
        "green",
        "dark-green",
        "brown",
        "dark-brown",
        "black"
      ]
    };
  }
};
</script>

<style>
:root {
  --background-color: #282828;
  --base-font-colour: #fff;
  --base-red: #ff4848;
  --blue: #3e81ea;
  --dark-blue: #215bb7;
  --yellow: #fffb00;
  --dark-yellow: #d8d50b;
  --green: #34bd29;
  --dark-green: #1e8616;
  --brown: #b38108;
  --dark-brown: #8c6315;
  --black: #000;
}

body {
  color: var(--base-font-colour);
  background: var(--background-color);
}

#app {
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

.options-icon {
  cursor: pointer;
  font-size: 32px;
}

.filter-dropdown {
  font-size: 18px;
}

.header h1 {
  margin: 0;
}

form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: auto;
}
form > * {
  margin: 8px 0;
}
label {
  display: flex;
  justify-content: space-between;
}

.colour-circle {
  width: 25px;
  height: 25px;
  border-radius: 100%;
  margin: 5px 16px;
  display: block;
}

.colour-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  border-radius: 5px;
  background: #333;
}

.colour-circle.selected-colour {
  box-shadow: 0px 0px 0px 2px white;
}

.colour-circle.white {
  background: white;
}

.colour-circle.blue {
  background: var(--blue);
}

.colour-circle.dark-blue {
  background: var(--dark-blue);
}

.colour-circle.yellow {
  background: var(--yellow);
}

.colour-circle.dark-yellow {
  background: var(--dark-yellow);
}

.colour-circle.green {
  background: var(--green);
}

.colour-circle.dark-green {
  background: var(--dark-green);
}

.colour-circle.brown {
  background: var(--brown);
}

.colour-circle.dark-brown {
  background: var(--dark-brown);
}

.colour-circle.black {
  background: var(--black);
}
</style>
