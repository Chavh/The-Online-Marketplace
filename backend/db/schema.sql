CREATE SCHEMA IF NOT EXISTS ecommerce;


CREATE TABLE ecommerce.categories (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(255),
    description VARCHAR(255),
    image_url VARCHAR(255)
);

CREATE TABLE ecommerce.products (
    id BIGSERIAL PRIMARY KEY,
    description VARCHAR(255),
    imageurl VARCHAR(255),
    name VARCHAR(255),
    price DOUBLE PRECISION NOT NULL,
    category_id INT NOT NULL REFERENCES ecommerce.categories(id) ON DELETE CASCADE           --categories foreign key
);

CREATE TABLE ecommerce.user_profile (
    id INT PRIMARY KEY,
    email VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    username VARCHAR(255)
);

CREATE TABLE ecommerce.users (
    id SERIAL PRIMARY KEY,                 --added sequence
    email VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(255)
);

CREATE TABLE ecommerce.cart (
    id SERIAL PRIMARY KEY,
    created_date TIMESTAMP WITHOUT TIME ZONE,
    product_id BIGINT REFERENCES ecommerce.products(id) ON DELETE CASCADE,       -- products foreign key
    quantity INT NOT NULL,
    user_id INT REFERENCES ecommerce.user_profile(id) ON DELETE CASCADE  --user profile foreign key
);

CREATE TABLE ecommerce.orderitems (
    order_item_id SERIAL PRIMARY KEY,
    created_date TIMESTAMP WITHOUT TIME ZONE,
    order_id INT,
    price DOUBLE PRECISION,
    product_id INT REFERENCES ecommerce.products(id) ON DELETE CASCADE,                 --products foreign key
    quantity INT
);

CREATE TABLE ecommerce.tokens (
    id BIGSERIAL PRIMARY KEY,
    created_date TIMESTAMP WITHOUT TIME ZONE,
    token VARCHAR(255),
    user_id INT NOT NULL REFERENCES ecommerce.user_profile(id) -- foreing key of users
);

CREATE TABLE ecommerce.wishlist (
    id SERIAL PRIMARY KEY,
    created_date TIMESTAMP WITHOUT TIME ZONE,
    product_id BIGINT REFERENCES ecommerce.products(id) ON DELETE CASCADE, --product foreign key
    user_id INT REFERENCES ecommerce.user_profile(id) ON DELETE CASCADE  --user foreign key
);