var express = require('express');
var router = express.Router();
const limit = require("express-limit").limit;

const { body,validationResult } = require("express-validator");
const numeral = require('numeral');


/* GET loan calculator page. */
router.get(
    '/', 
    limit({
        max: 5, // 5 requests
        period: 60 * 1000, // per minute (60 seconds)
      }),    
    function(req, res, next) {
        var formData = {
            principal: 10000,        
            interestRate: 5.75,
            years: 5
        }

        res.render('loan-calculator', { title: 'Loan Calculator', formData: formData });
  });




  router.post(
    '/', 
    limit({
        max: 5, // 5 requests
        period: 60 * 1000, // per minute (60 seconds)
      }),     
    [
        // Validate and sanitize fields.
        body('principal', 'Principal amount not be empty.').trim().isLength({ min: 1 }),
        body('principal', 'Principal must be between $1 and $1,000,000.').isFloat({ min: 1.0, max: 1000000}),
        body('interestRate', 'Interest rate must not be empty.').trim().isLength({ min: 1 }),
        body('interestRate', 'Interest rate must be between 0.1 and 20%.').isFloat({ min: 0.1, max: 20}),
        body('years', 'Years must not be empty.').trim().isLength({ min: 1 }),
        body('years', 'Years must be between 1 and 40.').isInt({ min: 1, max: 40}),
    
        (req, res, next) => {
            const errors = validationResult(req);

            // local variables to use in this method
            var principal = parseFloat(req.body.principal);
            var interestRate = parseFloat(req.body.interestRate) / 100;  // Interest comes in as Percent - we need decimal value
            var years = parseInt(req.body.years);

            // This is the data that was passed in
            var formData = {
                principal: req.body.principal,
                interestRate: req.body.interestRate,
                years: req.body.years
            }

            if(!errors.isEmpty()) {
                // There were errors, so retrun back the form data and errors so the user can fix things
                res.render('loan-calculator', { title: 'Loan Calculator', formData: formData, errors: errors.array() });
            }

            var paymentsPerYear = 12;

            var numerator = (interestRate * principal);
            var denominator = paymentsPerYear * (1 - ((1 + interestRate / paymentsPerYear) ** -(paymentsPerYear * years)))
        
            var monthlyPayment = numerator / denominator;
            var totalPayments = monthlyPayment * years * paymentsPerYear;
            var totalInterest = totalPayments - principal;

            var summaryData = {
                principal: numeral(formData.principal).format('$0,0.00'),
                interestRate: formData.interestRate,
                years: formData.years,

                monthlyPayment: numeral(monthlyPayment).format('$0,0.00'),
                totalPayments: numeral(totalPayments).format('$0,0.00'),
                totalInterest: numeral(totalInterest).format('$0,0.00'),
            }

            var results = {
                summary: summaryData,
            }

            res.render('loan-calculator', { title: 'Loan Calculator', formData: formData, results: results, errors: [] });
        }      
    ]
);





module.exports = router;  