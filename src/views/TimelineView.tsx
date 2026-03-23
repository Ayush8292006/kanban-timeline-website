import React from 'react';
import { useStore, getFilteredTasks } from '../store/useStore';
import { parseISO, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, format, isToday } from 'date-fns';

// Priority colors for timeline bars
const barColors = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

export const TimelineView: React.FC = () => {
  const { tasks, filters, sortField, sortDirection } = useStore();
  const filteredTasks = getFilteredTasks({ tasks, filters, sortField, sortDirection } as any);
  
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const dayWidth = 100; // pixels per day
  const totalWidth = daysInMonth.length * dayWidth;
  
  // Calculate bar position for a task
  const getBarPosition = (task: any) => {
    // Get start date (use due date if no start date)
    const startDate = task.startDate ? parseISO(task.startDate) : parseISO(task.dueDate);
    const endDate = parseISO(task.dueDate);
    
    // If task ends before month starts, don't show
    if (endDate < monthStart) return null;
    
    // If task starts after month ends, don't show
    if (startDate > monthEnd) return null;
    
    // Adjust start to month start if needed
    const visibleStart = startDate < monthStart ? monthStart : startDate;
    
    const startOffset = differenceInDays(visibleStart, monthStart);
    const duration = differenceInDays(endDate, startDate) + 1;
    
    return {
      left: startOffset * dayWidth,
      width: duration * dayWidth,
    };
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
      <div className="min-w-[800px] p-4">
        {/* Header - Days */}
        <div className="flex border-b border-gray-200 pb-2 mb-3">
          <div className="w-48 flex-shrink-0 text-sm font-medium text-gray-600">
            Task
          </div>
          <div className="flex">
            {daysInMonth.map(day => (
              <div
                key={day.toISOString()}
                className={`text-xs text-center ${isToday(day) ? 'text-blue-600 font-medium' : 'text-gray-500'}`}
                style={{ width: dayWidth }}
              >
                {format(day, 'd')}
              </div>
            ))}
          </div>
        </div>
        
        {/* Timeline Bars */}
        <div className="space-y-2">
          {filteredTasks.map(task => {
            const position = getBarPosition(task);
            if (!position) return null;
            
            return (
              <div key={task.id} className="flex items-center group">
                {/* Task title */}
                <div className="w-48 flex-shrink-0 text-sm text-gray-700 truncate pr-2">
                  {task.title}
                </div>
                
                {/* Bar container */}
                <div className="relative" style={{ height: 36, width: totalWidth }}>
                  <div
                    className={`absolute h-7 rounded ${barColors[task.priority]} opacity-70 group-hover:opacity-100 transition-opacity`}
                    style={{
                      left: position.left,
                      width: position.width,
                      top: 4,
                    }}
                  >
                    <span className="text-white text-xs ml-2 truncate block">
                      {task.title}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Empty state */}
          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No tasks to display</p>
            </div>
          )}
        </div>
        
        {/* Today marker line */}
        <div className="relative mt-4 pt-2">
          <div
            className="absolute top-0 bottom-0 w-px bg-red-500"
            style={{
              left: differenceInDays(today, monthStart) * dayWidth + 48,
            }}
          />
          <div className="text-xs text-red-500 mt-1 text-center" style={{ marginLeft: differenceInDays(today, monthStart) * dayWidth + 40 }}>
            Today
          </div>
        </div>
      </div>
    </div>
  );
};