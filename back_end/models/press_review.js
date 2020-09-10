const mongoose = require('mongoose');
const schema = mongoose.Schema;
 
const pressReviewSchema = new schema({
    title: {
        type: String,
        required: false
    },
    summary: {
        type: String,
        required: false
    },
    source: {
        type: String,
        required: false
    },
    datePublication: {
        type: Date,
        required: false
    },
    urlOfImage: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});
 
const PressReview = mongoose.model('press_reviews', pressReviewSchema);

module.exports = PressReview;