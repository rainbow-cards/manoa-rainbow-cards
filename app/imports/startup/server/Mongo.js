import { Meteor } from 'meteor/meteor';
import { ProfCards } from '../../api/profcard/ProfCard';

/* eslint-disable no-console */

// Initialize the database with a default data document.
const addData = (data) => {
  console.log(`  Adding: ${data.name} `);
  ProfCards.collection.insert(data);
};

// Initialize the StuffsCollection if empty.
if (ProfCards.collection.find().count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.forEach(data => addData(data));
  }
}
