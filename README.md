# Alexa skill for 🍻 Tastings

My wife and I hosted a [beer tasting](https://twitter.com/chadsmith/status/876478375409455105) the other day and threw together a quick Alexa skill to make it a little more entertaining. A few of our guests asked about it, so this is that skill.

## Background

The idea was to have Alexa guide the tasting and provide all the interesting details, which would leave us free to mingle.

For an added _wow_ factor, we loaded the skill with everyone's phone numbers before they arrived, so we could ask Alexa to send everyone each beer's Untappd link.

## Setup

1. Configure the app using your Twilio credentials, guest phone numbers and beer info.

2. Create an [Alexa Skill](https://developer.amazon.com/edw/home.html#/skills) and name it *The Bartender*.

3. Configure the skill using the enclosed [interaction model](https://github.com/chadsmith/alexa-beer-tasting/blob/master/skill.json) and the HTTPS endpoint of your ngrok subdomain: `https://yourdomain.ngrok.io/bartender`.

4. Run the skill locally on your Echo device or test it in the simulator. (There's no need to publish it.)

## Example Interaction

* Alexa, get The Bartender
* Alexa, tell The Bartender to start the tasting
* Alexa, ask The Bartender for the next beer
* Alexa, ask The Bartender to repeat
* Alexa, tell The Bartender to go back
* Alexa, tell The Bartender to send everyone the link
