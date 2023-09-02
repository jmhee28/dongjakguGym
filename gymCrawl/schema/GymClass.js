const { gymClass } = require('../config/TableNames');
const dynamoose = require("dynamoose");

const gymClassSchema = new dynamoose.Schema(
    {
        gym: {
            type: String,
            hashKey: true,
            // index: {
            //     name: "gymIndex",
            //     global: true,
            //     rangeKey: "createdAt"
            // },
        },
        id: {
            type: String,
            rangeKey: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        residue: {
            type: String,
        },
        time: {
            type: String,
        },
        price: {
            type: String,
        },
        target: {
            type: String,
        },
        className: {
            type: String,
        },
        url: {
            type:String
        }
    }
)
const gymClassModel = dynamoose.model( gymClass.TABLE_NAME , gymClassSchema, {
    throughput: "ON_DEMAND",
});



module.exports = { gymClassModel };