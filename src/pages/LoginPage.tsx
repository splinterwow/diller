
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useCurrency, Currency } from '@/contexts/CurrencyContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['superadmin', 'admin', 'warehouse', 'dealer', 'agent', 'store']),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, isAuthenticated, user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { theme, toggleTheme } = useTheme();

  const from = location.state?.from?.pathname || '/';

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'store',
    },
  });

  useEffect(() => {
    // If already authenticated, redirect to their dashboard
    if (isAuthenticated && user) {
      navigate(`/${user.role}`);
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const success = await login(values.email, values.password);
      if (success) {
        // We'll be redirected by the useEffect above
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (values: SignupFormValues) => {
    setLoading(true);
    try {
      const success = await signup(values.email, values.password, values.name, values.role as UserRole);
      if (success) {
        // After successful signup, switch to login tab
        setActiveTab('login');
        loginForm.setValue('email', values.email);
      }
    } finally {
      setLoading(false);
    }
  };

  const languageOptions: { label: string; value: Language; flag: string }[] = [
    { label: "O'zbekcha (lotin)", value: 'uz_latin', flag: '🇺🇿' },
    { label: "Ўзбекча (кирилл)", value: 'uz_cyrillic', flag: '🇺🇿' },
    { label: "Русский", value: 'ru', flag: '🇷🇺' },
    { label: "English", value: 'en', flag: '🇬🇧' },
  ];

  const currencyOptions: { label: string; value: Currency }[] = [
    { label: "UZS (so'm)", value: 'UZS' },
    { label: "USD ($)", value: 'USD' },
    { label: "EUR (€)", value: 'EUR' },
    { label: "RUB (₽)", value: 'RUB' },
  ];

  // Demo credentials
  const demoCredentials = [
    { role: 'superadmin', email: 'superadmin@cddiller.com', password: 'superadmin123' },
    { role: 'admin', email: 'admin@cddiller.com', password: 'admin123' },
    { role: 'warehouse', email: 'warehouse@cddiller.com', password: 'warehouse123' },
    { role: 'dealer', email: 'dealer@cddiller.com', password: 'dealer123' },
    { role: 'agent', email: 'agent@cddiller.com', password: 'agent123' },
    { role: 'store', email: 'store@cddiller.com', password: 'store123' },
  ];

  const fillDemoCredentials = (role: string) => {
    const creds = demoCredentials.find(cred => cred.role === role);
    if (creds) {
      loginForm.setValue('email', creds.email);
      loginForm.setValue('password', creds.password);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-slate-900 dark:to-slate-800">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  <span className="mr-2">{option.flag}</span>
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            {currencyOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <div className="flex flex-col space-y-2 text-center mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-primary">CDDiller</h1>
          <p className="text-muted-foreground">
            {t('login_description')}
          </p>
        </div>
        
        <Card className="animate-fade-in">
          <CardHeader>
            <Tabs defaultValue="login" value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t('login')}</TabsTrigger>
                <TabsTrigger value="signup">{t('signup')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {activeTab === 'login' ? (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('email')}</FormLabel>
                        <FormControl>
                          <Input placeholder="example@cddiller.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('password')}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t('logging_in') : t('login')}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('name')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('your_name')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('email')}</FormLabel>
                        <FormControl>
                          <Input placeholder="example@cddiller.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('password')}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('role')}</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('select_role')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="store">Store</SelectItem>
                            <SelectItem value="dealer">Dealer</SelectItem>
                            <SelectItem value="agent">Agent</SelectItem>
                            <SelectItem value="warehouse">Warehouse</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="superadmin">Superadmin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t('signing_up') : t('signup')}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          {activeTab === 'login' && (
            <CardFooter className="flex flex-col">
              <div className="text-sm text-muted-foreground mb-4">{t('demo_accounts')}</div>
              <Tabs defaultValue="superadmin" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="superadmin">Superadmin</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>
                <TabsContent value="superadmin" className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <div className="text-sm font-medium">{t('email')}:</div>
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                      superadmin@cddiller.com
                    </code>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-sm font-medium">{t('password')}:</div>
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                      superadmin123
                    </code>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => fillDemoCredentials('superadmin')}
                    className="w-full"
                  >
                    {t('autofill')}
                  </Button>
                </TabsContent>
                <TabsContent value="admin" className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <div className="text-sm font-medium">{t('email')}:</div>
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                      admin@cddiller.com
                    </code>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-sm font-medium">{t('password')}:</div>
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                      admin123
                    </code>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => fillDemoCredentials('admin')}
                    className="w-full"
                  >
                    {t('autofill')}
                  </Button>
                </TabsContent>
                <TabsContent value="other" className="space-y-4">
                  <Select onValueChange={(value) => fillDemoCredentials(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_role')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="dealer">Dealer</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="store">Store</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex flex-col space-y-1">
                    <div className="text-sm font-medium">{t('email')}:</div>
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                      {loginForm.getValues('email') || 'example@cddiller.com'}
                    </code>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="text-sm font-medium">{t('password')}:</div>
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                      {loginForm.getValues('password') ? '••••••••' : '••••••••'}
                    </code>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => fillDemoCredentials('warehouse')}
                    className="w-full"
                  >
                    {t('autofill')}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
