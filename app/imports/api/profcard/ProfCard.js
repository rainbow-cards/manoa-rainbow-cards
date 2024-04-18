import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/**
 * The ProfCardsCollection. It encapsulates state and variable values for profcard.
 */
class ProfCardsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'ProfCardsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      name: String,
      course: String,
      semester: String,
      department: String,
      email: String,
      image: String,
      facts: String,
      owner: String,
      campusEats: String,
      hiddenTalent: String,
    });
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.professorPublicationName = `${this.name}.publication.admin`;
  }
}

/**
 * The singleton instance of the ProfCardsCollection.
 * @type {ProfCardsCollection}
 */
export const ProfCards = new ProfCardsCollection();
