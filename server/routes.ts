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
import PDFDocument from "pdfkit";

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

async function generateAdmissionPDF(data: any): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    // 1. Header with Logo & School Info
    doc.rect(0, 0, 595, 120).fill("#1e3a8a");
    doc.fillColor("#ffffff");
    doc.fontSize(24).font("Helvetica-Bold").text("RP PUBLIC SCHOOL", 50, 35, { characterSpacing: 2 });
    doc.fontSize(10).font("Helvetica").text("Jaisinghnagar, Shahdol, Madhya Pradesh", 50, 65);
    doc.text("Official Admission Application | Session 2026-27", 50, 80);
    doc.fontSize(14).font("Helvetica-Bold").text("ADMISSION FORM", 430, 45, { align: "right" });

    doc.moveDown(5);
    doc.fillColor("#1e293b");

    // 2. Helper for Sections
    const drawSection = (title: string, y: number) => {
      doc.rect(50, y, 495, 20).fill("#f1f5f9");
      doc.fillColor("#1e3a8a").fontSize(12).font("Helvetica-Bold").text(title.toUpperCase(), 60, y + 5);
      doc.moveDown(1.5);
    };

    let currentY = 140;

    // 3. Student Identity
    drawSection("1. Student Identity", currentY);
    currentY += 30;
    doc.fillColor("#334155").fontSize(10).font("Helvetica-Bold");
    
    // Labels & Data in grid
    const drawField = (label: string, value: string, x: number, y: number) => {
        doc.font("Helvetica-Bold").text(label, x, y);
        doc.font("Helvetica").text(value || "N/A", x + 100, y);
    };

    drawField("Student Name:", data.childName, 50, currentY);
    drawField("Date of Birth:", data.dob, 300, currentY);
    currentY += 20;
    drawField("Gender:", data.gender, 50, currentY);
    drawField("Grade Applying:", data.grade, 300, currentY);
    currentY += 20;
    drawField("Blood Group:", data.bloodGroup, 50, currentY);
    drawField("Academic Year:", data.academicYear, 300, currentY);
    
    currentY += 40;

    // 4. Family & Guardian Details
    drawSection("2. Parent / Guardian Details", currentY);
    currentY += 30;
    drawField("Father's Name:", data.fatherName, 50, currentY);
    drawField("Occupation:", data.fatherOccupation, 300, currentY);
    currentY += 20;
    drawField("Mother's Name:", data.motherName, 50, currentY);
    drawField("Occupation:", data.motherOccupation, 300, currentY);
    currentY += 20;
    drawField("Contact No:", data.phone, 50, currentY);
    drawField("Email ID:", data.email, 300, currentY);
    
    currentY += 40;

    // 5. Address & History
    drawSection("3. Address & Academic History", currentY);
    currentY += 30;
    doc.font("Helvetica-Bold").text("Residential Address:", 50, currentY);
    doc.font("Helvetica").text(data.address, 150, currentY, { width: 400 });
    currentY += 40;
    drawField("Previous School:", data.previousSchool, 50, currentY);
    
    currentY += 60;

    // 6. Signatures
    doc.fontSize(10).font("Helvetica-Bold").text("_______________________", 50, currentY);
    doc.text("_______________________", 350, currentY);
    currentY += 15;
    doc.fontSize(8).text("Parent / Guardian Signature", 50, currentY);
    doc.text("Admissions Authority", 350, currentY);

    // 7. Footer
    doc.fontSize(9).font("Helvetica-Oblique").fillColor("#94a3b8")
       .text("This document is a computer-generated admission backup provided by RP Public School Portal.", 50, 750, { align: "center" });

    doc.end();
  });
}

async function sendAdmissionEmail(data: any, pdfBase64?: string) {
  const mailOptions: any = {
    from: '"RP Public School Admission" <rppublicschool2021@gmail.com>',
    to: "rppublicschool2021@gmail.com",
    subject: `RPPS ADMISSION FORM [2026-27]: ${data.childName}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; border: 12px double #e2e8f0; padding: 40px; color: #1e293b; background-color: #ffffff;">
        <!-- Official Header -->
        <div style="text-align: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #1e3a8a; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">RP Public School</h1>
          <p style="margin: 5px 0; font-weight: bold; color: #b45309;">Nurturing Excellence, Building Character</p>
          <p style="margin: 0; font-size: 12px; color: #64748b;">Jaisinghnagar, Shahdol, Madhya Pradesh | PH: +91 9893767392</p>
          <div style="background-color: #1e3a8a; color: white; display: inline-block; padding: 5px 20px; border-radius: 5px; margin-top: 15px; font-weight: bold; font-size: 14px;">
            OFFICIAL ADMISSION FORM 2026 - 2027
          </div>
        </div>

        <p style="font-size: 14px; margin-bottom: 25px;">A new online admission application has been successfully submitted. Below are the verified details from the portal.</p>

        <!-- Section: Student Identity -->
        <div style="background-color: #f8fafc; padding: 15px; border-left: 5px solid #3b82f6; margin-bottom: 25px;">
          <h2 style="font-size: 16px; margin: 0; color: #1e3a8a; text-transform: uppercase;">1. Student Identity</h2>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; width: 30%; font-weight: bold;">Full Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.childName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Date of Birth:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.dob}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Gender:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-transform: capitalize;">${data.gender}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Blood Group:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.bloodGroup || "Not Specified"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Academic Session:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.academicYear}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Applying for Grade:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1e3a8a;">${data.grade}</td>
          </tr>
        </table>

        <!-- Section: Family Information -->
        <div style="background-color: #f8fafc; padding: 15px; border-left: 5px solid #10b981; margin-bottom: 25px;">
          <h2 style="font-size: 16px; margin: 0; color: #047857; text-transform: uppercase;">2. Family Information</h2>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; width: 30%; font-weight: bold;">Parent/Guardian Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.parentName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Father's Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.fatherName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Mother's Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.motherName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Contact Number:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${data.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Email Address:</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.email}</td>
          </tr>
        </table>

         <!-- Section: Residence & Remarks -->
        <div style="background-color: #f8fafc; padding: 15px; border-left: 5px solid #f59e0b; margin-bottom: 25px;">
          <h2 style="font-size: 16px; margin: 0; color: #b45309; text-transform: uppercase;">3. Residence & Remarks</h2>
        </div>
        <div style="margin-bottom: 30px;">
          <p style="margin: 0 0 5px 0; font-weight: bold; font-size: 14px;">Residential Address:</p>
          <p style="background-color: #f1f5f9; padding: 10px; border-radius: 5px; margin: 0;">${data.address}</p>
        </div>
        <div style="margin-bottom: 30px;">
          <p style="margin: 0 0 5px 0; font-weight: bold; font-size: 14px;">Additional Remarks:</p>
          <p style="background-color: #f1f5f9; padding: 10px; border-radius: 5px; margin: 0;">${data.message || "No remarks provided."}</p>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8;">
          <p>This is an electronically generated official document from the RP Public School Admission Portal.</p>
          <p>&copy; 2026-27 RP Public School. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    const pdfBuffer = await generateAdmissionPDF(data).catch(err => {
      console.error("PDF generation failed:", err);
      return null;
    });

    if (pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: `RPPS_Admission_${data.childName?.replace(/\s+/g, "_") || "Form"}_2026.pdf`,
          content: pdfBuffer
        }
      ];
    }

    // Only attempt to send if credentials are provided
    // Only attempt to send if credentials are provided, otherwise log the "email"
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      console.log("Admission email sent successfully to rppublicschool2021@gmail.com");
    } else {
      console.log("--- MOCK EMAIL SENDER ---");
      console.log("To: rppublicschool2021@gmail.com");
      console.log("Subject:", mailOptions.subject);
      console.log("Content summary: Admission for", data.childName);
      console.log("--------------------------");
      console.log("NOTE: Set EMAIL_USER and EMAIL_PASS environment variables to enable real email sending.");
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
        message: z.string().optional().nullable(),
      });

      const { pdfBase64, ...formData } = req.body;
      const data = inlineSchema.parse(formData);
      const inquiry = await storage.createAdmissionInquiry(data);
      
      // Send email notification (and don't block the response)
      sendAdmissionEmail(data, pdfBase64).catch(err => console.error("Non-blocking email error:", err));
      
      res.status(201).json({ 
        success: true,
        message: "Admission inquiry submitted successfully. A confirmation will be sent to your email.",
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
          message: "An error occurred while processing your request",
          error: error instanceof Error ? error.message : String(error)
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
