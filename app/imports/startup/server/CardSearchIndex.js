import { Meteor } from 'meteor/meteor';
import { ProfCard } from '../api/profcard/ProfCard.js';

Meteor.startup(() => {
  // Create a unique index on the server
  ProfCard.collection.rawCollection().createIndex(
    { name: 1, course: 1, semester: 1 },
    { unique: true },
  );
});
