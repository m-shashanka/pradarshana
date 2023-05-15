const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const path = require('path');
const fs = require('fs');
const { INVALID_CREDENTIALS, FORBIDDEN } = require("../../constants/response");
const { PROFESSOR } = require("../../constants/roles");
const {TestSchema: Test} = require("../../models/Test");

const register = (req, res) => {
  // Form validation
  res.setHeader("Access-Control-Allow-Origin", "*");

  const user = new User({
    name: req.body.name,
    usn: req.body.usn,
    email: req.body.email,
    password: req.body.password,
    roles: req.body.roles,
    enabled: false,
  });

  // Hash password before saving in database
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) throw error;
      user.password = hash;
      user
        .save()
        .then((currentUser) => {
          const tempUser = { ...currentUser.toObject() };
          delete tempUser.password;
          return res.json(tempUser);
        })
        .catch(() => {
          return res
            .status(409)
            .json({ message: "User with email/usn already exists" });
        });
    });
  });
};

const addUserByAdmin = (req, res) => {
  // Form validation
  res.setHeader("Access-Control-Allow-Origin", "*");

  const user = new User({
    name: req.body.name,
    usn: req.body.usn,
    email: req.body.email,
    password: req.body.password,
    roles: req.body.roles,
    enabled: true,
  });

  // Hash password before saving in database
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) throw error;
      user.password = hash;
      user
        .save()
        .then((currentUser) => {
          const tempUser = { ...currentUser.toObject() };
          tempUser.success = true;
          delete tempUser.password;
          return res.json(tempUser);
        })
        .catch(() => {
          return res
            .status(409)
            .json({ message: "User with email/usn already exists" });
        });
    });
  });
};

const login = (req, res) => {
  // Form validation
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { email, password } = req.body;

  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: INVALID_CREDENTIALS });
    }
    if (!user.enabled) {
      return res.status(403).json({ message: FORBIDDEN });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          roles: user.roles,
          email: user.email,
          usn: user.usn,
          isProfessor: user.roles.includes(PROFESSOR),
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: token,
            });
          }
        );
      } else {
        return res.status(401).json({ message: INVALID_CREDENTIALS });
      }
    });
  });
};

const clearDataset = async (req,res) => {
  const {testId} = req.body;
  const dir = path.join(keys.imageUploadPath, testId);
  try{
    if (fs.existsSync(dir))
      fs.rmSync(dir, { recursive: true });
  }catch(e){
    return res.status(500).json({ message: e.toString() });
  }
  return res.status(200).json({ message: "Dataset Cleared Successfully" });
}

const uploadDataset = async (req, res) => {
  const {testId} = req.body;
  try{
    const count = await Test.countDocuments({_id: testId});
    if(count == 0)
      return res.status(404).json({message: 'Invalid Test Id'});
    for(const file of req.files){
      const dir = path.join(keys.imageUploadPath, testId, 'dataset', file.originalname.split('$')[0]);
      if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, file.originalname.split('$')[1]), file.buffer);
    }
  }catch(e){
    return res.status(500).json({ message: e.toString() });
  }
  return res.status(200).json({ message: "Dataset Uploaded Successfully" });
}

const bulkAddUserByAdmin = async (req, res) => {
  // Form validation
  const { users } = req.body;
  const saveUsers = async () => {
    for (let user of users) {
      console.log('user',user)
      let checkExist = await User.findOne({ email: user.email });
      
      console.log('not exist',checkExist)
      if (checkExist) continue;
      const saveUser = new User({
        name: user.name,
        usn: user.usn,
        email: user.email,
        password: user.password,
        roles: user.roles,
        enabled: true,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, async (err, salt) => {
        bcrypt.hash(user.password, salt, async (error, hash) => {
          if (error) throw error;
          saveUser.password = hash;
          await saveUser
            .save()
            .then((currentUser) => {
              console.log('saved', currentUser)
            })
            .catch((err) => {
              return res.status(409).json({ message: err.toString() });
            });
        });
      });
    }
  }
  console.log('await')
  await saveUsers();
  return res.status(200).json({ message: "Users Added Successfully" });
};

module.exports = {
  login,
  register,
  addUserByAdmin,
  bulkAddUserByAdmin,
  uploadDataset,
  clearDataset
};
