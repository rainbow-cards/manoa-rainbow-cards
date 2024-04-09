import { Meteor } from 'meteor/meteor';
import { ProfCards } from '../../api/profcard/ProfCard';

/* eslint-disable no-console */

// Initialize ProfCard database with default data doc
const addProfCards = (data) => {
  console.log(`  Adding: ${data.name}`);
  ProfCards.collection.insert(data);
};

// Initialize the ProfCardsCollection if empty
if (ProfCards.collection.find().count() === 0) {
  if (Meteor.settings.defaultCards) {
    console.log('Creating default data.');
    Meteor.settings.defaultCards.forEach(data => addProfCards(data));
  }
}
