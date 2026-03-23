import React, { useState } from 'react';
import { TaskCard } from '../components/TaskCard';
import { useStore, getFilteredTasks } from '../store/useStore';
import { Task } from '../types';

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-50', border: 'border-gray-200' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'in-review', title: 'In Review', color: 'bg-purple-50', border: 'border-purple-200' },
  { id: 'done', title: 'Done', color: 'bg-green-50', border: 'border-green-200' },
];

export const KanbanView: React.FC = () => {
  const { tasks, updateTask, filters, sortField, sortDirection } = useStore();
  const filteredTasks = getFilteredTasks({ tasks, filters, sortField, sortDirection } as any);
  
  const tasksByColumn = columns.reduce((acc, col) => {
    acc[col.id] = filteredTasks.filter(t => t.status === col.id);
    return acc;
  }, {} as Record<string, Task[]>);
  
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    updateTask(taskId, { status: newStatus as Task['status'] });
  };
  
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map(column => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80 bg-white rounded-lg shadow-sm border border-gray-200"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className={`p-3 rounded-t-lg ${column.color} border-b ${column.border}`}>
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700">{column.title}</h3>
              <span className="bg-white px-2 py-0.5 rounded-full text-xs text-gray-600">
                {tasksByColumn[column.id].length}
              </span>
            </div>
          </div>
          
          <div className="p-2 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
            {tasksByColumn[column.id].map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onDragStart={handleDragStart}
                onDragEnd={() => {}}
              />
            ))}
            {tasksByColumn[column.id].length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No tasks</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};