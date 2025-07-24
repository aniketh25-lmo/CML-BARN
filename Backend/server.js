const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./utils/db');
const farmerRoutes = require('./routes/farmerroute');
const managerRoutes = require('./routes/manageroutes'); // ✅ renamed for clarity
const adminRoutes = require('./routes/adminroutes');
const { errorHandler } = require('./middleware/errormiddleware');
const fileRoutes = require('./routes/fileroutes');
// const farmerProfileRoutes = require('./routes/farmerprofileroutes');
const paymentRoutes = require('./routes/paymentroute');
const productionRoutes = require('./routes/productionroutes');
const market = require('./routes/marketroutes');
const chatRoutes = require('./routes/chatroutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

// ✅ Routes
app.use('/api/manager', managerRoutes); // Now you can use /api/manager/register
app.use('/api/admin', adminRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/excel', fileRoutes);
// app.use('/api/farmer/profile', farmerProfileRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/market', market);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
// ✅ Error handler
app.use(errorHandler);

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 