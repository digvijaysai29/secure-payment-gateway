// src/controllers/paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/transaction');
const TokenizationService = require('../services/tokenizationService');

class PaymentController {
    static async processPayment(req, res) {
        try {
            const { amount, cardNumber, expMonth, expYear, cvc } = req.body;

            // Create Stripe token
            const token = await stripe.tokens.create({
                card: {
                    number: cardNumber,
                    exp_month: expMonth,
                    exp_year: expYear,
                    cvc: cvc
                }
            });

            // Create charge
            const charge = await stripe.charges.create({
                amount: amount * 100, // Convert to cents
                currency: 'usd',
                source: token.id,
                description: 'Test charge'
            });

            // Create transaction record
            const transaction = new Transaction({
                transactionId: charge.id,
                amount: amount,
                status: charge.status === 'succeeded' ? 'completed' : 'failed',
                tokenizedCard: TokenizationService.tokenizeCard(cardNumber)
            });

            await transaction.save();

            res.json({
                success: true,
                transactionId: transaction.transactionId
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = PaymentController;