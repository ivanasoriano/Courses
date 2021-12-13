const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const mysqlConnection = require('../database');

//const URL_PARAMS = new URLSearchParams(window.location.search);
//const TOKEN = URL_PARAMS.get('token');

router.get('/', (req,res) => {
    mysqlConnection.query('select id,nombre,costo from cursos',(err,rows,fields) => {
        if(!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.get('/:id', (req,res) => {
    const {id} = req.params;
    mysqlConnection.query('select id,nombre,costo from cursos where id = ?', [id],
    (err,rows,fields) => {
        if(!err) {
            if (rows.length > 0) {
                res.json(rows[0]);
            } else {
                res.json({Mensaje: 'Curso inexistente'});
            } 
        } else {
            console.log(err);
        }
    });  
});

router.post('/', checkAuth, (req,res) => {
//router.post('/', (req,res) => {
    const { id, nombre, costo } = req.body;
    const query = 'insert into cursos values (?,?,?)'
    //const query= 'call cursoAddOrEdit(?, ?, ?)';
    mysqlConnection.query(query, [id,nombre,costo], (err, rows, fields) => {
        if(!err) {
            res.json({Mensaje: 'Curso agregado'});
        } else {
            console.log(err);
        }
    });
});

router.put('/:id', checkAuth, (req, res) => {
//router.put('/:id', (req, res) => {
    const {nombre, costo } = req.body;
    const { id } = req.params;
    const query = 'update cursos set nombre=?,costo=? where id=?'
    //const query = 'call cursoAddOrEdit(?, ?, ?)';
    mysqlConnection.query(query, [nombre,costo,id], (err, rows, fields) => {
        if(!err) {
            res.json({Mensaje: 'Curso actualizado'});
        } else {
            console.log(err);
        }
    });
});

router.delete('/:id', checkAuth, (req, res) => {
//router.delete('/:id', (req, res) => {
    const {id} = req.params;
    mysqlConnection.query('delete from cursos where id = ?',[id], (err, rows, fields) => {
        if(!err) {
            res.json({Mensaje: 'Curso eliminado'});
        } else {
            console.log(err);
        }
    });
});
module.exports = router;
