import { insertAdmissionInquirySchema } from "./shared/schema.js";
const data = {
  childName: "Test Child", dob: "2020-01-01", gender: "Male", grade: "1st Grade",
  bloodGroup: "O+", nationality: "Indian", address: "123 Test St",
  fatherName: "Test Father", fatherOccupation: "Business",
  motherName: "Test Mother", motherOccupation: "Housewife",
  emailId: "test@test.com", mobileNo: "1234567890", academicYear: "2026-27"
};
const result = insertAdmissionInquirySchema.safeParse(data);
if (!result.success) {
  console.log(JSON.stringify(result.error.issues, null, 2));
} else {
  console.log("Success!");
}
