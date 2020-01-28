const validator = require('password-validator');
const { check, validationResult } = require('express-validator');

var schema = new validator();

schema.is().min(8);
schema.is().max(20);
schema.has().uppercase();
schema.has().lowercase();
schema.has().digits();
schema.has().not().spaces();
schema.has().symbols();

let validateBill = [
    check('vendor').exists().isString().trim().not().isEmpty(),
    check('categories').exists().isArray().not().isEmpty()
    .custom((value, {req}) => {
        for(let i=0;i<value.length;i++){
            value[i] = value[i].replace(/\s/g, ' ');
        }
        return value.length>1?(new Set(value.map(Function.prototype.call, String.prototype.trim))).size === value.length : true;
    }),
    check('amount_due').exists().isInt({min:5}).isDivisibleBy(5)
];

module.exports = {
    schema, 
    validateBill
};
