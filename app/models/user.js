const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		nome: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		senha: {
			type: String,
			required: true,
		},
		tipo: {
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
