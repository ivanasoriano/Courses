const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const checkAuth = require('../middleware/check-auth');

const mysqlConnection = require('../database');

router.get('/',checkAuth, (req,res) => {
    mysqlConnection.query('select id,nombre,email,password from usuarios',(err,rows,fields) => {
        if(!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.post('/login', (req,res) => {
    const { email, password } = req.body;
    const query = 'select id,email,password from usuarios where email=?'
    mysqlConnection.query(query, [email], (err, rows, fields) => {
        if(rows.length <1) {
            res.json({Estado: 'Error de autenticación'});
            console.log(req.body.email);
        } else {
        bcrypt.compare(req.body.password,rows[0].password, (err , result) => {
            if(err) {
                console.log(err);
            } 
            if (result) {
                const token = jwt.sign(
                    {
                        email: rows[0].email,
                        userId: rows[0].id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '60m'
                    }
                  );
                res.json({Estado: 'Autenticación exitosa', token: token});
            } else {
                res.json({Estado: 'Error de autenticación'});
            }
            });
        }
    });
});

router.post('/signup', (req,res) => {
    const { id, nombre, email, password } = req.body;
    const query = 'select id from usuarios where email=?'
    mysqlConnection.query(query, [email], (err, rows, fields) => {
        if(rows.length >0) {
            res.json({Estado: 'El usuario ya existe'});
            //console.log(err);
        } else {
            bcrypt.hash(req.body.password, 10,(err, hash) => {
                if (err) {
                    console.log(err);
                } else {
                    const query = 'insert into usuarios values (?,?,?,?)'
                    //const query= 'call cursoAddOrEdit(?, ?, ?)';
                    mysqlConnection.query(query, [id,nombre,email,hash], (err, rows, fields) => {
                        if(!err) {
                            res.json({Status: 'Usuario agregado'});
                        } else {
                            console.log(err);
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
