Dog Collection

This collection tests the Dog API endpoints:

Method Endpoint Description
POST /dogs Create a new dog
GET /dogs Retrieve all dogs
GET /dogs/:id Retrieve a single dog by ID
PUT /dogs/:id Update a dog by ID
PATCH /dogs/:id Update a dog partially by ID
DELETE /dogs/:id Delete a dog by ID
Dog Fields

name (string, required)

age (number, required)

size (string, required)

breed (string, required)

Tests

Status code validation (201 for POST, 200 for GET/PUT/PATCH, 204 for DELETE)

Response body validation

Required field checks

\_id existence for GET/PUT/DELETE tests

Food Collection

This collection tests the Food API endpoints:

Method Endpoint Description
POST /food Create a new food item
GET /food Retrieve all food items
GET /food/:id Retrieve a single food item by ID
PUT /food/:id Update a food item by ID
PATCH /food/:id Update partially by ID
DELETE /food/:id Delete a food item by ID
Food Fields

foodtype (string, required, must be "wet" or "dry")

flavor (string, required)

cost (number, required, between 1 and 60)

Tests

Status code validation

Response body validation

Field value validation (foodtype must be "wet" or "dry", cost within range)

\_id existence for chaining requests
