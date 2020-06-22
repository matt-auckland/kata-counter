<script>
import moment from "moment";

export default {
  name: "counter-button",
  props: ["goalReps", "daysRemaining", "kata"],
  methods: {
    decrementEvent() {
      if (this.kata.reps == 0) return;
      this.$emit("decrement", this.kata.id);
    },
    incrementEvent() {
      this.$emit("increment", this.kata.id);
    },
    editKataEvent() {
      this.$emit("edit", this.kata.id);
    }
  },
  computed: {
    requiredReps() {
      // calc days left
      const repsRemaining =
        Number.parseInt(this.goalReps) - Number.parseInt(this.kata.reps);
      if (repsRemaining <= 0) return `Goal complete`;
      if (this.daysRemaining == 0) return `${repsRemaining} reps per day`;
      if (this.daysRemaining <= 60)
        return `${Math.ceil(repsRemaining / this.daysRemaining)} reps per day`;

      const weeksRemaining = moment
        .duration(this.daysRemaining, "days")
        .asWeeks();

      return `${Math.ceil(repsRemaining / weeksRemaining)} reps per week`;
    },
    lastUpdatedString() {
      const history = this.kata.history[this.kata.history.length - 1];
      return `Last Updated: ${moment(history.date).format(
        "HH:mm:ss, D/MM/YYYY"
      )}`;
    },
    classObject() {
      const classes = [];
      if (this.kata.colour) classes.push(this.kata.colour.toString());
      return classes;
    }
  }
};
</script>

<template>
  <div class="card">
    <div
      class="belt"
      :class="classObject"
    ></div>
    <div class="content">
      <div class="name">{{ kata.name }}</div>
      {{lastUpdatedString}}
      <div class="count">{{ kata.reps }}/{{ goalReps }} reps</div>
      <div class="prescription">{{ requiredReps }}</div>
    </div>
    <div class="btn-cont">
      <div
        class="btn"
        @click="editKataEvent"
      >Edit</div>
      <div class="divider"></div>
      <div
        class="increment-btn btn"
        @click="incrementEvent"
      >+1</div>
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

.count-name {
  transition: 320ms;
  margin: 5px 0;
  padding: 0 10px;
  text-align: center;
  height: 36px;
  overflow: hidden;
  line-height: 20px;
  font-size: 17px;
}

.show .count-name {
  height: 138px;
}

.show .tab {
  height: 148px;
}

@media (max-width: 403px) {
  .show .count-name {
    height: 158px;
  }

  .show .tab {
    height: 168px;
  }
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

<style scoped>
.card {
  user-select: none;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-width: 160px;
  font-size: 16px;
  line-height: 1.3;
  color: #666;
  background: white;
  flex: 1 1;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
}

.content {
  padding: 12px 16px 10px;
  flex: 1;
}

.card .belt {
  padding: 0;
  width: 100%;
  height: 8px;
  /* background-color: green; */
}

.name {
  color: black;
}

.card .btn-cont {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: 2px solid #ccc;
}

.card .divider {
  border: 1px solid #ccc;
}

.card .btn {
  cursor: pointer;
  padding: 3px;
  text-align: center;
  vertical-align: center;
  color: black;
  flex: 1 0;
}
</style>
