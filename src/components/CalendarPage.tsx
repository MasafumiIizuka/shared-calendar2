'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query,
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CalendarEvent, CalendarEventInput } from '@/types';
import Header from '@/components/Header';
import CalendarNavigation from '@/components/CalendarNavigation';
import CalendarGrid from '@/components/CalendarGrid';
import AddEventModal from '@/components/AddEventModal';
import EventDetailModal from '@/components/EventDetailModal';

export default function CalendarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Monday as start of week
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [initialDate, setInitialDate] = useState<Date | undefined>();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'events'),
      orderBy('startTime', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData: CalendarEvent[] = [];
      snapshot.forEach((doc) => {
        eventsData.push({
          id: doc.id,
          ...doc.data(),
        } as CalendarEvent);
      });
      setEvents(eventsData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddEvent = async (eventInput: CalendarEventInput) => {
    if (!user) return;

    await addDoc(collection(db, 'events'), {
      title: eventInput.title,
      description: eventInput.description || '',
      startTime: Timestamp.fromDate(eventInput.startTime),
      duration: eventInput.duration,
      creatorId: user.uid,
      creatorName: user.displayName || 'Unknown',
      creatorPhoto: user.photoURL || '',
      creatorEmail: user.email || '',
      attendees: [],
      createdAt: Timestamp.now(),
    });
  };

  const handleAcceptEvent = async (eventId: string) => {
    if (!user) return;

    const event = events.find(e => e.id === eventId);
    if (!event) return;

    // Check if already accepted
    if (event.attendees.some(a => a.id === user.uid)) {
      alert('すでに承諾済みです');
      return;
    }

    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      attendees: arrayUnion({
        id: user.uid,
        name: user.displayName || 'Unknown',
        photo: user.photoURL || '',
        email: user.email || '',
      }),
    });

    // Refresh the selected event
    const updatedEvent = events.find(e => e.id === eventId);
    if (updatedEvent) {
      setSelectedEvent({ ...updatedEvent });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    await deleteDoc(doc(db, 'events', eventId));
  };

  const handleCellClick = (datetime: Date) => {
    setInitialDate(datetime);
    setIsAddModalOpen(true);
  };

  const handleEventClick = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsDetailModalOpen(true);
    }
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    setCurrentWeekStart(monday);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CalendarNavigation
          currentWeekStart={currentWeekStart}
          onPreviousWeek={handlePreviousWeek}
          onToday={handleToday}
          onNextWeek={handleNextWeek}
          onAddEvent={() => {
            setInitialDate(undefined);
            setIsAddModalOpen(true);
          }}
        />

        <CalendarGrid
          currentWeekStart={currentWeekStart}
          events={events}
          onCellClick={handleCellClick}
          onEventClick={handleEventClick}
        />
      </main>

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddEvent}
        initialDate={initialDate}
      />

      <EventDetailModal
        isOpen={isDetailModalOpen}
        event={selectedEvent}
        currentUserId={user.uid}
        onClose={() => setIsDetailModalOpen(false)}
        onAccept={handleAcceptEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}
