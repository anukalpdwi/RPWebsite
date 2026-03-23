async function test() {
  const res = await fetch("http://localhost:5001/api/admission-inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      parentName: "Test Parent",
      childName: "Test Child", dob: "2020-01-01", gender: "Male", grade: "1st Grade",
      bloodGroup: "O+", nationality: "Indian", address: "123 Test St",
      fatherName: "Test Father", fatherOccupation: "Business",
      motherName: "Test Mother", motherOccupation: "Housewife",
      email: "test@test.com", phone: "1234567890", academicYear: "2026-2027",
      emailId: "test-id@test.com", mobileNo: "0987654321", message: "Hello"
    })
  });
  console.log("Status:", res.status);
  console.log(await res.json());
}
test();
