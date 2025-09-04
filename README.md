# Tager

## Project Philosophy

Tager is designed as a platform that empowers local sellers and customers to connect through a seamless digital ecosystem. The project was built with the vision of helping sellers showcase their products directly from their homes, while enabling customers to find and purchase what they need in a simple and transparent way.

At its core, Tager emphasizes accessibility and reliability. By combining features such as customer and owner management, financial transactions, product listings, and rental systems, the platform creates a structured environment that reduces friction between sellers and buyers.

The philosophy behind Tager is rooted in efficiency and inclusivity. Customers can manage their profiles, track their purchases, and interact with sellers in real time, while owners have the ability to manage areas, rooms, and rentals. This balance between customer convenience and seller control ensures that both sides benefit equally.

Ultimately, Tager is not just about transactions—it is about building trust. Every module, from authentication to reporting, is aimed at making interactions smoother, safer, and more transparent. The platform grows with its users, reflecting the evolving needs of small businesses and individuals alike.

---

## How to Run the Project

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm i
   ```

Start the project:

npm start

Make sure to review the envHelper.txt file to correctly configure environment variables.

Important: Delete the package-lock.json file before running, as the project is optimized for Linux environments.

Frontend

The frontend part of the project is currently under construction and will be available soon.

#Project Routes

Customer Auth
POST http://192.168.1.138:8000/api/auth/register # Register
POST http://192.168.1.138:8000/api/auth/login # Login

Customer
PUT http://192.168.1.138:8000/api/customer/:id # Update Customer

Customer Profile
POST http://192.168.1.138:8000/api/customer/profile/add # Add Profile
GET http://192.168.1.138:8000/api/customer/profile # Get Profile
PUT http://192.168.1.138:8000/api/customer/profile/update # Update Profile
DELETE http://192.168.1.138:8000/api/customer/profile/delete # Delete Profile

Customer Avatar
PUT http://192.168.1.138:8000/api/customer/profile/image/upload # Upload Image
DELETE http://192.168.1.138:8000/api/customer/profile/image/delete # Delete Image

Money System
PUT http://192.168.1.138:8000/api/money/control/push # Push Money
PUT http://192.168.1.138:8000/api/money/control/update # Update Money

Buys
POST http://192.168.1.138:8000/api/buys/product # Buy Product
POST http://192.168.1.138:8000/api/buys/products # Buy Products

Sells
DELETE http://192.168.1.138:8000/api/sells/68b9c6a8bc216547e7e0a37d # Sell Product
POST http://192.168.1.138:8000/api/sells/count # Sell Products

Product
GET http://192.168.1.138:8000/api/product/route # Get Product
PUT http://192.168.1.138:8000/api/product/route/:id # Update Product
POST http://192.168.1.138:8000/api/product/route/search # Search Product

Delete Product
DELETE http://192.168.1.138:8000/api/delete_product/:id # Delete Product

Report
GET http://192.168.1.138:8000/api/report # Get Reports
DELETE http://192.168.1.138:8000/api/report/delete # Delete All Reports

Owner Auth
POST http://192.168.1.138:8000/api/owner/auth/register # Register
POST http://192.168.1.138:8000/api/owner/auth/login # Login

Owner
PUT http://192.168.1.138:8000/api/owner/update # Update Owner

Owner Profile
POST http://192.168.1.138:8000/api/owner/profile/add # Add Profile
GET http://192.168.1.138:8000/api/owner/profile # Get Profile
PUT http://192.168.1.138:8000/api/owner/profile/update # Update Profile
DELETE http://192.168.1.138:8000/api/owner/profile/delete # Delete Profile

Owner Avatar
PUT http://192.168.1.138:8000/api/owner/profile/image/upload # Upload Image
DELETE http://192.168.1.138:8000/api/owner/profile/image/delete # Delete Image

Area
POST http://192.168.1.138:8000/api/owner/area/create # Create Area
GET http://192.168.1.138:8000/api/owner/area?q # Get Area
PUT http://192.168.1.138:8000/api/owner/area/update/:id # Update Area
GET http://192.168.1.138:8000/api/owner/area/one/:id # Get One Area
PATCH http://192.168.1.138:8000/api/owner/area/delete/:id # Delete Area

Room
POST http://192.168.1.138:8000/api/room/create # Create Room
GET http://192.168.1.138:8000/api/room/owner/rooms # Get Rooms for Owner
GET http://192.168.1.138:8000/api/room/customer/rooms # Get Rooms for Customer
PUT http://192.168.1.138:8000/api/room/update/:id # Update Room
PATCH http://192.168.1.138:8000/api/room/delete/:id # Delete Room

Rental
POST http://192.168.1.138:8000/api/rental/sug-subscript # Add Rental from Customer
PATCH http://192.168.1.138:8000/api/rental/updateSubscription/:id # Update Rental from Customer
GET http://192.168.1.138:8000/api/rental # Get All Rentals
PATCH http://192.168.1.138:8000/api/rental/request/:id # Accept/Reject Rental
DELETE http://192.168.1.138:8000/api/rental/delete_subscription/:id # Delete Rental (Customer)
PATCH http://192.168.1.138:8000/api/rental/owner/delete/:id # Delete Rental (Owner)
GET http://192.168.1.138:8000/api/rental/request # Get All Requests (Owner)

Conclusion

Tager represents the combination of simplicity, transparency, and functionality. It is built to support both sellers and customers in a fair, structured, and scalable way. As the project evolves, new features and enhancements will continue to be added, ensuring it grows alongside the needs of its users.

Build with: Abdelghafar Nagy Ahmed – 04/09/2025
