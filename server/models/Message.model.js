/// <reference path="models.helper.ts"/>
const mongoose = require('mongoose');

/** @type {mongoose.Schema<Message, mongoose.Model<Message,Message,Message,Message>, Message>} */
const messageSchema = new mongoose.Schema({
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: true
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    time: {
      type: Date,
      default: Date.now()
    }

  }, {
    timestamps: true
  }]
});


module.export = mongoose.Schema("Message", messageSchema);