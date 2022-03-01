// dependencies
const { Pool } = require('pg');

// database config
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	password: 'postgres',
	database: 'skatepark',
	port: 5433,
});

// get users
async function consultarUsuarios() {
	try {
		const result = await pool.query(`SELECT * FROM skaters`);
		return result.rows;
	} catch (e) {
		console.log('Error: ', e);
	}
}

// post nuevo usuario
async function nuevoUsuario(email, nombre, password, anhos, especialidad, foto) {
	try {
		const result = await pool.query(
			`INSERT INTO skaters 
            (email,nombre,password,anos_experiencia,especialidad,foto,estado)
            VALUES ('${email}','${nombre}','${password}','${anhos}','${especialidad}','${foto}',false)
            RETURNING *`
		);
	} catch (e) {
		console.log('Error: ', e);
	}
}

// put update user data
async function setUsuarioStatus(id, estado) {
	const result = await pool.query(
		`UPDATE skaters SET estado = ${estado} WHERE id = ${id} RETURNING *`
	);

	const usuario = result.rows[0];
	return usuario;
}

// get login user
async function conseguirUsuario(email, password) {
	try {
		const result = await pool.query(`SELECT * FROM skaters 
                                        WHERE email = '${email}' AND
                                        password = '${password}'`);
		return result.rows;
	} catch (e) {
		console.log('Error: ', e);
	}
}

// put status user
async function setUsuarioStatus(id, estado) {
	const result = await pool.query(
		`UPDATE skaters SET estado = ${estado} WHERE id = ${id} RETURNING *`
	);

	const usuario = result.rows[0];
	return usuario;
}

// put user data
async function setDatosUsuario(email, nombre, password, anhos, especialidad) {
	const result = await pool.query(
		`UPDATE skaters SET 
            nombre = '${nombre}',
            password = '${password}',
            anos_experiencia = ${anhos},
            especialidad = '${especialidad}'
            WHERE email = '${email}' RETURNING *`
	);

	const usuario = result.rows[0];
	return usuario;
}

// delete user
async function eliminarCuenta(email) {
	try {
		const result = await pool.query(`
            DELETE FROM skaters WHERE email = '${email}'
            `);

		return result.rowCount;
	} catch (e) {
		console.log('Error: ', e);
	}
}

// export dependencies
module.exports = {
	consultarUsuarios,
	nuevoUsuario,
	setUsuarioStatus,
	conseguirUsuario,
	setDatosUsuario,
	eliminarCuenta,
};
