import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { 
  insertContactSchema, 
  insertAdmissionInquirySchema, 
  insertNewsletterSubscriptionSchema 
} from "../shared/schema.js";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import nodemailer from "nodemailer";

// Email transporter configuration
// For production, you would use real SMTP credentials
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Use 465 for SSL instead of 587 for better reliability on some cloud providers
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER || "", 
    pass: process.env.EMAIL_PASS || "", 
  },
});

async function sendAdmissionEmail(data: any) {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'rppublicschool2021@gmail.com',
    to: 'rppublicschool2021@gmail.com',
    subject: `NEW ADMISSION [ID: ${data.admissionNumber || 'PENDING'}]: ${data.childName} | Grade: ${data.grade}`,
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 700px; margin: auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
          .header { background: #0f172a; color: #ffffff; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; text-transform: uppercase; }
          .header p { margin: 5px 0 0; opacity: 0.8; font-size: 14px; font-weight: 500; }
          .section { padding: 25px; border-bottom: 1px solid #f1f5f9; }
          .section-title { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 15px; display: flex; align-items: center; }
          .section-title::after { content: ''; flex: 1; height: 1px; background: #f1f5f9; margin-left: 15px; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; padding: 10px 0; font-size: 14px; font-weight: 600; color: #475569; width: 40%; vertical-align: top; }
          td { text-align: right; padding: 10px 0; font-size: 15px; font-weight: 700; color: #0f172a; }
          .photo-container { text-align: center; margin-bottom: 20px; }
          .student-photo { width: 150px; height: 180px; object-fit: cover; border: 3px solid #f1f5f9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
          .admission-no { font-size: 18px; font-weight: 800; color: #1e40af; background: #eff6ff; padding: 10px; border-radius: 6px; display: inline-block; margin-top: 10px; border: 1px solid #bfdbfe; }
          @media print {
            body { background: white; padding: 0; }
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
            <div class="admission-no">Admission No: ${data.admissionNumber || 'N/A'}</div>
          </div>

          <div class="section">
            <div class="section-title">1. STUDENT IDENTITY</div>
            ${data.studentPhoto ? `
            <div class="photo-container">
              <img src="${data.studentPhoto}" alt="Student Photo" class="student-photo" />
            </div>
            ` : ''}
            <table>
              <tr><th>Admission No</th><td style="color: #1e40af;">${data.admissionNumber || 'N/A'}</td></tr>
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
              <tr><th>Primary Contact No</th><td>${data.phone || 'N/A'}</td></tr>
              <tr><th>Alternate Contact No</th><td>${data.alternatePhone || 'N/A'}</td></tr>
              <tr><th>Email ID</th><td>${data.email || 'N/A'}</td></tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">3. ADDRESS & ADDITIONAL INFO</div>
            <table>
              <tr><th>Residential Address</th><td>${data.address}</td></tr>
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
    `
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      console.log(`Admission email successfully SENT to ${mailOptions.to}`);
    } else {
      console.error("CRITICAL SMTP ERROR: EMAIL_USER or EMAIL_PASS is missing in environment variables!");
    }
    return true;
  } catch (error: any) {
    console.error("SMTP SEND FAILURE:", error.message);
    if (error.code === 'EAUTH') {
      console.error("ERROR: Authentication failed. Please check your App Password.");
    }
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

export function registerRoutes(app: Express): Server {
  // Diagnostic route for Vercel
  app.get("/api/ping", (_req, res) => {
    res.json({ status: "alive", time: new Date().toISOString() });
  });

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
    } catch (error: any) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ success: false, message: validationError.message });
      }
      console.error("Error processing contact form:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
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
        alternatePhone: z.string().optional().nullable(),
        fatherOccupation: z.string().optional().nullable(),
        motherOccupation: z.string().optional().nullable(),
        previousSchool: z.string().optional().nullable(),
        bloodGroup: z.string().optional().nullable(),
        mobileNo: z.string().optional().nullable(),
        emailId: z.string().optional().nullable(),
        studentPhoto: z.string().min(1, "Student photo is required"),
        message: z.string().optional().nullable(),
      });

      const { pdfBase64, ...formData } = req.body;
      const data = inlineSchema.parse(formData);
      const inquiry = await storage.createAdmissionInquiry(data);
      
      try {
        await sendAdmissionEmail(data);
      } catch (e) {
        console.error("Email send failed (non-fatal):", e);
      }
      
      res.status(201).json({ 
        success: true, 
        message: "Admission inquiry submitted successfully.", 
        data: inquiry 
      });
    } catch (error: any) {
      console.error("CRITICAL ADMISSION ERROR:", error);
      if (error instanceof ZodError) {
        return res.status(400).json({ success: false, message: fromZodError(error).message });
      }
      res.status(500).json({ 
        success: false, 
        message: "Internal server error", 
        error: error.message,
        details: "Check server logs for full stack trace"
      });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter-subscribe", async (req, res) => {
    try {
      const data = insertNewsletterSubscriptionSchema.parse(req.body);
      await storage.createNewsletterSubscription(data);
      res.status(201).json({ success: true, message: "Subscribed successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
