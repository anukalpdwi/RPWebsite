import { storage } from "./server/storage.js";

async function test() {
  const inquiries = await storage.getAllAdmissionInquiries();
  console.log(`Count: ${inquiries.length}`);
  
  const lastAdm = inquiries.reduce((max, curr) => {
    const num = curr.admissionNumber || 0;
    return num > max ? num : max;
  }, 26000);
  
  console.log(`Last Admission No: ${lastAdm}`);
  console.log(`Next Admission No: ${lastAdm + 1}`);
  
  if (lastAdm + 1 === 26008) {
    console.log("SUCCESS: Storage logic is correct.");
  } else {
    console.log("FAILURE: Storage logic is still incorrect.");
  }
}

test().catch(console.error);
