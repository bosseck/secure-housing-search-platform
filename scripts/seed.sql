-- Données de démonstration LogementSûr
TRUNCATE reports, visit_requests, listings, advertisers RESTART IDENTITY CASCADE;

INSERT INTO advertisers (name, kind, email, phone, company, id_document_provided, ownership_proof_provided, siret, verification_status, verification_note, verified_at, created_at) VALUES
('Claire Dubois', 'particulier', 'claire.dubois@exemple.fr', '06 12 45 78 90', NULL, true, true, NULL, 'verifie', 'Identité et taxe foncière confirmées.', NOW() - INTERVAL '40 days', NOW() - INTERVAL '42 days'),
('Agence Horizon Immobilier', 'agence', 'contact@horizon-immo.fr', '04 78 22 10 34', 'Horizon Immobilier', true, true, '812 345 678 00021', 'verifie', 'SIRET actif, carte professionnelle CPI vérifiée.', NOW() - INTERVAL '90 days', NOW() - INTERVAL '92 days'),
('Karim Benali', 'particulier', 'k.benali@exemple.fr', '06 98 32 14 57', NULL, true, true, NULL, 'verifie', 'Identité et titre de propriété confirmés.', NOW() - INTERVAL '20 days', NOW() - INTERVAL '21 days'),
('Sophie Marchand', 'particulier', 'sophie.marchand@exemple.fr', '07 61 23 89 04', NULL, true, true, NULL, 'verifie', 'Dossier complet validé.', NOW() - INTERVAL '12 days', NOW() - INTERVAL '13 days'),
('Résidences Bellevue (agence)', 'agence', 'location@bellevue-residences.fr', '01 45 67 88 12', 'Bellevue Résidences', true, true, '934 221 876 00015', 'verifie', 'Mandats de gestion vérifiés pour 3 biens.', NOW() - INTERVAL '60 days', NOW() - INTERVAL '61 days'),
('Marc Lefèvre', 'particulier', 'marc.lefevre@exemple.fr', '06 44 55 66 77', NULL, true, true, NULL, 'en_attente', NULL, NULL, NOW() - INTERVAL '1 day'),
('« James Wilson »', 'particulier', 'j.wilson.rent@exemple.fr', '+44 700 900 123', NULL, true, false, NULL, 'rejete', 'Justificatif de propriété falsifié, demande de paiement avant visite.', NULL, NOW() - INTERVAL '8 days');

INSERT INTO listings (advertiser_id, title, description, property_type, city, district, approx_zone, price, charges_included, deposit_months, surface, rooms, furnished, available_from, conditions, photos, status, report_count, created_at) VALUES
(1, 'T2 lumineux au cœur de la Croix-Rousse',
 'Charmant appartement de 45 m² au 3ᵉ étage d''un immeuble en pierre, entièrement rénové en 2024.\n\nSéjour baigné de lumière avec cuisine ouverte équipée, chambre avec placard, salle d''eau moderne. Parquet d''origine, double vitrage, chauffage individuel gaz.\n\nÀ 4 minutes à pied du métro Croix-Rousse, commerces et marché quotidien sur le boulevard. Cave privative incluse.',
 'appartement', 'Lyon', 'Croix-Rousse', 'Zone approximative de 500 m autour de la Croix-Rousse, Lyon', 780, true, 1, 45, 2, false, '1er mars 2026',
 'Garant ou garantie Visale demandé. Revenus nets ≥ 3× le loyer. Animaux acceptés sur accord.',
 ARRAY['https://images.pexels.com/photos/8089172/pexels-photo-8089172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200','https://images.pexels.com/photos/7167073/pexels-photo-7167073.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200','https://images.pexels.com/photos/6489096/pexels-photo-6489096.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'],
 'verifiee', 0, NOW() - INTERVAL '35 days'),
(2, 'Grand T3 familial proche Part-Dieu',
 'Appartement familial de 68 m² au 5ᵉ étage avec ascenseur, dans une résidence sécurisée et calme.\n\nDouble séjour, deux chambres, cuisine séparée équipée, salle de bain avec baignoire, WC indépendants. Balcon filant exposé sud, place de parking en sous-sol en option (+60 €/mois).\n\nÀ 8 minutes de la gare Part-Dieu, écoles et parc à proximité immédiate.',
 'appartement', 'Lyon', 'Part-Dieu', 'Zone approximative de 500 m autour de la Part-Dieu, Lyon', 1150, false, 2, 68, 3, false, 'Immédiatement',
 'Dossier complet exigé (pièce d''identité, 3 derniers bulletins de salaire, avis d''imposition). Garantie Visale acceptée.',
 ARRAY['https://images.pexels.com/photos/7173666/pexels-photo-7173666.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200','https://images.pexels.com/photos/7587783/pexels-photo-7587783.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'],
 'verifiee', 1, NOW() - INTERVAL '30 days'),
(3, 'Studio meublé étudiant — quartier Latin',
 'Studio de 22 m² entièrement meublé et équipé, idéal étudiant ou jeune actif.\n\nCoin cuisine (plaques, frigo, micro-ondes), espace nuit avec lit 140, bureau, salle d''eau. Fibre incluse dans les charges, laverie dans l''immeuble.\n\nMétro ligne 7 à 3 minutes, universités accessibles en 15 minutes.',
 'studio', 'Paris', 'Quartier Latin', 'Zone approximative de 500 m autour du Quartier Latin, Paris', 890, true, 1, 22, 1, true, '15 février 2026',
 'Bail étudiant 9 mois ou bail mobilité. Garant obligatoire. Dossier via Garantme accepté.',
 ARRAY['https://images.pexels.com/photos/18470969/pexels-photo-18470969.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200','https://images.pexels.com/photos/6489096/pexels-photo-6489096.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'],
 'verifiee', 0, NOW() - INTERVAL '18 days'),
(4, 'Maison 4 pièces avec jardin — Bordeaux Caudéran',
 'Maison de plain-pied de 92 m² avec jardin clos de 200 m², dans une rue résidentielle très calme.\n\nSéjour de 32 m² ouvert sur la terrasse, trois chambres, cuisine aménagée, garage. Chauffage pompe à chaleur récent, excellente performance énergétique (DPE B).\n\nBus direct centre-ville en 20 minutes, écoles primaires à 300 m.',
 'maison', 'Bordeaux', 'Caudéran', 'Zone approximative de 500 m autour de Caudéran, Bordeaux', 1380, false, 2, 92, 4, false, '1er avril 2026',
 'Revenus du foyer ≥ 3× le loyer. Pas de colocation. Entretien du jardin à la charge du locataire.',
 ARRAY['https://images.pexels.com/photos/34452616/pexels-photo-34452616.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200','https://images.pexels.com/photos/2030037/pexels-photo-2030037.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'],
 'verifiee', 0, NOW() - INTERVAL '10 days'),
(5, 'T2 rénové avec balcon — Nantes centre',
 'Appartement de 48 m² rénové avec goût, 2ᵉ étage sans ascenseur d''une petite copropriété.\n\nPièce de vie avec cuisine américaine, chambre spacieuse, balcon plein ouest de 6 m². Local vélo sécurisé.\n\nTramway ligne 1 à 200 m, commerces de bouche et marché de Talensac à 10 minutes à pied.',
 'appartement', 'Nantes', 'Centre-ville', 'Zone approximative de 500 m autour du centre-ville, Nantes', 720, true, 1, 48, 2, false, 'Immédiatement',
 'Garantie Visale bienvenue. Premier loyer au prorata. Pas de frais d''agence (gestion directe).',
 ARRAY['https://images.pexels.com/photos/19239905/pexels-photo-19239905.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200','https://images.pexels.com/photos/7167073/pexels-photo-7167073.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'],
 'verifiee', 0, NOW() - INTERVAL '6 days'),
(2, 'Chambre meublée en colocation — Lille Vauban',
 'Chambre de 14 m² dans une colocation de 3 personnes (étudiants en master), maison de ville de 110 m².\n\nCuisine commune entièrement équipée, deux salles de bain, jardin partagé. Charges et fibre comprises.\n\nUniversité catholique à 5 minutes à pied, métro Cormontaigne à 8 minutes.',
 'chambre', 'Lille', 'Vauban-Esquermes', 'Zone approximative de 500 m autour de Vauban-Esquermes, Lille', 460, true, 1, 14, 1, true, '1er février 2026',
 'Colocation étudiante. Charte de vie commune à signer. APL possible.',
 ARRAY['https://images.pexels.com/photos/6489096/pexels-photo-6489096.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'],
 'verifiee', 0, NOW() - INTERVAL '4 days'),
(6, 'T3 haussmannien — Marseille Castellane',
 'Bel appartement de 61 m² au 2ᵉ étage d''un immeuble haussmannien : moulures, cheminées, hauteur sous plafond 3,1 m.\n\nDeux chambres, séjour double, cuisine à équiper. Cave. Travaux de rafraîchissement prévus avant l''entrée.',
 'appartement', 'Marseille', 'Castellane', 'Zone approximative de 500 m autour de Castellane, Marseille', 850, true, 1, 61, 3, false, '1er mars 2026',
 'Garant demandé. Dossier à déposer lors de la visite.',
 ARRAY['https://images.pexels.com/photos/17741459/pexels-photo-17741459.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200','https://images.pexels.com/photos/2030037/pexels-photo-2030037.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'],
 'en_attente', 0, NOW() - INTERVAL '1 day'),
(7, 'SUPERBE T4 vue mer — prix cassé 650 € !!!',
 'Magnifique appartement 90 m2 vue mer, entièrement meublé luxe. Je suis en déplacement à Londres, envoi des clés possible après réservation. Premier mois + caution à régler pour bloquer le bien, visite après paiement.',
 'appartement', 'Nice', 'Promenade des Anglais', 'Zone approximative de 500 m autour de la Promenade des Anglais, Nice', 650, true, 1, 90, 4, true, 'Immédiatement',
 'Paiement du premier mois demandé avant la visite pour « réserver ».',
 ARRAY['https://images.pexels.com/photos/2030037/pexels-photo-2030037.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'],
 'suspendue', 3, NOW() - INTERVAL '7 days');

INSERT INTO visit_requests (listing_id, name, email, phone, preferred_date, message, status, created_at) VALUES
(1, 'Emma Rousseau', 'emma.rousseau@exemple.fr', '06 77 88 99 00', '2026-02-14', 'Bonjour, je suis ingénieure nouvellement mutée à Lyon, disponible en fin de journée.', 'envoyee', NOW() - INTERVAL '2 days'),
(3, 'Yanis Cherif', 'yanis.cherif@exemple.fr', NULL, '2026-02-10', 'Étudiant en M2 à Sorbonne Université, garant familial disponible.', 'envoyee', NOW() - INTERVAL '1 day'),
(5, 'Léa Fontaine', 'lea.fontaine@exemple.fr', '07 12 34 56 78', '2026-02-12', 'Disponible dès maintenant, dossier complet et garantie Visale validée.', 'envoyee', NOW() - INTERVAL '5 hours');

INSERT INTO reports (listing_id, reason, details, reporter_email, status, resolution_note, created_at, resolved_at) VALUES
(8, 'Prix anormalement bas', 'T4 vue mer à 650 € à Nice, c''est impossible. Ça sent l''arnaque.', 'vigilant.nice@exemple.fr', 'confirme', 'Prix 60 % sous le marché, annonce dupliquée depuis un site étranger.', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'),
(8, 'Demande de paiement avant visite', 'Le « propriétaire » demande un virement de 1300 € via Western Union pour envoyer les clés depuis Londres.', 'victim.potentielle@exemple.fr', 'confirme', 'Schéma classique de la fraude aux clés. Annonce suspendue et annonceur banni.', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'),
(8, 'Photos volées ou trompeuses', 'La photo principale provient d''une annonce d''un hôtel à Barcelone (recherche inversée).', NULL, 'confirme', 'Photos volées confirmées par recherche d''image inversée.', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
(2, 'Annonceur injoignable ou suspect', 'Pas de réponse depuis 4 jours, je voulais être sûr que l''annonce était toujours active.', NULL, 'classe_sans_suite', 'Agence contactée : simple délai de réponse lié aux congés. Annonce toujours légitime.', NOW() - INTERVAL '12 days', NOW() - INTERVAL '11 days');