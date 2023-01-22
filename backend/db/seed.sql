--categories
INSERT INTO ecommerce.categories (category_name, description, image_url) VALUES ('Electronics', 'A category for all types of electronics', 'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fGlwaG9uZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60');
INSERT INTO ecommerce.categories (category_name, description, image_url) VALUES ('Electronics', 'A category for clothing and accessories', 'https://images.unsplash.com/photo-1546868871-0f936769675e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80');

--products
INSERT INTO ecommerce.products (description, imageurl, name, price, category_id) VALUES ('A new iPhone', 'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fGlwaG9uZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60', 'iPhone', 999.99, 1);
INSERT INTO ecommerce.products (description, imageurl, name, price, category_id) VALUES ('A new Ipad Pro', 'https://images.unsplash.com/photo-1546868871-0f936769675e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80', 'Ipad pro', 1999.99, 1);

--user_profile
INSERT INTO ecommerce.user_profile (email, first_name, last_name, username) VALUES ('user1@example.com', 'John', 'Doe', 'user1');
INSERT INTO ecommerce.user_profile (email, first_name, last_name, username) VALUES ('user2@example.com', 'Jane', 'Smith', 'user2');

--users
INSERT INTO ecommerce.users (email, first_name, last_name, password, role) VALUES ('user1@example.com', 'John', 'Doe', 'password1', 'user');
INSERT INTO ecommerce.users (email, first_name, last_name, password, role) VALUES ('user2@example.com', 'Jane', 'Smith', 'password2', 'admin');

--cart
INSERT INTO ecommerce.cart (created_date, product_id, quantity, user_id) VALUES (NOW(), 1, 2, 1);
INSERT INTO ecommerce.cart (created_date, product_id, quantity, user_id) VALUES (NOW(), 2, 1, 2);

--orderitems
INSERT INTO ecommerce.orderitems (created_date, order_id, price, product_id, quantity) VALUES (NOW(), 1, 99.99, 1, 2);
INSERT INTO ecommerce.orderitems (created_date, order_id, price, product_id, quantity) VALUES (NOW(), 2, 49.99, 2, 1);

--tokens
INSERT INTO ecommerce.tokens (created_date, token, user_id) VALUES (NOW(), 'token1', 1);
INSERT INTO ecommerce.tokens (created_date, token, user_id) VALUES (NOW(), 'token2', 2);



