let mongoose = require('mongoose');
const Inventory = require('./inventory') // 👈 thêm dòng này

let productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String
    },
    price: {
        type: Number,
        min: 0,
        default: 0
    },
    description: {
        type: String,
        default: true,
        maxLength: 999
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: true
    },
    images: {
        type: [String],
        default: [
            "https://placeimg.com/640/480/any"
        ]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})


// 🔥 THÊM PHẦN NÀY
productSchema.post('save', async function(doc) {
    try {

        const exists = await Inventory.findOne({ product: doc._id })

        if (!exists) {
            await Inventory.create({
                product: doc._id,
                stock: 0,
                reserved: 0,
                soldCount: 0
            })
        }

    } catch (error) {
        console.error("Create inventory error:", error.message)
    }
})

module.exports = mongoose.model('product', productSchema)