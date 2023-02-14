const userSchema = require('../models/user');
// const messageSchema = require('../models/message');
const bcrypt = require('bcrypt');
const valid = require("validator");
const session = require("express-session");

const register = async (req, res) => {
    try {
        const { username, email, password, } = req.body;
        if (valid.isEmpty(username)) {
            res.json("Name not be empty");
        }
        else if (valid.isEmpty(email)) {
            res.json("Email not be empty");
        }
        else if (valid.isEmpty(password)) {
            res.json("The password is not empty");
        }
        else if (!valid.isEmail(email)) {
            res.json("This email is not in a correct format");
        }
        else if (!valid.isStrongPassword(password)) {
            res.json("Password Must be - minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10")
        }
        else {
            const newuser = new userSchema(req.body);
            newuser.save()
                .then(() => res.json("Success"))
                .catch((error) => res.send(error));

        }
    } catch (error) {
        res.json({ message: error.message })
    }
}

const login = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        const userMail = await userSchema.findOne({ email })
        req.session.name = userMail.username;
        console.log(req.session);
        // const isMatch = await bcrypt.compare(password, userMail.password);
        if (password==userMail.password) {
            res.status(201).send({ message: "Login Success", name: userMail.username })
        }
        else {
            res.json({ messsage: "Invalid Username or Password" });
        }
    } catch (error) {
        res.json({ messsage: "Invalid Username or Password" });
    }
}

const getUser = async (req, res) => {
    try {
        const getUser = await userSchema.find(req.body)
        res.status(201).send(getUser);
    } catch (error) {
        res.status(401).send(error);
    }
}

const getChatData = async(req,res)=>{
    try {
        const{from,toUser}=req.body
        var myquery={
            $or:[
                {
                    from:from,to:toUser
                },
                {
                    from:toUser,to:from
                }
            ]
        }
    //     const getUser = await messageSchema.find(myquery)
    //    res.json(getUser)
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = {
    register,
    login,
    getUser,
    getChatData
}