DROP DATABASE IF EXISTS magicpost;
-- Cơ sở dữ liệu: `magic_post`  
CREATE DATABASE IF NOT EXISTS `magicpost` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `magicpost`;
-- -----------------------------------------------------------------------------------------------------------



CREATE TABLE `hub`(
    hubID TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    hubName VARCHAR(50) NOT NULL,
    hubAddress VARCHAR(255) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


CREATE TABLE `transactionPoint`(
    transactionID TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    transactionName VARCHAR(50) NOT NULL,
    transactionAddress VARCHAR(255) NOT NULL,
    hubID TINYINT UNSIGNED NOT NULL,
    FOREIGN KEY(hubID) REFERENCES hub(hubID)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


-- create table account
CREATE TABLE `account`(
    accountID TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(50) NOT NULL UNIQUE KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    FullName VARCHAR(50) NOT NULL,
    Position ENUM('Dev', 'headAdmin', 'hubAdmin', 'transactionAdmin', 'hubEmployee', 'transactionEmployee') NOT NULL UNIQUE KEY,
    CreateDate DATETIME DEFAULT NOW(),
    password VARCHAR(800),
    status TINYINT DEFAULT 0,
    -- 0: Not Active, 1: Active
    PathImage VARCHAR(50),
    transactionID TINYINT UNSIGNED,
    hubID TINYINT UNSIGNED,
    FOREIGN KEY(transactionID) REFERENCES transactionPoint(transactionID),
    FOREIGN KEY(hubID) REFERENCES hub(hubID)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- hub/transactionID in all Order -> unsigned fk to account (not yet implemented)
-- create table Order: order created for customer
CREATE TABLE `order`(
    orderID TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    transactionID TINYINT UNSIGNED NOT NULL,
    senderName VARCHAR(50) NOT NULL,
    senderAddress VARCHAR(255) NOT NULL,
    senderPhoneNumber VARCHAR(20) NOT NULL,
    packageType ENUM('Document', 'Commodity') NOT NULL,
    receiverName VARCHAR(50) NOT NULL,
    receiverAddress VARCHAR(255) NOT NULL,
    reveiverPhoneNumber VARCHAR(50) NOT NULL,
    createTime DATETIME DEFAULT NOW(),
    expectedSendDate DATE,
    receiveDate DATE,
    shipStatus ENUM('Pending', 'Ongoing', 'Finished', 'Cancelled') NOT NULL UNIQUE KEY,
    shippingFee VARCHAR(50),
    packageWeight VARCHAR(50),
    employeeSignature VARCHAR(50), 
    FOREIGN KEY(transactionID) REFERENCES transactionPoint(transactionID)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Create table transactionOrder: ship order from transaction to corresponding hub
CREATE TABLE `transactionOrder`(
    tOrderID TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    transactionID TINYINT UNSIGNED NOT NULL,
    orderID TINYINT UNSIGNED NOT NULL, 
    tShippingEmployeeName VARCHAR(50) NOT NULL, 
    tSendDate DATE NOT NULL,
    tReceiveDate DATE,
    tShipStatus ENUM('Ongoing', 'Finished', 'Cancelled') NOT NULL UNIQUE KEY,
    FOREIGN KEY (orderID) REFERENCES `order`(orderID)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Create table shippingOrder: order gui den nguoi nhan
CREATE TABLE `shippingOrder`(
    sOrderID TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    transactionID TINYINT UNSIGNED NOT NULL,
    orderID TINYINT UNSIGNED NOT NULL,
    shippingEmployeeName VARCHAR(50) NOT NULL,
    sendDate DATE NOT NULL,
    receiveDate DATE,
    shipStatus ENUM('Ongoing', 'Finished', 'Cancelled') NOT NULL UNIQUE KEY,
    FOREIGN KEY (transactionID) REFERENCES transactionPoint(transactionID),
    FOREIGN KEY (orderID) REFERENCES `order`(orderID)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Create table hubOrder: ship order from hub to endpoint's hub/corresponding transaction if same endpoint (somehow)
-- CREATE TABLE IF NOT EXISTS `hubOrder`(
--     hOrderID TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
--     orderID TINYINT UNSIGNED NOT NULL,
--     hubID TINYINT UNSIGNED,
--     endpointID TINYINT UNSIGNED,
--     hShippingEmployeeName VARCHAR(50) NOT NULL,
--     hSendDate DATE NOT NULL,
--     hReceiveDate DATE,
--     hShipStatus ENUM('Ongoing', 'Finished', 'Cancelled') NOT NULL UNIQUE KEY,
--     FOREIGN KEY (orderID) REFERENCES transactionOrder(orderID),
--     FOREIGN KEY (hubID) REFERENCES transactionOrder(hubID)
--     -- FOREIGN KEY (endpointID) REFERENCES ...
-- )ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;