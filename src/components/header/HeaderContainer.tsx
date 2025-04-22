
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { LanguageSelector } from './LanguageSelector';
import { CurrencySelector } from './CurrencySelector';
import { ThemeToggle } from './ThemeToggle';
import { NotificationsMenu } from './NotificationsMenu';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const HeaderContainer = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-6 transition-all">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Search */}
      <SearchBar />
      
      {/* Language selector */}
      <LanguageSelector />
      
      {/* Currency selector */}
      <CurrencySelector />
      
      {/* Theme toggle */}
      <ThemeToggle />
      
      {/* Notifications */}
      <NotificationsMenu />
      
      {/* User menu */}
      <UserMenu />
    </header>
  );
};
