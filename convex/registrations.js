import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get registrations for a specific event
export const getEventRegistrations = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    return registrations;
  },
});

// Get registrations for a specific user
export const getUserRegistrations = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Fetch event details for each registration
    const registrationsWithEvents = await Promise.all(
      registrations.map(async (reg) => {
        const event = await ctx.db.get(reg.eventId);
        return { ...reg, event };
      })
    );

    return registrationsWithEvents;
  },
});

// Register user for an event
export const registerForEvent = mutation({
  args: {
    eventId: v.id("events"),
    attendeeName: v.string(),
    attendeeEmail: v.string(),
    attendeePhone: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("Must be logged in to register for events");
    }

    const userId = identity.subject;

    // Check if user already registered
    const existingRegistration = await ctx.db
      .query("registrations")
      .withIndex("by_event_and_user", (q) =>
        q.eq("eventId", args.eventId).eq("userId", userId)
      )
      .first();

    if (existingRegistration) {
      throw new Error("You are already registered for this event");
    }

    // Check event capacity
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    const registrationCount = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .count();

    if (registrationCount >= event.capacity) {
      throw new Error("Event is at full capacity");
    }

    // Create registration
    const registrationId = await ctx.db.insert("registrations", {
      eventId: args.eventId,
      userId: userId,
      attendeeName: args.attendeeName,
      attendeeEmail: args.attendeeEmail,
      attendeePhone: args.attendeePhone,
      registeredAt: new Date().toISOString(),
      checkedIn: false,
    });

    return registrationId;
  },
});

// Unregister user from an event
export const unregisterFromEvent = mutation({
  args: {
    registrationId: v.id("registrations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Must be logged in to unregister");
    }

    const userId = identity.subject;

    // Get registration
    const registration = await ctx.db.get(args.registrationId);

    if (!registration) {
      throw new Error("Registration not found");
    }

    // Verify ownership
    if (registration.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Delete registration
    await ctx.db.delete(args.registrationId);

    return registration;
  },
});

// Check in attendee (for event organizers)
export const checkInAttendee = mutation({
  args: {
    registrationId: v.id("registrations"),
  },
  handler: async (ctx, args) => {
    const registration = await ctx.db.get(args.registrationId);

    if (!registration) {
      throw new Error("Registration not found");
    }

    // Update check-in status
    await ctx.db.patch(args.registrationId, {
      checkedIn: true,
      checkedInAt: new Date().toISOString(),
    });

    return registration;
  },
});
