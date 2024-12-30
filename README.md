# **EBookStore**

A web-based platform for purchasing and reading e-books online. This project is built using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js) with **Tailwind CSS** and **Ant Design** for styling.

---

## **Features**

### **Admin Module**
- Login functionality for secure access.
- Manage books: Add, edit, delete, and view book details.
- Manage categories: Add, update, delete, and view category lists.
- User management: View a list of all registered users.
- Transaction reports: View payment and purchase details.
- Dashboard: Summary of total users, books, categories, and earnings.

### **User Module**
- User authentication: Sign up and login functionalities.
- Explore books: Browse and search books categorized by genre.
- Wishlist: Add or remove books from the wishlist.
- Cart: Add books to the cart, view cart items, and remove books from the cart.
- Checkout: Purchase books added to the cart.
- Profile management: Update user details and view purchase history.
- Read e-books: Integrated PDF reader to read purchased books (downloading is disabled).

---

## **Tech Stack**

- **Frontend**: React.js, Tailwind CSS, Ant Design
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

---

## **Setup Instructions**

### Prerequisites
Ensure you have the following installed:
- Node.js
- MongoDB
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Nikulsuthar2/EBookStoreMern
   cd EBookStoreMern
   ```
2. Install dependencies for both Frontend and Backend:
    ```bash
    cd Frontend
    npm install
    cd ../backend
    npm install
    ```
3. Set up the environment variables:
- Create a `.env` file in the Backend directory with the following
    ```env
    PORT=your_custom_port
    MONGO_URL=your_mongodb_url
    ORIGIN=frontend_baseurl
    ACCESS_TOKEN_SECRET=your_jwt_access_token
    REFRESH_TOKEN_SECRET=your_jwt_refresh_token
    ```
- Create a `.env` file in the Frontend directory with the following
    ```env
    VITE_BACKEND_URL=your_backend_base_url
    ```
4. Create this folder in Backend Directory
    ```bash
    ├── ...
    ├── uploads   
    │   ├── pdfbooks 
    │   └── thumbnails        
    └── ...
    ```
5. Start the development servers:
- For the client:
    ```bash
    cd Frontend
    npm start
    ```
- For the server:
    ```bash
    cd Backend
    npm run dev
    ```
---

## **Usage**

1. **Admin**
   - Login to manage books, categories, users, and transactions.
   - Use the dashboard to view an overview of platform activities.

2. **User**
   - Sign up or login to browse and purchase e-books.
   - Use the integrated PDF reader for an enhanced reading experience.

---

## **Limitations**

- The project does not include a payment gateway integration; purchases are simulated.
- Features like user reviews and book ratings are not implemented.

---

## **Future Enhancements**

- Integrate a secure payment gateway (e.g., Stripe or PayPal).
- Add advanced search and filter options.
- Include book reviews and ratings.
- Develop a mobile app version for better accessibility.

---

## **Contributors**

- [Nikul Suthar](https://github.com/Nikulsuthar2)
- [Aakash Saini](https://github.com/Aakashsaini177)
