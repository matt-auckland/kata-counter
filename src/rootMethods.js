const rootMethods = {
  updateKataStorage(kataData) {
    const storage = window.localStorage;

    storage.setItem('kata', JSON.stringify(kataData));
    return JSON.parse(storage.getItem('kata'));
  },
  updateSettingsStorage(settingsData) {
    const storage = window.localStorage;

    storage.setItem('settings', JSON.stringify(settingsData));
    return JSON.parse(storage.getItem('kata'));
  },
  getKataStorage() {
    return JSON.parse(window.localStorage.getItem('kata'));
  },
  getSettingsStorage() {
    return JSON.parse(window.localStorage.getItem('settings'));
  },
  getLocalStorage() {
    const kata = JSON.parse(window.localStorage.getItem('kata'));
    const settings = JSON.parse(window.localStorage.getItem('settings'));
    return { kata, settings };
  },
  getKataById(kataId) {
    if (!kataId) return null;
    console.log(this.kataList.filter((kata) => kata.id == kataId)[0] || null);
    return this.kataList.filter((kata) => kata.id == kataId)[0] || null;
  },
  deleteKata(kataId) {
    if (kataId && !Number.isNaN(kataId)) {
      const kataToKeep = this.kataList.filter((kata) => {
        return kata.id !== kataId;
      });
      console.log(kataToKeep);
      this.kataList = this.updateKataStorage(kataToKeep);
    }
  },
  saveKata(kataData) {
    const kataIndex = this.kataList.findIndex((kata) => {
      return kata.id === kataData.id;
    });
    this.kataList[kataIndex] = kataData;
    this.kataList = this.updateKataStorage(this.kataList);
  },
  saveAllKata() {},
};

export default rootMethods;
