CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'employee' CHECK (
            role IN ('admin', 'manager', 'cashier', 'employee')
        ),
        reset_token TEXT,
        reset_token_expires TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    employees (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users (id) ON DELETE SET NULL,
        full_name TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        status TEXT NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    customers (
        id SERIAL PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    suppliers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category_id INTEGER REFERENCES categories (id) ON DELETE SET NULL,
        supplier_id INTEGER REFERENCES suppliers (id) ON DELETE SET NULL,
        price NUMERIC(10, 2) NOT NULL,
        cost NUMERIC(10, 2),
        sku TEXT UNIQUE,
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW (),
        updated_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    inventory_movements (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products (id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL,
        type TEXT NOT NULL, -- "in" o "out"
        reason TEXT,
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    sales (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users (id) ON DELETE SET NULL,
        customer_id INTEGER REFERENCES customers (id) ON DELETE SET NULL,
        total NUMERIC(10, 2) NOT NULL,
        payment_method TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    sale_items (
        id SERIAL PRIMARY KEY,
        sale_id INTEGER NOT NULL REFERENCES sales (id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products (id) ON DELETE SET NULL,
        quantity INTEGER NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        subtotal NUMERIC(10, 2) NOT NULL
    );

CREATE TABLE
    cash_register (
        id SERIAL PRIMARY KEY,
        opening_amount NUMERIC(10, 2) NOT NULL,
        closing_amount NUMERIC(10, 2),
        status TEXT NOT NULL CHECK (status IN ('open', 'closed')) DEFAULT 'open',
        opened_by INTEGER REFERENCES users (id),
        closed_by INTEGER REFERENCES users (id),
        opened_at TIMESTAMP DEFAULT NOW (),
        closed_at TIMESTAMP
    );

CREATE TABLE
    cash_movements (
        id SERIAL PRIMARY KEY,
        register_id INTEGER REFERENCES cash_register (id) ON DELETE CASCADE,
        amount NUMERIC(10, 2) NOT NULL,
        type TEXT NOT NULL, -- "in", "out", "adjust"
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    purchases (
        id SERIAL PRIMARY KEY,
        supplier_id INTEGER REFERENCES suppliers (id) ON DELETE SET NULL,
        total NUMERIC(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    purchase_items (
        id SERIAL PRIMARY KEY,
        purchase_id INTEGER NOT NULL REFERENCES purchases (id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products (id) ON DELETE SET NULL,
        quantity INTEGER NOT NULL,
        cost NUMERIC(10, 2) NOT NULL,
        subtotal NUMERIC(10, 2) NOT NULL
    );