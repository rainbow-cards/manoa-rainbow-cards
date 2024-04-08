import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/Stuff.js';
import { ProfCards } from '../../api/profcard/ProfCard';

/* eslint-disable no-console */

// Initialize the database with a default data document.
const addData = (data) => {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.collection.insert(data);
};

// Initialize ProfCards database with default data doc
const addProfCards = (data) => {
  console.log(`  Adding: ${data.name}`);
  ProfCards.collection.insert(data);
};

// Initialize the StuffsCollection if empty.
if (Stuffs.collection.find().count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.forEach(data => addData(data));
  }
}

// Initialize the ProfCardsCollection if empty
if (ProfCards.collection.find().count() === 0) {
  if (Meteor.settings.defaultCards) {
    console.log('Creating default data.');
    Meteor.settings.defaultCards.forEach(data => addProfCards(data));
  }
}
