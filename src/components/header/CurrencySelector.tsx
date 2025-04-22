
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
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency, Currency } from '@/contexts/CurrencyContext';

export const CurrencySelector = () => {
  const { t } = useLanguage();
  const { currency, setCurrency, exchangeRates } = useCurrency();
  
  const currencyOptions: { label: string; value: Currency; symbol: string }[] = [
    { label: "UZS - so'm", value: 'UZS', symbol: 'so\'m' },
    { label: "USD - dollar", value: 'USD', symbol: '$' },
    { label: "EUR - euro", value: 'EUR', symbol: '€' },
    { label: "RUB - ruble", value: 'RUB', symbol: '₽' },
  ];
  
  return (
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
  );
};
