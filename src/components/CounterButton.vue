<script>
import moment from "moment";

export default {
  name: "counter-button",
  props: ["name", "goal", "count", "daysRemaining"],
  data() {
    return {
      show: false
    };
  },
  methods: {
    decrement() {
      if (this.count == 0) return;
      this.$emit("decrement", this.name);
    },
    increment() {
      this.$emit("increment", this.name);
    },
    showGoal($event) {
      if ($event.target.classList.contains("prevent-open")) return;
      this.show = !this.show;
    }
  },
  computed: {
    requiredReps() {
      // calc days left
      const neededReps = this.goal - this.count;
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
    }
  }
};
</script>

<template>
  <div class="button" @click="showGoal">
    <div class="action left prevent-open" @click="decrement">
      <span class="button-icon prevent-open">-</span>
    </div>
    <div class="count-name" :class="{ show: show }">
      <div class="name">{{ name }}</div>
      <div class="count">{{ count }}</div>
      <div v-show="show">{{ requiredReps }}</div>
      <div v-show="show">Goal: {{ goal }}</div>
    </div>
    <div class="action right prevent-open" @click="increment">
      <span class="button-icon prevent-open">+</span>
    </div>
  </div>
</template>

<style scoped>
.button {
  user-select: none;
  border: 1px solid black;
  border-radius: 15px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  cursor: pointer;
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

.count-name.show {
  height: 72px;
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
</style>
