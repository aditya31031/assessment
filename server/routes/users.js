const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const User = require('../models/User');

const os = require('os');

const upload = multer({ dest: os.tmpdir() });


router.post('/import', upload.single('file'), (req, res) => {
    console.log('Received POST /users/import request');
    if (!req.file) {
        console.log('No file in request');
        return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log('File received:', req.file.path);

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))

        .on('end', async () => {
            try {
                await User.insertMany(results);
                // Clean up the uploaded file
                fs.unlinkSync(req.file.path);
                res.json({ message: 'Users imported successfully', count: results.length });
            } catch (error) {
                res.status(500).json({ error: 'Error inserting users', details: error.message });
            }
        });
});


router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const sortBy = req.query.sortBy || '';
        const order = (req.query.order || 'asc').trim();

        const skip = (page - 1) * limit;

        let query = {};
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { first_name: searchRegex },
                { last_name: searchRegex },
                { company_name: searchRegex },
                { email: searchRegex },
                { city: searchRegex },
                { state: searchRegex },
                { "First Name": searchRegex },
                { "Last Name": searchRegex },
                { "Company Name": searchRegex },
                { "Email": searchRegex },
                { "City": searchRegex },
                { "State": searchRegex },
                { "Job Title": searchRegex },
                { "Phone": searchRegex },
                { "Hero Name": searchRegex },
                { "Super Power": searchRegex },
                { "Affiliation": searchRegex }
            ];
        }


        let sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = (order === 'desc') ? -1 : 1;
        } else {
            sortOptions = { _id: (order === 'desc') ? -1 : 1 };
        }

        console.log('DEBUG SORT:', {
            receivedSortBy: sortBy,
            receivedOrder: order,
            constructedSortOptions: sortOptions
        });

        const users = await User.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments(query);

        res.json({
            users,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users', details: error.message });
    }
});


router.delete('/', async (req, res) => {
    try {
        await User.deleteMany({});
        res.json({ message: 'All users deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting users', details: error.message });
    }
});

module.exports = router;
