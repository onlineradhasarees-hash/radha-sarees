# Radha Sarees - E-commerce Platform

A comprehensive e-commerce website for premium Indian sarees, featuring a complete shopping experience with product catalog, cart functionality, wishlist, category filtering, search, and a fully functional admin panel.

## 🚀 Live Demo

- **Store**: [Your deployed URL]
- **Admin Panel**: [Your deployed URL]/admin

## Features

### Customer Features
- 🛍️ Product browsing with categories (Wedding, Ethnic, Casuals, Festival, New Arrivals, Celebrity)
- 🔍 Search and filter functionality
- ❤️ Wishlist management
- 🛒 Shopping cart with real-time updates
- 💳 Complete checkout process with payment gateway integration
- 👤 User authentication and customer dashboard
- 📦 Order tracking and invoice generation
- 💰 Multiple payment methods support
- 📱 Fully responsive design

### Admin Features
- 📊 Comprehensive dashboard with analytics and charts
- 📦 Product management (Add, Edit, Delete, Bulk Import via CSV)
- 📋 Order management with status updates
- 👥 Customer management
- 💳 Payment gateway settings (Razorpay, PhonePe)
- 📈 Report generation (Sales, Products, Orders)
- ⚙️ Site settings customization (Store, Shipping, Payment)
- 🖼️ Image management system

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 4.0 with custom design system
- **State Management**: Zustand with localStorage persistence
- **Backend**: Supabase Edge Functions (Hono + Deno)
- **Database**: Supabase PostgreSQL with KV store
- **Authentication**: Supabase Auth with JWT
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner
- **Routing**: Client-side SEO-friendly routing

## Deployment

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Vercel or Netlify account (for deployment)

### Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd radha-sarees
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your Supabase credentials:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start development server:
```bash
npm run dev
```

5. Open http://localhost:5173

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables
5. Deploy!

### ⚠️ Security Configuration

**IMPORTANT - Before Pushing to GitHub:**

1. **Never commit these files:**
   - `.env` files (already in `.gitignore`)
   - `node_modules/` directory
   - Any files containing API keys or secrets

2. **Environment Variables:**
   - All Supabase credentials should be stored in environment variables
   - In Vercel/Netlify: Add them in the dashboard
   - Locally: Use `.env` file (never commit this)

3. **Change default passwords:**
   - Update admin credentials in production
   - Update any hardcoded passwords

4. **Review `.gitignore`:**
   - Ensure all sensitive files are excluded
   - Check that documentation files (*.md) are excluded except README.md

### Environment Variables

**Required for deployment:**

```bash
# Frontend (Vercel/Netlify)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Backend (Supabase Edge Functions - Already configured)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_DB_URL=your_database_url_here
```

**⚠️ NEVER commit these values to Git!**

## Architecture

```
Vercel (Frontend) → Supabase Edge Functions (Backend) → Supabase Database
```

- **Frontend**: Hosted on Vercel (React SPA)
- **Backend**: Supabase Edge Functions handle all API requests
- **Database**: Supabase PostgreSQL with KV store

## Project Structure

```
/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Homepage hero section
│   ├── ProductCard.tsx # Product display
│   ├── Cart.tsx        # Shopping cart
│   └── ...
├── lib/                # Utilities and state management
│   ├── store.ts        # Zustand store
│   ├── api.ts          # API client
│   └── useData.ts      # Data synchronization hooks
├── styles/             # Global styles
│   └── globals.css     # Tailwind + design tokens
├── supabase/           # Backend code
│   └── functions/
│       └── server/     # Edge Function server
├── App.tsx             # Main application component
├── Admin.tsx           # Admin panel
└── index.html          # HTML entry point
```

## Design System

All styling uses CSS variables defined in `/styles/globals.css`:

- **Colors**: Primary, secondary, accent, background, foreground, etc.
- **Typography**: Custom font families and sizes
- **Spacing**: Consistent spacing scale
- **Border Radius**: Unified border radius values

To customize the design, edit the CSS variables in `globals.css`.

## Admin Access

Default admin credentials:
- Username: `admin`
- Password: `admin123`

**⚠️ Important**: Change these credentials in production!

## API Endpoints

All API endpoints are prefixed with `/make-server-226dc7f7/`:

### Authentication
- `POST /auth/signup` - Create new customer account
- `POST /auth/login` - Customer login
- `GET /auth/session` - Get current session
- `POST /auth/admin-login` - Admin login

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get single product
- `POST /products` - Add new product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)
- `POST /products/bulk` - Bulk add products (admin)

### Orders
- `GET /orders` - Get all orders (admin)
- `GET /orders/customer/:email` - Get customer orders
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order status (admin)

### Customer Profile
- `GET /customer/profile` - Get customer profile
- `PUT /customer/profile` - Update customer profile
- `GET /customer/payment-methods` - Get payment methods
- `POST /customer/payment-methods` - Add payment method
- `PUT /customer/payment-methods/:id` - Update payment method
- `DELETE /customer/payment-methods/:id` - Delete payment method
- `GET /customer/billing-addresses` - Get billing addresses
- `POST /customer/billing-addresses` - Add billing address
- `PUT /customer/billing-addresses/:id` - Update billing address
- `DELETE /customer/billing-addresses/:id` - Delete billing address

### Settings & Reports
- `GET /settings/payment-gateways` - Get payment gateways
- `PUT /settings/payment-gateways/:id` - Update payment gateway
- `GET /settings/site` - Get site settings
- `PUT /settings/site` - Update site settings
- `POST /reports` - Generate report
- `GET /reports` - Get all reports
- `DELETE /reports/:id` - Delete report

## Categories

The platform supports the following saree categories:
- Wedding - Traditional wedding sarees
- Ethnic - Ethnic and cultural sarees
- Casuals - Everyday casual sarees
- Festival - Festival and celebration sarees
- New Arrivals - Latest collection
- Celebrity - Celebrity-inspired designs

## License

Proprietary - All rights reserved

## Support

For support, please contact the development team.