import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Users, Eye } from 'lucide-react';

export const CollaborationBar: React.FC = () => {
  const { collaborationUsers, tasks, updateCollaborationUser } = useStore();
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (tasks.length === 0) return;
      
      const randomUser = collaborationUsers[Math.floor(Math.random() * collaborationUsers.length)];
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
      
      updateCollaborationUser(randomUser.id, randomTask.id);
      
      if (Math.random() > 0.7) {
        const anotherUser = collaborationUsers[Math.floor(Math.random() * collaborationUsers.length)];
        updateCollaborationUser(anotherUser.id, null);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [tasks]);
  
  const activeCount = collaborationUsers.filter(u => u.currentTaskId).length;
  
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {activeCount} active viewer{activeCount !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex -space-x-2">
              {collaborationUsers.map(user => (
                <div key={user.id} className="relative group">
                  <div className={`w-7 h-7 rounded-full ${user.color} flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm`}>
                    {user.name[0]}
                  </div>
                  {user.currentTaskId && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white" />
                  )}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {user.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};