# Overview
- The Portfolio Tracking System is a web-based application that enables users to manage and track their investment portfolios. 
- Developed using Node.js for server-side operations and PostgreSQL for database management

# Features
- Securities Management: Allows users to add, update, and delete securities in their portfolio.
- Trade Operations: Users can record buy and sell trades, with the system calculating average prices and quantities accordingly.
- Portfolio Visualization: Retrieves and displays the current state of the user's portfolio, including securities held, quantities, and average prices.
- Data Validation: Ensures data integrity with validations such as positive stock quantities and valid trade types.

# API Endpoints
Portfolio Management:
GET /portfolio: Fetches the current state of the user's portfolio.
POST /portfolio: Adds a new trade (buy/sell) to the portfolio and updates it accordingly.


# Usage Instructions
query existing/new company with {ticker_name,trade_type,total_cost,quantity}

## Usage Example
curl -X POST http://localhost:3000/api/v1/portfolio \
     -H 'Content-Type: application/json' \
     -d '{"ticker_symbol": "TCS", "type": "buy", "price": 1833.45, "quantity": 5}'

## Database Schema 
CREATE TABLE portfolio_trades (
    id SERIAL PRIMARY KEY,
    ticker_symbol VARCHAR(10) NOT NULL,
    average_price NUMERIC(10, 2) NOT NULL CHECK (average_price > 0),
    quantity INT NOT NULL CHECK (quantity >= 0)
);