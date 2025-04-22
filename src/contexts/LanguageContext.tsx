
import React, { createContext, useState, useContext, useEffect } from 'react';

export type Language = 'uz_latin' | 'uz_cyrillic' | 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Base translations
const translations = {
  uz_latin: {
    dashboard: 'Boshqaruv paneli',
    products: 'Mahsulotlar',
    stores: 'Do\'konlar',
    dealers: 'Dillerlar',
    warehouse: 'Ombor',
    reports: 'Hisobotlar',
    settings: 'Sozlamalar',
    users: 'Foydalanuvchilar',
    logout: 'Chiqish',
    login: 'Kirish',
    orders: 'Buyurtmalar',
    subscription: 'Obuna',
    invoices: 'Hisob-fakturalar',
    returns: 'Qaytarishlar',
    trash: 'Axlat',
    dark_mode: 'Qorong\'u rejim',
    light_mode: 'Yorug\' rejim',
    profile: 'Profil',
    notifications: 'Bildirishnomalar',
    help: 'Yordam',
    search: 'Qidirish...',
    total_products: 'Jami mahsulotlar',
    active_dealers: 'Faol dillerlar',
    active_stores: 'Faol do\'konlar',
    total_sales: 'Jami sotuvlar',
    add_product: 'Mahsulot qo\'shish',
    add_dealer: 'Diller qo\'shish',
    add_store: 'Do\'kon qo\'shish',
    view_all: 'Barchasini ko\'rish',
    edit: 'Tahrirlash',
    delete: 'O\'chirish',
    save: 'Saqlash',
    cancel: 'Bekor qilish',
    confirm: 'Tasdiqlash',
    name: 'Nomi',
    price: 'Narxi',
    quantity: 'Miqdori',
    category: 'Kategoriyasi',
    status: 'Holati',
    date: 'Sana',
    actions: 'Amallar',
    email: 'Email',
    password: 'Parol',
    phone: 'Telefon',
    address: 'Manzil',
    description: 'Tavsif',
    barcode: 'Shtrix kod',
    expiry_date: 'Yaroqlilik muddati',
    active: 'Faol',
    inactive: 'Faol emas',
    search_products: 'Mahsulotlarni qidirish...',
    search_dealers: 'Dillerlarni qidirish...',
    search_stores: 'Do\'konlarni qidirish...',
    // Add more translations as needed
  },
  uz_cyrillic: {
    dashboard: 'Бошқарув панели',
    products: 'Маҳсулотлар',
    stores: 'Дўконлар',
    dealers: 'Дилерлар',
    warehouse: 'Омбор',
    reports: 'Ҳисоботлар',
    settings: 'Созламалар',
    users: 'Фойдаланувчилар',
    logout: 'Чиқиш',
    login: 'Кириш',
    orders: 'Буюртмалар',
    subscription: 'Обуна',
    invoices: 'Ҳисоб-фактуралар',
    returns: 'Қайтаришлар',
    trash: 'Ахлат',
    dark_mode: 'Қоронғу режим',
    light_mode: 'Ёруғ режим',
    profile: 'Профил',
    notifications: 'Билдиришномалар',
    help: 'Ёрдам',
    search: 'Қидириш...',
    total_products: 'Жами маҳсулотлар',
    active_dealers: 'Фаол дилерлар',
    active_stores: 'Фаол дўконлар',
    total_sales: 'Жами сотувлар',
    add_product: 'Маҳсулот қўшиш',
    add_dealer: 'Дилер қўшиш',
    add_store: 'Дўкон қўшиш',
    view_all: 'Барчасини кўриш',
    edit: 'Таҳрирлаш',
    delete: 'Ўчириш',
    save: 'Сақлаш',
    cancel: 'Бекор қилиш',
    confirm: 'Тасдиқлаш',
    name: 'Номи',
    price: 'Нархи',
    quantity: 'Миқдори',
    category: 'Категорияси',
    status: 'Ҳолати',
    date: 'Сана',
    actions: 'Амаллар',
    email: 'Эмаил',
    password: 'Парол',
    phone: 'Телефон',
    address: 'Манзил',
    description: 'Тавсиф',
    barcode: 'Штрих код',
    expiry_date: 'Яроқлилик муддати',
    active: 'Фаол',
    inactive: 'Фаол эмас',
    search_products: 'Маҳсулотларни қидириш...',
    search_dealers: 'Дилерларни қидириш...',
    search_stores: 'Дўконларни қидириш...',
    // Add more translations as needed
  },
  ru: {
    dashboard: 'Панель управления',
    products: 'Продукты',
    stores: 'Магазины',
    dealers: 'Дилеры',
    warehouse: 'Склад',
    reports: 'Отчеты',
    settings: 'Настройки',
    users: 'Пользователи',
    logout: 'Выход',
    login: 'Вход',
    orders: 'Заказы',
    subscription: 'Подписка',
    invoices: 'Счета-фактуры',
    returns: 'Возвраты',
    trash: 'Мусор',
    dark_mode: 'Темный режим',
    light_mode: 'Светлый режим',
    profile: 'Профиль',
    notifications: 'Уведомления',
    help: 'Помощь',
    search: 'Поиск...',
    total_products: 'Всего продуктов',
    active_dealers: 'Активные дилеры',
    active_stores: 'Активные магазины',
    total_sales: 'Общие продажи',
    add_product: 'Добавить продукт',
    add_dealer: 'Добавить дилера',
    add_store: 'Добавить магазин',
    view_all: 'Посмотреть все',
    edit: 'Редактировать',
    delete: 'Удалить',
    save: 'Сохранить',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    name: 'Название',
    price: 'Цена',
    quantity: 'Количество',
    category: 'Категория',
    status: 'Статус',
    date: 'Дата',
    actions: 'Действия',
    email: 'Эл. почта',
    password: 'Пароль',
    phone: 'Телефон',
    address: 'Адрес',
    description: 'Описание',
    barcode: 'Штрих-код',
    expiry_date: 'Срок годности',
    active: 'Активный',
    inactive: 'Неактивный',
    search_products: 'Поиск продуктов...',
    search_dealers: 'Поиск дилеров...',
    search_stores: 'Поиск магазинов...',
    // Add more translations as needed
  },
  en: {
    dashboard: 'Dashboard',
    products: 'Products',
    stores: 'Stores',
    dealers: 'Dealers',
    warehouse: 'Warehouse',
    reports: 'Reports',
    settings: 'Settings',
    users: 'Users',
    logout: 'Logout',
    login: 'Login',
    orders: 'Orders',
    subscription: 'Subscription',
    invoices: 'Invoices',
    returns: 'Returns',
    trash: 'Trash',
    dark_mode: 'Dark Mode',
    light_mode: 'Light Mode',
    profile: 'Profile',
    notifications: 'Notifications',
    help: 'Help',
    search: 'Search...',
    total_products: 'Total Products',
    active_dealers: 'Active Dealers',
    active_stores: 'Active Stores',
    total_sales: 'Total Sales',
    add_product: 'Add Product',
    add_dealer: 'Add Dealer',
    add_store: 'Add Store',
    view_all: 'View All',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    name: 'Name',
    price: 'Price',
    quantity: 'Quantity',
    category: 'Category',
    status: 'Status',
    date: 'Date',
    actions: 'Actions',
    email: 'Email',
    password: 'Password',
    phone: 'Phone',
    address: 'Address',
    description: 'Description',
    barcode: 'Barcode',
    expiry_date: 'Expiry Date',
    active: 'Active',
    inactive: 'Inactive',
    search_products: 'Search Products...',
    search_dealers: 'Search Dealers...',
    search_stores: 'Search Stores...',
    // Add more translations as needed
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'uz_latin',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('uz_latin');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  };

  const t = (key: string) => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
