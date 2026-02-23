'use client';

import { CalendarEvent } from '@/types';
import Image from 'next/image';

interface EventDetailModalProps {
  isOpen: boolean;
  event: CalendarEvent | null;
  currentUserId: string;
  onClose: () => void;
  onAccept: (eventId: string) => Promise<void>;
  onDelete: (eventId: string) => Promise<void>;
}

function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}

export default function EventDetailModal({
  isOpen,
  event,
  currentUserId,
  onClose,
  onAccept,
  onDelete,
}: EventDetailModalProps) {
  if (!isOpen || !event) return null;

  const isCreator = event.creatorId === currentUserId;
  const hasAccepted = event.attendees.some(a => a.id === currentUserId);
  const startTime = event.startTime.toDate();

  const handleAccept = async () => {
    try {
      await onAccept(event.id);
    } catch (error) {
      console.error('Error accepting event:', error);
      alert('承諾に失敗しました');
    }
  };

  const handleDelete = async () => {
    if (!confirm('この予定を削除しますか？')) return;
    
    try {
      await onDelete(event.id);
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('削除に失敗しました');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900 pr-8">{event.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 flex-shrink-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Creator */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500 mb-2">作成者</div>
              <div className="flex items-center gap-3">
                {event.creatorPhoto && (
                  <Image
                    src={event.creatorPhoto}
                    alt={event.creatorName}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white shadow-sm"
                  />
                )}
                <div>
                  <div className="font-medium text-gray-900">{event.creatorName}</div>
                  <div className="text-sm text-gray-500">{event.creatorEmail}</div>
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">日時</div>
                  <div className="text-gray-900">
                    {formatDateTime(startTime)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">時間</div>
                  <div className="text-gray-900">{event.duration}時間</div>
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500 mb-2">説明</div>
                <div className="text-gray-900 whitespace-pre-wrap">{event.description}</div>
              </div>
            )}

            {/* Attendees */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500 mb-3">
                承諾した参加者 ({event.attendees.length})
              </div>
              {event.attendees.length > 0 ? (
                <div className="space-y-2">
                  {event.attendees.map((attendee) => (
                    <div key={attendee.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          src={attendee.photo}
                          alt={attendee.name}
                          width={32}
                          height={32}
                          className="rounded-full border-2 border-white shadow-sm"
                        />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{attendee.name}</div>
                          <div className="text-xs text-gray-500">{attendee.email}</div>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        ✓ 承諾済み
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">まだ承諾した参加者はいません</div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              閉じる
            </button>
            {!isCreator && !hasAccepted && (
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
              >
                承諾する
              </button>
            )}
            {isCreator && (
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
              >
                削除
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
