import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertAdmissionInquirySchema, 
  insertNewsletterSubscriptionSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for handling form submissions
  
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactSchema.parse(req.body);
      const submission = await storage.createContactSubmission(data);
      res.status(201).json({ 
        success: true,
        message: "Contact form submission successful",
        data: submission
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ 
          success: false,
          message: "Validation failed",
          errors: validationError.message
        });
      } else {
        console.error("Error processing contact form:", error);
        res.status(500).json({ 
          success: false,
          message: "An error occurred while processing your request"
        });
      }
    }
  });

  // Admission inquiry submission
  app.post("/api/admission-inquiry", async (req, res) => {
    try {
      const data = insertAdmissionInquirySchema.parse(req.body);
      const inquiry = await storage.createAdmissionInquiry(data);
      res.status(201).json({ 
        success: true,
        message: "Admission inquiry submitted successfully",
        data: inquiry
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ 
          success: false,
          message: "Validation failed",
          errors: validationError.message
        });
      } else {
        console.error("Error processing admission inquiry:", error);
        res.status(500).json({ 
          success: false,
          message: "An error occurred while processing your request"
        });
      }
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter-subscribe", async (req, res) => {
    try {
      const data = insertNewsletterSubscriptionSchema.parse(req.body);
      
      // Check if email already exists
      const existingSubscription = await storage.getNewsletterSubscriptionByEmail(data.email);
      if (existingSubscription) {
        return res.status(400).json({ 
          success: false,
          message: "This email is already subscribed to our newsletter"
        });
      }
      
      const subscription = await storage.createNewsletterSubscription(data);
      res.status(201).json({ 
        success: true,
        message: "Successfully subscribed to newsletter",
        data: subscription
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ 
          success: false,
          message: "Validation failed",
          errors: validationError.message
        });
      } else {
        console.error("Error processing newsletter subscription:", error);
        res.status(500).json({ 
          success: false,
          message: "An error occurred while processing your request"
        });
      }
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
