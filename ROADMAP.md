# Roadmap

## Game Story
* reader artifact + log actions
* story

## Game Environment
* reduce action/room size
* Remove empty room (options?)
* add past information to know which actions will be clicked
* music
* Logs color (depending on type (maybe activated with an artifact))

## Code structure
* save current state to restore it at next connection
* user settings (music, localstorage, collapsed require)
* svelte store helpers → update Array store

## Bugs

* room position
    * sometimes it does not compute correct size (kitchen, when action is done)
