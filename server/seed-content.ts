import { db } from "./db.js";
import { sliders, galleryEvents, galleryImages } from "../shared/schema.js";

const heroSlides = [
  {
    image: "/Images/annual-day/1.jpg",
    title: "Welcome  to  RP Public School",
    subtitle: "Nurturing Excellence, Building Character, Creating Future Leaders",
  },
  {
    image: "/Images/Hero Images/rpbg2.jpg",
    title: "Excellence  in  Education",
    subtitle: "Modern Facilities, Expert Faculty, and Comprehensive Curriculum",
  },
  {
    image: "/Images/students/arts5.jpg",
    title: "Holistic  Development",
    subtitle: "Sports, Arts, and Extracurricular Activities for Well-rounded Growth",
  },
  {
    image: "/Images/annual-day/Skit 1.JPG",
    title: "Welcome  to  RP Public School",
    subtitle: "Nurturing Excellence, Building Character, Creating Future Leaders",
  },
  {
    image: "/Images/students/Arts.jpg",
    title: "Excellence  in  Education",
    subtitle: "Modern Facilities, Expert Faculty, and Comprehensive Curriculum",
  },
  {
    image: "/Images/students/stu3.jpg",
    title: "Holistic  Development",
    subtitle: "Sports, Arts, and Extracurricular Activities for Well-rounded Growth",
  }
];

const galleryData = [
  { src: "/Images/students/Arts.jpg", alt: "Arts and Crafts" },
  { src: "/Images/Facilities/smart tv.jpg", alt: "Classroom Activity" },
  { src: "/Images/students/stu 1.webp", alt: "Science Exhibition" },
  { src: "/Images/Facilities/Sports.jpg", alt: "Sports Event" },
  { src: "/Images/annual-day/27.jpg", alt: "Cultural Performance" },
  { src: "/Images/banner/bg4.jpg", alt: "Art Class" },
  { src: "/Images/students/republic1.jpg", alt: "Republic Day Celebration" },
  { src: "/Images/Facilities/Computer lab.webp", alt: "Computer Lab" },
  { src: "/Images/students/krishna.jpg", alt: "Events and Celebrations" },
  { src: "/Images/students/arts4.jpg", alt: "Arts and Crafts" },
  { src: "/Images/students/class.jpg", alt: "Classroom" },
  { src: "/Images/students/parade.jpg", alt: "Parade" },
  { src: "/Images/students/stu3.jpg", alt: "Events and Celebrations" },
];

async function runSeed() {
  console.log("Seeding Database...");

  try {
    // Check if sliders exist
    const existingSliders = await db.select().from(sliders);
    if (existingSliders.length === 0) {
      console.log("Seeding Home Sliders...");
      for (let i = 0; i < heroSlides.length; i++) {
        await db.insert(sliders).values({
          imageUrl: heroSlides[i].image,
          title: heroSlides[i].title,
          description: heroSlides[i].subtitle,
          order: i,
          isActive: true
        });
      }
      console.log("Sliders seeded ✓");
    } else {
      console.log("Sliders already populated.");
    }

    // Check if gallery exists
    const existingGallery = await db.select().from(galleryEvents);
    if (existingGallery.length === 0) {
      console.log("Seeding Gallery...");
      for (let i = 0; i < galleryData.length; i++) {
        await db.insert(galleryEvents).values({
          eventName: galleryData[i].alt,
          description: "Synced from initial code",
          eventDate: new Date().toISOString().split('T')[0],
          coverImageUrl: galleryData[i].src
        });
      }
      console.log("Gallery seeded ✓");
    } else {
      console.log("Gallery already populated.");
    }

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
  process.exit(0);
}

runSeed();
