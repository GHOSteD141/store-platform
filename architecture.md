# Store Platform - Project Architecture

## Project Overview

**Store Platform** is a full-stack e-commerce application built with modern web technologies. It features a React-based frontend with TypeScript and a Node.js backend API, designed to manage products, collections, shopping cart, and checkout functionality.

---

## High-Level Architecture

```
store-platform/
├── Root Level (Monorepo Structure)
│   ├── package.json (Root project configuration)
│   ├── package-lock.json
│   ├── .git/ (Version control)
│   └── node_modules/
│
├── client/ (Frontend - React + Vite + TypeScript)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── [Config files]
│
├── server/ (Backend - Node.js + Express)
│   ├── server.js
│   ├── package.json
│   ├── config/
│   ├── models/
│   └── node_modules/
│
└── NOTES_DEV/ (Development notes)
    └── Comments.md
```

---

## Frontend Architecture (Client)

### Technology Stack
- **Framework**: React 18+
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Library**: Shadcn/UI Components
- **Styling**: CSS + TailwindCSS (via Shadcn)

### Directory Structure

```
client/
├── src/
│   ├── main.tsx                 # Application entry point
│   ├── App.tsx                  # Root component
│   ├── index.css                # Global styles
│   ├── vite-env.d.ts            # Vite environment types
│   │
│   ├── components/              # Reusable UI Components
│   │   ├── CartIcon.tsx         # Shopping cart icon component
│   │   ├── CollectionCard.tsx   # Product collection card
│   │   ├── Footer.tsx           # Footer component
│   │   ├── Header.tsx           # Header/Navigation bar
│   │   ├── Layout.tsx           # Main layout wrapper
│   │   ├── NavLink.tsx          # Navigation link component
│   │   ├── ProductCard.tsx      # Individual product card
│   │   ├── QuantitySelector.tsx # Quantity adjustment UI
│   │   ├── ScrollToTop.tsx      # Scroll to top button
│   │   └── ui/                  # Pre-built Shadcn/UI Components
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── command.tsx
│   │       ├── context-menu.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── hover-card.tsx
│   │       ├── input-otp.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── sonner.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       ├── tooltip.tsx
│   │       └── use-toast.ts
│   │
│   ├── pages/                   # Page Components (Routes)
│   │   ├── About.tsx            # About page
│   │   ├── Admin.tsx            # Admin dashboard page
│   │   ├── Cart.tsx             # Shopping cart page
│   │   ├── Checkout.tsx         # Checkout/payment page
│   │   ├── Index.tsx            # Home page
│   │   ├── NotFound.tsx         # 404 error page
│   │   ├── ProductDetail.tsx    # Single product detail page
│   │   └── Products.tsx         # Products listing page
│   │
│   ├── hooks/                   # Custom React Hooks
│   │   ├── use-mobile.tsx       # Mobile device detection hook
│   │   ├── use-toast.ts         # Toast notifications hook
│   │   ├── useCart.ts           # Shopping cart state management
│   │   └── useWishlist.ts       # Wishlist management hook
│   │
│   ├── data/                    # Static Data & Constants
│   │   └── products.ts          # Product mock/seed data
│   │
│   ├── lib/                     # Utility Functions
│   │   └── utils.ts             # General utility functions
│   │
│   └── test/                    # Testing
│       ├── example.test.ts      # Example test cases
│       └── setup.ts             # Test environment setup
│
├── public/                      # Static Assets
│   ├── favicon.svg              # Favicon
│   └── icons.svg                # Icon sprites/assets
│
├── index.html                   # HTML entry point
├── package.json                 # Frontend dependencies
├── package-lock.json
├── vite.config.ts               # Vite build configuration
├── tsconfig.json                # TypeScript base configuration
├── tsconfig.app.json            # TypeScript app configuration
├── tsconfig.node.json           # TypeScript Node configuration
├── eslint.config.js             # ESLint configuration
├── .gitignore
├── node_modules/
└── README.md
```

### Component Hierarchy

```
App.tsx
├── Layout
│   ├── Header
│   │   ├── NavLink
│   │   └── CartIcon
│   ├── Pages (Router)
│   │   ├── Index
│   │   ├── Products
│   │   ├── ProductDetail
│   │   ├── Cart
│   │   ├── Checkout
│   │   ├── About
│   │   ├── Admin
│   │   └── NotFound
│   ├── Footer
│   └── ScrollToTop
└── Toaster
```

---

## Backend Architecture (Server)

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js (inferred)
- **Language**: JavaScript
- **Database**: MongoDB (assumed, with Mongoose models)
- **File Management**: Cloudinary integration

### Directory Structure

```
server/
├── server.js                    # Main server entry point
├── package.json                 # Backend dependencies
├── package-lock.json
│
├── config/                      # Configuration Files
│   └── cloudinary.js            # Cloudinary image service config
│
├── models/                      # Database Models (MongoDB/Mongoose)
│   ├── Banner.js                # Banner model for promotions/hero sections
│   └── Product.js               # Product catalog model
│
├── node_modules/
├── .env                         # Environment variables (API keys, DB credentials)
└── [Additional routes, controllers, middleware files]
```

### API Structure (Inferred)

```
Routes/Endpoints:
├── /products
│   ├── GET / - Fetch all products
│   ├── GET /:id - Fetch single product
│   ├── POST / - Create product (admin)
│   ├── PUT /:id - Update product (admin)
│   └── DELETE /:id - Delete product (admin)
│
├── /banners
│   ├── GET / - Fetch all banners
│   ├── POST / - Create banner
│   ├── PUT /:id - Update banner
│   └── DELETE /:id - Delete banner
│
└── [Other routes for auth, checkout, etc.]
```

### Database Models

#### Product Model
- Product information (name, description, price)
- Images (integrated with Cloudinary)
- Categories/Collections
- Inventory management
- Timestamps

#### Banner Model
- Banner content and images
- Display settings
- Active/inactive status
- Timestamps

---

## Key Features & Functionality

### Frontend Features
- 🛒 **Shopping Cart Management** - Add/remove products, manage quantities
- ❤️ **Wishlist System** - Save favorite products
- 📱 **Responsive Design** - Mobile-first UI with Shadcn components
- 🔍 **Product Search & Filtering** - Browse products by collections
- 💳 **Checkout Process** - Order placement and payment
- 👤 **Admin Dashboard** - Product/collection management
- 📱 **Mobile Detection** - Device-specific experiences
- 🔔 **Toast Notifications** - User feedback system

### Backend Features
- 📦 **Product Management** - CRUD operations for products
- 🎨 **Banner Management** - Promotional banners and hero sections
- ☁️ **Cloud Storage** - Cloudinary integration for images
- 🔒 **Environment Configuration** - Secure credential management

---

## Data Flow

### Shopping Flow
```
Product Listing → Product Detail → Add to Cart → Checkout → Order Confirmation
                                   (useCart hook)
```

### State Management
- **Cart State**: Managed via `useCart` custom hook
- **Wishlist State**: Managed via `useWishlist` custom hook
- **Toast Notifications**: Handled by `use-toast` hook

---

## Configuration Files

### Frontend
- **vite.config.ts** - Vite bundler configuration
- **tsconfig.json** - TypeScript compiler options
- **eslint.config.js** - Code linting rules
- **package.json** - Dependencies and scripts

### Backend
- **.env** - Environment variables (Cloudinary keys, MongoDB URI, etc.)
- **package.json** - Backend dependencies and scripts

### Root Level
- **package.json** - Root project configuration
- **.git/** - Version control repository

---

## Development Notes

- Documentation: [NOTES_DEV/Comments.md](./NOTES_DEV/Comments.md)
- Development guidelines and notes are maintained in the NOTES_DEV folder

---

## Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | UI framework |
| **Build Tool** | Vite | Fast development & building |
| **UI Components** | Shadcn/UI | Pre-built accessible components |
| **State Management** | Custom Hooks | Cart, wishlist, notifications |
| **Backend** | Node.js + Express | API server |
| **Database** | MongoDB | Data persistence |
| **Image Service** | Cloudinary | Cloud image management |
| **Package Manager** | npm | Dependency management |

---

## Getting Started

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Backend Setup
```bash
cd server
npm install
npm start
```

---

## Notes
- This is a monorepo structure with separate client and server folders
- Frontend uses modern React patterns with TypeScript
- Backend uses Express for REST API
- UI is built with Shadcn components for consistency and accessibility
- State management is kept lightweight with custom hooks
