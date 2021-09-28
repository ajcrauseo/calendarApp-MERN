/*

User Routes / Auth
host + /api/auth

*/

const { Router } = require('express');
const { check } = require('express-validator');
const { fieldsValidator } = require('../middlewares/fieldsValidator');
const { validateJwt } = require('../middlewares/validateJwt');
const {
  createUser,
  loginUser,
  renewUserToken,
} = require('../controllers/auth');

const router = Router();

router.post(
  '/new',
  [
    check('name', 'The name is required').not().isEmpty(),
    check('email', 'The email is required').isEmail(),
    check(
      'password',
      'The password must be greater than 6 characters',
    ).isLength({ min: 6 }),
    fieldsValidator,
  ],
  createUser,
);

router.post(
  '/',
  [
    check('email', 'The email is required').isEmail(),
    check(
      'password',
      'The password must be greater than 6 characters',
    ).isLength({ min: 6 }),
    fieldsValidator,
  ],
  loginUser,
);

router.get('/renew', validateJwt, renewUserToken);

module.exports = router;
