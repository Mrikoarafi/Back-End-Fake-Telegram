const db = require('../config/db_api_chat');

const userModel = {
	register: data => {
		return new Promise((resolve, reject) => {
			db.query(
				`INSERT INTO users (email,username,password,status) 
                  VALUES('${data.email}','${data.username}','${data.password}',0)`,
				(err, result) => {
					if (err) {
						reject(new Error(err));
					} else {
						resolve(result);
					}
				}
			);
		});
	},
	emailRegister: data => {
		return new Promise((resolve, reject) => {
			db.query(
				`SELECT * FROM users WHERE email='${data.email}'`,
				(err, result) => {
					err ? reject(new Error(err)) : resolve(result);
				}
			);
		});
	},
	aktifasiSuccess: email => {
		return new Promise((resolve, reject) => {
			db.query(
				`UPDATE users SET status=1 WHERE email='${email}'`,
				(err, sukses) => {
					if (err) {
						reject(new Error(err));
					} else {
						resolve(sukses);
					}
				}
			);
		});
	},
	login: data => {
		return new Promise((resolve, reject) => {
			db.query(
				`SELECT * FROM users where email='${data.email}'`,
				(err, result) => {
					if (err) {
						reject(new Error(err));
					} else {
						resolve(result);
					}
				}
			);
		});
	},
	getAll: () => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT * FROM users`, (err, result) => {
				err ? reject(new Error(err)) : resolve(result);
			});
		});
	},
	idUsers: id => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT * FROM users WHERE id=${id}`, (err, result) => {
				err ? reject(new Error(err)) : resolve(result);
			});
		});
	},
	updateUsers: (data, id) => {
		return new Promise((resolve, reject) => {
			db.query(
				`UPDATE users SET 
    username='${data.username}',
    image='${data.image}',
    city='${data.city}',
    address='${data.address}',
    phone='${data.phone}',
    bio='${data.bio}',
    inisial_name='${data.inisial_name}'
    WHERE id = '${id}'`,
				(err, result) => {
					if (err) {
						reject(new Error(err));
					} else {
						resolve(result);
					}
				}
			);
		});
	},
	// Login
	deleteModel: id => {
		return new Promise((resolve, reject) => {
			db.query(`DELETE FROM users WHERE id=${id}`, (err, result) => {
				if (err) {
					reject(new Error(err));
				} else {
					resolve(result);
				}
			});
		});
	},
	deleteMsg: id => {
		return new Promise((resolve, reject) => {
			db.query(`DELETE FROM message WHERE id=${id}`, (err, result) => {
				err ? reject(new Error(err.message)) : resolve(result);
			});
		});
	}
};

module.exports = userModel;
