CREATE TABLE public.cart (
    id SERIAL PRIMARY KEY,
    created_date TIMESTAMP WITHOUT TIME ZONE,
    product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE,       -- products foreign key
    quantity INT NOT NULL,
    user_id INT REFERENCES public.user_profile(id) ON DELETE CASCADE  --user profile foreign key
);

CREATE TABLE public.categories (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(255),
    description VARCHAR(255),
    image_url VARCHAR(255)
);

CREATE TABLE public.orderitems (
    order_item_id SERIAL PRIMARY KEY,
    created_date TIMESTAMP WITHOUT TIME ZONE,
    order_id INT,
    price DOUBLE PRECISION,
    product_id INT REFERENCES public.products(id) ON DELETE CASCADE,                 --products foreign key
    quantity INT
);

CREATE TABLE public.products (
    id BIGSERIAL PRIMARY KEY,
    description VARCHAR(255),
    imageurl VARCHAR(255),
    name VARCHAR(255),
    price DOUBLE PRECISION NOT NULL,
    category_id INT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE           --categories foreign key
);

CREATE TABLE public.tokens (
    id BIGSERIAL PRIMARY KEY,
    created_date TIMESTAMP WITHOUT TIME ZONE,
    token VARCHAR(255),
    user_id INT NOT NULL public.user_profile(id) -- foreing key of users
);

CREATE TABLE public.user_profile (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    username VARCHAR(255)
);

CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,                 --added sequence
    email VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(255)
);

CREATE TABLE public.wishlist (
    id SERIAL PRIMARY KEY,
    created_date TIMESTAMP WITHOUT TIME ZONE,
    product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE, --product foreign key
    user_id INT REFERENCES public.user_profile(id) ON DELETE CASCADE  --user foreign key
);