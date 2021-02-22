<template>
  <div class="kata-editor">
    <div class="tabs">
      <div
        class="tab"
        :class="{selected: tab == 'edit'}"
        @click="selectTab('edit')"
      >Edit</div>
      <div
        class="tab"
        :class="{selected: tab == 'history'}"
        @click="selectTab('history')"
      >History</div>
    </div>

    <template v-if="tab == 'edit'">
      <form action="javascript:;">
        <UIInput
          type="text"
          name="name"
          :label="'Kata Name:'"
          placeholder="Enter a kata name here"
          v-model="draftKata.name"
        ></UIInput>

        <UIBubble>
          <span>
            Repetitions:
          </span>
          <span slot="right">{{draftKata.reps}}</span>
        </UIBubble>
        <UIInput
          type="checkbox"
          id="defaultReps"
          label="Use default repetitions goal:"
          v-model="draftKata.defaultGoalReps"
        ></UIInput>

        <UIInput
          v-if="!draftKata.defaultGoalReps"
          type="number"
          name="goal"
          label="Goal Repetitions:"
          v-model.number="draftKata.goalReps"
        ></UIInput>

        <UIInput
          type="checkbox"
          label="Use default end date for goal date:"
          id="defaultDate"
          v-model="draftKata.defaultGoalDate"
        ></UIInput>
        <UIInput
          v-if="!draftKata.defaultGoalDate"
          type="date"
          label="Goal Date:"
          name="goalDate"
          v-model="draftKata.goalDate"
        ></UIInput>
        <div class="colour-container">
          <div class="colour-container-title">Accent Colour:</div>
          <div
            v-for="colour in colours"
            :key="colour"
            class="colour-circle"
            :class="kataColourClass(colour)"
            @click="selectColour(colour)"
          ></div>
        </div>

        <div class="tag-pool">
          <div class="tag-pool-title">Kata Tags<span v-if="tagPool && tagPool.length">, tap to select</span></div>
          <span
            class="tag-bubble"
            :class="{ selected: draftKata.tags.includes(tag) }"
            v-for="tag in tagPool"
            :key="tag"
            @click="selectTag(tag)"
          >{{tag | capitalize}}</span>

          <div v-if="!tagPool || !tagPool.length">
            No tags found, tap below to add some!
          </div>
        </div>

        <UIButton @click="routeAndAddTag">Create new Kata Tag</UIButton>

        <hr>
        <UIButton @click="saveKata">Save Changes</UIButton>

        <UIButton @click="cancelEdit">Discard Edits</UIButton>
        <hr>
        <UIButton @click="deleteKata">Delete Kata</UIButton>
      </form>
    </template>

    <template v-else-if="tab == 'history'">
      <div v-if="!kataHistoryReversed.length">
        No reps recorded for this Kata yet.
      </div>
      <div
        v-else
        class="list-cont"
      >
        <table>
          <th>Reps</th>
          <th>Date</th>
          <th>Time</th>
          <th></th>
          <tr
            v-for="(entry, i) in kataHistoryReversed"
            :key="entry.date + entry.time + entry.total"
          >
            <td>
              {{entry.total}}
            </td>
            <td>{{entry.date}}</td>
            <td>{{entry.time}}</td>
            <td>
              <UIButton @click="deleteKataRep(i)">Delete</UIButton>
            </td>
          </tr>
        </table>
      </div>
    </template>
  </div>
</template>


<script>
import moment from "moment";
import UIButton from "../components/UI-Button";
import UIInput from "../components/UI-Input.vue";
import UIBubble from "../components/UI-Bubble.vue";

export default {
  props: {
    tagPool: {
      type: Array,
    },
  },
  components: { UIButton, UIInput, UIBubble },
  methods: {
    selectTab(tabName) {
      this.tab = tabName;
      // this.cloneOriginalKata();
    },
    cancelEdit() {
      this.$router.push("/");
    },
    deleteKataRep(repIndex) {
      // reduce reps by count of rep
      this.draftKata.reps -= this.kataHistoryReversed[repIndex].count;
      // find index of rep
      const indexToRemove = this.draftKata.history.length - 1 - repIndex;

      // update all following reps 'total' by decrementing the count of removed rep
      this.draftKata.history.forEach((item, i) => {
        if (i > indexToRemove)
          item.total -= this.kataHistoryReversed[repIndex].count;
      });
      // remove rep
      this.draftKata.history = this.draftKata.history.filter((entry, i) => {
        return indexToRemove !== i;
      });

      //save kata
      this.saveKata(false);
    },
    saveKata(returnHome = true) {
      this.disableForm = true;
      this.$root.saveKata(this.draftKata);
      if (returnHome) {
        this.$router.push("/");
      }
      this.disableForm = false;
    },
    deleteKata() {
      if (window.confirm("Are you sure you want to delete this Kata?")) {
        this.$root.deleteKata(this.draftKata.id);
        this.$router.push("/");
      }
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
        this.draftKata.tags = this.draftKata.tags.filter((t) => t != tag);
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
    cloneOriginalKata() {
      this.draftKata = JSON.parse(
        JSON.stringify(this.$root.getKataById(this.$route.params.id))
      );
    },
  },

  created() {
    if (!this.$route.params.id) {
      this.$router.push("/"); //redirect to home if we can't find kata
    } else {
      this.cloneOriginalKata();
      if (this.draftKata == null) this.$router.push("/"); //redirect to home if we can't find kata
    }
  },
  data() {
    return {
      disableForm: false,
      // changesDetected: false,
      tab: "edit",
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
        id: Date.now(),
        history: [],
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
        "grey",
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
      ],
    };
  },
  // watch: {
  //   draftKata: {
  //     deep: true,
  //     handler(newVal, oldVal) {
  //       const ctrl = this;
  //       // if (oldVal.name === "") return;
  //       Object.keys(newVal).forEach((key) => {
  //         console.log(
  //           `${key}, ${newVal[key]}, ${oldVal[key]} .`,
  //           newVal[key] != oldVal[key]
  //         );
  //         if (newVal[key] != oldVal[key]) ctrl.changesDetected = true;
  //       });
  //     },
  //   },
  // },
  computed: {
    kataHistoryReversed() {
      if (!this.draftKata.history) return [];
      return [...this.draftKata.history]
        .map((e) => {
          return {
            time: moment(e.date).format("HH:mm:ss"),
            date: moment(e.date).format("D/MM/YYYY"),
            count: e.count,
            total: e.total,
          };
        })
        .reverse();
    },
  },
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
  max-height: calc(100vh - 100px);
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

.tag-pool {
  border-radius: 5px;
  background: #2c2c46b4;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  min-height: 30px;
  color: #fff;
}

.tag-pool-title {
  width: 100%;
  color: #fff;
  text-align: left;
  margin: 0 0 10px;
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

.colour-container-title {
  width: 100%;
  color: #fff;
  text-align: left;
  margin: 0 0 10px;
}

.colour-container {
  font-size: 14px;
  font-family: sans-serif;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  border-radius: 5px;
  background: #2c2c46b4;
  padding: 8px;
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