const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, required: true, minLength: 1, maxLength: 50 },
    message: { type: String, required: true, minLength: 1, maxLength: 200 },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postTime: { type: Date, default: Date.now }
});

PostSchema.virtual("postTimeFormatted").get(function() {
    return this.postTime.toLocaleString('en-US', {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })
});

module.exports = mongoose.model("Post", PostSchema);