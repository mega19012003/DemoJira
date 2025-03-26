let mongoose = require('mongoose');
let RoleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Role', RoleSchema);
