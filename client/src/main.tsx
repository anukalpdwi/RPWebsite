import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add title to the page
document.title = "RP Public School, Jaisinghnagar - Nurturing Excellence";

// Add meta description
const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "RP Public School in Jaisinghnagar offers quality education, holistic development, and modern facilities. Join us to nurture excellence, build character, and create future leaders.";
document.head.appendChild(metaDescription);

// Add font links
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

createRoot(document.getElementById("root")!).render(<App />);
