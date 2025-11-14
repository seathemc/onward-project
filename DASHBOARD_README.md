# Bahamas Economic Dashboard

A production-ready economic dashboard built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui** components.

## 🎯 Features

### Overview Tab
- **Summary Cards**: Key metrics at a glance (GDP, Growth Rate, Budget Balance, Debt-to-GDP Ratio)
- **GDP Trends Chart**: Interactive area chart showing quarterly GDP trends
- **Sector Breakdown**: Bar chart displaying economic sector contributions
- **Budget Table**: Detailed ministry-level budget tracking with status indicators

### GDP Analysis Tab
- Filterable GDP trends by year
- Sector performance breakdown
- GDP per capita tracking
- Export to CSV functionality

### Budget Details Tab
- Ministry-level expenditure tracking
- Budget allocation vs spent analysis
- Status indicators (on-track, over-budget, under-utilized)
- Revenue and expenditure breakdowns
- Export functionality for budget data and categories

### Year Comparison Tab
- Side-by-side year-over-year comparisons
- Percentage change calculations
- Trend indicators
- Key metrics including GDP, revenue, expenditure, and debt

## 🏗️ Architecture

### Data Layer (`lib/api.ts`)
The API layer is designed for easy integration with real data sources:

```typescript
const USE_REAL_API = false; // Set to true when ready
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.bahamas.gov.bs";
```

**Current State**: Uses mock data with simulated network delays
**Production Ready**: Simply flip `USE_REAL_API` to `true` and configure your API endpoints

### Mock Data (`lib/mock-data.ts`)
Realistic Bahamas economic data including:
- Quarterly GDP data (2023-2024)
- Budget data with revenue/expenditure breakdown
- Ministry-level budget categories
- Year-over-year comparisons

### Type Safety (`types/bahamas-data.ts`)
Full TypeScript coverage with interfaces for:
- `GDPData`
- `BudgetData`
- `BudgetCategory`
- `YearComparison`

## 🎨 shadcn/ui Components Used

This dashboard demonstrates 20+ shadcn components:

**Layout & Structure**
- Card, Separator, Tabs, Skeleton

**Data Display**
- Table, Chart, Badge

**Forms & Inputs**
- Button, Select

**Feedback**
- Sonner (Toast notifications)

**Icons**
- Lucide React icons

## 🚀 Getting Started

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Build
```bash
npm run build
npm start
```

## 📊 Key Metrics Tracked

### GDP Metrics
- Quarterly GDP values (millions BSD)
- GDP growth rate (percentage)
- GDP per capita
- Sector breakdown (Tourism, Financial, Construction, Agriculture, Other)

### Budget Metrics
- Total revenue (Tax, Non-Tax, Grants)
- Total expenditure (Recurrent, Capital)
- Budget balance (Surplus/Deficit)
- Ministry-level allocation and spending
- Debt metrics (Total, External, Domestic, Debt-to-GDP ratio)

## 🔌 API Integration

### Switching to Real Data

1. **Set environment variable**:
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-api-endpoint.com
```

2. **Update API configuration**:
```typescript
// lib/api.ts
const USE_REAL_API = true;
```

3. **Expected API endpoints**:
```
GET /api/gdp?year=2024
GET /api/budget?year=2024
GET /api/budget/categories?year=2024
GET /api/comparisons?from=2023&to=2024
GET /api/export/{type}
```

### API Response Format

The API layer expects responses matching the TypeScript interfaces:

```typescript
// GDP endpoint response
GDPData[] = [{
  year: number;
  quarter: string;
  gdp: number;
  gdpGrowthRate: number;
  gdpPerCapita: number;
  sectors: { tourism, financial, construction, agriculture, other };
}]

// Budget endpoint response
BudgetData[] = [{
  year: number;
  fiscalYear: string;
  revenue: { total, tax, nonTax, grants };
  expenditure: { total, recurrent, capital };
  balance: number;
  debt: { total, external, domestic, debtToGDP };
}]
```

## 📦 Export Functionality

Users can export data to CSV:
- GDP data export
- Budget summary export
- Budget categories export

The export function can be connected to backend endpoints that generate CSV files, or use the built-in client-side CSV generation.

## 🎯 Use Cases

This dashboard template can be adapted for:
- Government economic tracking
- Financial reporting
- Budget monitoring
- Economic research
- Public transparency portals
- Internal government dashboards

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (47+ components installed)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📝 Customization

### Changing Theme Colors
Edit `app/globals.css` to customize the color scheme:

```css
@theme {
  --color-primary: #yourcolor;
  --color-secondary: #yourcolor;
}
```

### Adding New Metrics
1. Add type definition to `types/bahamas-data.ts`
2. Add mock data to `lib/mock-data.ts`
3. Create API function in `lib/api.ts`
4. Build component using shadcn components
5. Add to dashboard tabs in `app/dashboard/page.tsx`

### Modifying Components
All shadcn components are in `components/ui/` and can be customized directly.

## 🌐 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=your-api-url
```

## 📄 License

This dashboard is built using shadcn/ui components which are MIT licensed and free to use.

## 🤝 Contributing

To extend this dashboard:
1. Add new data types
2. Create new chart/table components
3. Integrate additional shadcn components
4. Connect to real data sources

---

**Built with ❤️ using shadcn/ui components**
