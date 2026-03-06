# Gamma AI Prompt — Copy-Paste This Directly

---

**Paste the following into Gamma AI as your prompt:**

---

Create a professional 8-slide presentation for a college web development project titled **"McDonald's Clone — Full-Stack Food Ordering Web Application"**. Use a clean, modern design with McDonald's brand colors (red #DA291C, yellow #FFC72C, white, dark grey). Use relevant food/tech icons where appropriate. Keep text concise with bullet points, not paragraphs.

---

**Slide 1 — Title Slide**

Title: McDonald's Clone — Full-Stack Food Ordering Web App
Subtitle: Web Development Project
Student Name: Anas Ali
Registration No: 12315035
Guided By: Prof. Gagandeep Sethi
Tech Stack Badge: MERN Stack (MongoDB, Express.js, React, Node.js)

---

**Slide 2 — Project Overview**

Heading: Project Overview
Content:
- A full-stack McDonald's-inspired food ordering web application
- Complete order lifecycle: Browse Menu → Add to Cart → Checkout → Payment → Order Tracking
- Responsive design — works on Desktop (top navbar) and Mobile (bottom pill navigation)
- Key modules: User Authentication, Menu Catalog, Cart Management, Multi-Step Checkout, Razorpay Payment Gateway, Order History & Reorder
- Built with MERN stack: MongoDB for database, Express.js for REST API, React 18 for UI, Node.js for server

---

**Slide 3 — Tech Stack & Architecture**

Heading: Tech Stack & Architecture
Show a two-column layout or split diagram:

Backend:
- Node.js + Express.js — REST API server
- MongoDB + Mongoose — NoSQL database & ODM
- JWT + bcrypt — Authentication & password hashing
- Razorpay SDK — Payment gateway integration
- Helmet, CORS, Rate Limiting — Security middleware
- Winston — Logging, Compression — Performance

Frontend:
- React 18 with Hooks — Component-based UI
- React Router v6 — Client-side routing with protected routes
- Context API — Global state (AuthContext + CartContext)
- Framer Motion — Page transitions & animations
- Vite — Fast build tool with hot module replacement
- React Hot Toast — Notification system

Architecture Pattern: MVC-like separation (Models → Routes/Controllers → React Views)

---

**Slide 4 — Database Design**

Heading: Database Schema Design
Show 3 collections:

User Collection:
- name, email (unique), password (bcrypt hashed), phone, address
- passwordUpdatedAt for security audit trail

MenuItem Collection:
- name, description, price, category, image
- Flags: isVegetarian, isSpicy, isPopular, isAvailable
- Rich metadata: nutrition info, allergens, ingredients

Order Collection (Most Complex):
- Auto-generated order number: MC-YYYYMMDD-XXXX format
- Embedded order items (denormalized — stores price at time of order so historical orders stay accurate even if menu prices change)
- Status lifecycle: Processing → Preparing → Ready → Completed/Delivered/Cancelled
- statusHistory array — full audit trail of every status change with timestamps
- Payment details: paymentId, razorpayOrderId, method, timestamp

---

**Slide 5 — Key Features**

Heading: Key Features
Show as a feature grid (2×3 or similar):

1. JWT Authentication — Dual strategy: httpOnly cookies (XSS-safe) + Bearer token fallback. Password hashing with bcrypt.

2. Razorpay Payment Integration — Create order → Checkout modal → HMAC-SHA256 signature verification → Auto-update payment status.

3. 3-Step Checkout Wizard — Step 1: Order summary with tax. Step 2: Dine-In/Takeaway selection + conditional address. Step 3: Review & confirm. Animated transitions.

4. Persistent Cart — Synced to localStorage on every change. Survives page refresh. Smart decrement (removes item at qty 0).

5. Order History & Reorder — Color-coded status badges. Detail modal with full breakdown. One-click reorder from past orders.

6. Responsive + Animated UI — Desktop topbar ↔ Mobile bottom-pill nav. Framer Motion entrance/exit animations. Scroll-triggered reveals via Intersection Observer.

---

**Slide 6 — Security & Authentication Flow**

Heading: Security Implementation
Content as a flow + bullet list:

Authentication Flow:
User registers → Password hashed (bcrypt, 10 salt rounds) → JWT generated (24hr expiry) → Stored as httpOnly cookie + localStorage → Middleware validates token on every protected request → Background token validation on page refresh

Security Measures:
- httpOnly cookies — JavaScript cannot access token (XSS protection)
- Helmet middleware — Sets security headers (Content-Security-Policy, X-Frame-Options)
- CORS whitelist — Only allowed origins can call the API
- Rate limiting — Prevents brute-force attacks
- bcrypt hashing — Passwords never stored in plain text
- Mongoose ODM — Parameterized queries prevent injection attacks
- sameSite cookie flag — CSRF protection

Payment Security:
- Razorpay HMAC-SHA256 signature verification ensures payment integrity
- Amount in paise (×100) to prevent floating-point errors

---

**Slide 7 — Application Screenshots / Demo Flow**

Heading: Application Walkthrough
Show screenshots or describe the UI flow:

Screen 1: Landing Page — Hero section with promo video, featured menu carousel (auto-rotates every 8s), contact section
Screen 2: Menu Page — Category filter + Veg-only toggle, animated product cards with add-to-cart
Screen 3: Cart Drawer — Slide-in from right, quantity controls, subtotal, checkout button
Screen 4: Checkout — 3-step animated wizard, order type selection, real-time price calculation (18% GST + ₹40 delivery for Takeaway)
Screen 5: Order Success — Confetti animation, order number, estimated time, item summary
Screen 6: Profile Dashboard — 3 tabs: Personal Info (edit), Recent Orders, Security (change password with strength indicator)

(Add actual screenshots from the app if possible)

---

**Slide 8 — Future Scope & Conclusion**

Heading: Future Enhancements & Conclusion

Future Scope:
- Admin dashboard for menu management & order tracking
- Real-time order updates using WebSockets (Socket.IO)
- Email/SMS notifications on order status changes
- Search with debounced text filtering
- PWA support for offline menu browsing
- Refresh token rotation for enhanced security
- Unit & integration testing (Jest + React Testing Library)

Conclusion:
This project demonstrates a production-grade full-stack web application covering all core aspects — authentication, database design, payment processing, responsive UI, state management, and security best practices. Built entirely with the MERN stack, it showcases real-world patterns like denormalized data modeling, multi-step form wizards, and third-party payment integration.

Thank You
Anas Ali | 12315035 | Guided by Prof. Gagandeep Sethi
