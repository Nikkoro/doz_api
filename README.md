# Requirements

.env

```
MONGO_URL=url
```

# To run the project, follow the steps below:

```
1. npm  run seed
2. npm run start
```

# Endpoints

### POST /price-lists

### Request

```json
{
  "price_list_data": [
    { "product_id": 4, "price": 10.1 },
    { "product_id": 1, "price": 20.2 }
  ]
}
```

### Response

```json
{
  "success": true,
  "message": "Price list updated successfully"
}
```

---

### GET /sales-reports

### Request

```
/sales-reports?start_date=2024-04-22&end_date=2024-04-29&category=Category X
```

### Response

```json
{
  "success": true,
  "sales_reports": [
    {
      "_id": "662c223e8a09a66952cb7c1f",
      "productId": 1,
      "productName": "Product A",
      "category": "Category X",
      "quantity": 3,
      "unitPrice": 10.99,
      "customerName": "John Doe",
      "transactionDate": "2024-04-26T21:53:02.587Z",
      "__v": 0
    },
    {
      "_id": "662c223e8a09a66952cb7c22",
      "productId": 4,
      "productName": "Product D",
      "category": "Category X",
      "quantity": 1,
      "unitPrice": 15.99,
      "customerName": "Bob Brown",
      "transactionDate": "2024-04-29T21:53:02.587Z",
      "__v": 0
    }
  ]
}
```
