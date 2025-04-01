import { 
  users, type User, type InsertUser,
  contactSubmissions, type ContactSubmission, type InsertContact,
  admissionInquiries, type AdmissionInquiry, type InsertAdmissionInquiry,
  newsletterSubscriptions, type NewsletterSubscription, type InsertNewsletterSubscription
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private admissionInquiries: Map<number, AdmissionInquiry>;
  private newsletterSubscriptions: Map<number, NewsletterSubscription>;
  private currentUserId: number;
  private currentContactId: number;
  private currentInquiryId: number;
  private currentSubscriptionId: number;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.admissionInquiries = new Map();
    this.newsletterSubscriptions = new Map();
    this.currentUserId = 1;
    this.currentContactId = 1;
    this.currentInquiryId = 1;
    this.currentSubscriptionId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Contact submission methods
  async getContactSubmission(id: number): Promise<ContactSubmission | undefined> {
    return this.contactSubmissions.get(id);
  }
  
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }
  
  async createContactSubmission(submission: InsertContact): Promise<ContactSubmission> {
    const id = this.currentContactId++;
    const submittedAt = new Date();
    const contactSubmission: ContactSubmission = { ...submission, id, submittedAt };
    this.contactSubmissions.set(id, contactSubmission);
    return contactSubmission;
  }
  
  // Admission inquiry methods
  async getAdmissionInquiry(id: number): Promise<AdmissionInquiry | undefined> {
    return this.admissionInquiries.get(id);
  }
  
  async getAllAdmissionInquiries(): Promise<AdmissionInquiry[]> {
    return Array.from(this.admissionInquiries.values());
  }
  
  async createAdmissionInquiry(inquiry: InsertAdmissionInquiry): Promise<AdmissionInquiry> {
    const id = this.currentInquiryId++;
    const submittedAt = new Date();
    const admissionInquiry: AdmissionInquiry = { ...inquiry, id, submittedAt };
    this.admissionInquiries.set(id, admissionInquiry);
    return admissionInquiry;
  }
  
  // Newsletter subscription methods
  async getNewsletterSubscription(id: number): Promise<NewsletterSubscription | undefined> {
    return this.newsletterSubscriptions.get(id);
  }
  
  async getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined> {
    return Array.from(this.newsletterSubscriptions.values()).find(
      (subscription) => subscription.email === email,
    );
  }
  
  async getAllNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return Array.from(this.newsletterSubscriptions.values());
  }
  
  async createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const id = this.currentSubscriptionId++;
    const subscribedAt = new Date();
    const newsletterSubscription: NewsletterSubscription = { ...subscription, id, subscribedAt };
    this.newsletterSubscriptions.set(id, newsletterSubscription);
    return newsletterSubscription;
  }
}

export const storage = new MemStorage();
