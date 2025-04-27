-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: market_db
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `baza_orders`
--

DROP TABLE IF EXISTS `baza_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baza_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `market_order_id` int NOT NULL,
  `status` enum('pending','completed') DEFAULT 'pending',
  `total_amount` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `market_order_id` (`market_order_id`),
  CONSTRAINT `baza_orders_ibfk_1` FOREIGN KEY (`market_order_id`) REFERENCES `market_orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `baza_orders`
--

LOCK TABLES `baza_orders` WRITE;
/*!40000 ALTER TABLE `baza_orders` DISABLE KEYS */;
INSERT INTO `baza_orders` VALUES (1,37,'pending',20.00,'2025-04-18 13:30:30'),(2,38,'pending',20.00,'2025-04-18 13:30:57'),(3,40,'pending',20.00,'2025-04-18 13:57:58'),(4,41,'pending',40.00,'2025-04-18 13:58:32'),(5,42,'pending',60.00,'2025-04-18 14:00:03'),(6,42,'pending',60.00,'2025-04-18 14:00:04'),(7,43,'pending',20.00,'2025-04-18 14:27:20'),(8,48,'pending',20.00,'2025-04-18 14:38:31'),(9,50,'pending',20.00,'2025-04-18 14:42:02'),(10,51,'pending',40.00,'2025-04-18 14:42:23'),(11,51,'pending',40.00,'2025-04-18 14:42:23'),(12,52,'pending',60.00,'2025-04-18 14:42:39'),(13,53,'pending',20.00,'2025-04-18 15:14:05'),(14,58,'pending',20.00,'2025-04-18 17:55:02');
/*!40000 ALTER TABLE `baza_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `baza_prices`
--

DROP TABLE IF EXISTS `baza_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baza_prices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `price` decimal(10,2) DEFAULT '0.00',
  `total` decimal(10,2) DEFAULT '0.00',
  `grand_total` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `baza_prices_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `baza_prices`
--

LOCK TABLES `baza_prices` WRITE;
/*!40000 ALTER TABLE `baza_prices` DISABLE KEYS */;
/*!40000 ALTER TABLE `baza_prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `baza_total_goods`
--

DROP TABLE IF EXISTS `baza_total_goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baza_total_goods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `market_id` int NOT NULL,
  `total_goods` decimal(10,2) DEFAULT '0.00',
  `transaction_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_market_date` (`market_id`,`transaction_date`),
  CONSTRAINT `baza_total_goods_ibfk_1` FOREIGN KEY (`market_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `baza_total_goods`
--

LOCK TABLES `baza_total_goods` WRITE;
/*!40000 ALTER TABLE `baza_total_goods` DISABLE KEYS */;
/*!40000 ALTER TABLE `baza_total_goods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `draft_orders`
--

DROP TABLE IF EXISTS `draft_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `draft_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `market_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` decimal(10,2) DEFAULT '0.00',
  `received_quantity` decimal(10,2) DEFAULT '0.00',
  `price` decimal(10,2) DEFAULT '0.00',
  `total` decimal(10,2) DEFAULT '0.00',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `market_product_unique` (`market_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `draft_orders_ibfk_1` FOREIGN KEY (`market_id`) REFERENCES `users` (`id`),
  CONSTRAINT `draft_orders_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=391 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `draft_orders`
--

LOCK TABLES `draft_orders` WRITE;
/*!40000 ALTER TABLE `draft_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `draft_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `market_order_items`
--

DROP TABLE IF EXISTS `market_order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `market_order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `requested_quantity` decimal(10,2) DEFAULT '0.00',
  `received_quantity` decimal(10,2) DEFAULT '0.00',
  `price` decimal(10,2) DEFAULT '0.00',
  `total` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `market_order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `market_orders` (`id`),
  CONSTRAINT `market_order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=293 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_order_items`
--

LOCK TABLES `market_order_items` WRITE;
/*!40000 ALTER TABLE `market_order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `market_order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `market_orders`
--

DROP TABLE IF EXISTS `market_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `market_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `market_id` int NOT NULL,
  `status` enum('pending','approved','completed') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `market_id` (`market_id`),
  CONSTRAINT `market_orders_ibfk_1` FOREIGN KEY (`market_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_orders`
--

LOCK TABLES `market_orders` WRITE;
/*!40000 ALTER TABLE `market_orders` DISABLE KEYS */;
INSERT INTO `market_orders` VALUES (37,1,'approved','2025-04-18 13:28:59'),(38,2,'approved','2025-04-18 13:29:27'),(40,1,'approved','2025-04-18 13:56:51'),(41,2,'approved','2025-04-18 13:57:13'),(42,3,'approved','2025-04-18 13:57:36'),(43,1,'approved','2025-04-18 14:26:19'),(48,1,'approved','2025-04-18 14:37:53'),(50,1,'approved','2025-04-18 14:41:04'),(51,2,'approved','2025-04-18 14:41:23'),(52,3,'approved','2025-04-18 14:41:38'),(53,1,'approved','2025-04-18 15:13:25'),(58,1,'approved','2025-04-18 17:54:18');
/*!40000 ALTER TABLE `market_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `market_total_received`
--

DROP TABLE IF EXISTS `market_total_received`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `market_total_received` (
  `id` int NOT NULL AUTO_INCREMENT,
  `market_id` int NOT NULL,
  `total_amount` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_market` (`market_id`),
  CONSTRAINT `market_total_received_ibfk_1` FOREIGN KEY (`market_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_total_received`
--

LOCK TABLES `market_total_received` WRITE;
/*!40000 ALTER TABLE `market_total_received` DISABLE KEYS */;
INSERT INTO `market_total_received` VALUES (1,1,0.00,'2025-04-20 13:33:45','2025-04-23 17:23:43'),(28,2,0.00,'2025-04-20 15:33:02','2025-04-20 16:25:35'),(29,3,0.00,'2025-04-20 15:33:57','2025-04-20 16:25:58');
/*!40000 ALTER TABLE `market_total_received` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `market_transactions`
--

DROP TABLE IF EXISTS `market_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `market_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `market_id` int NOT NULL,
  `total_received` decimal(10,2) DEFAULT '0.00',
  `damaged_goods` decimal(10,2) DEFAULT '0.00',
  `cash_register` decimal(10,2) DEFAULT '0.00',
  `cash` decimal(10,2) DEFAULT '0.00',
  `salary` decimal(10,2) DEFAULT '0.00',
  `expenses` decimal(10,2) DEFAULT '0.00',
  `difference` decimal(10,2) DEFAULT '0.00',
  `remainder` decimal(10,2) DEFAULT '0.00',
  `transaction_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `market_id` (`market_id`),
  CONSTRAINT `market_transactions_ibfk_1` FOREIGN KEY (`market_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_transactions`
--

LOCK TABLES `market_transactions` WRITE;
/*!40000 ALTER TABLE `market_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `market_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Голден',1,'2025-04-13 19:40:55'),(2,'Ябл новый урожай',1,'2025-04-13 19:40:55'),(3,'Гала',1,'2025-04-13 19:40:55'),(4,'Малика',1,'2025-04-13 19:40:55'),(5,'Антоновка',1,'2025-04-13 19:40:55'),(6,'Айдарет',1,'2025-04-13 19:40:55'),(7,'Слава победа',1,'2025-04-13 19:40:55'),(8,'Сеян',1,'2025-04-13 19:40:55'),(9,'Конференс',1,'2025-04-13 19:40:55'),(10,'Форел',1,'2025-04-13 19:40:55'),(11,'Абат',1,'2025-04-13 19:40:55'),(12,'Авокадо',1,'2025-04-13 19:40:55'),(13,'Дюшес',1,'2025-04-13 19:40:55'),(14,'Кишмиш бел.',1,'2025-04-13 19:40:55'),(15,'Кишмиш крас.',1,'2025-04-13 19:40:55'),(16,'Тайфи',1,'2025-04-13 19:40:55'),(17,'Молдова',1,'2025-04-13 19:40:55'),(18,'Изабелла',1,'2025-04-13 19:40:55'),(19,'Дамский пальчик',1,'2025-04-13 19:40:55'),(20,'Клубника',1,'2025-04-13 19:40:55'),(21,'Малина',1,'2025-04-13 19:40:55'),(22,'Ежевика',1,'2025-04-13 19:40:55'),(23,'Крыжовник',1,'2025-04-13 19:40:55'),(24,'черника',1,'2025-04-13 19:40:55'),(25,'Банан',1,'2025-04-13 19:40:55'),(26,'Голубика',1,'2025-04-13 19:40:55'),(27,'Ананас',1,'2025-04-13 19:40:55'),(28,'киви',1,'2025-04-13 19:40:55'),(29,'Мандарины',1,'2025-04-13 19:40:55'),(30,'Черешня узбек',1,'2025-04-13 19:40:55'),(31,'черешня азер',1,'2025-04-13 19:40:55'),(32,'черешня розовая',1,'2025-04-13 19:40:55'),(33,'вишня',1,'2025-04-13 19:40:55'),(34,'нектарин',1,'2025-04-13 19:40:55'),(35,'персик',1,'2025-04-13 19:40:55'),(36,'персик плоский',1,'2025-04-13 19:40:55'),(37,'нектарин узбек',1,'2025-04-13 19:40:55'),(38,'лимон',1,'2025-04-13 19:40:55'),(39,'грейпфрукт',1,'2025-04-13 19:40:55'),(40,'апельсин',1,'2025-04-13 19:40:55'),(41,'гранат израиль',1,'2025-04-13 19:40:55'),(42,'абрикос тур',1,'2025-04-13 19:40:55'),(43,'абрикос шелех',1,'2025-04-13 19:40:55'),(44,'слива красн',1,'2025-04-13 19:40:55'),(45,'слива жел',1,'2025-04-13 19:40:55'),(46,'чернослив молд',1,'2025-04-13 19:40:55'),(47,'Колхозница',1,'2025-04-20 17:21:10'),(48,'Арбуз',1,'2025-04-20 17:21:10'),(49,'Торпеда',1,'2025-04-20 17:21:10'),(50,'Хурма испания',1,'2025-04-20 17:21:10'),(51,'Королёк',1,'2025-04-20 17:21:10'),(52,'Хурма пом',1,'2025-04-20 17:21:10'),(53,'Хурма мед',1,'2025-04-20 17:21:10'),(54,'Пом. Сварка',1,'2025-04-20 17:21:10'),(55,'Помидор ростов 4',1,'2025-04-20 17:21:10'),(56,'Помидор ростов 6',1,'2025-04-20 17:21:10'),(57,'Помидор роз 4',1,'2025-04-20 17:21:10'),(58,'Помидор 6',1,'2025-04-20 17:21:10'),(59,'Помидор Азерб',1,'2025-04-20 17:21:10'),(60,'Сливка',1,'2025-04-20 17:21:10'),(61,'Ветка',1,'2025-04-20 17:21:10'),(62,'Черри мой',1,'2025-04-20 17:21:10'),(63,'Розовый уз',1,'2025-04-20 17:21:10'),(64,'Огурцы б.д.',1,'2025-04-20 17:21:10'),(65,'Миринда',1,'2025-04-20 17:21:10'),(66,'Огурцы луковец',1,'2025-04-20 17:21:10'),(67,'Перец кр',1,'2025-04-20 17:21:10'),(68,'Перец жел',1,'2025-04-20 17:21:10'),(69,'Перец мес',1,'2025-04-20 17:21:10'),(70,'Баклажан',1,'2025-04-20 17:21:10'),(71,'Кабачки',1,'2025-04-20 17:21:10'),(72,'Цв. Капуста',1,'2025-04-20 17:21:11'),(73,'Тыква',1,'2025-04-20 17:21:11'),(74,'Чеснок',1,'2025-04-20 17:21:11'),(75,'Перец острый',1,'2025-04-20 17:21:11'),(76,'Салат б.д.',1,'2025-04-20 17:21:11'),(77,'Рукола',1,'2025-04-20 17:21:11'),(78,'Айсберг',1,'2025-04-20 17:21:11'),(79,'Сельдерей',1,'2025-04-20 17:21:11'),(80,'Лук ялта',1,'2025-04-20 17:21:11'),(81,'Горох',1,'2025-04-20 17:21:11'),(82,'Лук зелёный',1,'2025-04-20 17:21:11'),(83,'Зелень У П К',1,'2025-04-20 17:21:11'),(84,'Щавель',1,'2025-04-20 17:21:11'),(85,'Базилик',1,'2025-04-20 17:21:11'),(86,'Салат пекин',1,'2025-04-20 17:21:11'),(87,'Редис',1,'2025-04-20 17:21:11'),(88,'Редис вес',1,'2025-04-20 17:21:11'),(89,'Броколин',1,'2025-04-20 17:21:11'),(90,'Картофель молодой',1,'2025-04-20 17:21:11'),(91,'Имбирь',1,'2025-04-20 17:21:11'),(92,'Картофель бел',1,'2025-04-20 17:21:11'),(93,'Картофель роз',1,'2025-04-20 17:21:11'),(94,'Картофель синеглаз',1,'2025-04-20 17:21:11'),(95,'Лук репка',1,'2025-04-20 17:29:09'),(96,'Капуста',1,'2025-04-20 17:29:09'),(97,'Свекла',1,'2025-04-20 17:29:09'),(98,'Морковь',1,'2025-04-20 17:29:09'),(99,'Мартина',1,'2025-04-20 17:29:09'),(100,'Манго суш  \n',1,'2025-04-20 17:29:09'),(101,'Грец орех',1,'2025-04-20 17:29:09'),(102,'Фундук',1,'2025-04-20 17:29:09'),(103,'Кешью сырой',1,'2025-04-20 17:29:09'),(104,'Курата',1,'2025-04-20 17:29:09'),(105,'Чернослив с.ф.',1,'2025-04-20 17:29:09'),(106,'Изюм бел.',1,'2025-04-20 17:29:09'),(107,'Изюм чёрн.  \n',1,'2025-04-20 17:29:09'),(108,'Фисташка',1,'2025-04-20 17:29:09'),(109,'Миндаль',1,'2025-04-20 17:29:09'),(110,'Грец. Орех цили',1,'2025-04-20 17:29:09'),(111,'Финики ул',1,'2025-04-20 17:29:09'),(112,'Финик король',1,'2025-04-20 17:29:09'),(113,'Орех бразильский',1,'2025-04-20 17:29:09'),(114,'Сок гранат большой',1,'2025-04-20 17:29:09'),(115,'Тимнар',1,'2025-04-20 17:29:09'),(116,'Баржоми',1,'2025-04-20 17:29:09'),(117,'Лимонад натахтари',1,'2025-04-20 17:29:09'),(118,'Семечки сыр',1,'2025-04-20 17:29:09'),(119,'Пакет',1,'2025-04-20 17:29:09'),(120,'Солёная капуста',1,'2025-04-20 17:29:09'),(121,'Солёные огурцы',1,'2025-04-20 17:29:09'),(122,'Солёные помидоры',1,'2025-04-20 17:29:10'),(123,'Солёный перец',1,'2025-04-20 17:29:10'),(124,'Спаржа',1,'2025-04-20 17:29:10'),(125,'Клюква',1,'2025-04-20 17:29:10');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `market_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `paid_amount` decimal(10,2) NOT NULL,
  `remaining_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','cancelled') DEFAULT 'pending',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `market_id` (`market_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`market_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` enum('market','baza','admin') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'market1@panel.com','$2a$10$s/hi1ibA5fYf5fvTVF4TY.Mhtpujox.MaDSw9m5lmKju1N.ELRhgG','Market 1','market','2025-04-13 19:40:55'),(2,'market2@panel.com','$2a$10$TZ1cO5GZoMmz6ILwrfrB3ultuHvnZkmFN/IHYI/hzX34EhmnTW9aa','Market 2','market','2025-04-13 19:40:55'),(3,'market3@panel.com','$2a$10$K99oSIucFkNt/f7W5yTkwuFWInfdCvPpscj3rExZOGiW0Qj4Fioz6','Market 3','market','2025-04-13 19:40:55'),(4,'market4@panel.com','$2a$10$hyTdDfDVsvCmpn1LGt1LfO0UOXRYcSjoN/fms0xg7FwGxeKYp0gMS','Market 4','market','2025-04-13 19:40:55'),(5,'market5@panel.com','$2a$10$uWSpbyf2wkKsEv9VP528.e2fAGEaQWEtgHhrjr5daSP.PzM9Tqb.m','Market 5','market','2025-04-13 19:40:55'),(6,'market6@panel.com','$2a$10$eFtvY7yIR2X29AgYsVw9kOKrqXusXJNRc4ldqfhryD4ompRtkA0Kq','Market 6','market','2025-04-13 19:40:55'),(7,'market7@panel.com','$2a$10$H28HeqDM3dADenxn9pEt1OMKURZ0WEls5UoIGCMHP5XeBvMlAaQcq','Market 7','market','2025-04-13 19:40:55'),(8,'market8@panel.com','$2a$10$H7D.hVLqS42WbDyIUNZ.j.pjdsZLeAj5y0.F7KcrJnegIVXamKCRm','Market 8','market','2025-04-13 19:40:55'),(9,'market9@panel.com','$2a$10$qi8cgHsOhpJsv7TQ.I5DKesKjTg7RPsqRdTdFzjD6Ty5gPkghCCU.','Market 9','market','2025-04-13 19:40:55'),(10,'market10@panel.com','$2a$10$SJ27EdP6YOIAnIZ.40iVEu1DR61ZW9fsbpRZZNQHDlRVZU86yhJ3u','Market 10','market','2025-04-13 19:40:55'),(11,'market11@panel.com','$2a$10$l3bDwvMpPP4pn6xoCPCqo.nK5k2gcDSNDIkVkZkRIyEIHBic2jCNK','Market 11','market','2025-04-13 19:40:55'),(12,'market12@panel.com','$2a$10$EILS0AVhCvaJqPoCqh7PauAY7gzk.HoFU4Ou1epF8cYzeXfIkPdBK','Market 12','market','2025-04-13 19:40:55'),(13,'market13@panel.com','$2a$10$QJ3g58q/A10DLmQO.id.8.xlPyNEwE4iLhA5YmvUDpFsphDZgk1S6','Market 13','market','2025-04-13 19:40:55'),(14,'market14@panel.com','$2a$10$BRpISpYfG42x4vOCK8oQRu7vJGzGLxu/QbRHzxcgRAfkkYlS4YAXW','Market 14','market','2025-04-13 19:40:55'),(15,'market15@panel.com','$2a$10$zH1FC0Ajx48o4ZPR3l8CTebRvyHaFMLZN8D2WN3h2xMnWNxIoF8a.','Market 15','market','2025-04-13 19:40:55'),(16,'baza@panel.com','$2a$10$q4fh4xj5TzheT4iopuxqeehS6YdXhJkprvlYtF3AyxsGSjm59LAeS','Baza İdarəetmə','baza','2025-04-13 19:40:55'),(17,'admin@panel.com','$2a$10$Is2Gd5NyFFb6FWx0uGDD1uFJGFfVFhz57ivCqeSTTtmtP5Ytd5cgK','Admin Panel','admin','2025-04-13 19:40:55');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-23 22:07:30
