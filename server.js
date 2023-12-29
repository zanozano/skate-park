const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const expressFileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./src/routes/viewRoutes');
const session = require('express-session');

const config = require('./config');
const PORT = config.port;

app.listen(PORT, () => {
	console.log(`Server is running on Port ${PORT}`);
});

const jwt = require('jsonwebtoken');
const secretKey = config.secretKey;

app.use(
	session({
		secret: secretKey,
		resave: false,
		saveUninitialized: true,
	})
);

const isAuthenticated = (req, res, next) => {
	if (req.session && req.session.user) {
		res.locals.isAuthenticated = true;
	} else {
		res.locals.isAuthenticated = false;
	}
	next();
};

app.use(isAuthenticated);

const { getUsers,
	postUser,
	putStatusUser,
	getLogin,
	putUser,
	deleteUser,
} = require('./src/services/request');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
	expressFileUpload({
		limits: 5000000,
		abortOnLimit: true,
		responseOnLimit: 'The image size exceeds the allowed limit',
	})
);

app.engine(
	'handlebars',
	engine({
		defaultLayout: 'main',
		layoutsDir: path.join(__dirname, 'src/views/layouts'),
		partialsDir: path.join(__dirname, 'src/views/partials'),
		helpers: {
			isAuthenticated: function () {
				return !!req.session.user;
			},
		},
	})
);

app.set('view engine', 'handlebars');

app.set('views', path.join(__dirname, 'src/views'));

app.use('/', userRoutes);

//OK
app.get('/users', async (req, res) => {
	const data = await getUsers();
	res.send(data);
});

//OK
app.post('/register_user', async (req, res) => {
	const { email, nombre, password, password_2, anhos, especialidad } = req.body;
	const { foto } = req.files;
	const { name } = foto;

	if (password !== password_2) {
		res.status(400).json({ success: false, message: 'Passwords do not match' });
	} else {
		try {
			const newUser = await postUser(
				email,
				nombre,
				password,
				anhos,
				especialidad,
				name
			);

			if (newUser) {
				foto.mv(`${__dirname}/public/uploads/${name}`, (err) => {
					if (err) {
						console.error('Error moving file:', err);
						res.status(500).json({ success: false, message: 'Error moving file' });
					} else {
						console.log('INSERT NEW USER', newUser);
						res.status(200).json({ success: true, message: 'Registration successful' });
					}
				});
			} else {
				res.status(500).json({ success: false, message: 'Error inserting user' });
			}
		} catch (error) {
			console.error('Error in route handler:', error);
			res.status(500).json({ success: false, message: `Something went wrong... ${error.message}` });
		}
	}
});

//OK
app.put('/approve_user', async (req, res) => {
	const { id, estado } = req.body;
	try {
		const approveUser = await putStatusUser(id, estado);
		res.status(200).send(approveUser);
	} catch (error) {
		res.status(500).send({
			error: `Something went wrong... ${error}`,
			code: 500,
		});
	}
});

//OK
app.post('/verify', async (req, res) => {
	const { email, password } = req.body;
	const user = await getLogin(email, password);
	if (email === '' || password === '') {
		res.status(401).send({
			error: 'Please fill out all the fields',
			code: 401,
		});
	} else {
		if (user.length != 0) {
			if (user.estado === true) {
				req.session.user = user;
				const token = jwt.sign(
					{
						exp: Math.floor(Date.now() / 1000) + 180,
						data: user,
					},
					secretKey
				);
				res.send(token);
			} else {
				res.status(401).send({
					error: 'The registration for this user has not been approved',
					code: 401,
				});
			}
		} else {
			res.status(404).send({
				error: 'This user is not registered, or the password is incorrect',
				code: 404,
			});
		}
	}
});

//OK
app.get('/user_profile', (req, res) => {
	const { token } = req.query;
	jwt.verify(token, secretKey, (err, decoded) => {
		if (err) {
			if (err.name === 'TokenExpiredError') {
				return res.redirect('/signin');
			}
			return res.status(401).render('error', { error: err.message });
		}

		const { data } = decoded;
		const { email, nombre, anos_experiencia, especialidad } = data[0];
		res.render('Profile', { email, nombre, anos_experiencia, especialidad });
	});
});


app.put('/update_user_profile', async (req, res) => {
	const { email, nombre, password, anhos, especialidad } = req.body;

	try {
		const usuario = await putUser(email, nombre, password, anhos, especialidad);
		res.status(200).send(usuario);
	} catch (e) {
		res.status(500).send({
			error: `Something went wrong... ${e}`,
			code: 500,
		});
	}
});


app.delete('/delete_account/:email', async (req, res) => {
	try {
		const { email } = req.params;
		const deleteAccount = await deleteUser(email);
		res.sendStatus(200).send(deleteAccount);
	} catch (error) {
		res.status(500).send({
			error: `Something went wrong... ${error}`,
			code: 500,
		});
	}
});

//OK
app.post('/signout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.error('Failed to destroy session:', err);
			res.status(500).send('Internal Server Error');
		} else {
			res.sendStatus(200);
		}
	});
});
