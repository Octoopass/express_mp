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

CREATE TABLE `position` (
    positionID TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    positionName ENUM('Dev', 'headAdmin', 'hubAdmin', 'transactionAdmin', 'hubEmployee', 'transactionEmployee') NOT NULL UNIQUE KEY
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


-- create table account
CREATE TABLE `account`(
    accountID TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(50) NOT NULL UNIQUE KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    FullName VARCHAR(50) NOT NULL,
    PositionID TINYINT UNSIGNED,
    CreateDate DATETIME DEFAULT NOW(),
    password VARCHAR(800),
    transactionID TINYINT UNSIGNED,
    hubID TINYINT UNSIGNED,
    FOREIGN KEY(PositionID) REFERENCES `position`(positionID),
    FOREIGN KEY(transactionID) REFERENCES transactionPoint(transactionID),
    FOREIGN KEY(hubID) REFERENCES hub(hubID)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- hub/transactionID in all Order -> unsigned fk to account (not yet implemented)
-- create table Order: order created for customer
CREATE TABLE `orders`(
    orderID TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    transactionID TINYINT UNSIGNED NOT NULL,
    senderName VARCHAR(50) NOT NULL,
    senderAddress VARCHAR(255) NOT NULL,
    senderPhoneNumber VARCHAR(20) NOT NULL,
    packageType VARCHAR(20) NOT NULL,
    receiverName VARCHAR(50) NOT NULL,
    receiverAddress VARCHAR(255) NOT NULL,
    reveiverPhoneNumber VARCHAR(50) NOT NULL,
    createTime DATETIME DEFAULT NOW(),
    expectedSendDate DATE,
    receiveDate DATE,
    shipStatus VARCHAR(10) DEFAULT 'Pending',
    shippingFee VARCHAR(50),
    packageWeight VARCHAR(50),
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
    tShipStatus VARCHAR(10) DEFAULT 'Pending',
    FOREIGN KEY (transactionID) REFERENCES transactionPoint(transactionID),
    FOREIGN KEY (orderID) REFERENCES `orders`(orderID)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Create table shippingOrder: order gui den nguoi nhan
CREATE TABLE `shippingOrder`(
    sOrderID TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    transactionID TINYINT UNSIGNED NOT NULL,
    orderID TINYINT UNSIGNED NOT NULL,
    shippingEmployeeName VARCHAR(50) NOT NULL,
    sendDate DATE NOT NULL,
    receiveDate DATE,
    shipStatus VARCHAR(10) DEFAULT 'Pending',
    FOREIGN KEY (transactionID) REFERENCES transactionPoint(transactionID),
    FOREIGN KEY (orderID) REFERENCES `orders`(orderID)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Create table hubOrder: ship order from hub to endpoint's hub/corresponding transaction if same endpoint (somehow)
CREATE TABLE IF NOT EXISTS `hubOrder`(
    hOrderID TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    orderID TINYINT UNSIGNED NOT NULL,
    hubID TINYINT UNSIGNED NOT NULL,
    endpointID TINYINT UNSIGNED NOT NULL,
    hShippingEmployeeName VARCHAR(50) NOT NULL,
    hSendDate DATE NOT NULL,
    hReceiveDate DATE,
    hShipStatus VARCHAR(10) DEFAULT 'Pending',
    FOREIGN KEY (orderID) REFERENCES orders(orderID),
    FOREIGN KEY (endpointID) REFERENCES transactionPoint(transactionID)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `hub` (`hubID`, `hubName`, `hubAddress`) VALUES
(1, 'Điểm tập kết Cầu Giấy', 'Cầu Giấy, Hà Nội'),
(2, 'Điểm tập kết HT', 'Thành phố Hà Tĩnh, Hà Tĩnh'),
(3, 'Điểm tập kết MĐ', 'MĐ, Hà Nội');

INSERT INTO `transactionpoint` (`transactionID`, `transactionName`, `transactionAddress`, `hubID`) VALUES
(1, 'Điểm giao dịch Xuân Thủy', 'Xuân Thủy, Cầu Giấy, Hà Nội', 1),
(2, 'Điểm giao dịch DVH', 'DVH, Cầu Giấy, Hà Nội', 1),
(3, 'Điểm giao dịch Thạch Hà', 'Thạch Hà, Hà Tĩnh', 2),
(4, 'Điểm giao dịch NX', 'NX, Hà Tĩnh', 2),
(5, 'Điểm giao dịch MD1', 'MD1, MĐ, Hà Nội', 3),
(6, 'Điểm giao dịch MD2', 'MD2, MĐ, Hà Nội', 3);

INSERT INTO position (positionName)
VALUES ('Dev'), ('headAdmin'), ('hubAdmin'), ('transactionAdmin'), ('hubEmployee'), ('transactionEmployee');

INSERT INTO `account` (`accountID`, `Email`, `Username`, `FullName`, `PositionID`, `CreateDate`, `password`, `transactionID`, `hubID`) VALUES
(14, 'giaodich6@gmail.com', 'giaodich6', 'Giao Dich 6', 4, '2023-12-28 15:21:01', '$2a$10$06OaRPu4.HBXA9snrNQ36O/0pMLbaWr.B2X574c7C4GcHR.md2MWa', 6, NULL),
(13, 'giaodich5@gmail.com', 'giaodich5', 'Giao Dich 5', 4, '2023-12-28 15:20:00', '$2a$10$3B6SWV7q.gTEzxoSMD8k2e04U/vddmW7RU8lr8wNT3AIMWcZLHYrC', 5, NULL),
(12, 'giaodich4@gmail.com', 'giaodich4', 'Giao Dich 4', 4, '2023-12-28 15:19:45', '$2a$10$xfjsOrAOSbYX1gV4FYgsCec3W94AGJ4EIIXIKOvj.bS3nExO6MpPO', 4, NULL),
(11, 'giaodich3@gmail.com', 'giaodich3', 'Giao Dich 3', 4, '2023-12-28 15:19:32', '$2a$10$srg7fEXDRjC.yD46QnvPCO8/djBtAWHhqtiV5jaSWiH7UMteUKXtq', 3, NULL),
(10, 'giaodich2@gmail.com', 'giaodich2', 'Giao Dich 2', 4, '2023-12-28 15:19:13', '$2a$10$cj.x914bUeeaxkKh/O/SCuQuNwTkOWYyuGF0gBvgMam4ETkbAAeYC', 2, NULL),
(9, 'giaodich1@gmail.com', 'giaodich1', 'Giao Dich 1', 4, '2023-12-28 15:18:58', '$2a$10$AtGKK9w7p1cMvm9FB7ZaQeP4LuKvfao/sI59OHEU4IHhsdQq8rCDi', 1, NULL),
(8, 'tapket3@gmail.com', 'tapket3', 'Tap Ket Three', 3, '2023-12-28 15:16:55', '$2a$10$.RkorqXNrFjuOLMRPIiUzO35EE1dPHH3wa0RJSxqZaHIxii7CESBK', NULL, 3),
(7, 'tapket2@gmail.com', 'tapket2', 'Tap Ket Two', 3, '2023-12-28 15:15:54', '$2a$10$u4DFS/1QSuUaQq0.E/JnKeh1UvDFf1JjGYYP3PjIdaCrunEPltoiG', NULL, 2),
(6, 'tapket1@gmail.com', 'tapket1', 'Tap Ket One', 3, '2023-12-28 15:15:17', '$2a$10$xPmmeXj/yzDPZa06ALOfFOWk3Ud4CBMJTN4tmkXuiXJP/SZjI6JNK', NULL, 1),
(5, 'admin2@gmail.com', 'admin2', 'Admin Two', 2, '2023-12-28 15:13:45', '$2a$10$ighQrMNEUg8vMzVSGcPl.eQfuAQ3QNjNp5VjIt46tRyvg1EQfcEAq', NULL, NULL),
(4, 'admin1@gmail.com', 'admin1', 'Admin One', 2, '2023-12-28 15:13:26', '$2a$10$hlt0dfSDu5xjBxlJaTZAn.Vr1M0VLWXlR/9/QqBjWYBP8pxDgVgGi', NULL, NULL),
(3, 'tuanminh@gmail.com', 'tuanminh', 'Hoang Tuan Minh', 1, '2023-12-28 14:59:02', '$2a$10$w9D3tIlx.nSYlBZmzmPZD.gk8DvBBGgefrg.38rrmcF5RHseROXDe', NULL, NULL),
(2, 'tuanphuong@gmail.com', 'tuanphuong', 'Nguyen Cong Tuan Phuong', 1, '2023-12-28 14:58:37', '$2a$10$80Bn4vPmxks.Etc3MQu3nOge0RhtCL65MY9Ez731lBw7JAQKpHStS', NULL, NULL),
(1, 'khan@gmail.com', 'khan', 'Luong Sy Khanh', 1, '2023-12-28 14:58:10', '$2a$10$un4w5YCblVwwEAC6kf42.emBn/kzXg11SVZGDbciK7CeHdtc2L.YC', NULL, NULL);

INSERT INTO `orders` (`orderID`, `transactionID`, `senderName`, `senderAddress`, `senderPhoneNumber`, `packageType`, `receiverName`, `receiverAddress`, `reveiverPhoneNumber`, `createTime`, `expectedSendDate`, `receiveDate`, `shipStatus`, `shippingFee`, `packageWeight`) VALUES
(1, 1, 'Khan', 'Dvh, Cau Giay, Ha Noi', '7777777777', 'Document', 'Phuong', 'Cau Giay, Ha Noi', '0xx', '2023-12-28 20:35:18', '2023-12-29', NULL, 'Pending', '10000', '1000g'),
(2, 1, 'Khanh', 'Dvh, Cau Giay, Ha Noi', '7777777777', 'Commodity', 'Minh', 'Cau Giay, Ha Noi', '0xx', '2023-12-28 20:37:50', '2023-12-29', NULL, 'Pending', '20000', '10000g'),
(3, 1, 'Minh', 'Dvh, Cau Giay, Ha Noi', '09xx', 'Commodity', 'Huy', 'Cau Giay, Ha Noi', '0xx', '2023-12-28 20:42:49', '2023-12-29', NULL, 'Pending', '20000', '5000g'),
(4, 1, 'Duy', 'Dvh, Cau Giay, Ha Noi', '09xx', 'Commodity', 'Tuan', 'Cau Giay, Ha Noi', '0xx', '2023-12-28 20:43:06', '2023-12-29', NULL, 'Pending', '20000', '5000g'),
(5, 3, 'Dat', 'Cau Giay, Ha Noi', '09xx', 'Commodity', 'Huy', 'My Dinh, Ha Noi', '0xx', '2023-12-28 20:48:12', '2023-12-29', NULL, 'Pending', '20000', '5000g'),
(6, 3, 'Dat', 'Ha Tinh', '09xx', 'Commodity', 'Vy', 'My Dinh, Ha Noi', '0xx', '2023-12-28 20:48:34', '2023-12-29', NULL, 'Pending', '20000', '5000g');
