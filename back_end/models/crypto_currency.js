const mongoose = require('mongoose');
const schema = mongoose.Schema;
require('mongoose-double')(mongoose);

var schemaTypes = mongoose.Schema.Types;
 
const cryptoCurrencySchema = new schema({
    fullName: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
 
const CryptoCurrency = mongoose.model('crypto_currencies', cryptoCurrencySchema);

module.exports = CryptoCurrency;