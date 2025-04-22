
import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  ShieldCheck, 
  Languages, 
  DollarSign, 
  HelpCircle, 
  UploadCloud 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SettingsPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: 'Admin Adminov',
    email: 'admin@example.com',
    phone: '+998 90 123 45 67',
    company: 'Elektron Savdo LLC',
    position: 'Bosh direktor'
  });
  
  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <PageLayout 
      title="Sozlamalar"
      description="Tizim sozlamalarini o'zgartirish"
    >
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 lg:grid-cols-8">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="app">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Tizim
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Bildirishnomalar
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Xavfsizlik
          </TabsTrigger>
          <TabsTrigger value="language">
            <Languages className="mr-2 h-4 w-4" />
            Til
          </TabsTrigger>
          <TabsTrigger value="currency">
            <DollarSign className="mr-2 h-4 w-4" />
            Valyuta
          </TabsTrigger>
          <TabsTrigger value="backup">
            <UploadCloud className="mr-2 h-4 w-4" />
            Zaxira
          </TabsTrigger>
          <TabsTrigger value="help">
            <HelpCircle className="mr-2 h-4 w-4" />
            Yordam
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profil ma'lumotlari</CardTitle>
              <CardDescription>
                Profil ma'lumotlaringizni yangilang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Ism Familiya</Label>
                <Input 
                  id="name" 
                  value={profileData.name} 
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profileData.email} 
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Telefon</Label>
                <Input 
                  id="phone" 
                  value={profileData.phone} 
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="company">Kompaniya</Label>
                <Input 
                  id="company" 
                  value={profileData.company} 
                  onChange={(e) => handleProfileChange('company', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="position">Lavozim</Label>
                <Input 
                  id="position" 
                  value={profileData.position} 
                  onChange={(e) => handleProfileChange('position', e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Saqlash</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="app">
          <Card>
            <CardHeader>
              <CardTitle>Tizim sozlamalari</CardTitle>
              <CardDescription>
                Asosiy tizim parametrlarini o'zgartiring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Qorong'i rejim</Label>
                  <p className="text-sm text-muted-foreground">
                    Qorong'i rejimni yoqing yoki o'chiring
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Avtomatik yangilanish</Label>
                  <p className="text-sm text-muted-foreground">
                    Ma'lumotlarni avtomatik yangilashni yoqish
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ma'lumot keshlash</Label>
                  <p className="text-sm text-muted-foreground">
                    Tizim unumdorligini oshirish uchun ma'lumotlarni keshlash
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Saqlash</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Bildirishnoma sozlamalari</CardTitle>
              <CardDescription>
                Bildirishnomalar parametrlarini sozlang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email bildirishnomalari</Label>
                  <p className="text-sm text-muted-foreground">
                    Muhim yangilanishlar haqida email orqali xabar olish
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tizim bildirishnomalari</Label>
                  <p className="text-sm text-muted-foreground">
                    Brauzerda tizim bildirishnomalarini ko'rsatish
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS bildirishnomalari</Label>
                  <p className="text-sm text-muted-foreground">
                    Favqulodda holatlar haqida SMS xabarlar olish
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Saqlash</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Xavfsizlik sozlamalari</CardTitle>
              <CardDescription>
                Hisobingizni himoya qilish uchun xavfsizlik parametrlarini sozlang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Parolni o'zgartirish</h3>
                <div className="space-y-2">
                  <Label htmlFor="current-password">Joriy parol</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Yangi parol</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Yangi parolni tasdiqlang</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button className="mt-2">Parolni yangilash</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ikki faktorli autentifikatsiya</Label>
                  <p className="text-sm text-muted-foreground">
                    Qo'shimcha xavfsizlik uchun ikki faktorli autentifikatsiyani yoqish
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>Til sozlamalari</CardTitle>
              <CardDescription>
                Interfeys tilini tanlang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Tizim tili</Label>
                <Select defaultValue="uz">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Tilni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uz">O'zbek</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Saqlash</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="currency">
          <Card>
            <CardHeader>
              <CardTitle>Valyuta sozlamalari</CardTitle>
              <CardDescription>
                Standart valyuta va formatlash parametrlarini o'zgartiring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Asosiy valyuta</Label>
                <Select defaultValue="uzs">
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Valyutani tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uzs">So'm (UZS)</SelectItem>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">Valyuta formati</Label>
                <Select defaultValue="comma">
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Formatni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comma">1,000,000.00</SelectItem>
                    <SelectItem value="space">1 000 000.00</SelectItem>
                    <SelectItem value="dot">1.000.000,00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Saqlash</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Ma'lumotlar zaxirasi</CardTitle>
              <CardDescription>
                Ma'lumotlarni zaxiralash va tiklash
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Ma'lumotlarni zaxiralash</h3>
                <p className="text-sm text-muted-foreground">
                  Barcha tizim ma'lumotlarining zaxira nusxasini yarating
                </p>
                <Button variant="outline">
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Zaxira yaratish
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Avtomatik zaxiralash</h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Har hafta avtomatik zaxiralashni yoqish
                  </p>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="help">
          <Card>
            <CardHeader>
              <CardTitle>Yordam va qo'llab-quvvatlash</CardTitle>
              <CardDescription>
                Yordam olish uchun qo'llab-quvvatlash resurslariga murojaat qiling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <h3 className="text-lg font-medium mb-2">Foydalanuvchi qo'llanmasi</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Tizimdan foydalanish bo'yicha batafsil qo'llanma
                </p>
                <Button variant="secondary">Qo'llanmani ochish</Button>
              </div>
              <div className="rounded-md bg-muted p-4">
                <h3 className="text-lg font-medium mb-2">Texnik yordam</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Texnik muammolar uchun qo'llab-quvvatlash xizmatiga murojaat qiling
                </p>
                <Button variant="secondary">Murojaat yuborish</Button>
              </div>
              <div className="rounded-md bg-muted p-4">
                <h3 className="text-lg font-medium mb-2">Tez-tez so'raladigan savollar</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Ko'p so'raladigan savollarga javoblar
                </p>
                <Button variant="secondary">FAQ ko'rish</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default SettingsPage;
