const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generarJWT } = require('../helpers/jwt');

const createUser = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "The email it's already in use",
      });
    }

    user = new User(req.body);

    // Password encrypt
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    // Generar JWT
    const token = await generarJWT(user.id, user.name);


    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Please contact with the admin',
    });
  }
};

const loginUser = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'Email and password incorrect',
      });
    }

    // Confirm passwords
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Email and password incorrect',
      });
    }

    // Generar JWT
    const token = await generarJWT(user.id, user.name);

    return res.status(200).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Please contact with the admin',
    });
  }

  res.status(200).json({
    ok: true,
    msg: 'login',
    email,
    password,
  });
};

const renewUserToken = async (req = request, res = response) => {

  const {uid, name} = req;

  const token = await generarJWT(uid, name);

  res.json({
    ok: true,
    token,
    uid,
    name
  });
};

module.exports = { createUser, loginUser, renewUserToken };
