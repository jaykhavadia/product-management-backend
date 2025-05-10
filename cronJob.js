const cron = require('node-cron');
const Product = require('./models/Product');
const moment = require('moment');

// Scheduled cron job to delete expired products every day at midnight
cron.schedule('0 0 0 * * *', async () => {
  try {
    const now = moment().toDate();
    const result = await Product.deleteMany({ expiryDate: { $lt: now } });
    console.log(`Deleted ${result.deletedCount} expired products.`);
  } catch (error) {
    console.error('Error cleaning up expired products:', error.message);
  }
});
