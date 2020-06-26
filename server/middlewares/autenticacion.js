const jwt = require('jsonwebtoken');


// =======================
// Valida token
// =======================
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        req.usuario = decoded.usuario

        next();
    })

};

// =======================
// Valida Admin-Role
// =======================
let verificaAdmin_Role = (req, res, next) => {

    console.log(req.usuario);
    let usuario = req.usuario

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'Usuario no es admin'
            }
        })
    }

};

module.exports = {
    verificaToken,
    verificaAdmin_Role
}