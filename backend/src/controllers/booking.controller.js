import * as bookingSvc from '../services/booking.service.js';
import * as slotSvc from '../services/slot.service.js';
import Appointment from '../models/Appointment.js';
import { asyncHandler, ok } from '../utils/apiError.js';
import { Slot } from '../models/Slot.js';

export const listAvailableSlots = asyncHandler(async (req, res) => {
  const { therapistId, from, to, mode, service } = req.query;
  console.log('Listing available slots with query:',  req.query);
  const slots = await slotSvc.listAvailableSlots({
    therapistId, from: new Date(from), to: new Date(to), mode, service
  });
  ok(res, slots);
});

export const adminListSlots = asyncHandler(
  async (req, res) => {

    const {
      therapistId,
      from,
      to,
      mode,
      service,
      status,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (therapistId) {
      query.therapist = therapistId;
    }

    if (service) {
      query.service = service;
    }

    if (mode) {
      query.mode = mode;
    }

    if (
      status &&
      status !== 'all'
    ) {
      query.status = status;
    }

    if (from || to) {
      query.startAt = {};

      if (from) {
        query.startAt.$gte =
          new Date(from);
      }

      if (to) {
        query.startAt.$lte =
          new Date(to);
      }
    }

    const skip =
      (Number(page) - 1) *
      Number(limit);

    const [items, total] =
      await Promise.all([

        Slot.find(query)
          .populate(
            'appointment',
            'bookingCode'
          )
          .populate(
            'service',
            'name'
          )
          .populate({
            path: 'therapist',
            populate: {
              path: 'user',
              select: 'name',
            },
          })
          .sort({
            startAt: 1,
          })
          .skip(skip)
          .limit(Number(limit))
          .lean(),

        Slot.countDocuments(query),
      ]);

    ok(res, {
      items,

      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(
          total / Number(limit)
        ),
      },
    });
  }
);

export const checkSelectedSlot = asyncHandler(async (req, res) => {
  const { slotId, therapistId, mode ,service} = req.body;
  console.log('Checking selected slot with data:', { slotId, therapistId, mode, service });
  const slot = await slotSvc.checkSelectedSlot({ slotId, therapistId, mode, service });
  console.log('Checked selected slot:', slot);
  ok(res, slot);
});

export const holdSlot = asyncHandler(async (req, res) => {
  const slot = await bookingSvc.holdSlot({ slotId: req.params.slotId, userId: req.user.id });
  ok(res, slot, 'Slot held');
});

export const releaseHold = asyncHandler(async (req, res) => {
  await bookingSvc.releaseHold({ slotId: req.params.slotId, userId: req.user.id });
  ok(res, null, 'Hold released');
});

export const book = asyncHandler(async (req, res) => {
  const appt = await bookingSvc.bookSlot({
    userId: req.user.id,
    slotId: req.body.slotId,
    serviceId: req.body.serviceId,
    mode: req.body.mode,
    intake: req.body.intake,
  });
  ok(res, appt, 'Booked', 201);
});

export const myAppointments = asyncHandler(async (req, res) => {
  const list = await Appointment.find({ user: req.user.id })
    .populate('therapist', 'slug title').populate('service', 'name slug')
    .sort({ startAt: -1 });
  ok(res, list);
});

export const cancel = asyncHandler(async (req, res) => {
  const appt = await bookingSvc.cancelAppointment({
    appointmentId: req.params.id, byUserId: req.user.id, reason: req.body?.reason,
  });
  ok(res, appt, 'Cancelled');
});

export const reschedule = asyncHandler(async (req, res) => {
  const appt = await bookingSvc.rescheduleAppointment({
    appointmentId: req.params.id, newSlotId: req.body.newSlotId, userId: req.user.id,
  });
  ok(res, appt, 'Rescheduled');
});


export const adminBlockSlot=asyncHandler(async(req,res)=>{

  const slot=await bookingSvc.toggleSlotBlock({
    slotId:req.params.slotId,
  });

  ok(
    res,
    slot,
    slot.status==='blocked'
      ?'Slot blocked'
      :'Slot unblocked'
  );
});

export const adminUnblockSlot = asyncHandler(async (req, res) => {
  const slot = await bookingSvc.adminUnblockSlot({ slotId: req.params.slotId });
  ok(res, slot, 'Slot unblocked');
});