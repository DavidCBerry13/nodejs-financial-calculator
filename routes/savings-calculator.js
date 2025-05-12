var express = require('express');
var router = express.Router();
const limit = require("express-limit").limit;

const { body,validationResult } = require("express-validator");
const numeral = require('numeral');

/* GET savings calculator page. */
router.get(
    '/', 
    limit({
        max: 5, // 5 requests
        period: 60 * 1000, // per minute (60 seconds)
      }),    
    function(req, res, next) {
        var formData = {
            principal: 1000,
            monthlyDeposit: 100,
            interestRate: 3.0,
            years: 10
        }

        res.render('savings-calculator', { title: 'Savings Calculator', formData: formData });
    });


router.post(
    '/', 
    limit({
        max: 5, // 5 requests
        period: 60 * 1000, // per minute (60 seconds)
      }),
    
    [

        (req, res, next) => {
            if(typeof req.body.monthlyDeposit === 'undefined')
                req.body.monthlyDeposit=0.0;
            next();
        },

        // Validate and sanitize fields.
        body('principal', 'Principal amount not be empty.').trim().isLength({ min: 1 }),
        body('principal', 'Principal must be between $1 and $10,000,000.').isFloat({ min: 1.0, max: 10000000}),

        body('monthlyDeposit', 'Monthly deposits must $0.00 or greater.').if(body('monthlyDeposit').exists()).isFloat({ min: 0.0, max: 1000000}),

        body('interestRate', 'Interest rate must not be empty.').trim().isLength({ min: 1 }),
        body('interestRate', 'Interest rate must be between 0.1 and 20%.').isFloat({ min: 0.1, max: 20}),

        body('years', 'Years must not be empty.').trim().isLength({ min: 1 }),
        body('years', 'Years must be between 1 and 40.').isInt({ min: 1, max: 40}),

        (req, res, next) => {
            const errors = validationResult(req);

            // local variables to use in this method
            var principal = req.body.principal;
            var monthlyDeposit = req.body.monthlyDeposit;
            var interestRate = req.body.interestRate;

            // This is the data that was passed in
            var formData = {
                principal: parseFloat(req.body.principal),
                monthlyDeposit: parseFloat(req.body.monthlyDeposit),
                interestRate: parseFloat(req.body.interestRate),
                years: parseInt(req.body.years)
            }

            if(!errors.isEmpty()) {
                // There were errors, so retrun back the form data and errors so the user can fix things
                res.render('savings-calculator', { title: 'Savings Calculator', formData: formData, errors: errors.array() });
            }

            var yearlyData = [];
            var monthlyInterestRate = (interestRate / 100) / 12;
            var startingBalance = formData.principal;

            // Calculate the year by year data for the table
            for (let year = 1; year <= formData.years; year++) {            
                var principalTotal = formData.principal * (1 + monthlyInterestRate) ** (12*year)
                var depositsTotal = formData.monthlyDeposit * (((1 + monthlyInterestRate) ** (12*year) -1) / (monthlyInterestRate));

                var endingBalance = principalTotal + depositsTotal;
                var yearlyContributions = (12 * formData.monthlyDeposit);
                var yearlyInterest = endingBalance - yearlyContributions - startingBalance;

                var yearData = {
                    year: year,
                    startingBalance: numeral(startingBalance).format('$0,0.00'),
                    yearlyContributions: numeral(yearlyContributions).format('$0,0.00'),
                    interestEarned: numeral(yearlyInterest).format('$0,0.00'),
                    endingBalance: numeral(endingBalance).format('$0,0.00'),
                };

                yearlyData.push(yearData);
                startingBalance = endingBalance;
            }

            // Calcute the final data for the summary
            var principalTotal = formData.principal * (1 + monthlyInterestRate) ** (12*formData.years)
            var depositsTotal = formData.monthlyDeposit * (((1 + monthlyInterestRate) ** (12*formData.years) -1) / (monthlyInterestRate));
            var totalContributions = formData.monthlyDeposit * 12 * formData.years;

            var summaryData = {
                principal: numeral(formData.principal).format('$0,0.00'),
                monthlyDeposit: numeral(formData.monthlyDeposit).format('$0,0.00'),
                totalContributions: numeral(totalContributions).format('$0,0.00'),
                endingBalance: numeral(principalTotal + depositsTotal).format('$0,0.00'),
                interestEarned: numeral(principalTotal + depositsTotal - principal - totalContributions).format('$0,0.00'),
                interestRate: formData.interestRate,
                years: formData.years
            }

            var results = {
                summary: summaryData,
                yearlyData: yearlyData
            }

            res.render('savings-calculator', { title: 'Savings Calculator', formData: formData, results: results, errors: [] });
        }
    ]
);




module.exports = router;  