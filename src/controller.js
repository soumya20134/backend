const { error } = require('console');
const pool = require('../db');
const queries = require("./queries");


const getPortfolio = (req, res) => {
    pool.query(queries.getPortfolio, (error, results) => {
        if (error) {
            console.error('Error executing query', error.stack);
            return res.status(500).send('Error retrieving portfolio');
        }
        res.status(200).json(results.rows);
    });
};

const addPortfolio = (req,res) =>{
    const { ticker_symbol, type, price, quantity } = req.body;
    
    if (!ticker_symbol || !type || !price || !quantity) {
        return res.status(400).send('Missing required fields');
    }

    const priceNum = parseFloat(price);
    const quantityNum = parseInt(quantity, 10);

    if (isNaN(priceNum) || priceNum <= 0 || isNaN(quantityNum) || quantityNum <= 0) {
        return res.status(400).send('Invalid price or quantity');
    }

    // Check if ticker_symbol exists
    pool.query(queries.checkTickerSymbolExists,[ticker_symbol],(error,results)=>{
        if (error) {
            console.error('Error executing query', error.stack);
            return res.status(500).send('Error checking for ticker symbol');
        }

        if(results.rows.length){
            const currentEntry = results.rows[0];
            handleExistingTicker(ticker_symbol, type, priceNum, quantityNum, currentEntry, res);
        }

        else {
            // Ticker does not exist, insert new entry
            if (type !== 'buy') {
                return res.status(400).send('Can only add new ticker with a buy type');
            }

            pool.query(queries.insertNewPortfolioEntry, [ticker_symbol, priceNum / quantityNum, quantityNum], (insertError, insertResults) => {
                if (insertError) {
                    return res.status(500).send('Error inserting new portfolio entry');
                }
                res.status(200).send('New portfolio entry added');
            });
        }
    })

}

const handleExistingTicker = (ticker_symbol, type, priceNum, quantityNum, currentEntry, res) => {
    let newAveragePrice, newQuantity;
    if (type === 'buy') {
        newQuantity = currentEntry.quantity + quantityNum;
        newAveragePrice = ((parseFloat(currentEntry.average_price) * currentEntry.quantity) + priceNum) / newQuantity;
    } else if (type === 'sell') {
        if (quantityNum > currentEntry.quantity) {
            return res.status(400).send('Sell quantity exceeds the current holdings');
        }
        newQuantity = currentEntry.quantity - quantityNum;
        newAveragePrice = currentEntry.average_price;

        if (newQuantity === 0) {
            return deletePortfolioEntry(ticker_symbol, res);
        }
    } else {
        return res.status(400).send('Invalid trade type');
    }

    updatePortfolioEntry(ticker_symbol, newAveragePrice, newQuantity, res);
};

const updatePortfolioEntry = (ticker_symbol, newAveragePrice, newQuantity, res) => {
    pool.query(queries.updatePortfolioEntry, [newAveragePrice, newQuantity, ticker_symbol], (updateError, updateResults) => {
        if (updateError) {
            console.error('Error executing query', updateError.stack);
            return res.status(500).send('Error updating portfolio entry');
        }
        res.status(200).send('Portfolio entry updated');
    });
};

const deletePortfolioEntry = (ticker_symbol, res) => {
    pool.query(queries.deletePortfolioEntry, [ticker_symbol], (deleteError, deleteResults) => {
        if (deleteError) {
            console.error('Error executing query', deleteError.stack);
            return res.status(500).send('Error deleting portfolio entry');
        }
        res.status(200).send('Portfolio entry deleted');
    });
};

module.exports = {
    getPortfolio,
    addPortfolio,
};