# Planning

> A products app that performs CRUD operations on products

## User Stories

- [x] User can create a product
- [x] User can read a product
- [x] User can update a product
- [x] User can delete a product
- [x] User can view all products
- [x] User can search for a product
- [x] User can filter products by category
- [x] User can filter products by rating
- [x] User can filter products by availability
- [ ] JSON Web Tokens (JWT) for authentication
- [ ] Login and Register with hashing

## Models

### Product

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "rating": "number",
  "availability": "boolean",
  "dateAdded": "string",
  "dateUpdated": "string",
  "dateDeleted": "string"
}
```

### User

```json
{
  "id": "string",
  "username": "string",
  "password": "string"
}
```
