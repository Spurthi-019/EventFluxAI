import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  events: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    slug: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    locationType: v.union(v.literal("physical"), v.literal("online")),
    location: v.string(),
    capacity: v.number(),
    registrationCount: v.number(),
    ticketType: v.union(v.literal("free"), v.literal("paid")),
    ticketPrice: v.optional(v.number()),
    coverImage: v.string(),
    themeColor: v.string(),
    organizerId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_organizer", ["organizerId"]),

  registrations: defineTable({
    eventId: v.id("events"),
    userId: v.string(),
    attendeeName: v.string(),
    attendeeEmail: v.string(),
    registeredAt: v.number(),
    checkedIn: v.boolean(),
    checkedInAt: v.optional(v.number()),
    qrCode: v.string(),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_event_and_user", ["eventId", "userId"]),
});
