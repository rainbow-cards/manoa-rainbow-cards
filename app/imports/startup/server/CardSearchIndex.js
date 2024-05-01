import { Meteor } from 'meteor/meteor';
<<<<<<< Updated upstream
import { ProfCards } from '/path/to/ProfCards.js'; // Replace '/path/to/ProfCards.js' with the correct path
=======
import { ProfCard } from '../api/profcard/ProfCard.js';
>>>>>>> Stashed changes

Meteor.startup(() => {
  // Create a unique index on the server
  ProfCard.collection.rawCollection().createIndex(
    { name: 1, course: 1, semester: 1 },
    { unique: true },
  );
});
