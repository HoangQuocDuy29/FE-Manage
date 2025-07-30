import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Settings,
  Package,
  CreditCard,
  Clock,
  Edit,
  Trash2,
  Plus,
  ShoppingBag,
  Heart,
  Star,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Import API functions - rename User to ApiUser to avoid conflict
import { 
  fetchUsers, 
  fetchUserStats, 
  createUser, 
  updateUser, 
  deleteUser,
  fetchUser,
  searchUsers,
  handleApiError,
  type CreateUserData,
  type UpdateUserData,
  type UserFilters,
  type UserStats,
  type User as ApiUser
} from '../services/api';

// Local interfaces for this component
interface UserPageData {
  id: string;
  name: string;
  email: string;
  username?: string;
  fullName?: string;
  phone: string;
  address: string;
  department?: string;
  position?: string;
  avatar?: string;
  joinedDate: string;
  lastLoginDate?: string;
  status: 'active' | 'inactive' | 'suspended';
  role: 'customer' | 'admin';
  roleName: string;
  roleId: number;
  totalOrders: number;
  totalSpent: number;
  formattedSpending: string;
  isActive: boolean;
  isAdmin: boolean;
  lastOrder?: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    users: ApiUser[];
    pagination?: PaginationData;
  };
  pagination?: PaginationData;
  message?: string;
}

export default function UserPage() {
  // State management
  const [users, setUsers] = useState<UserPageData[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserPageData | null>(null);
  const [editingUser, setEditingUser] = useState<UserPageData | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(10);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Transform API user to component user
  const transformApiUser = (apiUser: ApiUser): UserPageData => {
    return {
      id: apiUser.id,
      name: apiUser.fullName || apiUser.username || apiUser.email,
      email: apiUser.email,
      username: apiUser.username,
      fullName: apiUser.fullName,
      phone: apiUser.phone || '',
      address: `${apiUser.department || ''}, ${apiUser.position || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Không có thông tin',
      department: apiUser.department,
      position: apiUser.position,
      avatar: apiUser.avatar,
      joinedDate: apiUser.joinedDate,
      lastLoginDate: apiUser.lastLoginDate,
      status: apiUser.status,
      role: apiUser.role === 'admin' ? 'admin' : 'customer',
      roleName: apiUser.roleName,
      roleId: apiUser.roleId,
      totalOrders: apiUser.totalOrders,
      totalSpent: apiUser.totalSpent,
      formattedSpending: apiUser.formattedSpending || `${apiUser.totalSpent?.toLocaleString('vi-VN') || 0}₫`,
      isActive: apiUser.isActive,
      isAdmin: apiUser.isAdmin,
    };
  };

  // Load users with filters
  const loadUsers = async (page = 1, resetPage = false) => {
    try {
      setIsLoading(true);
      
      if (resetPage) {
        page = 1;
        setCurrentPage(1);
      }

      const filters: UserFilters = {
        page,
        limit,
        search: searchTerm.trim() || undefined,
        status: filterStatus !== 'all' ? (filterStatus as any) : undefined,
        role: filterRole !== 'all' ? (filterRole as any) : undefined,
      };

      const response = await fetchUsers(filters);
      
      if (response.success && response.data) {
        // Transform API users to component users
        const transformedUsers: UserPageData[] = response.data.users.map(transformApiUser);

        setUsers(transformedUsers);
        
        // Handle pagination - check both possible locations
        const paginationData = response.data.pagination || response.pagination;
        if (paginationData) {
          setCurrentPage(paginationData.page);
          setTotalPages(paginationData.totalPages);
          setTotalUsers(paginationData.total);
        }
      }
    } catch (error: any) {
      const apiError = handleApiError(error);
      toast({
        title: "Lỗi",
        description: apiError.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load user statistics
  const loadStats = async () => {
    try {
      setIsStatsLoading(true);
      const response = await fetchUserStats();
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsStatsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  // Reload when filters change (with debounce for search)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers(1, true);
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, filterRole]);

  // Handle add user
  const handleAddUser = async (userData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    status: string;
    role: string;
    password?: string;
  }) => {
    try {
      setIsCreating(true);

      // Parse address to department and position
      const addressParts = userData.address.split(',').map(part => part.trim());
      const department = addressParts[0] || '';
      const position = addressParts[1] || '';

      const createData: CreateUserData = {
        email: userData.email,
        password: userData.password || 'temp123456',
        fullName: userData.name,
        phone: userData.phone,
        department,
        position,
        roleName: userData.role === 'admin' ? 'admin' : 'user',
      };

      const response = await createUser(createData);
      
      if (response.success) {
        toast({
          title: "Thành công",
          description: "Đã thêm người dùng mới.",
        });
        setIsAddUserOpen(false);
        loadUsers();
        loadStats();
      }
    } catch (error: any) {
      const apiError = handleApiError(error);
      toast({
        title: "Lỗi",
        description: apiError.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Handle edit user
  const handleEditUser = async (userData: UserPageData) => {
    try {
      setIsUpdating(true);

      // Parse address to department and position
      const addressParts = userData.address.split(',').map(part => part.trim());
      const department = addressParts[0] || '';
      const position = addressParts[1] || '';

      const updateData: UpdateUserData = {
        fullName: userData.name,
        phone: userData.phone,
        department,
        position,
        status: userData.status,
        roleName: userData.role === 'admin' ? 'admin' : 'user',
      };

      const response = await updateUser(Number(userData.id), updateData);
      
      if (response.success) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật thông tin người dùng.",
        });
        setIsEditUserOpen(false);
        loadUsers();
        loadStats();
      }
    } catch (error: any) {
      const apiError = handleApiError(error);
      toast({
        title: "Lỗi",
        description: apiError.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await deleteUser(Number(userId), false);
      
      if (response.success) {
        toast({
          title: "Thành công",
          description: "Đã xóa người dùng.",
        });
        loadUsers();
        loadStats();
      }
    } catch (error: any) {
      const apiError = handleApiError(error);
      toast({
        title: "Lỗi",
        description: apiError.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle view user details
  const handleViewUserDetails = async (user: UserPageData) => {
    try {
      const response = await fetchUser(Number(user.id));
      if (response.success) {
        const transformedUser = transformApiUser(response.data);
        setSelectedUser(transformedUser);
      } else {
        setSelectedUser(user);
      }
    } catch (error) {
      setSelectedUser(user);
    }
    setIsUserDetailOpen(true);
  };

  // Get status badge
  const getStatusBadge = (status: UserPageData['status']) => {
    const variants = {
      active: { label: 'Hoạt động', className: 'bg-green-100 text-green-800' },
      inactive: { label: 'Không hoạt động', className: 'bg-gray-100 text-gray-800' },
      suspended: { label: 'Tạm ngưng', className: 'bg-red-100 text-red-800' },
    };
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterRole('all');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
          <p className="text-muted-foreground">Quản lý thông tin khách hàng và nhân viên</p>
        </div>
        <Button 
          onClick={() => setIsAddUserOpen(true)}
          disabled={isLoading || isCreating}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm người dùng
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isStatsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats?.total || totalUsers
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats?.newUsers || 0} người trong 30 ngày
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng hoạt động</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isStatsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats?.active || users.filter(u => u.status === 'active').length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.activePercentage || 0}% tổng số người dùng
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng mới</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isStatsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats?.newUsers || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Trong 30 ngày qua</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tạm ngưng</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isStatsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats?.suspended || users.filter(u => u.status === 'suspended').length
              )}
            </div>
            <p className="text-xs text-muted-foreground">Cần xem xét</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Lọc và tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Tìm kiếm</Label>
              <Input
                placeholder="Tìm theo tên, email, SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                  <SelectItem value="suspended">Tạm ngưng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vai trò</Label>
              <Select value={filterRole} onValueChange={setFilterRole} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                  <SelectItem value="user">Người dùng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={isLoading}
              >
                Xóa lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>
            Hiển thị {users.length} người dùng - Trang {currentPage}/{totalPages} (Tổng: {totalUsers})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Đang tải...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Không tìm thấy người dùng nào</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead>Ngày tham gia</TableHead>
                    <TableHead>Đơn hàng</TableHead>
                    <TableHead>Chi tiêu</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
                            {user.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                            {user.phone || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.joinedDate}</TableCell>
                      <TableCell>{user.totalOrders}</TableCell>
                      <TableCell>{user.formattedSpending}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewUserDetails(user)}
                            disabled={isDeleting}
                          >
                            <User className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingUser(user);
                              setIsEditUserOpen(true);
                            }}
                            disabled={isDeleting}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadUsers(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                  >
                    Trước
                  </Button>
                  <span className="px-4 py-2 text-sm">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadUsers(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                  >
                    Sau
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm người dùng mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin để tạo người dùng mới
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleAddUser({
              name: formData.get('name') as string,
              email: formData.get('email') as string,
              phone: formData.get('phone') as string,
              address: formData.get('address') as string,
              status: formData.get('status') as string,
              role: formData.get('role') as string,
              password: formData.get('password') as string,
            });
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Họ tên
                </Label>
                <Input
                  id="name"
                  name="name"
                  className="col-span-3"
                  required
                  disabled={isCreating}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="col-span-3"
                  required
                  disabled={isCreating}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Mật khẩu
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="col-span-3"
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  disabled={isCreating}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  className="col-span-3"
                  required
                  disabled={isCreating}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Phòng ban, Vị trí
                </Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="IT, Developer"
                  className="col-span-3"
                  required
                  disabled={isCreating}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Vai trò
                </Label>
                <Select name="role" defaultValue="user" disabled={isCreating}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Người dùng</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Trạng thái
                </Label>
                <Select name="status" defaultValue="active" disabled={isCreating}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="suspended">Tạm ngưng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddUserOpen(false)}
                disabled={isCreating}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  'Thêm người dùng'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin người dùng
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleEditUser({
                ...editingUser,
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                address: formData.get('address') as string,
                status: formData.get('status') as UserPageData['status'],
                role: formData.get('role') as UserPageData['role'],
              });
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Họ tên
                  </Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingUser.name}
                    className="col-span-3"
                    required
                    disabled={isUpdating}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    defaultValue={editingUser.email}
                    className="col-span-3"
                    required
                    disabled={isUpdating}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-phone" className="text-right">
                    Số điện thoại
                  </Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    defaultValue={editingUser.phone}
                    className="col-span-3"
                    required
                    disabled={isUpdating}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-address" className="text-right">
                    Phòng ban, Vị trí
                  </Label>
                  <Input
                    id="edit-address"
                    name="address"
                    defaultValue={editingUser.address}
                    className="col-span-3"
                    required
                    disabled={isUpdating}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-role" className="text-right">
                    Vai trò
                  </Label>
                  <Select name="role" defaultValue={editingUser.role === 'admin' ? 'admin' : 'user'} disabled={isUpdating}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Người dùng</SelectItem>
                      <SelectItem value="admin">Quản trị viên</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Trạng thái
                  </Label>
                  <Select name="status" defaultValue={editingUser.status} disabled={isUpdating}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                      <SelectItem value="suspended">Tạm ngưng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditUserOpen(false)}
                  disabled={isUpdating}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    'Lưu thay đổi'
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* User Detail Dialog */}
      <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
                <TabsTrigger value="addresses">Địa chỉ</TabsTrigger>
                <TabsTrigger value="payment">Thanh toán</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedUser.name}</h3>
                    <p className="text-muted-foreground">
                      {selectedUser.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Email:</span>
                      <span className="text-sm">{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Điện thoại:</span>
                      <span className="text-sm">{selectedUser.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Phòng ban:</span>
                      <span className="text-sm">{selectedUser.department || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Vị trí:</span>
                      <span className="text-sm">{selectedUser.position || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Ngày tham gia:</span>
                      <span className="text-sm">{selectedUser.joinedDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Lần cuối đăng nhập:</span>
                      <span className="text-sm">{selectedUser.lastLoginDate || 'Chưa có'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Tổng đơn hàng:</span>
                      <span className="text-sm">{selectedUser.totalOrders}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Tổng chi tiêu:</span>
                      <span className="text-sm">{selectedUser.formattedSpending}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Trạng thái:</span>
                  {getStatusBadge(selectedUser.status)}
                </div>
              </TabsContent>
              <TabsContent value="orders">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Danh sách đơn hàng của người dùng sẽ hiển thị ở đây
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="addresses">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Danh sách địa chỉ của người dùng sẽ hiển thị ở đây
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="payment">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Phương thức thanh toán của người dùng sẽ hiển thị ở đây
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
