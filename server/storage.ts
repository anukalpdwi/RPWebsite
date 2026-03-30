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
  popups, type Popup, type InsertPopup
} from "../shared/schema.js";
import { db } from "./db.js";
import { eq, desc, sql } from "drizzle-orm";
import fs from "fs/promises";
import * as fs_sync from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

  getAllGalleryEvents(): Promise<GalleryEvent[]>;
  createGalleryEvent(event: InsertGalleryEvent): Promise<GalleryEvent>;
  getGalleryImages(eventId: number): Promise<GalleryImage[]>;
  addGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;

  getAllPopups(): Promise<Popup[]>;
  createPopup(popup: InsertPopup): Promise<Popup>;
  updatePopup(id: number, data: Partial<Popup>): Promise<Popup | undefined>;

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
    const [newStudent] = await db.insert(students).values(insertStudent).returning();
    return newStudent;
  }
  async updateStudent(id: number, data: Partial<Student>) {
    const [updated] = await db.update(students).set(data).where(eq(students.id, id)).returning();
    return updated;
  }
  async deleteStudent(id: number) {
    await db.delete(students).where(eq(students.id, id));
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

  async getAllGalleryEvents() {
    return await db.select().from(galleryEvents);
  }
  async createGalleryEvent(insertEvent: InsertGalleryEvent) {
    const [newItem] = await db.insert(galleryEvents).values(insertEvent).returning();
    return newItem;
  }
  async getGalleryImages(eventId: number) {
    return await db.select().from(galleryImages).where(eq(galleryImages.eventId, eventId));
  }
  async addGalleryImage(image: InsertGalleryImage) {
    const [newItem] = await db.insert(galleryImages).values(image).returning();
    return newItem;
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

  // Dashboard Stats
  async getDashboardStats() {
    const [studentCount] = await db.select({ count: sql<number>`count(*)` }).from(students);
    const [staffCount] = await db.select({ count: sql<number>`count(*)` }).from(staff);
    const [pendingAdmissions] = await db.select({ count: sql<number>`count(*)` }).from(admissionInquiries).where(eq(admissionInquiries.status, 'pending'));
    const [activeNotices] = await db.select({ count: sql<number>`count(*)` }).from(newsTicker).where(eq(newsTicker.isActive, true));

    return {
      totalStudents: studentCount.count,
      totalStaff: staffCount.count,
      pendingAdmissions: pendingAdmissions.count,
      activeNotices: activeNotices.count
    };
  }
}

class MockStorage implements IStorage {
  private users: User[] = [];
  private contactSubmissions: ContactSubmission[] = [];
  private admissionInquiries: AdmissionInquiry[] = [];
  private newsletterSubscriptions: NewsletterSubscription[] = [];
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

  // Staff methods (Mock)
  async getStaff(id: number): Promise<Staff | undefined> { return undefined; }
  async getAllStaff(): Promise<Staff[]> { return []; }
  async createStaff(staff: InsertStaff): Promise<Staff> { throw new Error("Not implemented in Mock"); }
  async updateStaff(id: number, data: Partial<Staff>): Promise<Staff | undefined> { return undefined; }
  async deleteStaff(id: number): Promise<void> {}

  // Content methods (Mock)
  async getAllSliders(): Promise<Slider[]> { return []; }
  async createSlider(slider: InsertSlider): Promise<Slider> { throw new Error("Not implemented in Mock"); }
  async updateSlider(id: number, data: Partial<Slider>): Promise<Slider | undefined> { return undefined; }
  async deleteSlider(id: number): Promise<void> {}

  async getAllNewsTickers(): Promise<NewsTicker[]> { return []; }
  async createNewsTicker(ticker: InsertNewsTicker): Promise<NewsTicker> { throw new Error("Not implemented in Mock"); }
  async updateNewsTicker(id: number, data: Partial<NewsTicker>): Promise<NewsTicker | undefined> { return undefined; }
  async deleteNewsTicker(id: number): Promise<void> {}

  async getAllGalleryEvents(): Promise<GalleryEvent[]> { return []; }
  async createGalleryEvent(event: InsertGalleryEvent): Promise<GalleryEvent> { throw new Error("Not implemented in Mock"); }
  async getGalleryImages(eventId: number): Promise<GalleryImage[]> { return []; }
  async addGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> { throw new Error("Not implemented in Mock"); }

  async getAllPopups(): Promise<Popup[]> { return []; }
  async createPopup(popup: InsertPopup): Promise<Popup> { throw new Error("Not implemented in Mock"); }
  async updatePopup(id: number, data: Partial<Popup>): Promise<Popup | undefined> { return undefined; }

  async getDashboardStats(): Promise<any> {
    return {
      totalStudents: 0,
      totalStaff: 0,
      pendingAdmissions: 0,
      activeNotices: 0
    };
  }
}

import 'dotenv/config';
export const storage = new DatabaseStorage();
