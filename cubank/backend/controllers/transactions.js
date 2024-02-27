const User = require("../models/User.js");

//@desc     Get single account
//@route    GET /api/v1/transactions/:id
//@access   Public
exports.getAccount = async (req, res, next) => {
  try {
    const user = await User.findOne({accountId: req.params.id});
    console.log(req.user);
    if (!user) {
      return res.status(400).json({ success: false,status:400,msg:'Not Found User' });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        account: user.accountId,
        name: user.name,
        balance: user.balance,

      },
    });
  } catch (err) {
    return res.status(500).json({ success: false,status:500,msg:'server problem' });
  }
};

//@desc     Get single account
//@route    GET /api/v1/transactions/:id
//@access   Public
exports.getMyAccount = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ success: false });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        account: user.accountId,
        name: user.name,
        balance: user.balance,
        transactions: user.transactions
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false,status:500,msg:'server problem' });
  }
};

//@desc     update single hospital
//@route    PUT /api/v1/transactions/:id
//@access   Private
exports.updateAccount = async (req, res, next) => {
  try {
    const date = new Date();
    let user = req.user;
    if (req.body.action == "deposit") {
      user.balance = user.balance + req.body.balance;
      user.transactions.push({
        title: req.body.action,
        target: "",
        among: req.body.balance,
        balance: user.balance,
        date: date,
      });
      user.validate();
      await User.findByIdAndUpdate(user.id, user);
    }
    if (req.body.action == "withdraw") {
      if (user.balance < req.body.balance) {
        return res.status(400).json({ success: false,status:400,msg:'your balance is not enough' });
      }
      user.balance = user.balance - req.body.balance;
      user.transactions.push({
        title: req.body.action,
        target: "",
        among: req.body.balance,
        balance: user.balance,
        date: date,
      });
      user.validate();
      await User.findByIdAndUpdate(user.id, user);
    }
    if (req.body.action == "transfer") {
      if (user.balance < req.body.balance) {
        return res.status(400).json({ success: false,status:400,msg:'your balance is not enough' });
      }

      const targetUser = await User.findOne({accountId: req.body.target})
      if (!targetUser) {
        return res.status(400).json({ success: false,status:400,msg:'Not found your target account Id' });
      }
      if(user.accountId===req.body.target){
        return res.status(400).json({ success: false,status:400,msg:'Cannot transfer to own account' });
      }
      user.balance = user.balance - req.body.balance;
      user.transactions.push({
        title: req.body.action + ' to',
        target: targetUser.accountId,
        among: req.body.balance,
        balance: user.balance,
        date: date,
      });
      user.validate();
      await User.findByIdAndUpdate(user.id, user);

      targetUser.balance = targetUser.balance + req.body.balance;
      targetUser.transactions.push({
        title: req.body.action + ' from',
        target: user.accountId,
        among: req.body.balance,
        balance: user.balance,
        date: date,
      });
      targetUser.validate();
      await User.findByIdAndUpdate(targetUser.id, targetUser);

    }
    if(req.body.action == 'billpayment')
    {
        if (user.balance < req.body.balance) {
          return res.status(400).json({ success: false,status:400,msg:'your balance is not enough' });
          }
          user.balance = user.balance - req.body.balance;
          user.transactions.push({
            title: req.body.action,
            target: req.body.target,
            among: req.body.balance,
            balance: user.balance,
            date: date,
          });
          user.validate();
          await User.findByIdAndUpdate(user.id, user);
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ success: false,status:500,msg:'server problem' });
  }
};
