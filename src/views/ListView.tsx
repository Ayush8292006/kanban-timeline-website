import React, { useState, useRef, useEffect } from 'react';
import { useStore, getFilteredTasks } from '../store/useStore';
import { Task } from '../types';

const ROW_HEIGHT = 60;
const BUFFER = 5;

export const ListView: React.FC = () => {
  const { tasks, sortField, sortDirection, setSort, updateTask, filters } = useStore();
  const filteredTasks = getFilteredTasks({ tasks, filters, sortField, sortDirection } as any);
  
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate visible rows
  const totalHeight = filteredTasks.length * ROW_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollPosition / ROW_HEIGHT) - BUFFER);
  const endIndex = Math.min(
    filteredTasks.length,
    Math.ceil((scrollPosition + (containerRef.current?.clientHeight || 0)) / ROW_HEIGHT) + BUFFER
  );
  
  const visibleRows = filteredTasks.slice(startIndex, endIndex);
  const offsetY = startIndex * ROW_HEIGHT;
  
  // Handle scroll
  const onScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollTop);
    }
  };
  
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', onScroll);
      return () => container.removeEventListener('scroll', onScroll);
    }
  }, []);
  
  // Priority badge style
  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      critical: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700',
    };
    return styles[priority] || 'bg-gray-100 text-gray-700';
  };
  
  // Empty state
  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <p className="text-gray-400 mb-3">No tasks found</p>
          <button
            onClick={() => useStore.getState().clearFilters()}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            Clear filters
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 gap-3 bg-gray-50 border-b border-gray-200 px-4 py-2 text-sm font-medium text-gray-600">
        <div 
          className="col-span-4 cursor-pointer hover:text-gray-800 flex items-center gap-1"
          onClick={() => setSort('title')}
        >
          Title
          {sortField === 'title' && (
            <span className="text-blue-500">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </div>
        <div className="col-span-2">Assignee</div>
        <div 
          className="col-span-2 cursor-pointer hover:text-gray-800 flex items-center gap-1"
          onClick={() => setSort('priority')}
        >
          Priority
          {sortField === 'priority' && (
            <span className="text-blue-500">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </div>
        <div 
          className="col-span-2 cursor-pointer hover:text-gray-800 flex items-center gap-1"
          onClick={() => setSort('dueDate')}
        >
          Due Date
          {sortField === 'dueDate' && (
            <span className="text-blue-500">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </div>
        <div className="col-span-2">Status</div>
      </div>
      
      {/* Virtual Scroll Container */}
      <div
        ref={containerRef}
        className="overflow-y-auto"
        style={{ height: 'calc(100vh - 280px)' }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ position: 'absolute', top: offsetY, width: '100%' }}>
            {visibleRows.map(task => (
              <div
                key={task.id}
                className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                style={{ height: ROW_HEIGHT }}
              >
                {/* Title */}
                <div className="col-span-4 text-sm text-gray-800 truncate">
                  {task.title}
                </div>
                
                {/* Assignee */}
                <div className="col-span-2 text-sm text-gray-600">
                  {task.assignee.split(' ')[0]}
                </div>
                
                {/* Priority */}
                <div className="col-span-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${getPriorityBadge(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                
                {/* Due Date */}
                <div className="col-span-2 text-sm text-gray-600">
                  {task.dueDate}
                </div>
                
                {/* Status Dropdown */}
                <div className="col-span-2">
                  <select
                    value={task.status}
                    onChange={(e) => updateTask(task.id, { status: e.target.value as Task['status'] })}
                    className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="in-review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};