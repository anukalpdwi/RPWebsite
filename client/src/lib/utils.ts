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

export const getGoogleDriveDirectLink = (url: string) => {
  if (url && url.includes("drive.google.com")) {
    const fileId = url.match(/\/d\/([^/]+)/)?.[1] || url.match(/id=([^&]+)/)?.[1];
    return fileId ? `https://drive.google.com/uc?export=view&id=${fileId}` : url;
  }
  return url;
};

export const schoolInfo = {
  name: "RP Public School",
  location: "Jaisinghnagar, Shahdol, Madhya Pradesh",
  fullName: "RP Public School, Jaisinghnagar Shahdol, Madhya Pradesh",
  address: "RP Public School Campus, Main Road, Jaisinghnagar, Distt. Madhya Pradesh, India - 484771",
  phone: "+91 9893767392",
  admissionsPhone: "91 7000984484",
  principalPhone: "+91 9893767392",
  email: "rppublicschool2021@gmail.com",
  admissionsEmail: "rppublicschool2021@gmail.com",
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
