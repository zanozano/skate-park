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
		const query = 'SELECT * FROM skaters';
		const result = await pool.query(query);
		return result.rows;
	} catch (error) {
		console.error('Error fetching users:', error);
		throw error;
	}
}

//OK
async function postUser(email, nombre, password, anhos, especialidad, foto) {

	try {
		const query = `
		INSERT INTO skaters 
		(email, nombre, password, anos_experiencia, especialidad, foto, estado)
		VALUES ($1, $2, $3, $4, $5, $6, false)
		RETURNING *`;

		const values = [email, nombre, password, anhos, especialidad, foto];
		const result = await pool.query(query, values);

		return result.rows[0];
	} catch (error) {
		console.error('Error in postUser:', error);
		throw error;
	}
}

//OK
async function putStatusUser(id, estado) {
	try {
		const query = `UPDATE skaters SET estado = $1 WHERE id = $2 RETURNING *`;
		const values = [estado, id];
		const result = await pool.query(query, values);
		return result.rows[0];
	} catch (error) {
		console.error('Error in putStatusUser:', error);
		throw error;
	}
}

async function getLogin(email, password) {
	try {
		const query = 'SELECT * FROM skaters WHERE email = $1 AND password = $2';
		const values = [email, password];
		const result = await pool.query(query, values);
		return result.rows[0];
	} catch (error) {
		console.error('Error in getLogin:', error);
		throw error;
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
	} catch (error) {
		console.log('Error: ', error);
	}
}

async function deleteUser(email) {
	try {
		const request = await pool.query(`DELETE FROM skaters WHERE email = '${email}'`);
		return request.rowCount;
	} catch (error) {
		console.log('Error: ', error);
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
