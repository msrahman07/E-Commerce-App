# E-Commerce-App

This is a demo Ecommerce app implemented with ASP.Net Core 6 on the backend and Angular on Frontend. For database, PostgreSQL and for caching 
on the backend Redis are being used.

### Architecture and Design Patterns

The backend is developed following Clean Architecture, Repository pattern, Generic and Specification pattern maintaining SOLID principles.

### Features
  1. JWT Authentication is implemented on API using ASP.NET Identity
  2. For better performance and to lower database calls Caching has been implemented using Redis
  3. There is pagination on API to control load and data access
  4. Search and filtering for products functionality
  5. Exceptions and HTTP Error handling, validation on backend and User friend response on UI
  6. Multi-step checkout process
  7. Payment processing using Stripe