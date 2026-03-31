import { 
  users, type User, type InsertUser,
  contactSubmissions, type ContactSubmission, type InsertContact,
  admissionInquiries, type AdmissionInquiry, type InsertAdmissionInquiry,
  newsletterSubscriptions, type NewsletterSubscription, type InsertNewsletterSubscription,
  students, type Student, type InsertStudent,
  staff, type Staff, type InsertStaff,
  sliders, type Slider, type InsertSlider,
  newsTicker, type NewsTicker, type InsertNewsTicker,
  galleryEvents, type GalleryEvent, type InsertGalleryEvent,
  galleryImages, type GalleryImage, type InsertGalleryImage,
  popups, type Popup, type InsertPopup,
  mediaAssets, type MediaAsset, type InsertMediaAsset,
  studentNotifications, type StudentNotification, type InsertStudentNotification,
  studentAcademics, type StudentAcademic, type InsertStudentAcademic,
  studentFeeSummaries, type StudentFeeSummary, type InsertStudentFeeSummary,
  feeTransactions, type FeeTransaction, type InsertFeeTransaction,
  websiteVisits, type WebsiteVisit,
  visitorLogs
} from "../shared/schema.js";
import { db } from "./db.js";
import { eq, desc, sql } from "drizzle-orm";
import fs from "fs/promises";
import * as fs_sync from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.VERCEL ? "/tmp" : path.join(__dirname, "..", "data");
const ADMISSIONS_FILE = path.join(DATA_DIR, "admissions_backup.json");

// Storage interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact submission methods
  getContactSubmission(id: number): Promise<ContactSubmission | undefined>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContact): Promise<ContactSubmission>;
  
  // Admission inquiry methods
  getAdmissionInquiry(id: number): Promise<AdmissionInquiry | undefined>;
  getAllAdmissionInquiries(): Promise<AdmissionInquiry[]>;
  createAdmissionInquiry(inquiry: InsertAdmissionInquiry): Promise<AdmissionInquiry>;
  updateAdmissionInquiry(id: number, data: Partial<AdmissionInquiry>): Promise<AdmissionInquiry | undefined>;
  deleteAdmissionInquiry(id: number): Promise<void>;
  
  // Newsletter subscription methods
  getNewsletterSubscription(id: number): Promise<NewsletterSubscription | undefined>;
  getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined>;
  getAllNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;
  createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;

  // Student methods
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByRollNumber(rollNumber: string): Promise<Student | undefined>;
  getAllStudents(): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, data: Partial<Student>): Promise<Student | undefined>;
  deleteStudent(id: number): Promise<void>;

  // 360 Degree Profile methods
  getStudentDetails(id: number): Promise<{
    student: Student;
    academics: StudentAcademic[];
    feeSummary: StudentFeeSummary | undefined;
    feeTransactions: FeeTransaction[];
  } | undefined>;
  createStudentAcademic(data: InsertStudentAcademic): Promise<StudentAcademic>;
  updateStudentFeeSummary(studentId: number, academicYear: string, data: Partial<StudentFeeSummary>): Promise<StudentFeeSummary | undefined>;
  createFeeTransaction(data: InsertFeeTransaction): Promise<FeeTransaction>;

  // Staff methods
  getStaff(id: number): Promise<Staff | undefined>;
  getAllStaff(): Promise<Staff[]>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  updateStaff(id: number, data: Partial<Staff>): Promise<Staff | undefined>;
  deleteStaff(id: number): Promise<void>;

  // Content methods
  getAllSliders(): Promise<Slider[]>;
  createSlider(slider: InsertSlider): Promise<Slider>;
  updateSlider(id: number, data: Partial<Slider>): Promise<Slider | undefined>;
  deleteSlider(id: number): Promise<void>;

  getAllNewsTickers(): Promise<NewsTicker[]>;
  createNewsTicker(ticker: InsertNewsTicker): Promise<NewsTicker>;
  updateNewsTicker(id: number, data: Partial<NewsTicker>): Promise<NewsTicker | undefined>;
  deleteNewsTicker(id: number): Promise<void>;

  getAllPopups(): Promise<Popup[]>;
  createPopup(popup: InsertPopup): Promise<Popup>;
  updatePopup(id: number, data: Partial<Popup>): Promise<Popup | undefined>;
  deletePopup(id: number): Promise<void>;

  // Gallery
  getAllGalleryEvents(): Promise<GalleryEvent[]>;
  createGalleryEvent(event: InsertGalleryEvent): Promise<GalleryEvent>;
  updateGalleryEvent(id: number, data: Partial<InsertGalleryEvent>): Promise<GalleryEvent | undefined>;
  deleteGalleryEvent(id: number): Promise<void>;
  
  getGalleryImagesByEvent(eventId: number): Promise<GalleryImage[]>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  deleteGalleryImage(id: number): Promise<void>;

  // Media Assets
  getAllMediaAssets(): Promise<MediaAsset[]>;
  getMediaAsset(id: number): Promise<MediaAsset | undefined>;
  createMediaAsset(asset: InsertMediaAsset): Promise<MediaAsset>;
  deleteMediaAsset(id: number): Promise<void>;

  // Student Notifications
  getAllStudentNotifications(): Promise<StudentNotification[]>;
  createStudentNotification(notification: InsertStudentNotification): Promise<StudentNotification>;
  updateStudentNotification(id: number, data: Partial<StudentNotification>): Promise<StudentNotification | undefined>;
  deleteStudentNotification(id: number): Promise<void>;

  // Website Visit Analytics
  recordVisit(ip: string): Promise<void>;
  getVisitStats(): Promise<{ date: string; hits: number; visitors: number }[]>;

  // Dashboard stats
  getDashboardStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username: string) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser: InsertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getContactSubmission(id: number) {
    const [submission] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id));
    return submission;
  }
  async getAllContactSubmissions() {
    return await db.select().from(contactSubmissions);
  }
  async createContactSubmission(submission: InsertContact) {
    const [newSubmission] = await db.insert(contactSubmissions).values(submission).returning();
    return newSubmission;
  }

  async getAdmissionInquiry(id: number) {
    const [inquiry] = await db.select().from(admissionInquiries).where(eq(admissionInquiries.id, id));
    return inquiry;
  }
  async getAllAdmissionInquiries() {
    return await db.select().from(admissionInquiries).orderBy(desc(admissionInquiries.submittedAt));
  }
  
  async createAdmissionInquiry(inquiry: InsertAdmissionInquiry): Promise<AdmissionInquiry> {
    // 1. Find the next admission number
    const result = await db
      .select({ max: sql<number>`max(${admissionInquiries.admissionNumber})` })
      .from(admissionInquiries);
    
    const lastAdmissionNo = result[0]?.max || 26000;
    const admissionNumber = lastAdmissionNo + 1;
    
    console.log(`[DB STORAGE] Calculated next admission number: ${admissionNumber}`);

    // 2. Insert with the calculated number
    const [newInquiry] = await db.insert(admissionInquiries).values({
      ...inquiry,
      admissionNumber,
      submittedAt: new Date()
    }).returning();
    
    return newInquiry;
  }

  async updateAdmissionInquiry(id: number, data: Partial<AdmissionInquiry>) {
    const [updated] = await db.update(admissionInquiries).set(data).where(eq(admissionInquiries.id, id)).returning();
    return updated;
  }
  
  async deleteAdmissionInquiry(id: number) {
    await db.delete(admissionInquiries).where(eq(admissionInquiries.id, id));
  }

  async getNewsletterSubscription(id: number) {
    const [sub] = await db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.id, id));
    return sub;
  }
  async getNewsletterSubscriptionByEmail(email: string) {
    const [sub] = await db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.email, email));
    return sub;
  }
  async getAllNewsletterSubscriptions() {
    return await db.select().from(newsletterSubscriptions);
  }
  async createNewsletterSubscription(subscription: InsertNewsletterSubscription) {
    const [newSub] = await db.insert(newsletterSubscriptions).values(subscription).returning();
    return newSub;
  }

  // Student methods
  async getStudent(id: number) {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student;
  }
  async getStudentByRollNumber(rollNumber: string) {
    const [student] = await db.select().from(students).where(eq(students.rollNumber, rollNumber));
    return student;
  }
  async getAllStudents() {
    return await db.select().from(students).orderBy(desc(students.admittedAt));
  }
  async createStudent(insertStudent: InsertStudent) {
    // Explicitly set 360-degree profile document defaults
    const studentData = {
      ...insertStudent,
      aadhaarStatus: insertStudent.aadhaarStatus || "missing",
      birthCertStatus: insertStudent.birthCertStatus || "missing",
      tcStatus: insertStudent.tcStatus || "missing",
      academicYear: insertStudent.academicYear || "2026-27", // Strict default to prevent null constraint error
    };

    const [newStudent] = await db.insert(students).values(studentData).returning();
    
    // Auto-initialize Fee Summary for the current academic year with zero balances
    await db.insert(studentFeeSummaries).values({
      studentId: newStudent.id,
      academicYear: newStudent.academicYear,
      totalAnnualFees: 0,
      totalPaid: 0,
      balance: 0
    });
    
    return newStudent;
  }
  async updateStudent(id: number, data: Partial<Student>) {
    const [updated] = await db.update(students).set(data).where(eq(students.id, id)).returning();
    return updated;
  }
  async deleteStudent(id: number) {
    await db.delete(feeTransactions).where(eq(feeTransactions.studentId, id));
    await db.delete(studentFeeSummaries).where(eq(studentFeeSummaries.studentId, id));
    await db.delete(studentAcademics).where(eq(studentAcademics.studentId, id));
    await db.delete(students).where(eq(students.id, id));
  }

  // 360 Degree Profile methods
  async getStudentDetails(id: number) {
    const student = await this.getStudent(id);
    if (!student) return undefined;
    
    const academics = await db.select().from(studentAcademics).where(eq(studentAcademics.studentId, id));
    
    const [feeSummary] = await db.select()
                           .from(studentFeeSummaries)
                           .where(eq(studentFeeSummaries.studentId, id))
                           .orderBy(desc(studentFeeSummaries.academicYear))
                           .limit(1);
                           
    const transactions = await db.select()
                           .from(feeTransactions)
                           .where(eq(feeTransactions.studentId, id))
                           .orderBy(desc(feeTransactions.paymentDate));

    return {
      student,
      academics,
      feeSummary,
      feeTransactions: transactions
    };
  }

  async createStudentAcademic(data: InsertStudentAcademic) {
    const [academic] = await db.insert(studentAcademics).values(data).returning();
    return academic;
  }

  async updateStudentFeeSummary(studentId: number, academicYear: string, data: Partial<StudentFeeSummary>) {
    const [existing] = await db.select()
                          .from(studentFeeSummaries)
                          .where(sql`${studentFeeSummaries.studentId} = ${studentId} AND ${studentFeeSummaries.academicYear} = ${academicYear}`);
                          
    if (!existing) {
       const [newSummary] = await db.insert(studentFeeSummaries).values({
         studentId,
         academicYear,
         totalAnnualFees: data.totalAnnualFees || 0,
         totalPaid: data.totalPaid || 0,
         balance: data.balance || 0
       }).returning();
       return newSummary;
    }
    
    const [updated] = await db.update(studentFeeSummaries)
                          .set({ ...data, lastUpdated: new Date() })
                          .where(eq(studentFeeSummaries.id, existing.id))
                          .returning();
    return updated;
  }

  async createFeeTransaction(data: InsertFeeTransaction) {
    const [transaction] = await db.insert(feeTransactions).values(data).returning();
    return transaction;
  }

  // Staff methods
  async getStaff(id: number) {
    const [item] = await db.select().from(staff).where(eq(staff.id, id));
    return item;
  }
  async getAllStaff() {
    return await db.select().from(staff).orderBy(staff.order);
  }
  async createStaff(insertStaff: InsertStaff) {
    const [newItem] = await db.insert(staff).values(insertStaff).returning();
    return newItem;
  }
  async updateStaff(id: number, data: Partial<Staff>) {
    const [updated] = await db.update(staff).set(data).where(eq(staff.id, id)).returning();
    return updated;
  }
  async deleteStaff(id: number) {
    await db.delete(staff).where(eq(staff.id, id));
  }

  // Content methods
  async getAllSliders() {
    return await db.select().from(sliders).orderBy(sliders.order);
  }
  async createSlider(insertSlider: InsertSlider) {
    const [newItem] = await db.insert(sliders).values(insertSlider).returning();
    return newItem;
  }
  async updateSlider(id: number, data: Partial<Slider>) {
    const [updated] = await db.update(sliders).set(data).where(eq(sliders.id, id)).returning();
    return updated;
  }
  async deleteSlider(id: number) {
    await db.delete(sliders).where(eq(sliders.id, id));
  }

  async getAllNewsTickers() {
    return await db.select().from(newsTicker).orderBy(desc(newsTicker.createdAt));
  }
  async createNewsTicker(insertTicker: InsertNewsTicker) {
    const [newItem] = await db.insert(newsTicker).values(insertTicker).returning();
    return newItem;
  }
  async updateNewsTicker(id: number, data: Partial<NewsTicker>) {
    const [updated] = await db.update(newsTicker).set(data).where(eq(newsTicker.id, id)).returning();
    return updated;
  }
  async deleteNewsTicker(id: number) {
    await db.delete(newsTicker).where(eq(newsTicker.id, id));
  }

  async getAllPopups() {
    return await db.select().from(popups);
  }
  async createPopup(insertPopup: InsertPopup) {
    const [newItem] = await db.insert(popups).values(insertPopup).returning();
    return newItem;
  }
  async updatePopup(id: number, data: Partial<Popup>) {
    const [updated] = await db.update(popups).set(data).where(eq(popups.id, id)).returning();
    return updated;
  }
  
  async deletePopup(id: number) {
    await db.delete(popups).where(eq(popups.id, id));
  }

  // Gallery
  async getAllGalleryEvents() {
    return await db.select().from(galleryEvents);
  }
  async createGalleryEvent(event: InsertGalleryEvent) {
    const [newEvent] = await db.insert(galleryEvents).values(event).returning();
    return newEvent;
  }
  async updateGalleryEvent(id: number, event: Partial<InsertGalleryEvent>) {
    const [updated] = await db.update(galleryEvents).set(event).where(eq(galleryEvents.id, id)).returning();
    return updated;
  }
  async deleteGalleryEvent(id: number) {
    await db.delete(galleryImages).where(eq(galleryImages.eventId, id));
    await db.delete(galleryEvents).where(eq(galleryEvents.id, id));
  }

  async getGalleryImagesByEvent(eventId: number) {
    return await db.select().from(galleryImages).where(eq(galleryImages.eventId, eventId));
  }
  async createGalleryImage(image: InsertGalleryImage) {
    const [newImg] = await db.insert(galleryImages).values(image).returning();
    return newImg;
  }
  async deleteGalleryImage(id: number) {
    await db.delete(galleryImages).where(eq(galleryImages.id, id));
  }

  // Media Assets
  async getAllMediaAssets() {
    return await db.select().from(mediaAssets).orderBy(desc(mediaAssets.uploadedAt));
  }
  async getMediaAsset(id: number) {
    const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id));
    return asset;
  }
  async createMediaAsset(asset: InsertMediaAsset) {
    const [newAsset] = await db.insert(mediaAssets).values(asset).returning();
    return newAsset;
  }
  async deleteMediaAsset(id: number) {
    await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
  }

  // Student Notifications
  async getAllStudentNotifications() {
    const items = await db.select().from(studentNotifications).orderBy(desc(studentNotifications.createdAt));
    console.log(`[STORAGE] Fetched ${items.length} notifications from DB`);
    return items;
  }
  async createStudentNotification(notification: InsertStudentNotification) {
    console.log("[STORAGE] Attempting to insert:", notification);
    const [newItem] = await db.insert(studentNotifications).values(notification).returning();
    console.log("[STORAGE] Successfully inserted:", newItem);
    return newItem;
  }
  async updateStudentNotification(id: number, data: Partial<StudentNotification>) {
    const [updated] = await db.update(studentNotifications).set(data).where(eq(studentNotifications.id, id)).returning();
    return updated;
  }
  async deleteStudentNotification(id: number) {
    await db.delete(studentNotifications).where(eq(studentNotifications.id, id));
  }

  // Dashboard Stats
  async getDashboardStats() {
    const [studentCount] = await db.select({ count: sql<number>`count(*)` }).from(students);
    const [staffCount] = await db.select({ count: sql<number>`count(*)` }).from(staff);
    const [pendingAdmissions] = await db.select({ count: sql<number>`count(*)` }).from(admissionInquiries).where(eq(admissionInquiries.status, 'pending'));
    const [activeNotices] = await db.select({ count: sql<number>`count(*)` }).from(newsTicker).where(eq(newsTicker.isActive, true));

    const admissionsByStatus = await db.select({
      status: admissionInquiries.status,
      count: sql<number>`count(*)`
    }).from(admissionInquiries).groupBy(admissionInquiries.status);

    const studentsByGrade = await db.select({
      grade: students.grade,
      count: sql<number>`count(*)`
    }).from(students).groupBy(students.grade);

    const visitStats = await this.getVisitStats();

    return {
      totalStudents: studentCount.count,
      totalStaff: staffCount.count,
      pendingAdmissions: pendingAdmissions.count,
      activeNotices: activeNotices.count,
      admissionsByStatus,
      studentsByGrade,
      visitStats
    };
  }

  // Website Visit Analytics
  async recordVisit(ip: string) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const ipHash = crypto.createHash('sha256').update(ip + (process.env.IP_SALT || 'rppublic')).digest('hex');

    try {
      await db.transaction(async (tx) => {
        // 1. Try to record unique visitor
        let isNewVisitor = false;
        try {
          await tx.insert(visitorLogs).values({ 
            ipHash, 
            visitDate: today 
          });
          isNewVisitor = true;
        } catch (e) {
          // IP already logged for today, not a new visitor
        }

        // 2. Update stats
        const [existing] = await tx.select().from(websiteVisits).where(eq(websiteVisits.date, today)).limit(1);

        if (!existing) {
          await tx.insert(websiteVisits).values({
            date: today,
            hits: 1,
            visitors: isNewVisitor ? 1 : 0
          });
        } else {
          await tx.update(websiteVisits)
            .set({
              hits: sql`${websiteVisits.hits} + 1`,
              visitors: isNewVisitor ? sql`${websiteVisits.visitors} + 1` : websiteVisits.visitors
            })
            .where(eq(websiteVisits.id, existing.id));
        }
      });
    } catch (e) {
      console.error('[ANALYTICS] Failed to record visit:', e);
    }
  }

  async getVisitStats(): Promise<{ date: string; hits: number; visitors: number }[]> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
      const startDate = thirtyDaysAgo.toISOString().split('T')[0];

      const rows = await db.select()
        .from(websiteVisits)
        .where(sql`${websiteVisits.date} >= ${startDate}`)
        .orderBy(websiteVisits.date);

      return rows.map(r => ({ date: r.date, hits: r.hits, visitors: r.visitors }));
    } catch (e) {
      return [];
    }
  }
}

class MockStorage implements IStorage {
  private users: User[] = [];
  private contactSubmissions: ContactSubmission[] = [];
  private admissionInquiries: AdmissionInquiry[] = [];
  private newsletterSubscriptions: NewsletterSubscription[] = [];
  private studentNotifications: StudentNotification[] = [];
  private staff: Staff[] = [];
  private currentId = 1;

  constructor() {
    this.loadAdmissionsSync();
  }

  private loadAdmissionsSync() {
    console.log(`[STORAGE] Initializing storage from CWD: ${process.cwd()}`);
    console.log(`[STORAGE] Target backup file: ${path.resolve(ADMISSIONS_FILE)}`);
    try {
      if (fs_sync.existsSync(ADMISSIONS_FILE)) {
        const data = fs_sync.readFileSync(ADMISSIONS_FILE, "utf-8");
        this.admissionInquiries = JSON.parse(data);
        console.log(`[STORAGE] Loaded ${this.admissionInquiries.length} inquiries from backup.`);
        if (this.admissionInquiries.length > 0) {
          const maxId = Math.max(...this.admissionInquiries.map(i => i.id));
          const maxAdm = Math.max(26000, ...this.admissionInquiries.map(i => i.admissionNumber || 0));
          this.currentId = maxId + 1;
          console.log(`[STORAGE] Resumed from entry ${maxId} (Next ID: ${this.currentId}) and Admission No: ${maxAdm}`);
        }
      } else {
        console.log(`[STORAGE] No backup file found at ${ADMISSIONS_FILE}`);
      }
    } catch (e) {
      console.error("Backup load error:", e);
    }
  }

  async getUser(id: number) { return this.users.find(u => u.id === id); }
  async getUserByUsername(username: string) { return this.users.find(u => u.username === username); }
  async createUser(insertUser: InsertUser): Promise<User> {
    const user = { id: this.currentId++, ...insertUser };
    this.users.push(user);
    return user;
  }

  async getContactSubmission(id: number) { return this.contactSubmissions.find(s => s.id === id); }
  async getAllContactSubmissions() { return this.contactSubmissions; }
  async createContactSubmission(submission: InsertContact): Promise<ContactSubmission> {
    const contact = { 
      id: this.currentId++, 
      ...submission, 
      phone: submission.phone ?? null,
      submittedAt: new Date() 
    };
    this.contactSubmissions.push(contact);
    return contact;
  }

  async getAdmissionInquiry(id: number) { return this.admissionInquiries.find(i => i.id === id); }
  async getAllAdmissionInquiries() { return this.admissionInquiries; }
  
  private async ensureDataDir() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (e) {}
  }

  private async persistAdmissions() {
    try {
      if (!process.env.VERCEL) {
        await this.ensureDataDir();
      }
      const data = JSON.stringify(this.admissionInquiries, null, 2);
      await fs.writeFile(ADMISSIONS_FILE, data);
      console.log(`[STORAGE] Successfully persisted ${this.admissionInquiries.length} inquiries to ${ADMISSIONS_FILE}`);
    } catch (e: any) {
      console.error("[STORAGE] CRITICAL PERSISTENCE ERROR:", e.message);
    }
  }

  private getNextAdmissionNumber(): number {
    if (this.admissionInquiries.length === 0) {
      return 26001;
    }
    
    const maxNumber = this.admissionInquiries.reduce((max, curr) => {
      const num = Number(curr.admissionNumber) || 0;
      return num > max ? num : max;
    }, 26000);
    
    return maxNumber + 1;
  }

  async createAdmissionInquiry(inquiry: InsertAdmissionInquiry): Promise<AdmissionInquiry> {
    const id = this.currentId++;
    const admissionNumber = this.getNextAdmissionNumber();
    
    console.log(`[STORAGE] Creating entry ${id} with Admission No: ${admissionNumber}`);

    const newInquiry: AdmissionInquiry = { 
      ...inquiry, 
      id,
      admissionNumber,
      parentName: inquiry.parentName ?? null,
      email: inquiry.email ?? null,
      phone: inquiry.phone ?? null,
      address: inquiry.address ?? null,
      fatherName: inquiry.fatherName ?? null,
      motherName: inquiry.motherName ?? null,
      fatherOccupation: inquiry.fatherOccupation ?? null,
      motherOccupation: inquiry.motherOccupation ?? null,
      previousSchool: inquiry.previousSchool ?? null,
      bloodGroup: inquiry.bloodGroup ?? null,
      studentPhoto: inquiry.studentPhoto ?? null,
      pdfBase64: (inquiry as any).pdfBase64 ?? null,
      mobileNo: inquiry.mobileNo ?? null,
      alternatePhone: inquiry.alternatePhone ?? null,
      emailId: inquiry.emailId ?? null,
      message: inquiry.message ?? null,
      status: "pending",
      submittedAt: new Date() 
    };
    this.admissionInquiries.push(newInquiry);
    if (!process.env.VERCEL) {
      await this.persistAdmissions();
    }
    return newInquiry;
  }

  async updateAdmissionInquiry(id: number, data: Partial<AdmissionInquiry>) {
    const index = this.admissionInquiries.findIndex(i => i.id === id);
    if (index === -1) return undefined;
    
    this.admissionInquiries[index] = { ...this.admissionInquiries[index], ...data };
    if (!process.env.VERCEL) {
      await this.persistAdmissions();
    }
    return this.admissionInquiries[index];
  }

  async deleteAdmissionInquiry(id: number): Promise<void> {}

  async getNewsletterSubscription(id: number) { return this.newsletterSubscriptions.find(s => s.id === id); }
  async getNewsletterSubscriptionByEmail(email: string) { return this.newsletterSubscriptions.find(s => s.email === email); }
  async getAllNewsletterSubscriptions() { return this.newsletterSubscriptions; }
  async createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const sub = { 
      id: this.currentId++, 
      ...subscription, 
      name: subscription.name ?? null,
      subscribedAt: new Date() 
    };
    this.newsletterSubscriptions.push(sub);
    return sub;
  }

  // Student methods (Mock)
  async getStudent(id: number): Promise<Student | undefined> { return undefined; }
  async getStudentByRollNumber(rollNumber: string): Promise<Student | undefined> { return undefined; }
  async getAllStudents(): Promise<Student[]> { return []; }
  async createStudent(student: InsertStudent): Promise<Student> { throw new Error("Not implemented in Mock"); }
  async updateStudent(id: number, data: Partial<Student>): Promise<Student | undefined> { return undefined; }
  async deleteStudent(id: number): Promise<void> {}

  // 360 Degree Profile (Mock)
  async getStudentDetails(id: number): Promise<any> { return undefined; }
  async createStudentAcademic(data: InsertStudentAcademic): Promise<any> { throw new Error("Mock"); }
  async updateStudentFeeSummary(studentId: number, academicYear: string, data: Partial<StudentFeeSummary>): Promise<any> { return undefined; }
  async createFeeTransaction(data: InsertFeeTransaction): Promise<any> { throw new Error("Mock"); }


  // Staff methods (Mock)
  async getStaff(id: number): Promise<Staff | undefined> { 
    return this.staff.find(s => s.id === id); 
  }
  async getAllStaff(): Promise<Staff[]> { 
    return this.staff.sort((a, b) => (a.order || 0) - (b.order || 0)); 
  }
  async createStaff(staff: InsertStaff): Promise<Staff> {
    const item: Staff = { 
      id: this.currentId++, 
      ...staff, 
      qualification: staff.qualification ?? null,
      experience: staff.experience ?? null,
      photoUrl: staff.photoUrl ?? null,
      phone: staff.phone ?? null,
      email: staff.email ?? null,
      linkedin: staff.linkedin ?? null,
      bio: staff.bio ?? null,
      quote: staff.quote ?? null,
      order: staff.order ?? 0
    };
    this.staff.push(item);
    return item;
  }
  async updateStaff(id: number, data: Partial<Staff>): Promise<Staff | undefined> {
    const index = this.staff.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    this.staff[index] = { ...this.staff[index], ...data };
    return this.staff[index];
  }
  async deleteStaff(id: number): Promise<void> {
    this.staff = this.staff.filter(s => s.id !== id);
  }

  // Content methods (Mock)
  async getAllSliders(): Promise<Slider[]> { return []; }
  async createSlider(slider: InsertSlider): Promise<Slider> { throw new Error("Not implemented in Mock"); }
  async updateSlider(id: number, data: Partial<Slider>): Promise<Slider | undefined> { return undefined; }
  async deleteSlider(id: number): Promise<void> {}

  async getAllNewsTickers(): Promise<NewsTicker[]> { return []; }
  async createNewsTicker(ticker: InsertNewsTicker): Promise<NewsTicker> { throw new Error("Not implemented in Mock"); }
  async updateNewsTicker(id: number, data: Partial<NewsTicker>): Promise<NewsTicker | undefined> { return undefined; }
  async deleteNewsTicker(id: number): Promise<void> {}

  async getAllPopups(): Promise<Popup[]> { return []; }
  async createPopup(popup: InsertPopup): Promise<Popup> { throw new Error("Not implemented in Mock"); }
  async updatePopup(id: number, data: Partial<Popup>): Promise<Popup | undefined> { return undefined; }
  async deletePopup(id: number): Promise<void> {}

  async getAllGalleryEvents(): Promise<GalleryEvent[]> { return []; }
  async createGalleryEvent(event: InsertGalleryEvent): Promise<GalleryEvent> { throw new Error("Not implemented"); }
  async updateGalleryEvent(id: number, event: Partial<InsertGalleryEvent>): Promise<GalleryEvent | undefined> { throw new Error("Not implemented"); }
  async deleteGalleryEvent(id: number): Promise<void> {}
  
  async getGalleryImagesByEvent(eventId: number): Promise<GalleryImage[]> { return []; }
  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> { throw new Error("Not implemented"); }
  async deleteGalleryImage(id: number): Promise<void> {}

  // Media Assets
  async getAllMediaAssets(): Promise<MediaAsset[]> { return []; }
  async getMediaAsset(id: number): Promise<MediaAsset | undefined> { return undefined; }
  async createMediaAsset(asset: InsertMediaAsset): Promise<MediaAsset> { throw new Error("Not implemented"); }
  async deleteMediaAsset(id: number): Promise<void> {}

  // Student Notifications
  async getAllStudentNotifications(): Promise<StudentNotification[]> { 
    return this.studentNotifications.sort((a, b) => b.id - a.id); 
  }
  async createStudentNotification(notification: InsertStudentNotification): Promise<StudentNotification> {
    const item: StudentNotification = { 
      id: this.currentId++, 
      content: notification.content,
      isActive: notification.isActive ?? true,
      createdAt: new Date() 
    };
    this.studentNotifications.push(item);
    return item;
  }
  async updateStudentNotification(id: number, data: Partial<StudentNotification>): Promise<StudentNotification | undefined> {
    const index = this.studentNotifications.findIndex(n => n.id === id);
    if (index === -1) return undefined;
    this.studentNotifications[index] = { ...this.studentNotifications[index], ...data };
    return this.studentNotifications[index];
  }
  async deleteStudentNotification(id: number): Promise<void> {
    this.studentNotifications = this.studentNotifications.filter(n => n.id !== id);
  }

  async getDashboardStats(): Promise<any> {
    const visitStats = await this.getVisitStats();
    return {
      totalStudents: 0,
      totalStaff: this.staff.length,
      pendingAdmissions: this.admissionInquiries.filter(i => i.status === 'pending').length,
      activeNotices: this.studentNotifications.filter(n => n.isActive).length,
      visitStats
    };
  }

  // Mock Visit Analytics (in-memory)
  private mockVisits: { date: string; hits: number; visitors: number }[] = [];
  private mockLogs: Set<string> = new Set();

  async recordVisit(ip: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const logKey = `${ip}-${today}`;
    const isNew = !this.mockLogs.has(logKey);
    
    if (isNew) this.mockLogs.add(logKey);

    const existing = this.mockVisits.find(v => v.date === today);
    if (existing) {
      existing.hits++;
      if (isNew) existing.visitors++;
    } else {
      this.mockVisits.push({ date: today, hits: 1, visitors: isNew ? 1 : 0 });
    }
  }

  async getVisitStats(): Promise<{ date: string; hits: number; visitors: number }[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];
    return this.mockVisits.filter(v => v.date >= startDate).sort((a, b) => a.date.localeCompare(b.date));
  }
}

import 'dotenv/config';

export const storage = process.env.DATABASE_URL 
  ? new DatabaseStorage() 
  : new MockStorage();
