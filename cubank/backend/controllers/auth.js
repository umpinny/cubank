const User = require('../models/User');
const { options } = require('../routes/transactions');

//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public
exports.register=async (req,res,next)=>{
    try{
        console.log(req.body);
        const {name,accountId,password}=req.body;
        const checkUser = await User.findOne({
            accountId
        })
        if(checkUser)
        {
            return res.status(401).json({success:false,msg:'Account ID already existed'});
        }
        //Create user
        const user = await User.create({
            name,accountId,password
        });

        //Create token

        // const token = user.getSignedJwtToken();
        // res.status(200).json({success:true,token});
        sendTokenResponse(user,200,res);

    } catch(err){
        res.status(500).json({
            success:false, msg:'server error'
        })
    }
};

//@desc     Login user
//@route    POST /api/v1/auth/login
//@access   Public
exports.login = async (req,res,next) => {

    try{
        const {accountId, password}=req.body;

        //validate email & password
        if(!accountId || !password) {
        return res.status(400).json({success:false,msg:'Please provide an email and password'});
        }

        //Check for user
        const user = await User.findOne({accountId}).select('+password');
        if(!user){
            return res.status(400).json({success:false,msg:'Not Found User'});
        }

        //Check if password matches
        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            return res.status(401).json({success:false,msg:'Password Incorrect'});
        }

        //Create token
        
        // const token = user.getSignedJwtToken();
        // res.status(200).json({success:true,token});
        sendTokenResponse(user,200,res);

    } catch(err){
        return res.status(401).json({
            success:false, msg:'server error'
        })
    }

}

//Get token from model, create cookie and send response
const sendTokenResponse=(user, statusCode, res)=>{
    //Create token
    const token=user.getSignedJwtToken();

    const options = {
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV==='production'){
        options.secure=true;
    }
    return res.status(statusCode).cookie('token',token,options).json({
        success: true,
        token,user
    })
}

//@desc     Get current Logged in user
//@route    POST /api/v1/auth/me
//@access   Private
exports.getMe=async(req,res,next)=>{
    const user=await User.findById(req.user.id);
    return res.status(200).json({
        success:true,
        data:user
    });
};

//@desc Log user out / clear cookie
//@route GET /api/v1/auth/logout
//@access Private
exports.logout=async(req,res,next)=>{
    res.cookie('token','none',{
        expires: new Date(Date.now() + 10*1000),
        httpOnly:true
    });

    return res.status(200).json({
        success:true,
        data:{}
    });
};