<template>
  <div id="app">
    <select v-model="filterTag">
      <option default :value="false">Show All Kata</option>
      <option v-for="tag in tagPool" :key="tag" :value="tag">{{ tag }}</option>
    </select>
    <counter-button
      v-show="!filterTag || k.tags.includes(filterTag)"
      v-for="k in kata"
      :key="k.name"
      @increment="increment"
      @decrement="decrement"
      :name="k.name"
      :goal="k.goal ? k.goal : goal"
      :count="k.count"
      :daysRemaining="daysRemaining"
    ></counter-button>
  </div>
</template>

<script>
import moment from "moment";
import CounterButton from "./components/CounterButton.vue";

const testData = [
  {
    name: "Gekisai Dai Ichi",
    tags: ["goju", "kaishugata"],
    count: 26
  },
  {
    name: "Gekisai Dai ",
    tags: ["goju", "kaishugata"],
    count: 15
  },
  {
    name: "Saifa",
    tags: ["goju", "kaishugata"],
    count: 15
  },
  {
    name: "Seiyunchin",
    tags: ["goju", "kaishugata"],
    count: 23
  },
  {
    name: "Shisochin",
    tags: ["goju", "kaishugata"],
    count: 19
  },
  {
    name: "Sanseiru",
    tags: ["goju", "kaishugata"],
    count: 22
  },
  {
    name: "Seipai",
    tags: ["goju", "kaishugata"],
    count: 23
  },
  {
    name: "Sanchin",
    tags: ["goju", "heishugata"],
    count: 14
  },
  {
    name: "Sanchin Dai Ni",
    tags: ["goju", "heishugata"],
    count: 3
  },
  {
    name: "Tensho",
    tags: ["goju", "heishugata"],
    count: 12
  },
  {
    name: "Akimine Kihon Bo Ichi",
    tags: ["weapons", "bo"],
    count: 10,
    goal: 30
  },
  {
    name: "Akimine Kihon Sai",
    tags: ["weapons", "sai"],
    count: 10,
    goal: 30
  },
  {
    name: "Akimine Kihon Bo Ichi (Left Handed)",
    tags: ["weapons", "bo"],
    count: 10,
    goal: 30
  },
  {
    name: "Akimine Kihon Sai Ni",
    tags: ["weapons", "sai"],
    count: 10,
    goal: 15
  },
  {
    name: "Maezato no Tekko",
    tags: ["weapons", "tekko"],
    count: 10,
    goal: 15
  },
  {
    name: "Akimine Kihon Bo Ni",
    tags: ["weapons", "bo"],
    count: 10,
    goal: 30
  },
  {
    name: "Akimine Kihon Bo Ni (Left handed)",
    tags: ["weapons", "bo"],
    count: 10,
    goal: 30
  },
  {
    name: "Shushi no Kon (Sho)",
    tags: ["weapons", "bo"],
    count: 10,
    goal: 15
  },
  {
    name: "Chikin Shita Haku no Sai",
    tags: ["weapons", "sai"],
    count: 10,
    goal: 15
  },
  {
    name: "Maezato no Nunchaku",
    tags: ["weapons", "nunchaku"],
    count: 10,
    goal: 20
  },
  {
    name: "Akimine no Nunchaku",
    tags: ["weapons", "nunchaku"],
    count: 10,
    goal: 20
  }
];

export default {
  name: "App",
  components: {
    CounterButton
  },
  methods: {
    increment(kataName) {
      const kata = this.kata.filter(k => k.name === kataName)[0];
      kata.count++;
      // TODO: Update localstorage with new value
    },
    decrement(kataName) {
      const kata = this.kata.filter(k => k.name === kataName)[0];
      if (kata.count == 0) return;
      kata.count--;
      // TODO: Update localstorage with new value
    },

    calcTotalReps() {
      const ctrl = this;
      const reps = this.kata.map(k => ctrl.calcReps(k.reps));
      return Math.round(reps.reduce((total, rep) => total + rep, 0));
    },
    initTestData() {
      this.storage.setItem("kata", JSON.stringify(testData));
      this.kata = this.storage.getItem("kata");
      this.tagPool = new Set(this.kata.flatMap(k => k.tags));
    }
  },
  created() {
    this.storage = window.localStorage;
    const kata = this.storage.getItem("kata");

    if (!kata) this.initTestData();
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
      kata: null
    };
  }
};
</script>

<style>
#app {
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
