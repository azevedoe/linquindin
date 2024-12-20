const bcrypt = require("bcrypt");
const User = require("../models/user");
// const db = require("../database/connection");

module.exports = {
	async getSignup(req, res) {
		res.render("auth/sign-up", { layout: "auth.handlebars" });
	},

	async getLogin(req, res) {
		res.render("auth/login", { layout: "auth.handlebars" });
	},

	async getAll(req, res) {
		try {
			const users = await User.find();

			res.render("users/user-list", {
				title: "Usuários",
				active: "users",
				users,
				layout: "painel.handlebars",
			});
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao buscar usuários.");
		}
	},

	async postLogin(req, res) {
		try {
			const { email, password } = req.body;

			const user = await User.findOne({ email });
			
			if (!user) {
				return res
					.status(401)
					.render("auth/login", { error: "E-mail ou senha incorretos." });
			}

			const passwordValida = await bcrypt.compare(password, user.password);
			if (!passwordValida) {
				return res
					.status(401)
					.render("auth/login", { error: "E-mail ou senha incorretos." });
			}

			req.session.userId = user._id;
			req.session.email = user.email;
			req.session.type = user.type;

			if (user.type === "admin") {
				req.session.isAdmin = true;
			}

			res.redirect("/projects");
		} catch (error) {
			console.error("Erro no login:", error);
			res
				.status(500)
				.render("auth/login", {
					layout: "auth.handlebars",
					error: "Ocorreu um erro no servidor. Tente novamente.",
				});
		}
	},

	async getLogout(req, res) {
		req.session.destroy((err) => {
			if (err) {
				console.error("Erro ao encerrar sessão:", err);
			}
			res.redirect("/login");
		});
	},

	async postCreate(req, res) {
		try {
			const { name, email, password } = req.body;

			const hashedPassword = await bcrypt.hash(password, 10);

			await User.create({
				name,
				email,
				password: hashedPassword,
				type: "aluno",
			});

			res.redirect("/login");
		} catch (error) {
			console.error("Erro ao criar usuário:", error);
			res.status(500).send("Erro ao criar usuário.");
		}
	},

	async deleteUser(req, res) {
		try {
			const { id } = req.params;
			const deletedUser = await Users.findByIdAndDelete(id);

			if (!deletedUser) {
				return res.status(404).send("Usuário não encontrado.");
			}

			res.redirect("/users");
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao deletar o usuário.");
		}
	},
};
