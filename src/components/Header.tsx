
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, Sun, Moon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useCurrency, Currency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency, exchangeRates } = useCurrency();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<{ id: number; message: string }[]>([]);

  // Mock notifications
  // Mock notifications
  useEffect(() => {
    setNotifications([
      { id: 1, message: 'New order received #1234' },
      { id: 2, message: 'Product stock is low: Cola 1L' },
      { id: 3, message: 'Payment received from Store #45' },
    ]);
  }, []);

  const languageOptions: { label: string; value: Language; flag: string }[] = [
    { label: "O'zbekcha (lotin)", value: 'uz_latin', flag: '🇺🇿' },
    { label: "Ўзбекча (кирилл)", value: 'uz_cyrillic', flag: '🇺🇿' },
    { label: "Русский", value: 'ru', flag: '🇷🇺' },
    { label: "English", value: 'en', flag: '🇬🇧' },
  ];

  const currencyOptions: { label: string; value: Currency; symbol: string }[] = [
    { label: "UZS - so'm", value: 'UZS', symbol: 'so\'m' },
    { label: "USD - dollar", value: 'USD', symbol: '$' },
    { label: "EUR - euro", value: 'EUR', symbol: '€' },
    { label: "RUB - ruble", value: 'RUB', symbol: '₽' },
  ];

  const getLanguageLabel = () => {
    const lang = languageOptions.find(l => l.value === language);
    return lang ? `${lang.flag} ${lang.label}` : '';
  };

  const getCurrencyLabel = () => {
    const curr = currencyOptions.find(c => c.value === currency);
    return curr ? `${curr.symbol} ${curr.value}` : '';
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-6 transition-all">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Search */}
      <div className="flex-1 lg:flex-initial lg:w-64 mr-auto">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('search')}
            className="w-full rounded-lg bg-background pl-8 focus-visible:ring-primary md:w-64 lg:w-full"
          />
        </div>
      </div>
      
      {/* Language selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 animate-fade-in">
            {languageOptions.find(l => l.value === language)?.flag} <span className="ml-2 hidden md:inline">{language}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {languageOptions.map((option) => (
            <DropdownMenuItem 
              key={option.value}
              onClick={() => setLanguage(option.value)}
              className="cursor-pointer"
            >
              <span className="mr-2">{option.flag}</span>
              {option.label}
              {language === option.value && (
                <span className="ml-auto">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Currency selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 animate-fade-in">
            {currency} <span className="ml-2 hidden md:inline-block text-xs">
              {currency !== 'UZS' && `1 ${currency} = ${exchangeRates[currency]} UZS`}
              {currency === 'UZS' && 'UZS'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t('currency')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {currencyOptions.map((option) => (
            <DropdownMenuItem 
              key={option.value}
              onClick={() => setCurrency(option.value)}
              className="cursor-pointer"
            >
              {option.label}
              {currency === option.value && (
                <span className="ml-auto">✓</span>
              )}
              {option.value !== 'UZS' && (
                <span className="ml-2 text-muted-foreground text-xs">
                  1 {option.value} = {exchangeRates[option.value]} UZS
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="h-8 w-8 animate-fade-in"
      >
        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>
      
      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 relative animate-fade-in">
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                {notifications.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>{t('notifications')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="cursor-pointer py-3">
                <div className="flex flex-col gap-1">
                  <span>{notification.message}</span>
                  <span className="text-xs text-muted-foreground">2 minutes ago</span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-2 py-4 text-center text-muted-foreground">
              {t('no_notifications')}
            </div>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer justify-center text-center">
            {t('view_all')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full animate-fade-in">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar_url} alt={user?.name} />
              <AvatarFallback>{user?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to={`/${user?.role}/settings`}>{t('profile')}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to={`/${user?.role}/settings`}>{t('settings')}</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
            {t('logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;
