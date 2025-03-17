# F3 Requests Application

A Next.js application to manage and display applications submitted. This standalone application connects to a MongoDB database to store and retrieve user requests, favorites, and reminders.

## Features

### Home Page
- Beautiful cards showing user information
- Grouping by request type (relationship, friendship, suggestions)
- Filter panel to filter by gender, age range, and request type
- Option to add users to favorites

### Favorites Page
- Shows all favorited users grouped by gender
- Allows adding notes to each favorite
- Enables setting reminders for each favorite
- Provides option to remove from favorites

### Reminders Page
- Displays upcoming and completed reminders
- Allows marking reminders as completed
- Enables deleting reminders
- Shows visual indicators for reminder status (overdue, today, upcoming)

## Technical Stack

- **Frontend**: Next.js with JavaScript and Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB with Mongoose
- **Additional Libraries**:
  - react-icons (for UI icons)
  - date-fns (for date formatting)
  - react-datepicker (for date selection)
  - react-hot-toast (for notifications)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or remote)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd f3-requests
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/f3-requests
   ```
   Replace the MongoDB URI with your own if needed.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Routes

- **/api/requests** - Fetch and create user requests with filtering
- **/api/favorites** - Manage favorited users
- **/api/reminders** - Manage reminders

## Project Structure

```
f3-requests/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── favorites/        # Favorites page
│   ├── reminders/        # Reminders page
│   ├── page.js           # Home page
│   └── layout.js         # Root layout
├── components/           # Reusable components
│   ├── FilterPanel.js    # Filter panel component
│   ├── Navbar.js         # Navigation component
│   ├── ReminderModal.js  # Reminder modal component
│   └── UserCard.js       # User card component
├── lib/                  # Utility functions
│   └── mongodb.js        # MongoDB connection utility
├── models/               # Mongoose models
│   ├── User.js           # User model
│   ├── Favorite.js       # Favorite model
│   └── Reminder.js       # Reminder model
└── public/               # Static assets
```

## Deployment

This application can be deployed to platforms like Vercel, Netlify, or any other hosting service that supports Next.js applications.

## License

This project is licensed under the MIT License.
