# 💰 SplitBills - Smart Expense Splitting App

**SplitBills** is a modern, user-friendly web application built with Next.js that helps you effortlessly split expenses with friends, roommates, and travel groups. Whether you're planning a weekend trip, sharing household expenses, or managing group dining bills, SplitBills makes it easy to track who owes whom.

## ✨ Features

### 🏠 **Group Management**
- Create multiple groups for different occasions (trips, households, events)
- Add detailed descriptions to groups
- Switch between groups seamlessly
- Persistent data storage using localStorage

### 👥 **Member Management**
- Add unlimited members to each group
- Optional email addresses for members
- Visual member avatars with initials
- Member balance tracking
- Safe member removal (with expense cleanup)

### 💸 **Expense Tracking**
- Add detailed expenses with descriptions
- Multiple expense categories (Food & Dining, Transportation, Accommodation, etc.)
- Flexible payment tracking (who paid vs. who participated)
- Custom expense splitting among selected participants
- Edit and delete expenses
- Date tracking for all transactions

### ⚖️ **Smart Settlement Calculation**
- Automatic calculation of who owes whom
- Optimized settlement suggestions (minimal transactions)
- Real-time balance updates
- Export settlements to CSV
- Visual settlement instructions

### 📊 **Comprehensive Dashboard**
- **Overview Tab**: Group summary with quick stats and recent activity
- **Members Tab**: Detailed member management and balance view
- **Expenses Tab**: Complete expense history and management
- **Settlements Tab**: Who owes whom with payment instructions

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Dark mode support
- Intuitive navigation with tab-based interface
- Loading states and error handling
- Smooth animations and transitions

### 🔍 **SEO Optimized**
- SEO-friendly metadata and keywords
- Open Graph and Twitter card support
- Semantic HTML structure
- Accessibility features

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or later
- **npm**, **yarn**, **pnpm**, or **bun** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anuradha-lakruwan/split-bills.git
   cd split-bills
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Production Build

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 🛠️ Technology Stack

- **Framework**: [Next.js 15.5.2](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: React Context API with useReducer
- **Data Persistence**: localStorage (browser storage)
- **Development**: Turbopack for fast development builds
- **Fonts**: Geist Sans & Geist Mono

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Dashboard.tsx      # Main dashboard with tabs
│   ├── WelcomeScreen.tsx  # First-time user experience
│   ├── GroupSelector.tsx  # Group switching component
│   ├── GroupOverview.tsx  # Overview tab content
│   ├── MembersPanel.tsx   # Member management
│   ├── ExpensesPanel.tsx  # Expense tracking
│   └── SettlementsPanel.tsx # Settlement calculations
├── context/
│   └── AppContext.tsx     # Global state management
├── types/
│   └── index.ts          # TypeScript type definitions
└── utils/
    └── index.ts          # Utility functions
```

## 🔧 Configuration Files

- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration
- `postcss.config.mjs` - PostCSS configuration

## 📱 Usage Guide

### Creating Your First Group
1. Launch the app - you'll see the welcome screen
2. Enter a group name (e.g., "Weekend Trip", "House Expenses")
3. Add an optional description
4. Click "Create Your First Group"

### Adding Members
1. Go to the **Members** tab
2. Click "Add Member"
3. Enter member name (required) and email (optional)
4. Click "Add Member" to confirm

### Recording Expenses
1. Navigate to the **Expenses** tab
2. Click "Add Expense"
3. Fill in the expense details:
   - Description (what was purchased)
   - Amount in USD
   - Date of expense
   - Category (Food, Transport, etc.)
   - Who paid the bill
   - Who should split the cost
4. Click "Add Expense"

### Viewing Settlements
1. Go to the **Settlements** tab
2. See optimized payment suggestions
3. View individual member balances
4. Export settlement data as CSV if needed

## 🌟 Key Features Explained

### Smart Settlement Algorithm
The app uses an optimized algorithm to minimize the number of transactions needed to settle all debts within a group. Instead of everyone paying everyone else, it calculates the most efficient payment path.

### Flexible Expense Splitting
You can split expenses among any combination of group members. The person who paid doesn't have to be included in the split, and you can split among any subset of members.

### Real-time Balance Updates
All balances update automatically as you add, edit, or delete expenses. The dashboard provides real-time insights into group finances.

### Data Persistence
All your data is stored locally in your browser, so your groups and expenses persist between sessions without requiring any account creation.

## 🚀 Deployment

### Deploy on Vercel (Recommended)
1. Push your code to a Git repository
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically with zero configuration

### Deploy on Other Platforms
The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify
- Google Cloud Run

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/anuradha-lakruwan/split-bills/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide as much detail as possible about the issue

## 🎯 Roadmap

Future enhancements planned:
- [ ] Multi-currency support
- [ ] Receipt image uploads
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Advanced reporting and analytics
- [ ] Group expense limits and budgets
- [ ] Integration with payment apps
- [ ] Recurring expense support

---

**Made with ❤️ for easier expense sharing**

*Perfect for roommates, travel groups, dinner parties, and any situation where expenses need to be split fairly among multiple people.*
