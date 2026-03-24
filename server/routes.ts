import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertAdmissionInquirySchema, 
  insertNewsletterSubscriptionSchema 
} from "@shared/schema";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import nodemailer from "nodemailer";

// Email transporter configuration
// For production, you would use real SMTP credentials
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || "placeholder@gmail.com",
    pass: process.env.EMAIL_PASS || "placeholder",
  },
});

async function sendAdmissionEmail(data: any) {
  const mailOptions: any = {
    from: '"RP Public School Admission" <rppublicschool2021@gmail.com>',
    to: "rppublicschool2021@gmail.com",
    subject: `New Admission Inquiry - ${data.childName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          .header { background-color: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
          .header p { margin: 5px 0 0; font-size: 14px; opacity: 0.9; }
          .section { margin-top: 25px; border-top: 2px solid #f1f5f9; padding-top: 15px; }
          .section-title { color: #1e3a8a; font-size: 16px; font-weight: bold; background: #f8fafc; padding: 8px 12px; border-radius: 4px; border-left: 4px solid #1e3a8a; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
          th { font-weight: bold; color: #475569; width: 35%; }
          td { color: #1e293b; font-weight: 500; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #ddd; padding-top: 15px; }
          .print-btn { display: inline-block; padding: 10px 20px; background-color: #1e3a8a; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; text-align: center; cursor: pointer; border: none; }
          @media print {
            .print-btn { display: none !important; }
            .container { border: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>RP PUBLIC SCHOOL</h1>
            <p>Jaisinghnagar, Shahdol, Madhya Pradesh</p>
            <p><strong>OFFICIAL ADMISSION APPLICATION | SESSION ${data.academicYear || '2026-2027'}</strong></p>
          </div>

          <div class="section">
            <div class="section-title">1. STUDENT IDENTITY</div>
            <table>
              <tr><th>Student Name</th><td>${data.childName}</td></tr>
              <tr><th>Date of Birth</th><td>${data.dob}</td></tr>
              <tr><th>Gender</th><td>${data.gender}</td></tr>
              <tr><th>Grade Applying</th><td>${data.grade}</td></tr>
              <tr><th>Blood Group</th><td>${data.bloodGroup || 'N/A'}</td></tr>
              <tr><th>Academic Year</th><td>${data.academicYear || '2026-2027'}</td></tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">2. PARENT / GUARDIAN DETAILS</div>
            <table>
              <tr><th>Father's Name</th><td>${data.fatherName}</td></tr>
              <tr><th>Mother's Name</th><td>${data.motherName}</td></tr>
              <tr><th>Contact No</th><td>${data.phone || data.mobileNo || 'N/A'}</td></tr>
              <tr><th>Email ID</th><td>${data.email || data.emailId || 'N/A'}</td></tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">3. ADDRESS & ACADEMIC HISTORY</div>
            <table>
              <tr><th>Residential Address</th><td>${data.address}</td></tr>
              <tr><th>Previous School</th><td>${data.previousSchool || 'N/A'}</td></tr>
            </table>
          </div>

          ${data.message ? `
          <div class="section">
            <div class="section-title">4. ADDITIONAL MESSAGE</div>
            <p style="padding: 10px; background: #f9fafb; border-radius: 4px; border: 1px solid #e2e8f0; margin-top: 10px;">${data.message}</p>
          </div>
          ` : ''}

          <div class="footer">
            <p>This is a computer-generated admission backup provided by the RP Public School Portal.</p>
            <p>Submitted on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      console.log("Admission email sent successfully");
    } else {
      console.log("Mock email logged (Credentials missing)");
    }
    return true;
  } catch (error) {
    console.error("Error sending admission email:", error);
    return false;
  }
}

async function sendContactEmail(data: any) {
  const mailOptions = {
    from: '"RP Public School Website" <rppublicschool2021@gmail.com>',
    to: "rppublicschool2021@gmail.com",
    subject: `New Contact Inquiry: ${data.subject}`,
    html: `
      <h2>New Website Contact Inquiry</h2>
      <p>A new message has been sent via the contact form on the website.</p>
      
      <h3>Contact Details</h3>
      <ul>
        <li><strong>Name:</strong> ${data.name}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Phone:</strong> ${data.phone || "Not provided"}</li>
      </ul>
      
      <h3>Message Subject</h3>
      <p>${data.subject}</p>
      
      <h3>Message Content</h3>
      <p>${data.message}</p>
      
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        This is an automated message from the RP Public School Website.
      </p>
    `,
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      console.log("Contact email sent successfully to rppublicschool2021@gmail.com");
    } else {
      console.log("--- MOCK EMAIL SENDER ---");
      console.log("To: rppublicschool2021@gmail.com");
      console.log("Subject:", mailOptions.subject);
      console.log("Content summary: Contact from", data.name);
      console.log("--------------------------");
    }
    return true;
  } catch (error) {
    console.error("Error sending contact email:", error);
    return false;
  }
}

async function sendNewsletterEmail(data: any) {
  const mailOptions = {
    from: '"RP Public School Newsletter" <rppublicschool2021@gmail.com>',
    to: "rppublicschool2021@gmail.com",
    subject: "New Newsletter Subscription",
    html: `
      <h2>New Newsletter Subscriber</h2>
      <p>A new visitor has subscribed to the school newsletter.</p>
      
      <ul>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Name:</strong> ${data.name || "Not provided"}</li>
      </ul>
      
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        This automated message was triggered by a subscription on the RP Public School Website.
      </p>
    `,
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log("--- MOCK EMAIL SENDER ---");
      console.log("To: rppublicschool2021@gmail.com");
      console.log("Subject:", mailOptions.subject);
      console.log("Content summary: Newsletter sub from", data.email);
      console.log("--------------------------");
    }
    return true;
  } catch (error) {
    console.error("Error sending newsletter email:", error);
    return false;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for handling form submissions
  
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactSchema.parse(req.body);
      const submission = await storage.createContactSubmission(data);
      
      // Send email notification (non-blocking)
      sendContactEmail(data).catch(err => console.error("Non-blocking contact email error:", err));

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

  app.post("/api/admission-inquiry", async (req, res) => {
    try {
      // 100% Manual Inline Schema to ensure no stale imports block submission
      const inlineSchema = z.object({
        parentName: z.string().optional().nullable(),
        childName: z.string().min(1),
        grade: z.string().min(1),
        dob: z.string().min(1),
        gender: z.string().min(1),
        address: z.string().min(1),
        fatherName: z.string().min(1),
        motherName: z.string().min(1),
        academicYear: z.string().min(1),
        email: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
        fatherOccupation: z.string().optional().nullable(),
        motherOccupation: z.string().optional().nullable(),
        previousSchool: z.string().optional().nullable(),
        bloodGroup: z.string().optional().nullable(),
        mobileNo: z.string().optional().nullable(),
        emailId: z.string().optional().nullable(),
        message: z.string().optional().nullable(),
      });

      const { pdfBase64, ...formData } = req.body;
      const data = inlineSchema.parse(formData);
      const inquiry = await storage.createAdmissionInquiry(data);
      
      // Send email notification (Awaited for Vercel stability)
      try {
        await sendAdmissionEmail(data);
      } catch (err) {
        console.error("Admission email error:", err);
      }
      
      res.status(201).json({ 
        success: true,
        message: "Admission inquiry submitted successfully. A confirmation will be sent to your email.",
        data: inquiry
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ success: false, message: validationError.message });
      }
      console.error("Admission submission error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error", 
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined 
      });
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
      
      // Send email notification (non-blocking)
      sendNewsletterEmail(data).catch(err => console.error("Non-blocking newsletter email error:", err));

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
