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
              
              <div style="margin-top: 40px; padding: 20px; border: 1px dashed #e2e8f0; border-radius: 8px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: 500;">
                  The official admission form PDF is attached to this email for your records.
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

      const inquiry = await storage.createAdmissionInquiry(validatedData as any);
      
      try {
        await sendAdmissionEmail({ 
          ...validatedData, 
          admissionNumber: inquiry.admissionNumber,
          pdfBase64 // Ensure the PDF is passed to the email sender
        });
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
  };

  app.post("/api/admission", admissionHandler);
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

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
