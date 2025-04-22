
import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Calendar, Download, LineChart, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const ReportsPage = () => {
  const { t } = useLanguage();
  const [reportType, setReportType] = useState('sales');
  
  // Mock data for sales report
  const salesData = [
    { name: 'Yan', value: 4000 },
    { name: 'Fev', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Iyu', value: 5500 },
    { name: 'Iyl', value: 7000 },
    { name: 'Avg', value: 6500 },
    { name: 'Sen', value: 8000 },
    { name: 'Okt', value: 7500 },
    { name: 'Noy', value: 9000 },
    { name: 'Dek', value: 10000 },
  ];
  
  // Mock data for product categories
  const categoryData = [
    { name: 'Televizorlar', value: 35 },
    { name: 'Muzlatgichlar', value: 25 },
    { name: 'Kir yuvish', value: 20 },
    { name: 'Konditsionerlar', value: 15 },
    { name: 'Oshxona jihozlari', value: 5 },
  ];
  
  // Mock data for top dealers
  const dealerData = [
    { name: 'Alisher Toshmatov', value: 35000000 },
    { name: 'Dilshod Karimov', value: 28000000 },
    { name: 'Jahongir Raimov', value: 24000000 },
    { name: 'Nodira Azimova', value: 18000000 },
    { name: 'Sevara Kamalova', value: 12000000 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
    <PageLayout 
      title="Hisobotlar"
      description="Biznes hisobotlarini ko'rish"
    >
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Vaqt oralig'i
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Yuklash
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="sales" className="w-full" onValueChange={setReportType}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="sales">
            <LineChart className="mr-2 h-4 w-4" />
            Sotuvlar hisoboti
          </TabsTrigger>
          <TabsTrigger value="products">
            <PieChart className="mr-2 h-4 w-4" />
            Mahsulotlar hisoboti
          </TabsTrigger>
          <TabsTrigger value="dealers">
            <BarChart className="mr-2 h-4 w-4" />
            Dillerlar hisoboti
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Oylik sotuvlar dinamikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    width={500}
                    height={300}
                    data={salesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} so'm`} />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} name="Sotuvlar (so'm)" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Mahsulot kategoriyalari bo'yicha sotuvlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dealers">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 dillerlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    width={500}
                    height={300}
                    data={dealerData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} so'm`} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Sotuvlar (so'm)" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default ReportsPage;
