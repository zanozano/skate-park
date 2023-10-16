const { Pool } = require('pg');

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	password: '0750manzano',
	database: 'skatepark',
	port: 5432,
});

async function getUsers() {
	try {
		const request = await pool.query(`SELECT * FROM skaters`);
		return request.rows;
	} catch (e) {
		console.log('Error: ', e);
	}
}

async function postUser(email, nombre, password, anhos, especialidad, foto) {
	try {
		const request = await pool.query(
			`INSERT INTO skaters 
            (email, nombre, password, anos_experiencia, especialidad, foto, estado)
            VALUES ('${email}', '${nombre}', '${password}', '${anhos}', '${especialidad}', '${foto}', false)
            RETURNING *`
		);
		console.log('OK: ', request)
	} catch (e) {
		console.log('Error: ', e);
	}
}

async function putStatusUser(id, estado) {
	try {
		const request = await pool.query(
			`UPDATE skaters SET estado = ${estado} WHERE id = ${id} RETURNING *`
		);
		const user = request.rows[0];
		return user;
	} catch (e) {
		console.log('Error: ', e);
	}
}

async function getLogin(email, password) {
	try {
		const request = await pool.query(
			`SELECT * FROM skaters 
				WHERE email = '${email}' AND password = '${password}'`
		);
		return request.rows;
	} catch (e) {
		console.log('Error: ', e);
	}
}

async function putUser(email, nombre, password, anhos, especialidad) {
	try {
		const request = await pool.query(
			`UPDATE skaters SET 
            nombre = '${nombre}',
            password = '${password}',
            anos_experiencia = ${anhos},
            especialidad = '${especialidad}'
            WHERE email = '${email}' RETURNING *`
		);
		const user = request.rows[0];
		return user;
	} catch (e) {
		console.log('Error: ', e);
	}
}

async function deleteUser(email) {
	try {
		const request = await pool.query(`DELETE FROM skaters WHERE email = '${email}'`);
		return request.rowCount;
	} catch (e) {
		console.log('Error: ', e);
	}
}

module.exports = {
	getUsers,
	postUser,
	putStatusUser,
	getLogin,
	putUser,
	deleteUser,
};
