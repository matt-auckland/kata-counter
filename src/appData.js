import templateKata from "./assets/templateKata";

const appData = {
  settings: {
    defaultGoalDate: "2020-06-27T00:00:00.000Z",
    defaultGoalReps: 100,

    // how many days until the goal before we show 'reps per day'
    // if it's less than 0 it will never show reps per day
    repPerDayModeTrigger: 30,

    // show 2.5 reps per day or 3 reps per day
    roundUpReps: false,
    pretendNoKata: false,
  },
  // kataList: [],
  kataList: templateKata.testData.kata,
};

export default appData;
