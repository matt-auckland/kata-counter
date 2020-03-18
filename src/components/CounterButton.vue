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
    showGoal() {
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
  <div class="button">
    <div class="action left" @click="decrement">-</div>
    <div class="count-name" :class="{ show: show }" @click="showGoal">
      <div class="name">{{ name }}</div>
      <div class="count">{{ count }}</div>
      <div>{{ requiredReps }}</div>
      <div>Goal: {{ goal }}</div>
    </div>
    <div class="action right" @click="increment">+</div>
  </div>
</template>

<style scoped>
.button {
  user-select: none;
  border: 1px solid black;
  border-radius: 15px;
  min-width: 50px;
  display: flex;
  justify-content: space-between;
  max-width: 300px;
  margin: 12px 0;
}

.count-name {
  transition: 320ms;
  padding: 5px 10px;
  text-align: center;
  height: 42px;
  overflow: hidden;
  cursor: pointer;
}

.count-name.show {
  height: 86px;
}

.button .action {
  cursor: pointer;
  padding: 5px 10px;
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
