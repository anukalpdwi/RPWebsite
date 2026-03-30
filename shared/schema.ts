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
  status: text("status").default("pending").notNull(), // pending, approved, rejected
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

// Students table
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  rollNumber: text("roll_number").notNull().unique(),
  name: text("name").notNull(),
  grade: text("grade").notNull(),
  dob: text("dob").notNull(),
  gender: text("gender").notNull(),
  address: text("address").notNull(),
  fatherName: text("father_name").notNull(),
  motherName: text("mother_name").notNull(),
  parentPhone: text("parent_phone").notNull(),
  parentEmail: text("parent_email"),
  photoUrl: text("photo_url"),
  academicYear: text("academic_year").notNull(),
  admittedAt: timestamp("admitted_at").defaultNow().notNull(),
});

export const insertStudentSchema = createInsertSchema(students);
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

// Staff/Faculty table
export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(), // Teacher, Principal, Admin, etc.
  department: text("department").notNull(),
  qualification: text("qualification"),
  experience: text("experience"),
  photoUrl: text("photo_url"),
  phone: text("phone"),
  email: text("email"),
  order: integer("order").default(0),
});

export const insertStaffSchema = createInsertSchema(staff);
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type Staff = typeof staff.$inferSelect;

// Homepage Sliders
export const sliders = pgTable("sliders", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  title: text("title"),
  description: text("description"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true).notNull(),
});

// News Ticker
export const newsTicker = pgTable("news_ticker", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  priority: text("priority").default("normal").notNull(), // normal, high
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Gallery Events
export const galleryEvents = pgTable("gallery_events", {
  id: serial("id").primaryKey(),
  eventName: text("event_name").notNull(),
  description: text("description"),
  eventDate: text("event_date"),
  coverImageUrl: text("cover_image_url"),
});

// Gallery Images
export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => galleryEvents.id).notNull(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
});

// Popup Manager
export const popups = pgTable("popups", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url"),
  linkUrl: text("link_url"),
  isActive: boolean("is_active").default(false).notNull(),
  type: text("type").default("image").notNull(), // image, text, info
});

export const insertSliderSchema = createInsertSchema(sliders);
export const insertNewsTickerSchema = createInsertSchema(newsTicker);
export const insertGalleryEventSchema = createInsertSchema(galleryEvents);
export const insertGalleryImageSchema = createInsertSchema(galleryImages);
export const insertPopupSchema = createInsertSchema(popups);

export type InsertSlider = z.infer<typeof insertSliderSchema>;
export type InsertNewsTicker = z.infer<typeof insertNewsTickerSchema>;
export type InsertGalleryEvent = z.infer<typeof insertGalleryEventSchema>;
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type InsertPopup = z.infer<typeof insertPopupSchema>;

export type Slider = typeof sliders.$inferSelect;
export type NewsTicker = typeof newsTicker.$inferSelect;
export type GalleryEvent = typeof galleryEvents.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type Popup = typeof popups.$inferSelect;
