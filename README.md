# ☕ Brew Haven Cafeteria

A full-stack cafe management system built with React.js and Node.js, featuring online ordering, user authentication, admin dashboard, and payment integration.

## 🌟 Features

### Customer Features
- 🔐 User authentication (signup/signin)
- 🛒 Shopping cart with real-time updates
- ❤️ Wishlist functionality
- 📱 Responsive design for all devices
- 💳 Stripe payment integration
- 📧 Email notifications for orders
- 📊 Order history and tracking
- ⭐ Product ratings and reviews

### Admin Features
- 📊 Dashboard with analytics
- 👥 User management
- 🍕 Product management (CRUD operations)
- 📦 Order management
- 📈 Sales analytics and reports

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router** - Navigation
- **Vite** - Build tool
- **Axios** - HTTP client
- **SweetAlert2** - Notifications
- **React Icons** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email service
- **Stripe** - Payment processing

## 🚀 Live Demo

- **Frontend:** [Deployed on Vercel](https://your-frontend-url.vercel.app)
- **Backend API:** [Deployed on Render](https://your-backend-url.onrender.com)

## 📸 Screenshots

### Homepage
![Homepage](/screenshots/homepage.png)

### Menu Page
![Menu](/screenshots/menu.png)

### Admin Dashboard
![Admin Dashboard](/screenshots/admin-dashboard.png)

## 🏗️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourusername/cafeteria-management-system.git
cd cafeteria-management-system
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd server
npm install
\`\`\`

Create a \`.env\` file in the server directory:
\`\`\`env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/Cafeteria
JWT_SECRET=your_super_secret_jwt_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=http://localhost:5173
\`\`\`

Seed the database:
\`\`\`bash
npm run seed
\`\`\`

Start the server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd Frontend
npm install
\`\`\`

Create a \`.env\` file in the Frontend directory:
\`\`\`env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Brew Haven Cafeteria
\`\`\`

Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## 🌐 Deployment Guide

### Database Setup (MongoDB Atlas)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Get connection string
4. Update \`MONGODB_URI\` in environment variables

### Backend Deployment (Render)
1. Push code to GitHub
2. Create account at [Render](https://render.com)
3. Create new Web Service
4. Connect GitHub repository
5. Set environment variables
6. Deploy

### Frontend Deployment (Vercel)
1. Create account at [Vercel](https://vercel.com)
2. Import GitHub repository
3. Set build command: \`npm run build\`
4. Set environment variables
5. Deploy

## 📱 Mobile Responsive

The application is fully responsive and works on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktops

## 🔧 Environment Variables

### Backend (.env)
\`\`\`
PORT=3001
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
STRIPE_SECRET_KEY=your_stripe_key
FRONTEND_URL=your_frontend_url
\`\`\`

### Frontend (.env)
\`\`\`
VITE_API_URL=your_backend_url
VITE_APP_NAME=Brew Haven Cafeteria
\`\`\`

## 📋 API Endpoints

### Authentication
- \`POST /signup\` - User registration
- \`POST /signin\` - User login
- \`GET /profile\` - Get user profile
- \`PUT /profile\` - Update user profile

### Products
- \`GET /products\` - Get all products
- \`GET /products/:id\` - Get product by ID

### Orders
- \`POST /orders\` - Create new order
- \`GET /orders\` - Get user orders
- \`GET /orders/:id\` - Get order details

### Admin
- \`POST /admin/login\` - Admin login
- \`GET /admin/stats\` - Dashboard statistics
- \`GET /admin/users\` - Get all users
- \`GET /admin/orders\` - Get all orders

## 👨‍💻 Author

**Your Name**
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)
- GitHub: [Your GitHub](https://github.com/yourusername)
- Email: your.email@example.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing library
- Express.js team for the web framework
- MongoDB team for the database
- All open source contributors

## 🔮 Future Enhancements

- 🚗 Delivery tracking
- 📱 Mobile app (React Native)
- 🤖 AI-powered recommendations
- 📊 Advanced analytics
- 🎯 Loyalty program
- 🌍 Multi-location support

---

⭐ If you like this project, please give it a star on GitHub!
