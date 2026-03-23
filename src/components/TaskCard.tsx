import React from 'react';
import { Task } from '../types';
import { useStore } from '../store/useStore';
import { format, differenceInDays, isToday, parseISO } from 'date-fns';
import { Calendar, Eye, User } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

const priorityColors = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const getDueDateText = (dueDate: string) => {
  const date = parseISO(dueDate);
  const today = new Date();
  const daysOverdue = differenceInDays(today, date);
  
  if (isToday(date)) return 'Due today';
  if (daysOverdue > 0) return `${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue`;
  return format(date, 'MMM d, yyyy');
};

const getDueDateColor = (dueDate: string) => {
  const date = parseISO(dueDate);
  const daysOverdue = differenceInDays(new Date(), date);
  if (isToday(date)) return 'text-amber-600';
  if (daysOverdue > 0) return 'text-red-600';
  return 'text-gray-500';
};

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  isDragging = false,
  onDragStart,
  onDragEnd
}) => {
  const { collaborationUsers } = useStore();
  const viewers = collaborationUsers.filter(u => u.currentTaskId === task.id);
  const dueDateText = getDueDateText(task.dueDate);
  const dueDateColor = getDueDateColor(task.dueDate);
  
  const initials = task.assignee.split(' ').map(n => n[0]).join('');
  const firstName = task.assignee.split(' ')[0];
  
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, task.id)}
      onDragEnd={onDragEnd}
      className={`
        bg-white rounded-lg border border-gray-200 p-3 cursor-grab
        hover:shadow-md hover:border-gray-300 transition-all
        ${isDragging ? 'opacity-50 cursor-grabbing' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        {viewers.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Eye className="w-3 h-3" />
            <span>{viewers.length}</span>
          </div>
        )}
      </div>
      
      {/* Title */}
      <h4 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2">
        {task.title}
      </h4>
      
      {/* Assignee */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
          {initials}
        </div>
        <span className="text-xs text-gray-600">{firstName}</span>
      </div>
      
      {/* Due Date */}
      <div className={`flex items-center gap-1 text-xs ${dueDateColor}`}>
        <Calendar className="w-3 h-3" />
        <span>{dueDateText}</span>
      </div>
      
      {/* Viewers */}
      {viewers.length > 0 && (
        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
          <span className="text-[10px] text-gray-400">Viewing:</span>
          {viewers.slice(0, 3).map(user => (
            <div
              key={user.id}
              className={`w-5 h-5 rounded-full ${user.color} flex items-center justify-center text-white text-[10px]`}
              title={user.name}
            >
              {user.name[0]}
            </div>
          ))}
          {viewers.length > 3 && (
            <span className="text-[10px] text-gray-400">+{viewers.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
};