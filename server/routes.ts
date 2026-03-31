import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { 
  insertContactSchema, 
  insertAdmissionInquirySchema, 
  insertNewsletterSubscriptionSchema,
  insertStudentSchema,
  insertStaffSchema,
  insertSliderSchema,
  insertNewsTickerSchema,
  insertPopupSchema,
  insertGalleryEventSchema,
  insertStudentNotificationSchema,
  insertStudentAcademicSchema,
  insertFeeTransactionSchema,
  studentNotifications, type StudentNotification, type InsertStudentNotification
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
  const attachments: any[] = [];
  
  // Handle Student Photo CID attachment
  let photoHtml = '';
  if (data.studentPhoto && data.studentPhoto.startsWith('data:image')) {
    const photoBase64 = data.studentPhoto.split(',')[1];
    attachments.push({
      filename: 'student-photo.jpg',
      content: photoBase64,
      encoding: 'base64',
      cid: 'studentphoto'
    });
    photoHtml = '<img src="cid:studentphoto" style="width: 150px; height: 180px; object-fit: cover; border: 3px solid #f1f5f9; border-radius: 8px; display: block; margin: 0 auto;" />';
  }

  // Handle PDF attachment if provided
  if (data.pdfBase64) {
    attachments.push({
      filename: `Admission_Form_${data.admissionNumber || 'New'}.pdf`,
      content: data.pdfBase64.split(',')[1] || data.pdfBase64,
      encoding: 'base64'
    });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'rppublicschool2021@gmail.com',
    to: 'rppublicschool2021@gmail.com',
    subject: `NEW ADMISSION [ID: ${data.admissionNumber || 'PENDING'}]: ${data.childName} | Grade: ${data.grade}`,
    attachments,
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 0; }
          .wrapper { width: 100%; background-color: #f8fafc; padding: 40px 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
          .header { background-color: #0f172a; color: #ffffff; padding: 40px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; text-transform: uppercase; }
          .header p { margin: 10px 0 0; opacity: 0.8; font-size: 14px; font-weight: 500; }
          .content { padding: 30px; }
          .admission-badge { background-color: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; padding: 10px 20px; border-radius: 6px; display: inline-block; font-weight: 800; margin-bottom: 30px; }
          .section-title { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin: 30px 0 15px; border-bottom: 1px solid #f1f5f9; padding-bottom: 5px; }
          .info-table { width: 100%; border-collapse: collapse; }
          .info-table th { text-align: left; padding: 12px 0; font-size: 13px; font-weight: 600; color: #64748b; border-bottom: 1px solid #f8fafc; }
          .info-table td { text-align: right; padding: 12px 0; font-size: 14px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #f8fafc; }
          .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>RP PUBLIC SCHOOL</h1>
              <p>JAISINGHNAGAR, SHAHDOL, MADHYA PRADESH</p>
              <div style="margin-top: 20px;">
                <span class="admission-badge">ADMISSION NO: ${data.admissionNumber || 'PENDING'}</span>
              </div>
            </div>
            
            <div class="content">
              <div style="text-align: center; margin-bottom: 30px;">
                ${photoHtml || '<div style="width: 150px; height: 180px; background: #f1f5f9; border-radius: 8px; margin: 0 auto; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 12px;">NO PHOTO PROVIDED</div>'}
              </div>

              <div class="section-title">Student Identity</div>
              <table class="info-table">
                <tr><th>Full Name</th><td>${data.childName}</td></tr>
                <tr><th>Applying for Class</th><td>${data.grade}</td></tr>
                <tr><th>Date of Birth</th><td>${data.dob || 'N/A'}</td></tr>
                <tr><th>Gender</th><td>${data.gender || 'N/A'}</td></tr>
                <tr><th>Blood Group</th><td>${data.bloodGroup || 'N/A'}</td></tr>
                <tr><th>Academic Session</th><td>${data.academicYear || '2026-2027'}</td></tr>
              </table>

              <div class="section-title">Family Details</div>
              <table class="info-table">
                <tr><th>Father's Name</th><td>${data.fatherName || 'N/A'}</td></tr>
                <tr><th>Mother's Name</th><td>${data.motherName || 'N/A'}</td></tr>
                <tr><th>Primary Contact</th><td>${data.phone || 'N/A'}</td></tr>
                ${data.alternatePhone ? `<tr><th>Alternate Contact</th><td>${data.alternatePhone}</td></tr>` : ''}
                <tr><th>Email</th><td>${data.email || 'N/A'}</td></tr>
              </table>

              <div class="section-title">Residential Address</div>
              <p style="font-size: 14px; font-weight: 600; color: #1e293b; background: #f8fafc; padding: 15px; border-radius: 6px; margin: 0;">
                ${data.address || 'N/A'}
              </p>
              
              <div style="margin-top: 40px; text-align: center;">
                <a href="https://www.rppublicjsn.in/api/admission-download/${data.id}" 
                   style="background-color: #2563eb; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
                  DOWNLOAD OFFICIAL FORM PDF
                </a>
                <p style="margin-top: 15px; font-size: 12px; color: #64748b; font-weight: 500;">
                  Click the button above to download the clean admission form without email headers.
                </p>
              </div>
            </div>

            <div class="footer">
              <p>© ${new Date().getFullYear()} RP Public School Admission Portal. All rights reserved.</p>
              <p>This is an automated notification. Please do not reply directly to this email.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log("--- MOCK EMAIL SENDER ---");
      console.log("To: rppublicschool2021@gmail.com");
      console.log("Subject:", mailOptions.subject);
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

export function registerRoutes(app: Express): Server {
  // Diagnostic route for Vercel
  app.get("/api/ping", (_req, res) => {
    res.json({ status: "alive", time: new Date().toISOString() });
  });

  function isBot(userAgent: string | undefined): boolean {
    if (!userAgent) return false;
    // Comprehensive bot regex
    const botPattern = /bot|crawler|spider|crawling|slurp|facebookexternalhit|embedly|quora link preview|outbrain|pinterest|vkShare|Wget|curl|WhatsApp|twitterbot|applebot|bingbot|googlebot|duckduckbot|yandexbot|serpstatbot|mj12bot|ahrefsbot|semrushbot|dotbot|rogerbot|exabot|konqueror|gigabot|ia_archiver|seznambot|naverbot|ltx71|hubspot|petalbot|vadsbot|barkrowler/i;
    return botPattern.test(userAgent);
  }

  // Visit Analytics Tracking (public - called by frontend on route change)
  app.post("/api/track-visit", async (req, res) => {
    try {
      const userAgent = req.headers['user-agent'];
      const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || 'unknown';

      console.log(`[ANALYTICS] Request from IP: ${ip}, UA: ${userAgent}`);

      // 1. Filter out bots/crawlers
      if (isBot(userAgent)) {
        console.log(`[ANALYTICS] IGNORED (Bot): ${userAgent}`);
        return res.json({ success: true, status: "ignored", reason: "bot" });
      }

      // 2. Filter out localhost/development traffic in production
      if (process.env.NODE_ENV === 'production' && (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || ip.includes('localhost'))) {
        console.log(`[ANALYTICS] IGNORED (Localhost in Prod): ${ip}`);
        return res.json({ success: true, status: "ignored", reason: "localhost" });
      }

      await storage.recordVisit(ip);
      console.log(`[ANALYTICS] RECORDED Visit from IP: ${ip}`);
      res.json({ success: true, status: "recorded" });
    } catch (e) {
      console.error('[ANALYTICS] Error:', e);
      res.json({ success: false }); // Non-critical, always return 200
    }
  });

  // Visit Stats (admin only)
  app.get("/api/admin/visit-stats", async (_req, res) => {
    try {
      const stats = await storage.getVisitStats();
      res.json(stats);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch visit stats" });
    }
  });

  // --- Public Content Routes (Dynamic) ---
  app.get("/api/sliders", async (_req, res) => {
    const items = await storage.getAllSliders();
    res.json(items.filter(i => i.isActive));
  });

  app.get("/api/news", async (_req, res) => {
    const items = await storage.getAllNewsTickers();
    res.json(items.filter(i => i.isActive));
  });

  app.get("/api/gallery", async (_req, res) => {
    const events = await storage.getAllGalleryEvents();
    res.json(events);
  });

  // --- 360 DEGREE STUDENT PROFILE (PRIORITY) ---
  app.get("/api/admin/students/:id/details", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log(`[API_GET] Fetching 360 Details for Student ID: ${id}`);
      const details = await storage.getStudentDetails(id);
      if (!details) return res.status(404).json({ message: "Student not found" });
      res.json(details);
    } catch (error) {
      console.error("Student Details Error:", error);
      res.status(500).json({ message: "Error fetching student details" });
    }
  });

  // --- STUDENT NOTIFICATIONS (TOP PRIORITY) ---
  app.get("/api/student-notifications", async (_req, res) => {
    try {
      const items = await storage.getAllStudentNotifications();
      console.log(`[PUBLIC_GET] Notifications count: ${items.length}`);
      res.json(items.filter(i => i.isActive));
    } catch (e) { res.status(500).json({ error: "Failed to fetch student notifications" }); }
  });

  app.get("/api/admin/student-notifications", async (_req, res) => {
    try {
      const items = await storage.getAllStudentNotifications();
      console.log(`[ADMIN_GET] Notifications count: ${items.length}`);
      res.json(items);
    } catch (error) { res.status(500).json({ message: "Error fetching notifications" }); }
  });

  app.post("/api/admin/student-notifications", async (req, res) => {
    try {
      console.log("[ADMIN_POST] Received body:", req.body);
      const data = insertStudentNotificationSchema.parse(req.body);
      const item = await storage.createStudentNotification(data);
      console.log("[ADMIN_POST] Created successfully:", item);
      res.status(201).json(item);
    } catch (error: any) { 
      console.error("[ADMIN_POST] Error:", error);
      res.status(400).json({ message: error.message || "Invalid notification data" }); 
    }
  });

  app.patch("/api/admin/student-notifications/:id", async (req, res) => {
    try {
      const item = await storage.updateStudentNotification(parseInt(req.params.id), req.body);
      res.json(item);
    } catch (error) { res.status(500).json({ message: "Error updating notification" }); }
  });

  app.delete("/api/admin/student-notifications/:id", async (req, res) => {
    try {
      await storage.deleteStudentNotification(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) { res.status(500).json({ message: "Error deleting notification" }); }
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

  const admissionHandler = async (req: any, res: any) => {
    try {
      // 100% Manual Inline Schema to ensure no stale imports block submission
      const inlineSchema = z.object({
        parentName: z.string().optional().nullable(),
        childName: z.string().min(1),
        grade: z.string().min(1),
        dob: z.string().optional().nullable().default(""),
        gender: z.string().optional().nullable().default("NOT_SPECIFIED"),
        address: z.string().optional().nullable().default("N/A"),
        fatherName: z.string().optional().nullable().default("N/A"),
        motherName: z.string().optional().nullable().default("N/A"),
        academicYear: z.string().min(1).default("2026-2027"),
        email: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
        alternatePhone: z.string().optional().nullable(),
        fatherOccupation: z.string().optional().nullable(),
        motherOccupation: z.string().optional().nullable(),
        previousSchool: z.string().optional().nullable(),
        bloodGroup: z.string().optional().nullable(),
        mobileNo: z.string().optional().nullable(),
        emailId: z.string().optional().nullable(),
        studentPhoto: z.string().optional().nullable(),
        admissionNumber: z.number().optional().nullable(),
        message: z.string().optional().nullable(),
      });

      const { pdfBase64, ...formData } = req.body;
      const data = inlineSchema.parse(formData);
      
      // Ensure required fields for storage type
      const validatedData = {
        ...data,
        dob: data.dob || "",
        gender: data.gender || "NOT_SPECIFIED",
        address: data.address || "N/A",
        fatherName: data.fatherName || "N/A",
        motherName: data.motherName || "N/A",
        academicYear: data.academicYear || "2026-2027",
      };

      const inquiry = await storage.createAdmissionInquiry({
        ...validatedData,
        pdfBase64: null // Provisional PDF will be replaced by finalize step
      } as any);
      
      res.status(201).json({ 
        success: true, 
        message: "Data received. Finalizing PDF...", 
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
  };

  app.get("/api/admission-download/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const inquiry = await storage.getAdmissionInquiry(id);
      
      if (!inquiry || !inquiry.pdfBase64) {
        return res.status(404).send("Document not found");
      }

      // Extract base64 content
      const base64Data = inquiry.pdfBase64.split(',')[1] || inquiry.pdfBase64;
      const buffer = Buffer.from(base64Data, 'base64');

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Admission_Form_${inquiry.admissionNumber || id}.pdf`);
      res.send(buffer);
    } catch (error) {
      res.status(500).send("Error generating download");
    }
  });

  app.get("/api/debug-storage", async (_req, res) => {
    const inquiries = await storage.getAllAdmissionInquiries();
    const lastAdm = inquiries.reduce((max, curr) => {
      const num = curr.admissionNumber || 0;
      return num > max ? num : max;
    }, 26000);
    
    res.json({
      count: inquiries.length,
      lastAdmissionNo: lastAdm,
      cwd: process.cwd(),
      env: process.env.VERCEL ? "VERCEL" : "LOCAL",
      inquiries: inquiries.map(i => ({ id: i.id, adm: i.admissionNumber, name: i.childName }))
    });
  });

  const finalizeHandler = async (req: any, res: any) => {
    try {
      const { id, pdfBase64 } = req.body;
      if (!id || !pdfBase64) {
        return res.status(400).json({ success: false, message: "ID and PDF are required" });
      }

      const inquiry = await storage.getAdmissionInquiry(id);
      if (!inquiry) {
        return res.status(404).json({ success: false, message: "Inquiry not found" });
      }

      const updated = await storage.updateAdmissionInquiry(id, { pdfBase64 });
      
      // Now send the email with the final PDF containing the admission number
      try {
        await sendAdmissionEmail({ 
          ...updated, 
          pdfBase64 
        });
      } catch (e) {
        console.error("Finalization email send failed (non-fatal):", e);
      }
      
      res.status(200).json({ 
        success: true, 
        message: "Admission inquiry finalized successfully.", 
        data: updated 
      });
    } catch (error: any) {
      console.error("FINALIZE ERROR:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  app.post("/api/admission", admissionHandler);
  app.post("/api/admission-finalize", finalizeHandler);
  app.post("/api/admission-inquiry", admissionHandler);

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

  // Public Content Endpoints
  app.get("/api/sliders", async (_req, res) => {
    try {
      const items = await storage.getAllSliders();
      res.json(items.filter(i => i.isActive));
    } catch (e) { res.status(500).json({ error: "Failed to fetch top sliders" }); }
  });

  app.get("/api/news", async (_req, res) => {
    try {
      const items = await storage.getAllNewsTickers();
      res.json(items.filter(i => i.isActive));
    } catch (e) { res.status(500).json({ error: "Failed to fetch news" }); }
  });

  app.get("/api/popups", async (_req, res) => {
    try {
       const items = await storage.getAllPopups();
       res.json(items.filter(i => i.isActive));
    } catch (e) { res.status(500).json({ error: "Failed to fetch popups" }); }
  });

  app.get("/api/gallery", async (_req, res) => {
    try {
       const events = await storage.getAllGalleryEvents();
       res.json(events);
    } catch (e) { res.status(500).json({ error: "Failed to fetch gallery" }); }
  });


  app.get("/api/staff", async (_req, res) => {
    try {
      const items = await storage.getAllStaff();
      res.json(items);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch staff" });
    }
  });


  // --- ADMIN API ROUTES ---

  // Dashboard Stats
  app.get("/api/admin/stats", async (_req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching stats" });
    }
  });

  // Admissions Management
  app.get("/api/admin/admissions", async (_req, res) => {
    try {
      const admissions = await storage.getAllAdmissionInquiries();
      res.json(admissions);
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching admissions" });
    }
  });

  app.patch("/api/admin/admissions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      const inquiry = await storage.getAdmissionInquiry(id);
      if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

      const updated = await storage.updateAdmissionInquiry(id, { status });

      // Logic for Approval: Create a student record
      if (status === 'approved') {
        try {
          console.log(`Processing approval for inquiry ID ${id}...`);
          await storage.createStudent({
            rollNumber: inquiry.admissionNumber?.toString() || `REG-${id}`,
            name: inquiry.childName,
            grade: inquiry.grade,
            dob: inquiry.dob,
            gender: inquiry.gender,
            address: inquiry.address,
            fatherName: inquiry.fatherName,
            motherName: inquiry.motherName,
            parentPhone: inquiry.phone || inquiry.mobileNo || "N/A",
            parentEmail: inquiry.email || inquiry.emailId || null,
            photoUrl: inquiry.studentPhoto,
            academicYear: inquiry.academicYear || "2026-27", // Strict default to ensure registration
            bloodGroup: inquiry.bloodGroup || null,
          });
          console.log(`Student record successfully created for inquiry ID ${id}.`);
        } catch (studentErr: any) {
          console.error("Student Creation Error during Admission Approval:", studentErr);
          // In Phase 2, we should probably throw here to alert the UI that registration failed
        }
      }

      res.json(updated);
    } catch (error: any) {
      console.error("Admission Update Error:", error);
      res.status(500).json({ success: false, message: "Error updating admission" });
    }
  });

  app.delete("/api/admin/admissions/:id", async (req, res) => {
    try {
      await storage.deleteAdmissionInquiry(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error deleting admission" });
    }
  });

  // Student Management

  app.get("/api/admin/students", async (_req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching students" });
    }
  });

  app.post("/api/admin/students", async (req, res) => {
    try {
      const data = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(data);
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ message: "Invalid student data" });
    }
  });

  app.patch("/api/admin/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateStudent(id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error updating student" });
    }
  });

  app.delete("/api/admin/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteStudent(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error deleting student" });
    }
  });


  app.patch("/api/admin/students/:id/documents", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // Data contains aadhaarStatus, birthCertStatus, tcStatus, aadhaarUrl, etc.
      const updated = await storage.updateStudent(id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error updating documents" });
    }
  });

  app.post("/api/admin/students/:id/academics", async (req, res) => {
    try {
      const studentId = parseInt(req.params.id);
      const data = insertStudentAcademicSchema.parse({ ...req.body, studentId });
      const academic = await storage.createStudentAcademic(data);
      res.status(201).json(academic);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid academic data" });
    }
  });

  app.post("/api/admin/students/:id/fees", async (req, res) => {
    try {
      const studentId = parseInt(req.params.id);
      const data = insertFeeTransactionSchema.parse({ ...req.body, studentId });
      
      const transaction = await storage.createFeeTransaction(data);
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid fee transaction data" });
    }
  });
  
  app.patch("/api/admin/students/:id/fees/summary", async (req, res) => {
    try {
      const studentId = parseInt(req.params.id);
      const { academicYear, ...data } = req.body;
      if (!academicYear) return res.status(400).json({ message: "Academic Year required" });
      
      const summary = await storage.updateStudentFeeSummary(studentId, academicYear, data);
      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating fee summary" });
    }
  });

  // Staff Management
  app.get("/api/admin/staff", async (_req, res) => {
    try {
      const staff = await storage.getAllStaff();
      res.json(staff);
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching staff" });
    }
  });

  app.post("/api/admin/staff", async (req, res) => {
    try {
      const data = insertStaffSchema.parse(req.body);
      const member = await storage.createStaff(data);
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ message: "Invalid staff data" });
    }
  });

  app.patch("/api/admin/staff/:id", async (req, res) => {
    try {
      const updated = await storage.updateStaff(parseInt(req.params.id), req.body);
      res.json(updated);
    } catch (error) { res.status(500).json({ message: "Error updating staff" }); }
  });

  app.delete("/api/admin/staff/:id", async (req, res) => {
    try {
      await storage.deleteStaff(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) { res.status(500).json({ message: "Error deleting staff" }); }
  });

  // Content Management (Sliders, News, Popups)
  app.get("/api/admin/sliders", async (_req, res) => {
    const items = await storage.getAllSliders();
    res.json(items);
  });

  app.post("/api/admin/sliders", async (req, res) => {
    const data = insertSliderSchema.parse(req.body);
    const item = await storage.createSlider(data);
    res.status(201).json(item);
  });
  app.patch("/api/admin/sliders/:id", async (req, res) => {
    const item = await storage.updateSlider(parseInt(req.params.id), req.body);
    res.json(item);
  });
  app.delete("/api/admin/sliders/:id", async (req, res) => {
    await storage.deleteSlider(parseInt(req.params.id));
    res.json({ success: true });
  });

  app.get("/api/admin/news", async (_req, res) => {
    const items = await storage.getAllNewsTickers();
    res.json(items);
  });

  app.post("/api/admin/news", async (req, res) => {
    const data = insertNewsTickerSchema.parse(req.body);
    const item = await storage.createNewsTicker(data);
    res.status(201).json(item);
  });
  app.patch("/api/admin/news/:id", async (req, res) => {
    const item = await storage.updateNewsTicker(parseInt(req.params.id), req.body);
    res.json(item);
  });
  app.delete("/api/admin/news/:id", async (req, res) => {
    await storage.deleteNewsTicker(parseInt(req.params.id));
    res.json({ success: true });
  });

  app.get("/api/admin/popups", async (_req, res) => {
    const items = await storage.getAllPopups();
    res.json(items);
  });

  app.post("/api/admin/popups", async (req, res) => {
    const data = insertPopupSchema.parse(req.body);
    const item = await storage.createPopup(data);
    res.status(201).json(item);
  });
  app.patch("/api/admin/popups/:id", async (req, res) => {
    const item = await storage.updatePopup(parseInt(req.params.id), req.body);
    res.json(item);
  });
  app.delete("/api/admin/popups/:id", async (req, res) => {
    await storage.deletePopup(parseInt(req.params.id));
    res.json({ success: true });
  });

  // Gallery Management
  app.get("/api/admin/gallery", async (_req, res) => {
    const events = await storage.getAllGalleryEvents();
    res.json(events);
  });

  app.post("/api/admin/gallery", async (req, res) => {
    try {
      const data = insertGalleryEventSchema.parse(req.body);
      const item = await storage.createGalleryEvent(data);
      res.status(201).json(item);
    } catch (error) { res.status(400).json({ message: "Invalid gallery data" }); }
  });
  
  app.patch("/api/admin/gallery/:id", async (req, res) => {
    try {
      const item = await storage.updateGalleryEvent(parseInt(req.params.id), req.body);
      res.json(item);
    } catch (error) { res.status(500).json({ message: "Error updating item" }); }
  });
  
  app.delete("/api/admin/gallery/:id", async (req, res) => {
    try {
      await storage.deleteGalleryEvent(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) { res.status(500).json({ message: "Error deleting item" }); }
  });

  // Media Assets
  app.get("/api/admin/media", async (_req, res) => {
    try {
      const assets = await storage.getAllMediaAssets();
      res.json(assets);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch media assets" });
    }
  });

  app.post("/api/admin/media", async (req, res) => {
    try {
      const { insertMediaAssetSchema } = await import("../shared/schema.js");
      const data = insertMediaAssetSchema.parse(req.body);
      const asset = await storage.createMediaAsset(data);
      res.status(201).json(asset);
    } catch (e) {
      console.error(e);
      res.status(400).json({ error: "Invalid media asset" });
    }
  });

  app.delete("/api/admin/media/:id", async (req, res) => {
    try {
      await storage.deleteMediaAsset(parseInt(req.params.id));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to delete media asset" });
    }
  });



  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
