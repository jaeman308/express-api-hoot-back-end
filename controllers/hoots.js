// controllers/hoots.js

const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Hoot = require('../models/hoot.js');
const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========

router.use(verifyToken);

router.post('/', async (req, res) => {
    try{
        req.body.author = req.user._id
        const hoot = await Hoot.create(req.body);
        hoot._doc.author = req.user;
        console.log(hoot._doc)
        res.status(201).json(hoot);

    }catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
});


router.get('/', async (req, res) => {
    try {

        const hoots = await Hoot.find({})
        .populate('author')
        .sort({createdAt: 'desc'});
        res.status(200).json(hoots);
    } catch (error) {
        res.status(500).json(error)
    }
});

router.get('/:hootId', async (req, res) => {
    try{
        const hoot = await Hoot.findById(req.params.hootId).populate('author');
        res.status(200).json(hoot);
    }catch (error) {
        res.status(500).json(error)
    }
})

router.put('/:hootId', async (req,res) => {
    try {

        const hoot = await Hoot.findById(req.params.hootId);
// Check permission:
        if(!hoot.author.equals(req.user._id)) {
            return res.status(403).send("Youre not allowed to do that")
        }
// update and return new hoot:
        const updatedHoot = await Hoot.findByIdAndUpdate(
            req.params.hootId,
            req.body,
            {new: true}
        );
//append req.user to the author proeprty: 

        updatedHoot._doc.author = req.user;
        res.status(200).json(updatedHoot)
    }catch (error) {
        res.status(500).json(error)
    }
})
module.exports = router;
