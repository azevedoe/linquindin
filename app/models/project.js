const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
	{
		nome: {
			type: String,
			required: true,
		},
		resumo: {
			type: String,
			required: true,
		},
		link: {
			type: String,
			required: true,
		},
		desenvolvedores: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User", 
			},
		],
		palavrasChave: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Keyword", 
			},
		],
	},
	{
		timestamps: true,
	},
);

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
