async function test() {
  const res = await fetch("http://localhost:5000/api/admission-inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      childName: "Test Child", dob: "2020-01-01", gender: "Male", grade: "1st Grade",
      bloodGroup: "O+", nationality: "Indian", address: "123 Test St",
      fatherName: "Test Father", fatherOccupation: "Business",
      motherName: "Test Mother", motherOccupation: "Housewife",
      emailId: "test@test.com", mobileNo: "1234567890", academicYear: "2026-27"
    })
  });
  console.log(await res.json());
}
test();
