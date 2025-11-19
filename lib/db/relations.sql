-- USERS RELATIONSHIPS
-- employees.user_id → users.id  (1:N)
ALTER TABLE employees
ADD CONSTRAINT fk_employees_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- sales.user_id → users.id  (1:N)
ALTER TABLE sales
ADD CONSTRAINT fk_sales_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- cash_register.opened_by → users.id  (1:N)
ALTER TABLE cash_register
ADD CONSTRAINT fk_cash_register_opened_by
FOREIGN KEY (opened_by) REFERENCES users(id);

-- cash_register.closed_by → users.id  (1:N)
ALTER TABLE cash_register
ADD CONSTRAINT fk_cash_register_closed_by
FOREIGN KEY (closed_by) REFERENCES users(id);

-- CUSTOMERS RELATIONSHIPS
-- sales.customer_id → customers.id  (1:N)
ALTER TABLE sales
ADD CONSTRAINT fk_sales_customer
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

-- SUPPLIERS RELATIONSHIPS
-- products.supplier_id → suppliers.id  (1:N)
ALTER TABLE products
ADD CONSTRAINT fk_products_supplier
FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL;

-- purchases.supplier_id → suppliers.id  (1:N)
ALTER TABLE purchases
ADD CONSTRAINT fk_purchases_supplier
FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL;

-- CATEGORIES RELATIONSHIPS
-- products.category_id → categories.id  (1:N)
ALTER TABLE products
ADD CONSTRAINT fk_products_category
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- PRODUCTS RELATIONSHIPS
-- inventory_movements.product_id → products.id  (1:N)
ALTER TABLE inventory_movements
ADD CONSTRAINT fk_inventory_movements_product
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- sale_items.product_id → products.id  (1:N)
ALTER TABLE sale_items
ADD CONSTRAINT fk_sale_items_product
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;

-- purchase_items.product_id → products.id  (1:N)
ALTER TABLE purchase_items
ADD CONSTRAINT fk_purchase_items_product
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;

-- SALES RELATIONSHIPS
-- sale_items.sale_id → sales.id  (1:N)
ALTER TABLE sale_items
ADD CONSTRAINT fk_sale_items_sale
FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE;

-- CASH REGISTER RELATIONSHIPS
-- cash_movements.register_id → cash_register.id  (1:N)
ALTER TABLE cash_movements
ADD CONSTRAINT fk_cash_movements_register
FOREIGN KEY (register_id) REFERENCES cash_register(id) ON DELETE CASCADE;

-- PURCHASES RELATIONSHIPS
-- purchase_items.purchase_id → purchases.id  (1:N)
ALTER TABLE purchase_items
ADD CONSTRAINT fk_purchase_items_purchase
FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE;
