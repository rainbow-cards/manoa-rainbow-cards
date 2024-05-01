import { Meteor } from 'meteor/meteor';
import { ProfCards } from '/path/to/ProfCards.js'; // Replace '/path/to/ProfCards.js' with the correct path

Meteor.startup(() => {
  // Create a unique index on the server
  ProfCards.collection.rawCollection().createIndex(
    { name: 1, course: 1, semester: 1 },
    { unique: true },
  );
});
