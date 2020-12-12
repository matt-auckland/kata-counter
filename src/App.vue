<template>
  <div id="app">
    <App-Header />
    <div id="view">
      <transition name="slide">
        <router-view />
      </transition>
    </div>
    <Navigation />
  </div>
</template>

<script>
import Navigation from "./components/Navigation";
import AppHeader from "./components/App-Header";

export default {
  components: { Navigation, AppHeader },
};
</script>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

#app {
  height: 100vh;
}

#view {
  padding: 10px;
  height: 100vh;
}

#view > * {
  margin-bottom: calc(var(--nav-height) + 10px);
}

:root {
  --nav-height: 60px;

  --modal-zindex: 10;

  /* COLOURS */
  --background-color: #221e33;
  --base-font-colour: #282828;
  --base-red: #ff4848;
  --blue: #3e81ea;
  --dark-blue: #215bb7;
  --yellow: #fffb00;
  --dark-yellow: #d8d50b;
  --green: #34bd29;
  --dark-green: #1e8616;
  --brown: #522c1d;
  --dark-brown: #8c6315;
  --black: #000;

  --new-purple: #37114f;
  --new-red: #e8112d;
  --new-orange: #f28411;
  --new-brown: #9e6b05;
  --new-yellow: #f9e526;
  --new-blue: #0051ba;
  --new-green: #009e49;
  --new-black: #111111;
  --new-white: #fff;
  --new-grey: #686663;

  --material-red: #d50000;
  --material-blue: #1565c0;
  --material-purple: #6a1b9a;
  --material-yellow: #ffeb3b;
  --material-orange: #f57f17;
  --material-brown: #3e2723;
  --material-green: #1b5e20;

  --red: var(--material-red);
  --blue: var(--material-blue);
  --purple: var(--material-purple);
  --yellow: var(--material-yellow);
  --orange: var(--material-orange);
  /* --brown: var(--material-brown); */
  --green: var(--material-green);
}

body {
  color: var(--base-font-colour);
  /* background: var(--background-color); */
  background: linear-gradient(
    30deg,
    hsl(193.3, 8.4%, 79%) 40%,
    hsl(193.3, 8.4%, 30%)
  );
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

#app {
  min-height: 100vh;
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.counter-cont {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.card {
  margin: 7.5px;
}

#options-icon {
  cursor: pointer;
  font-size: 32px;
  flex: 1 33%;
  text-align: left;
}

#filter-dropdown {
  font-size: 18px;
  flex: 2 33%;
  text-align: center;
}

#total-reps {
  flex: 1 33%;
  text-align: right;
}

.header h1 {
  margin: 0;
}

textarea {
  width: 100%;
  border-radius: 6px;
  border: 1px solid #ccc;
  padding: 8px;
  font-size: 14px;
  line-height: 16px;
}

form {
  display: flex;
  flex-direction: column;
  max-width: 320px;
  margin: auto;
}

form > * {
  margin: 8px 0;
}

input {
  border-radius: 6px;
  border: 1px solid #ccc;
  padding: 3px 6px;
}

.flex-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-col-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.template-kata-container {
  overflow-y: scroll;
  max-height: 320px;
  padding-right: 16px;
  display: block;
  text-align: left;
}

.error-text {
  color: red;
}

.setup-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.setup-buttons > * {
  margin: 5px;
}

/* Modal */
.slide-up-modal {
  height: 100vh;
  width: 100vw;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: var(--modal-zindex);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  overflow: hidden;
}

.modal-wrapper-enter,
.modal-wrapper-leave-to {
  opacity: 0;
}

.slide-up-modal-body {
  position: relative;
  background: white;
  color: #333;
  border-radius: 30px 30px 0 0;
  min-height: 50%;
  max-width: 460px;
  width: 100%;
  padding: 10px 20px;
}

.slide-up-modal-body .close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 30px;
  border: none;
  background: none;
  cursor: pointer;
  transform: rotate(45deg);
}

.modal-transition-enter-active {
  transform: translateY(0);
}

.modal-transition-leave-active,
.modal-transition-enter-active {
  transition: 200ms;
}

.modal-transition-leave-active {
  transform: translateY(100%);
}

.modal-transition-enter,
.modal-transition-leave-to {
  transform: translateY(100%);
}
</style>