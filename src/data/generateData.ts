import { Task } from '../types';

// Team members
const teamMembers = [
  'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 
  'Neha Gupta', 'Vikram Singh', 'Anjali Mehta',
  'Rajesh Khanna', 'Pooja Verma', 'Suresh Nair', 'Divya Reddy'
];

// Task titles
const taskTitles = [
  'Fix login bug', 'Add dark mode', 'Optimize API calls', 'Write documentation',
  'Design new UI', 'Fix mobile layout', 'Add analytics', 'Update dependencies',
  'Create test suite', 'Refactor code', 'Improve performance', 'Add search feature',
  'Fix accessibility', 'Update README', 'Deploy to production', 'Setup CI/CD',
  'Review PRs', 'Fix security issue', 'Add error handling', 'Update design system'
];

// Priority levels
const priorityLevels: Task['priority'][] = ['critical', 'high', 'medium', 'low'];

// Status options
const statusOptions: Task['status'][] = ['todo', 'in-progress', 'in-review', 'done'];

// Helper: Get random date between two dates
const getRandomDate = (start: Date, end: Date) => {
  const timeDiff = end.getTime() - start.getTime();
  const randomTime = start.getTime() + Math.random() * timeDiff;
  return new Date(randomTime);
};

// Helper: Format date to YYYY-MM-DD
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const generateTasks = (count: number): Task[] => {
  const tasks: Task[] = [];
  const today = new Date();
  
  // Date ranges
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(today.getMonth() - 3);
  
  const threeMonthsLater = new Date(today);
  threeMonthsLater.setMonth(today.getMonth() + 3);
  
  for (let i = 0; i < count; i++) {
    // Random due date (mostly future, some past for overdue)
    const dueDate = getRandomDate(today, threeMonthsLater);
    
    // 30% chance of having start date
    const hasStartDate = Math.random() > 0.7;
    const startDate = hasStartDate ? getRandomDate(threeMonthsAgo, dueDate) : null;
    
    // Some tasks are overdue (30% chance)
    const isOverdue = Math.random() > 0.7;
    const finalDueDate = isOverdue ? getRandomDate(threeMonthsAgo, today) : dueDate;
    
    // Pick random title, add number to make it unique
    const titleIndex = i % taskTitles.length;
    const taskNumber = Math.floor(i / taskTitles.length) + 1;
    const title = `${taskTitles[titleIndex]} ${taskNumber}`;
    
    // Random status, priority, assignee
    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const randomPriority = priorityLevels[Math.floor(Math.random() * priorityLevels.length)];
    const randomAssignee = teamMembers[Math.floor(Math.random() * teamMembers.length)];
    
    tasks.push({
      id: `task-${i + 1}`,
      title: title,
      description: `Task description for ${title}`,
      status: randomStatus,
      priority: randomPriority,
      assignee: randomAssignee,
      dueDate: formatDate(finalDueDate),
      startDate: startDate ? formatDate(startDate) : null,
      createdAt: formatDate(getRandomDate(threeMonthsAgo, today)),
    });
  }
  
  return tasks;
};