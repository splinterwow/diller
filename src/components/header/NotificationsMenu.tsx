
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';

export const NotificationsMenu = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<{ id: number; message: string }[]>([]);

  // Mock notifications
  useEffect(() => {
    setNotifications([
      { id: 1, message: 'New order received #1234' },
      { id: 2, message: 'Product stock is low: Cola 1L' },
      { id: 3, message: 'Payment received from Store #45' },
    ]);
  }, []);
  
  return (
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
  );
};
