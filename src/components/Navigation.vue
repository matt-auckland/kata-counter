<template>
  <div id="nav">
    <router-link
      v-if="$route.name !== 'Home'"
      to="/"
      :class="[ $route.name !== 'Home' && 'active']"
    >
      <i>🛠️</i>
      <div class="route-name">Kata</div>

    </router-link>
    <div
      v-else
      @click="addKata"
    >
      <i>➕</i>
      <div>Add Kata</div>
    </div>

    <router-link
      to="/c"
      :class="[ $route.name !== 'Stats' && 'active']"
    >
      <i>📈</i>
      <div class="route-name">Stats</div>
    </router-link>
    <router-link
      to="/s"
      :class="[ $route.name !== 'Settings' && 'active']"
    >
      <i>🛠️</i>
      <div class="route-name">Settings</div>
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

#nav a {
  text-decoration: none;
}

#nav a.active {
  text-decoration: underline;
}

.route-name {
}
</style>