
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage, Language } from '@/contexts/LanguageContext';

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();
  
  const languageOptions: { label: string; value: Language; flag: string }[] = [
    { label: "O'zbekcha (lotin)", value: 'uz_latin', flag: '🇺🇿' },
    { label: "Ўзбекча (кирилл)", value: 'uz_cyrillic', flag: '🇺🇿' },
    { label: "Русский", value: 'ru', flag: '🇷🇺' },
    { label: "English", value: 'en', flag: '🇬🇧' },
  ];
  
  return (
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
  );
};
