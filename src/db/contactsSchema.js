const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { versionKey: false }
);

const Contact = mongoose.model("contacts", contactsSchema);

module.exports = Contact;
