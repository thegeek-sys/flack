# Flack

A live-time webchat using Python and Javascript inspired by Slack. It is a simple webchat that organized conversations in dedicated channels.

![](./public/presentation.mp4)

## Functionalities

When a user specifies a username, it is then stored in `localStorage` so user doesn't have to specify his or her username again after closing the browser. In the same way, current channel name that user joined last time is also stored in `localStorage`.

Due to the project being just a small personal challenge, I decided to just keep the messages in an array related to the room they are sent (instad of using a database). The oldest ones are removed.

Poject saves timestamps in Unix format and JS code converts them into local time and uses `Locale` browser information to display time and date according to the user's country. 

According to CS50 requirements, I added the feature to delete the messages you sent across all the connected clients.

## Files
- `application.py`: Python backend of the project
- `static`: directory with JS files.
  - `index.js`: main JS file for the project.
- `templates`: directory containing Flask templates files.
  - `home.html`: for this project I used just one page that updates each time an action is done

## Environment variables
The application can take four optional environment variables:
  - `SECRET_KEY`. Secret key that Flask uses for encryption.
 application startup.

