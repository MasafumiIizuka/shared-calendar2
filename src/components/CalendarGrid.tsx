'use client';

import { CalendarEvent } from '@/types';
import Image from 'next/image';

interface CalendarGridProps {
  currentWeekStart: Date;
  events: CalendarEvent[];
  onCellClick: (datetime: Date) => void;
  onEventClick: (eventId: string) => void;
}

function formatDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function CalendarGrid({
  currentWeekStart,
  events,
  onCellClick,
  onEventClick,
}: CalendarGridProps) {
  const weekDays = ['月', '火', '水', '木', '金', '土', '日'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForCell = (datetime: Date) => {
    return events.filter(event => {
      const eventTime = event.startTime.toDate();
      return (
        eventTime.getTime() === datetime.getTime()
      );
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-[auto_repeat(7,minmax(120px,1fr))] gap-px bg-gray-200">
            {/* Header Row */}
            <div className="bg-gray-50"></div>
            {weekDays.map((day, index) => {
              const date = new Date(currentWeekStart);
              date.setDate(date.getDate() + index);
              const isToday = new Date().toDateString() === date.toDateString();
              
              return (
                <div
                  key={index}
                  className={`bg-gray-50 p-3 text-center font-semibold ${
                    isToday ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                  }`}
                >
                  <div className="text-sm">{day}</div>
                  <div className={`text-lg ${isToday ? 'font-bold' : ''}`}>
                    {formatDate(date)}
                  </div>
                </div>
              );
            })}

            {/* Time Rows */}
            {hours.map(hour => (
              <div key={hour} className="contents">
                <div className="bg-white p-2 text-right text-xs text-gray-500 font-medium border-r border-gray-200">
                  {hour}:00
                </div>
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const cellDate = new Date(currentWeekStart);
                  cellDate.setDate(cellDate.getDate() + dayIndex);
                  cellDate.setHours(hour, 0, 0, 0);
                  
                  const cellEvents = getEventsForCell(cellDate);

                  return (
                    <div
                      key={`${hour}-${dayIndex}`}
                      className="bg-white min-h-[80px] p-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150 relative"
                      onClick={() => onCellClick(cellDate)}
                    >
                      {cellEvents.map(event => (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event.id);
                          }}
                          className="mb-1 p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs cursor-pointer hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-center gap-1 mb-1">
                            {event.creatorPhoto && (
                              <Image
                                src={event.creatorPhoto}
                                alt={event.creatorName}
                                width={16}
                                height={16}
                                className="rounded-full border border-white"
                              />
                            )}
                            <span className="font-medium truncate">{event.creatorName}</span>
                          </div>
                          <div className="font-bold truncate">{event.title}</div>
                          <div className="text-white/90">{event.duration}時間</div>
                          {event.attendees.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {event.attendees.slice(0, 3).map((attendee, idx) => (
                                <Image
                                  key={idx}
                                  src={attendee.photo}
                                  alt={attendee.name}
                                  width={16}
                                  height={16}
                                  className="rounded-full border border-white"
                                  title={attendee.name}
                                />
                              ))}
                              {event.attendees.length > 3 && (
                                <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[10px] font-bold">
                                  +{event.attendees.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
