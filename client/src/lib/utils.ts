import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export const schoolInfo = {
  name: "RP Public School",
  location: "Jaisinghnagar",
  fullName: "RP Public School, Jaisinghnagar",
  address: "RP Public School Campus, Main Road, Jaisinghnagar, Madhya Pradesh, India - 488999",
  phone: "+91 9876543210",
  admissionsPhone: "+91 9876543211",
  principalPhone: "+91 9876543212",
  email: "info@rppublicschool.edu.in",
  admissionsEmail: "admissions@rppublicschool.edu.in",
  principalEmail: "principal@rppublicschool.edu.in",
  hours: "8:00 AM - 3:30 PM",
  socialMedia: {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    youtube: "#"
  },
  founded: 1995
};
