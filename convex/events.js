import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new event
export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    locationType: v.union(v.literal("physical"), v.literal("online")),
    location: v.string(),
    capacity: v.number(),
    ticketType: v.union(v.literal("free"), v.literal("paid")),
    ticketPrice: v.optional(v.number()),
    coverImage: v.string(),
    themeColor: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const slug = args.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const event = await ctx.db.insert("events", {
      title: args.title,
      description: args.description,
      category: args.category,
      slug,
      startDate: args.startDate,
      endDate: args.endDate,
      locationType: args.locationType,
      location: args.location,
      capacity: args.capacity,
      ticketType: args.ticketType,
      ticketPrice: args.ticketPrice,
      coverImage: args.coverImage,
      themeColor: args.themeColor,
      organizerId: identity.subject,
      registrationCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return event;
  },
});

// Get all events
export const getAllEvents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("events").collect();
  },
});

// Get my events
export const getMyEvents = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("organizerId"), identity.subject))
      .collect();
  },
});

// Get event by slug
export const getEventBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();
  },
});

// Delete event
export const deleteEvent = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const event = await ctx.db.get(args.eventId);
    if (!event || event.organizerId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    // Delete all registrations for this event
    const registrations = await ctx.db
      .query("registrations")
      .filter((q) => q.eq(q.field("eventId"), args.eventId))
      .collect();

    for (const reg of registrations) {
      await ctx.db.delete(reg._id);
    }

    // Delete the event
    await ctx.db.delete(args.eventId);
  },
});
