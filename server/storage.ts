import { 
  users, type User, type InsertUser,
  contactSubmissions, type ContactSubmission, type InsertContact,
  admissionInquiries, type AdmissionInquiry, type InsertAdmissionInquiry,
  newsletterSubscriptions, type NewsletterSubscription, type InsertNewsletterSubscription
} from "../shared/schema.js";
// import { db } from "./db";
// import { eq } from "drizzle-orm";
import fs from "fs/promises";
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
  
  // Newsletter subscription methods
  getNewsletterSubscription(id: number): Promise<NewsletterSubscription | undefined>;
  getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined>;
  getAllNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;
  createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
}

/*
export class DatabaseStorage implements IStorage {
  // ... (Database implementation commented out to avoid Vercel crashes)
}
*/

class MockStorage implements IStorage {
  private users: User[] = [];
  private contactSubmissions: ContactSubmission[] = [];
  private admissionInquiries: AdmissionInquiry[] = [];
  private newsletterSubscriptions: NewsletterSubscription[] = [];
  private currentId = 1;

  constructor() {
    this.loadAdmissions();
  }

  private async loadAdmissions() {
    try {
      const data = await fs.readFile(ADMISSIONS_FILE, "utf-8");
      this.admissionInquiries = JSON.parse(data);
      if (this.admissionInquiries.length > 0) {
        this.currentId = Math.max(...this.admissionInquiries.map(i => i.id)) + 1;
      }
    } catch (e) {
      // No backup found yet, it's okay
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
      await fs.writeFile(ADMISSIONS_FILE, JSON.stringify(this.admissionInquiries, null, 2));
    } catch (e: any) {
      console.error("Non-fatal backup error:", e.message);
    }
  }

  async createAdmissionInquiry(inquiry: InsertAdmissionInquiry): Promise<AdmissionInquiry> {
    const admission: AdmissionInquiry = { 
      id: this.currentId++, 
      ...inquiry, 
      parentName: inquiry.parentName ?? null,
      mobileNo: inquiry.mobileNo ?? null,
      emailId: inquiry.emailId ?? null,
      email: inquiry.email ?? null,
      phone: inquiry.phone ?? null,
      fatherOccupation: inquiry.fatherOccupation ?? null,
      motherOccupation: inquiry.motherOccupation ?? null,
      previousSchool: inquiry.previousSchool ?? null,
      bloodGroup: inquiry.bloodGroup ?? null,
      message: inquiry.message ?? null,
      submittedAt: new Date() 
    };
    this.admissionInquiries.push(admission);
    if (!process.env.VERCEL) {
      await this.persistAdmissions();
    }
    return admission;
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
}

export const storage = new MockStorage();
