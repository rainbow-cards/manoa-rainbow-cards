import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ProfCards } from '../../api/profcard/ProfCard';

Meteor.methods({
  'profCards.isFavorited'(profCardId, ownerId) {
    console.log('Checking favorite status of card');
    check(profCardId, String);
    check(ownerId, String);

    const profCard = ProfCards.collection.findOne(profCardId);
    return profCard.owners.some(owner => owner._id === ownerId && owner.favorited);
  },
  'profCards.favorite'(profCardId, ownerId) {
    console.log('Executing favorite method');
    check(profCardId, String);
    check(ownerId, String);

    // Update the document in the ProfCards collection
    try {
      ProfCards.collection.update(
        { _id: profCardId, 'owners._id': ownerId },
        {
          $set: { 'owners.$.favorited': true },
          $setOnInsert: { 'owners.$.name': Meteor.users.findOne(ownerId)?.username }, // Add the name field
        },
      );
    } catch (e) {
      console.error(e);
    }
  },
  'profCards.unfavorite'(profCardId, ownerId) {
    console.log('Executing unfavorite method');
    check(profCardId, String);
    check(ownerId, String);

    // Update the favorited attribute to false for the specified owner
    ProfCards.collection.update(
      { _id: profCardId, 'owners._id': ownerId },
      { $set: { 'owners.$.favorited': false } },
    );
  },
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
