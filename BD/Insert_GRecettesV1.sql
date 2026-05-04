USE `GestionRecettes` ;

-- 1. Insertion de l'administrateur
INSERT INTO `users` (`name`, `mail`, `password`, `firstCon`) 
VALUES ('Jaruphong', 'jaruphong.plancherel@eduvaud.ch', NULL, 1);

-- 2. Insertion des catégories
INSERT INTO `categories` (`name`) VALUES ('Entrées'), ('Plats Principaux'), ('Desserts');

-- 3. Insertion des ingrédients
INSERT INTO `ingredients` (`name`) VALUES 
('Pâtes de riz'), ('Crevettes'), ('Lait de coco'), ('Poulet'), 
('Curry vert'), ('Citronnelle'), ('Coriandre'), ('Sucre de palme');

-- 4. Insertion des recettes
-- Recette 1 : Pad Thaï
INSERT INTO `recipes` (`title`, `prepareTime`, `cookTime`, `portion`, `description`, `photo`, `moyNote`, `category_id`)
VALUES (
  'Pad Thaï Traditionnel', 20, 10, 2, 
  'Le célèbre sauté de nouilles thaïlandaises avec crevettes, tofu et cacahuètes.', 
  'pad_thai.jpg', 4.5, 2
);

-- Recette 2 : Curry Vert (Gaeng Keow Wan)
INSERT INTO `recipes` (`title`, `prepareTime`, `cookTime`, `portion`, `description`, `photo`, `moyNote`, `category_id`)
VALUES (
  'Curry Vert au Poulet', 15, 20, 4, 
  'Un curry parfumé à base de lait de coco, de pâte de curry vert et de basilic thaï.', 
  'green_curry.jpg', 4.8, 2
);

-- 5. Liaison Recettes / Ingrédients (Table recipes_has_ingredients)
-- Ingrédients pour Pad Thaï (ID 1)
INSERT INTO `recipes_has_ingredients` (`quantity`, `unity`, `recipe_id`, `ingredient_id`) 
VALUES (250, 'g', 1, 1), (200, 'g', 1, 2), (2, 'c.s.', 1, 8);

-- Ingrédients pour Curry Vert (ID 2)
INSERT INTO `recipes_has_ingredients` (`quantity`, `unity`, `recipe_id`, `ingredient_id`) 
VALUES (400, 'ml', 2, 3), (500, 'g', 2, 4), (3, 'c.s.', 2, 5);

-- 6. Quelques avis de test
INSERT INTO `reviews` (`value`, `recipe_id`) VALUES (5, 1), (4, 1), (5, 2);