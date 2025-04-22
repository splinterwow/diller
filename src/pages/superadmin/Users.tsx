import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  UserPlus, 
  ShieldCheck, 
  Store, 
  Package,
  Database,
  UserCog,
  Users as UsersIcon,
  Search,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Phone,
  MapPin,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { UserRole, useAuth } from '@/contexts/AuthContext';
import PageHeader from '@/components/PageHeader';
import DataTable, { ColumnDef } from '@/components/DataTable';
import StatsCard from '@/components/StatsCard';

import { fetchUsers, fetchUsersByRole, updateUserStatus, createUser, updateUser } from '@/services/userService';
import { supabase } from '@/integrations/supabase/client';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  subscription?: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  updated_at: string;
};

const addUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'warehouse', 'dealer', 'agent', 'store']),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  phone: z.string().optional(),
  address: z.string().optional(),
  company: z.string().optional(),
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

const UsersPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const { user } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const addUserForm = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'store',
      password: '',
      phone: '',
      address: '',
      company: '',
    }
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error loading users',
        description: 'Failed to load users. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsersByRole = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const data = await fetchUsersByRole(role);
      setUsers(data);
    } catch (error) {
      console.error(`Error loading ${role} users:`, error);
      toast({
        title: `Error loading ${role} users`,
        description: `Failed to load ${role} users. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'all') {
      loadUsers();
    } else {
      loadUsersByRole(value as UserRole);
    }
  };

  // Stats counts
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;

  // Role counts for stats
  const adminCount = users.filter(u => u.role === 'admin').length;
  const warehouseCount = users.filter(u => u.role === 'warehouse').length;
  const dealerCount = users.filter(u => u.role === 'dealer').length;
  const agentCount = users.filter(u => u.role === 'agent').length;
  const storeCount = users.filter(u => u.role === 'store').length;

  // Get role icon
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'superadmin':
        return <ShieldCheck className="h-4 w-4 mr-1" />;
      case 'admin':
        return <UserCog className="h-4 w-4 mr-1" />;
      case 'warehouse':
        return <Database className="h-4 w-4 mr-1" />;
      case 'dealer':
        return <UsersIcon className="h-4 w-4 mr-1" />;
      case 'agent':
        return <UserCog className="h-4 w-4 mr-1" />;
      case 'store':
        return <Store className="h-4 w-4 mr-1" />;
      default:
        return <UserCog className="h-4 w-4 mr-1" />;
    }
  };

  const handleUserStatusChange = async (userId: string, status: 'active' | 'inactive' | 'pending') => {
    try {
      const success = await updateUserStatus(userId, status);
      if (success) {
        toast({
          title: 'User status updated',
          description: `User status has been updated to ${status}.`,
        });
        
        // Refresh the users list
        loadUsers();
        
        // If the view dialog is open, close it
        if (isViewDialogOpen) {
          setIsViewDialogOpen(false);
        }
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAddUser = async (values: AddUserFormValues) => {
    try {
      // First, create the auth user
      const authResponse = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            role: values.role,
          },
        }
      });
      
      if (authResponse.error) {
        console.error('Error creating user:', authResponse.error);
        toast({
          title: 'Error creating user',
          description: authResponse.error.message,
          variant: 'destructive',
        });
        return;
      }
      
      if (!authResponse.data.user) {
        toast({
          title: 'Error creating user',
          description: 'Failed to create user. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      // Now create the profile (in case the trigger doesn't work)
      const profileResponse = await supabase
        .from('profiles')
        .insert([{
          id: authResponse.data.user.id,
          name: values.name,
          email: values.email,
          role: values.role,
          phone: values.phone,
          address: values.address,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
        
      if (profileResponse.error) {
        console.error('Error creating profile:', profileResponse.error);
        toast({
          title: 'Warning',
          description: 'User created but there might be an issue with the profile.',
          variant: 'destructive',
        });
      }
      
      toast({
        title: 'User created',
        description: 'New user has been created successfully.',
      });
      
      // Close the dialog and refresh users
      setIsAddDialogOpen(false);
      addUserForm.reset();
      loadUsers();
      
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while creating the user.',
        variant: 'destructive',
      });
    }
  };

  // Columns for the users table
  const columns: ColumnDef[] = [
    {
      title: t('name'),
      field: 'name',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.avatar_url} alt={value} />
            <AvatarFallback>{value ? value.substring(0, 2).toUpperCase() : 'UN'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{value || 'Unnamed'}</div>
            <div className="text-xs text-muted-foreground">{row.email}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      title: t('role'),
      field: 'role',
      render: (value) => (
        <div className="flex items-center">
          {getRoleIcon(value as UserRole)}
          <span>{t(value)}</span>
        </div>
      ),
      sortable: true,
    },
    {
      title: t('company'),
      field: 'company',
      render: (value) => value || 'N/A',
      sortable: true,
    },
    {
      title: t('created_at'),
      field: 'created_at',
      render: (value) => new Date(value).toLocaleDateString(),
      sortable: true,
    },
    {
      title: t('status'),
      field: 'status',
      render: (value) => {
        let badgeVariant:
          | 'default'
          | 'secondary'
          | 'destructive'
          | 'outline'
          | null = null;
        
        if (value === 'active') {
          badgeVariant = 'default';
        } else if (value === 'inactive') {
          badgeVariant = 'destructive';
        } else if (value === 'pending') {
          badgeVariant = 'secondary';
        }
        
        return (
          <Badge variant={badgeVariant}>{t(value) || value}</Badge>
        );
      },
      sortable: true,
    },
    {
      title: t('actions'),
      field: 'actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(row);
              setIsViewDialogOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {row.status === 'pending' && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                handleUserStatusChange(row.id, 'active');
              }}
            >
              <UserCheck className="h-4 w-4" />
            </Button>
          )}
          {row.status === 'active' && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                handleUserStatusChange(row.id, 'inactive');
              }}
            >
              <UserX className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleAddUserClick = () => {
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('users')} 
        description={t('users_description')}
      >
        <Button onClick={handleAddUserClick}>
          <UserPlus className="mr-2 h-4 w-4" />
          {t('add_user')}
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title={t('total_users')}
              value={totalUsers}
              icon={<UsersIcon size={24} />}
              trend={{ value: 0, isPositive: true }}
            />
            <StatsCard
              title={t('active_users')}
              value={activeUsers}
              icon={<UserCheck size={24} />}
              trend={{ value: 0, isPositive: true }}
            />
            <StatsCard
              title={t('pending_users')}
              value={pendingUsers}
              icon={<UserPlus size={24} />}
              trend={{ value: 0, isPositive: true }}
            />
            <StatsCard
              title={t('inactive_users')}
              value={inactiveUsers}
              icon={<UserX size={24} />}
              trend={{ value: 0, isPositive: false }}
            />
          </div>

          {/* Role Stats Cards */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <UserCog className="h-8 w-8 mb-2 text-blue-500" />
                <h3 className="font-semibold">{t('admins')}</h3>
                <p className="text-2xl font-bold">{adminCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Database className="h-8 w-8 mb-2 text-green-500" />
                <h3 className="font-semibold">{t('warehouse')}</h3>
                <p className="text-2xl font-bold">{warehouseCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <UsersIcon className="h-8 w-8 mb-2 text-purple-500" />
                <h3 className="font-semibold">{t('dealers')}</h3>
                <p className="text-2xl font-bold">{dealerCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <UserCog className="h-8 w-8 mb-2 text-orange-500" />
                <h3 className="font-semibold">{t('agents')}</h3>
                <p className="text-2xl font-bold">{agentCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Store className="h-8 w-8 mb-2 text-red-500" />
                <h3 className="font-semibold">{t('stores')}</h3>
                <p className="text-2xl font-bold">{storeCount}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">{t('all_users')}</TabsTrigger>
              <TabsTrigger value="admin">{t('admins')}</TabsTrigger>
              <TabsTrigger value="warehouse">{t('warehouse')}</TabsTrigger>
              <TabsTrigger value="dealer">{t('dealers')}</TabsTrigger>
              <TabsTrigger value="agent">{t('agents')}</TabsTrigger>
              <TabsTrigger value="store">{t('stores')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <DataTable
                columns={columns}
                data={users}
                onAdd={handleAddUserClick}
                onRowClick={handleViewUser}
                title={t('all_users')}
                searchable
              />
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4">
              <DataTable
                columns={columns}
                data={users.filter(u => u.role === 'admin')}
                onAdd={handleAddUserClick}
                onRowClick={handleViewUser}
                title={t('admins')}
                searchable
              />
            </TabsContent>
            
            <TabsContent value="warehouse" className="space-y-4">
              <DataTable
                columns={columns}
                data={users.filter(u => u.role === 'warehouse')}
                onAdd={handleAddUserClick}
                onRowClick={handleViewUser}
                title={t('warehouse_managers')}
                searchable
              />
            </TabsContent>
            
            <TabsContent value="dealer" className="space-y-4">
              <DataTable
                columns={columns}
                data={users.filter(u => u.role === 'dealer')}
                onAdd={handleAddUserClick}
                onRowClick={handleViewUser}
                title={t('dealers')}
                searchable
              />
            </TabsContent>
            
            <TabsContent value="agent" className="space-y-4">
              <DataTable
                columns={columns}
                data={users.filter(u => u.role === 'agent')}
                onAdd={handleAddUserClick}
                onRowClick={handleViewUser}
                title={t('agents')}
                searchable
              />
            </TabsContent>
            
            <TabsContent value="store" className="space-y-4">
              <DataTable
                columns={columns}
                data={users.filter(u => u.role === 'store')}
                onAdd={handleAddUserClick}
                onRowClick={handleViewUser}
                title={t('stores')}
                searchable
              />
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('user_details')}</DialogTitle>
            <DialogDescription>
              {t('user_details_description')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.name} />
                  <AvatarFallback className="text-2xl">
                    {selectedUser.name ? selectedUser.name.substring(0, 2).toUpperCase() : 'UN'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-bold">{selectedUser.name || 'Unnamed'}</h3>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(selectedUser.role)}
                    <span className="font-medium">{t(selectedUser.role)}</span>
                  </div>
                  <Badge variant={
                    selectedUser.status === 'active' 
                      ? 'default' 
                      : selectedUser.status === 'inactive' 
                      ? 'destructive' 
                      : 'secondary'
                  }>
                    {t(selectedUser.status) || selectedUser.status}
                  </Badge>
                  
                  {selectedUser.company && (
                    <p className="text-sm">
                      {t('company')}: {selectedUser.company}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedUser.email}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedUser.phone || t('not_provided')}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedUser.address || t('not_provided')}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{t('joined')}: {new Date(selectedUser.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex space-x-2 mt-4">
            {selectedUser && selectedUser.status === 'pending' && (
              <Button 
                onClick={() => {
                  handleUserStatusChange(selectedUser.id, 'active');
                }}
                className="flex items-center"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                {t('approve_user')}
              </Button>
            )}
            
            {selectedUser && selectedUser.status === 'active' && (
              <Button 
                variant="destructive"
                onClick={() => {
                  handleUserStatusChange(selectedUser.id, 'inactive');
                }}
                className="flex items-center"
              >
                <UserX className="h-4 w-4 mr-2" />
                {t('deactivate_user')}
              </Button>
            )}
            
            {selectedUser && selectedUser.status === 'inactive' && (
              <Button 
                onClick={() => {
                  handleUserStatusChange(selectedUser.id, 'active');
                }}
                className="flex items-center"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                {t('activate_user')}
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => {
                setIsViewDialogOpen(false);
              }}
            >
              {t('close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('add_user')}</DialogTitle>
            <DialogDescription>
              {t('add_user_description')}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...addUserForm}>
            <form onSubmit={addUserForm.handleSubmit(handleAddUser)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={addUserForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('enter_name')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addUserForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('enter_email')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addUserForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('role')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('select_role')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">{t('admin')}</SelectItem>
                          <SelectItem value="warehouse">{t('warehouse')}</SelectItem>
                          <SelectItem value="dealer">{t('dealer')}</SelectItem>
                          <SelectItem value="agent">{t('agent')}</SelectItem>
                          <SelectItem value="store">{t('store')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addUserForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('phone')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('enter_phone')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addUserForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('address')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('enter_address')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addUserForm.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('company')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('enter_company')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={addUserForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={t('enter_password')} {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {t('password_requirements')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit">{t('add_user')}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
