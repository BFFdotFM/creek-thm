/*

A simple CLI for the Creek Themes API

*/
var fs = require('fs');
var path = require('path');
var watch = require('watch');
var request = require('request');

/*

Get theme files as a new dir (like git clone)
(Creates local copy if it doesn't exist.)

> creek-themes pull cool-theme1

- Gets a zip file of the theme, and unzips it into the current directory.

*/
