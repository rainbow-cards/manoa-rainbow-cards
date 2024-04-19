import { Meteor } from 'meteor/meteor';
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
    return ProfCards.collection.find();
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

// Publish the USERNAMES ONLY for all documents in the users database.
Meteor.publish('allUsernames', function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Meteor.users.find({}, { fields: { username: 1 } });
  }
  return this.ready();
});
