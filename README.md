# NestJS GraphQL Authentication API Test

A secure API built with NestJS, GraphQL, Prisma, and PostgreSQL (via Docker) that supports:

- User Registration
- Standard Email/Password Login
- Biometric Login (Simulated)
- JWT Authentication

---

## 🚀 Features

- 🔒 Hashed password storage using bcrypt
- �� Biometric authentication using a unique key
- 🛆 Prisma ORM with PostgreSQL
- 🔗 GraphQL API (Code-First with Apollo)
- 🐳 Dockerize PostgreSQL setup
- ✅ Unit-tested authentication logic

---

## 🧰 Prerequisites

Make sure you have the following installed:

- `Node.js`
- `npm`
- `Docker & Docker Compose`

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nkimajie/nest-graphql-project.git
cd nest-graphql-project
```

### 2. Install dependencies

```bash
npm install
```

---

### 3. Configure environment variables

Create a `.env` file at the root of the project:

```env
PORT=4101
DATABASE_URL=postgresql://nest:nestTest@localhost:5432/nestTest
JWT_SECRET=postgresqlTest
```

---

### 4. Set up the PostgreSQL database with Docker

```bash
docker-compose up -d

docker ps 
```

This will start a PostgreSQL container on `localhost:5432`.

> Username: `nest`  
> Password: `nestTest`  
> DB Name: `nestTest`

---

### 5. Set up Prisma

Generate Prisma client and run migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### 6. Start the development server

```bash
npm run start:dev
```

API will be available at:  
👉 `http://localhost:4101/graphql`

---

## 🥪 Testing

To run unit tests:

```bash
npm run test
```

---

## 🧠 GraphQL Example Queries

### ✅ Register

```graphql
mutation {
  register(data: {
    email: "test@example.com"
    password: "password123"
  })
}
```

### 🔐 Login

```graphql
mutation {
  login(data: {
    email: "test@example.com"
    password: "password123"
  })
}
```

### 🦬 Biometric Login

```graphql
mutation {
  biometricLogin(data: {
    biometricKey: "some-unique-biometric-id"
  })
}
```

---

## 📁 Project Structure

```
src/
│
├── auth/               # Auth module (resolvers, service, DTOs)
├── shared/             # Shared utilities (e.g., password hashing)
├── prisma/             # Prisma schema and generated client
├── app.module.ts       # Root module
├── app.resolver.ts     # Root resolver (for default query)
└── main.ts             # Entry point
```

---

## 📜 License

MIT — feel free to use, share, and modify.

