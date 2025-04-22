
import React, { createContext, useState, useContext, useEffect } from 'react';

export type Currency = 'UZS' | 'USD' | 'EUR' | 'RUB';

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number, showSymbol?: boolean) => string;
  convertToUZS: (amount: number, fromCurrency: Currency) => number;
  convertFromUZS: (amount: number, toCurrency: Currency) => number;
  exchangeRates: ExchangeRates;
}

// Default exchange rates (UZS as base currency)
const defaultRates: ExchangeRates = {
  UZS: 1,
  USD: 12700,
  EUR: 13500,
  RUB: 140,
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'UZS',
  setCurrency: () => {},
  formatCurrency: () => '',
  convertToUZS: () => 0,
  convertFromUZS: () => 0,
  exchangeRates: defaultRates,
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>('UZS');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(defaultRates);

  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency') as Currency | null;
    if (savedCurrency) {
      setCurrencyState(savedCurrency);
    }
    
    // In a real app, you would fetch current exchange rates from an API
    // For now, we'll use the default rates
  }, []);

  const setCurrency = (curr: Currency) => {
    localStorage.setItem('currency', curr);
    setCurrencyState(curr);
  };

  const formatCurrency = (amount: number, showSymbol: boolean = true): string => {
    const formatter = new Intl.NumberFormat('uz-UZ', {
      style: showSymbol ? 'currency' : 'decimal',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    
    // For non-standard currency codes, we'll handle them manually
    const formatted = formatter.format(amount);
    if (currency === 'UZS' && showSymbol) {
      return `${formatted.replace('UZS', '')} so'm`;
    }
    return formatted;
  };

  const convertToUZS = (amount: number, fromCurrency: Currency): number => {
    return amount * exchangeRates[fromCurrency];
  };

  const convertFromUZS = (amount: number, toCurrency: Currency): number => {
    return amount / exchangeRates[toCurrency];
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency, 
      formatCurrency, 
      convertToUZS, 
      convertFromUZS,
      exchangeRates 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};
