const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const User = require('../models/user');
const { requireAuth } = require("../middleware/auth");
const UserItem = require('../models/userItem');
const Bid = require("../models/bid")

router.get('/', requireAuth, async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        return res.json({
            status: 500,
            msg: "Failed to list items",
        });
    }
});

router.post('/add', requireAuth, async (req, res) => {
    try {
        const { name, description, startingPrice, endDate } = req.body;

        if (!name || !description || !startingPrice || !endDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newItem = new Item({
            name,
            description,
            startingPrice,
            endDate,
            seller: req.user._id
        });

        await newItem.save();

        await User.findByIdAndUpdate(req.user._id, { $push: { listedItems: newItem } });

        return res.json({
            status: 201,
            msg: "Item added for auction successfully",
            item: newItem
        });
    } catch (error) {
        return res.json({
            status: 500,
            msg: "Failed to add item for auction",
        });
    }
});

router.get('/:itemId', requireAuth, async (req, res) => {
    try {
        const item = await Item.findOne({ _id: req.params.itemId });
        if (!item) {
            return res.json({
                status: 404,
                msg: "Item not found",
            });
        }
        return res.json({
            status: 200,
            msg: "Success",
            item: item
        });
    } catch (error) {
        return res.json({
            status: 404,
            msg: "Failed to view item",
        });
    }
});


router.post('/bid/:id', requireAuth, async (req, res) => {
    try {
      const { bidAmount } = req.body;
      const itemId = req.params.id;
  
      const item = await Item.findOne({ _id: itemId });
      if (!item) {
        return res.json({ status: 404, msg: "Item not found" });
      }

      if (item.seller.toString() === req.user._id.toString()) {
        return res.json({ status: 400, msg: "The seller cannot bid on their own item" });
    }

    if(item.winningBidder.toString() == req.user._id.toString()){
        return res.json({ status: 400, msg: "You are the highest bidder" });
    }
  
      if (item.endDate < new Date()) {
        return res.json({ status: 400, msg: "Bidding for this item has ended" });
      }
  
      if (bidAmount <= item.highestBid) {
        return res.json({
          status: 400,
          msg: "Bid amount must be higher than current highest bid"
        });
      }
  
      const timeDifference = item.endDate - new Date();
      const minutesDifference = Math.floor(timeDifference / (1000 * 60));
      if (minutesDifference < 5) {
        item.endDate = new Date(item.endDate.getTime() + (5 * 60 * 1000));
      }
  
      item.highestBid = bidAmount;
      item.winningBidder = req.user._id;
      await item.save();
  
      const userItem = await UserItem.findOneAndUpdate(
        { seller: item.seller, itemId, name:item.name, description:item.description },
        {
          $push: {
            bids: {
              userId: req.user._id,
              bidAmount,
              bidPlacedAt: new Date()
            }
          }
        },
        { upsert: true, new: true }
      );
  
      if (!userItem) {
        console.error('Error creating UserItem document');
      }

      const newBid = new Bid({
        itemId: itemId,
        userId: req.user._id,
        bidAmount: bidAmount,
        bidPlacedAt: new Date()
    });
    await newBid.save();
  
      return res.json({ status: 200, msg: "Bid placed Successfully" });
    } catch (error) {
      console.error(error); // Log the error for debugging
      return res.json({ status: 500, msg: "Failed to place bid" });
    }
  });

router.get('/winner/:itemId', requireAuth, async (req, res) => {
    try {
        const itemId = req.params.itemId;
        let item = await Item.findOne({ _id: itemId });

        if (item.endDate > new Date()) {
            return res.json({
                status: 500,
                msg: "Auction for this item has not ended yet",
            });
        } else {
            if (!item) {
                return res.json({
                    status: 404,
                    msg: "Item not found",
                });
            }

            if (!item.winningBidder) {
                return res.json({
                    status: 400,
                    msg: "No winner found for this item",
                });
            }

            const winner = await User.findOne({ _id: item.winningBidder });
            if (!winner) {
                return res.json({
                    status: 404,
                    msg: "Winner not found",
                });
            }

            let finalWinner = winner.email ? winner.email : winner.mobileNumber

            return res.json({
                status: 200,
                msg: `Winner for the item auction is ${finalWinner}`,
            });
        }
    } catch (error) {
        return res.json({
            status: 500,
            msg: "Failed to fetch final winner",
        });
    }
});

module.exports = router;
