const rootMethods = {
  updateKataStorage(kataData) {
    const storage = window.localStorage;

    storage.setItem("kata", JSON.stringify(kataData));
    return JSON.parse(storage.getItem("kata"));
  },
  updateSettingsStorage(settingsData) {
    const storage = window.localStorage;

    storage.setItem("settings", JSON.stringify(settingsData));
    return JSON.parse(storage.getItem("kata"));
  },
  getKataStorage() {
    return JSON.parse(window.localStorage.getItem("kata"));
  },
  getSettingsStorage() {
    return JSON.parse(window.localStorage.getItem("settings"));
  },
  getLocalStorage() {
    const kata = JSON.parse(window.localStorage.getItem("kata"));
    const settings = JSON.parse(window.localStorage.getItem("settings"));
    return { kata, settings };
  },
};

export default rootMethods;
