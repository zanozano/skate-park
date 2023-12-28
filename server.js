const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const expressFileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./src/routes/viewRoutes');

const config = require('./config');
const PORT = config.port;

app.listen(PORT, () => {
	console.log(`Server is running on Port ${PORT}`);
});

const jwt = require('jsonwebtoken');
const secretKey = config.secretKey;

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
				return localStorage.getItem('authToken') !== null;
			},
		},
	})
);

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'handlebars');

app.use('/', userRoutes);

//*
app.get('/users', async (req, res) => {
	const data = await getUsers();
	res.send(data);
});

app.post('/usuario', async (req, res) => {

	const { email, nombre, password, anhos, especialidad, nombre_foto } = req.body;

	try {
		const respuesta = await postUser(
			email,
			nombre,
			password,
			anhos,
			especialidad,
			nombre_foto
		);
		res.status(201).send(respuesta);
	} catch (e) {
		res.status(500).send({
			error: `Something went wrong... ${e}`,
			code: 500,
		});
	}
});

// post upload photo
app.post('/register_user', async (req, res) => {

	const { email, nombre, password, password_2, anhos, especialidad } = req.body;
	const { foto } = req.files;
	const { name } = foto;

	if (password !== password_2) {
		res.status(400).json({ success: false, message: 'Passwords do not match' });
	} else {
		try {
			const respuesta = await postUser(
				email,
				nombre,
				password,
				anhos,
				especialidad,
				name
			).then(() => {
				foto.mv(`${__dirname}/public/uploads/${name}`, (err) => {
					console.log(respuesta)
					res.status(200).json({ success: true, message: 'Registration successful' });
				});
			});
		} catch (e) {
			res.status(500).json({ success: false, message: `Something went wrong... ${e}` });
		}
	}
});

// put update users
app.put('/update_user', async (req, res) => {
	//body parser update
	const { id, estado } = req.body;

	try {
		const usuario = await putStatusUser(id, estado);
		res.status(200).send(usuario);
	} catch (e) {
		res.status(500).send({
			error: `Something went wrong... ${e}`,
			code: 500,
		});
	}
});

// LOGIN HANDLEBARS
// post login verify account
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
			if (user[0].estado === true) {
				const token = jwt.sign(
					{
						exp: Math.floor(Date.now() / 1000) + 180,
						data: user,
					},
					secretKey
				);
				res.send(token);
			} else {
				// not approved
				res.status(401).send({
					error: 'The registration for this user has not been approved',
					code: 401,
				});
			}
		} else {
			// not registered
			res.status(404).send({
				error: 'This user is not registered, or the password is incorrect',
				code: 404,
			});
		}
	}
});

// get datos
app.get('/profile', (req, res) => {
	const { token } = req.query;
	jwt.verify(token, secretKey, (err, decoded) => {
		const { data } = decoded;

		const email = data[0].email;
		const nombre = data[0].nombre;
		const password = data[0].password;
		const anos_experiencia = data[0].anos_experiencia;
		const especialidad = data[0].especialidad;

		err
			? res.status(401).send({
				error: '401 Unauthorized',
				message: 'You are not authorized to be here',
				token_error: err.message,
			})
			: res.render('datos', {
				email,
				nombre,
				password,
				anos_experiencia,
				especialidad,
			});
	});
});

// DATOS.HANDLEBARS
// get data users
app.get('/user_profiles', async (req, res) => {
	const respuesta = await getUsers();
	res.send(respuesta);
});

// put update data user
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

// delete data user
app.delete('/delete_account/:email', async (req, res) => {
	try {
		const { email } = req.params;
		const respuesta = await deleteUser(email);
		res.sendStatus(200).send(respuesta);
	} catch (e) {
		res.status(500).send({
			error: `Something went wrong... ${e}`,
			code: 500,
		});
	}
});
