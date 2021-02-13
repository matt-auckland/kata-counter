# kata-counter

A Cordova App for recording Karate Kata repetitions and goals. It displays how many reps you need to do per week/day to meet your goals.

<img src="./screenshot.png" width="400px" alt="Screenshot of app">

## Other features

- Add/remove tags to Kata
- Filter Kata by tags
- Displays total reps for all kata (respects filters)
- Import/export JSON data
- Pick a colour
- Populate app with premade kata lists
- Uses local storage to record data (probably moving to proper on-device storage eventually)
- Records the date/time of the last counter update
- Global settings and per kata settings

## Todo

- Finish redesign
- Add graphs!
- Enable deletion of increments

- Get editing of kata working
- Get import/export of JSON data working
- Get tags for kata working
- Allow kata reps to be deleted from history
  - Allow editing of reps (#, date, etc) eventually
- Get adding a new kata working
- Get settings editing working
- Add setting around whether to show weeks/days or if the app show pick which to display
- Get Kata reordering working properly

## Development

```bash
# Project setup
yarn install
# Or just use NPM

# Compiles and hot-reloads for development
yarn serve

# Serve to an Android device for development (make sure to plug a phone in)
yarn cordova-serve-android

# Compiles and minifies for production
yarn build

# Build Android APK (to install on Android, you need to sign the APK with Android Studio)
yarn cordova-build-android
```
