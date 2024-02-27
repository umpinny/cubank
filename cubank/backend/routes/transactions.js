const express = require('express');

const {getAccount, updateAccount, getMyAccount} = require('../controllers/transactions');

const router = express.Router({mergeParams:true});

const {protect,authorize} = require('../middleware/auth');

router.route('/:id').get(protect,getAccount)
router.route('').put(protect, updateAccount).get(protect,getMyAccount)
module.exports=router;