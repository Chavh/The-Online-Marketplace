const express = require('express');
const cors = require('cors');
const router = express.Router();
const { Pool } = require('pg');
const logger = require('morgan');
const helmet = require('helmet');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

router.use(logger('combined'));
router.use(helmet());


//cart
router.get('/cart', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Get cart items and products information
        const cartItemsResult = await client.query(
            `SELECT ci.id as cart_item_id, ci.quantity, p.id as product_id, p.name, p.description, p.imageURL, p.price
            FROM cart_items ci
            INNER JOIN products p ON ci.product_id = p.id`
        );
        const cartItems = cartItemsResult.rows;

        // Check if cart is empty
        if (cartItems.length === 0) {
            res.status(404).json({ message: 'Cart is empty', success: false });
            return;
        }

        // Calculate total cost of cart items
        const totalCost = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Send response with cart items and total cost
        res.json({ cartItems, totalCost });

        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving cart items', success: false });
    }
});

router.post('/cart/add', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Check if productId and quantity are present in request body
        if (!req.body.productId || !req.body.quantity) {
            res.status(400).json({ message: 'productId and quantity are required', success: false });
            return;
        }

        // Check if productId exists in the products table
        const productResult = await client.query('SELECT * FROM products WHERE id = $1', [req.body.productId]);
        const product = productResult.rows[0];
        if (!product) {
            res.status(404).json({ message: 'product not found', success: false });
            return;
        }

        // Check if quantity is a number
        if (isNaN(req.body.quantity)) {
            res.status(400).json({ message: 'quantity must be a number', success: false });
            return;
        }

        // Check if quantity is greater than 0
        if (req.body.quantity <= 0) {
            res.status(400).json({ message: 'quantity must be greater than 0', success: false });
            return;
        }

        // Insert new item into cart_items table
        await client.query('INSERT INTO cart_items (product_id, quantity, product_price) VALUES ($1, $2, $3)', [req.body.productId, req.body.quantity, product.price]);

        // Send response with success message and timestamp
        res.json({ message: 'Item added to cart', success: true, timestamp: new Date().toISOString() });

        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding item to cart', success: false });
    }
});

router.delete('/cart/delete/:cartItemId', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Check if cartItemId is a number
        if (isNaN(req.params.cartItemId)) {
            res.status(400).json({ message: 'cartItemId must be a number', success: false });
            return;
        }

        // Check if item exists in cart_items table
        const itemResult = await client.query('SELECT * FROM cart_items WHERE id = $1', [req.params.cartItemId]);
        const item = itemResult.rows[0];
        if (!item) {
            res.status(404).json({ message: 'Item not found in cart', success: false });
            return;
        }

        // Delete item from cart_items table
        await client.query('DELETE FROM cart_items WHERE id = $1', [req.params.cartItemId]);

        // Send response with success message and timestamp
        res.json({ message: 'Item removed from cart', success: true, timestamp: new Date().toISOString() });

        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting item from cart', success: false });
    }
});

router.put('/cart/update/:cartItemId', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Check if cartItemId is a number
        if (isNaN(req.params.cartItemId)) {
            res.status(400).json({ message: 'cartItemId must be a number', success: false });
            return;
        }

        // Check if all required data (productId and quantity) are present in request body
        if (!req.body.productId || !req.body.quantity) {
            res.status(400).json({ message: 'productId and quantity are required', success: false });
            return;
        }

        // Check if productId exists in the products table
        const productResult = await client.query('SELECT * FROM products WHERE id = $1', [req.body.productId]);
        const product = productResult.rows[0];
        if (!product) {
            res.status(404).json({ message: 'product not found', success: false });
            return;
        }

        // Check if quantity is a number
        if (isNaN(req.body.quantity)) {
            res.status(400).json({ message: 'quantity must be a number', success: false });
            return;
        }

        // Check if quantity is greater than 0
        if (req.body.quantity <= 0) {
            res.status(400).json({ message: 'quantity must be greater than 0', success: false });
            return;
        }

        // Check if item exists in the cart_items table
        const itemResult = await client.query('SELECT * FROM cart_items WHERE id = $1', [req.params.cartItemId]);
        const item = itemResult.rows[0];
        if (!item) {
            res.status(404).json({ message: 'Item not found in cart', success: false });
        } else {
            // Update item in cart_items table
            await client.query('UPDATE cart_items SET product_id = $1, quantity = $2, product_price = $3 WHERE id = $4', [req.body.productId, req.body.quantity, product.price, req.params.cartItemId]);

            // Send response with success message and timestamp
            res.json({ message: 'Item updated in cart', success: true, timestamp: new Date().toISOString() });
        }
        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating item in cart', success: false });
    }
});

//category
router.get('/category', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Use JOIN to get categories and their corresponding products
        const result = await client.query(`SELECT c.id, c.category_name, c.description, c.image_url,
                                            p.id as product_id, p.name, p.price, p.imageurl, p.description as product_description 
                                            FROM categories c JOIN products p ON c.id = p.category_id`);
        // Check if there are any categories
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Categories are empty', success: false });
            return;
        }
        // Create an object with the categories and their corresponding products
        const categories = {};
        result.rows.forEach(row => {
            if (!categories[row.id]) {
                categories[row.id] = {
                    id: row.id,
                    categoryName: row.category_name,
                    description: row.description,
                    imageUrl: row.image_url,
                    products: []
                }
            }
            categories[row.id].products.push({
                id: row.product_id,
                name: row.name,
                price: row.price,
                imageURL: row.imageurl,
                description: row.product_description
            });
        });
        // Send response with the object containing categories and their products
        res.json(Object.values(categories));
        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

router.post('/category/create', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Begin a transaction
        await client.query('BEGIN');
        // Insert the new category into the categories table
        const categoryResult = await client.query(`INSERT INTO categories (category_name, description, image_url) VALUES ($1, $2, $3) RETURNING id`, [req.body.categoryName, req.body.description, req.body.imageUrl]);
        // Get the id of the inserted category
        const categoryId = categoryResult.rows[0].id;
        // Insert the products for the new category into the products table
        const products = req.body.products;
        const productPromises = products.map(async product => {
            await client.query(`INSERT INTO products (name, description, imageurl, price, category_id) 
                        VALUES ($1, $2, $3, $4, $5)`, [product.name, product.description, product.imageURL, product.price, categoryId]);
        });
        await Promise.all(productPromises);
        // Commit the transaction
        await client.query('COMMIT');
        // Send success response
        res.json({ message: 'Category and products added successfully', success: true, timestamp: new Date() });
        // Release the client
        client.release();
    } catch (err) {
        // Rollback the transaction if there's an error
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

router.post('/category/update/:categoryId', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Begin a transaction
        await client.query('BEGIN');
        // Update the category in the categories table
        await client.query(`UPDATE categories SET category_name = $1, description = $2, image_url = $3 WHERE id = $4`, [req.body.categoryName, req.body.description, req.body.imageUrl, req.params.categoryId]);
        // Delete existing products for the category from the products table
        await client.query(`DELETE FROM products WHERE category_id = $1`, [req.params.categoryId]);
        // Insert the new products for the category into the products table
        const products = req.body.products;
        const productPromises = products.map(async product => {
            await client.query(`INSERT INTO products (name, description, imageurl, price, category_id) VALUES ($1, $2, $3, $4, $5)`, [product.name, product.description, product.imageURL, product.price, req.params.categoryId]);
        });
        await Promise.all(productPromises);
        // Commit the transaction
        await client.query('COMMIT');
        // Send success response
        res.json({ message: 'Category and products updated successfully', success: true, timestamp: new Date() });
        // Release the client
        client.release();
    } catch (err) {
        // Rollback the transaction if there's an error
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

//additional category endpoints
router.post('/category/add', cors(), async (req, res) => {
    // check if all required data are present
    if (!req.body.categoryName || !req.body.description) {
        res.status(400).json({ message: 'categoryName and description are required', success: false });
        return;
    }

    // check if products are present
    if (!req.body.products) {
        res.status(400).json({ message: 'products is required', success: false });
        return;
    }

    // check if products are valid
    for (let i = 0; i < req.body.products.length; i++) {
        if (!req.body.products[i].id || !req.body.products[i].name || !req.body.products[i].description || !req.body.products[i].imageURL || !req.body.products[i].price) {
            res.status(400).json({ message: 'products are not valid', success: false });
            return;
        }
    }
    try {
        const result = await pool.query(
            'INSERT INTO categories (category_name, description, image_url, products) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.body.categoryName, req.body.description, req.body.imageUrl, req.body.products]
        );
        res.json({ message: 'Category created successfully', success: true, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

router.delete('/category/delete/:categoryId', cors(), async (req, res) => {
    // check if categoryId is a number
    if (isNaN(req.params.categoryId)) {
        res.status(400).json({ message: 'categoryId must be a number', success: false });
        return;
    }
    try {
        const result = await pool.query(
            'DELETE FROM categories WHERE id = $1 RETURNING *',
            [req.params.categoryId]
        );
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Category not found', success: false });
            return;
        }
        res.json({ message: 'Category deleted successfully', success: true, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

router.get('/category/:categoryId', cors(), async (req, res) => {
    // check if categoryId is a number
    if (isNaN(req.params.categoryId)) {
        res.status(400).json({ message: 'categoryId must be a number', success: false });
        return;
    }
    try {
        const result = await pool.query(
            'SELECT * FROM categories WHERE id = $1',
            [req.params.categoryId]
        );
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Category not found', success: false });
            return;
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

router.get('/category/:categoryId/products', cors(), async (req, res) => {
    // check if categoryId is a number
    if (isNaN(req.params.categoryId)) {
        res.status(400).json({ message: 'categoryId must be a number', success: false });
        return;
    }
    try {
        const result = await pool.query(
            'SELECT products FROM categories WHERE id = $1',
            [req.params.categoryId]
        );
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Category not found', success: false });
            return;
        }
        res.json(result.rows[0].products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

//product
router.get('/product', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Use JOIN to get products and their corresponding category
        const result = await client.query(`SELECT p.id, p.name, p.description, p.imageurl, p.price, c.id as category_id, c.category_name 
                                        FROM products p JOIN categories c ON p.category_id = c.id`);
        // Check if there are any products
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Products are empty', success: false });
            return;
        }
        // Create an array of products with their corresponding category
        const products = result.rows.map(row => {
            return {
                id: row.id,
                name: row.name,
                description: row.description,
                imageURL: row.imageurl,
                price: row.price,
                categoryId: row.category_id,
                categoryName: row.category_name
            }
        });
        // Send response with products and their corresponding category
        res.json(products);
        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});


router.post('/product/add', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Insert the new product into the products table
        await client.query(`INSERT INTO products (name, description, imageurl, price, category_id) VALUES ($1, $2, $3, $4, $5)`, [req.body.name, req.body.description, req.body.imageURL, req.body.price, req.body.categoryId]);
        // Send success response
        res.json({ message: 'Product added successfully', success: true, timestamp: new Date() });
        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

router.post('/product/update/:productId', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Update the product in the products table
        await client.query(`UPDATE products SET name = $1, description = $2, imageurl = $3, price = $4, category_id = $5 WHERE id = $6`, [req.body.name, req.body.description, req.body.imageURL, req.body.price, req.body.categoryId, req.params.productId]);
        // Send success response
        res.json({ message: 'Product updated successfully', success: true, timestamp: new Date() });
        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

//user
router.get('/user/all', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Get all users from the users table
        const result = await client.query('SELECT id, email, first_name as "firstName", last_name as "lastName", password, role FROM users');
        // Check if there are any users
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Users are empty', success: false });
            return;
        }
        // Send response with users
        res.json(result.rows);
        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

router.post('/user/signUp', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Check if email already exists
        const emailCheck = await client.query('SELECT email FROM users WHERE email = $1', [req.body.email]);
        if (emailCheck.rowCount > 0) {
            res.status(409).json({ message: 'Email already exists', status: 'failed' });
            return;
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // Insert the new user into the users table
        await client.query(`INSERT INTO users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4)`, [req.body.email, req.body.firstName, req.body.lastName, hashedPassword]);
        // Send success response
        res.json({ message: 'User registered successfully', status: 'success' });
        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', status: 'failed' });
    }
});

router.post('/user/signIn', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Check if email exists
        const emailCheck = await client.query('SELECT id, password FROM users WHERE email = $1', [req.body.email]);
        if (emailCheck.rowCount === 0) {
            res.status(404).json({ status: 'failed', message: 'Email not found' });
            return;
        }
        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(req.body.password, emailCheck.rows[0].password);
        if (!isMatch) {
            res.status(401).json({ status: 'failed', message: 'Incorrect password' });
            return;
        }
        // Create a new token
        const token = jwt.sign({ id: emailCheck.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        // Insert the new token into the tokens table
        await client.query(`INSERT INTO tokens (token, user_id) VALUES ($1, $2)`, [token, emailCheck.rows[0].id]);
        // Send success response
        res.json({ status: 'success', token });
        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'failed', message: 'Internal server error' });
    }
});

//wishlist
router.get('/wishlist/:token', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Get the user id associated with the token
        const tokenCheck = await client.query('SELECT user_id FROM tokens WHERE token = $1', [req.params.token]);
        if (tokenCheck.rowCount === 0) {
            res.status(404).json({ message: 'Invalid token', success: false });
            return;
        }
        // Get the products from the wishlist table for the user
        const result = await client.query(`SELECT products.id, products.name, products.description, products.imageurl, products.price, products.category_id as "categoryId" 
                                        FROM wishlist JOIN products ON products.id = wishlist.product_id WHERE wishlist.user_id = $1`, [tokenCheck.rows[0].user_id]);
        // Check if there are any products in the wishlist
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Wishlist is empty', success: false });
            return;
        }
        // Send response with products
        res.json(result.rows);
        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

router.post('/wishlist/add', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Get the user id associated with the token
        const tokenCheck = await client.query('SELECT user_id FROM tokens WHERE token = $1', [req.headers.authorization]);
        if (tokenCheck.rowCount === 0) {
            res.status(404).json({ message: 'Invalid token', success: false });
            return;
        }
        // Check if the product already exists in the wishlist
        const productCheck = await client.query('SELECT * FROM wishlist WHERE product_id = $1 AND user_id = $2', [req.body.id, tokenCheck.rows[0].user_id]);
        if (productCheck.rowCount > 0) {
            res.status(409).json({ message: 'Product already exists in wishlist', success: false });
            return;
        }
        // Insert the product into the wishlist table
        await client.query('INSERT INTO wishlist (created_date, product_id, user_id) VALUES ($1, $2, $3)', [new Date(), req.body.id, tokenCheck.rows[0].user_id]);
        // Send success response
        res.json({ message: 'Product added to wishlist', success: true, timestamp: new Date() });
        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

router.delete('/wishlist/:productId', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Get the user id associated with the token
        const tokenCheck = await client.query('SELECT user_id FROM tokens WHERE token = $1', [req.headers.authorization]);
        if (tokenCheck.rowCount === 0) {
            res.status(404).json({ message: 'Invalid token', success: false });
            return;
        }
        // Delete the product from the wishlist
        await client.query('DELETE FROM wishlist WHERE product_id = $1 AND user_id = $2', [req.params.productId, tokenCheck.rows[0].user_id]);
        // Send success response
        res.json({ message: 'Product removed from wishlist', success: true });
        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

//orders
router.get('/order', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Get all orders from the order table
        const ordersResult = await client.query('SELECT * FROM orders');
        // Check if there are any orders
        if (ordersResult.rowCount === 0) {
            res.status(404).json({ message: 'Orders are empty', success: false });
            return;
        }

        // Get order items for each order
        const orders = ordersResult.rows;
        for (const order of orders) {
            const orderItemsResult = await client.query('SELECT * FROM orderitems WHERE order_id = $1', [order.id]);
            // Get product details for each order item
            for (const orderItem of orderItemsResult.rows) {
                const productResult = await client.query('SELECT * FROM products WHERE id = $1', [orderItem.product_id]);
                orderItem.product = productResult.rows[0];
            }
            order.orderItems = orderItemsResult.rows;
        }

        // Send response with orders and their order items
        res.json(orders);

        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});
router.get('/order', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Get all orders from the order table
        const ordersResult = await client.query('SELECT * FROM orders');

        // Check if there are any orders
        if (ordersResult.rowCount === 0) {
            res.status(404).json({ message: 'Orders are empty', success: false });
            return;
        }

        // Get order items for each order
        const orders = ordersResult.rows;
        for (const order of orders) {
            const orderItemsResult = await client.query('SELECT * FROM orderitems WHERE order_id = $1', [order.id]);
            // Get product details for each order item
            for (const orderItem of orderItemsResult.rows) {
                const productResult = await client.query('SELECT * FROM products WHERE id = $1', [orderItem.product_id]);
                orderItem.product = productResult.rows[0];
            }
            order.orderItems = orderItemsResult.rows;
        }

        // Send response with orders and their order items
        res.json(orders);

        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

router.get('/order/:id', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Get the order from the order table
        const orderResult = await client.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
        // Check if the order exists
        if (orderResult.rowCount === 0) {
            res.status(404).json({ message: 'Order not found', success: false });
            return;
        }

        // Get order items for the order
        const order = orderResult.rows[0];
        const orderItemsResult = await client.query('SELECT * FROM orderitems WHERE order_id = $1', [order.id]);
        // Get product details for each order item
        for (const orderItem of orderItemsResult.rows) {
            const productResult = await client.query('SELECT * FROM products WHERE id = $1', [orderItem.product_id]);
            orderItem.product = productResult.rows[0];
        }
        order.orderItems = orderItemsResult.rows;

        // Send response with the order and its order items
        res.json(order);

        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

router.post('/order/add', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Begin a transaction
        await client.query('BEGIN');

        // Insert order into orders table
        const orderInsertResult = await client.query(
            'INSERT INTO orders (session_id, total_price) VALUES ($1, $2) RETURNING id',
            [req.body.sessionId, req.body.totalPrice]
        );
        const orderId = orderInsertResult.rows[0].id;
        // Insert order items into orderitems table
        for (const orderItem of req.body.orderItems) {
            await client.query(
                'INSERT INTO orderitems (created_date, order_id, price, product_id, quantity) VALUES ($1, $2, $3, $4, $5)',
                [new Date(), orderId, orderItem.price, orderItem.productId, orderItem.quantity]
            );
        }

        // Commit the transaction
        await client.query('COMMIT');

        // Send response with success message and timestamp
        res.json({
            message: 'Order placed successfully',
            success: true,
            timestamp: new Date()
        });

        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        // Rollback the transaction on error
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

router.post('/order/create-checkout-session', cors(), async (req, res) => {
    try {
        // Connect to the database
        const client = await pool.connect();
        // Create a new checkout session
        const sessionResult = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.map(item => {
                return {
                    name: item.productName,
                    amount: item.price * 100, // convert to cents
                    currency: 'usd',
                    quantity: item.quantity
                };
            }),
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel'
        });

        // Insert session into the database
        await client.query(
            'INSERT INTO checkout_sessions (session_id, user_id) VALUES ($1, $2)',
            [sessionResult.id, req.body.userId]
        );

        // Send response with session id
        res.json({ sessionId: sessionResult.id });

        // Release the client
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

module.exports = router;

