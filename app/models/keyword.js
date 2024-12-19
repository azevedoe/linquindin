const mongoose = require("mongoose");

const KeywordSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
});

const Keyword = mongoose.model("Keyword", KeywordSchema);

module.exports = Keyword;
