-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 06, 2021 at 05:51 PM
-- Server version: 5.7.24
-- PHP Version: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cookingtime`
--

-- --------------------------------------------------------

--
-- Table structure for table `contenir`
--

CREATE TABLE `contenir` (
  `idFiche` int(11) NOT NULL,
  `idIngredient` int(11) NOT NULL,
  `quantite` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Donne la quantité d''un ingrédient dans une fiche';

-- --------------------------------------------------------

--
-- Table structure for table `fiche`
--

CREATE TABLE `fiche` (
  `numFiche` int(11) NOT NULL,
  `nom` tinytext NOT NULL,
  `auteur` tinytext NOT NULL,
  `nbCouvert` int(11) NOT NULL,
  `Etapes` text NOT NULL,
  `type` int(11) NOT NULL,
  `suivi` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `ingredient`
--

CREATE TABLE `ingredient` (
  `idIngredient` int(11) NOT NULL,
  `nom` tinytext NOT NULL,
  `prixU` double NOT NULL,
  `allergene` tinyint(1) NOT NULL,
  `tva` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `unite` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Description de l''ingrédient';

-- --------------------------------------------------------

--
-- Table structure for table `peutcontenir`
--

CREATE TABLE `peutcontenir` (
  `recette` int(11) NOT NULL,
  `sousRecette` int(11) NOT NULL,
  `quantite` int(11) NOT NULL COMMENT 'nombre de fois où sousRecette est effectuée dans recette'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `suivi`
--

CREATE TABLE `suivi` (
  `idSuivi` int(11) NOT NULL,
  `date` date NOT NULL,
  `coutFixe` double NOT NULL,
  `coutPersonnel` double NOT NULL,
  `coutFluide` double NOT NULL,
  `perteAssaisonnement` double NOT NULL,
  `coeff` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Permet de connaître les fiches techniques d''un jour donné';

-- --------------------------------------------------------

--
-- Table structure for table `tva`
--

CREATE TABLE `tva` (
  `idTVA` int(11) NOT NULL,
  `valeur` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `typefiche`
--

CREATE TABLE `typefiche` (
  `idType` int(11) NOT NULL,
  `libelle` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Description des types de plats';

-- --------------------------------------------------------

--
-- Table structure for table `typeingredient`
--

CREATE TABLE `typeingredient` (
  `idType` int(11) NOT NULL,
  `libelle` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Type des ingrédients';

-- --------------------------------------------------------

--
-- Table structure for table `unite`
--

CREATE TABLE `unite` (
  `idUnite` int(11) NOT NULL,
  `libelle` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contenir`
--
ALTER TABLE `contenir`
  ADD PRIMARY KEY (`idFiche`,`idIngredient`),
  ADD KEY `ingredient` (`idIngredient`);

--
-- Indexes for table `fiche`
--
ALTER TABLE `fiche`
  ADD PRIMARY KEY (`numFiche`),
  ADD KEY `suivi` (`suivi`),
  ADD KEY `typeFiche` (`type`);

--
-- Indexes for table `ingredient`
--
ALTER TABLE `ingredient`
  ADD PRIMARY KEY (`idIngredient`),
  ADD KEY `valeurTVA` (`tva`),
  ADD KEY `typeIngredient` (`type`),
  ADD KEY `typeUnite` (`unite`);

--
-- Indexes for table `peutcontenir`
--
ALTER TABLE `peutcontenir`
  ADD PRIMARY KEY (`recette`,`sousRecette`),
  ADD KEY `sousRecette` (`sousRecette`);

--
-- Indexes for table `suivi`
--
ALTER TABLE `suivi`
  ADD PRIMARY KEY (`idSuivi`);

--
-- Indexes for table `tva`
--
ALTER TABLE `tva`
  ADD PRIMARY KEY (`idTVA`);

--
-- Indexes for table `typefiche`
--
ALTER TABLE `typefiche`
  ADD PRIMARY KEY (`idType`);

--
-- Indexes for table `typeingredient`
--
ALTER TABLE `typeingredient`
  ADD PRIMARY KEY (`idType`);

--
-- Indexes for table `unite`
--
ALTER TABLE `unite`
  ADD PRIMARY KEY (`idUnite`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `fiche`
--
ALTER TABLE `fiche`
  MODIFY `numFiche` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ingredient`
--
ALTER TABLE `ingredient`
  MODIFY `idIngredient` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suivi`
--
ALTER TABLE `suivi`
  MODIFY `idSuivi` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tva`
--
ALTER TABLE `tva`
  MODIFY `idTVA` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `typefiche`
--
ALTER TABLE `typefiche`
  MODIFY `idType` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `typeingredient`
--
ALTER TABLE `typeingredient`
  MODIFY `idType` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `unite`
--
ALTER TABLE `unite`
  MODIFY `idUnite` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contenir`
--
ALTER TABLE `contenir`
  ADD CONSTRAINT `fiche` FOREIGN KEY (`idFiche`) REFERENCES `fiche` (`numFiche`),
  ADD CONSTRAINT `ingredient` FOREIGN KEY (`idIngredient`) REFERENCES `ingredient` (`idIngredient`);

--
-- Constraints for table `fiche`
--
ALTER TABLE `fiche`
  ADD CONSTRAINT `suivi` FOREIGN KEY (`suivi`) REFERENCES `suivi` (`idSuivi`),
  ADD CONSTRAINT `typeFiche` FOREIGN KEY (`type`) REFERENCES `typefiche` (`idType`);

--
-- Constraints for table `ingredient`
--
ALTER TABLE `ingredient`
  ADD CONSTRAINT `typeIngredient` FOREIGN KEY (`type`) REFERENCES `typeingredient` (`idType`),
  ADD CONSTRAINT `typeUnite` FOREIGN KEY (`unite`) REFERENCES `unite` (`idUnite`),
  ADD CONSTRAINT `valeurTVA` FOREIGN KEY (`tva`) REFERENCES `tva` (`idTVA`);

--
-- Constraints for table `peutcontenir`
--
ALTER TABLE `peutcontenir`
  ADD CONSTRAINT `recette` FOREIGN KEY (`recette`) REFERENCES `fiche` (`numFiche`),
  ADD CONSTRAINT `sousRecette` FOREIGN KEY (`sousRecette`) REFERENCES `fiche` (`numFiche`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
