
import React from 'react';
import PageHeader from '@/components/PageHeader';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, description, children }) => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <PageHeader 
        title={t(title)}
        description={description ? t(description) : undefined}
      />
      <main>{children}</main>
    </div>
  );
};

export default PageLayout;
