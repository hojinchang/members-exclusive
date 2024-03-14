const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true, minLength: 1, maxLength: 20 },
    lastName: { type: String, required: true, minLength: 1, maxLength: 20 },
    username: { type: String, required: true, minLength: 1, maxLength: 50 },
    password: { type: String, required: true, minLength: 1 }
});

UserSchema.virtual("fullName").get(function() {
    let fullName = "";
    if (this.firstName && this.lastName) {
        fullName = `${this.firstName} ${this.lastName}`;
    }

    return fullName;
});

module.exports = mongoose.model("User", UserSchema);