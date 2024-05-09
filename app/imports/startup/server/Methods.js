import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ProfCards } from '../../api/profcard/ProfCard';

Meteor.methods({
  'profCards.updateOwnerCount': function (cardId, userName) {
    check(cardId, String);
    check(userName, String);

    const card = ProfCards.collection.findOne(cardId);
    if (!card) {
      throw new Meteor.Error('card-not-found', 'Selected card not found in the database.');
    }

    const ownerIndex = card.owners.findIndex(owner => owner.name === userName);
    if (ownerIndex === -1) {
      // If the user is not already an owner, add them to the owners array
      ProfCards.collection.update(cardId, {
        $addToSet: { owners: { name: userName, count: 1 } },
      });
    } else {
      // If the user is already an owner, increment their count
      ProfCards.collection.update({
        _id: cardId,
        'owners.name': userName,
      }, {
        $inc: { [`owners.${ownerIndex}.count`]: 1 },
      });
    }
  },
});
