var express = require('express');
var router = express.Router();
const Role = require('../schemas/role'); 
router.post('/roles', async (req, res) => {
    try {
        const { name, description } = req.body;
        const role = new Role({ name, description });
        await role.save();
        res.status(201).json({ success: true, role });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});
router.get('/roles', async (req, res) => {
    try {
        const roles = await Role.find();
        res.json({ success: true, roles });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
router.get('/roles/:id', async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ success: false, message: "Role not found" });
        res.json({ success: true, role });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
router.delete('/roles/:id', async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!role) return res.status(404).json({ success: false, message: "Role not found" });
        res.json({ success: true, message: "Role soft deleted", role });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
module.exports = router;
