# 📊 Invoice Management System

Modern invoice management application built with Next.js 15, featuring a comprehensive dashboard, multi-currency support, and professional PDF generation.

## ✨ Features

### 🏠 **Professional Dashboard**

- Real-time statistics and analytics
- Revenue trend visualization with Recharts
- Invoice status distribution charts
- Recent invoices overview
- Quick action buttons
- Multi-currency support with proper formatting

### 💰 **Multi-Currency System**

- Support for 5 major currencies (IDR, USD, EUR, GBP, JPY)
- Proper locale formatting for each currency
- Currency selector with symbol preview
- Consistent formatting across all components

### 📄 **Invoice Management**

- Create, edit, and manage invoices
- Professional PDF generation with jsPDF
- Email integration for sending invoices
- Status tracking (PAID, PENDING, CANCEL)
- Client management system

### 🔐 **Authentication & Security**

- NextAuth.js with email magic links
- MongoDB session management
- Protected routes and API endpoints
- User profile management

### 🎨 **Modern UI/UX**

- Responsive design with Tailwind CSS
- Professional components with Radix UI
- Loading states and error handling
- Smooth animations and transitions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- Email service (Gmail/SMTP)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd inv0ice
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**
   Create `.env.local` file:

```env
AUTH_SECRET="your-auth-secret"
MONGODB_URI="your-mongodb-connection-string"

# Email Configuration
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="465"
EMAIL_FROM="your-email@gmail.com"

DOMAIN="http://localhost:3000"
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/                 # Authentication pages
│   ├── (dashboard)/            # Dashboard and main app
│   │   ├── dashboard/          # Dashboard with analytics
│   │   ├── invoice/            # Invoice management
│   │   └── settings/           # User settings
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication
│   │   ├── dashboard/         # Dashboard APIs
│   │   ├── invoice/           # Invoice CRUD
│   │   └── email/             # Email sending
│   └── onboarding/            # User onboarding
├── components/                 # Reusable components
│   ├── ui/                    # UI components (Radix-based)
│   └── template/              # Email templates
├── lib/                       # Utilities and configurations
├── models/                    # MongoDB models
└── hooks/                     # Custom React hooks
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **Email**: Nodemailer
- **Forms**: React Hook Form + Zod

## 📊 Dashboard Features

### Statistics Cards

- Total invoices with growth indicators
- Revenue by currency with trend analysis
- Pending and paid invoice counts
- Month-over-month growth tracking

### Visualizations

- Revenue trend (6-month area chart)
- Invoice status distribution (pie chart)
- Monthly invoice counts (stacked bar chart)
- Recent activity timeline

### Quick Actions

- Create new invoice
- View all invoices
- Access settings
- Export functionality

## 💰 Currency Support

| Currency | Symbol | Locale | Format Example |
| -------- | ------ | ------ | -------------- |
| IDR      | Rp     | id-ID  | Rp1.234.567,89 |
| USD      | $      | en-US  | $1,234,567.89  |
| EUR      | €      | de-DE  | 1.234.567,89 € |
| GBP      | £      | en-GB  | £1,234,567.89  |
| JPY      | ¥      | ja-JP  | ¥1,234,568     |

## 🔧 API Endpoints

### Dashboard

- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/charts` - Chart data

### Invoice Management

- `GET /api/invoice` - List invoices (paginated)
- `POST /api/invoice` - Create invoice
- `PUT /api/invoice` - Update invoice
- `GET /api/invoice/[userId]/[invoiceId]` - Generate PDF

### Email

- `POST /api/email/[invoiceId]` - Send invoice email

### User Management

- `GET /api/user` - Get user profile
- `PUT /api/user` - Update user profile

## 🎨 Customization

### Adding New Currency

1. Update `currencyConfig` in `src/lib/utils.ts`
2. Add to user model enum in `src/models/user.model.ts`
3. Update currency selector component

### Modifying Dashboard

- Statistics: Edit `src/app/api/dashboard/stats/route.ts`
- Charts: Modify `src/app/(dashboard)/dashboard/_components/DashboardCharts.tsx`
- Layout: Update `src/app/(dashboard)/dashboard/page.tsx`

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment

```bash
npm run build
npm start
```

## 📝 Recent Improvements

- ✅ Complete dashboard implementation with analytics
- ✅ Multi-currency system with proper formatting
- ✅ Professional PDF generation with optimized layout
- ✅ Email system integration
- ✅ Responsive design improvements
- ✅ Performance optimizations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email webshop088@gmail.com or create an issue in the repository.
