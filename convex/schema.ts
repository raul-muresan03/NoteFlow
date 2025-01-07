import { defineSchema, defineTable } from "convex/server";             //in schema.ts descriem baza de date, cu toate coloanele ei 
import { v } from "convex/values";

export default defineSchema({
    documents: defineTable({
        title: v.string(),
        userId: v.string(),
        isArchived: v.boolean(),
        parentDocument: v.optional(v.id("documents")),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.boolean(),
    })
    .index("by_user", ["userId"])                                     //pentru cautare mai rapida, dupa userID dar si printr-o combinatie de userID si parentDocument
    .index("by_user_parent", ["userId", "parentDocument"])

});