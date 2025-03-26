var express = require('express');
var router = express.Router();
const User = require('../schemas/user'); 
const Role = require('../schemas/role'); 

router.post('/create', async (req, res) => {
    try {
        const { name, password, email, fullName, avatarUrl, roleId } = req.body;
        const user = new User({ name, password, email, fullName, avatarUrl, role: roleId });
        await user.save();
        res.status(201).json({ success: true, user });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});
router.get('/', async (req, res) => {
    try {
        const { username, fullName, minLoginCount, maxLoginCount } = req.query;
        let filter = { isDeleted: false }; 

        if (username) filter.name = { $regex: username, $options: 'i' };
        if (fullName) filter.fullName = { $regex: fullName, $options: 'i' };
        if (minLoginCount || maxLoginCount) {
            filter.loginCount = {};
            if (minLoginCount) filter.loginCount.$gte = Number(minLoginCount);
            if (maxLoginCount) filter.loginCount.$lte = Number(maxLoginCount);
        }

        const users = await User.find(filter).populate('role');
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('role');
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
router.delete('/delete/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        
        res.json({ success: true, message: "User soft deleted", user });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
router.put('/users/:id', async (req, res) => {
    try {
        const { name, password, email, fullName, avatarUrl, loginCount, role } = req.body;
        if (role) {
            const roleExists = await Role.findById(role);
            if (!roleExists) return res.status(400).json({ success: false, message: "Role not found" });
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, password, email, fullName, avatarUrl, loginCount, role },
            { new: true, runValidators: true }
        );
        if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, user: updatedUser });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
module.exports = router;
