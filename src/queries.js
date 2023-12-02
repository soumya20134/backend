const getPortfolio = "SELECT * FROM portfolio_trades";
const checkTickerSymbolExists = "SELECT * FROM portfolio_trades WHERE ticker_symbol = $1";
const updatePortfolioEntry = 'UPDATE portfolio_trades SET average_price = $1, quantity = $2 WHERE ticker_symbol = $3';
const insertNewPortfolioEntry = 'INSERT INTO portfolio_trades (ticker_symbol, average_price, quantity) VALUES ($1, $2, $3)';
const deletePortfolioEntry = 'DELETE FROM portfolio_trades WHERE ticker_symbol = $1';

module.exports = {
    getPortfolio,
    checkTickerSymbolExists,
    updatePortfolioEntry,
    insertNewPortfolioEntry,
    deletePortfolioEntry
};