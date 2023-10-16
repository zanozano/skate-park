// dependencies
const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const expressFileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');

// token cofig
const jwt = require('jsonwebtoken');
const secretKey = 'Clave secreta';

// import
const {
	consultarUsuarios,
	nuevoUsuario,
	setUsuarioStatus,
	conseguirUsuario,
	setDatosUsuario,
	eliminarCuenta,
} = require('./src/services/request');

// server
app.listen(3000, () => {
	console.log('Server on in Port 3000');
});

// static //
// public
app.use(express.static(__dirname + '/public'));

// css
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

// body-parser
app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);
app.use(bodyParser.json());

// file size config
app.use(
	expressFileUpload({
		limits: 5000000,
		abortOnLimit: true,
		responseOnLimit: 'El tamaño de la imagen supera el limite permitido',
	})
);

// handlebars
app.engine(
	'handlebars',
	engine({
		defaultLayout: 'main',
		layoutsDir: `${__dirname}/src/views/mainLayout`,
	})
);

// engine handlebars
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'handlebars');


// views
// get home
app.get('/', function (req, res) {
	res.render('Home');
});

// get login
app.get('/login', function (req, res) {
	res.render('Login');
});

// get registro
app.get('/registro', function (req, res) {
	res.render('Registro');
});

// get administracion
app.get('/admin', async (req, res) => {
	try {
		const usuarios = await consultarUsuarios();
		res.render('Admin', {
			usuarios,
		});
	} catch (e) {
		res.status(500).send({
			error: `Algo salió mal... ${e}`,
			code: 500,
		});
	}
});

// get usuarios
app.get('/usuarios', async (req, res) => {
	const respuesta = await consultarUsuarios();
	res.send(respuesta);
});

// post usuarios
app.post('/usuario', async (req, res) => {
	// body parse
	const { email, nombre, password, anhos, especialidad, nombre_foto } = req.body;

	try {
		const respuesta = await nuevoUsuario(
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
			error: `Algo salió mal... ${e}`,
			code: 500,
		});
	}
});

// post upload photo
app.post('/registrar', async (req, res) => {
	// body content
	const { email, nombre, password, password_2, anhos, especialidad } = req.body;
	const { foto } = req.files;
	const { name } = foto;

	// validate same password
	if (password !== password_2) {
		// alert
		res.send(
			'<script script> alert("Las contraseñas no coinciden."); window.location.href = "/registro"; </script>'
		);
	} else {
		try {
			const respuesta = await nuevoUsuario(
				email,
				nombre,
				password,
				anhos,
				especialidad,
				name
			).then(() => {
				foto.mv(`${__dirname}/public/uploads/${name}`, (err) => {
					console.log(respuesta);
					res.send(
						'<script>alert("Se ha registrado con éxito."); window.location.href = "/login"; </script>'
					);
				});
			});
		} catch (e) {
			res.status(500).send({
				error: `Algo salió mal... ${e}`,
				code: 500,
			});
		}
	}
});

// put update users
app.put('/usuarios', async (req, res) => {
	//body parser update
	const { id, estado } = req.body;

	try {
		const usuario = await setUsuarioStatus(id, estado);
		res.status(200).send(usuario);
	} catch (e) {
		res.status(500).send({
			error: `Algo salió mal... ${e}`,
			code: 500,
		});
	}
});

// LOGIN HANDLEBARS
// post login verify account
app.post('/verify', async (req, res) => {
	const { email, password } = req.body;
	const user = await conseguirUsuario(email, password);

	if (email === '' || password === '') {
		res.status(401).send({
			error: 'Debe llenar todos los campos',
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
					error: 'El registro de este usuario no ha sido aprobado',
					code: 401,
				});
			}
		} else {
			// not registered
			res.status(404).send({
				error: 'Este usuario no está registrado en la base de datos o la contraseña es incorrecta.',
				code: 404,
			});
		}
	}
});

// get datos
app.get('/datos', (req, res) => {
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
				message: 'Usted no está autorizado para estar aquí',
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
app.get('/datos_usuario', async (req, res) => {
	const respuesta = await consultarUsuarios();
	res.send(respuesta);
});

// put update data user
app.put('/datos_perfil', async (req, res) => {
	const { email, nombre, password, anhos, especialidad } = req.body;

	try {
		const usuario = await setDatosUsuario(email, nombre, password, anhos, especialidad);
		res.status(200).send(usuario);
	} catch (e) {
		res.status(500).send({
			error: `Algo salió mal... ${e}`,
			code: 500,
		});
	}
});

// delete data user
app.delete('/eliminar_cuenta/:email', async (req, res) => {
	try {
		const { email } = req.params;
		const respuesta = await eliminarCuenta(email);
		res.sendStatus(200).send(respuesta);
	} catch (e) {
		res.status(500).send({
			error: `Algo salió mal... ${e}`,
			code: 500,
		});
	}
});
