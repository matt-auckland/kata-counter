<template>
  <div id="nav">
    <router-link to="/">
      <i>🛠️</i>
      <div>Kata</div>
    </router-link>

    <router-link to="/c">
      <i>🛠️</i>
      <div>Stats</div>
    </router-link>
    <router-link to="/s">
      <i>🛠️</i>
      <div>Settings</div>
    </router-link>
  </div>
</template>

<style scoped>
#nav {
  width: 100%;
  border-top: 1px #ccc solid;
  height: var(--nav-height);

  position: fixed;
  bottom: 0;

  background: white;
  z-index: 10;

  display: flex;
  justify-content: space-between;

  /* padding: 0 5px; */
}

#nav > * {
  padding: 10px 5px;
  text-align: center;
  width: 100%;
}
</style>