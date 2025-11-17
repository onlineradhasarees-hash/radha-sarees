import { useState } from "react";
import { useStore } from "../../lib/store";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FileText, Download, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function ReportManagement() {
  const { reports, generateReport, deleteReport, products, orders } = useStore();
  const [reportType, setReportType] = useState<'sales' | 'inventory' | 'customers' | 'revenue'>('sales');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const handleGenerateReport = () => {
    if (!dateRange.start || !dateRange.end) {
      toast.error("Please select a date range");
      return;
    }

    let reportData: any = {};
    
    switch (reportType) {
      case 'sales':
        const salesOrders = orders.filter(o => {
          const orderDate = new Date(o.createdAt);
          return orderDate >= new Date(dateRange.start) && orderDate <= new Date(dateRange.end);
        });
        reportData = {
          totalOrders: salesOrders.length,
          totalRevenue: salesOrders.reduce((sum, o) => sum + o.totalAmount, 0),
          averageOrderValue: salesOrders.length > 0 
            ? salesOrders.reduce((sum, o) => sum + o.totalAmount, 0) / salesOrders.length 
            : 0,
          topProducts: salesOrders.flatMap(o => o.items)
            .reduce((acc: any, item) => {
              const existing = acc.find((p: any) => p.name === item.productName);
              if (existing) {
                existing.quantity += item.quantity;
              } else {
                acc.push({ name: item.productName, quantity: item.quantity });
              }
              return acc;
            }, [])
            .sort((a: any, b: any) => b.quantity - a.quantity)
            .slice(0, 5),
        };
        break;

      case 'inventory':
        reportData = {
          totalProducts: products.length,
          inStockProducts: products.filter(p => p.inStock).length,
          outOfStockProducts: products.filter(p => !p.inStock).length,
          productsByCategory: products.reduce((acc: any, p) => {
            acc[p.category] = (acc[p.category] || 0) + 1;
            return acc;
          }, {}),
          lowStockAlert: products.filter(p => !p.inStock).map(p => p.name),
        };
        break;

      case 'customers':
        const customers = orders.map(o => ({
          name: o.customerName,
          email: o.customerEmail,
          totalSpent: o.totalAmount,
        }));
        reportData = {
          totalCustomers: new Set(customers.map(c => c.email)).size,
          repeatCustomers: customers.filter((c, i, arr) => 
            arr.filter(a => a.email === c.email).length > 1
          ).length,
          topCustomers: customers
            .reduce((acc: any, c) => {
              const existing = acc.find((a: any) => a.email === c.email);
              if (existing) {
                existing.totalSpent += c.totalSpent;
              } else {
                acc.push({ ...c });
              }
              return acc;
            }, [])
            .sort((a: any, b: any) => b.totalSpent - a.totalSpent)
            .slice(0, 5),
        };
        break;

      case 'revenue':
        const revenueOrders = orders.filter(o => {
          const orderDate = new Date(o.createdAt);
          return orderDate >= new Date(dateRange.start) && orderDate <= new Date(dateRange.end);
        });
        reportData = {
          totalRevenue: revenueOrders.reduce((sum, o) => sum + o.totalAmount, 0),
          completedRevenue: revenueOrders
            .filter(o => o.paymentStatus === 'completed')
            .reduce((sum, o) => sum + o.totalAmount, 0),
          pendingRevenue: revenueOrders
            .filter(o => o.paymentStatus === 'pending')
            .reduce((sum, o) => sum + o.totalAmount, 0),
          revenueByCategory: revenueOrders.flatMap(o => o.items)
            .reduce((acc: any, item) => {
              const product = products.find(p => p.id === item.productId);
              if (product) {
                acc[product.category] = (acc[product.category] || 0) + (item.price * item.quantity);
              }
              return acc;
            }, {}),
        };
        break;
    }

    generateReport({
      name: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      type: reportType,
      dateRange,
      data: reportData,
    });

    toast.success("Report generated successfully!");
  };

  const handleDownloadReport = (report: any) => {
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.name}-${report.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded!");
  };

  const handleDeleteReport = (id: string) => {
    if (confirm("Are you sure you want to delete this report?")) {
      deleteReport(id);
      toast.success("Report deleted!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configure & Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="customers">Customer Report</SelectItem>
                  <SelectItem value="revenue">Revenue Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 pl-10 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 pl-10 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Button onClick={handleGenerateReport} className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </CardContent>
      </Card>

      {/* Generated Reports */}
      <div>
        <h3 className="mb-4">Generated Reports</h3>
        <div className="grid grid-cols-1 gap-4">
          {reports.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No reports generated yet</p>
              </CardContent>
            </Card>
          ) : (
            reports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h4>{report.name}</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">
                          Date Range: {new Date(report.dateRange.start).toLocaleDateString()} - {new Date(report.dateRange.end).toLocaleDateString()}
                        </p>
                        <p className="text-muted-foreground">
                          Generated: {new Date(report.generatedAt).toLocaleString()}
                        </p>
                      </div>

                      {/* Report Summary */}
                      <div className="mt-4 p-4 rounded-lg bg-muted">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(report.data).map(([key, value]) => {
                            if (typeof value === 'number') {
                              return (
                                <div key={key}>
                                  <p className="text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                  <p className="text-foreground">
                                    {key.toLowerCase().includes('revenue') || key.toLowerCase().includes('spent')
                                      ? `₹${value.toLocaleString('en-IN')}`
                                      : value}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReport(report)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
