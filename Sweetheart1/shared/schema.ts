import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  completed: boolean("completed").default(false).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const hugs = pgTable("hugs", {
  id: serial("id").primaryKey(),
  hug_type: text("hug_type").notNull(),
  count: integer("count").default(1).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
