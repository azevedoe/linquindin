const db = require("../database/connection");
const path = require("node:path");

module.exports = {
	async getLogin(req, res) {
		res.render("auth/login", { layout: "auth.handlebars" });
	},
	async getLogout(req, res) {
		req.session.destroy();
		res.redirect("/");
	},
	async postLogin(req, res) {
		const user = {
			login: req.body.login,
		};
		db.Usuario.findAll({
			where: { login: req.body.login, senha: req.body.senha },
		})
			.then((usuarios) => {
				if (usuarios.length > 0) {
					//res.cookie("userData", user, { maxAge:30 * 60 * 1000, httpOnly: true });
					req.session.login = req.body.login;
					res.locals.login = req.body.login;
					if (usuarios[0].dataValues.tipo === 2) {
						req.session.tipo = usuarios[0].dataValues.tipo;
						res.locals.admin = true;
					}
					res.render("home");
				} else res.redirect("/");
			})
			.catch((err) => {
				console.log(err);
			});
	},
	// async getCreate(req, res) {
	// 	const cidades = await db.Cidade.findAll();
	// 	res.render("user/user-create", {
	// 		cidades: cidades.map((cidade) => cidade.toJSON()),
	// 	});
	// },
	async postCreate(req, res) {
		db.Usuario.create(req.body)
			.then(() => {
				res.redirect("/home");
			})
			.catch((err) => {
				console.log(err);
			});
	},
	async getList(req, res) {
		db.Usuario.findAll()
			.then((usuarios) => {
				res.render("user/user-list", {
					usuarios: usuarios.map((user) => user.toJSON()),
				});
			})
			.catch((err) => {
				console.log(err);
			});
	},
	// async getUpdate(req, res) {
	// 	const cidades = await db.Cidade.findAll();
	// 	await db.Usuario.findByPk(req.params.id)
	// 		.then((usuario) =>
	// 			res.render("user/user-cpdate", {
	// 				usuario: usuario.dataValues,
	// 				cidades: cidades.map((city) => city.toJSON()),
	// 			}),
	// 		)
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// },
	async postUpdate(req, res) {
		await db.Usuario.update(req.body, { where: { id: req.body.id } })
			.then(res.render("home"))
			.catch((err) => {
				console.log(err);
			});
	},
	async getDelete(req, res) {
		await db.Usuario.destroy({ where: { id: req.params.id } })
			.then(res.render("home"))
			.catch((err) => {
				console.log(err);
			});
	},
};
