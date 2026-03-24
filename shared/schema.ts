import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contact submissions schema
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  phone: true,
  subject: true,
  message: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

// Admission inquiries schema
export const admissionInquiries = pgTable("admission_inquiries", {
  id: serial("id").primaryKey(),
  admissionNumber: integer("admission_number"),
  parentName: text("parent_name"),
  email: text("email"),
  phone: text("phone"),
  childName: text("child_name").notNull(),
  grade: text("grade").notNull(),
  dob: text("dob").notNull(),
  gender: text("gender").notNull(),
  address: text("address").notNull(),
  fatherName: text("father_name").notNull(),
  motherName: text("mother_name").notNull(),
  fatherOccupation: text("father_occupation"),
  motherOccupation: text("mother_occupation"),
  previousSchool: text("previous_school"),
  bloodGroup: text("blood_group"),
  academicYear: text("academic_year").notNull(),
  mobileNo: text("mobile_no"),
  alternatePhone: text("alternate_phone"),
  emailId: text("email_id"),
  studentPhoto: text("student_photo"),
  pdfBase64: text("pdf_base64"),
  message: text("message"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertAdmissionInquirySchema = createInsertSchema(admissionInquiries, {
  admissionNumber: z.number().optional().nullable(),
  childName: z.string().min(2, "Name must be at least 2 characters"),
}).extend({
  parentName: z.string().optional().nullable(),
  email: z.string().email("Invalid email").optional().or(z.literal("")).nullable(),
  phone: z.string().min(10, "Phone must be at least 10 digits").optional().nullable(),
  grade: z.string().min(1, "Grade is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  address: z.string().min(1, "Address is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  fatherOccupation: z.string().optional().nullable(),
  motherOccupation: z.string().optional().nullable(),
  previousSchool: z.string().optional().nullable(),
  bloodGroup: z.string().optional().nullable(),
  mobileNo: z.string().optional().nullable(),
  alternatePhone: z.string().optional().nullable(),
  emailId: z.string().optional().nullable(),
  studentPhoto: z.string().min(1, "Student photo is required"),
  message: z.string().optional().nullable(),
});

export type InsertAdmissionInquiry = z.infer<typeof insertAdmissionInquirySchema>;
export type AdmissionInquiry = typeof admissionInquiries.$inferSelect;

// Newsletter subscriptions schema
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).pick({
  email: true,
  name: true,
});

export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
