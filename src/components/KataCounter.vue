<script>
import moment from "moment";

export default {
  name: "kata-counter",
  props: ["kata"],
  data() {
    return {
      showOptions: false,
      debounce: false,
    };
  },
  methods: {
    toggleOptions() {
      if (this.debounce) return;
      this.showOptions = !this.showOptions;
      this.debounce = true;
      const vm = this;
      setTimeout(() => {
        vm.debounce = false;
      }, 200);
    },
    decrementEvent() {
      if (this.kata.reps == 0) return;

      this.kata.reps--;
      this.updateKataHist();
      this.$root.kataList = this.$root.updateKataStorage(this.$root.kataList);
    },
    incrementEvent() {
      this.kata.reps++;
      this.updateKataHist();
      this.$root.kataList = this.$root.updateKataStorage(this.$root.kataList);
    },
    updateKataHist() {
      if (!this.kata.history) {
        this.kata.history = [];
      }

      this.kata.history.push({
        date: moment(),
        count: 1,
        total: this.kata.reps,
      });
    },
  },
  computed: {
    repsRemaining() {
      // calc days left
      const goalReps =
        Number.parseInt(this.kata.goalReps) ||
        this.$root.settings.defaultGoalReps;
      return goalReps - Number.parseInt(this.kata.reps);
    },
    daysRemaining() {
      const daysRemaining = moment(
        this.kata.goalDate || this.$root.settings.defaultGoalDate
      ).diff(moment(), "days");

      if (daysRemaining < 1) return 1;
      return daysRemaining;
    },
    repsPerString() {
      if (this.repsRemaining <= 0) return `Goal complete`;
      if (this.daysRemaining == 0) return `${this.repsRemaining} reps per day`;
      if (this.daysRemaining <= 60)
        return `${Math.ceil(
          this.repsRemaining / this.daysRemaining
        )} reps per day`;

      const weeksRemaining = moment
        .duration(this.daysRemaining, "days")
        .asWeeks();

      return `${Math.ceil(this.repsRemaining / weeksRemaining)} reps per week`;
    },
    lastUpdatedString() {
      if (this.kata?.history?.length) {
        const hist = this.kata.history[this.kata.history.length - 1];

        const hoursSinceUpdate = moment().diff(moment(hist.date), "hours");

        let dateFormat = "HH:mm";
        if (hoursSinceUpdate >= 24) dateFormat = "D/MM/YY";

        return `Last Update: ${moment(hist.date).format(dateFormat)}`;
      }
      return "";
    },
    classObject() {
      const classes = [];
      if (this.kata.colour) classes.push(this.kata.colour.toString());
      return classes;
    },
  },
};
</script>

<template>
  <div
    class="kata"
    @click="toggleOptions"
  >
    <div
      class="belt"
      :class="classObject"
    ></div>
    <div class="content">
      <div class="inner">
        <div>
          <span class="name">{{ kata.name }}</span>
          <span class="count">
            {{ kata.reps }}/{{ kata.goalReps || $root.settings.defaultGoalReps }} reps
          </span>
        </div>
      </div>
    </div>

    <div
      class="bottom-half"
      :class="[showOptions && 'edit-mode']"
    >
      <div
        class="bottom-content"
        v-if="!showOptions"
      >
        <span class="prescription">{{ repsPerString }}</span>
        <span class="last-updated">
          {{lastUpdatedString}}
        </span>
      </div>

      <div
        v-if="showOptions"
        class="btn-cont"
      >
        <div
          class="btn left"
          @click.prevent="decrementEvent"
        >-1</div>
        <router-link
          class="btn"
          :to="'/edit/' + kata.id"
        >Edit</router-link>
        <div
          class="btn right"
          @click.prevent="incrementEvent"
        >+1</div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.kata {
  display: flex;
  flex: 1 0 100%;
  flex-direction: column;
  justify-content: flex-end;

  font-size: 16px;
  line-height: 1.3;
  text-align: left;

  position: relative;
  user-select: none;

  overflow: hidden;
  background: #2c2c46b4;
  /* background: linear-gradient(170deg, #2c2c46e5 30%, #5d5d94e5); */
  border-radius: 10px;

  --font-color: white;
  --title-color: white;
  color: var(--font-color);
  /* cursor: move; */
}

.content {
  padding: 10px 15px;
  flex: 1;
}

.name {
  /* color: black; */
  font-size: 1.2em;
}
.count {
  float: right;
}

.bottom-half {
  height: 28px;
}

.bottom-half .bottom-content {
  padding: 0 15px 10px;
}

.bottom-content .prescription {
  float: left;
}

.bottom-content .last-updated {
  float: right;
}

.bottom-half.edit-mode .bottom-content {
  padding: 0;
}

.btn-cont {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
  height: 100%;
}

.btn {
  cursor: pointer;
  padding: 3px;
  text-align: center;
  vertical-align: center;
  color: #fff;
  flex: 1 0;
  background: radial-gradient(rgba(117, 117, 117, 0.533), #0000 80%);
  background: rgba(117, 117, 117, 0.274);
  border-radius: 15px 15px 0 0;
}

.btn.left {
  border-top-left-radius: 0;
}
.btn.right {
  border-top-right-radius: 0;
}
</style>

<!-- colours -->
<style scoped>
.belt {
  --text-color: white;
  --accent-color: white;
  width: 100%;
  height: 5px;
  color: var(--text-color);
  background: linear-gradient(90deg, #0000 5%, var(--accent-color), #0000 95%);
}

.belt.white {
  --text-color: black;
  --accent-color: rgb(233, 233, 233);
}

.belt.purple {
  --accent-color: var(--purple);
}

.belt.red {
  --accent-color: var(--red);
}

.belt.orange {
  --accent-color: var(--orange);
}

.belt.grey {
  --accent-color: var(--grey);
}

.belt.blue {
  --accent-color: var(--blue);
}

.belt.dark-blue {
  --accent-color: var(--dark-blue);
}

.belt.yellow {
  --text-color: black;
  --accent-color: var(--yellow);
}

.belt.dark-yellow {
  --accent-color: var(--dark-yellow);
}

.belt.green {
  --accent-color: var(--green);
}

.belt.dark-green {
  --accent-color: var(--dark-green);
}

.belt.brown {
  --accent-color: var(--brown);
}

.belt.dark-brown {
  --accent-color: var(--dark-brown);
}

.belt.black {
  --accent-color: var(--black);
}
</style>
