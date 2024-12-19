const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		subtitle: {
			type: String,
			required: true,
		},
		link: {
			type: String,
			required: true,
		},
		developers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User", 
			},
		],
		keywords: [
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
