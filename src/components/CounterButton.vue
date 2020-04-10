<script>
import moment from "moment";

export default {
  name: "counter-button",
  props: ["name", "goalReps", "reps", "daysRemaining", "colour", "tabs"],
  data() {
    return {
      show: false
    };
  },
  methods: {
    decrementEvent() {
      if (this.reps == 0) return;
      this.$emit("decrement", this.name);
    },
    incrementEvent() {
      this.$emit("increment", this.name);
    },
    showGoal($event) {
      if ($event.target.classList.contains("prevent-open")) return;
      this.show = !this.show;
    },
    editKataEvent() {
      this.$emit("edit", this.name);
    }
  },
  computed: {
    requiredReps() {
      // calc days left
      const neededReps = Number.parseInt(this.goalReps) - this.reps;
      if (neededReps <= 0) return `Goal complete`;

      if (this.daysRemaining > 60) {
        const weeksRemaining = moment
          .duration(this.daysRemaining, "days")
          .asWeeks();
        return `${Math.ceil(neededReps / weeksRemaining)} reps per week needed`;
      }

      return `${Math.ceil(
        neededReps / this.daysRemaining
      )} reps per day needed`;
    },
    classObject() {
      const classes = [];
      if (this.colour) classes.push(this.colour.toString());
      if (this.show) classes.push("show");
      return classes;
    }
  }
};
</script>

<template>
  <div
    class="button"
    :class="classObject"
    @click="showGoal"
  >
    <div
      class="action left prevent-open"
      @click="decrementEvent"
    >
      <span class="button-icon prevent-open">-</span>
    </div>
    <div
      class="tab"
      v-for="(tab, i) in tabs"
      :key="tab + i"
      :style="{left: `${55 + (20 * i)}px`}"
    ></div>
    <div class="count-name">
      <div class="name">{{ name }}</div>
      <div class="count">{{ reps }}</div>
      <template v-show="show">
        <div>{{ requiredReps }}</div>
        <div>Goal: {{ goalReps }}</div>
        <button @click.prevent="editKataEvent">Edit</button>
      </template>
    </div>
    <div
      class="action right prevent-open"
      @click="incrementEvent"
    >
      <span class="button-icon prevent-open">+</span>
    </div>
  </div>
</template>

<style scoped>
.button {
  user-select: none;
  border: 1px solid var(--base-font-colour);
  border-radius: 15px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  cursor: pointer;
  position: relative;
}

.tab {
  position: absolute;
  background: black;
  height: 46px;
  width: 15px;
  top: 0;
  transition: 320ms;
}

.black .tab {
  background: gold;
}

.show .tab {
  height: 102px;
}

.count-name {
  transition: 320ms;
  margin: 5px 0;
  padding: 0 10px;
  text-align: center;
  height: 36px;
  overflow: hidden;
  line-height: 18px;
}

.show .count-name {
  height: 92px;
}

.button .action {
  padding: 5px 20px;
  display: flex;
  align-items: center;
}

.action.left {
  border-right: 1px solid;
}

.action.right {
  border-left: 1px solid;
}

.button .action:hover {
  font-weight: bold;
}

.white {
  color: black;
  border-color: black;
  background: rgb(233, 233, 233);
}

.purple {
  color: #fff;
  border-color: var(--purple);
  background: var(--purple);
}

.red {
  color: #fff;
  border-color: var(--red);
  background: var(--red);
}

.orange {
  color: #fff;
  border-color: var(--orange);
  background: var(--orange);
}

.grey {
  color: #fff;
  border-color: var(--grey);
  background: var(--grey);
}

.blue {
  color: #fff;
  border-color: var(--blue);
  background: var(--blue);
}

.dark-blue {
  color: #fff;
  border-color: var(--dark-blue);
  background: var(--dark-blue);
}

.yellow {
  color: black;
  border-color: var(--yellow);
  background: var(--yellow);
}

.dark-yellow {
  color: #fff;
  border-color: var(--dark-yellow);
  background: var(--dark-yellow);
}

.green {
  color: #fff;
  border-color: var(--green);
  background: var(--green);
}

.dark-green {
  color: #fff;
  border-color: var(--dark-green);
  background: var(--dark-green);
}

.brown {
  color: #fff;
  border-color: var(--brown);
  background: var(--brown);
}

.dark-brown {
  color: #fff;
  border-color: var(--dark-brown);
  background: var(--dark-brown);
}

.black {
  color: #fff;
  border-color: var(--black);
  background: var(--black);
}
</style>
