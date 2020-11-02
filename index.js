// ######################## INSTALL SEMUA PACKAGE#########################
const express = require('express');
const bodyParser = require('body-parser');
const userRoute = require('./src/routes/users');
const cors = require('cors');
const { PORT } = require('./src/helper/env');
// const { static } = require('express');

const socketio = require('socket.io');
const http = require('http');
const aps = express();
const server = http.createServer(aps);
const io = socketio(server);
const path = require('path')
aps.set('views', path.join(__dirname, 'src/views'))
aps.set('view engine', 'ejs')
aps.use(bodyParser.urlencoded({ extended: false }));
aps.use(bodyParser.json());
aps.use(cors());
aps.use('/users', userRoute);
aps.use(express.static('src/img'));
const db = require('./src/config/db_api_chat');


// ####################################SOCKET IO###############################
//pertama user connect
io.on('connection', socket => {
	io.emit('status','online')
  socket.on('get-all-users', () => {
    db.query('SELECT * FROM users', (err, result) => {
      if (err) {
        console.log(err);
      }else{
        io.emit('list-users', result)
      }
    })
  })
	// untuk ambil semua users yang online
	socket.on('get-all-users', () => {
		db.query(`SELECT * FROM users`, (err, result) => {
			if (err) {
				console.log('eror woi');
			} else {
				io.emit('list-users', result);
			}
		});
	});
	socket.on('get-history', () => {
		db.query(`SELECT * FROM message`, (err, result) => {
			if (err) {
				console.log('eror woi');
			} else {
				io.emit('list-Message', result);
			}
		});
	});
	// untuk ngirim chat yang di kirim dari front-end,
	socket.on('send-messages', (payload) => {
		const msg = `${payload.message}`
		db.query(`INSERT INTO message (sender,receiver,message) 
		VALUES ('${payload.sender}','${payload.receiver}','${payload.message}')`, (err,result) => {
		  if (err) {
			console.log(err.message);
		  }else{
			io.to(payload.receiver).emit('list-messages', {
			  sender: payload.sender,
			  receiver: payload.receiver,
			  message: msg
			})
		  }
		})
	  })
	  // untuk chat private jadi yang bisa baca cuma si tujuan/receiver
	socket.on('join-room', payload => {
		socket.join(payload.userRoom);
	});
	// untuk history message
	socket.on('get-history-message', payload => {
		db.query(
			`SELECT * FROM message WHERE (sender='${payload.sender}' 
		AND receiver='${payload.receiver}') OR (sender='${payload.receiver}' AND receiver='${payload.sender}')`,
			(err, result) => {
				if (err) {
					console.log(err.message);
				} else {
					io.to(payload.sender).emit('history-list-message', result);
				}
			}
		);
	});
	// user offline/close
	socket.on('disconnect', () => {
		console.log('User disconnect');
	})
	
});

server.listen(PORT, () => {
	console.log(`Running port ${PORT}`);
});
