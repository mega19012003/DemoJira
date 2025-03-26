let mongoose = require('mongoose');
let UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    fullName: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    status: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    loginCount: { type: Number, default: 0, min: 0},
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
