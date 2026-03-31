import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

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
  
  // Extended Profile
  bloodGroup: text("blood_group"),
  emergencyContact: text("emergency_contact"),
  
  // Document Vault
  aadhaarStatus: text("aadhaar_status").default("missing").notNull(), // verified, missing
  birthCertStatus: text("birth_cert_status").default("missing").notNull(),
  tcStatus: text("tc_status").default("missing").notNull(),
  aadhaarUrl: text("aadhaar_url"),
  birthCertUrl: text("birth_cert_url"),
  tcUrl: text("tc_url"),

  admittedAt: timestamp("admitted_at").defaultNow().notNull(),
});

export const insertStudentSchema = createInsertSchema(students);
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

// Student Academics
export const studentAcademics = pgTable("student_academics", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  academicYear: text("academic_year").notNull(),
  grade: text("grade").notNull(),
  reportCardUrl: text("report_card_url"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStudentAcademicSchema = createInsertSchema(studentAcademics);
export type InsertStudentAcademic = z.infer<typeof insertStudentAcademicSchema>;
export type StudentAcademic = typeof studentAcademics.$inferSelect;

// Fee Summary (Annual Ledger Top Level)
export const studentFeeSummaries = pgTable("student_fee_summaries", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  academicYear: text("academic_year").notNull(),
  totalAnnualFees: integer("total_annual_fees").notNull().default(0),
  totalPaid: integer("total_paid").notNull().default(0),
  balance: integer("balance").notNull().default(0),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const insertStudentFeeSummarySchema = createInsertSchema(studentFeeSummaries);
export type InsertStudentFeeSummary = z.infer<typeof insertStudentFeeSummarySchema>;
export type StudentFeeSummary = typeof studentFeeSummaries.$inferSelect;

// Fee Transactions (Drill-down history)
export const feeTransactions = pgTable("fee_transactions", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  amount: integer("amount").notNull(),
  paymentDate: timestamp("payment_date").defaultNow().notNull(),
  paymentMethod: text("payment_method").notNull(), // Cash, UPI, Check, Bank Transfer
  refId: text("ref_id"), // Transaction ID or Receipt No
  category: text("category").notNull(), // Tuition, Exam, Bus, Admission
  status: text("status").default("success").notNull(), // success, pending, failed
});

export const insertFeeTransactionSchema = createInsertSchema(feeTransactions);
export type InsertFeeTransaction = z.infer<typeof insertFeeTransactionSchema>;
export type FeeTransaction = typeof feeTransactions.$inferSelect;

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
  linkedin: text("linkedin"),
  bio: text("bio"),
  quote: text("quote"),
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
  imageUrl: text("image_url"),
  linkUrl: text("link_url"),
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
  startDate: text("start_date"),
  endDate: text("end_date"),
});

// Media Assets Library
export const mediaAssets = pgTable("media_assets", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  url: text("url").notNull(),
  fileType: text("file_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  dimensions: text("dimensions"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

// Student Updates Bar
export const studentNotifications = pgTable("student_notifications", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Website Visit Analytics
export const websiteVisits = pgTable("website_visits", {
  id: serial("id").primaryKey(),
  date: text("date").notNull().unique(), // ISO date string YYYY-MM-DD
  hits: integer("hits").notNull().default(0),
  visitors: integer("visitors").notNull().default(0),
});

// For tracking unique visitors per day (IP-based + Privacy oriented)
export const visitorLogs = pgTable("visitor_logs", {
  id: serial("id").primaryKey(),
  ipHash: text("ip_hash").notNull(),
  visitDate: text("visit_date").notNull(), // YYYY-MM-DD
}, (t) => ({
  unique_visitor_per_day: sql`UNIQUE(${t.ipHash}, ${t.visitDate})`
}));

export const insertSliderSchema = createInsertSchema(sliders);
export const insertNewsTickerSchema = createInsertSchema(newsTicker);
export const insertGalleryEventSchema = createInsertSchema(galleryEvents);
export const insertGalleryImageSchema = createInsertSchema(galleryImages);
export const insertPopupSchema = createInsertSchema(popups);
export const insertMediaAssetSchema = createInsertSchema(mediaAssets);
export const insertStudentNotificationSchema = createInsertSchema(studentNotifications);
export const insertWebsiteVisitSchema = createInsertSchema(websiteVisits);
export const insertVisitorLogSchema = createInsertSchema(visitorLogs);

export type InsertSlider = z.infer<typeof insertSliderSchema>;
export type InsertNewsTicker = z.infer<typeof insertNewsTickerSchema>;
export type InsertGalleryEvent = z.infer<typeof insertGalleryEventSchema>;
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type InsertPopup = z.infer<typeof insertPopupSchema>;
export type InsertMediaAsset = z.infer<typeof insertMediaAssetSchema>;
export type InsertStudentNotification = z.infer<typeof insertStudentNotificationSchema>;
export type InsertWebsiteVisit = z.infer<typeof insertWebsiteVisitSchema>;
export type InsertVisitorLog = z.infer<typeof insertVisitorLogSchema>;

export type Slider = typeof sliders.$inferSelect;
export type NewsTicker = typeof newsTicker.$inferSelect;
export type GalleryEvent = typeof galleryEvents.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type Popup = typeof popups.$inferSelect;
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type StudentNotification = typeof studentNotifications.$inferSelect;
export type WebsiteVisit = typeof websiteVisits.$inferSelect;
export type VisitorLog = typeof visitorLogs.$inferSelect;
