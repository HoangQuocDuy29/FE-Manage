// File: src/components/pages/LogWorkPage.tsx (MỚI)
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Calendar,
  Clock,
  Search,
  Eye,
  Plus,
  Filter,
  Download
} from 'lucide-react';
import { useToast } from '@/components/hooks/use-toast';

interface LogWork {
  id: number;
  date: string;
  hoursWorked: number;
  description?: string;
  task: {
    id: number;
    title: string;
    priority: 'low' | 'medium' | 'high';
  };
  user: {
    id: number;
    fullName?: string;
    email: string;
  };
  createdAt: string;
}

export default function LogWorkPage() {
  const [logWorks, setLogWorks] = useState<LogWork[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [userFilter, setUserFilter] = useState('');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLogWork, setSelectedLogWork] = useState<LogWork | null>(null);

  const { toast } = useToast();

  // Mock data - replace with API calls
  const mockLogWorks: LogWork[] = [
    {
      id: 1,
      date: '2025-01-30',
      hoursWorked: 8.5,
      description: 'Implemented user authentication API endpoints',
      task: {
        id: 1,
        title: 'Develop User Management API',
        priority: 'high'
      },
      user: {
        id: 2,
        fullName: 'John Developer',
        email: 'john@company.com'
      },
      createdAt: '2025-01-30T17:30:00Z'
    },
    {
      id: 2,
      date: '2025-01-30',
      hoursWorked: 6.0,
      description: 'Database schema migration and testing',
      task: {
        id: 2,
        title: 'Update Database Schema',
        priority: 'medium'
      },
      user: {
        id: 3,
        fullName: 'Jane Smith',
        email: 'jane@company.com'
      },
      createdAt: '2025-01-30T16:00:00Z'
    },
    {
      id: 3,
      date: '2025-01-29',
      hoursWorked: 4.5,
      description: 'Frontend component development',
      task: {
        id: 3,
        title: 'Build User Interface Components',
        priority: 'medium'
      },
      user: {
        id: 2,
        fullName: 'John Developer',
        email: 'john@company.com'
      },
      createdAt: '2025-01-29T14:30:00Z'
    },
    {
      id: 4,
      date: '2025-01-29',
      hoursWorked: 7.0,
      description: 'API integration and testing',
      task: {
        id: 1,
        title: 'Develop User Management API',
        priority: 'high'
      },
      user: {
        id: 4,
        fullName: 'Bob Wilson',
        email: 'bob@company.com'
      },
      createdAt: '2025-01-29T18:00:00Z'
    }
  ];

  const loadLogWorks = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetchLogWorks();
      // setLogWorks(response.data);
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setLogWorks(mockLogWorks);
    } catch (error) {
      console.error('Error loading log works:', error);
      toast({
        title: 'Error loading log works',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': 
      default: return 'outline';
    }
  };

  const filteredLogWorks = logWorks.filter(logWork => {
    const matchesSearch = !searchTerm || 
      logWork.task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      logWork.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (logWork.user.fullName && logWork.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDateFrom = !dateFrom || logWork.date >= dateFrom;
    const matchesDateTo = !dateTo || logWork.date <= dateTo;
    const matchesUser = !userFilter || logWork.user.email === userFilter;
    
    return matchesSearch && matchesDateFrom && matchesDateTo && matchesUser;
  });

  // Calculate statistics
  const totalHours = filteredLogWorks.reduce((sum, logWork) => sum + logWork.hoursWorked, 0);
  const uniqueUsers = new Set(filteredLogWorks.map(logWork => logWork.user.id)).size;
  const uniqueTasks = new Set(filteredLogWorks.map(logWork => logWork.task.id)).size;
  const avgHoursPerDay = filteredLogWorks.length > 0 ? totalHours / filteredLogWorks.length : 0;

  // Get unique users for filter
  const uniqueUserEmails = [...new Set(logWorks.map(logWork => logWork.user.email))];

  useEffect(() => {
    loadLogWorks();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Log Work</h1>
          <p className="text-gray-600">Hiển thị thời gian làm việc theo task</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowCreateModal(true)} 
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Log Work
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Hours</h3>
              <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}h</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Log Entries</h3>
              <p className="text-2xl font-bold text-gray-900">{filteredLogWorks.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              U
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
              <p className="text-2xl font-bold text-gray-900">{uniqueUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              T
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tasks Worked</h3>
              <p className="text-2xl font-bold text-gray-900">{uniqueTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search tasks or users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-4 h-4 text-gray-400" />
          </div>

          <Input
            type="date"
            placeholder="From date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />

          <Input
            type="date"
            placeholder="To date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />

          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Users</SelectItem>
              {uniqueUserEmails.map((email) => (
                <SelectItem key={email} value={email}>
                  {email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setDateFrom('');
              setDateTo('');
              setUserFilter('');
            }}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Log Works Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading log works...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogWorks.map((logWork) => (
                  <tr key={logWork.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(logWork.date).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(logWork.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer line-clamp-2">
                        {logWork.task.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        Task #{logWork.task.id}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {(logWork.user.fullName || logWork.user.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {logWork.user.fullName || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {logWork.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {logWork.hoursWorked}h
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getPriorityBadgeVariant(logWork.task.priority)}>
                        {logWork.task.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                        {logWork.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedLogWork(logWork);
                          setShowViewModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredLogWorks.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No log work entries found
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {filteredLogWorks.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Total Hours Logged</p>
              <p className="text-lg font-bold text-blue-600">{totalHours.toFixed(1)} hours</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Hours/Entry</p>
              <p className="text-lg font-bold text-green-600">{avgHoursPerDay.toFixed(1)} hours</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Entries</p>
              <p className="text-lg font-bold text-purple-600">{filteredLogWorks.length} entries</p>
            </div>
          </div>
        </div>
      )}

      {/* View LogWork Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Log Work Details</DialogTitle>
            <DialogDescription>
              View detailed information about this work log entry
            </DialogDescription>
          </DialogHeader>
          
          {selectedLogWork && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">Date</h3>
                  <p className="text-gray-600">
                    {new Date(selectedLogWork.date).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Hours Worked</h3>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 font-medium">
                      {selectedLogWork.hoursWorked} hours
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Task</h3>
                <div className="mt-1 p-3 bg-gray-50 rounded">
                  <div className="flex items-center justify-between">
                    <p className="text-blue-600 font-medium">{selectedLogWork.task.title}</p>
                    <Badge variant={getPriorityBadgeVariant(selectedLogWork.task.priority)}>
                      {selectedLogWork.task.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Task #{selectedLogWork.task.id}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">User</h3>
                <div className="mt-1 flex items-center gap-3 p-3 bg-gray-50 rounded">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {(selectedLogWork.user.fullName || selectedLogWork.user.email).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {selectedLogWork.user.fullName || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedLogWork.user.email}
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedLogWork.description && (
                <div>
                  <h3 className="font-medium text-gray-900">Description</h3>
                  <p className="text-gray-600 mt-1 p-3 bg-gray-50 rounded">
                    {selectedLogWork.description}
                  </p>
                </div>
              )}
              
              <div className="text-xs text-gray-500 pt-4 border-t">
                Logged at: {new Date(selectedLogWork.createdAt).toLocaleString('vi-VN')}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create LogWork Modal - TODO: Implement form */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Work Hours</DialogTitle>
            <DialogDescription>
              Record time spent on a task
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 text-center text-gray-500">
            Log work form - To be implemented
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}