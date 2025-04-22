
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from '@/components/ui/select';
import PageLayout from '@/components/PageLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const SuperAdminSettings = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout
      title="settings"
      description="manage_platform_settings"
    >
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="general">{t('general')}</TabsTrigger>
          <TabsTrigger value="security">{t('security')}</TabsTrigger>
          <TabsTrigger value="api">{t('api_keys')}</TabsTrigger>
          <TabsTrigger value="plans">{t('subscription_plans')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('platform_settings')}</CardTitle>
              <CardDescription>
                {t('manage_basic_platform_settings')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform-name">{t('platform_name')}</Label>
                <Input id="platform-name" defaultValue="CDDiller" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="support-email">{t('support_email')}</Label>
                <Input id="support-email" defaultValue="support@cddiller.com" />
              </div>
              
              <div className="space-y-2">
                <Label>{t('maintenance_mode')}</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="maintenance-mode" />
                  <Label htmlFor="maintenance-mode">{t('enable_maintenance_mode')}</Label>
                </div>
              </div>
              
              <Button>{t('save_changes')}</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('localization')}</CardTitle>
              <CardDescription>
                {t('manage_language_and_currency_settings')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-language">{t('default_language')}</Label>
                {/* Fixed the Select component usage */}
                <Select defaultValue="en">
                  <SelectTrigger id="default-language">
                    <SelectValue placeholder={t('select_language')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uz_latin">{t('uzbek_latin')}</SelectItem>
                    <SelectItem value="uz_cyrl">{t('uzbek_cyrillic')}</SelectItem>
                    <SelectItem value="ru">{t('russian')}</SelectItem>
                    <SelectItem value="en">{t('english')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-currency">{t('default_currency')}</Label>
                {/* Fixed the Select component usage */}
                <Select defaultValue="UZS">
                  <SelectTrigger id="default-currency">
                    <SelectValue placeholder={t('select_currency')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UZS">{t('uzbek_som')}</SelectItem>
                    <SelectItem value="USD">{t('us_dollar')}</SelectItem>
                    <SelectItem value="EUR">{t('euro')}</SelectItem>
                    <SelectItem value="RUB">{t('russian_ruble')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button>{t('save_changes')}</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('security_settings')}</CardTitle>
              <CardDescription>
                {t('manage_platform_security_settings')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('two_factor_authentication')}</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="require-2fa" />
                  <Label htmlFor="require-2fa">{t('require_2fa_for_superadmins')}</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>{t('password_policy')}</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="strong-passwords" defaultChecked />
                  <Label htmlFor="strong-passwords">{t('require_strong_passwords')}</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="session-timeout">{t('session_timeout')}</Label>
                <Select defaultValue="60">
                  <SelectTrigger id="session-timeout">
                    <SelectValue placeholder={t('select_timeout')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 {t('minutes')}</SelectItem>
                    <SelectItem value="30">30 {t('minutes')}</SelectItem>
                    <SelectItem value="60">1 {t('hour')}</SelectItem>
                    <SelectItem value="120">2 {t('hours')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button>{t('save_changes')}</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('api_keys')}</CardTitle>
              <CardDescription>
                {t('manage_api_keys_for_external_integrations')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">{t('current_api_key')}</Label>
                <div className="flex space-x-2">
                  <Input
                    id="api-key"
                    defaultValue="sk_prod_sdf3r3423jwks_wer2jev45_2jksl"
                    type="password"
                    readOnly
                  />
                  <Button variant="outline">{t('show')}</Button>
                  <Button variant="outline">{t('copy')}</Button>
                </div>
              </div>
              
              <Button variant="default">{t('generate_new_key')}</Button>
              
              <div className="pt-4">
                <h3 className="mb-2 text-lg font-medium">{t('api_usage_limits')}</h3>
                <div className="space-y-2">
                  <Label htmlFor="daily-requests">{t('daily_request_limit')}</Label>
                  <Input id="daily-requests" defaultValue="1000" type="number" />
                </div>
              </div>
              
              <Button>{t('save_changes')}</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('subscription_plans')}</CardTitle>
              <CardDescription>
                {t('manage_subscription_plans_and_pricing')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{t('start_plan')}</h3>
                      <p className="text-sm text-muted-foreground">
                        10 {t('dealers')}, 50 {t('stores')}, 1000 {t('products')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">200,000 UZS/{t('month')}</p>
                      <Button variant="ghost" size="sm">{t('edit')}</Button>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{t('pro_plan')}</h3>
                      <p className="text-sm text-muted-foreground">
                        25 {t('dealers')}, 100 {t('stores')}, 5000 {t('products')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">500,000 UZS/{t('month')}</p>
                      <Button variant="ghost" size="sm">{t('edit')}</Button>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{t('enterprise_plan')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('unlimited_dealers_stores_products')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">2,000,000 UZS/{t('month')}</p>
                      <Button variant="ghost" size="sm">{t('edit')}</Button>
                    </div>
                  </div>
                </div>
                
                <Button>{t('add_new_plan')}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default SuperAdminSettings;
