const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'descripción es necesario'],
        unique: true
    },
    usuario: {
        type: String,
        required: [true, 'usuario es necesario']
    },
});

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

/*
categoriaSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
*/

module.exports = mongoose.model('Categoria', categoriaSchema)