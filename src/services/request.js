const pool = require('./pool');

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

async function postUser(email, name, password, experience, skill, photo) {

	try {
		const query = `
		INSERT INTO skaters (email, name, password, experience, skill, photo, validate)
		VALUES ($1, $2, $3, $4, $5, $6, false)
		RETURNING *`;
		const values = [email, name, password, experience, skill, photo];
		const result = await pool.query(query, values);
		return result.rows[0];
	} catch (error) {
		console.error('Error in postUser:', error);
		throw error;
	}
}

async function putStatusUser(id, validate) {
	try {
		const query = `UPDATE skaters SET validate = $1 WHERE id = $2 RETURNING *`;
		const values = [validate, id];
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

async function putUser(email, name, password, experience, skill) {
	try {
		const query = `
            UPDATE skaters
            SET
                name = $1,
                password = $2,
                experience = $3,
                skill = $4
            WHERE email = $5
            RETURNING *`;
		const values = [name, password, experience, skill, email];
		const result = await pool.query(query, values);
		return result.rows[0];
	} catch (error) {
		console.log('Error: ', error);
	}
}

async function deleteUser(email) {
	try {
		const query = 'DELETE FROM skaters WHERE email = $1';
		const values = [email];
		const result = await pool.query(query, values);
		return result.rowCount;
	} catch (error) {
		console.error('Error: ', error);
		throw error;
	}
}

module.exports = { getUsers, postUser, putStatusUser, getLogin, putUser, deleteUser };
