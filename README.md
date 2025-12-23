# Farmate - Uber for Farm Vehicles

Farmate is a web application that connects farmers with farm vehicles on-demand, similar to Uber but for agricultural equipment. Farmers can book tractors, harvesters, water tankers, and other farm vehicles instantly.

## Features

- **User Registration & Login**: Phone number-based authentication with OTP verification
- **Vehicle Categories**: Multiple types of farm vehicles (tractors, harvesters, etc.)
- **Smart Search**: Find vehicles by type, location, price range
- **Real-time Availability**: Check vehicle availability instantly
- **Booking System**: Instant and scheduled booking options
- **Transparent Pricing**: Clear pricing before booking
- **Payment Integration**: Multiple payment methods (UPI, COD, Wallet)
- **Live Tracking**: Track vehicle arrival in real-time
- **Rating System**: Rate drivers and vehicles
- **Multi-language Support**: Support for local languages
- **Driver Panel**: Drivers can manage their vehicles
- **Admin Panel**: Admin control for system management

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT tokens
- **Styling**: CSS with responsive design

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
cd backend
npm install
```

4. Create a `.env` file in the backend directory with the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/farmate
JWT_SECRET=your_secret_key
NODE_ENV=development
```

5. Start the MongoDB server
6. Run the application:

```bash
npm start
```

The application will be available at `http://localhost:5000`

## API Endpoints

- `POST /api/auth/send-otp` - Send OTP for login
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/status` - Update booking status
- `GET /api/farmers/:id` - Get farmer profile
- `PUT /api/farmers/:id` - Update farmer profile
- `GET /api/drivers/:id` - Get driver profile
- `PUT /api/drivers/:id` - Update driver profile

## Deployment

To deploy to GitHub Pages:
1. Build the frontend for production
2. Serve the static files using a web server
3. For full deployment with backend, use platforms like Heroku, AWS, or DigitalOcean

## License

This project is licensed under the MIT License.