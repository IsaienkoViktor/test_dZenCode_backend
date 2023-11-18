const { Schema, model } = require("mongoose");
const xss = require("xss");

const { handleMongooseError } = require("../helpers");
const { allowedTags } = require("../utils/regexp");

const replySchema = new Schema(
  {
    reply: {
      type: String,
      validate: {
        validator: function (v) {
          const sanitizedText = xss(v, { whiteList: allowedTags });
          return sanitizedText === v;
        },
        message: (props) => `${props.value} contains disallowed HTML tags!`,
      },
    },
    mainComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { versionKey: false, timestamps: true }
);

replySchema.post("save", handleMongooseError);

const Reply = model("reply", replySchema);

module.exports = Reply;
