
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

export const SearchBar = () => {
  const { t } = useLanguage();
  
  return (
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
  );
};
