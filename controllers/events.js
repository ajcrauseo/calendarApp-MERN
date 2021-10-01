const { request, response } = require('express');
const Event = require('../models/Event');

const getEvents = async (req = request, res = response) => {
  const events = await Event.find().populate('user', 'name');

  res.status(200).json({
    ok: true,
    events,
  });
};

const createEvent = async (req = request, res = response) => {
  const event = new Event(req.body);

  try {
    event.user = req.uid;
    const eventSaved = await event.save();
    res.status(201).json({
      ok: true,
      event: eventSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Internal server error...',
    });
  }
};

const updateEvent = async (req = request, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({
        ok: false,
        msg: 'Event not found',
      });
    }
    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'Unauthorized',
      });
    }
    const newEvent = {
      ...req.body,
      user: uid,
    };
    const eventUpdated = await Event.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    });

    res.json({
      ok: true,
      event: eventUpdated,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Internal server error',
    });
  }
};

const deleteEvent = async (req = request, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({
        ok: false,
        msg: 'Event not found',
      });
    }
    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'Unauthorized',
      });
    }

    await Event.findByIdAndDelete(eventId);

    res.json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Invalid event id',
    });
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
