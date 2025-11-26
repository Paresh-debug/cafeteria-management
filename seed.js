require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    await MenuItem.deleteMany({});
    
    await MenuItem.insertMany([
      { name: 'Masala Dosa', price: 40, category: 'Breakfast' },
      { name: 'Idli Sambar', price: 30, category: 'Breakfast' },
      { name: 'Poha', price: 25, category: 'Breakfast' },
      { name: 'Veg Thali', price: 80, category: 'Lunch' },
      { name: 'Paneer Butter Masala', price: 100, category: 'Lunch' },
      { name: 'Biryani', price: 120, category: 'Lunch' },
      { name: 'Samosa', price: 15, category: 'Snacks' },
      { name: 'Vada Pav', price: 20, category: 'Snacks' },
      { name: 'Tea', price: 10, category: 'Snacks' }
    ]);
    
    console.log('✅ Sample data added');
    process.exit();
  });
