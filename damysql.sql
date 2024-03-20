-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 19, 2024 lúc 10:50 AM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `damysql`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `areas`
--

CREATE TABLE `areas` (
  `id` int(11) NOT NULL,
  `restaurantID` int(11) DEFAULT NULL,
  `areaName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `areas`
--

INSERT INTO `areas` (`id`, `restaurantID`, `areaName`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Khu A', '2024-02-21 04:53:08', '2024-02-22 08:16:37'),
(22, 1, 'khu B', '2024-02-24 09:05:16', '2024-02-24 09:05:16');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `costs`
--

CREATE TABLE `costs` (
  `id` int(11) NOT NULL,
  `restaurantID` int(11) DEFAULT NULL,
  `costName` varchar(255) DEFAULT NULL,
  `fee` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `costs`
--

INSERT INTO `costs` (`id`, `restaurantID`, `costName`, `fee`, `createdAt`, `updatedAt`) VALUES
(2, 1, 'đồ trang trí', 25000, '2024-03-12 04:42:36', '2024-03-12 04:42:36'),
(3, 1, 'test', 10000, '2024-03-12 04:44:32', '2024-03-12 04:44:32');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `orderID` int(11) DEFAULT NULL,
  `menuID` int(11) DEFAULT NULL,
  `staffID` int(11) DEFAULT NULL,
  `itemNumber` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `items`
--

INSERT INTO `items` (`id`, `orderID`, `menuID`, `staffID`, `itemNumber`, `status`, `note`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 2, 4, 1, 'chua tra', '2024-02-26 09:55:32', '2024-02-29 18:17:57'),
(2, 1, 1, 2, 2, 1, 'da tra', '2024-02-26 09:55:32', '2024-02-26 09:55:32'),
(3, 1, 1, 2, -3, 2, 'giam', '2024-02-26 11:00:42', '2024-02-26 11:00:42'),
(4, 1, 3, 2, 2, 1, NULL, '2024-02-26 14:03:47', '2024-02-29 18:17:57'),
(5, 1, 1, 1, -2, 2, NULL, '2024-02-29 08:48:17', '2024-02-29 08:48:17'),
(7, 3, 1, 1, 2, 1, NULL, '2024-02-28 13:47:58', '2024-03-03 21:08:49'),
(9, 3, 4, 1, 1, 1, NULL, '2024-02-28 13:47:58', '2024-03-03 21:08:49'),
(13, 5, 3, 1, 2, 1, NULL, '2024-02-28 14:23:42', '2024-02-28 14:23:42'),
(14, 6, 3, 1, 1, 1, '', '2024-02-28 14:32:30', '2024-02-28 14:32:30'),
(17, 3, 1, 1, 2, 1, '', '2024-03-01 04:34:27', '2024-03-03 21:08:49'),
(18, 3, 3, 1, -1, 1, '', '2024-03-01 04:34:27', '2024-03-03 21:08:49'),
(19, 3, 4, 1, -1, 1, '', '2024-03-01 04:35:42', '2024-03-03 21:08:49'),
(20, 3, 3, 1, 1, 1, '', '2024-03-01 04:35:42', '2024-03-03 21:08:49'),
(22, 3, 3, 1, 1, 1, 'dsfgds', '2024-03-01 05:20:56', '2024-03-03 21:08:49'),
(23, 3, 6, 1, 2, 1, '...', '2024-03-01 05:20:56', '2024-03-03 21:08:49'),
(24, 7, 4, 1, 2, 1, NULL, '2024-03-01 09:01:40', '2024-03-05 06:49:50'),
(28, 8, 1, 1, 2, 1, NULL, '2024-03-03 19:05:33', '2024-03-05 06:54:13'),
(29, 8, 3, 1, 2, 1, '...', '2024-03-04 00:48:57', '2024-03-05 06:52:09'),
(30, 11, 3, 1, 2, 1, NULL, '2024-03-04 13:17:42', '2024-03-04 13:19:21'),
(31, 12, 3, 1, 2, 1, NULL, '2024-03-04 13:19:35', '2024-03-04 13:20:18'),
(32, 13, 3, 1, 2, 1, NULL, '2024-03-04 13:20:46', '2024-03-04 13:35:10'),
(33, 14, 3, 1, 2, 1, NULL, '2024-03-05 03:23:28', '2024-03-05 03:26:44'),
(34, 14, 6, 1, 1, 1, NULL, '2024-03-05 03:23:28', '2024-03-05 03:26:44'),
(35, 15, 3, 1, 1, 1, NULL, '2024-03-05 03:29:34', '2024-03-05 06:46:33'),
(36, 15, 6, 1, 1, 1, NULL, '2024-03-05 03:29:34', '2024-03-05 06:55:42'),
(57, 8, 3, 1, 1, 1, '...', '2024-03-05 09:54:33', '2024-03-06 08:21:09'),
(58, 8, 5, 1, 1, 1, '...', '2024-03-05 09:54:33', '2024-03-06 08:21:12'),
(59, 8, 6, 1, 1, 1, '...', '2024-03-05 09:54:33', '2024-03-06 08:21:14'),
(62, 17, 3, 1, 1, 1, NULL, '2024-03-05 10:43:05', '2024-03-05 10:56:37'),
(63, 17, 6, 1, 1, 1, NULL, '2024-03-05 10:43:05', '2024-03-05 10:56:37'),
(64, 18, 6, 1, 1, 1, NULL, '2024-03-05 10:43:15', '2024-03-05 10:56:42'),
(65, 18, 3, 1, 1, 1, NULL, '2024-03-05 10:43:15', '2024-03-05 10:56:42'),
(66, 18, 5, 1, 1, 1, NULL, '2024-03-05 10:43:15', '2024-03-05 10:56:42'),
(67, 8, 1, 1, 1, 1, '', '2024-03-06 17:47:07', '2024-03-07 04:58:33'),
(68, 8, 3, 1, 1, 1, '', '2024-03-06 17:47:07', '2024-03-07 04:59:26'),
(70, 19, 5, 1, 2, 1, NULL, '2024-03-07 03:27:08', '2024-03-07 05:02:07'),
(71, 19, 3, 1, 2, 1, NULL, '2024-03-07 03:27:08', '2024-03-07 05:03:23'),
(76, 19, 3, 1, 2, 1, '...', '2024-03-07 03:34:36', '2024-03-07 05:03:28'),
(78, 19, 5, 1, 1, 1, '', '2024-03-07 05:13:05', '2024-03-07 05:14:05'),
(99, 23, 1, 1, 1, 1, '', '2024-03-08 08:00:48', '2024-03-08 08:00:48'),
(100, 8, 1, 1, -1, 2, 'tách đơn', '2024-03-08 08:00:48', '2024-03-08 08:00:48'),
(101, 23, 3, 1, 1, 1, '', '2024-03-08 08:00:48', '2024-03-08 08:00:48'),
(102, 8, 3, 1, -1, 2, 'tách đơn', '2024-03-08 08:00:48', '2024-03-08 08:00:48'),
(103, 23, 5, 1, 1, 1, '', '2024-03-08 08:00:48', '2024-03-08 08:00:48'),
(104, 8, 5, 1, -1, 2, 'tách đơn', '2024-03-08 08:00:48', '2024-03-08 08:00:48'),
(105, 23, 6, 1, 1, 1, '', '2024-03-08 08:00:48', '2024-03-08 08:00:48'),
(106, 8, 6, 1, -1, 2, 'tách đơn', '2024-03-08 08:00:48', '2024-03-08 08:00:48'),
(109, 24, 3, 1, 2, 1, '...', '2024-03-15 07:32:59', '2024-03-15 07:56:30'),
(110, 24, 5, 1, 1, 1, '...', '2024-03-15 07:32:59', '2024-03-15 07:56:59'),
(111, 24, 6, 1, 1, 1, '...', '2024-03-15 07:32:59', '2024-03-15 07:57:01'),
(112, 25, 5, 1, 2, 1, NULL, '2024-03-15 08:12:42', '2024-03-18 09:32:32'),
(113, 25, 6, 1, 1, 1, NULL, '2024-03-15 08:12:42', '2024-03-18 09:32:34'),
(114, 26, 6, 1, 1, 1, NULL, '2024-03-15 08:17:44', '2024-03-18 09:32:43'),
(115, 26, 3, 1, 1, 1, NULL, '2024-03-15 08:17:44', '2024-03-18 09:32:45'),
(116, 24, 6, 1, 1, 1, '...', '2024-03-15 08:22:26', '2024-03-18 09:32:24'),
(117, 24, 3, 1, 1, 1, '...', '2024-03-15 08:22:26', '2024-03-18 09:32:25'),
(118, 25, 3, 1, 1, 1, '...', '2024-03-15 08:23:04', '2024-03-18 09:32:36'),
(119, 25, 6, 1, 1, 1, '...', '2024-03-15 08:23:04', '2024-03-18 09:32:37'),
(120, 24, 3, 1, 1, 1, '...', '2024-03-15 08:23:32', '2024-03-18 09:32:27'),
(121, 25, 3, 1, 1, 1, '', '2024-03-18 09:32:53', '2024-03-18 09:33:40'),
(122, 25, 5, 1, 1, 1, '', '2024-03-18 09:32:53', '2024-03-18 09:33:42'),
(123, 25, 6, 1, 1, 1, '', '2024-03-18 09:32:53', '2024-03-18 09:33:43'),
(124, 25, 3, 1, 1, 1, '', '2024-03-18 09:32:53', '2024-03-18 09:33:45'),
(125, 25, 5, 1, 1, 1, '', '2024-03-18 09:32:53', '2024-03-18 09:33:47'),
(126, 25, 6, 1, 1, 1, '', '2024-03-18 09:32:53', '2024-03-18 09:33:48'),
(127, 25, 3, 1, 1, 1, '', '2024-03-18 09:32:59', '2024-03-18 09:33:50'),
(128, 25, 5, 1, 1, 1, '', '2024-03-18 09:32:59', '2024-03-18 09:33:52'),
(129, 25, 6, 1, 1, 1, '', '2024-03-18 09:32:59', '2024-03-18 09:33:53'),
(130, 25, 3, 1, 2, 1, '', '2024-03-18 09:34:02', '2024-03-18 09:34:22'),
(131, 25, 5, 1, 1, 1, '', '2024-03-18 09:34:02', '2024-03-18 09:34:26'),
(132, 25, 6, 1, 1, 1, '', '2024-03-18 09:34:02', '2024-03-18 09:34:24');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `materials`
--

CREATE TABLE `materials` (
  `id` int(11) NOT NULL,
  `restaurantID` int(11) DEFAULT NULL,
  `materialName` varchar(255) DEFAULT NULL,
  `measure` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `materials`
--

INSERT INTO `materials` (`id`, `restaurantID`, `materialName`, `measure`, `createdAt`, `updatedAt`) VALUES
(8, 1, 'nl1', 'l', '2024-02-21 11:48:48', '2024-02-21 12:11:59'),
(17, 1, 'nl 1', 'kg', '2024-02-22 10:14:30', '2024-02-22 10:14:30'),
(18, 2, 'test', 'g', '2024-03-11 01:24:01', '2024-03-11 01:24:01');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `menumaterials`
--

CREATE TABLE `menumaterials` (
  `id` int(11) NOT NULL,
  `menuID` int(11) DEFAULT NULL,
  `materialID` int(11) DEFAULT NULL,
  `costValue` float DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `menumaterials`
--

INSERT INTO `menumaterials` (`id`, `menuID`, `materialID`, `costValue`, `createdAt`, `updatedAt`) VALUES
(9, 2, 17, 0.5, '2024-02-25 08:59:39', '2024-02-25 08:59:39'),
(19, 5, 0, 0, '2024-03-06 17:42:56', '2024-03-06 17:42:56'),
(22, 6, 8, 0.2, '2024-03-06 17:46:05', '2024-03-06 17:46:05'),
(23, 6, 17, 0.6, '2024-03-06 17:46:05', '2024-03-06 17:46:05'),
(24, 3, 8, 0.2, '2024-03-15 09:04:04', '2024-03-15 09:04:04'),
(25, 3, 17, 0.1, '2024-03-15 09:04:04', '2024-03-15 09:04:04');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `menus`
--

CREATE TABLE `menus` (
  `id` int(11) NOT NULL,
  `restaurantID` int(11) DEFAULT NULL,
  `menuName` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `menus`
--

INSERT INTO `menus` (`id`, `restaurantID`, `menuName`, `image`, `status`, `price`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'm1', 'https://firebasestorage.googleapis.com/v0/b/thienproject-2a65d.appspot.com/o/Images%2FMenu%2Ftop-15-hinh-anh-mon-an-ngon-viet-nam-khien-ban-khong-the-roi-mat-1.jpg?alt=media&token=a71961fe-0a50-4304-90f5-801ee085f155', 0, 12000, '2024-02-18 08:35:52', '2024-03-06 17:42:05'),
(3, 1, 'món 2', 'https://firebasestorage.googleapis.com/v0/b/thienproject-2a65d.appspot.com/o/Images%2FMenu%2Fnhungmonanngonchogiadinhdip29.jpg?alt=media&token=64cc21b2-047d-466e-8de7-f5037dd11fc3', 1, 15000, '2024-02-24 06:49:56', '2024-03-06 17:45:48'),
(4, 1, 'mon 2', '', 1, 21, '2024-02-24 06:58:19', '2024-03-07 03:30:35'),
(5, 1, 'món 1', 'https://firebasestorage.googleapis.com/v0/b/thienproject-2a65d.appspot.com/o/Images%2FMenu%2Fimages.jpg?alt=media&token=6d1add6f-92c6-4b02-83db-a3f81260f5ba', 2, 13, '2024-02-24 07:00:40', '2024-03-15 08:25:57'),
(6, 1, 'm2', 'https://firebasestorage.googleapis.com/v0/b/thienproject-2a65d.appspot.com/o/Images%2FMenu%2Fimages%20(1).jpg?alt=media&token=c2209e6f-d79a-4e39-9411-beb0d3cab498', 1, 16000, '2024-02-24 07:04:55', '2024-03-06 17:46:05');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `restaurantID` int(11) DEFAULT NULL,
  `tableID` int(11) DEFAULT NULL,
  `staff` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `restaurantID`, `tableID`, `staff`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '...', 1, '2024-02-26 09:50:08', '2024-02-29 18:13:11'),
(3, 1, 2, 'admin', 2, '2024-02-28 13:47:58', '2024-03-03 21:08:49'),
(5, 1, 36, 'admin', 2, '2024-02-28 14:23:42', '2024-02-29 18:01:22'),
(6, 1, 37, 'admin', 2, '2024-02-28 14:32:30', '2024-02-29 18:04:36'),
(7, 1, 1, 'admin', 2, '2024-03-01 09:01:39', '2024-03-05 11:10:12'),
(8, 1, 1, 'admin', 1, '2024-03-03 19:05:33', '2024-03-12 03:21:02'),
(9, 1, 36, 'admin', 2, '2024-03-03 19:05:45', '2024-03-05 10:42:54'),
(10, 1, 37, 'admin', 2, '2024-03-03 19:10:59', '2024-03-03 19:11:12'),
(11, 1, 2, 'admin', 2, '2024-03-04 13:17:42', '2024-03-04 13:19:21'),
(12, 1, 37, 'admin', 1, '2024-03-04 13:19:35', '2024-03-04 13:20:18'),
(13, 1, 2, 'admin', 1, '2024-03-04 13:20:46', '2024-03-04 13:35:10'),
(14, 1, 37, 'admin', 2, '2024-03-05 03:23:28', '2024-03-05 03:26:43'),
(15, 1, 37, 'admin', 1, '2024-03-05 03:29:34', '2024-03-05 06:55:44'),
(17, 1, 36, 'admin', 2, '2024-03-05 10:43:05', '2024-03-05 10:56:37'),
(18, 1, 37, 'admin', 2, '2024-03-05 10:43:15', '2024-03-05 10:56:42'),
(19, 1, 38, 'admin', 1, '2024-03-07 03:27:08', '2024-03-12 03:21:32'),
(20, 1, 36, 'admin', 2, '2024-03-08 07:54:05', '2024-03-08 07:58:02'),
(21, 1, 36, 'admin', 2, '2024-03-08 07:58:23', '2024-03-08 07:59:52'),
(23, 1, 36, 'admin', 1, '2024-03-08 08:00:48', '2024-03-12 03:24:59'),
(24, 1, 37, 'admin', 1, '2024-03-11 18:59:48', '2024-03-18 09:34:34'),
(25, 1, 36, 'admin', 1, '2024-03-15 08:12:42', '2024-03-18 09:34:30'),
(26, 1, 38, 'admin', 0, '2024-03-15 08:17:44', '2024-03-15 08:17:44');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `restaurants`
--

CREATE TABLE `restaurants` (
  `id` int(11) NOT NULL,
  `restaurantName` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `restaurants`
--

INSERT INTO `restaurants` (`id`, `restaurantName`, `address`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'res 1', 'dc1', '...', '2024-03-06 08:00:19', '2024-03-06 09:58:26'),
(2, 'res2', '...', '...', '2024-03-06 10:57:04', '2024-03-06 10:57:04');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `schedules`
--

CREATE TABLE `schedules` (
  `id` int(11) NOT NULL,
  `restaurantID` int(11) DEFAULT NULL,
  `userID` int(11) DEFAULT NULL,
  `areaID` int(11) DEFAULT NULL,
  `shiftID` int(11) DEFAULT NULL,
  `check` tinyint(1) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20240102205938-create-user.js'),
('migration-create-area.js'),
('migration-create-cost.js'),
('migration-create-item.js'),
('migration-create-material.js'),
('migration-create-menu.js'),
('migration-create-menuMaterial.js'),
('migration-create-order.js'),
('migration-create-restaurant.js'),
('migration-create-schedule.js'),
('migration-create-shift.js'),
('migration-create-storage.js'),
('migration-create-table.js');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shifts`
--

CREATE TABLE `shifts` (
  `id` int(11) NOT NULL,
  `restaurantID` int(11) DEFAULT NULL,
  `shiftName` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `storages`
--

CREATE TABLE `storages` (
  `id` int(11) NOT NULL,
  `materialID` int(11) DEFAULT NULL,
  `importValue` float DEFAULT NULL,
  `materialCost` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `storages`
--

INSERT INTO `storages` (`id`, `materialID`, `importValue`, `materialCost`, `type`, `note`, `createdAt`, `updatedAt`) VALUES
(12, 8, 2, 10000, 0, '', '2024-03-04 13:16:44', '2024-03-04 13:16:44'),
(13, 17, 2, 15000, 0, '', '2024-03-04 13:17:21', '2024-03-04 13:17:21'),
(17, 17, -0.2, 0, 14, '\"món 2\" x 2', '2024-03-05 03:23:28', '2024-03-05 03:23:28'),
(19, 17, -0.6, 0, 14, '\"m2\" x 1', '2024-03-05 03:23:28', '2024-03-05 03:23:28'),
(21, 17, -0.1, 0, 15, '\"món 2\" x 1', '2024-03-05 03:29:34', '2024-03-05 03:29:34'),
(23, 17, -0.6, 0, 15, '\"m2\" x 1', '2024-03-05 03:29:34', '2024-03-05 03:29:34'),
(24, 17, 0.7, 0, 0, '', '2024-03-05 03:43:35', '2024-03-05 03:43:35'),
(25, 8, 2, 0, 0, '', '2024-03-05 03:51:03', '2024-03-05 03:51:03'),
(26, 17, 3, 0, 0, '', '2024-03-05 03:53:49', '2024-03-05 03:53:49'),
(27, 17, 0.1, 0, 0, '', '2024-03-05 03:54:50', '2024-03-05 03:54:50'),
(28, 17, 0.1, 0, 0, '', '2024-03-05 03:54:50', '2024-03-05 03:54:50'),
(29, 18, 0.2, 100000, 0, '', '2024-03-05 03:56:23', '2024-03-05 03:56:23'),
(30, 18, 0.2, 0, 0, '', '2024-03-05 03:58:47', '2024-03-05 03:58:47'),
(31, 18, 0.2, 0, 0, '', '2024-03-05 03:59:56', '2024-03-05 03:59:56'),
(32, 17, 0.2, 0, 0, '', '2024-03-05 04:00:46', '2024-03-05 04:00:46'),
(36, 17, -0.2, 0, 16, '\"món 2\" x 2', '2024-03-05 06:58:18', '2024-03-05 06:58:18'),
(38, 17, -0.6, 0, 16, '\"m2\" x 1', '2024-03-05 06:58:18', '2024-03-05 06:58:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tables`
--

CREATE TABLE `tables` (
  `id` int(11) NOT NULL,
  `areaID` int(11) DEFAULT NULL,
  `tableName` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tables`
--

INSERT INTO `tables` (`id`, `areaID`, `tableName`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'bàn A-1', 0, '2024-02-17 09:40:14', '2024-03-12 03:21:02'),
(36, 22, 'B-1', 0, '2024-02-27 16:48:35', '2024-03-18 09:34:30'),
(37, 22, 'B-2', 0, '2024-02-28 14:31:52', '2024-03-18 09:34:34'),
(38, 1, 'A-3', 1, '2024-02-28 14:35:08', '2024-03-15 08:17:44');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `restaurantID` int(11) DEFAULT NULL,
  `userName` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `restaurantID`, `userName`, `phone`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'admin', '123', '$2a$10$5NzApwtSqinDDxNvfUIb9ua2mO8aykpuiMhMyfeoRAznbkX3KB14O', 3, '2024-03-06 08:00:19', '2024-03-06 17:15:12'),
(3, 1, 'nv1', '1234', '$2a$10$IoM9zxVJ.i1W0vNOIEw8k.szIERQ8Pgefpw/p2NTsvZBv2H6hHRz.', 2, '2024-03-06 11:16:00', '2024-03-06 13:36:22'),
(4, 1, 'nv2', '12345', '$2a$10$PouXZmA4zoX2qQ006Kee3OK14xZ8eLL9r7eAJ3hLL7Ydo0RjrG332', 1, '2024-03-06 11:16:00', '2024-03-06 17:15:56'),
(5, 1, 'nv3', '111', '$2a$10$PouXZmA4zoX2qQ006Kee3OK14xZ8eLL9r7eAJ3hLL7Ydo0RjrG332', 0, '2024-03-06 12:26:18', '2024-03-06 17:16:04');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `costs`
--
ALTER TABLE `costs`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `materials`
--
ALTER TABLE `materials`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `menumaterials`
--
ALTER TABLE `menumaterials`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `menus` ADD FULLTEXT KEY `name_of_index` (`menuName`);
ALTER TABLE `menus` ADD FULLTEXT KEY `menuName` (`menuName`);
ALTER TABLE `menus` ADD FULLTEXT KEY `menuName_2` (`menuName`);
ALTER TABLE `menus` ADD FULLTEXT KEY `menuName_3` (`menuName`);
ALTER TABLE `menus` ADD FULLTEXT KEY `menuName_4` (`menuName`);
ALTER TABLE `menus` ADD FULLTEXT KEY `menuName_5` (`menuName`);
ALTER TABLE `menus` ADD FULLTEXT KEY `menuName_6` (`menuName`);
ALTER TABLE `menus` ADD FULLTEXT KEY `menuName_7` (`menuName`);
ALTER TABLE `menus` ADD FULLTEXT KEY `menuName_8` (`menuName`);
ALTER TABLE `menus` ADD FULLTEXT KEY `menuName_9` (`menuName`);
ALTER TABLE `menus` ADD FULLTEXT KEY `menuName_10` (`menuName`);
ALTER TABLE `menus` ADD FULLTEXT KEY `menuName_11` (`menuName`);
ALTER TABLE `menus` ADD FULLTEXT KEY `menuName_12` (`menuName`);
ALTER TABLE `menus` ADD FULLTEXT KEY `menuName_13` (`menuName`);
ALTER TABLE `menus` ADD FULLTEXT KEY `menuName_14` (`menuName`);
ALTER TABLE `menus` ADD FULLTEXT KEY `menuName_15` (`menuName`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `shifts`
--
ALTER TABLE `shifts`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `storages`
--
ALTER TABLE `storages`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `areas`
--
ALTER TABLE `areas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT cho bảng `costs`
--
ALTER TABLE `costs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT cho bảng `materials`
--
ALTER TABLE `materials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `menumaterials`
--
ALTER TABLE `menumaterials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT cho bảng `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT cho bảng `restaurants`
--
ALTER TABLE `restaurants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shifts`
--
ALTER TABLE `shifts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `storages`
--
ALTER TABLE `storages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT cho bảng `tables`
--
ALTER TABLE `tables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
