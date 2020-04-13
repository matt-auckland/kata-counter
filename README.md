# kata-counter

Cordova App for recording kata repetitions and goals. It will display how many reps you need to do per week/day to meet your goal.

![Screenshot of the app](./screenshot.jpg)

## Features

- Filter kata by tags
- Display reps needed per day/week to achieve goal
- Displays total reps for all kata ~~(TODO)~~
- Total reps display will respect the current filtered kata ~~(TODO)~~
- Add/remove tags
- Add new kata ~~(TODO)~~
- Edit existing kata
- Pick a goal # of reps
- Pick a goal date ~~(TODO)~~
- Pick a colour, add belt tabs (specify what belt the kata is for)
- Populate app with premade kata lists
- Import/export JSON data ~~(TODO)~~
- Uses local storage to record data (probably moving to proper on device storage eventually)
- Records the date/time of the last counter update ~~(TODO)~~
- Global settings and per kata settings ~~(TODO)~~

## Misc TODOs

- Improve overall design
- ~~Add more belt colours~~

## Development

```bash
# Project setup
yarn install

# Compiles and hot-reloads for development
yarn serve

# Serve to an Android device for development (make sure to plug a phone in)
cordova-serve-android

# Compiles and minifies for production
yarn build

# Build Android APK (to install on Android, you need to sign the APK with Android Studio)
yarn cordova-build-android

# Lints and fixes files
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
