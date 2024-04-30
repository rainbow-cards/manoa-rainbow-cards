import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import OwnerSchema from './OwnerSchema';

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
      owners: Array(OwnerSchema), // Array of owners, with count attached
      campusEats: String,
      hiddenTalent: String,
    });
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.professorPublicationName = `${this.name}.publication.professor`;
    this.userPublicationName = `${this.name}.publication.user`;
  }
}

/**
 * The singleton instance of the ProfCardsCollection.
 * @type {ProfCardsCollection}
 */
export const ProfCards = new ProfCardsCollection();
