import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { ProfCards } from '../../api/profcard/ProfCard';

// Public-level publication.
Meteor.publish('cards.public', function () {
  return ProfCards.collection.find({});
});

// Admin-level publication.
// If logged in and with admin role, then publish all documents from all users. Otherwise, publish nothing.
// Meteor.publish(Stuffs.adminPublicationName, function () {
//   if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
//     return Stuffs.collection.find();
//   }
//   return this.ready();
// });

// Professor-level publication.

Meteor.publish(ProfCards.professorPublicationName, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'professor')) {
    const myEmail = Meteor.users.findOne(this.userId).username;
    return ProfCards.collection.find({ email: myEmail });
  }
  return this.ready();
});

Meteor.publish(ProfCards.userPublicationName, function (id) {
  check(id, String);
  if (id) {
    const username = Meteor.users.findOne({ _id: id }).username;
    return ProfCards.collection.find({ owners: { $elemMatch: { name: username } } });
  }
  return this.ready();
});

Meteor.publish(ProfCards.userPublicationNameWish, function () {
  if (this.userId) {
    return ProfCards.collection.find({ wished: { $in: [Meteor.user()?.username] } });
  }
  return this.ready();
});

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});

// Publish the USERNAMES ONLY for all documents in the users database, for Admin-level accounts.
Meteor.publish('allUsernames', function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Meteor.users.find({}, { fields: { username: 1 } });
  }
  return this.ready();
});

// Publish the USERNAMES ONLY for all documents in the users database, for Professor-level accounts.
Meteor.publish('allUsernamesForProfessors', function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'professor')) {
    return Meteor.users.find({}, { fields: { username: 1 } });
  }
  return this.ready();
});

// Publish the IDs ONLY for all documents in the users database, for user-search.
Meteor.publish('allIds', function () {
  if (this.userId) {
    return Meteor.users.find({});
  }
  return this.ready();
});
