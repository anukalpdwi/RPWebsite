import { storage } from "./server/storage.js";
import { insertStudentSchema } from "./shared/schema.js";

async function testApproval() {
  try {
    console.log("Testing student creation...");
    const studentData = {
      rollNumber: "TEST-123",
      name: "Test Student",
      grade: "1st",
      dob: "2015-01-01",
      gender: "Male",
      address: "123 Test St",
      fatherName: "Father",
      motherName: "Mother",
      parentPhone: "1234567890",
      academicYear: "2026-27",
      bloodGroup: "O+",
    };

    const student = await storage.createStudent(studentData);
    console.log("Student created successfully:", student.id);
    
    console.log("Testing details derivation...");
    const details = await storage.getStudentDetails(student.id);
    console.log("Details fetched:", details ? "YES" : "NO");
    if (details) {
      console.log("Student name in details:", details.student.name);
      console.log("Fee Summary found:", !!details.feeSummary);
      console.log("Transactions count:", details.feeTransactions?.length);
    }

    // Cleanup
    await storage.deleteStudent(student.id);
    console.log("Test student deleted.");
  } catch (error) {
    console.error("TEST FAILED:", error);
  }
}

testApproval();
