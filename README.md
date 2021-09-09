# Project 2

Web Programming with Python and JavaScript

My project is a live-time webchat.

When a user specifies a username, it is then stored in localStorage. Because of that user doesn't have to specify his or her username again after closing the browser. In the same way, current channel name that user joined last time is also stored in localStorage.

When the lenght of the room array is equals to 100, oldest message is "popped".

Poject saves timestamps in Unix format and JS code converts them into local time and uses `Locale` browser information to display time and date according to the user's country. 

According to CS50 requirements (personal touch) I have added the feature that you can delete your own messages for everyone.

## Main file of the project
Main file of the project is `application.py`.

## Environment variables
The application can take four optional environment variables:
  - `SECRET_KEY`. Secret key that Flask uses for encryption.
 application startup.

## Main directories and files
  - `static`. Directory with JS files.
    - `index.js`. The JS file for the project.
  - `templates`. This directory contains Flask templates files.
    - `home.html`. The only page for all the project.

The project's video: https://youtu.be/Xp7jWXF80mw
