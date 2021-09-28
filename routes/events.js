/* 

Event Routes
host + /api/events

*/

const { Router } = require('express');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');
const { validateJwt } = require('../middlewares/validateJwt');
const { fieldsValidator } = require('../middlewares/fieldsValidator');
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/events');

const router = Router();

router.use(validateJwt);

// Obtener eventos
router.get(
  '/',

  getEvents,
);

// Crear un nuevo evento
router.post(
  '/',
  [check('title', 'Title is required').not().isEmpty(), fieldsValidator],
  [check('start', 'Start date is required').custom(isDate), fieldsValidator],
  [check('end', 'End date is required').custom(isDate), fieldsValidator],
  createEvent,
);

// Actualizar evento
router.put('/:id', updateEvent);

// Eliminar evento
router.delete('/:id', deleteEvent);

module.exports = router;
