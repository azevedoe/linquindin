module.exports = {
	logRegister(req, res, next) {
		console.log(req.url + req.method + new Date());
		next();
	},
	sessionControl(req, res, next) {
		if (req.session.userId) {
			res.locals.userId = req.session.userId;

			console.log(req.session.userId, res.locals.userId)

			res.locals.username = req.session.username;
			res.locals.userAvatar = req.session.avatar;
			res.locals.userEmail = req.session.userEmail;

			if (req.session.type === "admin") {
				res.locals.isAdmin = true;
			} else {
				res.locals.isAdmin = false;
			}

			if (req.url === "/login" && req.method === "GET") {
				return res.redirect("/projects");
			}

			next();
		} else {
			if (req.url.startsWith("/project/") && req.url.endsWith("/show")) {
				return next();
			}

			if (req.url.startsWith("/user/") && req.url.endsWith("/show")) {
				return next();
			}

			if (req.url === "/desenvolvedores" || req.method === "GET") {
				return next();
			}

			if (req.url === "/projetos" || req.method === "GET") {
				return next();
			}

			if (req.url === "/login" || req.url === "/" || req.method === "POST") {
				return next();
			}

			if (req.url === "/sign-up" || req.method === "POST") {
				return next();
			}

			return res.redirect("/login");
		}
	},
};
