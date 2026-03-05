-- Create database
CREATE DATABASE IF NOT EXISTS catalog_bot;
USE catalog_bot;

-- Games table
CREATE TABLE IF NOT EXISTS games (
  game_id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  features_list TEXT,
  stock_status ENUM('available', 'out_of_stock', 'pre_order') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);

-- Sample data
INSERT INTO games (game_id, name) VALUES
('game_001', 'Mobile Legends'),
('game_002', 'PUBG Mobile'),
('game_003', 'Free Fire');

INSERT INTO vendors (game_id, name, price, features_list, stock_status) VALUES
('game_001', 'Vendor A', 10.50, '["Instant Delivery", "24/7 Support"]', 'available'),
('game_001', 'Vendor B', 9.99, '["Instant Delivery", "Bonus Diamonds"]', 'available'),
('game_002', 'Vendor C', 15.00, '["Instant Delivery", "Safe Transaction"]', 'out_of_stock');
