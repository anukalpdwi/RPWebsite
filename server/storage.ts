import { 
  users, type User, type InsertUser,
  contactSubmissions, type ContactSubmission, type InsertContact,
  admissionInquiries, type AdmissionInquiry, type InsertAdmissionInquiry,
  newsletterSubscriptions, type NewsletterSubscription, type InsertNewsletterSubscription
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Contact submission methods
  async getContactSubmission(id: number): Promise<ContactSubmission | undefined> {
    const [submission] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id));
    return submission || undefined;
  }
  
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(contactSubmissions.submittedAt);
  }
  
  async createContactSubmission(submission: InsertContact): Promise<ContactSubmission> {
    const [contactSubmission] = await db
      .insert(contactSubmissions)
      .values(submission)
      .returning();
    return contactSubmission;
  }
  
  // Admission inquiry methods
  async getAdmissionInquiry(id: number): Promise<AdmissionInquiry | undefined> {
    const [inquiry] = await db.select().from(admissionInquiries).where(eq(admissionInquiries.id, id));
    return inquiry || undefined;
  }
  
  async getAllAdmissionInquiries(): Promise<AdmissionInquiry[]> {
    return await db.select().from(admissionInquiries).orderBy(admissionInquiries.submittedAt);
  }
  
  async createAdmissionInquiry(inquiry: InsertAdmissionInquiry): Promise<AdmissionInquiry> {
    const [admissionInquiry] = await db
      .insert(admissionInquiries)
      .values(inquiry)
      .returning();
    return admissionInquiry;
  }
  
  // Newsletter subscription methods
  async getNewsletterSubscription(id: number): Promise<NewsletterSubscription | undefined> {
    const [subscription] = await db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.id, id));
    return subscription || undefined;
  }
  
  async getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined> {
    const [subscription] = await db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.email, email));
    return subscription || undefined;
  }
  
  async getAllNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return await db.select().from(newsletterSubscriptions).orderBy(newsletterSubscriptions.subscribedAt);
  }
  
  async createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const [newsletterSubscription] = await db
      .insert(newsletterSubscriptions)
      .values(subscription)
      .returning();
    return newsletterSubscription;
  }
}

class MockStorage {
  async createUser() {
    return { id: 1, username: "test", password: "test" };
  }

  async getContactSubmission() {
    return undefined;
  }

  async getAllContactSubmissions() {
    return [];
  }

  async createContactSubmission(submission: any) {
    return { id: 1, ...submission, submittedAt: new Date() };
  }

  async getAdmissionInquiry() {
    return undefined;
  }

  async getAllAdmissionInquiries() {
    return [];
  }

  async createAdmissionInquiry(inquiry: any) {
    return { id: 1, ...inquiry, submittedAt: new Date() };
  }
}

export const storage = new MockStorage();
