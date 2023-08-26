const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
//install bcryptjs (npm install bcryptjs) for hashing password
const bcrypt = require('bcryptjs'); 
// install jsonwebtoken
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'Shriakntj@0794$'

//Create a User using: POST "/api/auth/createuser". NO login required
router.post('/createuser', [ //adding validations
    body('name', 'Enter a valid name').isLength({ min:3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password','password must be atleast 5 char').isLength({ min:5 })
], async(req,res)=>{
    //msg for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check weather the user axist already 

    try {
      
    let user = await User.findOne({email: req.body.email});
    if(user){
      return res.status(400).json({error: "Sorry a user with this email already axist"})
    }
    
    //To hash a password:
    const salt = await bcrypt.genSaltSync(10);
    const secPass = await bcrypt.hash(req.body.password, salt)

    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      })
      const data = {
        user:{
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({authtoken})


    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server Error")
    }
})

//Authentication a User using: POST "/api/auth/login". NO login required



module.exports = router