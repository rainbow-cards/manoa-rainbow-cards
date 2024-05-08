import { Meteor } from 'meteor/meteor';
import { ProfCards } from '../../api/profcard/ProfCard.js';

Meteor.startup(() => {
  // Create a unique index on the server
  ProfCards.collection.rawCollection().createIndex(
    { name: 1, course: 1, semester: 1 },
    { unique: true },
  );
});
