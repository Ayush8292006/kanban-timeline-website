import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Calendar, User, Flag } from 'lucide-react';

// Status options
const statusList = [
  { value: 'todo', label: 'To Do', color: 'bg-gray-100 text-gray-700' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  { value: 'in-review', label: 'In Review', color: 'bg-purple-100 text-purple-700' },
  { value: 'done', label: 'Done', color: 'bg-green-100 text-green-700' }
];

// Priority options
const priorityList = [
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-700' }
];

// Team members
const teamMembers = [
  'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 
  'Neha Gupta', 'Vikram Singh', 'Anjali Mehta',
  'Rajesh Khanna', 'Pooja Verma', 'Suresh Nair', 'Divya Reddy'
];

export const FilterBar: React.FC = () => {
  const { filters, setFilters, clearFilters } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // Load filters from URL when page loads
  useEffect(() => {
    const statusParam = searchParams.get('status');
    const priorityParam = searchParams.get('priority');
    const assigneeParam = searchParams.get('assignee');
    const fromDateParam = searchParams.get('fromDate');
    const toDateParam = searchParams.get('toDate');
    
    const newFilters: any = {};
    
    if (statusParam) newFilters.status = statusParam.split(',');
    if (priorityParam) newFilters.priority = priorityParam.split(',');
    if (assigneeParam) newFilters.assignee = assigneeParam.split(',');
    if (fromDateParam) newFilters.fromDate = fromDateParam;
    if (toDateParam) newFilters.toDate = toDateParam;
    
    if (Object.keys(newFilters).length > 0) {
      setFilters(newFilters);
    }
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const urlParams: any = {};
    
    if (filters.status.length) urlParams.status = filters.status.join(',');
    if (filters.priority.length) urlParams.priority = filters.priority.join(',');
    if (filters.assignee.length) urlParams.assignee = filters.assignee.join(',');
    if (filters.fromDate) urlParams.fromDate = filters.fromDate;
    if (filters.toDate) urlParams.toDate = filters.toDate;
    
    setSearchParams(urlParams);
  }, [filters]);

  // Check if any filter is active
  const hasFilters = filters.status.length > 0 || 
                     filters.priority.length > 0 || 
                     filters.assignee.length > 0 || 
                     filters.fromDate !== '' || 
                     filters.toDate !== '';
  
  // Count active filters
  const filterCount = filters.status.length + 
                      filters.priority.length + 
                      filters.assignee.length + 
                      (filters.fromDate ? 1 : 0) + 
                      (filters.toDate ? 1 : 0);

  // Toggle status filter
  const toggleStatus = (status: string) => {
    if (filters.status.includes(status)) {
      setFilters({ status: filters.status.filter(s => s !== status) });
    } else {
      setFilters({ status: [...filters.status, status] });
    }
  };

  // Toggle priority filter
  const togglePriority = (priority: string) => {
    if (filters.priority.includes(priority)) {
      setFilters({ priority: filters.priority.filter(p => p !== priority) });
    } else {
      setFilters({ priority: [...filters.priority, priority] });
    }
  };

  // Toggle assignee filter
  const toggleAssignee = (assignee: string) => {
    if (filters.assignee.includes(assignee)) {
      setFilters({ assignee: filters.assignee.filter(a => a !== assignee) });
    } else {
      setFilters({ assignee: [...filters.assignee, assignee] });
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter Button Bar */}
        <div className="flex items-center justify-between py-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasFilters && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {filterCount}
              </span>
            )}
          </button>
          
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>
        
        {/* Filter Options */}
        {showFilters && (
          <div className="py-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Status Section */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Status
                </h4>
                <div className="space-y-1.5">
                  {statusList.map(opt => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(opt.value)}
                        onChange={() => toggleStatus(opt.value)}
                        className="rounded border-gray-300"
                      />
                      <span className={`text-xs px-2 py-0.5 rounded ${opt.color}`}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Priority Section */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Priority
                </h4>
                <div className="space-y-1.5">
                  {priorityList.map(opt => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.priority.includes(opt.value)}
                        onChange={() => togglePriority(opt.value)}
                        className="rounded border-gray-300"
                      />
                      <span className={`text-xs px-2 py-0.5 rounded ${opt.color}`}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Assignee Section */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Assignee
                </h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {teamMembers.map(member => (
                    <label key={member} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.assignee.includes(member)}
                        onChange={() => toggleAssignee(member)}
                        className="rounded border-gray-300"
                      />
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600">
                          {member.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-gray-600">{member.split(' ')[0]}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Date Range Section */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Due Date
                </h4>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) => setFilters({ fromDate: e.target.value })}
                    className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="From"
                  />
                  <input
                    type="date"
                    value={filters.toDate}
                    onChange={(e) => setFilters({ toDate: e.target.value })}
                    className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="To"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};