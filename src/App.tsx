import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { FilterBar } from './components/FilterBar';
import { CollaborationBar } from './components/CollaborationBar';
import { KanbanView } from './views/KanbanView';
import { ListView } from './views/ListView';
import { TimelineView } from './views/TimelineView';
import { BrowserRouter, useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, Calendar, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { view, setView, tasks } = useStore();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam === 'kanban' || viewParam === 'list' || viewParam === 'timeline') {
      setView(viewParam);
    }
  }, [searchParams, setView]);
  
  const renderView = () => {
    switch (view) {
      case 'kanban':
        return <KanbanView />;
      case 'list':
        return <ListView />;
      case 'timeline':
        return <TimelineView />;
      default:
        return <KanbanView />;
    }
  };
  
  const tabs = [
    { id: 'kanban', label: 'Board', icon: LayoutGrid },
    { id: 'list', label: 'List', icon: List },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
  ];
  
  const stats = [
    { 
      label: 'Total Tasks', 
      value: tasks.length, 
      icon: AlertCircle,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      label: 'In Progress', 
      value: tasks.filter(t => t.status === 'in-progress').length, 
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    { 
      label: 'Completed', 
      value: tasks.filter(t => t.status === 'done').length, 
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">P</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-800">ProjectFlow</h1>
                <p className="text-xs text-gray-400">Task Management</p>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id as any)}
                  className={`
                    flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all
                    ${view === tab.id 
                      ? 'bg-white text-gray-800 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            
            {/* Profile */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
              JD
            </div>
          </div>
        </div>
      </header>
      
      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <CollaborationBar />
      <FilterBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-fadeIn">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;