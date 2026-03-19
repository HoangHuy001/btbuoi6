const express = require('express')
const router = express.Router()

const Inventory = require('../schemas/inventory')


// =============================
// 1️⃣ GET ALL INVENTORIES (JOIN)
// =============================
router.get('/', async (req, res) => {
  try {
    const inventories = await Inventory.find()
      .populate('product')

    res.json(inventories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// =============================
// 2️⃣ ADD STOCK
// =============================
router.post('/add-stock', async (req, res) => {
  try {
    const { product, quantity } = req.body

    if (!product || !quantity) {
      return res.status(400).json({ message: "Thiếu product hoặc quantity" })
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "quantity phải > 0" })
    }

    const inventory = await Inventory.findOne({ product })

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" })
    }

    inventory.stock += quantity
    await inventory.save()

    res.json({
      message: "Add stock thành công",
      data: inventory
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// =============================
// 3️⃣ REMOVE STOCK
// =============================
router.post('/remove-stock', async (req, res) => {
  try {
    const { product, quantity } = req.body

    if (!product || !quantity) {
      return res.status(400).json({ message: "Thiếu product hoặc quantity" })
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "quantity phải > 0" })
    }

    const inventory = await Inventory.findOne({ product })

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" })
    }

    if (inventory.stock < quantity) {
      return res.status(400).json({ message: "Không đủ hàng trong kho" })
    }

    inventory.stock -= quantity
    await inventory.save()

    res.json({
      message: "Remove stock thành công",
      data: inventory
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// =============================
// 4️⃣ RESERVATION (GIỮ HÀNG)
// =============================
router.post('/reservation', async (req, res) => {
  try {
    const { product, quantity } = req.body

    if (!product || !quantity) {
      return res.status(400).json({ message: "Thiếu product hoặc quantity" })
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "quantity phải > 0" })
    }

    const inventory = await Inventory.findOne({ product })

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" })
    }

    if (inventory.stock < quantity) {
      return res.status(400).json({ message: "Không đủ hàng để reserve" })
    }

    inventory.stock -= quantity
    inventory.reserved += quantity

    await inventory.save()

    res.json({
      message: "Reservation thành công",
      data: inventory
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// =============================
// 5️⃣ SOLD (BÁN HÀNG)
// =============================
router.post('/sold', async (req, res) => {
  try {
    const { product, quantity } = req.body

    if (!product || !quantity) {
      return res.status(400).json({ message: "Thiếu product hoặc quantity" })
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "quantity phải > 0" })
    }

    const inventory = await Inventory.findOne({ product })

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" })
    }

    // 🔥 kiểm tra đủ reserved
    if (inventory.reserved < quantity) {
      return res.status(400).json({
        message: "Không đủ hàng đã reserve để bán"
      })
    }

    // 🔥 logic chính
    inventory.reserved -= quantity
    inventory.soldCount += quantity

    await inventory.save()

    res.json({
      message: "Sold thành công",
      data: inventory
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// =============================
// 6️⃣ GET INVENTORY BY ID (JOIN)
// =============================
router.get('/:id', async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id)
      .populate('product')

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" })
    }

    res.json(inventory)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


module.exports = router