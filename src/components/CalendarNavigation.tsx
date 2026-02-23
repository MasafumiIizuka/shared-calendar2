'use client';

interface CalendarNavigationProps {
  currentWeekStart: Date;
  onPreviousWeek: () => void;
  onToday: () => void;
  onNextWeek: () => void;
  onAddEvent: () => void;
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function CalendarNavigation({
  currentWeekStart,
  onPreviousWeek,
  onToday,
  onNextWeek,
  onAddEvent,
}: CalendarNavigationProps) {
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="前週"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={onToday}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            今日
          </button>
          <button
            onClick={onNextWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="次週"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <h2 className="text-lg font-semibold text-gray-800">
          {formatDate(currentWeekStart)} - {formatDate(weekEnd)}
        </h2>

        <button
          onClick={onAddEvent}
          className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          予定を追加
        </button>
      </div>
    </div>
  );
}
