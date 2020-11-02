const usersModel = require('../model/usersModel');
const bcrypt = require('bcrypt');
const email = require('../helper/sendEmail');
const jwt = require('jsonwebtoken');
const { JWT_REGIS, JWT_PRIVATE, JWT_REFRESH } = require('../helper/env');
const { success, failed, error } = require('../helper/response');
const upload = require('../helper/upload');
const path = require('path');
const fs = require('fs');

const usersController = {
	register: async (req, res) => {
		const body = req.body;
		const hashPassword = await bcrypt.hash(body.password, 10);
		const dataUsers = {
			email: body.email,
			username: body.username,
			password: hashPassword
		};
		try {
			const userDatabase = await usersModel.emailRegister(dataUsers);
			if (userDatabase.length > 0) {
				res.json({
					message: 'Email atau nama sudah digunakan'
				});
			} else {
				const result = await usersModel.register(dataUsers);
				email.emailSend(dataUsers.email);
				res.json({
					message: 'Sukses register',
					status: true,
					data: result
				});
			}
		} catch (err) {
			error(res, [], err.message);
		}
	},
	verify: (req, res) => {
		const hashlink = req.params.token;
		if (hashlink) {
			jwt.verify(hashlink, JWT_REGIS, async (err, decode) => {
				if (err) {
					failed(res, [], 'Failed verify');
				} else {
					try {
						const email = decode.email;
					usersModel.aktifasiSuccess(email);
					res.render('thanks', { email });
					} catch (error) {
						error(res, [], error.message);
					}
				}
			});
		} else {
			res.json({
				message: 'Failed'
			});
		}
	},
	login: async (req, res) => {
		const body = req.body;
		try {
			const databaseUser = await usersModel.login(body);
			if (databaseUser.length > 0) {
				if (databaseUser[0].status === 1) {
					const id = databaseUser[0].id;
					const username = databaseUser[0].username;
					const image = databaseUser[0].image;
					const dataUser = {
						id: id,
						email: body.email
					};
					const matchPass = await bcrypt.compare(
						body.password,
						databaseUser[0].password
					);
					if (matchPass) {
						jwt.sign(dataUser, JWT_PRIVATE, { expiresIn: '300000' }, async err => {
							if (err) {
								failed(res, [], 'Error hash');
							} else {
								success(
									res,
									{
										id: dataUser.id,
										username: username,
										image: image
									},
									'Success Login'
								);
							}
						});
					} else {
						failed(res, [], 'Wrong password!');
					}
				} else {
					failed(res, [], 'Email belum aktif!');
				}
			} else {
				failed(res, [], 'Email tidak terdaftar!');
			}
		} catch (error) {
			error(res, [], error.message);
		}
	},
	getAll: (req, res) => {
		usersModel
			.getAll()
			.then(result => {
				res.json({
					msg: 'Sukses get all',
					data: result
				});
			})
			.catch(err => {
				error(res, [], err.message);
			});
	},
	getDetails: (req, res) => {
		const id = req.params.id;
		usersModel
			.idUsers(id)
			.then(result => {
				res.json({
					msg: 'Sukses get details',
					data: result
				});
			})
			.catch(err => {
				error(res, [], err.message);
			});
	},
	updateUsers: (req, res) => {
		upload.single('image')(req, res, async err => {
			if (err) {
				if (err.code === 'LIMIT_FILE_SIZE') {
					res.json({
						message: 'Ukuran file terlalu besar'
					});
				} else {
					success(res, [], 'Tipe gambar harus jpg,jpeg atau png');
				}
			} else {
				try {
					const body = req.body;
					const id = req.params.id;
					const dataUser = await usersModel.idUsers(id);
					body.image = !req.file ? '' : req.file.filename;
					if (body.image) {
						// delete files lama
						let oldPath = path.join(
							__dirname + `/../../src/img/${dataUser[0].image}`
						);
						fs.unlink(oldPath, function (err) {
							if (err) throw err;
						});
						const result = await usersModel.updateUsers(body, id);
						success(res, result, 'Sukses update');
					} else {
						body.image = dataUser[0].image;
						const results = await usersModel.updateUsers(body, id);
						success(res, results, 'Sukses update');
					}
				} catch (error) {
					error(res, [], error.message);
				}
			}
		});
	},
	deleteMessage: async (req, res) => {
		try {
			const id = req.params.id;
			const deleteMessage = await deleteMsg(id);
			success(res, deleteMessage, 'Delete Message Success');
		} catch (err) {
			error(res, [], err.message);
		}
	}
};

module.exports = usersController;
