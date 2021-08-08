const express = require('express');
const router = express.Router();
let Bmi = require('../models/Bmi');
let UserInfo = require('../models/UserInfo');

router.route('/add').post((req,res) => {
    
    const height = req.body.height;
    const weight = req.body.weight;
    const currentDate = req.body.currentDate;
    const userId = req.body.userId;
    const bmi = req.body.bmi;

    var obj = {
        height,
        weight,
        currentDate,
        bmi
    }
    Bmi.updateOne({userId}, {'$push': {details: obj}})
        .then(() => {
          UserInfo.updateOne({userId}, {"$set":{
            height,
            weight,
            bmi
          }}).then(()=>{
            res.json('User data Added.')

          })
        })
        .catch(err => res.status(400).json('Error:' + err));
});



router.route('/getbmiByUserId').get((req,res) => {

    const userId = req.query.userId;
    console.log(userId)
    const filter = {
      userId: userId,
    };
    Bmi.find(filter)
      .then((docs) => {
        if (docs.length > 0) res.json(docs);
        else {
          res.json({});
        }
      })
      .catch((err) => res.status(400).json("Error:" + err));

});

module.exports = router

