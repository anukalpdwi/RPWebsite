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
  location: "Jaisinghnagar, Shahdol, Madhya Pradesh",
  fullName: "RP Public School, Jaisinghnagar Shahdol, Madhya Pradesh",
  address: "RP Public School Campus, Main Road, Jaisinghnagar, Distt. Madhya Pradesh, India - 484771",
  phone: "+91 9893767392, +91 9893575723",
  admissionsPhone: "+91 9893767392",
  principalPhone: "+91 9893767392",
  email: "rppublicschool@gmail.com",
  admissionsEmail: "rppublicschool@gmial.com",
  principalEmail: "dserdjaisinghnagar@gmail.com",
  hours: "9:00 AM - 3:30 PM",
  socialMedia: {
    facebook: "https://www.facebook.com/p/RP-Public-School-Jaisinghnagar-100070063312463/",
    twitter: "#",
    instagram: "https://www.instagram.com/rppublic.school/",
    youtube: "#"
  },
  founded: 2021
};
