# 🏠 KriDZ — Location Immobilière en Algérie

**KriDZ** is a modern real estate rental platform designed specifically for the Algerian market.

The platform connects **tenants, property owners, and real estate agencies**, making it easier to discover, publish, and manage rental properties across Algeria.

> **Trouvez votre prochain chez-vous en Algérie. 🇩🇿**

---

## ✨ Features

### 👤 For Tenants

* 🔍 Search for rental properties
* 📍 Search by city and location
* 💰 Filter by rental price
* 🏠 Filter by property type
* 🛏️ Filter by bedrooms and bathrooms
* 🎓 Student accommodation
* 🪑 Furnished / unfurnished properties
* ❤️ Save favorite properties
* 📞 Contact property owners
* 📱 WhatsApp contact
* 📋 View detailed property information

### 🏢 For Owners & Agencies

* ➕ Publish properties
* 🖼️ Add property images
* ✏️ Edit listings
* 🗑️ Delete listings
* 🔄 Manage property availability
* 📊 Track listing performance
* 📩 Manage tenant inquiries
* 👤 Manage owner or agency profile

---

## 🏘️ Property Types

KriDZ supports different types of rental properties:

* Apartments
* Houses
* Villas
* Studios
* Duplexes
* Student accommodation
* Furnished apartments
* Residential properties

---

## 🇩🇿 Made for Algeria

KriDZ is designed around the needs of the Algerian rental market.

### Local Features

* 🇩🇿 Algerian cities and wilayas
* 💵 Prices in DZD
* 📱 Phone and WhatsApp contact
* 🎓 Student-friendly listings
* 🏠 Local property categories
* 🇫🇷 French-first interface
* 🇩🇿 Arabic-ready architecture
* 📱 Responsive mobile experience

---

## 🧭 User Flow

### Tenant

```text
Home
  ↓
Search Properties
  ↓
Property Details
  ↓
Sign Up / Sign In
  ↓
Tenant Dashboard
  ↓
Save / Contact Owner
```

### Owner / Agency

```text
Home
  ↓
List Your Property
  ↓
Sign Up
  ↓
Owner Dashboard
  ↓
Create Listing
  ↓
Manage Properties
  ↓
Manage Inquiries
```

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* CSS / Tailwind CSS

### Backend

* Next.js API
* Prisma ORM
* SQLite for development
* PostgreSQL-ready architecture

### Authentication

* Role-based authentication
* Tenant accounts
* Owner accounts
* Agency accounts

---

## 🗄️ Core Data Models

```text
User
 ├── Tenant
 ├── Owner
 └── Agency

Property
 ├── PropertyImage
 ├── Amenity
 ├── Favorite
 └── Inquiry
```

---

## 🎨 Design

KriDZ focuses on creating a **modern, trustworthy, and premium real-estate experience**.

### Design principles

* Clean and minimal UI
* Professional typography
* High-quality property images
* Clear property information
* Responsive design
* Mobile-first experience
* Intuitive navigation
* Smooth interactions
* Consistent design system

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/yourusername/kridz.git
```

### Install dependencies

```bash
cd kridz
npm install
```

### Configure environment variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
```

Add additional environment variables required by your authentication and storage configuration.

### Setup Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

### Run the development server

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

---

## 🔮 Future Improvements

* 🗺️ Interactive property map
* 🔎 Advanced search
* 💬 Real-time messaging
* 🔔 Notifications
* ⭐ Property reviews
* 🛡️ Owner verification
* 📄 Rental document management
* 📅 Availability calendar
* 🤖 AI-powered property recommendations
* 🌍 French / Arabic / English support
* 📱 Mobile application
* 📊 Advanced agency analytics

---

## 🎯 Vision

KriDZ aims to make property rental in Algeria **simpler, faster, and more accessible**.

The goal is to create one platform where users can:

**Search → Compare → Contact → Find a Home**

---

## 📌 Project Status

🚧 **In Development**

KriDZ is currently being developed as a full-stack real estate rental platform.

---

## 👨‍💻 Author

**Mehdi Koceir**

Full Stack Developer | SIR Student | AI & Automation Enthusiast

---

## 📄 License

This project is currently intended for educational and portfolio purposes.
