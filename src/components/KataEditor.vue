<template>
  <div class="kata-editor">
    <div class="tabs">
      <div
        class="tab"
        :class="{selected: tab == 'general'}"
        @click="selectTab('general')"
      >General</div>
      <div
        class="tab"
        :class="{selected: tab == 'history'}"
        @click="selectTab('history')"
      >History</div>
      <div
        class="tab"
        :class="{selected: tab == 'advanced'}"
        @click="selectTab('advanced')"
      >Advanced</div>
    </div>

    <template v-if="tab == 'general'">
      <h3 class="sub-title">General Options</h3>
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
            id="defaultReps"
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
            id="defaultDate"
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
        <!-- <label
      for="tabs"
      class="flex-label"
    >
      <span>Belt Tabs:</span>
      <input
        type="number"
        name="tabs"
        v-model.number="draftKata.tabs"
      ></label> -->

        <button @click.prevent="saveKata">Save</button>
        <button @click.prevent="cancelEdit">Cancel</button>
      </form>
    </template>

    <template v-else-if="tab == 'history'">
      <h3 class="subtitle">
        Kata rep history
      </h3>
      <div class="list-cont">
        <table>
          <th>Reps</th>
          <th>Date</th>
          <th>Time</th>
          <tr
            v-for="entry in kataHistoryReversed"
            :key="entry.date + entry.time + entry.count"
          >
            <td>
              {{entry.count}}
            </td>
            <td>{{entry.date}}</td>
            <td>{{entry.time}}</td>
          </tr>
        </table>
      </div>
    </template>

    <template v-else-if="tab == 'advanced'">
      <h3 class="sub-title">Advanced Options</h3>

      <form action="javascript:;">
        <div>Kata Tags, tap to select</div>
        <div class="tag-pool">
          <span
            class="tag-bubble"
            :class="{ selected: draftKata.tags.includes(tag) }"
            v-for="tag in tagPool"
            :key="tag"
            @click="selectTag(tag)"
          >{{tag | capitalize}}</span>
        </div>

        <button @click.prevent="routeAndAddTag">Create new tags</button>

        <button
          v-if="targetKata"
          @click.prevent="deleteKata"
        >Delete Kata</button>

      </form>
    </template>

  </div>

</template>


<script>
import moment from "moment";

export default {
  props: {
    targetKata: {
      type: Object
    },
    tagPool: {
      type: Array
    }
  },
  methods: {
    selectTab(tabName) {
      this.tab = tabName;
      this.resetKata();
    },
    cancelEdit() {
      this.$emit("cancelEdit");
    },
    saveKata(hideModal = true) {
      const ctrl = this;
      this.disableEdits = true;
      this.$emit("saveKata", this.draftKata);
      if (hideModal) {
        setTimeout(function() {
          ctrl.$emit("hideModal");
        }, 100);
      }
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
      console.log(colour);
      this.draftKata.colour = colour;
    },
    selectTag(tag) {
      if (this.draftKata.tags.includes(tag)) {
        console.log(`remove tag ${tag}`);
        this.draftKata.tags = this.draftKata.tags.filter(t => t != tag);
      } else {
        console.log(`add tag ${tag}`);
        this.draftKata.tags.push(tag);
      }
      console.log(this.draftKata.tags);
      this.saveKata(false);
    },
    routeAndAddTag() {
      this.$emit("routeAndAddTag");
    },
    resetKata() {
      this.draftKata = JSON.parse(JSON.stringify(this.targetKata));
    }
  },

  created() {
    if (this.targetKata) {
      this.resetKata();
    }
  },
  data() {
    return {
      tab: "general",
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
  },
  computed: {
    kataHistoryReversed() {
      let reversed = this.draftKata.history
        .map(e => {
          e.time = moment(e.date).format("HH:mm:ss");
          e.date = moment(e.date).format("D/MM/YYYY");
          return e;
        })
        .reverse();
      return reversed;
    },
    kataHistoryShort() {
      return this.kataHistoryReversed.slice(0, 10);
    }
  }
};
</script>


<style scoped>
.kata-editor {
  height: 50vh;
}

.kata-editor input {
  font-size: 0.8em;
}

.tabs {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  margin-bottom: 10px;
}

.tab {
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  flex: 1;
  margin: 0 16px;
}

.tab.selected {
  border-color: black;
  font-weight: bold;
}

.list-cont {
  overflow-y: scroll;
  height: calc(100% - 60px);
  border-bottom: 1px solid #000;
}

.list-cont table {
  table-layout: fixed;
  width: 100%;
  column-width: 33%;
  text-align: left;
}
table,
td,
th {
  border-collapse: collapse;
}
th,
td {
  padding: 10px;
  border: solid 1px;
}

.subtitle {
  margin: 0 0 10px 0;
}

.tag-pool {
  border: 1px solid #333;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  min-height: 30px;
}

.tag-bubble {
  border: 1px solid #ccc;
  background: white;
  border-radius: 12px;
  min-width: 20px;
  padding: 6px 12px;
  cursor: pointer;
}

.tag-bubble.selected {
  border-color: black;
  font-weight: bold;
}
</style>

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