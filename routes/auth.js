const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

//Create a User using: POST "/api/auth/". Doesn't require Auth
router.post('/', [ //adding validations
    body('name').isLength({ min:3 }),
    body('email').isEmail(),
    body('password').isLength({ min:3 })
],(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send(req.body)
})

module.exports = router