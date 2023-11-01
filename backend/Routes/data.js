const express = require('express');
const Product = require('../Models/Product');
const Restaurant = require('../Models/Restaurant');
const route = express.Router();
const jwt = require('jsonwebtoken');

route.get('/fetchData', async (req, res) => {
    try {
        var data, totalResults;
        const { category, city, page, filter, sub_category, seller_Id } = req.query;
        if (seller_Id !== 'none') {
            data = await Product.find({ seller_Id: seller_Id });
            totalResults = await Product.countDocuments({ seller_Id: seller_Id });
        }
        else {

            if (filter === 'ascending') {
                if (sub_category !== 'none') {
                    data = await Product.find({
                        seller_City: { "$regex": city, "$options": "i" }, "$or": [
                            { "name": { "$regex": sub_category, "$options": "i" } },
                            { "sub_category": { "$regex": sub_category, "$options": "i" } },
                            { 'category': { "$regex": sub_category, "$options": "i" } }
                        ]
                    }).sort({ price: 1 }).skip((page - 1) * 10).limit(10)

                    totalResults = await Product.countDocuments({
                        seller_City: { "$regex": city, "$options": "i" }, "$or": [
                            { "name": { "$regex": sub_category, "$options": "i" } },
                            { "sub_category": { "$regex": sub_category, "$options": "i" } },
                            { 'category': { "$regex": sub_category, "$options": "i" } }
                        ]
                    });
                }

                else {
                    data = await Product.find({
                        category: category, seller_City: { "$regex": city, "$options": "i" },
                    }).sort({ price: 1 }).skip((page - 1) * 10).limit(10)

                    totalResults = await Product.countDocuments({
                        category: category, seller_City: { "$regex": city, "$options": "i" },
                    })
                }
            }
            else if (filter === 'descending') {
                if (sub_category !== 'none') {
                    data = await Product.find({
                        seller_City: { "$regex": city, "$options": "i" }, "$or": [
                            { "name": { "$regex": sub_category, "$options": "i" } },
                            { "sub_category": { "$regex": sub_category, "$options": "i" } },
                            { 'category': { "$regex": sub_category, "$options": "i" } }
                        ]
                    }).sort({ price: -1 }).skip((page - 1) * 10).limit(10);

                    totalResults = await Product.countDocuments({
                        seller_City: { "$regex": city, "$options": "i" }, "$or": [
                            { "name": { "$regex": sub_category, "$options": "i" } },
                            { "sub_category": { "$regex": sub_category, "$options": "i" } },
                            { 'category': { "$regex": sub_category, "$options": "i" } }
                        ]
                    });
                }

                else {
                    data = await Product.find({
                        category: category, seller_City: { "$regex": city, "$options": "i" },
                    }).sort({ price: -1 }).skip((page - 1) * 10).limit(10)

                    totalResults = await Product.countDocuments({
                        category: category, seller_City: { "$regex": city, "$options": "i" },
                    })
                }

            }

            else {
                if (sub_category !== 'none') {
                    data = await Product.find({
                        seller_City: { "$regex": city, "$options": "i" }, "$or": [
                            { "name": { "$regex": sub_category, "$options": "i" } },
                            { "sub_category": { "$regex": sub_category, "$options": "i" } },
                            { 'category': { "$regex": sub_category, "$options": "i" } }

                        ]
                    }).skip((page - 1) * 10).limit(10);

                    totalResults = await Product.countDocuments({
                        seller_City: { "$regex": city, "$options": "i" }, "$or": [
                            { "name": { "$regex": sub_category, "$options": "i" } },
                            { "sub_category": { "$regex": sub_category, "$options": "i" } },
                            { 'category': { "$regex": sub_category, "$options": "i" } }
                        ]
                    });
                }
                else {
                    data = await Product.find({
                        category: category, seller_City: { "$regex": city, "$options": "i" },
                    }).skip((page - 1) * 10).limit(10)

                    totalResults = await Product.countDocuments({
                        category: category, seller_City: { "$regex": city, "$options": "i" },
                    })
                }
            }
        }

        if (!data || data.length === 0) {
            return res.status(404).send({ err: "No product found" });
        }

        res.status(200).send({ totalResults, data });
    }
    catch (err) {
        res.status(400).send({ err: "Unexpected error occurred " + err.message });
    }
})

route.get('/fetchRestaurant', async (req, res) => {
    try {
        const { name, rating, city, page } = req.query;
        var data, totalResults;
        const regexCity = new RegExp(city, 'i');
        if (name === 'none') {
            if (rating === 'top') {
                data = await Restaurant.find({ city: regexCity }).sort({ rating: -1 }).limit(10);
                totalResults = await Restaurant.countDocuments({ city: regexCity }).sort({ rating: -1 }).limit(10);
            }
            else if (rating === 'more than 4') {
                data = await Restaurant.find({ city: regexCity, rating: { $gt: 4 } }).skip((page - 1) * 10).limit(10);
                totalResults = await Restaurant.countDocuments({ city: regexCity, rating: { $gt: 4 } });
            }
            else {
                data = await Restaurant.find({ city: regexCity }).skip((page - 1) * 10).limit(10);
                totalResults = await Restaurant.countDocuments({ city: regexCity });
            }
        }

        else {
            const regexName = new RegExp(name, 'i');
            if (rating === 'more than 4') {
                data = await Restaurant.find({ city: regexCity, name: regexName, rating: { $gt: 4 } }).skip((page - 1) * 10).limit(10);
                totalResults = await Restaurant.countDocuments({ city: regexCity, name: regexName, rating: { $gt: 4 } });
            }
            else {
                data = await Restaurant.find({ city: regexCity, name: regexName }).sort({ rating: -1 }).skip((page - 1) * 10).limit(10);
                totalResults = await Restaurant.countDocuments({ city: regexCity, name: regexName });
            }
        }

        if (!data || data.length === 0) {
            return res.status(404).send({ err: "No Restaurant found" });
        }

        res.status(200).send({ totalResults, data });
    }

    catch (err) {
        res.status(400).send({ error: "unexpected error occured" })
    }

})



module.exports = route;