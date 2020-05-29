const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');


app.get('/usuario', function(req, res) {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 0;

    Usuario.find({ estado: true }, 'nombre email img role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    usuarios
                });
            })
        })
})

app.post('/usuario', function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
})

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    console.log(body);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usu) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usu
        })
    })

})

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    let body = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usu) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usu
        })
    })
})

module.exports = app