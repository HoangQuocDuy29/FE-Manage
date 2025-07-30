// File: src/components/pages/TicketPage.tsx (MỚI)
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
  Plus, 
  Search, 
  Eye, 
  Check, 
  X as XIcon,
  Users
} from 'lucide-react';
import { useToast } from '@/components/hooks/use-toast';

interface Ticket {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  task: {
    id: number;
    title: string;
  };
  requestedBy: {
    id: number;
    fullName?: string;
    email: string;
  };
  approvedBy?: {
    id: number;
    fullName?: string;
    email: string;
  };
  assignees: Array<{
    id: number;
    fullName?: string;
    email: string;
  }>;
  requestedAt: string;
  approvedAt?: string;
}

export default function TicketPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const { toast } = useToast();

  // Mock data - replace with API calls
  const mockTickets: Ticket[] = [
    {
      id: 1,
      title: 'Request permission for backend API development',
      description: 'Need approval to proceed with backend API implementation for user management.',
      status: 'pending',
      priority: 'high',
      task: {
        id: 1,
        title: 'Develop User Management API'
      },
      requestedBy: {
        id: 2,
        fullName: 'John Developer',
        email: 'john@company.com'
      },
      assignees: [
        {
          id: 2,
          fullName: 'John Developer',
          email: 'john@company.com'
        },
        {
          id: 3,
          fullName: 'Jane Smith',
          email: 'jane@company.com'
        }
      ],
      requestedAt: '2025-01-30T10:00:00Z'
    },
    {
      id: 2,
      title: 'Database migration approval',
      description: 'Request approval for database schema changes.',
      status: 'approved',
      priority: 'medium',
      task: {
        id: 2,
        title: 'Update Database Schema'
      },
      requestedBy: {
        id: 3,
        fullName: 'Jane Smith',
        email: 'jane@company.com'
      },
      approvedBy: {
        id: 1,
        fullName: 'Admin User',
        email: 'admin@company.com'
      },
      assignees: [
        {
          id: 3,
          fullName: 'Jane Smith',
          email: 'jane@company.com'
        }
      ],
      requestedAt: '2025-01-29T14:30:00Z',
      approvedAt: '2025-01-29T16:00:00Z'
    }
  ];

  const loadTickets = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetchTickets();
      // setTickets(response.data);
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setTickets(mockTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast({
        title: 'Error loading tickets',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTicket = async (ticketId: number) => {
    try {
      // TODO: Replace with actual API call
      // await approveTicket(ticketId);
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: 'approved' as const, approvedAt: new Date().toISOString() }
          : ticket
      ));
      
      toast({ title: 'Ticket approved successfully' });
    } catch (error) {
      toast({
        title: 'Error approving ticket',
        variant: 'destructive'
      });
    }
  };

  const handleRejectTicket = async (ticketId: number) => {
    try {
      // TODO: Replace with actual API call
      // await rejectTicket(ticketId);
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: 'rejected' as const, approvedAt: new Date().toISOString() }
          : ticket
      ));
      
      toast({ title: 'Ticket rejected' });
    } catch (error) {
      toast({
        title: 'Error rejecting ticket',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'in_review': return 'secondary';
      case 'pending': 
      default: return 'outline';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': 
      default: return 'outline';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = !searchTerm || 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.requestedBy.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ticket Management</h1>
          <p className="text-gray-600">Quản lý cấp phép cho các task</p>
        </div>
        
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Ticket
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-4 h-4 text-gray-400" />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setPriorityFilter('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading tickets...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignees</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900 line-clamp-2">
                          {ticket.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          #{ticket.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-blue-600">
                        {ticket.task.title}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {ticket.requestedBy.fullName || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {ticket.requestedBy.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {ticket.assignees.length}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusBadgeVariant(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowViewModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        {ticket.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApproveTicket(ticket.id)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRejectTicket(ticket.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <XIcon className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredTickets.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No tickets found
          </div>
        )}
      </div>

      {/* View Ticket Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
            <DialogDescription>
              View ticket information and assignees
            </DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Title</h3>
                <p className="text-gray-600">{selectedTicket.title}</p>
              </div>
              
              {selectedTicket.description && (
                <div>
                  <h3 className="font-medium text-gray-900">Description</h3>
                  <p className="text-gray-600">{selectedTicket.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">Task</h3>
                  <p className="text-blue-600">{selectedTicket.task.title}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Priority</h3>
                  <Badge variant={getPriorityBadgeVariant(selectedTicket.priority)}>
                    {selectedTicket.priority}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Assignees ({selectedTicket.assignees.length})</h3>
                <div className="mt-2 space-y-2">
                  {selectedTicket.assignees.map((assignee) => (
                    <div key={assignee.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                        {(assignee.fullName || assignee.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {assignee.fullName || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {assignee.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h3 className="font-medium text-gray-900">Requested By</h3>
                  <p className="text-sm text-gray-600">
                    {selectedTicket.requestedBy.fullName || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedTicket.requestedBy.email}
                  </p>
                </div>
                
                {selectedTicket.approvedBy && (
                  <div>
                    <h3 className="font-medium text-gray-900">Approved By</h3>
                    <p className="text-sm text-gray-600">
                      {selectedTicket.approvedBy.fullName || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedTicket.approvedBy.email}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500 pt-2 border-t">
                Requested: {new Date(selectedTicket.requestedAt).toLocaleString()}
                {selectedTicket.approvedAt && (
                  <span className="block">
                    {selectedTicket.status === 'approved' ? 'Approved' : 'Rejected'}: {new Date(selectedTicket.approvedAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Ticket Modal - TODO: Implement form */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>
              Request permission for task execution
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 text-center text-gray-500">
            Create ticket form - To be implemented
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}