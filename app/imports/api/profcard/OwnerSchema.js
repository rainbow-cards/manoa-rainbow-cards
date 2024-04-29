import SimpleSchema from 'simpl-schema';

/**
 * The OwnerSchema. This schema defines the object used to store the owners of a given card.
 */

const OwnerSchema = new SimpleSchema({
  name: {
    type: String,
  },
  count: {
    type: Number,
    defaultValue: 0,
  },
});

export default OwnerSchema;
