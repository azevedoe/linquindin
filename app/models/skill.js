const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
	nome: {
		type: String,
		required: true,
		unique: true,
	},
	alunos: [
		{
			aluno: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User", 
			},
			nivel: {
				type: Number,
				min: 0,
				max: 10,
			},
		},
	],
});

const Skill = mongoose.model("Skill", SkillSchema);

module.exports = Skill;
