<template>
  <form action="() => {}">
    <label
      for="name"
      class="flex-label"
    >
      <span>Kata Name:</span>
      <input
        type="text"
        name="name"
        placeholder="Enter a kata name here"
        v-model="draftKata.name"
      ></label>
    <label
      for="reps"
      class="flex-label"
    >
      <span>Repetitions:</span>
      <input
        type="number"
        name="reps"
        v-model.number="draftKata.reps"
      ></label>
    <label
      for="defaultReps"
      class="flex-label"
    >
      <span>Use default repetitions goal:</span>
      <input
        type="checkbox"
        name="defaultReps"
        v-model="draftKata.defaultGoalReps"
      ></label>

    <label
      for="goal"
      class="flex-label"
      v-if="!draftKata.defaultGoalReps"
    >
      <span>Goal Repetitions:</span>
      <input
        type="number"
        name="goal"
        v-model.number="draftKata.goalReps"
      ></label>

    <label
      for="defaultDate"
      class="flex-label"
    >
      <span>Use default end date for goal date:</span>
      <input
        type="checkbox"
        name="defaultDate"
        v-model="draftKata.defaultGoalDate"
      ></label>
    <label
      for="goalDate"
      class="flex-label"
      v-if="!draftKata.defaultGoalDate"
    >
      <span>Goal Date:</span>
      <input
        type="date"
        name="goalDate"
        v-model="draftKata.goalDate"
      ></label>
    <label
      for="colour"
      class="flex-label"
    >
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
    <label
      for="tabs"
      class="flex-label"
    >
      <span>Belt Tabs:</span>
      <input
        type="number"
        name="tabs"
        v-model.number="draftKata.tabs"
      ></label>

    <label
      for="tags"
      class="flex-label"
    >
      <span>Kata Tags:</span>
      <input
        type="text"
        name="tags"
        placeholder="Tags are comma seperated"
        v-model="draftKata.tags"
      ></label>

    <button @click.prevent="saveKata">Save</button>
    <button @click.prevent="cancelEdit">Cancel</button>
    <button
      v-if="targetKata"
      @click.prevent="deleteKata"
    >Delete Kata</button>
  </form>
</template>


<script>
export default {
  props: {
    targetKata: {
      type: Object
    }
  },
  methods: {
    cancelEdit() {
      this.$emit("cancelEdit");
    },
    saveKata() {
      this.$emit("saveKata", this.draftKata);
    },
    deleteKata() {
      this.$emit("deleteKata", this.draftKata);
    },
    kataColourClass(colour) {
      const classes = [];
      if (colour) {
        classes.push(colour.toString());
      }
      if (this.draftKata && this.draftKata.colour == colour) {
        classes.push("selected-colour");
      }
      return classes;
    },
    selectColour(colour) {
      this.draftKata.colour = colour;
    }
  },

  created() {
    if (this.targetKata) {
      this.draftKata = JSON.parse(JSON.stringify(this.targetKata));
    }
  },
  data() {
    return {
      draftKata: {
        name: "",
        reps: 0,
        goalDate: null,
        goalReps: null,
        defaultGoalReps: true,
        defaultGoalDate: true,
        tabs: 0,
        colour: "white",
        tags: [],
        id: Date.now()
      },
      colours: [
        "purple",
        "red",
        "orange",
        "brown",
        "yellow",
        "blue",
        "green",
        "black",
        "white",
        "grey"
        // "white",
        // "blue",
        // "dark-blue",
        // "yellow",
        // "dark-yellow",
        // "green",
        // "dark-green",
        // "brown",
        // "dark-brown",
        // "black"
      ]
    };
  }
};
</script>


<style scoped>
.colour-circle {
  width: 25px;
  height: 25px;
  border-radius: 100%;
  margin: 5px 16px;
  display: block;
  box-shadow: 0px 0px 0px 1px black;
  cursor: pointer;
}

.colour-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  border-radius: 5px;
  background: #a9a9a9;
  padding: 8px 0px;
}

.colour-circle.selected-colour {
  box-shadow: 0px 0px 0px 3px black;
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

.colour-circle.purple {
  background: var(--purple);
}

.colour-circle.red {
  background: var(--red);
}

.colour-circle.orange {
  background: var(--orange);
}

.colour-circle.grey {
  background: var(--grey);
}
</style>