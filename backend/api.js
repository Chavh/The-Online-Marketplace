const express = require('express');
const cors = require('cors');
const router = express.Router();

const cartItems = [
    {
    "id": 0,
    "product": {
      "description": "vegetable and meat on bowel",
      "id": 0,
      "imageURL": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
      "name": "vegetable and meat on bowel",
      "price": 10
    },
    "quantity": 3
  },
  {
    "id": 1,
    "product": {
      "description": "baked pancakes",
      "id": 1,
      "imageURL": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80",
      "name": "baked pancakes",
      "price": 15
    },
    "quantity": 5
  },
];

router.get('/cart', (req, res) => {
    // check if cart is empty
    if (cartItems.length === 0) {
        res.status(404).json({ message: 'Cart is empty', success: false });
        return;
    }
    const totalCost = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    res.json({ cartItems, totalCost });
});

router.post('/cart/add', (req, res) => {
    // check if all required data are present
    if (!req.body.productId || !req.body.quantity) {
        res.status(400).json({ message: 'productId and quantity are required', success: false });
        return;
    }

    // check if productId exists in the products list
    const product = products.find(p => p.id === req.body.productId);
    if (!product) {
        res.status(404).json({ message: 'product not found', success: false });
        return;
    }

    // check if quantity is a number
    if (isNaN(req.body.quantity)) {
        res.status(400).json({ message: 'quantity must be a number', success: false });
        return;
    }

    // check if quantity is greater than 0
    if (req.body.quantity <= 0) {
        res.status(400).json({ message: 'quantity must be greater than 0', success: false });
        return;
    }
    const newItem = { id: cartItems.length, product: product, quantity: req.body.quantity };
    cartItems.push(newItem);
    res.json({ message: 'Item added to cart', success: true, timestamp: new Date().toISOString() });
});

router.delete('/cart/delete/:cartItemId', (req, res) => {
    // check if cartItemId is a number
    if (isNaN(req.params.cartItemId)) {
        res.status(400).json({ message: 'cartItemId must be a number', success: false });
        return;
    }
    const index = cartItems.findIndex(item => item.id === parseInt(req.params.cartItemId));
    if (index === -1) {
        res.status(404).json({ message: 'Item not found in cart', success: false });
    } else {
        cartItems.splice(index, 1);
        res.json({ message: 'Item removed from cart', success: true, timestamp: new Date().toISOString() });
    }
});

router.put('/cart/update/:cartItemId', (req, res) => {
    // check if cartItemId is a number
    if (isNaN(req.params.cartItemId)) {
        res.status(400).json({ message: 'cartItemId must be a number', success: false });
        return;
    }

    // check if all required data are present
    if (!req.body.productId || !req.body.quantity) {
        res.status(400).json({ message: 'productId and quantity are required', success: false });
        return;
    }

    // check if productId exists in the products list
    const product = products.find(p => p.id === req.body.productId);
    if (!product) {
        res.status(404).json({ message: 'product not found', success: false });
        return;
    }

    // check if quantity is a number
    if (isNaN(req.body.quantity)) {
        res.status(400).json({ message: 'quantity must be a number', success: false });
        return;
    }

    // check if quantity is greater than 0
    if (req.body.quantity <= 0) {
        res.status(400).json({ message: 'quantity must be greater than 0', success: false });
        return;
    }

    // check if item exists in the cart
    const index = cartItems.findIndex(item => item.id === parseInt(req.params.cartItemId));
    if (index === -1) {
        res.status(404).json({ message: 'Item not found in cart', success: false });
    } else {
        cartItems[index] = { id: parseInt(req.params.cartItemId), product: product, quantity: req.body.quantity };
        res.json({ message: 'Item updated in cart', success: true, timestamp: new Date().toISOString() });
    }
});

const categories = [{
    "categoryName": "food",
    "description": "vegetable and meat on bowel",
    "id": 0,
    "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    "products": [
      {
        "description": "vegetable and meat on bowel",
        "id": 0,
        "imageURL": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
        "name": "vegetable and meat on bowel",
        "price": 10
      }
    ]
  },
  {
  "categoryName": "food",
  "description": "baked pancakes",
  "id": 1,
  "imageUrl": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80",
  "products": [
    {
      "description": "baked pancakes",
      "id": 1,
      "imageURL": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80",
      "name": "baked pancakes",
      "price":15
    }
  ]
}
];

router.get('/category', (req, res) => {
    // check if categories are empty
    if (categories.length === 0) {
        res.status(404).json({ message: 'Categories are empty', success: false });
        return;
    }
    res.json(categories);
});

router.post('/category/add', (req, res) => {
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
    const newCategory = { categoryName: req.body.categoryName, description: req.body.description, id: categories.length, imageUrl: req.body.imageUrl, products: req.body.products };
    categories.push(newCategory);
    res.json({ message: 'Category created successfully', success: true, timestamp: new Date().toISOString() });
});

router.put('/category/update/:categoryId', (req, res) => {
    // check if categoryId is a number
    if (isNaN(req.params.categoryId)) {
        res.status(400).json({ message: 'categoryId must be a number', success: false });
        return;
    }

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

    // check if category exists
    const index = categories.findIndex(category =>
        category.id === parseInt(req.params.categoryId));
        if (index === -1) {
            res.status(404).json({ message: 'Category not found', success: false });
        } else {
            categories[index] = { categoryName: req.body.categoryName, description: req.body.description, id: parseInt(req.params.categoryId), imageUrl: req.body.imageUrl, products: req.body.products };
            res.json({ message: 'Category updated successfully', success: true, timestamp: new Date().toISOString() });
        }
    });
    
    const products = [
        {
            "categoryId": 0,
            "description": "vegetable and meat on bowel",
            "id": 0,
            "imageURL": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
            "name": "vegetable and meat on bowel",
            "price": 10
        },
        {
            "categoryId": 1,
            "description": "baked pancakes",
            "id": 1,
            "imageURL": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=480&q=80",
            "name": "baked pancakes",
            "price": 15
          },
          {
            "categoryId": 2,
            "description": "raspberry cake",
            "id": 2,
            "imageURL": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGZvb2R8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
            "name": "raspberry cake",
            "price": 7
          }
      ];

router.get('/product', (req, res) => {
    // check if products are empty
    if (products.length === 0) {
        res.status(404).json({ message: 'Products are empty', success: false });
        return;
    }
    res.json(products);
});

router.post('/product/add', (req, res) => {
    // check if all required data are present
    if (!req.body.categoryId || !req.body.description || !req.body.name || !req.body.imageURL || !req.body.price) {
        res.status(400).json({ message: 'categoryId, description, name, imageURL, price are required', success: false });
        return;
    }

    // check if categoryId exists in the categories list
    const category = categories.find(c => c.id === req.body.categoryId);
    if (!category) {
        res.status(404).json({ message: 'category not found', success: false });
        return;
    }

    // check if price is a number
    if (isNaN(req.body.price)) {
        res.status(400).json({ message: 'price must be a number', success: false });
        return;
    }

    // check if price is greater than 0
    if (req.body.price <= 0) {
        res.status(400).json({ message: 'price must be greater than 0', success: false });
        return;
    }

    const newProduct = { categoryId: req.body.categoryId, description: req.body.description, id: products.length, imageURL: req.body.imageURL, name: req.body.name, price: req.body.price };
    products.push(newProduct);
    res.json({ message: 'Product added successfully', success: true, timestamp: new Date().toISOString() });
});

router.put('/product/update/:productId', (req, res) => {
    // check if productId is a number
    if (isNaN(req.params.productId)) {
        res.status(400).json({ message: 'productId must be a number', success: false });
        return;
    }

    // check if all required data are present
    if (!req.body.categoryId ||
        !req.body.description || !req.body.name || !req.body.imageURL || !req.body.price) {
            res.status(400).json({ message: 'categoryId, description, name, imageURL, price are required', success: false });
            return;
        }
    
        // check if categoryId exists in the categories list
        const category = categories.find(c => c.id === req.body.categoryId);
        if (!category) {
            res.status(404).json({ message: 'category not found', success: false });
            return;
        }
    
        // check if price is a number
        if (isNaN(req.body.price)) {
            res.status(400).json({ message: 'price must be a number', success: false });
            return;
        }
    
        // check if price is greater than 0
        if (req.body.price <= 0) {
            res.status(400).json({ message: 'price must be greater than 0', success: false });
            return;
        }
    
        // check if product exists
        const index = products.findIndex(product => product.id === parseInt(req.params.productId));
        if (index === -1) {
            res.status(404).json({ message: 'Product not found', success: false });
        } else {
            products[index] = { categoryId: req.body.categoryId, description: req.body.description, id: parseInt(req.params.productId), imageURL: req.body.imageURL, name: req.body.name, price: req.body.price };
            res.json({ message: 'Product updated successfully', success: true, timestamp: new Date().toISOString() });
        }
    });
    

const app = express();
app.use(express.json());
app.use(cors());
app.use('/', router);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

