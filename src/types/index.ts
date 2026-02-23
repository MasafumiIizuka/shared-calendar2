import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Attendee {
  id: string;
  name: string;
  photo: string;
  email: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Timestamp;
  duration: number; // in hours
  creatorId: string;
  creatorName: string;
  creatorPhoto: string;
  creatorEmail: string;
  attendees: Attendee[];
  createdAt: Timestamp;
}

export interface CalendarEventInput {
  title: string;
  description?: string;
  startTime: Date;
  duration: number;
}
