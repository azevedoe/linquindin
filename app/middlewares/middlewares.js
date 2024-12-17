module.exports = {
	logRegister(req, res, next) {
		console.log(req.url + req.method + new Date());
		next();
	},
	sessionControl(req, res, next) {
		console.log(req.session.login, res.locals.login, req.session.tipo, res.locals.admin, req.url, req.method)
		
		if (req.session.login !== undefined) {
			res.locals.login = req.session.login;
			if (req.session.tipo === 2) {
				res.locals.admin = true;
			}
			next();
		} else if (req.url === "/dashboard" && req.method === "GET") next();
		else if (req.url === "/login" && req.method === "POST") next();
		else res.redirect("/");
	},
};
