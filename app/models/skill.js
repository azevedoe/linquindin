const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	users: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User", 
			},
			level: {
				type: Number,
				min: 0,
				max: 10,
			},
		},
	],
});

const Skill = mongoose.model("Skill", SkillSchema);

module.exports = Skill;
