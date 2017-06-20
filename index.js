import express from 'express';
import alexa from 'alexa-app';
import twilio from 'twilio';


// Config stuff:

const client = new twilio('AC.....', '12...34');

// Phone numbers of attendees (for texting the untappd links on demand)
const PHONE_NUMBERS = [
  `13165555555`,
  `13165554444`
];

// List of the beers!
// Plus any applicable stats, descriptions and pronounciations
const BEERS = [
  {
    name: `空知 Wheat`,
    ssml: `<sub alias="Sorachi">空知</sub> Wheat`,
    description: `A single hop american wheat which uses the Sorachi Ace hop.`,
    prefix: `
      Ok.
      <break time="1s" />
    `,
    abv: `5.4%`,
    ibu: 33,
    link: `https://untappd.com/b/hand-crafted-beer-wheat/1995879`
  },
  {
    name: `Falconer's Pale`,
    description: `An american pale ale brewed with Falconer's Flight hops.`,
    abv: `5.6%`,
    ibu: 42,
    link: `https://untappd.com/b/hand-crafted-beer-falconer-s-pale/1968239`
  },
  {
    name: `Tropical Lawnmower`,
    description: `A summertime wheat.`,
    abv: `5.6%`,
    ibu: 44,
    link: `https://untappd.com/b/hand-crafted-beer-tropical-lawnmower/2081223`
  },
  {
    name: `Rye Cream Ale`,
    description: `
      It's a cream ale.
      <break time="1s" />
      With rye.
    `,
    abv: `6.1%`,
    ibu: 20,
    link: `https://untappd.com/b/hand-crafted-beer-rye-cream-ale/2147877`
  },
  {
    name: `Silo & Oatis`,
    ssml: `Silo and Oatis`,
    description: `An experimental oatmeal wheat.`,
    suffix: `
      <break time="5s" />
      <amazon:effect name="whispered">It's not very good.</amazon:effect>
    `,
    abv: `6.4%`,
    ibu: 50,
    link: `https://untappd.com/b/hand-crafted-beer-silo-and-oatis/2104631`
  },
  {
    name: `Jalapeño Cream Ale`,
    description: `A cream ale aged with roasted jalapeños.`,
    abv: `6.6%`,
    ibu: 29,
    link: `https://untappd.com/b/hand-crafted-beer-jalapeno-cream-ale/1449352`
  },
  {
    name: `Fresh Oaked IPA`,
    ssml: `Fresh Oaked ${IPA}`,
    description: `It's the same recipe, but a younger bottle of our oak aged ${IPA}.`,
    abv: `6.9%`,
    ibu: 67,
    link: `https://untappd.com/b/hand-crafted-beer-oak-aged-ipa/1577550`
  },
  {
    name: `Too Hearted Ale`,
    description: `Or Centennial ${IPA}. It's a clone of Bell's Two Hearted Ale.`,
    abv: `7.1%`,
    ibu: 57,
    link: `https://untappd.com/b/hand-crafted-beer-centennial-ipa/1741168`
  },
  {
    name: `2XAU IPA`,
    ssml: `<sub alias="Double Gold">2XAU</sub> ${IPA}`,
    description: `A hop bursted double ${IPA}.`,
    abv: `7.4%`,
    ibu: 72,
    link: `https://untappd.com/b/hand-crafted-beer-double-gold-ipa/1851051`
  },
  {
    name: `Double Loral IPA`,
    ssml: `Double Loral ${IPA}`,
    description: `A single hop double ${IPA} featuring the 2016 hop release: <break strength="medium" /> <say-as interpret-as="characters">HBC</say-as> 2 91.`,
    abv: `8.2%`,
    ibu: 75,
    link: `https://untappd.com/b/hand-crafted-beer-double-loral-ipa/1907381`
  }
];

let current = 0;


// Helper stuff:

// phonetic pronounciation of IPA
const IPA = `<phoneme alphabet="ipa" ph="ˈaɪ pɪ eɪ">IPA</phoneme>`;

// SSML for saying beer stats
const stats = (beer) =>
  `<p>It is ${beer.abv} and <say-as interpret-as="number">${beer.ibu}</say-as> <say-as interpret-as="characters">IBU</say-as>.</p>`;

const sendLink = (to, beer) =>
  client.messages.create({
    body: `${beer.name}: ${beer.link}`,
    from: '+13165554444', // Change to your Twilio number
    to
  });


// App logic:

const app = express();
const skill = new alexa.app('bartender');

app.set('port', process.env.PORT || 4444);

skill.express({
  expressApp: app,
  checkCert: false,
  debug: true
});

// Alexa, get The Bartender
skill.launch((req, res) => {
  let beer = BEERS[current - 1];
  if(beer)
    res.say(`
      <p>${beer.ssml || beer.name}.</p>
      ${stats(beer)}
    `).shouldEndSession(false);
  else if(current) {
    current = 0;
    res.say(`
      <p>Hi.</p>
      <p>Would you like to restart the tasting?</p>
    `).shouldEndSession(false);
  }
  else
    res.say(`
      <p>Hello.</p>
      <p>Are you ready to start the tasting?</p>
    `).shouldEndSession(false);
});

// Alexa, tell The Bartender to start the tasting
// Alexa, ask The Bartender for the next beer
skill.intent('Next', {}, (req, res) => {
  current++;
  let beer = BEERS[current - 1];
  let count = `<say-as interpret-as="ordinal">${current}</say-as>`;
  if(current === BEERS.length)
    count = `last`;
  if(beer)
    res.say(`
      ${beer.prefix || ''}
      <p>The ${count} beer is ${beer.ssml || beer.name}.</p>
      <p>${beer.description}</p>
      ${stats(beer)}
      ${beer.suffix || ''}
    `);
  else
    res.say(`I'm sorry. There is no more beer.`);
});

// Alexa, ask The Bartender to repeat
skill.intent('Repeat', {}, (req, res) => {
  let beer = BEERS[current - 1];
  res.say(`
    <p>${beer.ssml || beer.name}.</p>
    ${stats(beer)}
  `);
});

// Alexa, ask The Bartender to go back
skill.intent('Back', {}, (req, res) => {
  current--;
  let beer = BEERS[current - 1];
  if(beer)
    res.say(`
      ${beer.prefix || ''}
      <p>The <say-as interpret-as="ordinal">${current}</say-as> beer is ${beer.ssml || beer.name}.</p>
      <p>${beer.description}</p>
      ${stats(beer)}
      ${beer.suffix || ''}
    `);
  else
    res.say(`I cannot go back any further.`);
});

// Alexa, ask The Bartender to send everyone the link
skill.intent('SendLink', {}, (req, res) => {
  let beer = BEERS[current - 1];
  if(beer) {
    Promise.all(
      PHONE_NUMBERS.map(number =>
        sendLink(number, beer)
      )
    );
    res.say('Ok.');
  }
});

app.listen(app.get('port'), () => console.log(`express started on port ${app.get('port')}`));
