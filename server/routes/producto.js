const express = require('express');
let { verificaToken } = require('../middlewares/autenticacion');
const _ = require('underscore');

let app = express();
let Producto = require('../models/producto');


// Obtener todos los productos
app.get('/producto', verificaToken, (req, res) => {

    // trae todos los productos
    // populate: usuario, categoria
    //paginado

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 0;

    Producto.find({ disponible: true }, 'nombre precioUni descripcion')
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            Producto.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    productos
                });
            });

        })

});

// Obtener producto por ID
app.get('/producto/:id', verificaToken, (req, get) => {

    // populate: usuario, categoria
    //paginado

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            };

            res.json({
                ok: true,
                productoDB
            });

        })

});

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regexp = new RegExp(termino, 'i')

    Producto.find({ nombre: regexp, disponible: true })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            };

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontraron datos para la búsqueda'
                    }
                })
            };

            res.json({
                ok: true,
                productos
            });

        })

})

// crear un nuevo producto
app.post('/producto', verificaToken, (req, res) => {

    //grabar el usuario
    //grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({

        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});

// actualizar un producto
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria', 'usuario']);


    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el ID'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

// eliminar un producto (disponible = false)
app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id

    let producto = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el ID'
                }
            });
        }

        res.json({
            ok: true,
            message: 'producto eliminado'
        });
    });

});


module.exports = app