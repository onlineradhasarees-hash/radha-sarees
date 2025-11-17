import { useState } from "react";
import { useStore } from "../../lib/store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Slider } from "../ui/slider";
import { Badge } from "../ui/badge";
import { Plus, Upload, Edit, Trash2, Search, FileSpreadsheet, Download, X, Package, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function ProductManagement() {
  const { products, addProduct, updateProduct, deleteProduct, bulkAddProducts } = useStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    image: "",
    rating: "4.5",
    reviews: "0",
    weight: "",
    category: "Wedding",
    categories: [] as string[],
    tags: [] as string[],
    description: "",
    isOrganic: false,
    inStock: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      originalPrice: "",
      image: "",
      rating: "4.5",
      reviews: "0",
      weight: "",
      category: "Wedding",
      categories: [] as string[],
      tags: [] as string[],
      description: "",
      isOrganic: false,
      inStock: true,
    });
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      image: formData.image,
      rating: parseFloat(formData.rating),
      reviews: parseInt(formData.reviews),
      weight: formData.weight,
      category: formData.category,
      categories: formData.categories.length > 0 ? formData.categories : [formData.category],
      tags: formData.tags,
      description: formData.description || "",
      isOrganic: formData.isOrganic,
      inStock: formData.inStock,
    };

    if (editingProduct !== null) {
      updateProduct(editingProduct, productData);
      toast.success("Product updated successfully!");
    } else {
      addProduct(productData);
      toast.success("Product added successfully!");
    }

    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      image: product.image,
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
      weight: product.weight,
      category: product.category,
      categories: product.categories || [product.category],
      tags: product.tags || [],
      description: product.description || "",
      isOrganic: product.isOrganic,
      inStock: product.inStock,
    });
    setEditingProduct(product.id);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
      toast.success("Product deleted successfully!");
    }
  };

  const handleBulkUpload = () => {
    if (!csvFile) {
      toast.error("Please upload a CSV file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.trim().split('\n');
        const newProducts = lines.slice(1).map(line => {
          const [name, price, originalPrice, image, weight, category, description] = line.split(',').map(s => s.trim());
          return {
            name,
            price: parseFloat(price),
            originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
            image,
            rating: 4.5,
            reviews: 0,
            weight,
            category,
            description: description || "",
            isOrganic: false,
            inStock: true,
          };
        });

        bulkAddProducts(newProducts);
        toast.success(`${newProducts.length} products added successfully!`);
        setIsBulkDialogOpen(false);
        setCsvFile(null);
      } catch (error) {
        toast.error("Error parsing CSV file. Please check the format.");
      }
    };
    reader.readAsText(csvFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    } else {
      toast.error("Please upload a valid CSV file.");
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    } else {
      toast.error("Please upload a valid CSV file.");
    }
  };

  const filteredProducts = products.filter(p => {
    // Search filter
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    
    // Price range filter
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    
    // Stock filter
    const matchesStock = stockFilter === "all" || 
      (stockFilter === "instock" && p.inStock) ||
      (stockFilter === "outofstock" && !p.inStock);
    
    // Date filter (simulated - in real app, products would have createdAt timestamp)
    const matchesDate = dateFilter === "all" || dateFilter === "recent";
    
    return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesDate;
  });

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100000]);
    setStockFilter("all");
    setDateFilter("all");
    toast.success("Filters cleared!");
  };

  const activeFilterCount = 
    selectedCategories.length + 
    (priceRange[0] !== 0 || priceRange[1] !== 100000 ? 1 : 0) +
    (stockFilter !== "all" ? 1 : 0) +
    (dateFilter !== "all" ? 1 : 0);

  const categories = ["Wedding", "Ethnic", "Casuals", "Festival", "New Arrivals", "Celebrity"];

  const handleSelectProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(pid => pid !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select products to delete");
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${selectedProducts.length} selected product(s)?`)) {
      selectedProducts.forEach(id => deleteProduct(id));
      toast.success(`${selectedProducts.length} products deleted successfully!`);
      setSelectedProducts([]);
      setSelectAll(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    if (formData.categories.includes(category)) {
      setFormData({
        ...formData,
        categories: formData.categories.filter(c => c !== category)
      });
    } else {
      setFormData({
        ...formData,
        categories: [...formData.categories, category]
      });
    }
  };

  const handleTagInput = (value: string) => {
    // Split by comma and add non-empty tags
    const newTags = value.split(',').map(t => t.trim()).filter(t => t);
    setFormData({ ...formData, tags: newTags });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-3">
          {selectedProducts.length > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelected}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedProducts.length})
            </Button>
          )}
          
          <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Bulk Upload Products via CSV</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                    <span>CSV Format Required</span>
                  </div>
                  <p className="text-muted-foreground">
                    Your CSV file should have these columns in order:
                  </p>
                  <code className="block bg-background p-2 rounded text-foreground">
                    name, price, originalPrice, image, weight, category, description
                  </code>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const csvContent = `name,price,originalPrice,image,weight,category,description\nRoyal Silk Saree,15999,19999,/images/saree1.jpg,Pure Silk,Wedding,Beautiful silk saree\nDesigner Saree,12999,16999,/images/saree2.jpg,Georgette,Ethnic,Elegant designer saree`;
                        const blob = new Blob([csvContent], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'sample-products.csv';
                        a.click();
                        toast.success("Sample CSV downloaded!");
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Sample CSV
                    </Button>
                  </div>
                </div>

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {csvFile ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-chart-3">
                        <FileSpreadsheet className="h-8 w-8" />
                        <div className="text-left">
                          <p>{csvFile.name}</p>
                          <p className="text-muted-foreground">
                            {(csvFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCsvFile(null)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-foreground mb-1">
                          Drag and drop your CSV file here
                        </p>
                        <p className="text-muted-foreground mb-4">or</p>
                      </div>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="csv-file-input"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('csv-file-input')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Browse Files
                      </Button>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleBulkUpload} 
                  className="w-full"
                  disabled={!csvFile}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Products from CSV
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Product Name</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Wedding">Wedding</SelectItem>
                        <SelectItem value="Ethnic">Ethnic</SelectItem>
                        <SelectItem value="Casuals">Casuals</SelectItem>
                        <SelectItem value="Festival">Festival</SelectItem>
                        <SelectItem value="New Arrivals">New Arrivals</SelectItem>
                        <SelectItem value="Celebrity">Celebrity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Original Price (₹)</Label>
                    <Input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Image URL</Label>
                  <Input
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/saree-name.jpg"
                  />
                </div>

                <div>
                  <Label>Fabric/Weight</Label>
                  <Input
                    required
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="e.g., Pure Silk, Cotton Blend"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Multiple Categories Selection */}
                <div>
                  <Label>Additional Categories (Optional)</Label>
                  <p className="text-muted-foreground mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                    Select all categories this product belongs to
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center gap-2">
                        <Checkbox
                          id={`form-cat-${category}`}
                          checked={formData.categories.includes(category)}
                          onCheckedChange={() => handleCategorySelect(category)}
                        />
                        <label
                          htmlFor={`form-cat-${category}`}
                          className="cursor-pointer select-none"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                  {formData.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.categories.map((cat) => (
                        <Badge key={cat} variant="secondary" className="flex items-center gap-1">
                          {cat}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={() => handleCategorySelect(cat)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags Input */}
                <div>
                  <Label>Tags</Label>
                  <p className="text-muted-foreground mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                    Enter tags separated by commas (e.g., featured, new-arrival, bestseller)
                  </p>
                  <Input
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleTagInput(e.target.value)}
                    placeholder="featured, new-arrival, bestseller"
                  />
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map((tag, idx) => (
                        <Badge key={idx} className="flex items-center gap-1 bg-accent text-accent-foreground">
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={() => setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== idx) })}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-muted-foreground mt-2" style={{ fontSize: 'var(--text-xs)' }}>
                    💡 Tip: Use "featured" tag to display products on homepage
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Rating</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Reviews</Label>
                    <Input
                      type="number"
                      value={formData.reviews}
                      onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2 pt-7">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.inStock}
                        onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                      />
                      <Label>In Stock</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.isOrganic}
                        onCheckedChange={(checked) => setFormData({ ...formData, isOrganic: checked })}
                      />
                      <Label>Organic</Label>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters Panel */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary">{activeFilterCount} active</Badge>
              )}
            </div>
            <div className="flex gap-2">
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Hide Filters
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show Filters
                  </>
                )}
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div className="space-y-3">
                <Label>Category</Label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center gap-2">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <label
                        htmlFor={`cat-${category}`}
                        className="cursor-pointer select-none"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-3">
                <Label>Price Range</Label>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">
                        ₹{priceRange[0].toLocaleString('en-IN')}
                      </span>
                      <span className="text-muted-foreground">
                        ₹{priceRange[1].toLocaleString('en-IN')}
                      </span>
                    </div>
                    <Slider
                      min={0}
                      max={100000}
                      step={1000}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Min</Label>
                      <Input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        placeholder="Min"
                      />
                    </div>
                    <div>
                      <Label>Max</Label>
                      <Input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])}
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock Status Filter */}
              <div className="space-y-3">
                <Label>Stock Status</Label>
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="instock">In Stock Only</SelectItem>
                    <SelectItem value="outofstock">Out of Stock Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Uploaded Filter */}
              <div className="space-y-3">
                <Label>Date Uploaded</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="recent">Recently Added</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex flex-wrap gap-2">
                <span className="text-muted-foreground">Active filters:</span>
                {selectedCategories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="flex items-center gap-1">
                    {cat}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => handleCategoryToggle(cat)}
                    />
                  </Badge>
                ))}
                {(priceRange[0] !== 0 || priceRange[1] !== 100000) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    ₹{priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => setPriceRange([0, 100000])}
                    />
                  </Badge>
                )}
                {stockFilter !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {stockFilter === "instock" ? "In Stock" : "Out of Stock"}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => setStockFilter("all")}
                    />
                  </Badge>
                )}
                {dateFilter !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {dateFilter === "recent" ? "Recently Added" : dateFilter === "today" ? "Today" : dateFilter === "week" ? "This Week" : "This Month"}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => setDateFilter("all")}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Table - WordPress Style */}
      {filteredProducts.length > 0 ? (
        <Card>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Fabric</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleSelectProduct(product.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="h-16 w-16 rounded overflow-hidden bg-muted">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23ddd" width="64" height="64"/%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="truncate">{product.name}</p>
                        {product.description && (
                          <p className="text-muted-foreground truncate">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 bg-primary/10 text-primary">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{product.weight}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>₹{product.price.toLocaleString('en-IN')}</p>
                        {product.originalPrice && (
                          <p className="text-muted-foreground line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 ${
                        product.inStock 
                          ? 'bg-chart-3/10 text-chart-3' 
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No products found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}