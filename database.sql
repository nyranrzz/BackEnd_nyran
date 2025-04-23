-- Users tablosu (Kullanıcılar)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('market', 'baza', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products tablosu (Ürünler)
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions tablosu (Ödemeler)
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    market_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) NOT NULL,
    remaining_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (market_id) REFERENCES users(id)
);

-- Market Orders tablosu (Market Siparişleri)
CREATE TABLE market_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    market_id INT NOT NULL,
    status ENUM('pending', 'approved', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (market_id) REFERENCES users(id)
);

-- Market Order Items tablosu (Sipariş Detayları)
CREATE TABLE market_order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    requested_quantity DECIMAL(10,2) DEFAULT 0,
    received_quantity DECIMAL(10,2) DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES market_orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Baza Orders tablosu (Baza Onaylı Siparişler)
CREATE TABLE baza_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    market_order_id INT NOT NULL,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    total_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (market_order_id) REFERENCES market_orders(id)
);

-- Market Transactions tablosu (Market İşlemleri - Info Panel)
CREATE TABLE market_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    market_id INT NOT NULL,
    total_goods DECIMAL(10,2) DEFAULT 0,
    total_received DECIMAL(10,2) DEFAULT 0,
    damaged_goods DECIMAL(10,2) DEFAULT 0,
    cash_register DECIMAL(10,2) DEFAULT 0,
    cash DECIMAL(10,2) DEFAULT 0,
    salary DECIMAL(10,2) DEFAULT 0,
    expenses DECIMAL(10,2) DEFAULT 0,
    difference DECIMAL(10,2) DEFAULT 0,
    remainder DECIMAL(10,2) DEFAULT 0,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (market_id) REFERENCES users(id)
);

-- Draft Orders tablosu (Market Panel Taslak Siparişleri)
CREATE TABLE draft_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    market_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity DECIMAL(10,2) DEFAULT 0,
    received_quantity DECIMAL(10,2) DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (market_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_market_product (market_id, product_id)
);

-- Baza Prices tablosu (Baza Panel Fiyatları)
CREATE TABLE baza_prices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    price DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) DEFAULT 0,
    grand_total DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Market Total Received tablosu (Qəbul olunan cəm)
CREATE TABLE market_total_received (
    id INT PRIMARY KEY AUTO_INCREMENT,
    market_id INT NOT NULL,
    total_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (market_id) REFERENCES users(id),
    UNIQUE KEY unique_market (market_id)
);

-- Baza Total Goods tablosu (Baza Panelden gelen toplam mal değeri)
CREATE TABLE baza_total_goods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    market_id INT NOT NULL,
    total_goods DECIMAL(10,2) DEFAULT 0,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (market_id) REFERENCES users(id),
    UNIQUE KEY unique_market_date (market_id, transaction_date)
);

-- Örnek kullanıcı verileri
INSERT INTO users (email, password, name, role) VALUES
('market1@panel.com', 'market123', 'Market 1', 'market'),
('market2@panel.com', 'market123', 'Market 2', 'market'),
('market3@panel.com', 'market123', 'Market 3', 'market'),
('market4@panel.com', 'market123', 'Market 4', 'market'),
('market5@panel.com', 'market123', 'Market 5', 'market'),
('market6@panel.com', 'market123', 'Market 6', 'market'),
('market7@panel.com', 'market123', 'Market 7', 'market'),
('market8@panel.com', 'market123', 'Market 8', 'market'),
('market9@panel.com', 'market123', 'Market 9', 'market'),
('market10@panel.com', 'market123', 'Market 10', 'market'),
('market11@panel.com', 'market123', 'Market 11', 'market'),
('market12@panel.com', 'market123', 'Market 12', 'market'),
('market13@panel.com', 'market123', 'Market 13', 'market'),
('market14@panel.com', 'market123', 'Market 14', 'market'),
('market15@panel.com', 'market123', 'Market 15', 'market'),
('baza@panel.com', 'baza123', 'Baza İdarəetmə', 'baza'),
('admin@panel.com', 'admin123', 'Admin Panel', 'admin');

-- Örnek ürün verileri
INSERT INTO products (name) VALUES
('Alma'),
('Armud'),
('Portağal'),
('Çörək'),
('Süd'),
('Yumurta'),
('Ət'),
('Toyuq'),
('Düyü'),
('Kartof'),
('Soğan'),
('Pomidor'),
('Xiyar'),
('Yağ'),
('Un'); 