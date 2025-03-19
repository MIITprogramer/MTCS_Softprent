-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 19 Mar 2025 pada 16.30
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mtcs_softpren`
--
CREATE DATABASE IF NOT EXISTS `mtcs_softpren` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `mtcs_softpren`;

-- --------------------------------------------------------

--
-- Struktur dari tabel `resulttype`
--

CREATE TABLE `resulttype` (
  `typeId` int(11) NOT NULL,
  `typeLabel` varchar(255) NOT NULL,
  `typeDesc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `resulttype`
--

INSERT INTO `resulttype` (`typeId`, `typeLabel`, `typeDesc`) VALUES
(1, 'OK/NG', 'Hasil pengamatan menghasilkan kesimpulan OK/NG.'),
(2, 'String', 'Hasil pengukuran ditulis dengan text tertentu dan dibandingkan dengan sebuah standar text.'),
(3, 'Exact Match Number', 'Hasil pengukuran ditulis dengan angka dan dibandingkan dengan standar harus sama persis.'),
(4, 'Number Range', 'Hasil pengukuran ditulis dengan angka dan dibandingkan dengan rentang angka standar.'),
(5, 'Number Larger Than', 'Hasil pengukuran ditulis dengan angka dan dibandingkan dengan standar angka minimum.'),
(6, 'Number Less Than', 'Hasil pengukuran ditulis dengan angka dan dibandingkan dengan standar angka maximum.');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tooldata`
--

CREATE TABLE `tooldata` (
  `dataId` int(11) NOT NULL,
  `columId` int(11) NOT NULL,
  `value` varchar(255) NOT NULL,
  `toolId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_checkmethod`
--

CREATE TABLE `t_checkmethod` (
  `methodId` int(11) NOT NULL,
  `pointCheckId` int(11) NOT NULL,
  `methodString` varchar(1024) NOT NULL,
  `resultType` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_collumns`
--

CREATE TABLE `t_collumns` (
  `collumnId` int(11) NOT NULL,
  `collumnEnString` varchar(255) NOT NULL,
  `columnJpString` varchar(255) NOT NULL,
  `isDefault` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `t_collumns`
--

INSERT INTO `t_collumns` (`collumnId`, `collumnEnString`, `columnJpString`, `isDefault`) VALUES
(1, 'Regis No.', ' 機種固有Ｎo.', 1),
(2, 'Range of\r\nMeasurement', '測定範囲', 1),
(3, 'Resolution', '最小表示量', 1),
(4, 'Calibration　Standard Accuracy (±）', '校正規格精度 (±）', 1),
(5, 'Serial No.', 'メーカー製造No．', 1),
(6, 'Registration Date', '登録日', 1),
(7, 'Maker', '製造者名', 1),
(8, 'Place', '場所', 1),
(9, 'Calibration Interval', '校正間隔', 0),
(10, 'Calibrated by', '作業許容精度', 0),
(11, 'Last\r\nCalibration', '最終校正日', 0),
(12, 'Next Calibration Plan', '次回の校正計画', 0),
(13, 'Actual Date Calibration', '実際の校正日', 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_pointcheck`
--

CREATE TABLE `t_pointcheck` (
  `checkId` int(11) NOT NULL,
  `typeId` int(11) NOT NULL,
  `pointString` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_rank`
--

CREATE TABLE `t_rank` (
  `rankId` int(11) NOT NULL,
  `rankName` varchar(255) NOT NULL,
  `description` varchar(1024) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `t_rank`
--

INSERT INTO `t_rank` (`rankId`, `rankName`, `description`) VALUES
(1, 'Rank A', 'Rank with the name A'),
(8, 'Rank B', 'Rank with the name B'),
(9, 'Rank C', 'Rank with the name C');

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_roles`
--

CREATE TABLE `t_roles` (
  `roleId` int(11) NOT NULL,
  `roleName` varchar(255) NOT NULL,
  `dashboardPage` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `t_roles`
--

INSERT INTO `t_roles` (`roleId`, `roleName`, `dashboardPage`) VALUES
(1, 'administrator', '/home/dashboard'),
(4, 'operator', '/home/dashboard');

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_tools`
--

CREATE TABLE `t_tools` (
  `toolId` int(11) NOT NULL,
  `toolName` varchar(255) NOT NULL,
  `typeId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_tooltype`
--

CREATE TABLE `t_tooltype` (
  `typeId` int(11) NOT NULL,
  `typeName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_user`
--

CREATE TABLE `t_user` (
  `userId` varchar(255) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `roleId` int(11) NOT NULL,
  `userPassword` varchar(2048) NOT NULL,
  `active` int(11) NOT NULL DEFAULT 1,
  `lastLogin` timestamp NULL DEFAULT NULL,
  `lastIP` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `t_user`
--

INSERT INTO `t_user` (`userId`, `userName`, `roleId`, `userPassword`, `active`, `lastLogin`, `lastIP`) VALUES
('system', 'MIIT DEVELOPER', 1, 'U2FsdGVkX1/rkR8/1pL6MUJvxfVtSk7Nd+lC8x3y08s=', 1, '2025-03-18 16:16:48', '192.168.1.188');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `resulttype`
--
ALTER TABLE `resulttype`
  ADD PRIMARY KEY (`typeId`);

--
-- Indeks untuk tabel `tooldata`
--
ALTER TABLE `tooldata`
  ADD PRIMARY KEY (`dataId`);

--
-- Indeks untuk tabel `t_checkmethod`
--
ALTER TABLE `t_checkmethod`
  ADD PRIMARY KEY (`methodId`);

--
-- Indeks untuk tabel `t_collumns`
--
ALTER TABLE `t_collumns`
  ADD PRIMARY KEY (`collumnId`);

--
-- Indeks untuk tabel `t_pointcheck`
--
ALTER TABLE `t_pointcheck`
  ADD PRIMARY KEY (`checkId`);

--
-- Indeks untuk tabel `t_rank`
--
ALTER TABLE `t_rank`
  ADD PRIMARY KEY (`rankId`);

--
-- Indeks untuk tabel `t_roles`
--
ALTER TABLE `t_roles`
  ADD PRIMARY KEY (`roleId`);

--
-- Indeks untuk tabel `t_tools`
--
ALTER TABLE `t_tools`
  ADD PRIMARY KEY (`toolId`);

--
-- Indeks untuk tabel `t_tooltype`
--
ALTER TABLE `t_tooltype`
  ADD PRIMARY KEY (`typeId`);

--
-- Indeks untuk tabel `t_user`
--
ALTER TABLE `t_user`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `resulttype`
--
ALTER TABLE `resulttype`
  MODIFY `typeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `tooldata`
--
ALTER TABLE `tooldata`
  MODIFY `dataId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `t_checkmethod`
--
ALTER TABLE `t_checkmethod`
  MODIFY `methodId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `t_collumns`
--
ALTER TABLE `t_collumns`
  MODIFY `collumnId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `t_pointcheck`
--
ALTER TABLE `t_pointcheck`
  MODIFY `checkId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `t_rank`
--
ALTER TABLE `t_rank`
  MODIFY `rankId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `t_roles`
--
ALTER TABLE `t_roles`
  MODIFY `roleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `t_tools`
--
ALTER TABLE `t_tools`
  MODIFY `toolId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `t_tooltype`
--
ALTER TABLE `t_tooltype`
  MODIFY `typeId` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
