const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			required: false,
		},
		type: {
			type: String,
			enum: ["aluno", "admin"],
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
