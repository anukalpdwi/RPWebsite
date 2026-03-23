async function test() {
  try {
    const res = await fetch("http://localhost:5000/api/admission-inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childName: "Test Child",
        dob: "2020-01-01",
        gender: "Male",
        bloodGroup: "O+",
        nationality: "Indian",
        address: "123 Test St",
        fatherName: "Test Father",
        fatherOccupation: "Business",
        motherName: "Test Mother",
        motherOccupation: "Housewife",
        emailId: "test@test.com",
        mobileNo: "1234567890",
        academicYear: "2026-27",
        grade: "1st Grade"
      })
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text);
  } catch (e) {
    console.error(e);
  }
}
test();
