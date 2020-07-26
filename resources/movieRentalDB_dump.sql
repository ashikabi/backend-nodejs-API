CREATE DATABASE  IF NOT EXISTS `movierental` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `movierental`;
-- MySQL dump 10.13  Distrib 8.0.20, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: movierental
-- ------------------------------------------------------
-- Server version 8.0.20-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `movie`
--

DROP TABLE IF EXISTS `movie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` varchar(250) DEFAULT NULL,
  `image` varchar(250) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `rentalPrice` decimal(9,2) NOT NULL DEFAULT '0.00',
  `salePrice` decimal(9,2) NOT NULL DEFAULT '0.00',
  `availability` tinyint NOT NULL DEFAULT '1',
  `status` char(1) NOT NULL DEFAULT 'A',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie`
--

LOCK TABLES `movie` WRITE;
/*!40000 ALTER TABLE `movie` DISABLE KEYS */;
INSERT INTO `movie` VALUES (1,'MUC: Daredevil','The Oldschool Marvel Before 2008(IronMan)','https://upload.wikimedia.org/wikipedia/en/0/04/Daredevil_poster.JPG',7,6.99,5.50,1,'A'),(2,'Black Panther','Marvel Universe','https://m.media-amazon.com/images/I/51zpKk5j26L._SY346_.jpg',5,7.99,12.99,1,'A'),(3,'Superman','DC comics','https://m.media-amazon.com/images/I/51zpKk5j26L._SY346_.jpg',12,4.99,8.99,1,'A'),(4,'Batman','DC comics','https://m.media-amazon.com/images/I/51zpKk5j26L._SY346_.jpg',12,4.99,8.99,1,'A'),(5,'Aquaman','DC comics','https://m.media-amazon.com/images/I/51zpKk5j26L._SY346_.jpg',12,4.99,8.99,1,'D'),(6,'Dracula','Netflix','https://m.media-amazon.com/images/I/51zpKk5j26L._SY346_.jpg',10,3.99,5.00,0,'A'),(7,'Sirenita','Disney','https://m.media-amazon.com/images/I/51zpKk5j26L._SY346_.jpg',8,1.99,4.00,0,'A');
/*!40000 ALTER TABLE `movie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie_like`
--

DROP TABLE IF EXISTS `movie_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_like` (
  `id` int NOT NULL AUTO_INCREMENT,
  `movieId` int NOT NULL,
  `userId` int NOT NULL,
  `like` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_like`
--

LOCK TABLES `movie_like` WRITE;
/*!40000 ALTER TABLE `movie_like` DISABLE KEYS */;
INSERT INTO `movie_like` VALUES (4,1,2,1),(5,1,3,1),(6,1,4,1),(7,1,5,1),(8,2,1,1),(9,2,2,1),(10,2,3,1),(11,2,4,1),(12,2,6,1),(13,4,3,1),(14,4,4,1),(15,5,5,1),(16,7,6,1),(17,7,5,1),(18,7,4,1);
/*!40000 ALTER TABLE `movie_like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie_log`
--

DROP TABLE IF EXISTS `movie_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `movieId` int NOT NULL,
  `oldTitle` varchar(100) NOT NULL,
  `newTitle` varchar(100) NOT NULL,
  `oldRentalPrice` decimal(9,2) NOT NULL,
  `newRentalPrice` decimal(9,2) NOT NULL,
  `oldSalePrice` decimal(9,2) NOT NULL,
  `newSalePrice` varchar(45) NOT NULL,
  `updatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_log`
--

LOCK TABLES `movie_log` WRITE;
/*!40000 ALTER TABLE `movie_log` DISABLE KEYS */;
INSERT INTO `movie_log` VALUES (1,1,'MUC: Daredevil','MUC: Daredevil',6.99,6.99,9.99,'9.99','2020-07-19 07:07:42'),(2,1,'MUC: Daredevil','MUC: Daredevil',6.99,6.99,9.99,'5.5','2020-07-19 07:11:26');
/*!40000 ALTER TABLE `movie_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie_rental`
--

DROP TABLE IF EXISTS `movie_rental`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_rental` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `movieId` int NOT NULL,
  `rentalDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `shouldReturnDate` timestamp NOT NULL,
  `returnDate` timestamp NULL DEFAULT NULL,
  `penalty` decimal(9,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_rental`
--

LOCK TABLES `movie_rental` WRITE;
/*!40000 ALTER TABLE `movie_rental` DISABLE KEYS */;
INSERT INTO `movie_rental` VALUES (9,2,1,'2020-07-10 06:00:00','2020-07-15 06:00:00','2020-07-19 23:03:12',1.40);
/*!40000 ALTER TABLE `movie_rental` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_and_rental`
--

DROP TABLE IF EXISTS `purchase_and_rental`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_and_rental` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `movieId` int NOT NULL,
  `transaction` char(1) NOT NULL,
  `quantity` int NOT NULL,
  `transactionDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_and_rental`
--

LOCK TABLES `purchase_and_rental` WRITE;
/*!40000 ALTER TABLE `purchase_and_rental` DISABLE KEYS */;
INSERT INTO `purchase_and_rental` VALUES (1,2,1,'R',3,'2020-07-10 19:50:37'),(2,2,1,'P',3,'2020-07-20 00:36:49');
/*!40000 ALTER TABLE `purchase_and_rental` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(256) NOT NULL,
  `role` varchar(20) NOT NULL,
  `status` char(1) NOT NULL DEFAULT 'A',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'jrartiga001@gmail.com','qwerty1234','ADMIN_ROLE','A','2020-07-18 05:00:37'),(2,'artigarobertojose@gmail.com','qwerty1234','USER_ROLE','A','2020-07-18 05:01:03'),(3,'admin.user@gmail.com','qwerty1234','ADMIN_ROLE','A','2020-07-21 00:19:35'),(4,'user.email@gmail.com','qwerty1234','USER_ROLE','A','2020-07-21 00:19:46'),(5,'user.email03@gmail.com','qwerty1234','USER_ROLE','A','2020-07-21 00:19:57'),(6,'user.email04@gmail.com','qwerty1234','USER_ROLE','A','2020-07-21 00:20:02'),(7,'user.email05@gmail.com','qwerty1234','USER_ROLE','A','2020-07-21 00:20:10');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-07-20 21:48:48
