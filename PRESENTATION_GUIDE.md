# McDonald's Clone — Presentation & Viva Guide

---

## 1. PROJECT OVERVIEW (Opening Slide)

**What**: A full-stack McDonald's food ordering web application  
**Tech Stack**: MERN (MongoDB, Express.js, React 18, Node.js)  
**Key Highlights**:
- Complete order lifecycle: Browse → Cart → Checkout → Payment → Track
- JWT-based authentication with secure cookies
- Razorpay payment gateway integration
- Responsive design (Desktop + Mobile bottom-pill nav)
- Framer Motion animations throughout
- Multi-step checkout wizard

---

## 2. ARCHITECTURE & TECH STACK

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js + Express 4.18** | REST API server |
| **MongoDB + Mongoose 8.0** | Database & ODM |
| **JWT (jsonwebtoken 9.0)** | Token-based stateless authentication |
| **bcrypt 5.1** | Password hashing (10 salt rounds) |
| **Razorpay SDK 2.9** | Payment gateway |
| **Helmet** | Security headers (XSS, clickjacking protection) |
| **express-rate-limit** | DDoS/brute-force protection |
| **node-cron** | Scheduled tasks framework |
| **Winston** | Structured logging |
| **Joi** | Schema-based input validation |
| **compression** | Gzip response compression |
| **CORS** | Cross-origin request handling |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18.2** | UI framework with hooks |
| **React Router 6.20** | Client-side routing (v7 future flags) |
| **Vite** | Build tool with HMR & proxy |
| **Context API** | Global state (Auth + Cart) |
| **Framer Motion 10.16** | Page transitions & micro-animations |
| **React Hot Toast** | Toast notification system |
| **React Icons** | Iconography (Font Awesome set) |
| **Intersection Observer** | Scroll-triggered animations |
| **Axios + Fetch API** | HTTP client (dual approach) |

---

## 3. DATABASE SCHEMA DESIGN (Key Talking Point)

### User Model
- `name`, `email` (unique), `password` (hashed), `phone`, `address`
- `passwordUpdatedAt` tracks last password change for security auditing

### MenuItem Model
- Rich metadata: `nutrition`, `allergens`, `ingredients`
- Boolean flags: `isVegetarian`, `isSpicy`, `isPopular`, `isAvailable`
- `isAvailable` flag allows soft-disabling items without deletion

### Order Model (Most Complex — **good viva answer**)
- **Embedded sub-documents** for order items (denormalized for performance)
- **Auto-generated order number**: `MC-YYYYMMDD-XXXX` format via pre-save hook
- **Status lifecycle**: Processing → Preparing → Ready → Completed/Delivered
- **statusHistory array**: Audit trail of every status change with timestamp
- **Instance methods**: `updateStatus()`, `updatePaymentStatus()`, `updateEstimatedDeliveryTime()`
- **Static methods**: `getOrdersByStatus()`, `getOrdersByDateRange()`, `getUserRecentOrders()`

**Why embedded items instead of references?**
> Order items are denormalized (name, price stored directly) so that if a menu item's price changes later, historical orders remain accurate. This is an intentional design choice.

---

## 4. API ENDPOINTS SUMMARY

### Auth (`/api/auth`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/register` | User signup |
| POST | `/login` | Login + JWT cookie |
| POST | `/logout` | Clear JWT cookie |
| GET | `/user` | Fetch current user |
| PUT | `/update-profile` | Edit profile/password |

### Menu (`/api/menu`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | List items (filters: category, veg, popular) |
| GET | `/:id` | Single item details |
| GET | `/categories/all` | All distinct categories |
| POST/PUT/DELETE | `/`, `/:id` | Admin CRUD operations |

### Orders (`/api/orders`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/` | Create order |
| GET | `/` | User's orders (paginated) |
| GET | `/recent/:limit` | Recent N orders |
| GET | `/:id` | Single order detail |
| PUT | `/:id/cancel` | Cancel if Processing/Preparing |
| POST | `/reorder` | Reorder from past order |

### Payments (`/api/payments`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/create-order` | Create Razorpay order |
| POST | `/verify` | Verify payment signature |
| GET | `/key` | Get Razorpay public key |

---

## 5. AUTHENTICATION FLOW (Common Viva Question)

### How it works:
1. User registers → password hashed with **bcrypt** (10 salt rounds)
2. JWT token generated with user ID, expires in **24 hours**
3. Token sent as **httpOnly cookie** (prevents XSS attacks accessing it)
4. Also stored in **localStorage** for Authorization header fallback
5. Auth middleware checks **cookie first**, then **Authorization header**
6. Protected routes on frontend use `<ProtectedRoute>` component with `<Outlet />`

### Security measures you implemented:
- **httpOnly cookies** → JavaScript can't read the token (XSS protection)
- **secure flag** in production → cookie only sent over HTTPS
- **sameSite: 'none'** in production for cross-origin cookies
- **bcrypt hashing** → passwords never stored in plain text
- **Helmet middleware** → sets security headers automatically
- **Rate limiting** → prevents brute-force login attacks
- **CORS whitelist** → only allowed origins can call the API
- **Password change tracking** via `passwordUpdatedAt` field

---

## 6. PAYMENT INTEGRATION (Razorpay — Strong Viva Point)

### Flow:
```
Frontend                          Backend                         Razorpay
   │                                │                                │
   ├── POST /payments/create-order ──►                               │
   │                                ├── razorpay.orders.create() ────►
   │                                ◄── order object ────────────────┤
   ◄── razorpayOrderId ────────────┤                                │
   │                                │                                │
   ├── Opens Razorpay Checkout ─────────────────────────────────────►
   ◄── Payment success callback ────────────────────────────────────┤
   │                                │                                │
   ├── POST /payments/verify ──────►                                │
   │     (paymentId, orderId, sig)  │                                │
   │                                ├── HMAC-SHA256 verification     │
   │                                ├── Update order.paymentStatus   │
   ◄── Success response ───────────┤                                │
```

### Key details to mention:
- Amount sent in **paise** (multiply by 100)
- **HMAC-SHA256 signature verification** ensures payment wasn't tampered
- `payment_capture: 1` enables auto-capture (no manual capture needed)
- Payment details stored: `paymentId`, `razorpayOrderId`, `method`, `timestamp`

---

## 7. STATE MANAGEMENT (Context API)

### AuthContext
- **Instant hydration**: User restored from localStorage on mount (no loading flash)
- **Background validation**: Token verified against server silently after hydration
- **Auto-cleanup**: If server returns 401/403, session cleared without user seeing error
- Provides: `user`, `login()`, `register()`, `logout()`, `updateUser()`, `isAuthenticated`, `loading`

### CartContext
- **Persistent cart**: Synced to localStorage on every change
- **Smart operations**: `decrementQuantity()` removes item if quantity hits 0
- **Computed values**: `cartTotal` and `itemCount` derived from state
- **Toast feedback**: Every cart action shows a notification
- Provides: `cartItems`, `addToCart()`, `removeFromCart()`, `incrementQuantity()`, `decrementQuantity()`, `clearCart()`, `cartTotal`, `itemCount`

### Why Context API and not Redux?
> "For this scale of application (2 global states — auth & cart), Context API is sufficient and avoids the boilerplate overhead of Redux. Redux would be beneficial if we had more complex state interactions or needed middleware like Redux Saga for side effects."

---

## 8. FRONTEND COMPONENT ARCHITECTURE

```
App.jsx
├── Nav (hidden on auth pages)
│   ├── Desktop: Logo + Links + Cart + UserMenu
│   └── Mobile: Bottom pill navigation
│
├── Public Routes
│   ├── Home (hero video + menu carousel + about + contact)
│   ├── Login / Signup (with password strength indicator)
│   ├── Menu (category filter + veg toggle + card grid)
│   ├── HappyMeal (offers with countdown timers)
│   └── About (stats + features + scroll animations)
│
└── Protected Routes (ProtectedRoute wrapper)
    ├── Profile (3 tabs: info, orders, security)
    ├── Orders (history grid + detail modal + reorder)
    ├── Checkout (3-step wizard with animation)
    └── OrderSuccess (confetti + order summary)
```

---

## 9. KEY FEATURES TO DEMONSTRATE

### 1. Multi-Step Checkout Wizard
- **Step 1**: Order summary with tax calculation
- **Step 2**: Order type (Dine-In/Takeaway) + conditional address field
- **Step 3**: Review & confirm
- Animated transitions between steps (Framer Motion AnimatePresence)

### 2. Real-Time Cart Management
- Add/remove/increment/decrement from any page
- Slide-in cart drawer from right side
- Persistent across page refreshes (localStorage)
- Badge count on cart icon in navbar

### 3. Password Strength Indicator (Signup)
- Real-time scoring: Weak → Fair → Good → Strong
- Checks: length, uppercase, lowercase, numbers, special chars
- Color-coded progress bar

### 4. Order Tracking & Reorder
- Full order history with status badges (color-coded)
- Detail modal with complete breakdown
- One-click reorder from any past order

### 5. Happy Meal Offers with Countdown
- Live countdown timer (days + hours remaining)
- Recalculates every 60 seconds
- Toy selection feature per offer

### 6. Responsive Design
- Desktop: Traditional horizontal navbar
- Mobile: Sticky bottom pill navigation (like a mobile app)
- Cart switches between drawer and full-page on mobile

### 7. Scroll Animations
- Intersection Observer detects when sections enter viewport
- Framer Motion `whileInView` triggers entrance animations
- Navigation dots on Home page show active section

---

## 10. CODE-LEVEL GOTCHAS (Expect These in Viva!)

### Gotcha 1: Tax Rate Discrepancy
**Q**: "What tax rate does your app use?"  
**A**: The Order schema has a default comment of 5%, but the actual route code applies **18% GST** on both create and reorder endpoints. The route calculation overrides the schema default.

### Gotcha 2: Dual Authentication Strategy
**Q**: "How does your auth work — cookies or tokens?"  
**A**: Both! The middleware checks `req.cookies.jwt` first, then falls back to the `Authorization: Bearer <token>` header. Cookies are httpOnly for security, but localStorage token is a fallback for environments where cookies don't work (like some mobile browsers).

### Gotcha 3: Denormalized Order Items
**Q**: "Why do you store item name and price in the order instead of just referencing MenuItem?"  
**A**: If a menu item's price changes after an order is placed, the historical order should show the price the customer actually paid. This is an intentional denormalization for data integrity.

### Gotcha 4: Admin Routes Without Admin Field
**Q**: "How do admin operations work?"  
**A**: The routes check `req.user.isAdmin`, but the User model doesn't actually have an `isAdmin` field. This is a known limitation — admin functionality is scaffolded but needs the User model updated with a role/permission field.

### Gotcha 5: Hardcoded vs. Dynamic Menu
**Q**: "Where does the menu data come from?"  
**A**: The HomeMenu carousel and the Menu page currently use **hardcoded data** in the components. The backend has a full Menu API with CRUD operations and a MongoDB model. In a production version, these components would fetch from `/api/menu` instead of using static arrays.

### Gotcha 6: Duplicate CartContext Files
**Q**: "I see two CartContext files — why?"  
**A**: `src/context/CartContext.jsx` is the active one used by `App.jsx`. The one in `src/order/CartContext.jsx` is a deprecated/earlier version that's no longer imported anywhere.

### Gotcha 7: Port Inconsistency
**Q**: "What port does your backend run on?"  
**A**: The backend defaults to **port 5000** (from `index.js`), but `vite.config.js` proxy points to **port 5001**, and `api.js` falls back to **port 5001**. Need to ensure `.env` has the correct port or align these values.

### Gotcha 8: Scheduled Tasks — Imported but Empty
**Q**: "What do your scheduled tasks do?"  
**A**: The `node-cron` package is imported and the file structure exists, but the scheduled tasks (like abandoned cart detection) are **not yet implemented**. The infrastructure is there for future features.

### Gotcha 9: Order Cancellation Logic
**Q**: "Can a user cancel any order?"  
**A**: No — cancellation is only allowed if the order status is `Processing` or `Preparing`. Once it moves to `Ready`, `Completed`, or `Delivered`, it cannot be cancelled. This is enforced server-side.

### Gotcha 10: Session Hydration Strategy
**Q**: "What happens when the user refreshes the page?"  
**A**: The AuthContext uses a **two-phase hydration**: 
1. Instantly restores user from `localStorage` (no loading flash)
2. Background-validates the token with `GET /api/auth/user`
3. If validation fails (401/403), session is silently cleared

### Gotcha 11: CORS Configuration
**Q**: "How do you handle cross-origin requests?"  
**A**: CORS middleware whitelist includes localhost origins (5173 for Vite, 3000) and the production Vercel URL. `credentials: true` allows cookies to be sent cross-origin. Non-browser requests (no Origin header) are also allowed.

### Gotcha 12: Delivery Fee Logic
**Q**: "How is the delivery fee calculated?"  
**A**: ₹40 flat fee for **Takeaway** orders, ₹0 for **Dine-In**. This is applied both in the frontend Checkout component and verified in the backend order creation route.

---

## 11. COMMON VIVA QUESTIONS & ANSWERS

### Architecture & Design

**Q: Why did you choose the MERN stack?**  
> MongoDB's document model maps naturally to JSON API responses, making frontend-backend data flow seamless. React's component model allows reusable UI. Express is minimal and doesn't enforce unnecessary patterns. Node.js enables JavaScript on both client and server.

**Q: Why MongoDB over SQL?**  
> The order model has nested items (embedded documents), which map naturally to MongoDB's document structure. Menu items have varying fields (some have nutrition, some don't), which suits a schema-flexible database. For a food ordering app, we don't need complex joins — most queries are user-scoped.

**Q: What design pattern does your backend follow?**  
> MVC-like separation: Models (Mongoose schemas in `/models`), Routes act as Controllers (`/routes`), and Views are the React frontend. Middleware handles cross-cutting concerns (auth, error handling).

**Q: How does your app handle concurrent users?**  
> Node.js is single-threaded but event-driven with non-blocking I/O — it handles concurrent requests via the event loop without spawning threads. MongoDB handles concurrent reads/writes natively. JWT auth is stateless so no session locking.

### Security

**Q: How do you protect against common web vulnerabilities?**  
> - **XSS**: httpOnly cookies prevent JS access to tokens; Helmet sets Content-Security-Policy
> - **CSRF**: sameSite cookie attribute + CORS restrictions
> - **Injection**: Mongoose ODM parameterizes queries automatically
> - **Brute Force**: express-rate-limit on API endpoints
> - **Password Storage**: bcrypt with 10 salt rounds (never plain text)

**Q: What happens if someone intercepts the JWT?**  
> Tokens expire in 24 hours, limiting the window. In production, `secure: true` ensures cookies only travel over HTTPS. The Authorization header approach is less secure over HTTP. Ideally, we'd add refresh tokens and shorter expiry.

**Q: Why bcrypt and not SHA-256 for passwords?**  
> bcrypt is a purposefully slow hashing algorithm designed for passwords. It includes a salt automatically and has a configurable cost factor (rounds). SHA-256 is fast (bad for passwords — easier brute force) and doesn't include salting.

### Performance

**Q: What optimizations did you implement?**  
> - **compression middleware**: Gzip responses
> - **localStorage caching**: Cart and user state survive refreshes
> - **Lazy state restoration**: No server call needed to show cached data
> - **Vite HMR**: Instant dev feedback; optimized production builds
> - **Image optimization**: Static images served from public folder

**Q: How would you scale this application?**  
> - Add Redis for session caching and rate limit storage
> - Use CDN for static assets
> - Implement database indexing on frequently queried fields (userId, status)
> - Add load balancer for horizontal scaling
> - Consider serverless functions for payment verification

### React-Specific

**Q: Why Context API instead of Redux?**  
> The app has only two global states (auth + cart). Context API is sufficient and avoids Redux's boilerplate (actions, reducers, store). For 2 contexts, the re-render overhead is negligible.

**Q: How do protected routes work?**  
> `ProtectedRoute` component checks `isAuthenticated` from AuthContext. If not authenticated, it redirects to `/login`. If loading (server validation in progress), it shows a spinner. If authenticated, it renders child routes via `<Outlet />`.

**Q: What's the purpose of AnimatePresence in your checkout?**  
> It allows Framer Motion to animate components as they **unmount**. When switching checkout steps, the outgoing step fades/slides out before the incoming step animates in. Without AnimatePresence, React removes components instantly.

---

## 12. POSSIBLE IMPROVEMENT QUESTIONS

**Q: What would you improve if you had more time?**
1. **Admin dashboard** — manage menu items, view all orders, update statuses
2. **Real-time order tracking** with WebSockets (Socket.IO)
3. **Email/SMS notifications** on order status change
4. **Image upload** for menu items (currently URLs/static files)
5. **Search functionality** with debounced text search
6. **Pagination** on menu page for large catalogs
7. **Unit & integration tests** (Jest + React Testing Library)
8. **PWA support** for offline menu browsing
9. **Refresh tokens** for better security (short-lived access + long-lived refresh)
10. **Replace hardcoded menu** with dynamic backend data in all components

---

## 13. FLOW DIAGRAMS (For Slides)

### User Registration Flow
```
User fills form → Frontend validates → POST /api/auth/register
→ Backend hashes password (bcrypt) → Saves to MongoDB
→ Generates JWT → Sets httpOnly cookie → Returns token + user
→ Frontend stores in localStorage → Redirects to Home
```

### Order Placement Flow
```
Browse Menu → Add to Cart (Context + localStorage)
→ Go to Checkout → Step 1: Review items + totals
→ Step 2: Select Dine-In/Takeaway + address
→ Step 3: Confirm → POST /api/orders
→ Backend validates items, calculates totals
→ Generates order number (MC-YYYYMMDD-XXXX)
→ Saves order → Returns orderId
→ Frontend clears cart → Navigates to OrderSuccess
→ Confetti animation + order summary
```

### Payment Verification Flow
```
POST /payments/create-order → Razorpay creates order
→ Frontend opens Razorpay checkout modal
→ User pays → Razorpay returns paymentId + signature
→ POST /payments/verify → Backend verifies HMAC-SHA256
→ If valid: update order paymentStatus = 'Paid'
→ Store payment details (id, method, timestamp)
```

---

## 14. QUICK STATS FOR SLIDES

| Metric | Value |
|--------|-------|
| Total API endpoints | 16 |
| MongoDB Collections | 3 (Users, MenuItems, Orders) |
| React Components | 20+ |
| Frontend Routes | 9 |
| Context Providers | 2 (Auth, Cart) |
| Security Packages | 4 (helmet, bcrypt, rate-limit, cors) |
| Animation Library | Framer Motion |
| Payment Gateway | Razorpay |
| Checkout Steps | 3-step wizard |
| Order Statuses | 6 (Processing → Delivered/Cancelled) |

---

## 15. ONE-LINE FEATURE DESCRIPTIONS (For Bullet Slides)

- **JWT + Cookie dual auth** — Secure authentication with httpOnly cookies and Bearer token fallback
- **Razorpay integration** — Real payment processing with HMAC-SHA256 signature verification
- **3-step checkout wizard** — Animated multi-step order flow with conditional address input
- **Cart persistence** — Cart survives page refresh via localStorage sync
- **Order lifecycle tracking** — 6-status pipeline with full audit history
- **Reorder functionality** — One-click reorder from any past order
- **Password strength meter** — Real-time scoring with visual feedback on signup
- **Responsive navigation** — Desktop topbar switches to mobile bottom-pill nav
- **Scroll animations** — Intersection Observer + Framer Motion for viewport-triggered animations
- **Confetti celebration** — Custom CSS confetti animation on order success
- **Happy Meal countdown** — Live offer timers that update every 60 seconds
- **Profile management** — 3-tab dashboard (Info, Orders, Security)
