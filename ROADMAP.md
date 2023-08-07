# Roadmap

## Game Story
* reader artifact + log actions
* story

## Game Environment
* reduce action/room size
* Remove empty room (options?)
* add past information to know which actions will be clicked
* Logs color (depending on type (maybe activated with an artifact))
* Allow to create different stories
    * (done) Define ConditionType with extended resources
    * (done) Text in shop
    * (done) resources in shop
    * sound
    * (done) Game achievement
    * (done) Allow to choose another story
    * (done) dashboard
    * Create another story to assert it works :)
    * Add a back to story choice button


## Code structure
* save current state to restore it at next connection
* user settings (localstorage, collapsed require)
* svelte store helpers → update Array store
* web app

## external
* Fix svelte-i18n for Bigint

## Bugs

* room position
    * sometimes it does not compute correct size (kitchen, when action is done)
