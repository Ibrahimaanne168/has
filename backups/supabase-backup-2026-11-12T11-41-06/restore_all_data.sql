-- ==============================================================================
-- RESTAURATION COMPLÈTE DES DONNÉES — HALIL ACADÉMIE SCIENTIFIQUE (HAS)
-- Sauvegarde générée le : 2026-11-12T12:10:16.360Z
-- Total utilisateurs Auth : 201
-- Compatible exécution directe dans le "SQL Editor" de votre nouveau projet Supabase
-- ==============================================================================
-- INSTRUCTIONS D'UTILISATION :
-- 1. Exécutez d'abord "database/schema_complet.sql" pour créer toutes les tables et buckets.
-- 2. Exécutez ensuite CE fichier pour insérer toutes les données sans aucune perte.
-- ==============================================================================

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- Désactiver temporairement les vérifications strictes de déclencheurs pour un import fluide
SET session_replication_role = 'replica';

-- ==============================================================================
-- A. RESTAURATION DES COMPTES SUPABASE AUTH (201 UTILISATEURS)
-- ==============================================================================
-- Remarque : Pour des raisons de sécurité, Supabase n'exporte pas les hashs de mot de passe bruts.
-- Les comptes sont créés avec le mot de passe standard initial 'admin123' (ou hash bcrypt sécurisé).
-- Tous les rôles, matricules, filières, classes et statuts de validation sont 100% préservés !
-- ==============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Restauration des utilisateurs auth.users...';
END $$;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'd86becf4-e3c2-4389-8734-14aae17a79da',
  'authenticated',
  'authenticated',
  'mbacmb10@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-11-04T10:59:41.720638Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","date_expiration_paiement":"2027-01-12T23:59:59.000Z","date_validation_paiement":"2026-11-11T19:50:30.128Z","email_verified":true,"filiere":"MPI","full_name":"Mbacke Mbengue","is_active":true,"matricule":"ETU209","niveau":"L2","phone":"+221 77 551 81 96","role":"etudiant","statut_inscription":"valide","statut_paiement":"a_jour","username":"mbacke"}'::jsonb,
  '2026-11-04T10:59:41.700627Z',
  '2026-11-11T20:55:11.511298Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'd86becf4-e3c2-4389-8734-14aae17a79da',
  'd86becf4-e3c2-4389-8734-14aae17a79da',
  'd86becf4-e3c2-4389-8734-14aae17a79da',
  json_build_object('sub', 'd86becf4-e3c2-4389-8734-14aae17a79da', 'email', 'mbacmb10@gmail.com')::jsonb,
  'email',
  '2026-11-04T10:59:41.720638Z',
  '2026-11-04T10:59:41.700627Z',
  '2026-11-11T20:55:11.511298Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'd86becf4-e3c2-4389-8734-14aae17a79da',
  'mbacmb10@gmail.com',
  'mbacke',
  'Mbacke Mbengue',
  'etudiant',
  'ETU209',
  '',
  TRUE,
  '2026-11-04T10:59:41.700627Z',
  '2026-11-11T20:55:11.511298Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '33b3163f-0b5c-46e6-8778-1cda4891e458',
  'authenticated',
  'authenticated',
  'tabane.nasra@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-11-03T21:16:29.039741Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Mame Nasra Tabane ","is_active":true,"matricule":"ETU208","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"mamenasra"}'::jsonb,
  '2026-11-03T21:16:29.018246Z',
  '2026-11-10T19:54:04.076754Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '33b3163f-0b5c-46e6-8778-1cda4891e458',
  '33b3163f-0b5c-46e6-8778-1cda4891e458',
  '33b3163f-0b5c-46e6-8778-1cda4891e458',
  json_build_object('sub', '33b3163f-0b5c-46e6-8778-1cda4891e458', 'email', 'tabane.nasra@uam.edu.sn')::jsonb,
  'email',
  '2026-11-03T21:16:29.039741Z',
  '2026-11-03T21:16:29.018246Z',
  '2026-11-10T19:54:04.076754Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '33b3163f-0b5c-46e6-8778-1cda4891e458',
  'tabane.nasra@uam.edu.sn',
  'mamenasra',
  'Mame Nasra Tabane ',
  'etudiant',
  'ETU208',
  '',
  TRUE,
  '2026-11-03T21:16:29.018246Z',
  '2026-11-10T19:54:04.076754Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '6683eb98-ca19-48c6-add7-c37092a6144a',
  'authenticated',
  'authenticated',
  'cisse.mamadou2@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-29T18:20:13.467802Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Mamadou Cisse","is_active":true,"matricule":"ETU207","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"mrcisse"}'::jsonb,
  '2026-10-29T18:20:13.424861Z',
  '2026-11-12T03:18:22.868088Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '6683eb98-ca19-48c6-add7-c37092a6144a',
  '6683eb98-ca19-48c6-add7-c37092a6144a',
  '6683eb98-ca19-48c6-add7-c37092a6144a',
  json_build_object('sub', '6683eb98-ca19-48c6-add7-c37092a6144a', 'email', 'cisse.mamadou2@uam.edu.sn')::jsonb,
  'email',
  '2026-10-29T18:20:13.467802Z',
  '2026-10-29T18:20:13.424861Z',
  '2026-11-12T03:18:22.868088Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '6683eb98-ca19-48c6-add7-c37092a6144a',
  'cisse.mamadou2@uam.edu.sn',
  'mrcisse',
  'Mamadou Cisse',
  'etudiant',
  'ETU207',
  '',
  TRUE,
  '2026-10-29T18:20:13.424861Z',
  '2026-11-12T03:18:22.868088Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'ab428aa3-143c-4233-a899-0cf8449d53e8',
  'authenticated',
  'authenticated',
  'aliounebadarasy103@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-29T15:05:28.025931Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Alioune badara Sy ","is_active":true,"matricule":"ETU206","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"aliounesy"}'::jsonb,
  '2026-10-29T15:05:27.99894Z',
  '2026-11-11T12:57:52.891022Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'ab428aa3-143c-4233-a899-0cf8449d53e8',
  'ab428aa3-143c-4233-a899-0cf8449d53e8',
  'ab428aa3-143c-4233-a899-0cf8449d53e8',
  json_build_object('sub', 'ab428aa3-143c-4233-a899-0cf8449d53e8', 'email', 'aliounebadarasy103@gmail.com')::jsonb,
  'email',
  '2026-10-29T15:05:28.025931Z',
  '2026-10-29T15:05:27.99894Z',
  '2026-11-11T12:57:52.891022Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'ab428aa3-143c-4233-a899-0cf8449d53e8',
  'aliounebadarasy103@gmail.com',
  'aliounesy',
  'Alioune badara Sy ',
  'etudiant',
  'ETU206',
  '',
  TRUE,
  '2026-10-29T15:05:27.99894Z',
  '2026-11-11T12:57:52.891022Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a4cf6b37-6add-47e5-adb4-2bce52a6a95c',
  'authenticated',
  'authenticated',
  'alphinhojraob09@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-27T21:50:41.2518Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Alpha Oumarou Ba","is_active":true,"matricule":"ETU205","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"oumaroualpha"}'::jsonb,
  '2026-10-27T21:50:41.216823Z',
  '2026-11-07T01:03:41.76527Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'a4cf6b37-6add-47e5-adb4-2bce52a6a95c',
  'a4cf6b37-6add-47e5-adb4-2bce52a6a95c',
  'a4cf6b37-6add-47e5-adb4-2bce52a6a95c',
  json_build_object('sub', 'a4cf6b37-6add-47e5-adb4-2bce52a6a95c', 'email', 'alphinhojraob09@gmail.com')::jsonb,
  'email',
  '2026-10-27T21:50:41.2518Z',
  '2026-10-27T21:50:41.216823Z',
  '2026-11-07T01:03:41.76527Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'a4cf6b37-6add-47e5-adb4-2bce52a6a95c',
  'alphinhojraob09@gmail.com',
  'oumaroualpha',
  'Alpha Oumarou Ba',
  'etudiant',
  'ETU205',
  '',
  TRUE,
  '2026-10-27T21:50:41.216823Z',
  '2026-11-07T01:03:41.76527Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'cbd2a9f2-3824-42a3-9931-6da141fcc73d',
  'authenticated',
  'authenticated',
  'modou3461@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-27T18:49:17.528219Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Serigne Saliou Mbacké Ndiaye ","is_active":true,"matricule":"ETU204","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"saliou"}'::jsonb,
  '2026-10-27T18:49:17.495981Z',
  '2026-11-10T18:32:18.900899Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'cbd2a9f2-3824-42a3-9931-6da141fcc73d',
  'cbd2a9f2-3824-42a3-9931-6da141fcc73d',
  'cbd2a9f2-3824-42a3-9931-6da141fcc73d',
  json_build_object('sub', 'cbd2a9f2-3824-42a3-9931-6da141fcc73d', 'email', 'modou3461@gmail.com')::jsonb,
  'email',
  '2026-10-27T18:49:17.528219Z',
  '2026-10-27T18:49:17.495981Z',
  '2026-11-10T18:32:18.900899Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'cbd2a9f2-3824-42a3-9931-6da141fcc73d',
  'modou3461@gmail.com',
  'saliou',
  'Serigne Saliou Mbacké Ndiaye ',
  'etudiant',
  'ETU204',
  '',
  TRUE,
  '2026-10-27T18:49:17.495981Z',
  '2026-11-10T18:32:18.900899Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '91e8b585-0495-4ab3-8f26-3911ee65072b',
  'authenticated',
  'authenticated',
  'sarrdieyla68@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-26T20:21:00.025508Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Dieyla Sarr","is_active":false,"matricule":"ETU203","niveau":"L1","phone":null,"role":"etudiant","statut_inscription":"en_attente","username":"dsarr"}'::jsonb,
  '2026-10-26T20:20:59.999165Z',
  '2026-10-26T20:23:12.987734Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '91e8b585-0495-4ab3-8f26-3911ee65072b',
  '91e8b585-0495-4ab3-8f26-3911ee65072b',
  '91e8b585-0495-4ab3-8f26-3911ee65072b',
  json_build_object('sub', '91e8b585-0495-4ab3-8f26-3911ee65072b', 'email', 'sarrdieyla68@gmail.com')::jsonb,
  'email',
  '2026-10-26T20:21:00.025508Z',
  '2026-10-26T20:20:59.999165Z',
  '2026-10-26T20:23:12.987734Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '91e8b585-0495-4ab3-8f26-3911ee65072b',
  'sarrdieyla68@gmail.com',
  'dsarr',
  'Dieyla Sarr',
  'etudiant',
  'ETU203',
  '',
  TRUE,
  '2026-10-26T20:20:59.999165Z',
  '2026-10-26T20:23:12.987734Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'dc23dee8-4e24-4f92-9496-f11bcf1ad6a9',
  'authenticated',
  'authenticated',
  'mariehenriettekatiam@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-26T17:58:52.956574Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-SML","email_verified":true,"filiere":"SML","full_name":"Marie Henriette Katia Mbengue","is_active":false,"matricule":"ETU202","niveau":"L1","phone":null,"role":"etudiant","statut_inscription":"en_attente","username":"ktiaa"}'::jsonb,
  '2026-10-26T17:58:52.918655Z',
  '2026-10-26T17:58:52.961846Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'dc23dee8-4e24-4f92-9496-f11bcf1ad6a9',
  'dc23dee8-4e24-4f92-9496-f11bcf1ad6a9',
  'dc23dee8-4e24-4f92-9496-f11bcf1ad6a9',
  json_build_object('sub', 'dc23dee8-4e24-4f92-9496-f11bcf1ad6a9', 'email', 'mariehenriettekatiam@gmail.com')::jsonb,
  'email',
  '2026-10-26T17:58:52.956574Z',
  '2026-10-26T17:58:52.918655Z',
  '2026-10-26T17:58:52.961846Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'dc23dee8-4e24-4f92-9496-f11bcf1ad6a9',
  'mariehenriettekatiam@gmail.com',
  'ktiaa',
  'Marie Henriette Katia Mbengue',
  'etudiant',
  'ETU202',
  '',
  TRUE,
  '2026-10-26T17:58:52.918655Z',
  '2026-10-26T17:58:52.961846Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '18ace4ad-2e30-4301-bfce-64b0d4b41a8a',
  'authenticated',
  'authenticated',
  'aminatanguira3@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-25T13:09:10.392118Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Aminata Nguira Diop ","is_active":false,"matricule":"ETU201","niveau":"NB","phone":null,"role":"etudiant","statut_inscription":"en_attente","username":"mina"}'::jsonb,
  '2026-10-25T13:09:10.356101Z',
  '2026-11-02T10:20:12.855645Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '18ace4ad-2e30-4301-bfce-64b0d4b41a8a',
  '18ace4ad-2e30-4301-bfce-64b0d4b41a8a',
  '18ace4ad-2e30-4301-bfce-64b0d4b41a8a',
  json_build_object('sub', '18ace4ad-2e30-4301-bfce-64b0d4b41a8a', 'email', 'aminatanguira3@gmail.com')::jsonb,
  'email',
  '2026-10-25T13:09:10.392118Z',
  '2026-10-25T13:09:10.356101Z',
  '2026-11-02T10:20:12.855645Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '18ace4ad-2e30-4301-bfce-64b0d4b41a8a',
  'aminatanguira3@gmail.com',
  'mina',
  'Aminata Nguira Diop ',
  'etudiant',
  'ETU201',
  '',
  TRUE,
  '2026-10-25T13:09:10.356101Z',
  '2026-11-02T10:20:12.855645Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c1a79b72-9e42-469c-bdaf-6a2d593fd29f',
  'authenticated',
  'authenticated',
  'diao28061@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-25T13:03:29.137093Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Aïssatou Diao ","is_active":false,"matricule":"ETU200","niveau":"NB","phone":null,"role":"etudiant","statut_inscription":"en_attente","username":"diao"}'::jsonb,
  '2026-10-25T13:03:29.10416Z',
  '2026-10-25T13:03:29.13845Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'c1a79b72-9e42-469c-bdaf-6a2d593fd29f',
  'c1a79b72-9e42-469c-bdaf-6a2d593fd29f',
  'c1a79b72-9e42-469c-bdaf-6a2d593fd29f',
  json_build_object('sub', 'c1a79b72-9e42-469c-bdaf-6a2d593fd29f', 'email', 'diao28061@gmail.com')::jsonb,
  'email',
  '2026-10-25T13:03:29.137093Z',
  '2026-10-25T13:03:29.10416Z',
  '2026-10-25T13:03:29.13845Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'c1a79b72-9e42-469c-bdaf-6a2d593fd29f',
  'diao28061@gmail.com',
  'diao',
  'Aïssatou Diao ',
  'etudiant',
  'ETU200',
  '',
  TRUE,
  '2026-10-25T13:03:29.10416Z',
  '2026-10-25T13:03:29.13845Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '7e7f6aae-9bce-414d-9d54-991677c6b272',
  'authenticated',
  'authenticated',
  'trokhaya684@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-25T12:31:18.171865Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-SML","email_verified":true,"filiere":"SML","full_name":"Rokhaya Thiam","is_active":false,"matricule":"ETU199","niveau":"NB","phone":null,"role":"etudiant","statut_inscription":"en_attente","username":"n777004282"}'::jsonb,
  '2026-10-25T12:31:18.141536Z',
  '2026-10-25T12:31:18.173245Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '7e7f6aae-9bce-414d-9d54-991677c6b272',
  '7e7f6aae-9bce-414d-9d54-991677c6b272',
  '7e7f6aae-9bce-414d-9d54-991677c6b272',
  json_build_object('sub', '7e7f6aae-9bce-414d-9d54-991677c6b272', 'email', 'trokhaya684@gmail.com')::jsonb,
  'email',
  '2026-10-25T12:31:18.171865Z',
  '2026-10-25T12:31:18.141536Z',
  '2026-10-25T12:31:18.173245Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '7e7f6aae-9bce-414d-9d54-991677c6b272',
  'trokhaya684@gmail.com',
  'n777004282',
  'Rokhaya Thiam',
  'etudiant',
  'ETU199',
  '',
  TRUE,
  '2026-10-25T12:31:18.141536Z',
  '2026-10-25T12:31:18.173245Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '023858d7-0627-4dc7-8c26-cbcffae66bcf',
  'authenticated',
  'authenticated',
  'khaliphathioub4@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-25T10:45:24.421869Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Khalipha Thioub","is_active":false,"matricule":"ETU198","niveau":"L1","phone":null,"role":"etudiant","statut_inscription":"en_attente","username":"lifa22"}'::jsonb,
  '2026-10-25T10:45:24.401292Z',
  '2026-10-25T12:49:10.110582Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '023858d7-0627-4dc7-8c26-cbcffae66bcf',
  '023858d7-0627-4dc7-8c26-cbcffae66bcf',
  '023858d7-0627-4dc7-8c26-cbcffae66bcf',
  json_build_object('sub', '023858d7-0627-4dc7-8c26-cbcffae66bcf', 'email', 'khaliphathioub4@gmail.com')::jsonb,
  'email',
  '2026-10-25T10:45:24.421869Z',
  '2026-10-25T10:45:24.401292Z',
  '2026-10-25T12:49:10.110582Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '023858d7-0627-4dc7-8c26-cbcffae66bcf',
  'khaliphathioub4@gmail.com',
  'lifa22',
  'Khalipha Thioub',
  'etudiant',
  'ETU198',
  '',
  TRUE,
  '2026-10-25T10:45:24.401292Z',
  '2026-10-25T12:49:10.110582Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'd7f6b93a-4279-467a-ac46-07e0043890b0',
  'authenticated',
  'authenticated',
  'lamanelo124@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-25T00:22:36.576495Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Aliou LO","is_active":false,"matricule":"ETU197","niveau":"NB","phone":null,"role":"etudiant","statut_inscription":"en_attente","username":"co303482"}'::jsonb,
  '2026-10-25T00:22:36.544657Z',
  '2026-10-31T19:08:46.338688Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'd7f6b93a-4279-467a-ac46-07e0043890b0',
  'd7f6b93a-4279-467a-ac46-07e0043890b0',
  'd7f6b93a-4279-467a-ac46-07e0043890b0',
  json_build_object('sub', 'd7f6b93a-4279-467a-ac46-07e0043890b0', 'email', 'lamanelo124@gmail.com')::jsonb,
  'email',
  '2026-10-25T00:22:36.576495Z',
  '2026-10-25T00:22:36.544657Z',
  '2026-10-31T19:08:46.338688Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'd7f6b93a-4279-467a-ac46-07e0043890b0',
  'lamanelo124@gmail.com',
  'co303482',
  'Aliou LO',
  'etudiant',
  'ETU197',
  '',
  TRUE,
  '2026-10-25T00:22:36.544657Z',
  '2026-10-31T19:08:46.338688Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b8d6e7ab-c840-4b19-9e17-4eec1569959d',
  'authenticated',
  'authenticated',
  'samatekanglassana@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T23:21:19.189201Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Kang Lassana Samaté ","is_active":false,"matricule":"ETU196","niveau":"L1","phone":null,"role":"etudiant","statut_inscription":"en_attente","username":"samate.lassana"}'::jsonb,
  '2026-10-24T23:21:19.140546Z',
  '2026-11-06T22:57:47.465654Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'b8d6e7ab-c840-4b19-9e17-4eec1569959d',
  'b8d6e7ab-c840-4b19-9e17-4eec1569959d',
  'b8d6e7ab-c840-4b19-9e17-4eec1569959d',
  json_build_object('sub', 'b8d6e7ab-c840-4b19-9e17-4eec1569959d', 'email', 'samatekanglassana@gmail.com')::jsonb,
  'email',
  '2026-10-24T23:21:19.189201Z',
  '2026-10-24T23:21:19.140546Z',
  '2026-11-06T22:57:47.465654Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'b8d6e7ab-c840-4b19-9e17-4eec1569959d',
  'samatekanglassana@gmail.com',
  'samate.lassana',
  'Kang Lassana Samaté ',
  'etudiant',
  'ETU196',
  '',
  TRUE,
  '2026-10-24T23:21:19.140546Z',
  '2026-11-06T22:57:47.465654Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '2892bc97-5d0f-4282-8476-208df7500734',
  'authenticated',
  'authenticated',
  'hamidousadio16@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T21:28:59.879614Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Hamidou Sadio","is_active":false,"matricule":"ETU195","niveau":"L1","phone":null,"role":"etudiant","statut_inscription":"en_attente","username":"sadio"}'::jsonb,
  '2026-10-24T21:28:59.85153Z',
  '2026-10-24T21:28:59.880729Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '2892bc97-5d0f-4282-8476-208df7500734',
  '2892bc97-5d0f-4282-8476-208df7500734',
  '2892bc97-5d0f-4282-8476-208df7500734',
  json_build_object('sub', '2892bc97-5d0f-4282-8476-208df7500734', 'email', 'hamidousadio16@gmail.com')::jsonb,
  'email',
  '2026-10-24T21:28:59.879614Z',
  '2026-10-24T21:28:59.85153Z',
  '2026-10-24T21:28:59.880729Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '2892bc97-5d0f-4282-8476-208df7500734',
  'hamidousadio16@gmail.com',
  'sadio',
  'Hamidou Sadio',
  'etudiant',
  'ETU195',
  '',
  TRUE,
  '2026-10-24T21:28:59.85153Z',
  '2026-10-24T21:28:59.880729Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '6a53bd85-9094-49dd-8806-c084a1690ceb',
  'authenticated',
  'authenticated',
  'kady.ba@has-academie.online',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T21:13:54.911572Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"bio":"Professeur de Mathématiques, chargé principalement des cours et encadrements des Nouveaux Bacheliers (NB) en Mathématiques (Algèbre 1).","classes":["NB MPI","NB SML","NB MIASS"],"email_verified":true,"full_name":"Papa Kady Ba","is_active":true,"matricule":"PROF007","niveaux":["NB","L1"],"nom":"Ba","phone":"+221 70 000 00 00","prenom":"Papa Kady","role":"professeur","specialite":"Math","username":"kady"}'::jsonb,
  '2026-10-24T21:13:54.881114Z',
  '2026-11-01T14:05:19.919517Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '6a53bd85-9094-49dd-8806-c084a1690ceb',
  '6a53bd85-9094-49dd-8806-c084a1690ceb',
  '6a53bd85-9094-49dd-8806-c084a1690ceb',
  json_build_object('sub', '6a53bd85-9094-49dd-8806-c084a1690ceb', 'email', 'kady.ba@has-academie.online')::jsonb,
  'email',
  '2026-10-24T21:13:54.911572Z',
  '2026-10-24T21:13:54.881114Z',
  '2026-11-01T14:05:19.919517Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '6a53bd85-9094-49dd-8806-c084a1690ceb',
  'kady.ba@has-academie.online',
  'kady',
  'Papa Kady Ba',
  'professeur',
  'PROF007',
  '',
  TRUE,
  '2026-10-24T21:13:54.881114Z',
  '2026-11-01T14:05:19.919517Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '4e25d586-3323-48f0-9937-37758c57d7cc',
  'authenticated',
  'authenticated',
  'woury3757@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T20:45:27.064087Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Mamadou Oury Diallo","is_active":false,"matricule":"ETU194","niveau":"NB","phone":null,"role":"etudiant","statut_inscription":"en_attente","username":"m.oury"}'::jsonb,
  '2026-10-24T20:45:27.058227Z',
  '2026-10-25T11:57:40.181739Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '4e25d586-3323-48f0-9937-37758c57d7cc',
  '4e25d586-3323-48f0-9937-37758c57d7cc',
  '4e25d586-3323-48f0-9937-37758c57d7cc',
  json_build_object('sub', '4e25d586-3323-48f0-9937-37758c57d7cc', 'email', 'woury3757@gmail.com')::jsonb,
  'email',
  '2026-10-24T20:45:27.064087Z',
  '2026-10-24T20:45:27.058227Z',
  '2026-10-25T11:57:40.181739Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '4e25d586-3323-48f0-9937-37758c57d7cc',
  'woury3757@gmail.com',
  'm.oury',
  'Mamadou Oury Diallo',
  'etudiant',
  'ETU194',
  '',
  TRUE,
  '2026-10-24T20:45:27.058227Z',
  '2026-10-25T11:57:40.181739Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '71c9e5d2-0bcf-42ee-82e7-2555c174eb37',
  'authenticated',
  'authenticated',
  'ndickoug87@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T20:45:26.82027Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Ndickou Gueye","is_active":false,"matricule":"ETU194","niveau":"NB","phone":null,"role":"etudiant","statut_inscription":"en_attente","username":"ndickou"}'::jsonb,
  '2026-10-24T20:45:26.808043Z',
  '2026-10-24T20:45:26.821159Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '71c9e5d2-0bcf-42ee-82e7-2555c174eb37',
  '71c9e5d2-0bcf-42ee-82e7-2555c174eb37',
  '71c9e5d2-0bcf-42ee-82e7-2555c174eb37',
  json_build_object('sub', '71c9e5d2-0bcf-42ee-82e7-2555c174eb37', 'email', 'ndickoug87@gmail.com')::jsonb,
  'email',
  '2026-10-24T20:45:26.82027Z',
  '2026-10-24T20:45:26.808043Z',
  '2026-10-24T20:45:26.821159Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '71c9e5d2-0bcf-42ee-82e7-2555c174eb37',
  'ndickoug87@gmail.com',
  'ndickou',
  'Ndickou Gueye',
  'etudiant',
  'ETU194',
  '',
  TRUE,
  '2026-10-24T20:45:26.808043Z',
  '2026-10-24T20:45:26.821159Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '4c6865cc-0fbc-4c74-8f0d-8d78d995d4da',
  'authenticated',
  'authenticated',
  'madinaba96@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T20:43:26.789964Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Mamadou Madina Ba","is_active":false,"matricule":"ETU193","niveau":"NB","phone":null,"role":"etudiant","statut_inscription":"en_attente","username":"baba"}'::jsonb,
  '2026-10-24T20:43:26.763236Z',
  '2026-10-24T20:43:26.790903Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '4c6865cc-0fbc-4c74-8f0d-8d78d995d4da',
  '4c6865cc-0fbc-4c74-8f0d-8d78d995d4da',
  '4c6865cc-0fbc-4c74-8f0d-8d78d995d4da',
  json_build_object('sub', '4c6865cc-0fbc-4c74-8f0d-8d78d995d4da', 'email', 'madinaba96@gmail.com')::jsonb,
  'email',
  '2026-10-24T20:43:26.789964Z',
  '2026-10-24T20:43:26.763236Z',
  '2026-10-24T20:43:26.790903Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '4c6865cc-0fbc-4c74-8f0d-8d78d995d4da',
  'madinaba96@gmail.com',
  'baba',
  'Mamadou Madina Ba',
  'etudiant',
  'ETU193',
  '',
  TRUE,
  '2026-10-24T20:43:26.763236Z',
  '2026-10-24T20:43:26.790903Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'dce46c7e-0973-4e4b-9a0e-c130e864da00',
  'authenticated',
  'authenticated',
  'seck280807@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T20:30:00.20734Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Saliou Seck","is_active":true,"matricule":"ETU192","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"likhdeug"}'::jsonb,
  '2026-10-24T20:30:00.184897Z',
  '2026-10-24T20:32:50.8507Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'dce46c7e-0973-4e4b-9a0e-c130e864da00',
  'dce46c7e-0973-4e4b-9a0e-c130e864da00',
  'dce46c7e-0973-4e4b-9a0e-c130e864da00',
  json_build_object('sub', 'dce46c7e-0973-4e4b-9a0e-c130e864da00', 'email', 'seck280807@gmail.com')::jsonb,
  'email',
  '2026-10-24T20:30:00.20734Z',
  '2026-10-24T20:30:00.184897Z',
  '2026-10-24T20:32:50.8507Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'dce46c7e-0973-4e4b-9a0e-c130e864da00',
  'seck280807@gmail.com',
  'likhdeug',
  'Saliou Seck',
  'etudiant',
  'ETU192',
  '',
  TRUE,
  '2026-10-24T20:30:00.184897Z',
  '2026-10-24T20:32:50.8507Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '923c2406-aeb7-44c9-8f02-3f4403e75338',
  'authenticated',
  'authenticated',
  'habibsakho402@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T19:59:13.931906Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Mohamed El Habib SAKHO","is_active":true,"matricule":"ETU191","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"fearless"}'::jsonb,
  '2026-10-24T19:59:13.919292Z',
  '2026-11-11T17:02:36.698877Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '923c2406-aeb7-44c9-8f02-3f4403e75338',
  '923c2406-aeb7-44c9-8f02-3f4403e75338',
  '923c2406-aeb7-44c9-8f02-3f4403e75338',
  json_build_object('sub', '923c2406-aeb7-44c9-8f02-3f4403e75338', 'email', 'habibsakho402@gmail.com')::jsonb,
  'email',
  '2026-10-24T19:59:13.931906Z',
  '2026-10-24T19:59:13.919292Z',
  '2026-11-11T17:02:36.698877Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '923c2406-aeb7-44c9-8f02-3f4403e75338',
  'habibsakho402@gmail.com',
  'fearless',
  'Mohamed El Habib SAKHO',
  'etudiant',
  'ETU191',
  '',
  TRUE,
  '2026-10-24T19:59:13.919292Z',
  '2026-11-11T17:02:36.698877Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '881b9ef4-f2d8-438d-8a15-e04a0ea5c0ed',
  'authenticated',
  'authenticated',
  'diopsadikh94@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T19:56:57.37825Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Mohamet Diop ","is_active":true,"matricule":"ETU190","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"diop.mohamet1"}'::jsonb,
  '2026-10-24T19:56:57.351707Z',
  '2026-11-06T22:55:29.932663Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '881b9ef4-f2d8-438d-8a15-e04a0ea5c0ed',
  '881b9ef4-f2d8-438d-8a15-e04a0ea5c0ed',
  '881b9ef4-f2d8-438d-8a15-e04a0ea5c0ed',
  json_build_object('sub', '881b9ef4-f2d8-438d-8a15-e04a0ea5c0ed', 'email', 'diopsadikh94@gmail.com')::jsonb,
  'email',
  '2026-10-24T19:56:57.37825Z',
  '2026-10-24T19:56:57.351707Z',
  '2026-11-06T22:55:29.932663Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '881b9ef4-f2d8-438d-8a15-e04a0ea5c0ed',
  'diopsadikh94@gmail.com',
  'diop.mohamet1',
  'Mohamet Diop ',
  'etudiant',
  'ETU190',
  '',
  TRUE,
  '2026-10-24T19:56:57.351707Z',
  '2026-11-06T22:55:29.932663Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '80f5d08d-7f53-4483-8ded-5e7236f72b09',
  'authenticated',
  'authenticated',
  'awacheikhba301@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T19:41:23.173433Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Awa Cheikh Ba ","is_active":true,"matricule":"ETU189","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"awa07"}'::jsonb,
  '2026-10-24T19:41:23.109696Z',
  '2026-10-24T21:11:40.128882Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '80f5d08d-7f53-4483-8ded-5e7236f72b09',
  '80f5d08d-7f53-4483-8ded-5e7236f72b09',
  '80f5d08d-7f53-4483-8ded-5e7236f72b09',
  json_build_object('sub', '80f5d08d-7f53-4483-8ded-5e7236f72b09', 'email', 'awacheikhba301@gmail.com')::jsonb,
  'email',
  '2026-10-24T19:41:23.173433Z',
  '2026-10-24T19:41:23.109696Z',
  '2026-10-24T21:11:40.128882Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '80f5d08d-7f53-4483-8ded-5e7236f72b09',
  'awacheikhba301@gmail.com',
  'awa07',
  'Awa Cheikh Ba ',
  'etudiant',
  'ETU189',
  '',
  TRUE,
  '2026-10-24T19:41:23.109696Z',
  '2026-10-24T21:11:40.128882Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '8249b763-5e5d-4209-ac2a-98007cdd7e48',
  'authenticated',
  'authenticated',
  'diengpenda098@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T19:13:40.014629Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Penda Dieng","is_active":true,"matricule":"ETU188","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"penda."}'::jsonb,
  '2026-10-24T19:13:39.971276Z',
  '2026-10-24T22:58:00.121094Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '8249b763-5e5d-4209-ac2a-98007cdd7e48',
  '8249b763-5e5d-4209-ac2a-98007cdd7e48',
  '8249b763-5e5d-4209-ac2a-98007cdd7e48',
  json_build_object('sub', '8249b763-5e5d-4209-ac2a-98007cdd7e48', 'email', 'diengpenda098@gmail.com')::jsonb,
  'email',
  '2026-10-24T19:13:40.014629Z',
  '2026-10-24T19:13:39.971276Z',
  '2026-10-24T22:58:00.121094Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '8249b763-5e5d-4209-ac2a-98007cdd7e48',
  'diengpenda098@gmail.com',
  'penda.',
  'Penda Dieng',
  'etudiant',
  'ETU188',
  '',
  TRUE,
  '2026-10-24T19:13:39.971276Z',
  '2026-10-24T22:58:00.121094Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'ac376703-ef8a-4400-ace7-7f73d684ef77',
  'authenticated',
  'authenticated',
  'ousmanesamb267@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T18:38:53.218273Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Papa ousmane samb","is_active":true,"matricule":"ETU186","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"ousmanesamb"}'::jsonb,
  '2026-10-24T18:38:53.18905Z',
  '2026-10-24T20:23:04.817758Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'ac376703-ef8a-4400-ace7-7f73d684ef77',
  'ac376703-ef8a-4400-ace7-7f73d684ef77',
  'ac376703-ef8a-4400-ace7-7f73d684ef77',
  json_build_object('sub', 'ac376703-ef8a-4400-ace7-7f73d684ef77', 'email', 'ousmanesamb267@gmail.com')::jsonb,
  'email',
  '2026-10-24T18:38:53.218273Z',
  '2026-10-24T18:38:53.18905Z',
  '2026-10-24T20:23:04.817758Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'ac376703-ef8a-4400-ace7-7f73d684ef77',
  'ousmanesamb267@gmail.com',
  'ousmanesamb',
  'Papa ousmane samb',
  'etudiant',
  'ETU186',
  '',
  TRUE,
  '2026-10-24T18:38:53.18905Z',
  '2026-10-24T20:23:04.817758Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '2bf8ba17-74d5-45f3-871e-47e78a0e4cdc',
  'authenticated',
  'authenticated',
  'binetaniane.17@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T18:37:26.966869Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Bineta Niane","is_active":true,"matricule":"ETU185","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"niane"}'::jsonb,
  '2026-10-24T18:37:26.953784Z',
  '2026-10-24T20:58:45.653731Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '2bf8ba17-74d5-45f3-871e-47e78a0e4cdc',
  '2bf8ba17-74d5-45f3-871e-47e78a0e4cdc',
  '2bf8ba17-74d5-45f3-871e-47e78a0e4cdc',
  json_build_object('sub', '2bf8ba17-74d5-45f3-871e-47e78a0e4cdc', 'email', 'binetaniane.17@gmail.com')::jsonb,
  'email',
  '2026-10-24T18:37:26.966869Z',
  '2026-10-24T18:37:26.953784Z',
  '2026-10-24T20:58:45.653731Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '2bf8ba17-74d5-45f3-871e-47e78a0e4cdc',
  'binetaniane.17@gmail.com',
  'niane',
  'Bineta Niane',
  'etudiant',
  'ETU185',
  '',
  TRUE,
  '2026-10-24T18:37:26.953784Z',
  '2026-10-24T20:58:45.653731Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '38d002ed-9e9e-4f2d-b1d5-bd6952cd7343',
  'authenticated',
  'authenticated',
  '1ndoyebabacar2023@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T18:34:48.361484Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Babacar Ndoye ","is_active":true,"matricule":"ETU184","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"mndoye"}'::jsonb,
  '2026-10-24T18:34:48.354943Z',
  '2026-10-27T21:04:52.558965Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '38d002ed-9e9e-4f2d-b1d5-bd6952cd7343',
  '38d002ed-9e9e-4f2d-b1d5-bd6952cd7343',
  '38d002ed-9e9e-4f2d-b1d5-bd6952cd7343',
  json_build_object('sub', '38d002ed-9e9e-4f2d-b1d5-bd6952cd7343', 'email', '1ndoyebabacar2023@gmail.com')::jsonb,
  'email',
  '2026-10-24T18:34:48.361484Z',
  '2026-10-24T18:34:48.354943Z',
  '2026-10-27T21:04:52.558965Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '38d002ed-9e9e-4f2d-b1d5-bd6952cd7343',
  '1ndoyebabacar2023@gmail.com',
  'mndoye',
  'Babacar Ndoye ',
  'etudiant',
  'ETU184',
  '',
  TRUE,
  '2026-10-24T18:34:48.354943Z',
  '2026-10-27T21:04:52.558965Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'd8498fea-2c8d-4862-a53c-91cb5e7e7a50',
  'authenticated',
  'authenticated',
  'seynaboudiop36912@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T18:34:33.671638Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-SML","email_verified":true,"filiere":"SML","full_name":"Seynabou Diop ","is_active":false,"matricule":"ETU183","niveau":"NB","phone":null,"role":"etudiant","statut_inscription":"en_attente","username":"sdiop"}'::jsonb,
  '2026-10-24T18:34:33.646621Z',
  '2026-10-24T20:42:17.233003Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'd8498fea-2c8d-4862-a53c-91cb5e7e7a50',
  'd8498fea-2c8d-4862-a53c-91cb5e7e7a50',
  'd8498fea-2c8d-4862-a53c-91cb5e7e7a50',
  json_build_object('sub', 'd8498fea-2c8d-4862-a53c-91cb5e7e7a50', 'email', 'seynaboudiop36912@gmail.com')::jsonb,
  'email',
  '2026-10-24T18:34:33.671638Z',
  '2026-10-24T18:34:33.646621Z',
  '2026-10-24T20:42:17.233003Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'd8498fea-2c8d-4862-a53c-91cb5e7e7a50',
  'seynaboudiop36912@gmail.com',
  'sdiop',
  'Seynabou Diop ',
  'etudiant',
  'ETU183',
  '',
  TRUE,
  '2026-10-24T18:34:33.646621Z',
  '2026-10-24T20:42:17.233003Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b3f24f0d-b240-4bc0-99e2-f75920a63889',
  'authenticated',
  'authenticated',
  'antadiopbebe3@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T18:29:13.851365Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Anta Diop","is_active":false,"matricule":"ETU182","niveau":"NB","phone":null,"role":"etudiant","statut_inscription":"en_attente","username":"antadiop635"}'::jsonb,
  '2026-10-24T18:29:13.830043Z',
  '2026-10-24T18:29:13.852614Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'b3f24f0d-b240-4bc0-99e2-f75920a63889',
  'b3f24f0d-b240-4bc0-99e2-f75920a63889',
  'b3f24f0d-b240-4bc0-99e2-f75920a63889',
  json_build_object('sub', 'b3f24f0d-b240-4bc0-99e2-f75920a63889', 'email', 'antadiopbebe3@gmail.com')::jsonb,
  'email',
  '2026-10-24T18:29:13.851365Z',
  '2026-10-24T18:29:13.830043Z',
  '2026-10-24T18:29:13.852614Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'b3f24f0d-b240-4bc0-99e2-f75920a63889',
  'antadiopbebe3@gmail.com',
  'antadiop635',
  'Anta Diop',
  'etudiant',
  'ETU182',
  '',
  TRUE,
  '2026-10-24T18:29:13.830043Z',
  '2026-10-24T18:29:13.852614Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c92a57fb-9d32-4512-9b47-d0f0538101a9',
  'authenticated',
  'authenticated',
  'hawaseck01012005@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T18:17:14.412073Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"AWA SECK ","is_active":true,"matricule":"ETU181","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"dcipyukd"}'::jsonb,
  '2026-10-24T18:17:14.388866Z',
  '2026-11-06T23:49:53.715911Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'c92a57fb-9d32-4512-9b47-d0f0538101a9',
  'c92a57fb-9d32-4512-9b47-d0f0538101a9',
  'c92a57fb-9d32-4512-9b47-d0f0538101a9',
  json_build_object('sub', 'c92a57fb-9d32-4512-9b47-d0f0538101a9', 'email', 'hawaseck01012005@gmail.com')::jsonb,
  'email',
  '2026-10-24T18:17:14.412073Z',
  '2026-10-24T18:17:14.388866Z',
  '2026-11-06T23:49:53.715911Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'c92a57fb-9d32-4512-9b47-d0f0538101a9',
  'hawaseck01012005@gmail.com',
  'dcipyukd',
  'AWA SECK ',
  'etudiant',
  'ETU181',
  '',
  TRUE,
  '2026-10-24T18:17:14.388866Z',
  '2026-11-06T23:49:53.715911Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '4462a19b-deea-4914-9aa1-c0ebcda8ee7b',
  'authenticated',
  'authenticated',
  'imamassanethiam6@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T18:07:52.680276Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Imam Assane Thiam ","is_active":true,"matricule":"ETU179","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"imam"}'::jsonb,
  '2026-10-24T18:07:52.662347Z',
  '2026-10-24T20:29:46.945212Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '4462a19b-deea-4914-9aa1-c0ebcda8ee7b',
  '4462a19b-deea-4914-9aa1-c0ebcda8ee7b',
  '4462a19b-deea-4914-9aa1-c0ebcda8ee7b',
  json_build_object('sub', '4462a19b-deea-4914-9aa1-c0ebcda8ee7b', 'email', 'imamassanethiam6@gmail.com')::jsonb,
  'email',
  '2026-10-24T18:07:52.680276Z',
  '2026-10-24T18:07:52.662347Z',
  '2026-10-24T20:29:46.945212Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '4462a19b-deea-4914-9aa1-c0ebcda8ee7b',
  'imamassanethiam6@gmail.com',
  'imam',
  'Imam Assane Thiam ',
  'etudiant',
  'ETU179',
  '',
  TRUE,
  '2026-10-24T18:07:52.662347Z',
  '2026-10-24T20:29:46.945212Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b4752f93-ad49-4e12-be7a-ee332719f57d',
  'authenticated',
  'authenticated',
  'fatoumatabaro69@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T17:55:19.794768Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Fatoumata Baro ","is_active":true,"matricule":"ETU178","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"fb0863"}'::jsonb,
  '2026-10-24T17:55:19.768455Z',
  '2026-11-06T22:55:02.774836Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'b4752f93-ad49-4e12-be7a-ee332719f57d',
  'b4752f93-ad49-4e12-be7a-ee332719f57d',
  'b4752f93-ad49-4e12-be7a-ee332719f57d',
  json_build_object('sub', 'b4752f93-ad49-4e12-be7a-ee332719f57d', 'email', 'fatoumatabaro69@gmail.com')::jsonb,
  'email',
  '2026-10-24T17:55:19.794768Z',
  '2026-10-24T17:55:19.768455Z',
  '2026-11-06T22:55:02.774836Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'b4752f93-ad49-4e12-be7a-ee332719f57d',
  'fatoumatabaro69@gmail.com',
  'fb0863',
  'Fatoumata Baro ',
  'etudiant',
  'ETU178',
  '',
  TRUE,
  '2026-10-24T17:55:19.768455Z',
  '2026-11-06T22:55:02.774836Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'fbd0ef98-9f03-43df-a4dd-c73a61e42ab9',
  'authenticated',
  'authenticated',
  'fatoualledieng0@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T17:54:12.362135Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Fatou Alle Dieng","is_active":true,"matricule":"ETU177","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"fatoualledieng"}'::jsonb,
  '2026-10-24T17:54:12.306607Z',
  '2026-10-24T18:20:24.751526Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'fbd0ef98-9f03-43df-a4dd-c73a61e42ab9',
  'fbd0ef98-9f03-43df-a4dd-c73a61e42ab9',
  'fbd0ef98-9f03-43df-a4dd-c73a61e42ab9',
  json_build_object('sub', 'fbd0ef98-9f03-43df-a4dd-c73a61e42ab9', 'email', 'fatoualledieng0@gmail.com')::jsonb,
  'email',
  '2026-10-24T17:54:12.362135Z',
  '2026-10-24T17:54:12.306607Z',
  '2026-10-24T18:20:24.751526Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'fbd0ef98-9f03-43df-a4dd-c73a61e42ab9',
  'fatoualledieng0@gmail.com',
  'fatoualledieng',
  'Fatou Alle Dieng',
  'etudiant',
  'ETU177',
  '',
  TRUE,
  '2026-10-24T17:54:12.306607Z',
  '2026-10-24T18:20:24.751526Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'edd3b2b8-88f4-4d4b-a649-b8363b2aecdd',
  'authenticated',
  'authenticated',
  'fayec7129@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T17:31:52.71733Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Coumba Faye","is_active":true,"matricule":"ETU176","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"coumbafaye"}'::jsonb,
  '2026-10-24T17:31:52.714805Z',
  '2026-11-04T21:00:59.443928Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'edd3b2b8-88f4-4d4b-a649-b8363b2aecdd',
  'edd3b2b8-88f4-4d4b-a649-b8363b2aecdd',
  'edd3b2b8-88f4-4d4b-a649-b8363b2aecdd',
  json_build_object('sub', 'edd3b2b8-88f4-4d4b-a649-b8363b2aecdd', 'email', 'fayec7129@gmail.com')::jsonb,
  'email',
  '2026-10-24T17:31:52.71733Z',
  '2026-10-24T17:31:52.714805Z',
  '2026-11-04T21:00:59.443928Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'edd3b2b8-88f4-4d4b-a649-b8363b2aecdd',
  'fayec7129@gmail.com',
  'coumbafaye',
  'Coumba Faye',
  'etudiant',
  'ETU176',
  '',
  TRUE,
  '2026-10-24T17:31:52.714805Z',
  '2026-11-04T21:00:59.443928Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '6bb6b477-25ed-4b72-9004-af18894d3416',
  'authenticated',
  'authenticated',
  'penda0763@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T17:31:45.982668Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Penda Diallo ","is_active":false,"matricule":"ETU175","niveau":"NB","phone":null,"role":"etudiant","statut_inscription":"en_attente","username":"pendisha"}'::jsonb,
  '2026-10-24T17:31:45.977459Z',
  '2026-10-25T00:08:10.620867Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '6bb6b477-25ed-4b72-9004-af18894d3416',
  '6bb6b477-25ed-4b72-9004-af18894d3416',
  '6bb6b477-25ed-4b72-9004-af18894d3416',
  json_build_object('sub', '6bb6b477-25ed-4b72-9004-af18894d3416', 'email', 'penda0763@gmail.com')::jsonb,
  'email',
  '2026-10-24T17:31:45.982668Z',
  '2026-10-24T17:31:45.977459Z',
  '2026-10-25T00:08:10.620867Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '6bb6b477-25ed-4b72-9004-af18894d3416',
  'penda0763@gmail.com',
  'pendisha',
  'Penda Diallo ',
  'etudiant',
  'ETU175',
  '',
  TRUE,
  '2026-10-24T17:31:45.977459Z',
  '2026-10-25T00:08:10.620867Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'ecbdef9f-6b05-4287-8175-40ea79f679ef',
  'authenticated',
  'authenticated',
  'mouhamadoubabakane@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T17:31:01.58948Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Mouhamadou baba Kane ","is_active":false,"matricule":"ETU174","niveau":"NB","phone":null,"role":"etudiant","statut_inscription":"en_attente","username":"mouhamed_"}'::jsonb,
  '2026-10-24T17:31:01.561876Z',
  '2026-10-24T21:23:14.71337Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'ecbdef9f-6b05-4287-8175-40ea79f679ef',
  'ecbdef9f-6b05-4287-8175-40ea79f679ef',
  'ecbdef9f-6b05-4287-8175-40ea79f679ef',
  json_build_object('sub', 'ecbdef9f-6b05-4287-8175-40ea79f679ef', 'email', 'mouhamadoubabakane@gmail.com')::jsonb,
  'email',
  '2026-10-24T17:31:01.58948Z',
  '2026-10-24T17:31:01.561876Z',
  '2026-10-24T21:23:14.71337Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'ecbdef9f-6b05-4287-8175-40ea79f679ef',
  'mouhamadoubabakane@gmail.com',
  'mouhamed_',
  'Mouhamadou baba Kane ',
  'etudiant',
  'ETU174',
  '',
  TRUE,
  '2026-10-24T17:31:01.561876Z',
  '2026-10-24T21:23:14.71337Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '1e3bc712-a19d-4216-8e23-a2ce3c522f0d',
  'authenticated',
  'authenticated',
  'mouhamedrikudo77@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T17:10:00.058362Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Mouhamed El Moctar Ndiaye ","is_active":true,"matricule":"ETU173","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"ghostsn"}'::jsonb,
  '2026-10-24T17:10:00.055597Z',
  '2026-10-31T20:21:56.103545Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '1e3bc712-a19d-4216-8e23-a2ce3c522f0d',
  '1e3bc712-a19d-4216-8e23-a2ce3c522f0d',
  '1e3bc712-a19d-4216-8e23-a2ce3c522f0d',
  json_build_object('sub', '1e3bc712-a19d-4216-8e23-a2ce3c522f0d', 'email', 'mouhamedrikudo77@gmail.com')::jsonb,
  'email',
  '2026-10-24T17:10:00.058362Z',
  '2026-10-24T17:10:00.055597Z',
  '2026-10-31T20:21:56.103545Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '1e3bc712-a19d-4216-8e23-a2ce3c522f0d',
  'mouhamedrikudo77@gmail.com',
  'ghostsn',
  'Mouhamed El Moctar Ndiaye ',
  'etudiant',
  'ETU173',
  '',
  TRUE,
  '2026-10-24T17:10:00.055597Z',
  '2026-10-31T20:21:56.103545Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '2f6c032a-3726-42a9-985c-4d81902080b8',
  'authenticated',
  'authenticated',
  'bafanta005@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T17:09:49.757704Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Fatoumata Fanta BAH ","is_active":true,"matricule":"ETU172","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"bafanta00"}'::jsonb,
  '2026-10-24T17:09:49.73217Z',
  '2026-10-24T17:13:15.527021Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '2f6c032a-3726-42a9-985c-4d81902080b8',
  '2f6c032a-3726-42a9-985c-4d81902080b8',
  '2f6c032a-3726-42a9-985c-4d81902080b8',
  json_build_object('sub', '2f6c032a-3726-42a9-985c-4d81902080b8', 'email', 'bafanta005@gmail.com')::jsonb,
  'email',
  '2026-10-24T17:09:49.757704Z',
  '2026-10-24T17:09:49.73217Z',
  '2026-10-24T17:13:15.527021Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '2f6c032a-3726-42a9-985c-4d81902080b8',
  'bafanta005@gmail.com',
  'bafanta00',
  'Fatoumata Fanta BAH ',
  'etudiant',
  'ETU172',
  '',
  TRUE,
  '2026-10-24T17:09:49.73217Z',
  '2026-10-24T17:13:15.527021Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c5768bad-b1e3-48a7-819f-6c1e9b7b9d46',
  'authenticated',
  'authenticated',
  'bpenda764@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T17:05:59.326039Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Penda Ba","is_active":true,"matricule":"ETU171","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"mpenda"}'::jsonb,
  '2026-10-24T17:05:59.310006Z',
  '2026-10-24T20:54:09.772517Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'c5768bad-b1e3-48a7-819f-6c1e9b7b9d46',
  'c5768bad-b1e3-48a7-819f-6c1e9b7b9d46',
  'c5768bad-b1e3-48a7-819f-6c1e9b7b9d46',
  json_build_object('sub', 'c5768bad-b1e3-48a7-819f-6c1e9b7b9d46', 'email', 'bpenda764@gmail.com')::jsonb,
  'email',
  '2026-10-24T17:05:59.326039Z',
  '2026-10-24T17:05:59.310006Z',
  '2026-10-24T20:54:09.772517Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'c5768bad-b1e3-48a7-819f-6c1e9b7b9d46',
  'bpenda764@gmail.com',
  'mpenda',
  'Penda Ba',
  'etudiant',
  'ETU171',
  '',
  TRUE,
  '2026-10-24T17:05:59.310006Z',
  '2026-10-24T20:54:09.772517Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'd49562d6-9035-4aa5-81a3-5bdc988933a6',
  'authenticated',
  'authenticated',
  'amadoutidianembodji70@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T17:03:23.084586Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Amadou Tidiane Mbodji","is_active":true,"matricule":"ETU170","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"tidiane"}'::jsonb,
  '2026-10-24T17:03:23.070509Z',
  '2026-10-27T23:44:37.383321Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'd49562d6-9035-4aa5-81a3-5bdc988933a6',
  'd49562d6-9035-4aa5-81a3-5bdc988933a6',
  'd49562d6-9035-4aa5-81a3-5bdc988933a6',
  json_build_object('sub', 'd49562d6-9035-4aa5-81a3-5bdc988933a6', 'email', 'amadoutidianembodji70@gmail.com')::jsonb,
  'email',
  '2026-10-24T17:03:23.084586Z',
  '2026-10-24T17:03:23.070509Z',
  '2026-10-27T23:44:37.383321Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'd49562d6-9035-4aa5-81a3-5bdc988933a6',
  'amadoutidianembodji70@gmail.com',
  'tidiane',
  'Amadou Tidiane Mbodji',
  'etudiant',
  'ETU170',
  '',
  TRUE,
  '2026-10-24T17:03:23.070509Z',
  '2026-10-27T23:44:37.383321Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '9cbea623-8498-49a8-8910-bc52c6fb5e10',
  'authenticated',
  'authenticated',
  'juni0909.az.099@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T16:55:59.321475Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-SML","email_verified":true,"filiere":"SML","full_name":"Paul Mendy ","is_active":true,"matricule":"ETU169","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"pa2007"}'::jsonb,
  '2026-10-24T16:55:59.297328Z',
  '2026-10-24T18:21:59.392421Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '9cbea623-8498-49a8-8910-bc52c6fb5e10',
  '9cbea623-8498-49a8-8910-bc52c6fb5e10',
  '9cbea623-8498-49a8-8910-bc52c6fb5e10',
  json_build_object('sub', '9cbea623-8498-49a8-8910-bc52c6fb5e10', 'email', 'juni0909.az.099@gmail.com')::jsonb,
  'email',
  '2026-10-24T16:55:59.321475Z',
  '2026-10-24T16:55:59.297328Z',
  '2026-10-24T18:21:59.392421Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '9cbea623-8498-49a8-8910-bc52c6fb5e10',
  'juni0909.az.099@gmail.com',
  'pa2007',
  'Paul Mendy ',
  'etudiant',
  'ETU169',
  '',
  TRUE,
  '2026-10-24T16:55:59.297328Z',
  '2026-10-24T18:21:59.392421Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'eb1b9eb8-6ba4-4287-9e2d-a554ecce866c',
  'authenticated',
  'authenticated',
  'coumbaleye535@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T16:52:45.865909Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-SML","email_verified":true,"filiere":"SML","full_name":"Coumba leye","is_active":true,"matricule":"ETU168","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"coumbaleye"}'::jsonb,
  '2026-10-24T16:52:45.830904Z',
  '2026-10-24T16:54:01.845132Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'eb1b9eb8-6ba4-4287-9e2d-a554ecce866c',
  'eb1b9eb8-6ba4-4287-9e2d-a554ecce866c',
  'eb1b9eb8-6ba4-4287-9e2d-a554ecce866c',
  json_build_object('sub', 'eb1b9eb8-6ba4-4287-9e2d-a554ecce866c', 'email', 'coumbaleye535@gmail.com')::jsonb,
  'email',
  '2026-10-24T16:52:45.865909Z',
  '2026-10-24T16:52:45.830904Z',
  '2026-10-24T16:54:01.845132Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'eb1b9eb8-6ba4-4287-9e2d-a554ecce866c',
  'coumbaleye535@gmail.com',
  'coumbaleye',
  'Coumba leye',
  'etudiant',
  'ETU168',
  '',
  TRUE,
  '2026-10-24T16:52:45.830904Z',
  '2026-10-24T16:54:01.845132Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'e17f373d-8128-4304-a17d-75c15ccd53fa',
  'authenticated',
  'authenticated',
  'baldepasha12@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T16:52:09.37697Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-SML","email_verified":true,"filiere":"SML","full_name":"Aissatou Sabaly Baldé","is_active":true,"matricule":"ETU167","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"balde.sabaly"}'::jsonb,
  '2026-10-24T16:52:09.321181Z',
  '2026-10-28T19:51:56.945033Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'e17f373d-8128-4304-a17d-75c15ccd53fa',
  'e17f373d-8128-4304-a17d-75c15ccd53fa',
  'e17f373d-8128-4304-a17d-75c15ccd53fa',
  json_build_object('sub', 'e17f373d-8128-4304-a17d-75c15ccd53fa', 'email', 'baldepasha12@gmail.com')::jsonb,
  'email',
  '2026-10-24T16:52:09.37697Z',
  '2026-10-24T16:52:09.321181Z',
  '2026-10-28T19:51:56.945033Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'e17f373d-8128-4304-a17d-75c15ccd53fa',
  'baldepasha12@gmail.com',
  'balde.sabaly',
  'Aissatou Sabaly Baldé',
  'etudiant',
  'ETU167',
  '',
  TRUE,
  '2026-10-24T16:52:09.321181Z',
  '2026-10-28T19:51:56.945033Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '16372942-5939-47e2-89c6-e83259338e11',
  'authenticated',
  'authenticated',
  'bambindeyependa@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T16:51:10.404961Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-MPI","email_verified":true,"filiere":"MPI","full_name":"Ndeye Penda Bamby Ndieguene ","is_active":true,"matricule":"ETU166","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"qwerty0503"}'::jsonb,
  '2026-10-24T16:51:10.386468Z',
  '2026-10-24T21:17:35.468201Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '16372942-5939-47e2-89c6-e83259338e11',
  '16372942-5939-47e2-89c6-e83259338e11',
  '16372942-5939-47e2-89c6-e83259338e11',
  json_build_object('sub', '16372942-5939-47e2-89c6-e83259338e11', 'email', 'bambindeyependa@gmail.com')::jsonb,
  'email',
  '2026-10-24T16:51:10.404961Z',
  '2026-10-24T16:51:10.386468Z',
  '2026-10-24T21:17:35.468201Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '16372942-5939-47e2-89c6-e83259338e11',
  'bambindeyependa@gmail.com',
  'qwerty0503',
  'Ndeye Penda Bamby Ndieguene ',
  'etudiant',
  'ETU166',
  '',
  TRUE,
  '2026-10-24T16:51:10.386468Z',
  '2026-10-24T21:17:35.468201Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '049a2b85-d620-40e2-96be-405db987072b',
  'authenticated',
  'authenticated',
  'fatimbabadiop7@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T16:18:03.281097Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"NB-SML","email_verified":true,"filiere":"SML","full_name":"Ndeye Fatim Diop ","is_active":true,"matricule":"ETU159","niveau":"NB","role":"etudiant","statut_inscription":"valide","username":"n01725820262"}'::jsonb,
  '2026-10-24T16:18:03.242216Z',
  '2026-11-10T06:27:06.188998Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '049a2b85-d620-40e2-96be-405db987072b',
  '049a2b85-d620-40e2-96be-405db987072b',
  '049a2b85-d620-40e2-96be-405db987072b',
  json_build_object('sub', '049a2b85-d620-40e2-96be-405db987072b', 'email', 'fatimbabadiop7@gmail.com')::jsonb,
  'email',
  '2026-10-24T16:18:03.281097Z',
  '2026-10-24T16:18:03.242216Z',
  '2026-11-10T06:27:06.188998Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '049a2b85-d620-40e2-96be-405db987072b',
  'fatimbabadiop7@gmail.com',
  'n01725820262',
  'Ndeye Fatim Diop ',
  'etudiant',
  'ETU159',
  '',
  TRUE,
  '2026-10-24T16:18:03.242216Z',
  '2026-11-10T06:27:06.188998Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b08134f3-8d5b-4b60-bef1-bca68eabee14',
  'authenticated',
  'authenticated',
  'drame.oumy@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-24T14:07:36.708492Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Oumy Dramé ","is_active":true,"matricule":"ETU157","niveau":"L1","phone":"+221 785063015","role":"etudiant","statut_inscription":"valide","username":"oumy"}'::jsonb,
  '2026-10-24T14:07:36.670421Z',
  '2026-11-10T23:48:22.708786Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'b08134f3-8d5b-4b60-bef1-bca68eabee14',
  'b08134f3-8d5b-4b60-bef1-bca68eabee14',
  'b08134f3-8d5b-4b60-bef1-bca68eabee14',
  json_build_object('sub', 'b08134f3-8d5b-4b60-bef1-bca68eabee14', 'email', 'drame.oumy@uam.edu.sn')::jsonb,
  'email',
  '2026-10-24T14:07:36.708492Z',
  '2026-10-24T14:07:36.670421Z',
  '2026-11-10T23:48:22.708786Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'b08134f3-8d5b-4b60-bef1-bca68eabee14',
  'drame.oumy@uam.edu.sn',
  'oumy',
  'Oumy Dramé ',
  'etudiant',
  'ETU157',
  '',
  TRUE,
  '2026-10-24T14:07:36.670421Z',
  '2026-11-10T23:48:22.708786Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'd17ba4e0-20f0-4bf6-8fda-1b777f7f4f04',
  'authenticated',
  'authenticated',
  'fayemameawa2@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-23T19:19:01.26161Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Mame Awa Faye ","is_active":true,"matricule":"ETU156","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"m_hawwa7"}'::jsonb,
  '2026-10-23T19:19:01.229391Z',
  '2026-10-31T08:07:12.657344Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'd17ba4e0-20f0-4bf6-8fda-1b777f7f4f04',
  'd17ba4e0-20f0-4bf6-8fda-1b777f7f4f04',
  'd17ba4e0-20f0-4bf6-8fda-1b777f7f4f04',
  json_build_object('sub', 'd17ba4e0-20f0-4bf6-8fda-1b777f7f4f04', 'email', 'fayemameawa2@gmail.com')::jsonb,
  'email',
  '2026-10-23T19:19:01.26161Z',
  '2026-10-23T19:19:01.229391Z',
  '2026-10-31T08:07:12.657344Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'd17ba4e0-20f0-4bf6-8fda-1b777f7f4f04',
  'fayemameawa2@gmail.com',
  'm_hawwa7',
  'Mame Awa Faye ',
  'etudiant',
  'ETU156',
  '',
  TRUE,
  '2026-10-23T19:19:01.229391Z',
  '2026-10-31T08:07:12.657344Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'f61fc6d9-8515-4e36-9407-5269a76d6444',
  'authenticated',
  'authenticated',
  'thior.aissatou@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-23T09:59:17.489143Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Aïssatou Thior ","is_active":true,"matricule":"ETU155","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"sata24"}'::jsonb,
  '2026-10-23T09:59:17.454851Z',
  '2026-11-11T20:58:16.14123Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'f61fc6d9-8515-4e36-9407-5269a76d6444',
  'f61fc6d9-8515-4e36-9407-5269a76d6444',
  'f61fc6d9-8515-4e36-9407-5269a76d6444',
  json_build_object('sub', 'f61fc6d9-8515-4e36-9407-5269a76d6444', 'email', 'thior.aissatou@uam.edu.sn')::jsonb,
  'email',
  '2026-10-23T09:59:17.489143Z',
  '2026-10-23T09:59:17.454851Z',
  '2026-11-11T20:58:16.14123Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'f61fc6d9-8515-4e36-9407-5269a76d6444',
  'thior.aissatou@uam.edu.sn',
  'sata24',
  'Aïssatou Thior ',
  'etudiant',
  'ETU155',
  '',
  TRUE,
  '2026-10-23T09:59:17.454851Z',
  '2026-11-11T20:58:16.14123Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '7b234e27-2f8c-4a2f-a7e6-e2e0db886364',
  'authenticated',
  'authenticated',
  'mbengue.katia@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-22T20:35:14.314161Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-SML","email_verified":true,"filiere":"SML","full_name":"Marie Henriette Katia Mbengue","is_active":true,"matricule":"ETU154","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"katia"}'::jsonb,
  '2026-10-22T20:35:14.285707Z',
  '2026-11-09T20:03:49.574705Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '7b234e27-2f8c-4a2f-a7e6-e2e0db886364',
  '7b234e27-2f8c-4a2f-a7e6-e2e0db886364',
  '7b234e27-2f8c-4a2f-a7e6-e2e0db886364',
  json_build_object('sub', '7b234e27-2f8c-4a2f-a7e6-e2e0db886364', 'email', 'mbengue.katia@uam.edu.sn')::jsonb,
  'email',
  '2026-10-22T20:35:14.314161Z',
  '2026-10-22T20:35:14.285707Z',
  '2026-11-09T20:03:49.574705Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '7b234e27-2f8c-4a2f-a7e6-e2e0db886364',
  'mbengue.katia@uam.edu.sn',
  'katia',
  'Marie Henriette Katia Mbengue',
  'etudiant',
  'ETU154',
  '',
  TRUE,
  '2026-10-22T20:35:14.285707Z',
  '2026-11-09T20:03:49.574705Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '2f684033-0132-40a4-823b-bda64c83334c',
  'authenticated',
  'authenticated',
  'ba.khadidiatou@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-21T13:37:02.505272Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Khadidiatou ba","is_active":true,"matricule":"ETU153","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"603489"}'::jsonb,
  '2026-10-21T13:37:02.487306Z',
  '2026-11-11T13:41:40.28126Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '2f684033-0132-40a4-823b-bda64c83334c',
  '2f684033-0132-40a4-823b-bda64c83334c',
  '2f684033-0132-40a4-823b-bda64c83334c',
  json_build_object('sub', '2f684033-0132-40a4-823b-bda64c83334c', 'email', 'ba.khadidiatou@uam.edu.sn')::jsonb,
  'email',
  '2026-10-21T13:37:02.505272Z',
  '2026-10-21T13:37:02.487306Z',
  '2026-11-11T13:41:40.28126Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '2f684033-0132-40a4-823b-bda64c83334c',
  'ba.khadidiatou@uam.edu.sn',
  '603489',
  'Khadidiatou ba',
  'etudiant',
  'ETU153',
  '',
  TRUE,
  '2026-10-21T13:37:02.487306Z',
  '2026-11-11T13:41:40.28126Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'ce394516-7db5-456b-8b57-880ff5cc28f5',
  'authenticated',
  'authenticated',
  'mballofaty0@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-20T21:41:23.955874Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Fatimata Mballo ","is_active":true,"matricule":"ETU152","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"faty"}'::jsonb,
  '2026-10-20T21:41:23.886794Z',
  '2026-10-20T23:00:31.846771Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'ce394516-7db5-456b-8b57-880ff5cc28f5',
  'ce394516-7db5-456b-8b57-880ff5cc28f5',
  'ce394516-7db5-456b-8b57-880ff5cc28f5',
  json_build_object('sub', 'ce394516-7db5-456b-8b57-880ff5cc28f5', 'email', 'mballofaty0@gmail.com')::jsonb,
  'email',
  '2026-10-20T21:41:23.955874Z',
  '2026-10-20T21:41:23.886794Z',
  '2026-10-20T23:00:31.846771Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'ce394516-7db5-456b-8b57-880ff5cc28f5',
  'mballofaty0@gmail.com',
  'faty',
  'Fatimata Mballo ',
  'etudiant',
  'ETU152',
  '',
  TRUE,
  '2026-10-20T21:41:23.886794Z',
  '2026-10-20T23:00:31.846771Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '160f9542-f553-475f-bad0-04cae659790e',
  'authenticated',
  'authenticated',
  'shanne849@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-20T20:46:35.303686Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Saliou Hanne","is_active":true,"matricule":"ETU151","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"hsaliou"}'::jsonb,
  '2026-10-20T20:46:35.272469Z',
  '2026-11-10T22:18:56.331124Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '160f9542-f553-475f-bad0-04cae659790e',
  '160f9542-f553-475f-bad0-04cae659790e',
  '160f9542-f553-475f-bad0-04cae659790e',
  json_build_object('sub', '160f9542-f553-475f-bad0-04cae659790e', 'email', 'shanne849@gmail.com')::jsonb,
  'email',
  '2026-10-20T20:46:35.303686Z',
  '2026-10-20T20:46:35.272469Z',
  '2026-11-10T22:18:56.331124Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '160f9542-f553-475f-bad0-04cae659790e',
  'shanne849@gmail.com',
  'hsaliou',
  'Saliou Hanne',
  'etudiant',
  'ETU151',
  '',
  TRUE,
  '2026-10-20T20:46:35.272469Z',
  '2026-11-10T22:18:56.331124Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'aa60c182-347b-4f38-aea9-5d2cad74ef33',
  'authenticated',
  'authenticated',
  'adjarasall91@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-20T15:06:34.44289Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","date_expiration_paiement":"2026-12-12T23:59:59.000Z","date_validation_paiement":"2026-11-11T19:57:43.747Z","email_verified":true,"filiere":"MPI","full_name":"Adjara Sall","is_active":true,"matricule":"ETU150","niveau":"L2","role":"etudiant","statut_inscription":"valide","statut_paiement":"a_jour","username":"adja"}'::jsonb,
  '2026-10-20T15:06:34.402018Z',
  '2026-11-11T19:57:44.137628Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'aa60c182-347b-4f38-aea9-5d2cad74ef33',
  'aa60c182-347b-4f38-aea9-5d2cad74ef33',
  'aa60c182-347b-4f38-aea9-5d2cad74ef33',
  json_build_object('sub', 'aa60c182-347b-4f38-aea9-5d2cad74ef33', 'email', 'adjarasall91@gmail.com')::jsonb,
  'email',
  '2026-10-20T15:06:34.44289Z',
  '2026-10-20T15:06:34.402018Z',
  '2026-11-11T19:57:44.137628Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'aa60c182-347b-4f38-aea9-5d2cad74ef33',
  'adjarasall91@gmail.com',
  'adja',
  'Adjara Sall',
  'etudiant',
  'ETU150',
  '',
  TRUE,
  '2026-10-20T15:06:34.402018Z',
  '2026-11-11T19:57:44.137628Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '8a68badb-107f-40df-a154-b8a71cd1c3b7',
  'authenticated',
  'authenticated',
  'fatimg826@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-19T21:23:38.218055Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Fatim Gaye","is_active":true,"matricule":"ETU148","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"fatimgaye"}'::jsonb,
  '2026-10-19T21:23:38.1668Z',
  '2026-10-30T20:34:36.085922Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '8a68badb-107f-40df-a154-b8a71cd1c3b7',
  '8a68badb-107f-40df-a154-b8a71cd1c3b7',
  '8a68badb-107f-40df-a154-b8a71cd1c3b7',
  json_build_object('sub', '8a68badb-107f-40df-a154-b8a71cd1c3b7', 'email', 'fatimg826@gmail.com')::jsonb,
  'email',
  '2026-10-19T21:23:38.218055Z',
  '2026-10-19T21:23:38.1668Z',
  '2026-10-30T20:34:36.085922Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '8a68badb-107f-40df-a154-b8a71cd1c3b7',
  'fatimg826@gmail.com',
  'fatimgaye',
  'Fatim Gaye',
  'etudiant',
  'ETU148',
  '',
  TRUE,
  '2026-10-19T21:23:38.1668Z',
  '2026-10-30T20:34:36.085922Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '736cdfb6-4c97-4ca9-8ba7-8ee7564c3be0',
  'authenticated',
  'authenticated',
  'diaw.khadidiatou@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-19T20:59:55.030319Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Khadidiatou DIAW","is_active":true,"matricule":"ETU147","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"705560"}'::jsonb,
  '2026-10-19T20:59:55.016769Z',
  '2026-11-10T12:06:23.704247Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '736cdfb6-4c97-4ca9-8ba7-8ee7564c3be0',
  '736cdfb6-4c97-4ca9-8ba7-8ee7564c3be0',
  '736cdfb6-4c97-4ca9-8ba7-8ee7564c3be0',
  json_build_object('sub', '736cdfb6-4c97-4ca9-8ba7-8ee7564c3be0', 'email', 'diaw.khadidiatou@uam.edu.sn')::jsonb,
  'email',
  '2026-10-19T20:59:55.030319Z',
  '2026-10-19T20:59:55.016769Z',
  '2026-11-10T12:06:23.704247Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '736cdfb6-4c97-4ca9-8ba7-8ee7564c3be0',
  'diaw.khadidiatou@uam.edu.sn',
  '705560',
  'Khadidiatou DIAW',
  'etudiant',
  'ETU147',
  '',
  TRUE,
  '2026-10-19T20:59:55.016769Z',
  '2026-11-10T12:06:23.704247Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b64814cb-6315-4fdf-89cb-c2098cc269d1',
  'authenticated',
  'authenticated',
  'aichadiouma24@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-19T20:48:32.503221Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Aicha Camara ","is_active":true,"matricule":"ETU146","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"aichabouba"}'::jsonb,
  '2026-10-19T20:48:32.480397Z',
  '2026-11-03T22:48:57.545213Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'b64814cb-6315-4fdf-89cb-c2098cc269d1',
  'b64814cb-6315-4fdf-89cb-c2098cc269d1',
  'b64814cb-6315-4fdf-89cb-c2098cc269d1',
  json_build_object('sub', 'b64814cb-6315-4fdf-89cb-c2098cc269d1', 'email', 'aichadiouma24@gmail.com')::jsonb,
  'email',
  '2026-10-19T20:48:32.503221Z',
  '2026-10-19T20:48:32.480397Z',
  '2026-11-03T22:48:57.545213Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'b64814cb-6315-4fdf-89cb-c2098cc269d1',
  'aichadiouma24@gmail.com',
  'aichabouba',
  'Aicha Camara ',
  'etudiant',
  'ETU146',
  '',
  TRUE,
  '2026-10-19T20:48:32.480397Z',
  '2026-11-03T22:48:57.545213Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '8436f5ff-8415-450a-959e-4b55f61fe78d',
  'authenticated',
  'authenticated',
  'mamadisgne@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-17T19:56:00.147526Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-SML","email_verified":true,"filiere":"SML","full_name":"Marieme Diagne","is_active":true,"matricule":"ETU143","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"meeriam"}'::jsonb,
  '2026-10-17T19:56:00.128217Z',
  '2026-11-12T00:05:26.193935Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '8436f5ff-8415-450a-959e-4b55f61fe78d',
  '8436f5ff-8415-450a-959e-4b55f61fe78d',
  '8436f5ff-8415-450a-959e-4b55f61fe78d',
  json_build_object('sub', '8436f5ff-8415-450a-959e-4b55f61fe78d', 'email', 'mamadisgne@gmail.com')::jsonb,
  'email',
  '2026-10-17T19:56:00.147526Z',
  '2026-10-17T19:56:00.128217Z',
  '2026-11-12T00:05:26.193935Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '8436f5ff-8415-450a-959e-4b55f61fe78d',
  'mamadisgne@gmail.com',
  'meeriam',
  'Marieme Diagne',
  'etudiant',
  'ETU143',
  '',
  TRUE,
  '2026-10-17T19:56:00.128217Z',
  '2026-11-12T00:05:26.193935Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'db6aa134-77bc-48a3-995a-be19cbe4602d',
  'authenticated',
  'authenticated',
  'salioudia751@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-17T18:51:26.13092Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Papa Saliou Dia","is_active":true,"matricule":"ETU142","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"bayezalle"}'::jsonb,
  '2026-10-17T18:51:26.08766Z',
  '2026-11-12T10:21:41.818296Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'db6aa134-77bc-48a3-995a-be19cbe4602d',
  'db6aa134-77bc-48a3-995a-be19cbe4602d',
  'db6aa134-77bc-48a3-995a-be19cbe4602d',
  json_build_object('sub', 'db6aa134-77bc-48a3-995a-be19cbe4602d', 'email', 'salioudia751@gmail.com')::jsonb,
  'email',
  '2026-10-17T18:51:26.13092Z',
  '2026-10-17T18:51:26.08766Z',
  '2026-11-12T10:21:41.818296Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'db6aa134-77bc-48a3-995a-be19cbe4602d',
  'salioudia751@gmail.com',
  'bayezalle',
  'Papa Saliou Dia',
  'etudiant',
  'ETU142',
  '',
  TRUE,
  '2026-10-17T18:51:26.08766Z',
  '2026-11-12T10:21:41.818296Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '390347e4-91e9-4463-a542-e69074e2b7ad',
  'authenticated',
  'authenticated',
  'biayexavier08@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-17T08:47:07.071251Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Xavier Biaye ","is_active":true,"matricule":"ETU141","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"xavier"}'::jsonb,
  '2026-10-17T08:47:07.035727Z',
  '2026-11-10T10:05:35.611378Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '390347e4-91e9-4463-a542-e69074e2b7ad',
  '390347e4-91e9-4463-a542-e69074e2b7ad',
  '390347e4-91e9-4463-a542-e69074e2b7ad',
  json_build_object('sub', '390347e4-91e9-4463-a542-e69074e2b7ad', 'email', 'biayexavier08@gmail.com')::jsonb,
  'email',
  '2026-10-17T08:47:07.071251Z',
  '2026-10-17T08:47:07.035727Z',
  '2026-11-10T10:05:35.611378Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '390347e4-91e9-4463-a542-e69074e2b7ad',
  'biayexavier08@gmail.com',
  'xavier',
  'Xavier Biaye ',
  'etudiant',
  'ETU141',
  '',
  TRUE,
  '2026-10-17T08:47:07.035727Z',
  '2026-11-10T10:05:35.611378Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '5306695b-ecbe-4598-91a3-ab1b92fcefe6',
  'authenticated',
  'authenticated',
  'msarr8502@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-16T23:04:14.474039Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-SML","email_verified":true,"filiere":"SML","full_name":"Sokhna Diarra Bousso Sarr ","is_active":true,"matricule":"ETU140","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"sokhna.d"}'::jsonb,
  '2026-10-16T23:04:14.448022Z',
  '2026-10-21T09:37:27.457434Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '5306695b-ecbe-4598-91a3-ab1b92fcefe6',
  '5306695b-ecbe-4598-91a3-ab1b92fcefe6',
  '5306695b-ecbe-4598-91a3-ab1b92fcefe6',
  json_build_object('sub', '5306695b-ecbe-4598-91a3-ab1b92fcefe6', 'email', 'msarr8502@gmail.com')::jsonb,
  'email',
  '2026-10-16T23:04:14.474039Z',
  '2026-10-16T23:04:14.448022Z',
  '2026-10-21T09:37:27.457434Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '5306695b-ecbe-4598-91a3-ab1b92fcefe6',
  'msarr8502@gmail.com',
  'sokhna.d',
  'Sokhna Diarra Bousso Sarr ',
  'etudiant',
  'ETU140',
  '',
  TRUE,
  '2026-10-16T23:04:14.448022Z',
  '2026-10-21T09:37:27.457434Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '28575297-db3c-48fe-a83a-55c601bfd063',
  'authenticated',
  'authenticated',
  'famam0702@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-16T21:42:06.964352Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Fama Mbaye","is_active":true,"matricule":"ETU139","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"f_mb"}'::jsonb,
  '2026-10-16T21:42:06.940153Z',
  '2026-10-28T21:38:27.494514Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '28575297-db3c-48fe-a83a-55c601bfd063',
  '28575297-db3c-48fe-a83a-55c601bfd063',
  '28575297-db3c-48fe-a83a-55c601bfd063',
  json_build_object('sub', '28575297-db3c-48fe-a83a-55c601bfd063', 'email', 'famam0702@gmail.com')::jsonb,
  'email',
  '2026-10-16T21:42:06.964352Z',
  '2026-10-16T21:42:06.940153Z',
  '2026-10-28T21:38:27.494514Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '28575297-db3c-48fe-a83a-55c601bfd063',
  'famam0702@gmail.com',
  'f_mb',
  'Fama Mbaye',
  'etudiant',
  'ETU139',
  '',
  TRUE,
  '2026-10-16T21:42:06.940153Z',
  '2026-10-28T21:38:27.494514Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '5d426167-ba15-4d58-8efc-5debd6455be1',
  'authenticated',
  'authenticated',
  'mouhamadoudiop911@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-16T21:15:04.821104Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Mouhamadou Diop","is_active":true,"matricule":"ETU138","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"momo"}'::jsonb,
  '2026-10-16T21:15:04.795071Z',
  '2026-11-10T19:43:37.082727Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '5d426167-ba15-4d58-8efc-5debd6455be1',
  '5d426167-ba15-4d58-8efc-5debd6455be1',
  '5d426167-ba15-4d58-8efc-5debd6455be1',
  json_build_object('sub', '5d426167-ba15-4d58-8efc-5debd6455be1', 'email', 'mouhamadoudiop911@gmail.com')::jsonb,
  'email',
  '2026-10-16T21:15:04.821104Z',
  '2026-10-16T21:15:04.795071Z',
  '2026-11-10T19:43:37.082727Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '5d426167-ba15-4d58-8efc-5debd6455be1',
  'mouhamadoudiop911@gmail.com',
  'momo',
  'Mouhamadou Diop',
  'etudiant',
  'ETU138',
  '',
  TRUE,
  '2026-10-16T21:15:04.795071Z',
  '2026-11-10T19:43:37.082727Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '44a5a9be-459b-49ce-ada1-20a1117af8ad',
  'authenticated',
  'authenticated',
  'maimounag259@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-16T21:05:53.295005Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Sokhna Maïmouna Gueye ","is_active":true,"matricule":"ETU137","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"smgueye"}'::jsonb,
  '2026-10-16T21:05:53.272052Z',
  '2026-11-10T21:55:17.289665Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '44a5a9be-459b-49ce-ada1-20a1117af8ad',
  '44a5a9be-459b-49ce-ada1-20a1117af8ad',
  '44a5a9be-459b-49ce-ada1-20a1117af8ad',
  json_build_object('sub', '44a5a9be-459b-49ce-ada1-20a1117af8ad', 'email', 'maimounag259@gmail.com')::jsonb,
  'email',
  '2026-10-16T21:05:53.295005Z',
  '2026-10-16T21:05:53.272052Z',
  '2026-11-10T21:55:17.289665Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '44a5a9be-459b-49ce-ada1-20a1117af8ad',
  'maimounag259@gmail.com',
  'smgueye',
  'Sokhna Maïmouna Gueye ',
  'etudiant',
  'ETU137',
  '',
  TRUE,
  '2026-10-16T21:05:53.272052Z',
  '2026-11-10T21:55:17.289665Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '38c4b95f-f469-475f-a0cd-3cd1e89a6136',
  'authenticated',
  'authenticated',
  'diaw.anta1@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-16T20:59:11.70263Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Anta Diaw","is_active":true,"matricule":"ETU136","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"d77"}'::jsonb,
  '2026-10-16T20:59:11.682092Z',
  '2026-11-06T21:39:53.68248Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '38c4b95f-f469-475f-a0cd-3cd1e89a6136',
  '38c4b95f-f469-475f-a0cd-3cd1e89a6136',
  '38c4b95f-f469-475f-a0cd-3cd1e89a6136',
  json_build_object('sub', '38c4b95f-f469-475f-a0cd-3cd1e89a6136', 'email', 'diaw.anta1@uam.edu.sn')::jsonb,
  'email',
  '2026-10-16T20:59:11.70263Z',
  '2026-10-16T20:59:11.682092Z',
  '2026-11-06T21:39:53.68248Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '38c4b95f-f469-475f-a0cd-3cd1e89a6136',
  'diaw.anta1@uam.edu.sn',
  'd77',
  'Anta Diaw',
  'etudiant',
  'ETU136',
  '',
  TRUE,
  '2026-10-16T20:59:11.682092Z',
  '2026-11-06T21:39:53.68248Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '267929f8-fd69-4fdb-a333-b22228e606e7',
  'authenticated',
  'authenticated',
  'soxnambenesene@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-16T19:54:38.545649Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Sene mbene ","is_active":true,"matricule":"ETU135","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"mbene1"}'::jsonb,
  '2026-10-16T19:54:38.499658Z',
  '2026-11-08T20:45:37.583825Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '267929f8-fd69-4fdb-a333-b22228e606e7',
  '267929f8-fd69-4fdb-a333-b22228e606e7',
  '267929f8-fd69-4fdb-a333-b22228e606e7',
  json_build_object('sub', '267929f8-fd69-4fdb-a333-b22228e606e7', 'email', 'soxnambenesene@gmail.com')::jsonb,
  'email',
  '2026-10-16T19:54:38.545649Z',
  '2026-10-16T19:54:38.499658Z',
  '2026-11-08T20:45:37.583825Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '267929f8-fd69-4fdb-a333-b22228e606e7',
  'soxnambenesene@gmail.com',
  'mbene1',
  'Sene mbene ',
  'etudiant',
  'ETU135',
  '',
  TRUE,
  '2026-10-16T19:54:38.499658Z',
  '2026-11-08T20:45:37.583825Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'e303b8e5-11fa-4284-a2e2-2f3aae06d1c1',
  'authenticated',
  'authenticated',
  'medounembao935@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-16T19:08:11.163899Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Medoune Mbao","is_active":true,"matricule":"ETU134","niveau":"L1","phone":"+221 76 010 09 00","role":"etudiant","statut_inscription":"valide","username":"medoune"}'::jsonb,
  '2026-10-16T19:08:11.118634Z',
  '2026-11-10T20:09:33.410672Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'e303b8e5-11fa-4284-a2e2-2f3aae06d1c1',
  'e303b8e5-11fa-4284-a2e2-2f3aae06d1c1',
  'e303b8e5-11fa-4284-a2e2-2f3aae06d1c1',
  json_build_object('sub', 'e303b8e5-11fa-4284-a2e2-2f3aae06d1c1', 'email', 'medounembao935@gmail.com')::jsonb,
  'email',
  '2026-10-16T19:08:11.163899Z',
  '2026-10-16T19:08:11.118634Z',
  '2026-11-10T20:09:33.410672Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'e303b8e5-11fa-4284-a2e2-2f3aae06d1c1',
  'medounembao935@gmail.com',
  'medoune',
  'Medoune Mbao',
  'etudiant',
  'ETU134',
  '',
  TRUE,
  '2026-10-16T19:08:11.118634Z',
  '2026-11-10T20:09:33.410672Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'cb016c2f-a891-45e5-9247-df0d798aa775',
  'authenticated',
  'authenticated',
  'ndao.amy@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-16T18:17:43.75588Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Amy Ndao ","is_active":true,"matricule":"ETU133","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"amy"}'::jsonb,
  '2026-10-16T18:17:43.71732Z',
  '2026-11-09T21:19:08.639724Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'cb016c2f-a891-45e5-9247-df0d798aa775',
  'cb016c2f-a891-45e5-9247-df0d798aa775',
  'cb016c2f-a891-45e5-9247-df0d798aa775',
  json_build_object('sub', 'cb016c2f-a891-45e5-9247-df0d798aa775', 'email', 'ndao.amy@uam.edu.sn')::jsonb,
  'email',
  '2026-10-16T18:17:43.75588Z',
  '2026-10-16T18:17:43.71732Z',
  '2026-11-09T21:19:08.639724Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'cb016c2f-a891-45e5-9247-df0d798aa775',
  'ndao.amy@uam.edu.sn',
  'amy',
  'Amy Ndao ',
  'etudiant',
  'ETU133',
  '',
  TRUE,
  '2026-10-16T18:17:43.71732Z',
  '2026-11-09T21:19:08.639724Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '5e75518c-b278-4267-89a6-f03f9f592d30',
  'authenticated',
  'authenticated',
  'ly.ramatoulaye@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-16T07:40:45.999448Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Ramatoulaye Ly","is_active":true,"matricule":"ETU132","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"ramadou"}'::jsonb,
  '2026-10-16T07:40:45.934845Z',
  '2026-11-11T21:35:36.113671Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '5e75518c-b278-4267-89a6-f03f9f592d30',
  '5e75518c-b278-4267-89a6-f03f9f592d30',
  '5e75518c-b278-4267-89a6-f03f9f592d30',
  json_build_object('sub', '5e75518c-b278-4267-89a6-f03f9f592d30', 'email', 'ly.ramatoulaye@uam.edu.sn')::jsonb,
  'email',
  '2026-10-16T07:40:45.999448Z',
  '2026-10-16T07:40:45.934845Z',
  '2026-11-11T21:35:36.113671Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '5e75518c-b278-4267-89a6-f03f9f592d30',
  'ly.ramatoulaye@uam.edu.sn',
  'ramadou',
  'Ramatoulaye Ly',
  'etudiant',
  'ETU132',
  '',
  TRUE,
  '2026-10-16T07:40:45.934845Z',
  '2026-11-11T21:35:36.113671Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'eca088ab-fed1-4ef6-90af-a326d5962430',
  'authenticated',
  'authenticated',
  'mbayelucie0@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-16T02:04:49.568536Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Lucie Aline Paul Mbaye","is_active":true,"matricule":"ETU131","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"lucie"}'::jsonb,
  '2026-10-16T02:04:49.534613Z',
  '2026-11-11T16:28:02.334956Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'eca088ab-fed1-4ef6-90af-a326d5962430',
  'eca088ab-fed1-4ef6-90af-a326d5962430',
  'eca088ab-fed1-4ef6-90af-a326d5962430',
  json_build_object('sub', 'eca088ab-fed1-4ef6-90af-a326d5962430', 'email', 'mbayelucie0@gmail.com')::jsonb,
  'email',
  '2026-10-16T02:04:49.568536Z',
  '2026-10-16T02:04:49.534613Z',
  '2026-11-11T16:28:02.334956Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'eca088ab-fed1-4ef6-90af-a326d5962430',
  'mbayelucie0@gmail.com',
  'lucie',
  'Lucie Aline Paul Mbaye',
  'etudiant',
  'ETU131',
  '',
  TRUE,
  '2026-10-16T02:04:49.534613Z',
  '2026-11-11T16:28:02.334956Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'e9474367-f3be-44f0-94f7-91e9840e3942',
  'authenticated',
  'authenticated',
  'fatimawane1306@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-15T21:04:14.592981Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Fatoumata Wane","is_active":true,"matricule":"ETU129","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"fatimawane"}'::jsonb,
  '2026-10-15T21:04:14.571388Z',
  '2026-10-15T23:38:41.636419Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'e9474367-f3be-44f0-94f7-91e9840e3942',
  'e9474367-f3be-44f0-94f7-91e9840e3942',
  'e9474367-f3be-44f0-94f7-91e9840e3942',
  json_build_object('sub', 'e9474367-f3be-44f0-94f7-91e9840e3942', 'email', 'fatimawane1306@gmail.com')::jsonb,
  'email',
  '2026-10-15T21:04:14.592981Z',
  '2026-10-15T21:04:14.571388Z',
  '2026-10-15T23:38:41.636419Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'e9474367-f3be-44f0-94f7-91e9840e3942',
  'fatimawane1306@gmail.com',
  'fatimawane',
  'Fatoumata Wane',
  'etudiant',
  'ETU129',
  '',
  TRUE,
  '2026-10-15T21:04:14.571388Z',
  '2026-10-15T23:38:41.636419Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '9035e168-a828-40fa-98a2-a197a2483674',
  'authenticated',
  'authenticated',
  'wane.fatoumata@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-15T20:53:39.266652Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Fatoumata WANE","is_active":true,"matricule":"ETU128","niveau":"L2","phone":"+221 77 551 81 96","role":"etudiant","statut_inscription":"valide","username":"fatoumata"}'::jsonb,
  '2026-10-15T20:53:39.23359Z',
  '2026-11-10T21:03:27.730645Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '9035e168-a828-40fa-98a2-a197a2483674',
  '9035e168-a828-40fa-98a2-a197a2483674',
  '9035e168-a828-40fa-98a2-a197a2483674',
  json_build_object('sub', '9035e168-a828-40fa-98a2-a197a2483674', 'email', 'wane.fatoumata@uam.edu.sn')::jsonb,
  'email',
  '2026-10-15T20:53:39.266652Z',
  '2026-10-15T20:53:39.23359Z',
  '2026-11-10T21:03:27.730645Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '9035e168-a828-40fa-98a2-a197a2483674',
  'wane.fatoumata@uam.edu.sn',
  'fatoumata',
  'Fatoumata WANE',
  'etudiant',
  'ETU128',
  '',
  TRUE,
  '2026-10-15T20:53:39.23359Z',
  '2026-11-10T21:03:27.730645Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'cb1d2c21-e03a-4fe5-80b3-eaa5a1644247',
  'authenticated',
  'authenticated',
  'maleyegueye21@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-15T20:40:07.811292Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Maleye Gueye","is_active":true,"matricule":"ETU127","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"frankie21"}'::jsonb,
  '2026-10-15T20:40:07.780144Z',
  '2026-11-11T13:32:06.903521Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'cb1d2c21-e03a-4fe5-80b3-eaa5a1644247',
  'cb1d2c21-e03a-4fe5-80b3-eaa5a1644247',
  'cb1d2c21-e03a-4fe5-80b3-eaa5a1644247',
  json_build_object('sub', 'cb1d2c21-e03a-4fe5-80b3-eaa5a1644247', 'email', 'maleyegueye21@gmail.com')::jsonb,
  'email',
  '2026-10-15T20:40:07.811292Z',
  '2026-10-15T20:40:07.780144Z',
  '2026-11-11T13:32:06.903521Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'cb1d2c21-e03a-4fe5-80b3-eaa5a1644247',
  'maleyegueye21@gmail.com',
  'frankie21',
  'Maleye Gueye',
  'etudiant',
  'ETU127',
  '',
  TRUE,
  '2026-10-15T20:40:07.780144Z',
  '2026-11-11T13:32:06.903521Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'de622bff-08ad-4a9f-b3e4-bd7cb7e6ba67',
  'authenticated',
  'authenticated',
  'seydinaps1@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-15T16:12:51.264807Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-SML","email_verified":true,"filiere":"SML","full_name":"seydina Alioune Gueye","is_active":true,"matricule":"ETU126","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"seydina"}'::jsonb,
  '2026-10-15T16:12:51.240084Z',
  '2026-11-07T21:52:43.205079Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'de622bff-08ad-4a9f-b3e4-bd7cb7e6ba67',
  'de622bff-08ad-4a9f-b3e4-bd7cb7e6ba67',
  'de622bff-08ad-4a9f-b3e4-bd7cb7e6ba67',
  json_build_object('sub', 'de622bff-08ad-4a9f-b3e4-bd7cb7e6ba67', 'email', 'seydinaps1@gmail.com')::jsonb,
  'email',
  '2026-10-15T16:12:51.264807Z',
  '2026-10-15T16:12:51.240084Z',
  '2026-11-07T21:52:43.205079Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'de622bff-08ad-4a9f-b3e4-bd7cb7e6ba67',
  'seydinaps1@gmail.com',
  'seydina',
  'seydina Alioune Gueye',
  'etudiant',
  'ETU126',
  '',
  TRUE,
  '2026-10-15T16:12:51.240084Z',
  '2026-11-07T21:52:43.205079Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'cf2463a0-9bc4-4c48-a22c-ef8f9e067cb0',
  'authenticated',
  'authenticated',
  'sokhnafatym93@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-15T16:04:14.149781Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Sokhna Faty Mbacke ","is_active":true,"matricule":"ETU125","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"sfm"}'::jsonb,
  '2026-10-15T16:04:14.110076Z',
  '2026-11-10T21:07:58.970585Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'cf2463a0-9bc4-4c48-a22c-ef8f9e067cb0',
  'cf2463a0-9bc4-4c48-a22c-ef8f9e067cb0',
  'cf2463a0-9bc4-4c48-a22c-ef8f9e067cb0',
  json_build_object('sub', 'cf2463a0-9bc4-4c48-a22c-ef8f9e067cb0', 'email', 'sokhnafatym93@gmail.com')::jsonb,
  'email',
  '2026-10-15T16:04:14.149781Z',
  '2026-10-15T16:04:14.110076Z',
  '2026-11-10T21:07:58.970585Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'cf2463a0-9bc4-4c48-a22c-ef8f9e067cb0',
  'sokhnafatym93@gmail.com',
  'sfm',
  'Sokhna Faty Mbacke ',
  'etudiant',
  'ETU125',
  '',
  TRUE,
  '2026-10-15T16:04:14.110076Z',
  '2026-11-10T21:07:58.970585Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '9f9c150c-b72b-4827-8c96-efdd714b8301',
  'authenticated',
  'authenticated',
  'dioufndeyejuma2611@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-15T14:38:18.521888Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Ndeye Diouma Diouf","is_active":true,"matricule":"ETU124","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"nd.diouf"}'::jsonb,
  '2026-10-15T14:38:18.477199Z',
  '2026-11-10T22:57:17.281175Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '9f9c150c-b72b-4827-8c96-efdd714b8301',
  '9f9c150c-b72b-4827-8c96-efdd714b8301',
  '9f9c150c-b72b-4827-8c96-efdd714b8301',
  json_build_object('sub', '9f9c150c-b72b-4827-8c96-efdd714b8301', 'email', 'dioufndeyejuma2611@gmail.com')::jsonb,
  'email',
  '2026-10-15T14:38:18.521888Z',
  '2026-10-15T14:38:18.477199Z',
  '2026-11-10T22:57:17.281175Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '9f9c150c-b72b-4827-8c96-efdd714b8301',
  'dioufndeyejuma2611@gmail.com',
  'nd.diouf',
  'Ndeye Diouma Diouf',
  'etudiant',
  'ETU124',
  '',
  TRUE,
  '2026-10-15T14:38:18.477199Z',
  '2026-11-10T22:57:17.281175Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'dc4eabf5-fc30-4153-bdfa-2ece39766af1',
  'authenticated',
  'authenticated',
  'diouf.faliloulahi@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-15T12:32:38.953413Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Falilou DIOUF","is_active":true,"matricule":"ETU123","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"falilou"}'::jsonb,
  '2026-10-15T12:32:38.930617Z',
  '2026-11-10T11:01:20.635051Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'dc4eabf5-fc30-4153-bdfa-2ece39766af1',
  'dc4eabf5-fc30-4153-bdfa-2ece39766af1',
  'dc4eabf5-fc30-4153-bdfa-2ece39766af1',
  json_build_object('sub', 'dc4eabf5-fc30-4153-bdfa-2ece39766af1', 'email', 'diouf.faliloulahi@uam.edu.sn')::jsonb,
  'email',
  '2026-10-15T12:32:38.953413Z',
  '2026-10-15T12:32:38.930617Z',
  '2026-11-10T11:01:20.635051Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'dc4eabf5-fc30-4153-bdfa-2ece39766af1',
  'diouf.faliloulahi@uam.edu.sn',
  'falilou',
  'Falilou DIOUF',
  'etudiant',
  'ETU123',
  '',
  TRUE,
  '2026-10-15T12:32:38.930617Z',
  '2026-11-10T11:01:20.635051Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b644108e-1571-4700-a0b0-b50c41e5a9cd',
  'authenticated',
  'authenticated',
  'ndour.sadakh@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-15T12:19:45.016702Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"sadakh NDour ","is_active":true,"matricule":"ETU122","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"z-30"}'::jsonb,
  '2026-10-15T12:19:44.992452Z',
  '2026-11-11T21:45:44.616347Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'b644108e-1571-4700-a0b0-b50c41e5a9cd',
  'b644108e-1571-4700-a0b0-b50c41e5a9cd',
  'b644108e-1571-4700-a0b0-b50c41e5a9cd',
  json_build_object('sub', 'b644108e-1571-4700-a0b0-b50c41e5a9cd', 'email', 'ndour.sadakh@uam.edu.sn')::jsonb,
  'email',
  '2026-10-15T12:19:45.016702Z',
  '2026-10-15T12:19:44.992452Z',
  '2026-11-11T21:45:44.616347Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'b644108e-1571-4700-a0b0-b50c41e5a9cd',
  'ndour.sadakh@uam.edu.sn',
  'z-30',
  'sadakh NDour ',
  'etudiant',
  'ETU122',
  '',
  TRUE,
  '2026-10-15T12:19:44.992452Z',
  '2026-11-11T21:45:44.616347Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'dc575fdc-9aa5-4350-bcbd-0134aa582532',
  'authenticated',
  'authenticated',
  'traore.alima@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-15T12:12:51.081895Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Alima Traoré ","is_active":true,"matricule":"ETU121","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"sadiya"}'::jsonb,
  '2026-10-15T12:12:51.053126Z',
  '2026-11-12T01:48:34.685813Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'dc575fdc-9aa5-4350-bcbd-0134aa582532',
  'dc575fdc-9aa5-4350-bcbd-0134aa582532',
  'dc575fdc-9aa5-4350-bcbd-0134aa582532',
  json_build_object('sub', 'dc575fdc-9aa5-4350-bcbd-0134aa582532', 'email', 'traore.alima@uam.edu.sn')::jsonb,
  'email',
  '2026-10-15T12:12:51.081895Z',
  '2026-10-15T12:12:51.053126Z',
  '2026-11-12T01:48:34.685813Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'dc575fdc-9aa5-4350-bcbd-0134aa582532',
  'traore.alima@uam.edu.sn',
  'sadiya',
  'Alima Traoré ',
  'etudiant',
  'ETU121',
  '',
  TRUE,
  '2026-10-15T12:12:51.053126Z',
  '2026-11-12T01:48:34.685813Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '6c4c60ca-86fc-4523-8839-1ab38f2dd0eb',
  'authenticated',
  'authenticated',
  'ad5660481@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-14T23:33:57.831621Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Adama Diouf","is_active":true,"matricule":"ETU120","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"adama00"}'::jsonb,
  '2026-10-14T23:33:57.80968Z',
  '2026-11-11T20:06:53.44012Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '6c4c60ca-86fc-4523-8839-1ab38f2dd0eb',
  '6c4c60ca-86fc-4523-8839-1ab38f2dd0eb',
  '6c4c60ca-86fc-4523-8839-1ab38f2dd0eb',
  json_build_object('sub', '6c4c60ca-86fc-4523-8839-1ab38f2dd0eb', 'email', 'ad5660481@gmail.com')::jsonb,
  'email',
  '2026-10-14T23:33:57.831621Z',
  '2026-10-14T23:33:57.80968Z',
  '2026-11-11T20:06:53.44012Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '6c4c60ca-86fc-4523-8839-1ab38f2dd0eb',
  'ad5660481@gmail.com',
  'adama00',
  'Adama Diouf',
  'etudiant',
  'ETU120',
  '',
  TRUE,
  '2026-10-14T23:33:57.80968Z',
  '2026-11-11T20:06:53.44012Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '4fdb86ff-ca45-47f8-bf38-b3e89bb4e1a5',
  'authenticated',
  'authenticated',
  'fatimagueye101@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-14T23:21:29.705447Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Fatima Gueye","is_active":true,"matricule":"ETU119","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"luvtima"}'::jsonb,
  '2026-10-14T23:21:29.67755Z',
  '2026-10-21T21:35:25.69945Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '4fdb86ff-ca45-47f8-bf38-b3e89bb4e1a5',
  '4fdb86ff-ca45-47f8-bf38-b3e89bb4e1a5',
  '4fdb86ff-ca45-47f8-bf38-b3e89bb4e1a5',
  json_build_object('sub', '4fdb86ff-ca45-47f8-bf38-b3e89bb4e1a5', 'email', 'fatimagueye101@gmail.com')::jsonb,
  'email',
  '2026-10-14T23:21:29.705447Z',
  '2026-10-14T23:21:29.67755Z',
  '2026-10-21T21:35:25.69945Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '4fdb86ff-ca45-47f8-bf38-b3e89bb4e1a5',
  'fatimagueye101@gmail.com',
  'luvtima',
  'Fatima Gueye',
  'etudiant',
  'ETU119',
  '',
  TRUE,
  '2026-10-14T23:21:29.67755Z',
  '2026-10-21T21:35:25.69945Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '91cfadd0-4b41-41a1-b91c-c1e1e55f88ab',
  'authenticated',
  'authenticated',
  'ndiaye.mbaye1@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-14T22:27:21.409709Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Mbaye Ndiaye ","is_active":true,"matricule":"ETU118","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"mbayemn"}'::jsonb,
  '2026-10-14T22:27:21.387267Z',
  '2026-11-11T19:24:44.918074Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '91cfadd0-4b41-41a1-b91c-c1e1e55f88ab',
  '91cfadd0-4b41-41a1-b91c-c1e1e55f88ab',
  '91cfadd0-4b41-41a1-b91c-c1e1e55f88ab',
  json_build_object('sub', '91cfadd0-4b41-41a1-b91c-c1e1e55f88ab', 'email', 'ndiaye.mbaye1@uam.edu.sn')::jsonb,
  'email',
  '2026-10-14T22:27:21.409709Z',
  '2026-10-14T22:27:21.387267Z',
  '2026-11-11T19:24:44.918074Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '91cfadd0-4b41-41a1-b91c-c1e1e55f88ab',
  'ndiaye.mbaye1@uam.edu.sn',
  'mbayemn',
  'Mbaye Ndiaye ',
  'etudiant',
  'ETU118',
  '',
  TRUE,
  '2026-10-14T22:27:21.387267Z',
  '2026-11-11T19:24:44.918074Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '94147106-c808-40fa-a242-be5da3750456',
  'authenticated',
  'authenticated',
  'thiam.marietou@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-14T21:25:36.29275Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Mariétou Thiam ","is_active":true,"matricule":"ETU117","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"marietou20."}'::jsonb,
  '2026-10-14T21:25:36.275453Z',
  '2026-11-12T10:27:33.412461Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '94147106-c808-40fa-a242-be5da3750456',
  '94147106-c808-40fa-a242-be5da3750456',
  '94147106-c808-40fa-a242-be5da3750456',
  json_build_object('sub', '94147106-c808-40fa-a242-be5da3750456', 'email', 'thiam.marietou@uam.edu.sn')::jsonb,
  'email',
  '2026-10-14T21:25:36.29275Z',
  '2026-10-14T21:25:36.275453Z',
  '2026-11-12T10:27:33.412461Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '94147106-c808-40fa-a242-be5da3750456',
  'thiam.marietou@uam.edu.sn',
  'marietou20.',
  'Mariétou Thiam ',
  'etudiant',
  'ETU117',
  '',
  TRUE,
  '2026-10-14T21:25:36.275453Z',
  '2026-11-12T10:27:33.412461Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b93154dc-074d-4dfa-a6fa-76c527eba59f',
  'authenticated',
  'authenticated',
  'samb.diagne@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-14T21:10:33.232757Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Mama Diagne Samb","is_active":true,"matricule":"ETU116","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"704907"}'::jsonb,
  '2026-10-14T21:10:33.209825Z',
  '2026-11-10T19:53:06.547104Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'b93154dc-074d-4dfa-a6fa-76c527eba59f',
  'b93154dc-074d-4dfa-a6fa-76c527eba59f',
  'b93154dc-074d-4dfa-a6fa-76c527eba59f',
  json_build_object('sub', 'b93154dc-074d-4dfa-a6fa-76c527eba59f', 'email', 'samb.diagne@uam.edu.sn')::jsonb,
  'email',
  '2026-10-14T21:10:33.232757Z',
  '2026-10-14T21:10:33.209825Z',
  '2026-11-10T19:53:06.547104Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'b93154dc-074d-4dfa-a6fa-76c527eba59f',
  'samb.diagne@uam.edu.sn',
  '704907',
  'Mama Diagne Samb',
  'etudiant',
  'ETU116',
  '',
  TRUE,
  '2026-10-14T21:10:33.209825Z',
  '2026-11-10T19:53:06.547104Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '5780b613-8d29-45a2-98e4-d5635bda38af',
  'authenticated',
  'authenticated',
  'maimounahijab@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-14T20:57:46.315484Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Maimouna Diop","is_active":true,"matricule":"ETU115","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"maimounajoop"}'::jsonb,
  '2026-10-14T20:57:46.275382Z',
  '2026-11-11T19:41:14.483708Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '5780b613-8d29-45a2-98e4-d5635bda38af',
  '5780b613-8d29-45a2-98e4-d5635bda38af',
  '5780b613-8d29-45a2-98e4-d5635bda38af',
  json_build_object('sub', '5780b613-8d29-45a2-98e4-d5635bda38af', 'email', 'maimounahijab@gmail.com')::jsonb,
  'email',
  '2026-10-14T20:57:46.315484Z',
  '2026-10-14T20:57:46.275382Z',
  '2026-11-11T19:41:14.483708Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '5780b613-8d29-45a2-98e4-d5635bda38af',
  'maimounahijab@gmail.com',
  'maimounajoop',
  'Maimouna Diop',
  'etudiant',
  'ETU115',
  '',
  TRUE,
  '2026-10-14T20:57:46.275382Z',
  '2026-11-11T19:41:14.483708Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '4cf8b6ca-0a1f-4ee0-b6f0-637c79edd92b',
  'authenticated',
  'authenticated',
  'camara.nafi@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-14T19:42:26.817384Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Nafi Camara","is_active":true,"matricule":"ETU114","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"704905"}'::jsonb,
  '2026-10-14T19:42:26.799147Z',
  '2026-11-10T19:56:34.687508Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '4cf8b6ca-0a1f-4ee0-b6f0-637c79edd92b',
  '4cf8b6ca-0a1f-4ee0-b6f0-637c79edd92b',
  '4cf8b6ca-0a1f-4ee0-b6f0-637c79edd92b',
  json_build_object('sub', '4cf8b6ca-0a1f-4ee0-b6f0-637c79edd92b', 'email', 'camara.nafi@uam.edu.sn')::jsonb,
  'email',
  '2026-10-14T19:42:26.817384Z',
  '2026-10-14T19:42:26.799147Z',
  '2026-11-10T19:56:34.687508Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '4cf8b6ca-0a1f-4ee0-b6f0-637c79edd92b',
  'camara.nafi@uam.edu.sn',
  '704905',
  'Nafi Camara',
  'etudiant',
  'ETU114',
  '',
  TRUE,
  '2026-10-14T19:42:26.799147Z',
  '2026-11-10T19:56:34.687508Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '1bc3438f-c3c7-4374-8a0b-27adb4c637ee',
  'authenticated',
  'authenticated',
  'diabirane86@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-14T19:40:39.581554Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Birane Dia","is_active":true,"matricule":"ETU113","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"dia205"}'::jsonb,
  '2026-10-14T19:40:39.548342Z',
  '2026-11-11T19:59:59.929683Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '1bc3438f-c3c7-4374-8a0b-27adb4c637ee',
  '1bc3438f-c3c7-4374-8a0b-27adb4c637ee',
  '1bc3438f-c3c7-4374-8a0b-27adb4c637ee',
  json_build_object('sub', '1bc3438f-c3c7-4374-8a0b-27adb4c637ee', 'email', 'diabirane86@gmail.com')::jsonb,
  'email',
  '2026-10-14T19:40:39.581554Z',
  '2026-10-14T19:40:39.548342Z',
  '2026-11-11T19:59:59.929683Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '1bc3438f-c3c7-4374-8a0b-27adb4c637ee',
  'diabirane86@gmail.com',
  'dia205',
  'Birane Dia',
  'etudiant',
  'ETU113',
  '',
  TRUE,
  '2026-10-14T19:40:39.548342Z',
  '2026-11-11T19:59:59.929683Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'e76c4fa1-fb30-43ff-ab77-5d50b6b13431',
  'authenticated',
  'authenticated',
  'marietoudiengquenrema@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-14T17:27:09.389499Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Marietou dieng ","is_active":true,"matricule":"ETU112","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"zaida_32"}'::jsonb,
  '2026-10-14T17:27:09.35736Z',
  '2026-10-14T17:28:43.456782Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'e76c4fa1-fb30-43ff-ab77-5d50b6b13431',
  'e76c4fa1-fb30-43ff-ab77-5d50b6b13431',
  'e76c4fa1-fb30-43ff-ab77-5d50b6b13431',
  json_build_object('sub', 'e76c4fa1-fb30-43ff-ab77-5d50b6b13431', 'email', 'marietoudiengquenrema@gmail.com')::jsonb,
  'email',
  '2026-10-14T17:27:09.389499Z',
  '2026-10-14T17:27:09.35736Z',
  '2026-10-14T17:28:43.456782Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'e76c4fa1-fb30-43ff-ab77-5d50b6b13431',
  'marietoudiengquenrema@gmail.com',
  'zaida_32',
  'Marietou dieng ',
  'etudiant',
  'ETU112',
  '',
  TRUE,
  '2026-10-14T17:27:09.35736Z',
  '2026-10-14T17:28:43.456782Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '9a618491-f124-4445-a3c9-dd2c739b03ff',
  'authenticated',
  'authenticated',
  'diallo.lamine1@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-14T16:22:45.812075Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Mouhamadou Lamine Diallo","is_active":true,"matricule":"ETU111","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"lamine"}'::jsonb,
  '2026-10-14T16:22:45.793967Z',
  '2026-10-14T16:23:15.776354Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '9a618491-f124-4445-a3c9-dd2c739b03ff',
  '9a618491-f124-4445-a3c9-dd2c739b03ff',
  '9a618491-f124-4445-a3c9-dd2c739b03ff',
  json_build_object('sub', '9a618491-f124-4445-a3c9-dd2c739b03ff', 'email', 'diallo.lamine1@uam.edu.sn')::jsonb,
  'email',
  '2026-10-14T16:22:45.812075Z',
  '2026-10-14T16:22:45.793967Z',
  '2026-10-14T16:23:15.776354Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '9a618491-f124-4445-a3c9-dd2c739b03ff',
  'diallo.lamine1@uam.edu.sn',
  'lamine',
  'Mouhamadou Lamine Diallo',
  'etudiant',
  'ETU111',
  '',
  TRUE,
  '2026-10-14T16:22:45.793967Z',
  '2026-10-14T16:23:15.776354Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'dd7741bb-6dfa-4d63-b3c7-7c7104694ae6',
  'authenticated',
  'authenticated',
  'cheikhtidianefall992@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-14T16:06:27.701092Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Cheikh tidiane fall ","is_active":true,"matricule":"ETU110","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"cfall"}'::jsonb,
  '2026-10-14T16:06:27.695175Z',
  '2026-11-11T12:33:00.520078Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'dd7741bb-6dfa-4d63-b3c7-7c7104694ae6',
  'dd7741bb-6dfa-4d63-b3c7-7c7104694ae6',
  'dd7741bb-6dfa-4d63-b3c7-7c7104694ae6',
  json_build_object('sub', 'dd7741bb-6dfa-4d63-b3c7-7c7104694ae6', 'email', 'cheikhtidianefall992@gmail.com')::jsonb,
  'email',
  '2026-10-14T16:06:27.701092Z',
  '2026-10-14T16:06:27.695175Z',
  '2026-11-11T12:33:00.520078Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'dd7741bb-6dfa-4d63-b3c7-7c7104694ae6',
  'cheikhtidianefall992@gmail.com',
  'cfall',
  'Cheikh tidiane fall ',
  'etudiant',
  'ETU110',
  '',
  TRUE,
  '2026-10-14T16:06:27.695175Z',
  '2026-11-11T12:33:00.520078Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '64e8a6b0-974d-40f9-ad36-442b3f2ccbc6',
  'authenticated',
  'authenticated',
  'fall.cheikh2@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-14T16:03:07.308272Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Cheikh Fall ","is_active":true,"matricule":"ETU109","niveau":"L1","phone":"+221 77 551 81 96","role":"etudiant","statut_inscription":"valide","username":"soyezfous"}'::jsonb,
  '2026-10-14T16:03:07.2655Z',
  '2026-11-11T12:50:44.345201Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '64e8a6b0-974d-40f9-ad36-442b3f2ccbc6',
  '64e8a6b0-974d-40f9-ad36-442b3f2ccbc6',
  '64e8a6b0-974d-40f9-ad36-442b3f2ccbc6',
  json_build_object('sub', '64e8a6b0-974d-40f9-ad36-442b3f2ccbc6', 'email', 'fall.cheikh2@uam.edu.sn')::jsonb,
  'email',
  '2026-10-14T16:03:07.308272Z',
  '2026-10-14T16:03:07.2655Z',
  '2026-11-11T12:50:44.345201Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '64e8a6b0-974d-40f9-ad36-442b3f2ccbc6',
  'fall.cheikh2@uam.edu.sn',
  'soyezfous',
  'Cheikh Fall ',
  'etudiant',
  'ETU109',
  '',
  TRUE,
  '2026-10-14T16:03:07.2655Z',
  '2026-11-11T12:50:44.345201Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '9a986e56-48bd-4218-98f1-6f3800c47731',
  'authenticated',
  'authenticated',
  'thiamndeyekhady230@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-14T12:38:54.332311Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Ndeye Khady Thiam ","is_active":true,"matricule":"ETU108","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"soxnakhadijah"}'::jsonb,
  '2026-10-14T12:38:54.292163Z',
  '2026-11-05T21:11:16.722859Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '9a986e56-48bd-4218-98f1-6f3800c47731',
  '9a986e56-48bd-4218-98f1-6f3800c47731',
  '9a986e56-48bd-4218-98f1-6f3800c47731',
  json_build_object('sub', '9a986e56-48bd-4218-98f1-6f3800c47731', 'email', 'thiamndeyekhady230@gmail.com')::jsonb,
  'email',
  '2026-10-14T12:38:54.332311Z',
  '2026-10-14T12:38:54.292163Z',
  '2026-11-05T21:11:16.722859Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '9a986e56-48bd-4218-98f1-6f3800c47731',
  'thiamndeyekhady230@gmail.com',
  'soxnakhadijah',
  'Ndeye Khady Thiam ',
  'etudiant',
  'ETU108',
  '',
  TRUE,
  '2026-10-14T12:38:54.292163Z',
  '2026-11-05T21:11:16.722859Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '7d0c0e46-d9cf-4665-b32a-8628eeb79c4b',
  'authenticated',
  'authenticated',
  'mahmodanendiaye5932@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T23:37:00.127396Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MIASS","email_verified":true,"filiere":"MIASS","full_name":"NDIAYE MAHMODANE ","is_active":true,"matricule":"ETU107","niveau":"L1","phone":"+221 76 187 95 55","role":"etudiant","statut_inscription":"valide","username":"al_mahmoud"}'::jsonb,
  '2026-10-13T23:37:00.097485Z',
  '2026-11-11T14:44:42.302513Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '7d0c0e46-d9cf-4665-b32a-8628eeb79c4b',
  '7d0c0e46-d9cf-4665-b32a-8628eeb79c4b',
  '7d0c0e46-d9cf-4665-b32a-8628eeb79c4b',
  json_build_object('sub', '7d0c0e46-d9cf-4665-b32a-8628eeb79c4b', 'email', 'mahmodanendiaye5932@gmail.com')::jsonb,
  'email',
  '2026-10-13T23:37:00.127396Z',
  '2026-10-13T23:37:00.097485Z',
  '2026-11-11T14:44:42.302513Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '7d0c0e46-d9cf-4665-b32a-8628eeb79c4b',
  'mahmodanendiaye5932@gmail.com',
  'al_mahmoud',
  'NDIAYE MAHMODANE ',
  'etudiant',
  'ETU107',
  '',
  TRUE,
  '2026-10-13T23:37:00.097485Z',
  '2026-11-11T14:44:42.302513Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '139dfaa5-7fe4-4ed1-b864-e058affb6333',
  'authenticated',
  'authenticated',
  'wade.mouhamed@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T23:00:28.327087Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Mouhamed wade","is_active":true,"matricule":"ETU106","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"mouhamed"}'::jsonb,
  '2026-10-13T23:00:28.315261Z',
  '2026-11-10T20:09:07.818988Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '139dfaa5-7fe4-4ed1-b864-e058affb6333',
  '139dfaa5-7fe4-4ed1-b864-e058affb6333',
  '139dfaa5-7fe4-4ed1-b864-e058affb6333',
  json_build_object('sub', '139dfaa5-7fe4-4ed1-b864-e058affb6333', 'email', 'wade.mouhamed@uam.edu.sn')::jsonb,
  'email',
  '2026-10-13T23:00:28.327087Z',
  '2026-10-13T23:00:28.315261Z',
  '2026-11-10T20:09:07.818988Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '139dfaa5-7fe4-4ed1-b864-e058affb6333',
  'wade.mouhamed@uam.edu.sn',
  'mouhamed',
  'Mouhamed wade',
  'etudiant',
  'ETU106',
  '',
  TRUE,
  '2026-10-13T23:00:28.315261Z',
  '2026-11-10T20:09:07.818988Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '9e122fa2-f168-41f2-85ae-6b5b0eb96c65',
  'authenticated',
  'authenticated',
  'bacouraniang2006@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T22:27:47.902129Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Coura Niang Ba","is_active":true,"matricule":"ETU105","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"apecsy76"}'::jsonb,
  '2026-10-13T22:27:47.862946Z',
  '2026-11-11T19:21:32.860375Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '9e122fa2-f168-41f2-85ae-6b5b0eb96c65',
  '9e122fa2-f168-41f2-85ae-6b5b0eb96c65',
  '9e122fa2-f168-41f2-85ae-6b5b0eb96c65',
  json_build_object('sub', '9e122fa2-f168-41f2-85ae-6b5b0eb96c65', 'email', 'bacouraniang2006@gmail.com')::jsonb,
  'email',
  '2026-10-13T22:27:47.902129Z',
  '2026-10-13T22:27:47.862946Z',
  '2026-11-11T19:21:32.860375Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '9e122fa2-f168-41f2-85ae-6b5b0eb96c65',
  'bacouraniang2006@gmail.com',
  'apecsy76',
  'Coura Niang Ba',
  'etudiant',
  'ETU105',
  '',
  TRUE,
  '2026-10-13T22:27:47.862946Z',
  '2026-11-11T19:21:32.860375Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '943bab01-ff76-401d-a62c-3de9b4548b01',
  'authenticated',
  'authenticated',
  'adamawadiarra@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T22:02:23.290489Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"ADAM DIARRA","is_active":true,"matricule":"ETU104","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"diarrise"}'::jsonb,
  '2026-10-13T22:02:23.248381Z',
  '2026-10-28T21:05:06.673398Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '943bab01-ff76-401d-a62c-3de9b4548b01',
  '943bab01-ff76-401d-a62c-3de9b4548b01',
  '943bab01-ff76-401d-a62c-3de9b4548b01',
  json_build_object('sub', '943bab01-ff76-401d-a62c-3de9b4548b01', 'email', 'adamawadiarra@gmail.com')::jsonb,
  'email',
  '2026-10-13T22:02:23.290489Z',
  '2026-10-13T22:02:23.248381Z',
  '2026-10-28T21:05:06.673398Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '943bab01-ff76-401d-a62c-3de9b4548b01',
  'adamawadiarra@gmail.com',
  'diarrise',
  'ADAM DIARRA',
  'etudiant',
  'ETU104',
  '',
  TRUE,
  '2026-10-13T22:02:23.248381Z',
  '2026-10-28T21:05:06.673398Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '8ae02db6-f604-438d-83c7-16a91aad9ced',
  'authenticated',
  'authenticated',
  'gaye.fatim@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T21:53:24.340845Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Fatim Gaye ","is_active":true,"matricule":"ETU103","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"fatim-gaye"}'::jsonb,
  '2026-10-13T21:53:24.301335Z',
  '2026-10-19T20:30:17.111406Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '8ae02db6-f604-438d-83c7-16a91aad9ced',
  '8ae02db6-f604-438d-83c7-16a91aad9ced',
  '8ae02db6-f604-438d-83c7-16a91aad9ced',
  json_build_object('sub', '8ae02db6-f604-438d-83c7-16a91aad9ced', 'email', 'gaye.fatim@uam.edu.sn')::jsonb,
  'email',
  '2026-10-13T21:53:24.340845Z',
  '2026-10-13T21:53:24.301335Z',
  '2026-10-19T20:30:17.111406Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '8ae02db6-f604-438d-83c7-16a91aad9ced',
  'gaye.fatim@uam.edu.sn',
  'fatim-gaye',
  'Fatim Gaye ',
  'etudiant',
  'ETU103',
  '',
  TRUE,
  '2026-10-13T21:53:24.301335Z',
  '2026-10-19T20:30:17.111406Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'e51f229f-192b-4f62-a6e0-a97fbadaff78',
  'authenticated',
  'authenticated',
  'fayeadjiratoukhemesse@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T21:17:08.807255Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Adjiratou khemesse Faye","is_active":true,"matricule":"ETU102","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"akfaye"}'::jsonb,
  '2026-10-13T21:17:08.796417Z',
  '2026-11-08T22:54:12.73297Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'e51f229f-192b-4f62-a6e0-a97fbadaff78',
  'e51f229f-192b-4f62-a6e0-a97fbadaff78',
  'e51f229f-192b-4f62-a6e0-a97fbadaff78',
  json_build_object('sub', 'e51f229f-192b-4f62-a6e0-a97fbadaff78', 'email', 'fayeadjiratoukhemesse@gmail.com')::jsonb,
  'email',
  '2026-10-13T21:17:08.807255Z',
  '2026-10-13T21:17:08.796417Z',
  '2026-11-08T22:54:12.73297Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'e51f229f-192b-4f62-a6e0-a97fbadaff78',
  'fayeadjiratoukhemesse@gmail.com',
  'akfaye',
  'Adjiratou khemesse Faye',
  'etudiant',
  'ETU102',
  '',
  TRUE,
  '2026-10-13T21:17:08.796417Z',
  '2026-11-08T22:54:12.73297Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '4276fce0-ffb6-4ddc-b900-82242127be2b',
  'authenticated',
  'authenticated',
  'adamamariamambaye@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T21:15:57.862962Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Adama Mariama Mbaye","is_active":true,"matricule":"ETU101","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"mariamasoda"}'::jsonb,
  '2026-10-13T21:15:57.852872Z',
  '2026-11-09T20:13:03.857151Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '4276fce0-ffb6-4ddc-b900-82242127be2b',
  '4276fce0-ffb6-4ddc-b900-82242127be2b',
  '4276fce0-ffb6-4ddc-b900-82242127be2b',
  json_build_object('sub', '4276fce0-ffb6-4ddc-b900-82242127be2b', 'email', 'adamamariamambaye@gmail.com')::jsonb,
  'email',
  '2026-10-13T21:15:57.862962Z',
  '2026-10-13T21:15:57.852872Z',
  '2026-11-09T20:13:03.857151Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '4276fce0-ffb6-4ddc-b900-82242127be2b',
  'adamamariamambaye@gmail.com',
  'mariamasoda',
  'Adama Mariama Mbaye',
  'etudiant',
  'ETU101',
  '',
  TRUE,
  '2026-10-13T21:15:57.852872Z',
  '2026-11-09T20:13:03.857151Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '09d5955c-1bfd-4446-b8b7-f1f2737e4df5',
  'authenticated',
  'authenticated',
  'bahoumouawa195@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T21:14:51.748316Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"BA Oumou Awa","is_active":true,"matricule":"ETU100","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"oumouba19"}'::jsonb,
  '2026-10-13T21:14:51.741165Z',
  '2026-11-10T21:08:24.370574Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '09d5955c-1bfd-4446-b8b7-f1f2737e4df5',
  '09d5955c-1bfd-4446-b8b7-f1f2737e4df5',
  '09d5955c-1bfd-4446-b8b7-f1f2737e4df5',
  json_build_object('sub', '09d5955c-1bfd-4446-b8b7-f1f2737e4df5', 'email', 'bahoumouawa195@gmail.com')::jsonb,
  'email',
  '2026-10-13T21:14:51.748316Z',
  '2026-10-13T21:14:51.741165Z',
  '2026-11-10T21:08:24.370574Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '09d5955c-1bfd-4446-b8b7-f1f2737e4df5',
  'bahoumouawa195@gmail.com',
  'oumouba19',
  'BA Oumou Awa',
  'etudiant',
  'ETU100',
  '',
  TRUE,
  '2026-10-13T21:14:51.741165Z',
  '2026-11-10T21:08:24.370574Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '2b0f75af-30bb-4b6a-93d2-8ef0bb639a09',
  'authenticated',
  'authenticated',
  'rokhaya132005@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T21:11:20.400035Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Rokhaya","is_active":true,"matricule":"ETU099","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"dieynaba13"}'::jsonb,
  '2026-10-13T21:11:20.36494Z',
  '2026-11-01T21:10:46.868084Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '2b0f75af-30bb-4b6a-93d2-8ef0bb639a09',
  '2b0f75af-30bb-4b6a-93d2-8ef0bb639a09',
  '2b0f75af-30bb-4b6a-93d2-8ef0bb639a09',
  json_build_object('sub', '2b0f75af-30bb-4b6a-93d2-8ef0bb639a09', 'email', 'rokhaya132005@gmail.com')::jsonb,
  'email',
  '2026-10-13T21:11:20.400035Z',
  '2026-10-13T21:11:20.36494Z',
  '2026-11-01T21:10:46.868084Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '2b0f75af-30bb-4b6a-93d2-8ef0bb639a09',
  'rokhaya132005@gmail.com',
  'dieynaba13',
  'Rokhaya',
  'etudiant',
  'ETU099',
  '',
  TRUE,
  '2026-10-13T21:11:20.36494Z',
  '2026-11-01T21:10:46.868084Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'e9b17b3c-7f14-4118-b13a-e84a3e6b5b1a',
  'authenticated',
  'authenticated',
  'alioukonte2006@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T21:10:09.538895Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Aliou Konté ","is_active":true,"matricule":"ETU098","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"alioukonte"}'::jsonb,
  '2026-10-13T21:10:09.525433Z',
  '2026-11-11T23:50:23.072021Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'e9b17b3c-7f14-4118-b13a-e84a3e6b5b1a',
  'e9b17b3c-7f14-4118-b13a-e84a3e6b5b1a',
  'e9b17b3c-7f14-4118-b13a-e84a3e6b5b1a',
  json_build_object('sub', 'e9b17b3c-7f14-4118-b13a-e84a3e6b5b1a', 'email', 'alioukonte2006@gmail.com')::jsonb,
  'email',
  '2026-10-13T21:10:09.538895Z',
  '2026-10-13T21:10:09.525433Z',
  '2026-11-11T23:50:23.072021Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'e9b17b3c-7f14-4118-b13a-e84a3e6b5b1a',
  'alioukonte2006@gmail.com',
  'alioukonte',
  'Aliou Konté ',
  'etudiant',
  'ETU098',
  '',
  TRUE,
  '2026-10-13T21:10:09.525433Z',
  '2026-11-11T23:50:23.072021Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'fa76db76-e0c3-4d10-96a3-aaa9702841f4',
  'authenticated',
  'authenticated',
  'thiernosalmanabarry11@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T20:54:04.784861Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Thierno Salmana Barry","is_active":true,"matricule":"ETU097","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"thier_salmana"}'::jsonb,
  '2026-10-13T20:54:04.777777Z',
  '2026-10-14T17:02:54.772273Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'fa76db76-e0c3-4d10-96a3-aaa9702841f4',
  'fa76db76-e0c3-4d10-96a3-aaa9702841f4',
  'fa76db76-e0c3-4d10-96a3-aaa9702841f4',
  json_build_object('sub', 'fa76db76-e0c3-4d10-96a3-aaa9702841f4', 'email', 'thiernosalmanabarry11@gmail.com')::jsonb,
  'email',
  '2026-10-13T20:54:04.784861Z',
  '2026-10-13T20:54:04.777777Z',
  '2026-10-14T17:02:54.772273Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'fa76db76-e0c3-4d10-96a3-aaa9702841f4',
  'thiernosalmanabarry11@gmail.com',
  'thier_salmana',
  'Thierno Salmana Barry',
  'etudiant',
  'ETU097',
  '',
  TRUE,
  '2026-10-13T20:54:04.777777Z',
  '2026-10-14T17:02:54.772273Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '44dc3d35-1e27-4350-83c9-70209137cbc1',
  'authenticated',
  'authenticated',
  'fatimembengue501@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T20:52:32.021518Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Fatime Mbengue","is_active":true,"matricule":"ETU096","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"fatima"}'::jsonb,
  '2026-10-13T20:52:32.018951Z',
  '2026-11-10T22:55:45.234724Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '44dc3d35-1e27-4350-83c9-70209137cbc1',
  '44dc3d35-1e27-4350-83c9-70209137cbc1',
  '44dc3d35-1e27-4350-83c9-70209137cbc1',
  json_build_object('sub', '44dc3d35-1e27-4350-83c9-70209137cbc1', 'email', 'fatimembengue501@gmail.com')::jsonb,
  'email',
  '2026-10-13T20:52:32.021518Z',
  '2026-10-13T20:52:32.018951Z',
  '2026-11-10T22:55:45.234724Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '44dc3d35-1e27-4350-83c9-70209137cbc1',
  'fatimembengue501@gmail.com',
  'fatima',
  'Fatime Mbengue',
  'etudiant',
  'ETU096',
  '',
  TRUE,
  '2026-10-13T20:52:32.018951Z',
  '2026-11-10T22:55:45.234724Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'ab0b66c8-9962-4734-bb8e-69703122177c',
  'authenticated',
  'authenticated',
  'tndeyekhady35@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T20:52:10.276649Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Ndeye khady Thiam ","is_active":true,"matricule":"ETU095","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"ndeyekhady"}'::jsonb,
  '2026-10-13T20:52:10.262312Z',
  '2026-11-11T15:59:32.567249Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'ab0b66c8-9962-4734-bb8e-69703122177c',
  'ab0b66c8-9962-4734-bb8e-69703122177c',
  'ab0b66c8-9962-4734-bb8e-69703122177c',
  json_build_object('sub', 'ab0b66c8-9962-4734-bb8e-69703122177c', 'email', 'tndeyekhady35@gmail.com')::jsonb,
  'email',
  '2026-10-13T20:52:10.276649Z',
  '2026-10-13T20:52:10.262312Z',
  '2026-11-11T15:59:32.567249Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'ab0b66c8-9962-4734-bb8e-69703122177c',
  'tndeyekhady35@gmail.com',
  'ndeyekhady',
  'Ndeye khady Thiam ',
  'etudiant',
  'ETU095',
  '',
  TRUE,
  '2026-10-13T20:52:10.262312Z',
  '2026-11-11T15:59:32.567249Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '6f1f69ac-bc24-40f1-b186-43073f2999d5',
  'authenticated',
  'authenticated',
  'anissadiedhiou@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T20:26:41.565001Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Anissa binta Diedhiou","is_active":true,"matricule":"ETU094","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"ani"}'::jsonb,
  '2026-10-13T20:26:41.529747Z',
  '2026-10-26T21:54:20.600056Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '6f1f69ac-bc24-40f1-b186-43073f2999d5',
  '6f1f69ac-bc24-40f1-b186-43073f2999d5',
  '6f1f69ac-bc24-40f1-b186-43073f2999d5',
  json_build_object('sub', '6f1f69ac-bc24-40f1-b186-43073f2999d5', 'email', 'anissadiedhiou@gmail.com')::jsonb,
  'email',
  '2026-10-13T20:26:41.565001Z',
  '2026-10-13T20:26:41.529747Z',
  '2026-10-26T21:54:20.600056Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '6f1f69ac-bc24-40f1-b186-43073f2999d5',
  'anissadiedhiou@gmail.com',
  'ani',
  'Anissa binta Diedhiou',
  'etudiant',
  'ETU094',
  '',
  TRUE,
  '2026-10-13T20:26:41.529747Z',
  '2026-10-26T21:54:20.600056Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '4aa582f3-f29c-480c-aaa7-f75a45238d0b',
  'authenticated',
  'authenticated',
  'diouf.aicha1@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T20:05:54.577132Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Ndeye Aïcha Diouf ","is_active":true,"matricule":"ETU093","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"aicha12"}'::jsonb,
  '2026-10-13T20:05:54.546358Z',
  '2026-11-10T20:51:52.019313Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '4aa582f3-f29c-480c-aaa7-f75a45238d0b',
  '4aa582f3-f29c-480c-aaa7-f75a45238d0b',
  '4aa582f3-f29c-480c-aaa7-f75a45238d0b',
  json_build_object('sub', '4aa582f3-f29c-480c-aaa7-f75a45238d0b', 'email', 'diouf.aicha1@uam.edu.sn')::jsonb,
  'email',
  '2026-10-13T20:05:54.577132Z',
  '2026-10-13T20:05:54.546358Z',
  '2026-11-10T20:51:52.019313Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '4aa582f3-f29c-480c-aaa7-f75a45238d0b',
  'diouf.aicha1@uam.edu.sn',
  'aicha12',
  'Ndeye Aïcha Diouf ',
  'etudiant',
  'ETU093',
  '',
  TRUE,
  '2026-10-13T20:05:54.546358Z',
  '2026-11-10T20:51:52.019313Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'da7d7f4c-e0c0-4f9a-9f5d-2f7e8903acec',
  'authenticated',
  'authenticated',
  'myachou077@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T19:56:32.399706Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Amy Ndiaye ","is_active":true,"matricule":"ETU092","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"705286"}'::jsonb,
  '2026-10-13T19:56:32.363611Z',
  '2026-11-10T20:13:50.318818Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'da7d7f4c-e0c0-4f9a-9f5d-2f7e8903acec',
  'da7d7f4c-e0c0-4f9a-9f5d-2f7e8903acec',
  'da7d7f4c-e0c0-4f9a-9f5d-2f7e8903acec',
  json_build_object('sub', 'da7d7f4c-e0c0-4f9a-9f5d-2f7e8903acec', 'email', 'myachou077@gmail.com')::jsonb,
  'email',
  '2026-10-13T19:56:32.399706Z',
  '2026-10-13T19:56:32.363611Z',
  '2026-11-10T20:13:50.318818Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'da7d7f4c-e0c0-4f9a-9f5d-2f7e8903acec',
  'myachou077@gmail.com',
  '705286',
  'Amy Ndiaye ',
  'etudiant',
  'ETU092',
  '',
  TRUE,
  '2026-10-13T19:56:32.363611Z',
  '2026-11-10T20:13:50.318818Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '97d036b9-97f4-4089-b9f2-8543ec1899c0',
  'authenticated',
  'authenticated',
  'mendya434@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T19:48:50.695975Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Alex Mendy","is_active":true,"matricule":"ETU091","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"705291"}'::jsonb,
  '2026-10-13T19:48:50.676202Z',
  '2026-11-11T19:23:39.366833Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '97d036b9-97f4-4089-b9f2-8543ec1899c0',
  '97d036b9-97f4-4089-b9f2-8543ec1899c0',
  '97d036b9-97f4-4089-b9f2-8543ec1899c0',
  json_build_object('sub', '97d036b9-97f4-4089-b9f2-8543ec1899c0', 'email', 'mendya434@gmail.com')::jsonb,
  'email',
  '2026-10-13T19:48:50.695975Z',
  '2026-10-13T19:48:50.676202Z',
  '2026-11-11T19:23:39.366833Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '97d036b9-97f4-4089-b9f2-8543ec1899c0',
  'mendya434@gmail.com',
  '705291',
  'Alex Mendy',
  'etudiant',
  'ETU091',
  '',
  TRUE,
  '2026-10-13T19:48:50.676202Z',
  '2026-11-11T19:23:39.366833Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b6c3a5b9-69c0-427a-8258-c8d2e945d32d',
  'authenticated',
  'authenticated',
  'ndiaye.diogob@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T19:22:55.926794Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-SML","email_verified":true,"filiere":"SML","full_name":"Ndeye diogob ndiaye","is_active":true,"matricule":"ETU090","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"-ndeye"}'::jsonb,
  '2026-10-13T19:22:55.909006Z',
  '2026-11-10T20:39:30.918283Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'b6c3a5b9-69c0-427a-8258-c8d2e945d32d',
  'b6c3a5b9-69c0-427a-8258-c8d2e945d32d',
  'b6c3a5b9-69c0-427a-8258-c8d2e945d32d',
  json_build_object('sub', 'b6c3a5b9-69c0-427a-8258-c8d2e945d32d', 'email', 'ndiaye.diogob@uam.edu.sn')::jsonb,
  'email',
  '2026-10-13T19:22:55.926794Z',
  '2026-10-13T19:22:55.909006Z',
  '2026-11-10T20:39:30.918283Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'b6c3a5b9-69c0-427a-8258-c8d2e945d32d',
  'ndiaye.diogob@uam.edu.sn',
  '-ndeye',
  'Ndeye diogob ndiaye',
  'etudiant',
  'ETU090',
  '',
  TRUE,
  '2026-10-13T19:22:55.909006Z',
  '2026-11-10T20:39:30.918283Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '9d739ed7-daa9-457d-bcc0-88595a4692e1',
  'authenticated',
  'authenticated',
  'mamour@has.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T19:00:40.689581Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"bio":"Enseignant-chercheur en Économie, Finance des entreprises et Gestion financière pour la filière MIASS.","email_verified":true,"full_name":"El Hadji Mamour Seynabou Diop","phone":"+221 77 668 89 77","role":"professeur","specialite":"Economie","username":"mamour"}'::jsonb,
  '2026-10-13T19:00:40.683054Z',
  '2026-11-07T15:19:42.974739Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '9d739ed7-daa9-457d-bcc0-88595a4692e1',
  '9d739ed7-daa9-457d-bcc0-88595a4692e1',
  '9d739ed7-daa9-457d-bcc0-88595a4692e1',
  json_build_object('sub', '9d739ed7-daa9-457d-bcc0-88595a4692e1', 'email', 'mamour@has.sn')::jsonb,
  'email',
  '2026-10-13T19:00:40.689581Z',
  '2026-10-13T19:00:40.683054Z',
  '2026-11-07T15:19:42.974739Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '9d739ed7-daa9-457d-bcc0-88595a4692e1',
  'mamour@has.sn',
  'mamour',
  'El Hadji Mamour Seynabou Diop',
  'professeur',
  '',
  '',
  TRUE,
  '2026-10-13T19:00:40.683054Z',
  '2026-11-07T15:19:42.974739Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '1fcb760a-9ce5-4c3a-8a30-f89c7a621665',
  'authenticated',
  'authenticated',
  'mamenasratabane05@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T18:59:12.990324Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Mame Nasra Tabane ","is_active":true,"matricule":"ETU088","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"nasra"}'::jsonb,
  '2026-10-13T18:59:12.968682Z',
  '2026-10-15T21:16:24.447615Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '1fcb760a-9ce5-4c3a-8a30-f89c7a621665',
  '1fcb760a-9ce5-4c3a-8a30-f89c7a621665',
  '1fcb760a-9ce5-4c3a-8a30-f89c7a621665',
  json_build_object('sub', '1fcb760a-9ce5-4c3a-8a30-f89c7a621665', 'email', 'mamenasratabane05@gmail.com')::jsonb,
  'email',
  '2026-10-13T18:59:12.990324Z',
  '2026-10-13T18:59:12.968682Z',
  '2026-10-15T21:16:24.447615Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '1fcb760a-9ce5-4c3a-8a30-f89c7a621665',
  'mamenasratabane05@gmail.com',
  'nasra',
  'Mame Nasra Tabane ',
  'etudiant',
  'ETU088',
  '',
  TRUE,
  '2026-10-13T18:59:12.968682Z',
  '2026-10-15T21:16:24.447615Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '42d78047-94c4-4ca8-85d6-47af754d1f12',
  'authenticated',
  'authenticated',
  'gabdousalam3@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T16:49:54.090466Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Abdou Salam GUEYE ","is_active":true,"matricule":"ETU087","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"salam-gye26"}'::jsonb,
  '2026-10-13T16:49:54.075903Z',
  '2026-11-10T21:10:41.08581Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '42d78047-94c4-4ca8-85d6-47af754d1f12',
  '42d78047-94c4-4ca8-85d6-47af754d1f12',
  '42d78047-94c4-4ca8-85d6-47af754d1f12',
  json_build_object('sub', '42d78047-94c4-4ca8-85d6-47af754d1f12', 'email', 'gabdousalam3@gmail.com')::jsonb,
  'email',
  '2026-10-13T16:49:54.090466Z',
  '2026-10-13T16:49:54.075903Z',
  '2026-11-10T21:10:41.08581Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '42d78047-94c4-4ca8-85d6-47af754d1f12',
  'gabdousalam3@gmail.com',
  'salam-gye26',
  'Abdou Salam GUEYE ',
  'etudiant',
  'ETU087',
  '',
  TRUE,
  '2026-10-13T16:49:54.075903Z',
  '2026-11-10T21:10:41.08581Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '41025b70-26b6-465c-b595-7b62da72347a',
  'authenticated',
  'authenticated',
  'diarra201204@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T16:19:04.536378Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-SML","email_verified":true,"filiere":"SML","full_name":"Mame Diarra Diané","is_active":true,"matricule":"ETU086","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"diarra"}'::jsonb,
  '2026-10-13T16:19:04.506771Z',
  '2026-11-10T23:58:49.120724Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '41025b70-26b6-465c-b595-7b62da72347a',
  '41025b70-26b6-465c-b595-7b62da72347a',
  '41025b70-26b6-465c-b595-7b62da72347a',
  json_build_object('sub', '41025b70-26b6-465c-b595-7b62da72347a', 'email', 'diarra201204@gmail.com')::jsonb,
  'email',
  '2026-10-13T16:19:04.536378Z',
  '2026-10-13T16:19:04.506771Z',
  '2026-11-10T23:58:49.120724Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '41025b70-26b6-465c-b595-7b62da72347a',
  'diarra201204@gmail.com',
  'diarra',
  'Mame Diarra Diané',
  'etudiant',
  'ETU086',
  '',
  TRUE,
  '2026-10-13T16:19:04.506771Z',
  '2026-11-10T23:58:49.120724Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '8374e7c9-4666-4e8a-a0e3-2c56a18359d2',
  'authenticated',
  'authenticated',
  'ndoyesokhnaaminata848@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T14:57:35.819905Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Sokhna Aminata Ndoye ","is_active":true,"matricule":"ETU085","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"12345"}'::jsonb,
  '2026-10-13T14:57:35.794825Z',
  '2026-11-10T21:21:00.739137Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '8374e7c9-4666-4e8a-a0e3-2c56a18359d2',
  '8374e7c9-4666-4e8a-a0e3-2c56a18359d2',
  '8374e7c9-4666-4e8a-a0e3-2c56a18359d2',
  json_build_object('sub', '8374e7c9-4666-4e8a-a0e3-2c56a18359d2', 'email', 'ndoyesokhnaaminata848@gmail.com')::jsonb,
  'email',
  '2026-10-13T14:57:35.819905Z',
  '2026-10-13T14:57:35.794825Z',
  '2026-11-10T21:21:00.739137Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '8374e7c9-4666-4e8a-a0e3-2c56a18359d2',
  'ndoyesokhnaaminata848@gmail.com',
  '12345',
  'Sokhna Aminata Ndoye ',
  'etudiant',
  'ETU085',
  '',
  TRUE,
  '2026-10-13T14:57:35.794825Z',
  '2026-11-10T21:21:00.739137Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'f260a19f-eb4d-4820-9599-1e635424f4ad',
  'authenticated',
  'authenticated',
  'ndeyeamytout@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T10:20:18.556823Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Ndeye amy Ndour ","is_active":true,"matricule":"ETU084","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"ndour-2"}'::jsonb,
  '2026-10-13T10:20:18.536561Z',
  '2026-11-10T22:13:03.920989Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'f260a19f-eb4d-4820-9599-1e635424f4ad',
  'f260a19f-eb4d-4820-9599-1e635424f4ad',
  'f260a19f-eb4d-4820-9599-1e635424f4ad',
  json_build_object('sub', 'f260a19f-eb4d-4820-9599-1e635424f4ad', 'email', 'ndeyeamytout@gmail.com')::jsonb,
  'email',
  '2026-10-13T10:20:18.556823Z',
  '2026-10-13T10:20:18.536561Z',
  '2026-11-10T22:13:03.920989Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'f260a19f-eb4d-4820-9599-1e635424f4ad',
  'ndeyeamytout@gmail.com',
  'ndour-2',
  'Ndeye amy Ndour ',
  'etudiant',
  'ETU084',
  '',
  TRUE,
  '2026-10-13T10:20:18.536561Z',
  '2026-11-10T22:13:03.920989Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '76b49629-01e3-4854-b0a9-60cc22aebb6a',
  'authenticated',
  'authenticated',
  'adiallo211204@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T10:17:57.746018Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Adama DIALLO ","is_active":true,"matricule":"ETU083","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"705528has"}'::jsonb,
  '2026-10-13T10:17:57.733374Z',
  '2026-11-10T20:31:22.132718Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '76b49629-01e3-4854-b0a9-60cc22aebb6a',
  '76b49629-01e3-4854-b0a9-60cc22aebb6a',
  '76b49629-01e3-4854-b0a9-60cc22aebb6a',
  json_build_object('sub', '76b49629-01e3-4854-b0a9-60cc22aebb6a', 'email', 'adiallo211204@gmail.com')::jsonb,
  'email',
  '2026-10-13T10:17:57.746018Z',
  '2026-10-13T10:17:57.733374Z',
  '2026-11-10T20:31:22.132718Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '76b49629-01e3-4854-b0a9-60cc22aebb6a',
  'adiallo211204@gmail.com',
  '705528has',
  'Adama DIALLO ',
  'etudiant',
  'ETU083',
  '',
  TRUE,
  '2026-10-13T10:17:57.733374Z',
  '2026-11-10T20:31:22.132718Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'e5291a48-2e2c-4aa2-8912-fd86460ae9ff',
  'authenticated',
  'authenticated',
  'diop.seynabou3@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-13T10:06:22.04423Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Seynabou Diop ","is_active":true,"matricule":"ETU082","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"seynabou"}'::jsonb,
  '2026-10-13T10:06:22.016333Z',
  '2026-11-09T19:56:51.025187Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'e5291a48-2e2c-4aa2-8912-fd86460ae9ff',
  'e5291a48-2e2c-4aa2-8912-fd86460ae9ff',
  'e5291a48-2e2c-4aa2-8912-fd86460ae9ff',
  json_build_object('sub', 'e5291a48-2e2c-4aa2-8912-fd86460ae9ff', 'email', 'diop.seynabou3@uam.edu.sn')::jsonb,
  'email',
  '2026-10-13T10:06:22.04423Z',
  '2026-10-13T10:06:22.016333Z',
  '2026-11-09T19:56:51.025187Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'e5291a48-2e2c-4aa2-8912-fd86460ae9ff',
  'diop.seynabou3@uam.edu.sn',
  'seynabou',
  'Seynabou Diop ',
  'etudiant',
  'ETU082',
  '',
  TRUE,
  '2026-10-13T10:06:22.016333Z',
  '2026-11-09T19:56:51.025187Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '89dc26db-56c2-4f19-910a-cf9980e8ba21',
  'authenticated',
  'authenticated',
  'mouhakmo97@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T23:41:51.045909Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Mouhamad SECK","is_active":true,"matricule":"ETU081","niveau":"L2","phone":"+221 77 277 90 52","role":"etudiant","statut_inscription":"valide","username":"lelouchvb"}'::jsonb,
  '2026-10-12T23:41:51.006562Z',
  '2026-11-11T18:40:35.493143Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '89dc26db-56c2-4f19-910a-cf9980e8ba21',
  '89dc26db-56c2-4f19-910a-cf9980e8ba21',
  '89dc26db-56c2-4f19-910a-cf9980e8ba21',
  json_build_object('sub', '89dc26db-56c2-4f19-910a-cf9980e8ba21', 'email', 'mouhakmo97@gmail.com')::jsonb,
  'email',
  '2026-10-12T23:41:51.045909Z',
  '2026-10-12T23:41:51.006562Z',
  '2026-11-11T18:40:35.493143Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '89dc26db-56c2-4f19-910a-cf9980e8ba21',
  'mouhakmo97@gmail.com',
  'lelouchvb',
  'Mouhamad SECK',
  'etudiant',
  'ETU081',
  '',
  TRUE,
  '2026-10-12T23:41:51.006562Z',
  '2026-11-11T18:40:35.493143Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '4290bc22-de02-4303-8afd-40b65ae1bbbf',
  'authenticated',
  'authenticated',
  'cissecheikhahmadoubamba2024@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T23:14:11.197302Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Cheikh Ahmadou Bamba Cisse","is_active":true,"matricule":"ETU080","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"bamba2024"}'::jsonb,
  '2026-10-12T23:14:11.17324Z',
  '2026-10-23T19:28:14.522669Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '4290bc22-de02-4303-8afd-40b65ae1bbbf',
  '4290bc22-de02-4303-8afd-40b65ae1bbbf',
  '4290bc22-de02-4303-8afd-40b65ae1bbbf',
  json_build_object('sub', '4290bc22-de02-4303-8afd-40b65ae1bbbf', 'email', 'cissecheikhahmadoubamba2024@gmail.com')::jsonb,
  'email',
  '2026-10-12T23:14:11.197302Z',
  '2026-10-12T23:14:11.17324Z',
  '2026-10-23T19:28:14.522669Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '4290bc22-de02-4303-8afd-40b65ae1bbbf',
  'cissecheikhahmadoubamba2024@gmail.com',
  'bamba2024',
  'Cheikh Ahmadou Bamba Cisse',
  'etudiant',
  'ETU080',
  '',
  TRUE,
  '2026-10-12T23:14:11.17324Z',
  '2026-10-23T19:28:14.522669Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c8ae1ce8-8d86-4f14-a48f-2876e63c56ac',
  'authenticated',
  'authenticated',
  'sokhnasenendiogou@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T23:01:32.305925Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-SML","email_verified":true,"filiere":"SML","full_name":"Sokhna Séne Ndiogou ","is_active":true,"matricule":"ETU079","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"sokhna"}'::jsonb,
  '2026-10-12T23:01:32.270811Z',
  '2026-11-06T20:59:38.533166Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'c8ae1ce8-8d86-4f14-a48f-2876e63c56ac',
  'c8ae1ce8-8d86-4f14-a48f-2876e63c56ac',
  'c8ae1ce8-8d86-4f14-a48f-2876e63c56ac',
  json_build_object('sub', 'c8ae1ce8-8d86-4f14-a48f-2876e63c56ac', 'email', 'sokhnasenendiogou@gmail.com')::jsonb,
  'email',
  '2026-10-12T23:01:32.305925Z',
  '2026-10-12T23:01:32.270811Z',
  '2026-11-06T20:59:38.533166Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'c8ae1ce8-8d86-4f14-a48f-2876e63c56ac',
  'sokhnasenendiogou@gmail.com',
  'sokhna',
  'Sokhna Séne Ndiogou ',
  'etudiant',
  'ETU079',
  '',
  TRUE,
  '2026-10-12T23:01:32.270811Z',
  '2026-11-06T20:59:38.533166Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '470faba5-4da2-43dc-aab5-2e29c7b008c8',
  'authenticated',
  'authenticated',
  'mamediarra051004@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T22:56:15.748506Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Mame Diarra DIA","is_active":true,"matricule":"ETU078","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"mdd"}'::jsonb,
  '2026-10-12T22:56:15.71221Z',
  '2026-11-07T10:37:38.926501Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '470faba5-4da2-43dc-aab5-2e29c7b008c8',
  '470faba5-4da2-43dc-aab5-2e29c7b008c8',
  '470faba5-4da2-43dc-aab5-2e29c7b008c8',
  json_build_object('sub', '470faba5-4da2-43dc-aab5-2e29c7b008c8', 'email', 'mamediarra051004@gmail.com')::jsonb,
  'email',
  '2026-10-12T22:56:15.748506Z',
  '2026-10-12T22:56:15.71221Z',
  '2026-11-07T10:37:38.926501Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '470faba5-4da2-43dc-aab5-2e29c7b008c8',
  'mamediarra051004@gmail.com',
  'mdd',
  'Mame Diarra DIA',
  'etudiant',
  'ETU078',
  '',
  TRUE,
  '2026-10-12T22:56:15.71221Z',
  '2026-11-07T10:37:38.926501Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a1e13511-8768-4241-be2d-c6c7bdd1a9e6',
  'authenticated',
  'authenticated',
  'walyf316@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T22:51:19.98006Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Waly Faye","is_active":true,"matricule":"ETU077","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"fayebirame"}'::jsonb,
  '2026-10-12T22:51:19.964576Z',
  '2026-11-10T22:58:18.380581Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'a1e13511-8768-4241-be2d-c6c7bdd1a9e6',
  'a1e13511-8768-4241-be2d-c6c7bdd1a9e6',
  'a1e13511-8768-4241-be2d-c6c7bdd1a9e6',
  json_build_object('sub', 'a1e13511-8768-4241-be2d-c6c7bdd1a9e6', 'email', 'walyf316@gmail.com')::jsonb,
  'email',
  '2026-10-12T22:51:19.98006Z',
  '2026-10-12T22:51:19.964576Z',
  '2026-11-10T22:58:18.380581Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'a1e13511-8768-4241-be2d-c6c7bdd1a9e6',
  'walyf316@gmail.com',
  'fayebirame',
  'Waly Faye',
  'etudiant',
  'ETU077',
  '',
  TRUE,
  '2026-10-12T22:51:19.964576Z',
  '2026-11-10T22:58:18.380581Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '3f6aab15-b401-4f58-aa22-c0d97938569b',
  'authenticated',
  'authenticated',
  'mboupbayengagne@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T22:41:48.231273Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Baye Ngagne Mboup","is_active":true,"matricule":"ETU076","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"mboup"}'::jsonb,
  '2026-10-12T22:41:48.227995Z',
  '2026-11-10T21:01:32.086068Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '3f6aab15-b401-4f58-aa22-c0d97938569b',
  '3f6aab15-b401-4f58-aa22-c0d97938569b',
  '3f6aab15-b401-4f58-aa22-c0d97938569b',
  json_build_object('sub', '3f6aab15-b401-4f58-aa22-c0d97938569b', 'email', 'mboupbayengagne@gmail.com')::jsonb,
  'email',
  '2026-10-12T22:41:48.231273Z',
  '2026-10-12T22:41:48.227995Z',
  '2026-11-10T21:01:32.086068Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '3f6aab15-b401-4f58-aa22-c0d97938569b',
  'mboupbayengagne@gmail.com',
  'mboup',
  'Baye Ngagne Mboup',
  'etudiant',
  'ETU076',
  '',
  TRUE,
  '2026-10-12T22:41:48.227995Z',
  '2026-11-10T21:01:32.086068Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '4fc79fc1-4150-4e05-bb23-e764c2a05e9f',
  'authenticated',
  'authenticated',
  'locheikhouna99@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T22:41:39.273644Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Cheikhouna Lo","is_active":true,"matricule":"ETU075","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"saatuubaa"}'::jsonb,
  '2026-10-12T22:41:39.264222Z',
  '2026-11-12T11:27:36.162181Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '4fc79fc1-4150-4e05-bb23-e764c2a05e9f',
  '4fc79fc1-4150-4e05-bb23-e764c2a05e9f',
  '4fc79fc1-4150-4e05-bb23-e764c2a05e9f',
  json_build_object('sub', '4fc79fc1-4150-4e05-bb23-e764c2a05e9f', 'email', 'locheikhouna99@gmail.com')::jsonb,
  'email',
  '2026-10-12T22:41:39.273644Z',
  '2026-10-12T22:41:39.264222Z',
  '2026-11-12T11:27:36.162181Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '4fc79fc1-4150-4e05-bb23-e764c2a05e9f',
  'locheikhouna99@gmail.com',
  'saatuubaa',
  'Cheikhouna Lo',
  'etudiant',
  'ETU075',
  '',
  TRUE,
  '2026-10-12T22:41:39.264222Z',
  '2026-11-12T11:27:36.162181Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '9c0ac362-bf7d-4c62-8e89-9b2a92c26673',
  'authenticated',
  'authenticated',
  'mbodjindeye80@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T22:40:03.869152Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Ndeye Mbodji","is_active":true,"matricule":"ETU074","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"ndeye_mbodji"}'::jsonb,
  '2026-10-12T22:40:03.860462Z',
  '2026-11-10T21:05:41.340695Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '9c0ac362-bf7d-4c62-8e89-9b2a92c26673',
  '9c0ac362-bf7d-4c62-8e89-9b2a92c26673',
  '9c0ac362-bf7d-4c62-8e89-9b2a92c26673',
  json_build_object('sub', '9c0ac362-bf7d-4c62-8e89-9b2a92c26673', 'email', 'mbodjindeye80@gmail.com')::jsonb,
  'email',
  '2026-10-12T22:40:03.869152Z',
  '2026-10-12T22:40:03.860462Z',
  '2026-11-10T21:05:41.340695Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '9c0ac362-bf7d-4c62-8e89-9b2a92c26673',
  'mbodjindeye80@gmail.com',
  'ndeye_mbodji',
  'Ndeye Mbodji',
  'etudiant',
  'ETU074',
  '',
  TRUE,
  '2026-10-12T22:40:03.860462Z',
  '2026-11-10T21:05:41.340695Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'f2edffd2-b649-4075-ab75-28fd59bfaea2',
  'authenticated',
  'authenticated',
  'astouwade985@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T22:40:03.201356Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Astou Wade ","is_active":true,"matricule":"ETU073","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"wade.astou"}'::jsonb,
  '2026-10-12T22:40:03.193328Z',
  '2026-11-10T21:01:51.826406Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'f2edffd2-b649-4075-ab75-28fd59bfaea2',
  'f2edffd2-b649-4075-ab75-28fd59bfaea2',
  'f2edffd2-b649-4075-ab75-28fd59bfaea2',
  json_build_object('sub', 'f2edffd2-b649-4075-ab75-28fd59bfaea2', 'email', 'astouwade985@gmail.com')::jsonb,
  'email',
  '2026-10-12T22:40:03.201356Z',
  '2026-10-12T22:40:03.193328Z',
  '2026-11-10T21:01:51.826406Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'f2edffd2-b649-4075-ab75-28fd59bfaea2',
  'astouwade985@gmail.com',
  'wade.astou',
  'Astou Wade ',
  'etudiant',
  'ETU073',
  '',
  TRUE,
  '2026-10-12T22:40:03.193328Z',
  '2026-11-10T21:01:51.826406Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '03b3d532-9fa5-47e4-bdfc-44d06947bfc4',
  'authenticated',
  'authenticated',
  'diallo.habybatou@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T22:37:32.096154Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-SML","email_verified":true,"filiere":"SML","full_name":"Habybatou Diallo","is_active":true,"matricule":"ETU072","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"habybatou.d"}'::jsonb,
  '2026-10-12T22:37:32.07526Z',
  '2026-11-07T21:16:57.790608Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '03b3d532-9fa5-47e4-bdfc-44d06947bfc4',
  '03b3d532-9fa5-47e4-bdfc-44d06947bfc4',
  '03b3d532-9fa5-47e4-bdfc-44d06947bfc4',
  json_build_object('sub', '03b3d532-9fa5-47e4-bdfc-44d06947bfc4', 'email', 'diallo.habybatou@uam.edu.sn')::jsonb,
  'email',
  '2026-10-12T22:37:32.096154Z',
  '2026-10-12T22:37:32.07526Z',
  '2026-11-07T21:16:57.790608Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '03b3d532-9fa5-47e4-bdfc-44d06947bfc4',
  'diallo.habybatou@uam.edu.sn',
  'habybatou.d',
  'Habybatou Diallo',
  'etudiant',
  'ETU072',
  '',
  TRUE,
  '2026-10-12T22:37:32.07526Z',
  '2026-11-07T21:16:57.790608Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '637b2827-cfb6-4acc-a406-c48ac1a0cddc',
  'authenticated',
  'authenticated',
  'amadoudd0920@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T22:33:08.936237Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Amadou Diang DIALLO","is_active":true,"matricule":"ETU071","niveau":"L2","phone":"","role":"etudiant","statut_inscription":"valide","username":"ame"}'::jsonb,
  '2026-10-12T22:33:08.918417Z',
  '2026-11-10T20:52:21.433658Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '637b2827-cfb6-4acc-a406-c48ac1a0cddc',
  '637b2827-cfb6-4acc-a406-c48ac1a0cddc',
  '637b2827-cfb6-4acc-a406-c48ac1a0cddc',
  json_build_object('sub', '637b2827-cfb6-4acc-a406-c48ac1a0cddc', 'email', 'amadoudd0920@gmail.com')::jsonb,
  'email',
  '2026-10-12T22:33:08.936237Z',
  '2026-10-12T22:33:08.918417Z',
  '2026-11-10T20:52:21.433658Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '637b2827-cfb6-4acc-a406-c48ac1a0cddc',
  'amadoudd0920@gmail.com',
  'ame',
  'Amadou Diang DIALLO',
  'etudiant',
  'ETU071',
  '',
  TRUE,
  '2026-10-12T22:33:08.918417Z',
  '2026-11-10T20:52:21.433658Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c9dd657d-8460-42e4-b196-03262e85b07d',
  'authenticated',
  'authenticated',
  'marememballo03@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T22:31:00.112429Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-SML","email_verified":true,"filiere":"SML","full_name":"Mareme Mballo","is_active":true,"matricule":"ETU070","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"603689"}'::jsonb,
  '2026-10-12T22:31:00.102979Z',
  '2026-11-12T10:38:24.83217Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'c9dd657d-8460-42e4-b196-03262e85b07d',
  'c9dd657d-8460-42e4-b196-03262e85b07d',
  'c9dd657d-8460-42e4-b196-03262e85b07d',
  json_build_object('sub', 'c9dd657d-8460-42e4-b196-03262e85b07d', 'email', 'marememballo03@gmail.com')::jsonb,
  'email',
  '2026-10-12T22:31:00.112429Z',
  '2026-10-12T22:31:00.102979Z',
  '2026-11-12T10:38:24.83217Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'c9dd657d-8460-42e4-b196-03262e85b07d',
  'marememballo03@gmail.com',
  '603689',
  'Mareme Mballo',
  'etudiant',
  'ETU070',
  '',
  TRUE,
  '2026-10-12T22:31:00.102979Z',
  '2026-11-12T10:38:24.83217Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c6b5526b-773d-4c9e-b0df-c25f005f6146',
  'authenticated',
  'authenticated',
  'mba386767@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T22:29:52.00818Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-SML","email_verified":true,"filiere":"SML","full_name":"Ndeye Magatte ba","is_active":true,"matricule":"ETU069","niveau":"L2","phone":"+221 77 551 81 96","role":"etudiant","statut_inscription":"valide","username":"magui"}'::jsonb,
  '2026-10-12T22:29:51.986212Z',
  '2026-11-07T20:14:57.4645Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'c6b5526b-773d-4c9e-b0df-c25f005f6146',
  'c6b5526b-773d-4c9e-b0df-c25f005f6146',
  'c6b5526b-773d-4c9e-b0df-c25f005f6146',
  json_build_object('sub', 'c6b5526b-773d-4c9e-b0df-c25f005f6146', 'email', 'mba386767@gmail.com')::jsonb,
  'email',
  '2026-10-12T22:29:52.00818Z',
  '2026-10-12T22:29:51.986212Z',
  '2026-11-07T20:14:57.4645Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'c6b5526b-773d-4c9e-b0df-c25f005f6146',
  'mba386767@gmail.com',
  'magui',
  'Ndeye Magatte ba',
  'etudiant',
  'ETU069',
  '',
  TRUE,
  '2026-10-12T22:29:51.986212Z',
  '2026-11-07T20:14:57.4645Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '3b8c8056-5671-47a7-9e66-81614a610c51',
  'authenticated',
  'authenticated',
  'ramsessbodian34@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T22:28:05.901709Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Ramatoulaye BODIAN","is_active":true,"matricule":"ETU068","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"rbd"}'::jsonb,
  '2026-10-12T22:28:05.888005Z',
  '2026-11-02T21:13:20.690194Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '3b8c8056-5671-47a7-9e66-81614a610c51',
  '3b8c8056-5671-47a7-9e66-81614a610c51',
  '3b8c8056-5671-47a7-9e66-81614a610c51',
  json_build_object('sub', '3b8c8056-5671-47a7-9e66-81614a610c51', 'email', 'ramsessbodian34@gmail.com')::jsonb,
  'email',
  '2026-10-12T22:28:05.901709Z',
  '2026-10-12T22:28:05.888005Z',
  '2026-11-02T21:13:20.690194Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '3b8c8056-5671-47a7-9e66-81614a610c51',
  'ramsessbodian34@gmail.com',
  'rbd',
  'Ramatoulaye BODIAN',
  'etudiant',
  'ETU068',
  '',
  TRUE,
  '2026-10-12T22:28:05.888005Z',
  '2026-11-02T21:13:20.690194Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '86e61ed2-5c07-4702-8f96-5a833d62fce2',
  'authenticated',
  'authenticated',
  'marietheresembengue78@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T22:24:33.060033Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Marie Thérèse Mbengue ","is_active":true,"matricule":"ETU067","niveau":"L2","phone":"+221 785925983","role":"etudiant","statut_inscription":"valide","username":"mmbengue"}'::jsonb,
  '2026-10-12T22:24:33.040103Z',
  '2026-11-10T21:05:54.963043Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '86e61ed2-5c07-4702-8f96-5a833d62fce2',
  '86e61ed2-5c07-4702-8f96-5a833d62fce2',
  '86e61ed2-5c07-4702-8f96-5a833d62fce2',
  json_build_object('sub', '86e61ed2-5c07-4702-8f96-5a833d62fce2', 'email', 'marietheresembengue78@gmail.com')::jsonb,
  'email',
  '2026-10-12T22:24:33.060033Z',
  '2026-10-12T22:24:33.040103Z',
  '2026-11-10T21:05:54.963043Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '86e61ed2-5c07-4702-8f96-5a833d62fce2',
  'marietheresembengue78@gmail.com',
  'mmbengue',
  'Marie Thérèse Mbengue ',
  'etudiant',
  'ETU067',
  '',
  TRUE,
  '2026-10-12T22:24:33.040103Z',
  '2026-11-10T21:05:54.963043Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '8accd962-6ada-40a3-a956-d2c5c5f85931',
  'authenticated',
  'authenticated',
  'alaminedieye12@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T22:18:54.549581Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Mouhamed Dieye","is_active":true,"matricule":"ETU066","niveau":"L1","phone":"+221 78 820 63 38","role":"etudiant","statut_inscription":"valide","username":"dieye_mouhamed.05"}'::jsonb,
  '2026-10-12T22:18:54.511365Z',
  '2026-11-10T20:01:58.004959Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '8accd962-6ada-40a3-a956-d2c5c5f85931',
  '8accd962-6ada-40a3-a956-d2c5c5f85931',
  '8accd962-6ada-40a3-a956-d2c5c5f85931',
  json_build_object('sub', '8accd962-6ada-40a3-a956-d2c5c5f85931', 'email', 'alaminedieye12@gmail.com')::jsonb,
  'email',
  '2026-10-12T22:18:54.549581Z',
  '2026-10-12T22:18:54.511365Z',
  '2026-11-10T20:01:58.004959Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '8accd962-6ada-40a3-a956-d2c5c5f85931',
  'alaminedieye12@gmail.com',
  'dieye_mouhamed.05',
  'Mouhamed Dieye',
  'etudiant',
  'ETU066',
  '',
  TRUE,
  '2026-10-12T22:18:54.511365Z',
  '2026-11-10T20:01:58.004959Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '04f5eef4-89c1-4a5b-8256-872fd7ce73ea',
  'authenticated',
  'authenticated',
  'diopbayetalla3@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T22:09:08.699777Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Baye Talla Diop","is_active":true,"matricule":"ETU065","niveau":"L1","phone":"+221 77 551 81 96","role":"etudiant","statut_inscription":"valide","username":"bayetalla"}'::jsonb,
  '2026-10-12T22:09:08.684909Z',
  '2026-11-08T19:59:47.781241Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '04f5eef4-89c1-4a5b-8256-872fd7ce73ea',
  '04f5eef4-89c1-4a5b-8256-872fd7ce73ea',
  '04f5eef4-89c1-4a5b-8256-872fd7ce73ea',
  json_build_object('sub', '04f5eef4-89c1-4a5b-8256-872fd7ce73ea', 'email', 'diopbayetalla3@gmail.com')::jsonb,
  'email',
  '2026-10-12T22:09:08.699777Z',
  '2026-10-12T22:09:08.684909Z',
  '2026-11-08T19:59:47.781241Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '04f5eef4-89c1-4a5b-8256-872fd7ce73ea',
  'diopbayetalla3@gmail.com',
  'bayetalla',
  'Baye Talla Diop',
  'etudiant',
  'ETU065',
  '',
  TRUE,
  '2026-10-12T22:09:08.684909Z',
  '2026-11-08T19:59:47.781241Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '005bec73-17d3-419b-aad6-e716d413e918',
  'authenticated',
  'authenticated',
  'aissataalhousseynoud@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T22:07:26.402101Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Aissata Alhousseynou Dia","is_active":true,"matricule":"ETU064","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"aisha"}'::jsonb,
  '2026-10-12T22:07:26.387832Z',
  '2026-11-10T16:38:31.404971Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '005bec73-17d3-419b-aad6-e716d413e918',
  '005bec73-17d3-419b-aad6-e716d413e918',
  '005bec73-17d3-419b-aad6-e716d413e918',
  json_build_object('sub', '005bec73-17d3-419b-aad6-e716d413e918', 'email', 'aissataalhousseynoud@gmail.com')::jsonb,
  'email',
  '2026-10-12T22:07:26.402101Z',
  '2026-10-12T22:07:26.387832Z',
  '2026-11-10T16:38:31.404971Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '005bec73-17d3-419b-aad6-e716d413e918',
  'aissataalhousseynoud@gmail.com',
  'aisha',
  'Aissata Alhousseynou Dia',
  'etudiant',
  'ETU064',
  '',
  TRUE,
  '2026-10-12T22:07:26.387832Z',
  '2026-11-10T16:38:31.404971Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '9c7da3cb-7269-4c93-befb-6372eee057d5',
  'authenticated',
  'authenticated',
  'thiongane.maty@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T22:05:21.054394Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-SML","email_verified":true,"filiere":"SML","full_name":"Maty Thiongane","is_active":true,"matricule":"ETU063","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"m.thiongane"}'::jsonb,
  '2026-10-12T22:05:21.035869Z',
  '2026-11-11T23:41:39.624424Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '9c7da3cb-7269-4c93-befb-6372eee057d5',
  '9c7da3cb-7269-4c93-befb-6372eee057d5',
  '9c7da3cb-7269-4c93-befb-6372eee057d5',
  json_build_object('sub', '9c7da3cb-7269-4c93-befb-6372eee057d5', 'email', 'thiongane.maty@uam.edu.sn')::jsonb,
  'email',
  '2026-10-12T22:05:21.054394Z',
  '2026-10-12T22:05:21.035869Z',
  '2026-11-11T23:41:39.624424Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '9c7da3cb-7269-4c93-befb-6372eee057d5',
  'thiongane.maty@uam.edu.sn',
  'm.thiongane',
  'Maty Thiongane',
  'etudiant',
  'ETU063',
  '',
  TRUE,
  '2026-10-12T22:05:21.035869Z',
  '2026-11-11T23:41:39.624424Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '75937c43-6c73-4289-bb6b-f5eb26e6409d',
  'authenticated',
  'authenticated',
  'diouf.aissatou3@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T22:01:49.495968Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"AÏSSATOU DIOUF","is_active":true,"matricule":"ETU062","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"kim_95"}'::jsonb,
  '2026-10-12T22:01:49.481035Z',
  '2026-11-08T20:59:15.533297Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '75937c43-6c73-4289-bb6b-f5eb26e6409d',
  '75937c43-6c73-4289-bb6b-f5eb26e6409d',
  '75937c43-6c73-4289-bb6b-f5eb26e6409d',
  json_build_object('sub', '75937c43-6c73-4289-bb6b-f5eb26e6409d', 'email', 'diouf.aissatou3@uam.edu.sn')::jsonb,
  'email',
  '2026-10-12T22:01:49.495968Z',
  '2026-10-12T22:01:49.481035Z',
  '2026-11-08T20:59:15.533297Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '75937c43-6c73-4289-bb6b-f5eb26e6409d',
  'diouf.aissatou3@uam.edu.sn',
  'kim_95',
  'AÏSSATOU DIOUF',
  'etudiant',
  'ETU062',
  '',
  TRUE,
  '2026-10-12T22:01:49.481035Z',
  '2026-11-08T20:59:15.533297Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '27827d30-0654-4b0d-84fd-10f0452b2a50',
  'authenticated',
  'authenticated',
  'papaamadoumbaye411@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:59:57.561046Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Papa Amadou Mbaye","is_active":true,"matricule":"ETU061","niveau":"L1","phone":"+221 77 551 81 96","role":"etudiant","statut_inscription":"valide","username":"papambaye"}'::jsonb,
  '2026-10-12T21:59:57.542524Z',
  '2026-11-11T19:28:43.86502Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '27827d30-0654-4b0d-84fd-10f0452b2a50',
  '27827d30-0654-4b0d-84fd-10f0452b2a50',
  '27827d30-0654-4b0d-84fd-10f0452b2a50',
  json_build_object('sub', '27827d30-0654-4b0d-84fd-10f0452b2a50', 'email', 'papaamadoumbaye411@gmail.com')::jsonb,
  'email',
  '2026-10-12T21:59:57.561046Z',
  '2026-10-12T21:59:57.542524Z',
  '2026-11-11T19:28:43.86502Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '27827d30-0654-4b0d-84fd-10f0452b2a50',
  'papaamadoumbaye411@gmail.com',
  'papambaye',
  'Papa Amadou Mbaye',
  'etudiant',
  'ETU061',
  '',
  TRUE,
  '2026-10-12T21:59:57.542524Z',
  '2026-11-11T19:28:43.86502Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '8191e434-fc2e-41d3-9b4a-fb25c98547cb',
  'authenticated',
  'authenticated',
  'sy.arona@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:53:50.486082Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Arona Sy","is_active":true,"matricule":"ETU060","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"sy.arona"}'::jsonb,
  '2026-10-12T21:53:50.483385Z',
  '2026-11-11T21:28:01.538671Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '8191e434-fc2e-41d3-9b4a-fb25c98547cb',
  '8191e434-fc2e-41d3-9b4a-fb25c98547cb',
  '8191e434-fc2e-41d3-9b4a-fb25c98547cb',
  json_build_object('sub', '8191e434-fc2e-41d3-9b4a-fb25c98547cb', 'email', 'sy.arona@uam.edu.sn')::jsonb,
  'email',
  '2026-10-12T21:53:50.486082Z',
  '2026-10-12T21:53:50.483385Z',
  '2026-11-11T21:28:01.538671Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '8191e434-fc2e-41d3-9b4a-fb25c98547cb',
  'sy.arona@uam.edu.sn',
  'sy.arona',
  'Arona Sy',
  'etudiant',
  'ETU060',
  '',
  TRUE,
  '2026-10-12T21:53:50.483385Z',
  '2026-11-11T21:28:01.538671Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '40a2332e-81b3-489f-b6fd-3b838b3ff656',
  'authenticated',
  'authenticated',
  'aminatasene930@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:53:46.734817Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Aminata Séne","is_active":true,"matricule":"ETU059","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"aminata"}'::jsonb,
  '2026-10-12T21:53:46.726899Z',
  '2026-11-10T20:29:25.504913Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '40a2332e-81b3-489f-b6fd-3b838b3ff656',
  '40a2332e-81b3-489f-b6fd-3b838b3ff656',
  '40a2332e-81b3-489f-b6fd-3b838b3ff656',
  json_build_object('sub', '40a2332e-81b3-489f-b6fd-3b838b3ff656', 'email', 'aminatasene930@gmail.com')::jsonb,
  'email',
  '2026-10-12T21:53:46.734817Z',
  '2026-10-12T21:53:46.726899Z',
  '2026-11-10T20:29:25.504913Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '40a2332e-81b3-489f-b6fd-3b838b3ff656',
  'aminatasene930@gmail.com',
  'aminata',
  'Aminata Séne',
  'etudiant',
  'ETU059',
  '',
  TRUE,
  '2026-10-12T21:53:46.726899Z',
  '2026-11-10T20:29:25.504913Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'f02134ae-b1ee-42ff-a9b2-e97572e62359',
  'authenticated',
  'authenticated',
  'diagne.maimouna1@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:51:47.427097Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Maïmouna Diagne","is_active":true,"matricule":"ETU058","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"mounass_baby"}'::jsonb,
  '2026-10-12T21:51:47.422502Z',
  '2026-11-12T11:00:28.696135Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'f02134ae-b1ee-42ff-a9b2-e97572e62359',
  'f02134ae-b1ee-42ff-a9b2-e97572e62359',
  'f02134ae-b1ee-42ff-a9b2-e97572e62359',
  json_build_object('sub', 'f02134ae-b1ee-42ff-a9b2-e97572e62359', 'email', 'diagne.maimouna1@uam.edu.sn')::jsonb,
  'email',
  '2026-10-12T21:51:47.427097Z',
  '2026-10-12T21:51:47.422502Z',
  '2026-11-12T11:00:28.696135Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'f02134ae-b1ee-42ff-a9b2-e97572e62359',
  'diagne.maimouna1@uam.edu.sn',
  'mounass_baby',
  'Maïmouna Diagne',
  'etudiant',
  'ETU058',
  '',
  TRUE,
  '2026-10-12T21:51:47.422502Z',
  '2026-11-12T11:00:28.696135Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '8e5b655c-e1db-4619-a125-cf8060ccd7b5',
  'authenticated',
  'authenticated',
  'limzojr21@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:51:36.941427Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"ELIMANE NDIAYE","is_active":true,"matricule":"ETU057","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"michael"}'::jsonb,
  '2026-10-12T21:51:36.938914Z',
  '2026-11-06T21:38:17.702139Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '8e5b655c-e1db-4619-a125-cf8060ccd7b5',
  '8e5b655c-e1db-4619-a125-cf8060ccd7b5',
  '8e5b655c-e1db-4619-a125-cf8060ccd7b5',
  json_build_object('sub', '8e5b655c-e1db-4619-a125-cf8060ccd7b5', 'email', 'limzojr21@gmail.com')::jsonb,
  'email',
  '2026-10-12T21:51:36.941427Z',
  '2026-10-12T21:51:36.938914Z',
  '2026-11-06T21:38:17.702139Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '8e5b655c-e1db-4619-a125-cf8060ccd7b5',
  'limzojr21@gmail.com',
  'michael',
  'ELIMANE NDIAYE',
  'etudiant',
  'ETU057',
  '',
  TRUE,
  '2026-10-12T21:51:36.938914Z',
  '2026-11-06T21:38:17.702139Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'f2f22602-c195-427d-92d7-38c18675d659',
  'authenticated',
  'authenticated',
  'sokhnafatimatoundiaye@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:51:33.18902Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-SML","email_verified":true,"filiere":"SML","full_name":"Sokhna Fatimatou Ndiaye","is_active":true,"matricule":"ETU056","niveau":"L1","phone":"+221 78 739 67 32","role":"etudiant","statut_inscription":"valide","username":"sokhna_fatimatou"}'::jsonb,
  '2026-10-12T21:51:33.18539Z',
  '2026-11-10T20:04:12.74586Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'f2f22602-c195-427d-92d7-38c18675d659',
  'f2f22602-c195-427d-92d7-38c18675d659',
  'f2f22602-c195-427d-92d7-38c18675d659',
  json_build_object('sub', 'f2f22602-c195-427d-92d7-38c18675d659', 'email', 'sokhnafatimatoundiaye@gmail.com')::jsonb,
  'email',
  '2026-10-12T21:51:33.18902Z',
  '2026-10-12T21:51:33.18539Z',
  '2026-11-10T20:04:12.74586Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'f2f22602-c195-427d-92d7-38c18675d659',
  'sokhnafatimatoundiaye@gmail.com',
  'sokhna_fatimatou',
  'Sokhna Fatimatou Ndiaye',
  'etudiant',
  'ETU056',
  '',
  TRUE,
  '2026-10-12T21:51:33.18539Z',
  '2026-11-10T20:04:12.74586Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '7691fd0e-7341-4b91-94b9-31cb7ec4b9fd',
  'authenticated',
  'authenticated',
  'laminekhoumajr@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:50:35.253891Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Mouhamadou Lamine Khouma","is_active":true,"matricule":"ETU055","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"khouma"}'::jsonb,
  '2026-10-12T21:50:35.250914Z',
  '2026-11-10T23:12:58.699018Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '7691fd0e-7341-4b91-94b9-31cb7ec4b9fd',
  '7691fd0e-7341-4b91-94b9-31cb7ec4b9fd',
  '7691fd0e-7341-4b91-94b9-31cb7ec4b9fd',
  json_build_object('sub', '7691fd0e-7341-4b91-94b9-31cb7ec4b9fd', 'email', 'laminekhoumajr@gmail.com')::jsonb,
  'email',
  '2026-10-12T21:50:35.253891Z',
  '2026-10-12T21:50:35.250914Z',
  '2026-11-10T23:12:58.699018Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '7691fd0e-7341-4b91-94b9-31cb7ec4b9fd',
  'laminekhoumajr@gmail.com',
  'khouma',
  'Mouhamadou Lamine Khouma',
  'etudiant',
  'ETU055',
  '',
  TRUE,
  '2026-10-12T21:50:35.250914Z',
  '2026-11-10T23:12:58.699018Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'bd024872-a14e-4783-8d1a-d2c479104dc9',
  'authenticated',
  'authenticated',
  'senen7090@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:49:32.044514Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"ndeye sene","is_active":true,"matricule":"ETU054","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"ndeye_sene"}'::jsonb,
  '2026-10-12T21:49:32.041867Z',
  '2026-11-06T21:38:11.985735Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'bd024872-a14e-4783-8d1a-d2c479104dc9',
  'bd024872-a14e-4783-8d1a-d2c479104dc9',
  'bd024872-a14e-4783-8d1a-d2c479104dc9',
  json_build_object('sub', 'bd024872-a14e-4783-8d1a-d2c479104dc9', 'email', 'senen7090@gmail.com')::jsonb,
  'email',
  '2026-10-12T21:49:32.044514Z',
  '2026-10-12T21:49:32.041867Z',
  '2026-11-06T21:38:11.985735Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'bd024872-a14e-4783-8d1a-d2c479104dc9',
  'senen7090@gmail.com',
  'ndeye_sene',
  'ndeye sene',
  'etudiant',
  'ETU054',
  '',
  TRUE,
  '2026-10-12T21:49:32.041867Z',
  '2026-11-06T21:38:11.985735Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '6a248d88-3548-4aa4-a273-09a696bacb4e',
  'authenticated',
  'authenticated',
  'niang.ndeyesokhna95@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:49:08.453021Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Ndeye sokhna","is_active":true,"matricule":"ETU053","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"ndeyesokhnaniang"}'::jsonb,
  '2026-10-12T21:49:08.450521Z',
  '2026-11-10T12:07:31.693235Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '6a248d88-3548-4aa4-a273-09a696bacb4e',
  '6a248d88-3548-4aa4-a273-09a696bacb4e',
  '6a248d88-3548-4aa4-a273-09a696bacb4e',
  json_build_object('sub', '6a248d88-3548-4aa4-a273-09a696bacb4e', 'email', 'niang.ndeyesokhna95@gmail.com')::jsonb,
  'email',
  '2026-10-12T21:49:08.453021Z',
  '2026-10-12T21:49:08.450521Z',
  '2026-11-10T12:07:31.693235Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '6a248d88-3548-4aa4-a273-09a696bacb4e',
  'niang.ndeyesokhna95@gmail.com',
  'ndeyesokhnaniang',
  'Ndeye sokhna',
  'etudiant',
  'ETU053',
  '',
  TRUE,
  '2026-10-12T21:49:08.450521Z',
  '2026-11-10T12:07:31.693235Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '370b51ec-ad8e-4c34-9a03-1827a0705253',
  'authenticated',
  'authenticated',
  'modysy602@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:49:06.393812Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-SML","email_verified":true,"filiere":"SML","full_name":"Mody Sy","is_active":true,"matricule":"ETU052","niveau":"L1","phone":"+221 78 305 75 11","role":"etudiant","statut_inscription":"valide","username":"mody221"}'::jsonb,
  '2026-10-12T21:49:06.389434Z',
  '2026-11-06T21:34:20.856538Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '370b51ec-ad8e-4c34-9a03-1827a0705253',
  '370b51ec-ad8e-4c34-9a03-1827a0705253',
  '370b51ec-ad8e-4c34-9a03-1827a0705253',
  json_build_object('sub', '370b51ec-ad8e-4c34-9a03-1827a0705253', 'email', 'modysy602@gmail.com')::jsonb,
  'email',
  '2026-10-12T21:49:06.393812Z',
  '2026-10-12T21:49:06.389434Z',
  '2026-11-06T21:34:20.856538Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '370b51ec-ad8e-4c34-9a03-1827a0705253',
  'modysy602@gmail.com',
  'mody221',
  'Mody Sy',
  'etudiant',
  'ETU052',
  '',
  TRUE,
  '2026-10-12T21:49:06.389434Z',
  '2026-11-06T21:34:20.856538Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '67a3c209-52c1-4d97-9b50-1bead0f31586',
  'authenticated',
  'authenticated',
  'mouhamadoulaminediarra493@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:48:57.861814Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Mouhamadou Lamine Diarra","is_active":true,"matricule":"ETU051","niveau":"L1","phone":"+221 77 551 81 96","role":"etudiant","statut_inscription":"valide","username":"mouhamadoulaminediarra"}'::jsonb,
  '2026-10-12T21:48:57.845293Z',
  '2026-11-01T18:11:37.280838Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '67a3c209-52c1-4d97-9b50-1bead0f31586',
  '67a3c209-52c1-4d97-9b50-1bead0f31586',
  '67a3c209-52c1-4d97-9b50-1bead0f31586',
  json_build_object('sub', '67a3c209-52c1-4d97-9b50-1bead0f31586', 'email', 'mouhamadoulaminediarra493@gmail.com')::jsonb,
  'email',
  '2026-10-12T21:48:57.861814Z',
  '2026-10-12T21:48:57.845293Z',
  '2026-11-01T18:11:37.280838Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '67a3c209-52c1-4d97-9b50-1bead0f31586',
  'mouhamadoulaminediarra493@gmail.com',
  'mouhamadoulaminediarra',
  'Mouhamadou Lamine Diarra',
  'etudiant',
  'ETU051',
  '',
  TRUE,
  '2026-10-12T21:48:57.845293Z',
  '2026-11-01T18:11:37.280838Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '655621a9-ef44-4570-8cbb-f4ccf5c9ac12',
  'authenticated',
  'authenticated',
  'ngomodi1606@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:48:21.238482Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Ngoné Gueye","is_active":true,"matricule":"ETU050","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"ngonee"}'::jsonb,
  '2026-10-12T21:48:21.230171Z',
  '2026-11-11T00:45:50.863063Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '655621a9-ef44-4570-8cbb-f4ccf5c9ac12',
  '655621a9-ef44-4570-8cbb-f4ccf5c9ac12',
  '655621a9-ef44-4570-8cbb-f4ccf5c9ac12',
  json_build_object('sub', '655621a9-ef44-4570-8cbb-f4ccf5c9ac12', 'email', 'ngomodi1606@gmail.com')::jsonb,
  'email',
  '2026-10-12T21:48:21.238482Z',
  '2026-10-12T21:48:21.230171Z',
  '2026-11-11T00:45:50.863063Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '655621a9-ef44-4570-8cbb-f4ccf5c9ac12',
  'ngomodi1606@gmail.com',
  'ngonee',
  'Ngoné Gueye',
  'etudiant',
  'ETU050',
  '',
  TRUE,
  '2026-10-12T21:48:21.230171Z',
  '2026-11-11T00:45:50.863063Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '3aed59c1-c1ad-441e-8228-c7f0707e8373',
  'authenticated',
  'authenticated',
  'niang.anta1@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:46:26.986503Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Anta NIANG","is_active":true,"matricule":"ETU049","niveau":"L1","phone":"+221 78  732 20 22","role":"etudiant","statut_inscription":"valide","username":"niang.anta"}'::jsonb,
  '2026-10-12T21:46:26.974451Z',
  '2026-11-11T21:27:28.968033Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '3aed59c1-c1ad-441e-8228-c7f0707e8373',
  '3aed59c1-c1ad-441e-8228-c7f0707e8373',
  '3aed59c1-c1ad-441e-8228-c7f0707e8373',
  json_build_object('sub', '3aed59c1-c1ad-441e-8228-c7f0707e8373', 'email', 'niang.anta1@uam.edu.sn')::jsonb,
  'email',
  '2026-10-12T21:46:26.986503Z',
  '2026-10-12T21:46:26.974451Z',
  '2026-11-11T21:27:28.968033Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '3aed59c1-c1ad-441e-8228-c7f0707e8373',
  'niang.anta1@uam.edu.sn',
  'niang.anta',
  'Anta NIANG',
  'etudiant',
  'ETU049',
  '',
  TRUE,
  '2026-10-12T21:46:26.974451Z',
  '2026-11-11T21:27:28.968033Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'd77f08fb-cd01-4251-bd72-acdc03610ea7',
  'authenticated',
  'authenticated',
  'dieng.massaer@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:40:43.44971Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Massaer Dieng","is_active":true,"matricule":"ETU048","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"dieng"}'::jsonb,
  '2026-10-12T21:40:43.440507Z',
  '2026-11-11T20:55:06.502044Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'd77f08fb-cd01-4251-bd72-acdc03610ea7',
  'd77f08fb-cd01-4251-bd72-acdc03610ea7',
  'd77f08fb-cd01-4251-bd72-acdc03610ea7',
  json_build_object('sub', 'd77f08fb-cd01-4251-bd72-acdc03610ea7', 'email', 'dieng.massaer@uam.edu.sn')::jsonb,
  'email',
  '2026-10-12T21:40:43.44971Z',
  '2026-10-12T21:40:43.440507Z',
  '2026-11-11T20:55:06.502044Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'd77f08fb-cd01-4251-bd72-acdc03610ea7',
  'dieng.massaer@uam.edu.sn',
  'dieng',
  'Massaer Dieng',
  'etudiant',
  'ETU048',
  '',
  TRUE,
  '2026-10-12T21:40:43.440507Z',
  '2026-11-11T20:55:06.502044Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'ef732641-26b5-4111-976a-aeb8eb4ba5bd',
  'authenticated',
  'authenticated',
  'abdoulrazaddiallo@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:38:48.306387Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Abdoul Razad DIALLO","is_active":true,"matricule":"ETU047","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"abdoulrazaddiallo"}'::jsonb,
  '2026-10-12T21:38:48.283218Z',
  '2026-10-28T20:03:38.941384Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'ef732641-26b5-4111-976a-aeb8eb4ba5bd',
  'ef732641-26b5-4111-976a-aeb8eb4ba5bd',
  'ef732641-26b5-4111-976a-aeb8eb4ba5bd',
  json_build_object('sub', 'ef732641-26b5-4111-976a-aeb8eb4ba5bd', 'email', 'abdoulrazaddiallo@gmail.com')::jsonb,
  'email',
  '2026-10-12T21:38:48.306387Z',
  '2026-10-12T21:38:48.283218Z',
  '2026-10-28T20:03:38.941384Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'ef732641-26b5-4111-976a-aeb8eb4ba5bd',
  'abdoulrazaddiallo@gmail.com',
  'abdoulrazaddiallo',
  'Abdoul Razad DIALLO',
  'etudiant',
  'ETU047',
  '',
  TRUE,
  '2026-10-12T21:38:48.283218Z',
  '2026-10-28T20:03:38.941384Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'ebc2f28d-a962-43bf-ba05-96e9048d743a',
  'authenticated',
  'authenticated',
  'rokhaya171206@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:37:59.313859Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"WADE Rokhaya ","is_active":true,"matricule":"ETU046","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"rokhaya"}'::jsonb,
  '2026-10-12T21:37:59.292596Z',
  '2026-11-11T14:46:46.731657Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'ebc2f28d-a962-43bf-ba05-96e9048d743a',
  'ebc2f28d-a962-43bf-ba05-96e9048d743a',
  'ebc2f28d-a962-43bf-ba05-96e9048d743a',
  json_build_object('sub', 'ebc2f28d-a962-43bf-ba05-96e9048d743a', 'email', 'rokhaya171206@gmail.com')::jsonb,
  'email',
  '2026-10-12T21:37:59.313859Z',
  '2026-10-12T21:37:59.292596Z',
  '2026-11-11T14:46:46.731657Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'ebc2f28d-a962-43bf-ba05-96e9048d743a',
  'rokhaya171206@gmail.com',
  'rokhaya',
  'WADE Rokhaya ',
  'etudiant',
  'ETU046',
  '',
  TRUE,
  '2026-10-12T21:37:59.292596Z',
  '2026-11-11T14:46:46.731657Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'ec7dd83c-ca56-49b0-a9bc-62388c8087c4',
  'authenticated',
  'authenticated',
  'd.thiam.sn@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:30:01.176419Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-SML","email_verified":true,"filiere":"SML","full_name":"Daouda THIAM","is_active":true,"matricule":"ETU045","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"d.thiam"}'::jsonb,
  '2026-10-12T21:30:01.156588Z',
  '2026-11-09T20:57:26.248318Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'ec7dd83c-ca56-49b0-a9bc-62388c8087c4',
  'ec7dd83c-ca56-49b0-a9bc-62388c8087c4',
  'ec7dd83c-ca56-49b0-a9bc-62388c8087c4',
  json_build_object('sub', 'ec7dd83c-ca56-49b0-a9bc-62388c8087c4', 'email', 'd.thiam.sn@gmail.com')::jsonb,
  'email',
  '2026-10-12T21:30:01.176419Z',
  '2026-10-12T21:30:01.156588Z',
  '2026-11-09T20:57:26.248318Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'ec7dd83c-ca56-49b0-a9bc-62388c8087c4',
  'd.thiam.sn@gmail.com',
  'd.thiam',
  'Daouda THIAM',
  'etudiant',
  'ETU045',
  '',
  TRUE,
  '2026-10-12T21:30:01.156588Z',
  '2026-11-09T20:57:26.248318Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c39f69f8-9dab-4c26-b88b-5785beb72f64',
  'authenticated',
  'authenticated',
  'anneibrahima2005@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:05:12.700958Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-SML","email_verified":true,"filiere":"SML","full_name":"Ibrahima Anne","is_active":true,"matricule":"ETU044","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"ibra"}'::jsonb,
  '2026-10-12T21:05:12.674198Z',
  '2026-10-12T22:08:38.324609Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'c39f69f8-9dab-4c26-b88b-5785beb72f64',
  'c39f69f8-9dab-4c26-b88b-5785beb72f64',
  'c39f69f8-9dab-4c26-b88b-5785beb72f64',
  json_build_object('sub', 'c39f69f8-9dab-4c26-b88b-5785beb72f64', 'email', 'anneibrahima2005@gmail.com')::jsonb,
  'email',
  '2026-10-12T21:05:12.700958Z',
  '2026-10-12T21:05:12.674198Z',
  '2026-10-12T22:08:38.324609Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'c39f69f8-9dab-4c26-b88b-5785beb72f64',
  'anneibrahima2005@gmail.com',
  'ibra',
  'Ibrahima Anne',
  'etudiant',
  'ETU044',
  '',
  TRUE,
  '2026-10-12T21:05:12.674198Z',
  '2026-10-12T22:08:38.324609Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '1edede3e-0652-436b-bca2-55c2676925f7',
  'authenticated',
  'authenticated',
  'salimatacisse2005@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T21:00:17.041136Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Oumou Salamata Cisse","is_active":true,"matricule":"ETU043","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"sali"}'::jsonb,
  '2026-10-12T21:00:16.9999Z',
  '2026-10-23T22:26:36.264511Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '1edede3e-0652-436b-bca2-55c2676925f7',
  '1edede3e-0652-436b-bca2-55c2676925f7',
  '1edede3e-0652-436b-bca2-55c2676925f7',
  json_build_object('sub', '1edede3e-0652-436b-bca2-55c2676925f7', 'email', 'salimatacisse2005@gmail.com')::jsonb,
  'email',
  '2026-10-12T21:00:17.041136Z',
  '2026-10-12T21:00:16.9999Z',
  '2026-10-23T22:26:36.264511Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '1edede3e-0652-436b-bca2-55c2676925f7',
  'salimatacisse2005@gmail.com',
  'sali',
  'Oumou Salamata Cisse',
  'etudiant',
  'ETU043',
  '',
  TRUE,
  '2026-10-12T21:00:16.9999Z',
  '2026-10-23T22:26:36.264511Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '463ffbf8-815b-4de0-b889-c1129e40c88a',
  'authenticated',
  'authenticated',
  'ka.marie@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T10:29:34.238689Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MIASS","email_verified":true,"filiere":"MIASS","full_name":"NDEYE MARIE KA ","is_active":true,"matricule":"ETU042","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"1818"}'::jsonb,
  '2026-10-12T10:29:34.204827Z',
  '2026-11-10T21:10:50.744174Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '463ffbf8-815b-4de0-b889-c1129e40c88a',
  '463ffbf8-815b-4de0-b889-c1129e40c88a',
  '463ffbf8-815b-4de0-b889-c1129e40c88a',
  json_build_object('sub', '463ffbf8-815b-4de0-b889-c1129e40c88a', 'email', 'ka.marie@uam.edu.sn')::jsonb,
  'email',
  '2026-10-12T10:29:34.238689Z',
  '2026-10-12T10:29:34.204827Z',
  '2026-11-10T21:10:50.744174Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '463ffbf8-815b-4de0-b889-c1129e40c88a',
  'ka.marie@uam.edu.sn',
  '1818',
  'NDEYE MARIE KA ',
  'etudiant',
  'ETU042',
  '',
  TRUE,
  '2026-10-12T10:29:34.204827Z',
  '2026-11-10T21:10:50.744174Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'ac6691ba-e512-403e-b110-724dac65e285',
  'authenticated',
  'authenticated',
  'mamadoudiaw1105@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-12T02:04:16.770764Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Mamadou Diaw","is_active":true,"matricule":"ETU041","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"mamadoudiaw1105"}'::jsonb,
  '2026-10-12T02:04:16.72318Z',
  '2026-11-11T13:53:48.406587Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'ac6691ba-e512-403e-b110-724dac65e285',
  'ac6691ba-e512-403e-b110-724dac65e285',
  'ac6691ba-e512-403e-b110-724dac65e285',
  json_build_object('sub', 'ac6691ba-e512-403e-b110-724dac65e285', 'email', 'mamadoudiaw1105@gmail.com')::jsonb,
  'email',
  '2026-10-12T02:04:16.770764Z',
  '2026-10-12T02:04:16.72318Z',
  '2026-11-11T13:53:48.406587Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'ac6691ba-e512-403e-b110-724dac65e285',
  'mamadoudiaw1105@gmail.com',
  'mamadoudiaw1105',
  'Mamadou Diaw',
  'etudiant',
  'ETU041',
  '',
  TRUE,
  '2026-10-12T02:04:16.72318Z',
  '2026-11-11T13:53:48.406587Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '6761074f-7ec8-4422-8d17-852bfea22307',
  'authenticated',
  'authenticated',
  'sarrsokhnafaty5@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-11T23:01:15.60204Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Sokhna faty Sarr","is_active":true,"matricule":"ETU040","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"sfsarr"}'::jsonb,
  '2026-10-11T23:01:15.538578Z',
  '2026-11-09T21:02:05.007206Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '6761074f-7ec8-4422-8d17-852bfea22307',
  '6761074f-7ec8-4422-8d17-852bfea22307',
  '6761074f-7ec8-4422-8d17-852bfea22307',
  json_build_object('sub', '6761074f-7ec8-4422-8d17-852bfea22307', 'email', 'sarrsokhnafaty5@gmail.com')::jsonb,
  'email',
  '2026-10-11T23:01:15.60204Z',
  '2026-10-11T23:01:15.538578Z',
  '2026-11-09T21:02:05.007206Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '6761074f-7ec8-4422-8d17-852bfea22307',
  'sarrsokhnafaty5@gmail.com',
  'sfsarr',
  'Sokhna faty Sarr',
  'etudiant',
  'ETU040',
  '',
  TRUE,
  '2026-10-11T23:01:15.538578Z',
  '2026-11-09T21:02:05.007206Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'da97cd20-df47-4487-b5ee-4af47b102127',
  'authenticated',
  'authenticated',
  'sarrdame173@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-11T00:08:38.935083Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Dame Sarr","is_active":true,"matricule":"ETU039","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"damesarr"}'::jsonb,
  '2026-10-11T00:08:38.918468Z',
  '2026-11-11T19:53:42.348618Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'da97cd20-df47-4487-b5ee-4af47b102127',
  'da97cd20-df47-4487-b5ee-4af47b102127',
  'da97cd20-df47-4487-b5ee-4af47b102127',
  json_build_object('sub', 'da97cd20-df47-4487-b5ee-4af47b102127', 'email', 'sarrdame173@gmail.com')::jsonb,
  'email',
  '2026-10-11T00:08:38.935083Z',
  '2026-10-11T00:08:38.918468Z',
  '2026-11-11T19:53:42.348618Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'da97cd20-df47-4487-b5ee-4af47b102127',
  'sarrdame173@gmail.com',
  'damesarr',
  'Dame Sarr',
  'etudiant',
  'ETU039',
  '',
  TRUE,
  '2026-10-11T00:08:38.918468Z',
  '2026-11-11T19:53:42.348618Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '985f3a4b-bf6c-48e8-9ac4-21fb8d75347a',
  'authenticated',
  'authenticated',
  'mariediouf219@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-10T19:51:44.003423Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-SML","email_verified":true,"filiere":"SML","full_name":"Marie Astou","is_active":true,"matricule":"ETU038","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"mariesd"}'::jsonb,
  '2026-10-10T19:51:43.983844Z',
  '2026-11-11T22:53:55.782504Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '985f3a4b-bf6c-48e8-9ac4-21fb8d75347a',
  '985f3a4b-bf6c-48e8-9ac4-21fb8d75347a',
  '985f3a4b-bf6c-48e8-9ac4-21fb8d75347a',
  json_build_object('sub', '985f3a4b-bf6c-48e8-9ac4-21fb8d75347a', 'email', 'mariediouf219@gmail.com')::jsonb,
  'email',
  '2026-10-10T19:51:44.003423Z',
  '2026-10-10T19:51:43.983844Z',
  '2026-11-11T22:53:55.782504Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '985f3a4b-bf6c-48e8-9ac4-21fb8d75347a',
  'mariediouf219@gmail.com',
  'mariesd',
  'Marie Astou',
  'etudiant',
  'ETU038',
  '',
  TRUE,
  '2026-10-10T19:51:43.983844Z',
  '2026-11-11T22:53:55.782504Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '508aae24-828f-43a0-b817-76faa077be97',
  'authenticated',
  'authenticated',
  'ndeyeguitte05@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-10T19:20:12.286612Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Ndeye Guittè Ndongo ","is_active":true,"matricule":"ETU037","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"ladivanoire"}'::jsonb,
  '2026-10-10T19:20:12.278727Z',
  '2026-11-09T22:16:54.943132Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '508aae24-828f-43a0-b817-76faa077be97',
  '508aae24-828f-43a0-b817-76faa077be97',
  '508aae24-828f-43a0-b817-76faa077be97',
  json_build_object('sub', '508aae24-828f-43a0-b817-76faa077be97', 'email', 'ndeyeguitte05@gmail.com')::jsonb,
  'email',
  '2026-10-10T19:20:12.286612Z',
  '2026-10-10T19:20:12.278727Z',
  '2026-11-09T22:16:54.943132Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '508aae24-828f-43a0-b817-76faa077be97',
  'ndeyeguitte05@gmail.com',
  'ladivanoire',
  'Ndeye Guittè Ndongo ',
  'etudiant',
  'ETU037',
  '',
  TRUE,
  '2026-10-10T19:20:12.278727Z',
  '2026-11-09T22:16:54.943132Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0c61bc9-54a8-45c7-84f6-1df18614c798',
  'authenticated',
  'authenticated',
  'soro21ba@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-10T19:18:58.740459Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Soro BA","is_active":true,"matricule":"ETU036","niveau":"L1","phone":"+221761730723","role":"etudiant","statut_inscription":"valide","username":"sba"}'::jsonb,
  '2026-10-10T19:18:58.711614Z',
  '2026-11-08T21:46:33.961688Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'a0c61bc9-54a8-45c7-84f6-1df18614c798',
  'a0c61bc9-54a8-45c7-84f6-1df18614c798',
  'a0c61bc9-54a8-45c7-84f6-1df18614c798',
  json_build_object('sub', 'a0c61bc9-54a8-45c7-84f6-1df18614c798', 'email', 'soro21ba@gmail.com')::jsonb,
  'email',
  '2026-10-10T19:18:58.740459Z',
  '2026-10-10T19:18:58.711614Z',
  '2026-11-08T21:46:33.961688Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'a0c61bc9-54a8-45c7-84f6-1df18614c798',
  'soro21ba@gmail.com',
  'sba',
  'Soro BA',
  'etudiant',
  'ETU036',
  '',
  TRUE,
  '2026-10-10T19:18:58.711614Z',
  '2026-11-08T21:46:33.961688Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a45ede70-153d-4696-8831-971a5b88fd95',
  'authenticated',
  'authenticated',
  'aissatagangue283@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-10T18:42:30.231326Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Aissata Gangue ","is_active":true,"matricule":"ETU035","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"aissata2026"}'::jsonb,
  '2026-10-10T18:42:30.197405Z',
  '2026-11-09T20:10:34.984541Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'a45ede70-153d-4696-8831-971a5b88fd95',
  'a45ede70-153d-4696-8831-971a5b88fd95',
  'a45ede70-153d-4696-8831-971a5b88fd95',
  json_build_object('sub', 'a45ede70-153d-4696-8831-971a5b88fd95', 'email', 'aissatagangue283@gmail.com')::jsonb,
  'email',
  '2026-10-10T18:42:30.231326Z',
  '2026-10-10T18:42:30.197405Z',
  '2026-11-09T20:10:34.984541Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'a45ede70-153d-4696-8831-971a5b88fd95',
  'aissatagangue283@gmail.com',
  'aissata2026',
  'Aissata Gangue ',
  'etudiant',
  'ETU035',
  '',
  TRUE,
  '2026-10-10T18:42:30.197405Z',
  '2026-11-09T20:10:34.984541Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '38057638-7577-49ca-bd58-515404fae332',
  'authenticated',
  'authenticated',
  'sammariame385@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-10T11:41:29.896287Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Mariame Sam","is_active":true,"matricule":"ETU034","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"mariame"}'::jsonb,
  '2026-10-10T11:41:29.890004Z',
  '2026-11-06T21:22:28.981503Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '38057638-7577-49ca-bd58-515404fae332',
  '38057638-7577-49ca-bd58-515404fae332',
  '38057638-7577-49ca-bd58-515404fae332',
  json_build_object('sub', '38057638-7577-49ca-bd58-515404fae332', 'email', 'sammariame385@gmail.com')::jsonb,
  'email',
  '2026-10-10T11:41:29.896287Z',
  '2026-10-10T11:41:29.890004Z',
  '2026-11-06T21:22:28.981503Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '38057638-7577-49ca-bd58-515404fae332',
  'sammariame385@gmail.com',
  'mariame',
  'Mariame Sam',
  'etudiant',
  'ETU034',
  '',
  TRUE,
  '2026-10-10T11:41:29.890004Z',
  '2026-11-06T21:22:28.981503Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '92ce1233-b254-47ce-a0c0-304a4a6dcd94',
  'authenticated',
  'authenticated',
  'ibou@has-academie.online',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-10T11:40:36.80238Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"email_verified":true,"full_name":"El Hadji","is_active":true,"matricule":"ADM002","role":"admin","username":"ibou"}'::jsonb,
  '2026-10-10T11:40:36.765702Z',
  '2026-10-19T16:13:24.843537Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '92ce1233-b254-47ce-a0c0-304a4a6dcd94',
  '92ce1233-b254-47ce-a0c0-304a4a6dcd94',
  '92ce1233-b254-47ce-a0c0-304a4a6dcd94',
  json_build_object('sub', '92ce1233-b254-47ce-a0c0-304a4a6dcd94', 'email', 'ibou@has-academie.online')::jsonb,
  'email',
  '2026-10-10T11:40:36.80238Z',
  '2026-10-10T11:40:36.765702Z',
  '2026-10-19T16:13:24.843537Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '92ce1233-b254-47ce-a0c0-304a4a6dcd94',
  'ibou@has-academie.online',
  'ibou',
  'El Hadji',
  'admin',
  'ADM002',
  '',
  TRUE,
  '2026-10-10T11:40:36.765702Z',
  '2026-10-19T16:13:24.843537Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '75788cf3-00dc-4e55-b25f-6d49b56fcc33',
  'authenticated',
  'authenticated',
  'seck.gueye@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-10T03:21:43.40849Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Fatou Gueye Seck","is_active":true,"matricule":"ETU033","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"fa.2007"}'::jsonb,
  '2026-10-10T03:21:43.369955Z',
  '2026-11-02T21:44:03.925025Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '75788cf3-00dc-4e55-b25f-6d49b56fcc33',
  '75788cf3-00dc-4e55-b25f-6d49b56fcc33',
  '75788cf3-00dc-4e55-b25f-6d49b56fcc33',
  json_build_object('sub', '75788cf3-00dc-4e55-b25f-6d49b56fcc33', 'email', 'seck.gueye@uam.edu.sn')::jsonb,
  'email',
  '2026-10-10T03:21:43.40849Z',
  '2026-10-10T03:21:43.369955Z',
  '2026-11-02T21:44:03.925025Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '75788cf3-00dc-4e55-b25f-6d49b56fcc33',
  'seck.gueye@uam.edu.sn',
  'fa.2007',
  'Fatou Gueye Seck',
  'etudiant',
  'ETU033',
  '',
  TRUE,
  '2026-10-10T03:21:43.369955Z',
  '2026-11-02T21:44:03.925025Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '7dcef529-4439-4f9b-9601-c25aa6eb2eeb',
  'authenticated',
  'authenticated',
  'komekadia00@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-10T01:20:21.167839Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-SML","email_verified":true,"filiere":"SML","full_name":"Kadja komé","is_active":true,"matricule":"ETU032","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"kasey"}'::jsonb,
  '2026-10-10T01:20:21.141728Z',
  '2026-11-07T23:09:12.177111Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '7dcef529-4439-4f9b-9601-c25aa6eb2eeb',
  '7dcef529-4439-4f9b-9601-c25aa6eb2eeb',
  '7dcef529-4439-4f9b-9601-c25aa6eb2eeb',
  json_build_object('sub', '7dcef529-4439-4f9b-9601-c25aa6eb2eeb', 'email', 'komekadia00@gmail.com')::jsonb,
  'email',
  '2026-10-10T01:20:21.167839Z',
  '2026-10-10T01:20:21.141728Z',
  '2026-11-07T23:09:12.177111Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '7dcef529-4439-4f9b-9601-c25aa6eb2eeb',
  'komekadia00@gmail.com',
  'kasey',
  'Kadja komé',
  'etudiant',
  'ETU032',
  '',
  TRUE,
  '2026-10-10T01:20:21.141728Z',
  '2026-11-07T23:09:12.177111Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '2ef5a0df-0084-4054-b66d-d95ecd49239f',
  'authenticated',
  'authenticated',
  'loo34982@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-09T23:20:13.514305Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Omar Lô","is_active":true,"matricule":"ETU031","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"lo_omar"}'::jsonb,
  '2026-10-09T23:20:13.495956Z',
  '2026-10-22T19:16:50.903321Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '2ef5a0df-0084-4054-b66d-d95ecd49239f',
  '2ef5a0df-0084-4054-b66d-d95ecd49239f',
  '2ef5a0df-0084-4054-b66d-d95ecd49239f',
  json_build_object('sub', '2ef5a0df-0084-4054-b66d-d95ecd49239f', 'email', 'loo34982@gmail.com')::jsonb,
  'email',
  '2026-10-09T23:20:13.514305Z',
  '2026-10-09T23:20:13.495956Z',
  '2026-10-22T19:16:50.903321Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '2ef5a0df-0084-4054-b66d-d95ecd49239f',
  'loo34982@gmail.com',
  'lo_omar',
  'Omar Lô',
  'etudiant',
  'ETU031',
  '',
  TRUE,
  '2026-10-09T23:20:13.495956Z',
  '2026-10-22T19:16:50.903321Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'ab092b9a-1acf-478c-91b0-a774cffc944a',
  'authenticated',
  'authenticated',
  'mbengue.masse@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-09T23:12:22.523581Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-SML","email_verified":true,"filiere":"SML","full_name":"Masse Mbengue","is_active":true,"matricule":"ETU030","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"mbengue221"}'::jsonb,
  '2026-10-09T23:12:22.498529Z',
  '2026-10-31T22:30:07.401035Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'ab092b9a-1acf-478c-91b0-a774cffc944a',
  'ab092b9a-1acf-478c-91b0-a774cffc944a',
  'ab092b9a-1acf-478c-91b0-a774cffc944a',
  json_build_object('sub', 'ab092b9a-1acf-478c-91b0-a774cffc944a', 'email', 'mbengue.masse@uam.edu.sn')::jsonb,
  'email',
  '2026-10-09T23:12:22.523581Z',
  '2026-10-09T23:12:22.498529Z',
  '2026-10-31T22:30:07.401035Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'ab092b9a-1acf-478c-91b0-a774cffc944a',
  'mbengue.masse@uam.edu.sn',
  'mbengue221',
  'Masse Mbengue',
  'etudiant',
  'ETU030',
  '',
  TRUE,
  '2026-10-09T23:12:22.498529Z',
  '2026-10-31T22:30:07.401035Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '82ae28d1-28c2-4032-b20d-64f2f617c358',
  'authenticated',
  'authenticated',
  'ndao.aminata2@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-09T21:47:01.088484Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Aminata NDAO","is_active":true,"matricule":"ETU029","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"andao"}'::jsonb,
  '2026-10-09T21:47:01.053481Z',
  '2026-11-11T21:53:58.90814Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '82ae28d1-28c2-4032-b20d-64f2f617c358',
  '82ae28d1-28c2-4032-b20d-64f2f617c358',
  '82ae28d1-28c2-4032-b20d-64f2f617c358',
  json_build_object('sub', '82ae28d1-28c2-4032-b20d-64f2f617c358', 'email', 'ndao.aminata2@uam.edu.sn')::jsonb,
  'email',
  '2026-10-09T21:47:01.088484Z',
  '2026-10-09T21:47:01.053481Z',
  '2026-11-11T21:53:58.90814Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '82ae28d1-28c2-4032-b20d-64f2f617c358',
  'ndao.aminata2@uam.edu.sn',
  'andao',
  'Aminata NDAO',
  'etudiant',
  'ETU029',
  '',
  TRUE,
  '2026-10-09T21:47:01.053481Z',
  '2026-11-11T21:53:58.90814Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '7c3e9856-c287-4487-80f2-902b5e9789a4',
  'authenticated',
  'authenticated',
  'sylla.diarra@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-09T21:41:14.383787Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Mame Diarra Sylla","is_active":true,"matricule":"ETU028","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"toulahiebony"}'::jsonb,
  '2026-10-09T21:41:14.350848Z',
  '2026-11-10T21:10:47.475882Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '7c3e9856-c287-4487-80f2-902b5e9789a4',
  '7c3e9856-c287-4487-80f2-902b5e9789a4',
  '7c3e9856-c287-4487-80f2-902b5e9789a4',
  json_build_object('sub', '7c3e9856-c287-4487-80f2-902b5e9789a4', 'email', 'sylla.diarra@uam.edu.sn')::jsonb,
  'email',
  '2026-10-09T21:41:14.383787Z',
  '2026-10-09T21:41:14.350848Z',
  '2026-11-10T21:10:47.475882Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '7c3e9856-c287-4487-80f2-902b5e9789a4',
  'sylla.diarra@uam.edu.sn',
  'toulahiebony',
  'Mame Diarra Sylla',
  'etudiant',
  'ETU028',
  '',
  TRUE,
  '2026-10-09T21:41:14.350848Z',
  '2026-11-10T21:10:47.475882Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '95bdb602-d2f5-4896-86ff-25c30a5b9d4b',
  'authenticated',
  'authenticated',
  'm.ndiour2006@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-09T21:21:05.641421Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Mouhamed Ndiour ","is_active":true,"matricule":"ETU027","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"shop_123"}'::jsonb,
  '2026-10-09T21:21:05.626056Z',
  '2026-11-11T21:37:47.55851Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '95bdb602-d2f5-4896-86ff-25c30a5b9d4b',
  '95bdb602-d2f5-4896-86ff-25c30a5b9d4b',
  '95bdb602-d2f5-4896-86ff-25c30a5b9d4b',
  json_build_object('sub', '95bdb602-d2f5-4896-86ff-25c30a5b9d4b', 'email', 'm.ndiour2006@gmail.com')::jsonb,
  'email',
  '2026-10-09T21:21:05.641421Z',
  '2026-10-09T21:21:05.626056Z',
  '2026-11-11T21:37:47.55851Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '95bdb602-d2f5-4896-86ff-25c30a5b9d4b',
  'm.ndiour2006@gmail.com',
  'shop_123',
  'Mouhamed Ndiour ',
  'etudiant',
  'ETU027',
  '',
  TRUE,
  '2026-10-09T21:21:05.626056Z',
  '2026-11-11T21:37:47.55851Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '3f7c32ad-d4ed-49dc-b60e-0bf9066a5072',
  'authenticated',
  'authenticated',
  'diop.rassoul@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-09T21:10:39.351252Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Khadim rassoul diop","is_active":true,"matricule":"ETU026","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"bamba"}'::jsonb,
  '2026-10-09T21:10:39.327293Z',
  '2026-11-08T14:16:18.164285Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '3f7c32ad-d4ed-49dc-b60e-0bf9066a5072',
  '3f7c32ad-d4ed-49dc-b60e-0bf9066a5072',
  '3f7c32ad-d4ed-49dc-b60e-0bf9066a5072',
  json_build_object('sub', '3f7c32ad-d4ed-49dc-b60e-0bf9066a5072', 'email', 'diop.rassoul@uam.edu.sn')::jsonb,
  'email',
  '2026-10-09T21:10:39.351252Z',
  '2026-10-09T21:10:39.327293Z',
  '2026-11-08T14:16:18.164285Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '3f7c32ad-d4ed-49dc-b60e-0bf9066a5072',
  'diop.rassoul@uam.edu.sn',
  'bamba',
  'Khadim rassoul diop',
  'etudiant',
  'ETU026',
  '',
  TRUE,
  '2026-10-09T21:10:39.327293Z',
  '2026-11-08T14:16:18.164285Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '132c4257-dc79-4353-8873-3587178528fc',
  'authenticated',
  'authenticated',
  'cdiop683@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-09T21:06:16.963099Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Cheikh Diop","is_active":true,"matricule":"ETU025","niveau":"L2","phone":"776809380","role":"etudiant","statut_inscription":"valide","username":"cmd07"}'::jsonb,
  '2026-10-09T21:06:16.933531Z',
  '2026-11-11T10:05:44.372458Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '132c4257-dc79-4353-8873-3587178528fc',
  '132c4257-dc79-4353-8873-3587178528fc',
  '132c4257-dc79-4353-8873-3587178528fc',
  json_build_object('sub', '132c4257-dc79-4353-8873-3587178528fc', 'email', 'cdiop683@gmail.com')::jsonb,
  'email',
  '2026-10-09T21:06:16.963099Z',
  '2026-10-09T21:06:16.933531Z',
  '2026-11-11T10:05:44.372458Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '132c4257-dc79-4353-8873-3587178528fc',
  'cdiop683@gmail.com',
  'cmd07',
  'Cheikh Diop',
  'etudiant',
  'ETU025',
  '',
  TRUE,
  '2026-10-09T21:06:16.933531Z',
  '2026-11-11T10:05:44.372458Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b9e0a565-ba91-4017-b70b-99c837079dd2',
  'authenticated',
  'authenticated',
  'seyni0379@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-09T17:55:44.165536Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Seyni Diop","is_active":true,"matricule":"ETU024","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"2209"}'::jsonb,
  '2026-10-09T17:55:44.127495Z',
  '2026-11-09T19:21:17.45259Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'b9e0a565-ba91-4017-b70b-99c837079dd2',
  'b9e0a565-ba91-4017-b70b-99c837079dd2',
  'b9e0a565-ba91-4017-b70b-99c837079dd2',
  json_build_object('sub', 'b9e0a565-ba91-4017-b70b-99c837079dd2', 'email', 'seyni0379@gmail.com')::jsonb,
  'email',
  '2026-10-09T17:55:44.165536Z',
  '2026-10-09T17:55:44.127495Z',
  '2026-11-09T19:21:17.45259Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'b9e0a565-ba91-4017-b70b-99c837079dd2',
  'seyni0379@gmail.com',
  '2209',
  'Seyni Diop',
  'etudiant',
  'ETU024',
  '',
  TRUE,
  '2026-10-09T17:55:44.127495Z',
  '2026-11-09T19:21:17.45259Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c2eb757f-3a40-43fb-ba6a-a619d1eb4ebe',
  'authenticated',
  'authenticated',
  'nianganta852@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-09T10:58:14.462978Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"anta Niang","is_active":true,"matricule":"ETU023","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"nianganta852"}'::jsonb,
  '2026-10-09T10:58:14.424793Z',
  '2026-10-19T10:14:28.785755Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'c2eb757f-3a40-43fb-ba6a-a619d1eb4ebe',
  'c2eb757f-3a40-43fb-ba6a-a619d1eb4ebe',
  'c2eb757f-3a40-43fb-ba6a-a619d1eb4ebe',
  json_build_object('sub', 'c2eb757f-3a40-43fb-ba6a-a619d1eb4ebe', 'email', 'nianganta852@gmail.com')::jsonb,
  'email',
  '2026-10-09T10:58:14.462978Z',
  '2026-10-09T10:58:14.424793Z',
  '2026-10-19T10:14:28.785755Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'c2eb757f-3a40-43fb-ba6a-a619d1eb4ebe',
  'nianganta852@gmail.com',
  'nianganta852',
  'anta Niang',
  'etudiant',
  'ETU023',
  '',
  TRUE,
  '2026-10-09T10:58:14.424793Z',
  '2026-10-19T10:14:28.785755Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '59daff07-1107-4e74-8d78-8a6d9cb7d523',
  'authenticated',
  'authenticated',
  'niang.khoudia1@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-08T14:51:02.539947Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Khoudia Niang ","is_active":true,"matricule":"ETU022","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"linguere"}'::jsonb,
  '2026-10-08T14:51:02.528573Z',
  '2026-11-10T20:59:46.147449Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '59daff07-1107-4e74-8d78-8a6d9cb7d523',
  '59daff07-1107-4e74-8d78-8a6d9cb7d523',
  '59daff07-1107-4e74-8d78-8a6d9cb7d523',
  json_build_object('sub', '59daff07-1107-4e74-8d78-8a6d9cb7d523', 'email', 'niang.khoudia1@uam.edu.sn')::jsonb,
  'email',
  '2026-10-08T14:51:02.539947Z',
  '2026-10-08T14:51:02.528573Z',
  '2026-11-10T20:59:46.147449Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '59daff07-1107-4e74-8d78-8a6d9cb7d523',
  'niang.khoudia1@uam.edu.sn',
  'linguere',
  'Khoudia Niang ',
  'etudiant',
  'ETU022',
  '',
  TRUE,
  '2026-10-08T14:51:02.528573Z',
  '2026-11-10T20:59:46.147449Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '546058fa-e39e-4b73-8d9a-8fbc5a71d164',
  'authenticated',
  'authenticated',
  'fatimataanne18@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-08T14:39:50.142839Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Fatimata Anne","is_active":true,"matricule":"ETU021","niveau":"L1","phone":"766179112","role":"etudiant","statut_inscription":"valide","username":"tima_sama10"}'::jsonb,
  '2026-10-08T14:39:50.126478Z',
  '2026-11-10T19:57:08.487309Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '546058fa-e39e-4b73-8d9a-8fbc5a71d164',
  '546058fa-e39e-4b73-8d9a-8fbc5a71d164',
  '546058fa-e39e-4b73-8d9a-8fbc5a71d164',
  json_build_object('sub', '546058fa-e39e-4b73-8d9a-8fbc5a71d164', 'email', 'fatimataanne18@gmail.com')::jsonb,
  'email',
  '2026-10-08T14:39:50.142839Z',
  '2026-10-08T14:39:50.126478Z',
  '2026-11-10T19:57:08.487309Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '546058fa-e39e-4b73-8d9a-8fbc5a71d164',
  'fatimataanne18@gmail.com',
  'tima_sama10',
  'Fatimata Anne',
  'etudiant',
  'ETU021',
  '',
  TRUE,
  '2026-10-08T14:39:50.126478Z',
  '2026-11-10T19:57:08.487309Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '581fa71e-5fd8-4ec4-b75e-f244db773616',
  'authenticated',
  'authenticated',
  'cd5649829@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-08T14:38:54.329845Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Khoumba Diallo","is_active":true,"matricule":"ETU020","niveau":"L1","phone":"+221 78 265 04 45","role":"etudiant","statut_inscription":"valide","username":"kdiallo"}'::jsonb,
  '2026-10-08T14:38:54.314817Z',
  '2026-11-10T20:07:45.902866Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '581fa71e-5fd8-4ec4-b75e-f244db773616',
  '581fa71e-5fd8-4ec4-b75e-f244db773616',
  '581fa71e-5fd8-4ec4-b75e-f244db773616',
  json_build_object('sub', '581fa71e-5fd8-4ec4-b75e-f244db773616', 'email', 'cd5649829@gmail.com')::jsonb,
  'email',
  '2026-10-08T14:38:54.329845Z',
  '2026-10-08T14:38:54.314817Z',
  '2026-11-10T20:07:45.902866Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '581fa71e-5fd8-4ec4-b75e-f244db773616',
  'cd5649829@gmail.com',
  'kdiallo',
  'Khoumba Diallo',
  'etudiant',
  'ETU020',
  '',
  TRUE,
  '2026-10-08T14:38:54.314817Z',
  '2026-11-10T20:07:45.902866Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '90d92bc9-dfd0-46e7-99cc-9ddb2239a798',
  'authenticated',
  'authenticated',
  'mbayesouleymaneofficiel@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-08T14:32:32.415094Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"SOULEYMANE MBAYE ","is_active":true,"matricule":"ETU019","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"ghost"}'::jsonb,
  '2026-10-08T14:32:32.406538Z',
  '2026-11-06T17:29:56.132687Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '90d92bc9-dfd0-46e7-99cc-9ddb2239a798',
  '90d92bc9-dfd0-46e7-99cc-9ddb2239a798',
  '90d92bc9-dfd0-46e7-99cc-9ddb2239a798',
  json_build_object('sub', '90d92bc9-dfd0-46e7-99cc-9ddb2239a798', 'email', 'mbayesouleymaneofficiel@gmail.com')::jsonb,
  'email',
  '2026-10-08T14:32:32.415094Z',
  '2026-10-08T14:32:32.406538Z',
  '2026-11-06T17:29:56.132687Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '90d92bc9-dfd0-46e7-99cc-9ddb2239a798',
  'mbayesouleymaneofficiel@gmail.com',
  'ghost',
  'SOULEYMANE MBAYE ',
  'etudiant',
  'ETU019',
  '',
  TRUE,
  '2026-10-08T14:32:32.406538Z',
  '2026-11-06T17:29:56.132687Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '5e397bd5-8405-488b-a41a-b5d673335f07',
  'authenticated',
  'authenticated',
  'wahbbint05@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-08T14:29:26.436396Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","date_expiration_paiement":"2026-12-12T23:59:59.000Z","date_validation_paiement":"2026-11-11T19:58:17.847Z","email_verified":true,"filiere":"MPI","full_name":"Aminata Diop ","is_active":true,"matricule":"ETU018","niveau":"L2","phone":"","role":"etudiant","statut_inscription":"valide","statut_paiement":"a_jour","username":"bint"}'::jsonb,
  '2026-10-08T14:29:26.385616Z',
  '2026-11-11T19:58:18.124095Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '5e397bd5-8405-488b-a41a-b5d673335f07',
  '5e397bd5-8405-488b-a41a-b5d673335f07',
  '5e397bd5-8405-488b-a41a-b5d673335f07',
  json_build_object('sub', '5e397bd5-8405-488b-a41a-b5d673335f07', 'email', 'wahbbint05@gmail.com')::jsonb,
  'email',
  '2026-10-08T14:29:26.436396Z',
  '2026-10-08T14:29:26.385616Z',
  '2026-11-11T19:58:18.124095Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '5e397bd5-8405-488b-a41a-b5d673335f07',
  'wahbbint05@gmail.com',
  'bint',
  'Aminata Diop ',
  'etudiant',
  'ETU018',
  '',
  TRUE,
  '2026-10-08T14:29:26.385616Z',
  '2026-11-11T19:58:18.124095Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '105b430e-e93d-4ae5-a4c7-96f9d560b5bb',
  'authenticated',
  'authenticated',
  'adamandiaye6002@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-08T14:05:35.172888Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Adama Ndiaye","is_active":true,"matricule":"ETU017","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"adama"}'::jsonb,
  '2026-10-08T14:05:35.151081Z',
  '2026-11-10T20:05:03.045796Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '105b430e-e93d-4ae5-a4c7-96f9d560b5bb',
  '105b430e-e93d-4ae5-a4c7-96f9d560b5bb',
  '105b430e-e93d-4ae5-a4c7-96f9d560b5bb',
  json_build_object('sub', '105b430e-e93d-4ae5-a4c7-96f9d560b5bb', 'email', 'adamandiaye6002@gmail.com')::jsonb,
  'email',
  '2026-10-08T14:05:35.172888Z',
  '2026-10-08T14:05:35.151081Z',
  '2026-11-10T20:05:03.045796Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '105b430e-e93d-4ae5-a4c7-96f9d560b5bb',
  'adamandiaye6002@gmail.com',
  'adama',
  'Adama Ndiaye',
  'etudiant',
  'ETU017',
  '',
  TRUE,
  '2026-10-08T14:05:35.151081Z',
  '2026-11-10T20:05:03.045796Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c314adca-3bf8-4ebc-90c7-7a2f1c0de9cc',
  'authenticated',
  'authenticated',
  'thiareadama2005@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-08T14:00:35.353084Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MIASS","email_verified":true,"filiere":"MIASS","full_name":"Adama Thiaré","is_active":true,"matricule":"ETU016","niveau":"L2","phone":"","role":"etudiant","statut_inscription":"valide","username":"adamathiare"}'::jsonb,
  '2026-10-08T14:00:35.311016Z',
  '2026-11-10T22:49:35.187607Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'c314adca-3bf8-4ebc-90c7-7a2f1c0de9cc',
  'c314adca-3bf8-4ebc-90c7-7a2f1c0de9cc',
  'c314adca-3bf8-4ebc-90c7-7a2f1c0de9cc',
  json_build_object('sub', 'c314adca-3bf8-4ebc-90c7-7a2f1c0de9cc', 'email', 'thiareadama2005@gmail.com')::jsonb,
  'email',
  '2026-10-08T14:00:35.353084Z',
  '2026-10-08T14:00:35.311016Z',
  '2026-11-10T22:49:35.187607Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'c314adca-3bf8-4ebc-90c7-7a2f1c0de9cc',
  'thiareadama2005@gmail.com',
  'adamathiare',
  'Adama Thiaré',
  'etudiant',
  'ETU016',
  '',
  TRUE,
  '2026-10-08T14:00:35.311016Z',
  '2026-11-10T22:49:35.187607Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'fb3c536f-2e45-47d6-8a16-adc1228fcfda',
  'authenticated',
  'authenticated',
  'ndiaye.diarra7@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-08T13:58:31.162057Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","date_expiration_paiement":"2026-12-12T23:59:59.000Z","date_validation_paiement":"2026-11-11T22:25:53.734Z","email_verified":true,"filiere":"MPI","full_name":"Mame diarra Ndiaye ","is_active":true,"matricule":"ETU015","niveau":"L1","original_username":"maryam","role":"etudiant","statut_inscription":"valide","statut_paiement":"a_jour","username":"maryam"}'::jsonb,
  '2026-10-08T13:58:31.159249Z',
  '2026-11-11T22:25:54.003007Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'fb3c536f-2e45-47d6-8a16-adc1228fcfda',
  'fb3c536f-2e45-47d6-8a16-adc1228fcfda',
  'fb3c536f-2e45-47d6-8a16-adc1228fcfda',
  json_build_object('sub', 'fb3c536f-2e45-47d6-8a16-adc1228fcfda', 'email', 'ndiaye.diarra7@uam.edu.sn')::jsonb,
  'email',
  '2026-10-08T13:58:31.162057Z',
  '2026-10-08T13:58:31.159249Z',
  '2026-11-11T22:25:54.003007Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'fb3c536f-2e45-47d6-8a16-adc1228fcfda',
  'ndiaye.diarra7@uam.edu.sn',
  'maryam',
  'Mame diarra Ndiaye ',
  'etudiant',
  'ETU015',
  '',
  TRUE,
  '2026-10-08T13:58:31.159249Z',
  '2026-11-11T22:25:54.003007Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'e05c149c-3177-45e0-8aef-2b9e8c735316',
  'authenticated',
  'authenticated',
  'fd15122006@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-08T13:58:30.721631Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"fatou diouf","is_active":true,"matricule":"ETU014","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"fdiouf"}'::jsonb,
  '2026-10-08T13:58:30.705672Z',
  '2026-11-10T22:37:13.325243Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'e05c149c-3177-45e0-8aef-2b9e8c735316',
  'e05c149c-3177-45e0-8aef-2b9e8c735316',
  'e05c149c-3177-45e0-8aef-2b9e8c735316',
  json_build_object('sub', 'e05c149c-3177-45e0-8aef-2b9e8c735316', 'email', 'fd15122006@gmail.com')::jsonb,
  'email',
  '2026-10-08T13:58:30.721631Z',
  '2026-10-08T13:58:30.705672Z',
  '2026-11-10T22:37:13.325243Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'e05c149c-3177-45e0-8aef-2b9e8c735316',
  'fd15122006@gmail.com',
  'fdiouf',
  'fatou diouf',
  'etudiant',
  'ETU014',
  '',
  TRUE,
  '2026-10-08T13:58:30.705672Z',
  '2026-11-10T22:37:13.325243Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c90d8eaf-b2e2-4c72-85a2-7ff1fa5fbad7',
  'authenticated',
  'authenticated',
  'aichaba221b@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-08T13:52:34.58652Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Aïssatou sow ba","is_active":true,"matricule":"ETU013","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"aicha"}'::jsonb,
  '2026-10-08T13:52:34.580104Z',
  '2026-11-12T10:47:07.285869Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'c90d8eaf-b2e2-4c72-85a2-7ff1fa5fbad7',
  'c90d8eaf-b2e2-4c72-85a2-7ff1fa5fbad7',
  'c90d8eaf-b2e2-4c72-85a2-7ff1fa5fbad7',
  json_build_object('sub', 'c90d8eaf-b2e2-4c72-85a2-7ff1fa5fbad7', 'email', 'aichaba221b@gmail.com')::jsonb,
  'email',
  '2026-10-08T13:52:34.58652Z',
  '2026-10-08T13:52:34.580104Z',
  '2026-11-12T10:47:07.285869Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'c90d8eaf-b2e2-4c72-85a2-7ff1fa5fbad7',
  'aichaba221b@gmail.com',
  'aicha',
  'Aïssatou sow ba',
  'etudiant',
  'ETU013',
  '',
  TRUE,
  '2026-10-08T13:52:34.580104Z',
  '2026-11-12T10:47:07.285869Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '4e6e708e-6f7a-488c-aaaa-6b134d9487e7',
  'authenticated',
  'authenticated',
  'lilolise19@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-08T13:51:35.743729Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Eugène Ambroise Badji ","is_active":true,"matricule":"ETU012","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"kaiserolise19"}'::jsonb,
  '2026-10-08T13:51:35.737499Z',
  '2026-10-22T19:42:34.139964Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '4e6e708e-6f7a-488c-aaaa-6b134d9487e7',
  '4e6e708e-6f7a-488c-aaaa-6b134d9487e7',
  '4e6e708e-6f7a-488c-aaaa-6b134d9487e7',
  json_build_object('sub', '4e6e708e-6f7a-488c-aaaa-6b134d9487e7', 'email', 'lilolise19@gmail.com')::jsonb,
  'email',
  '2026-10-08T13:51:35.743729Z',
  '2026-10-08T13:51:35.737499Z',
  '2026-10-22T19:42:34.139964Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '4e6e708e-6f7a-488c-aaaa-6b134d9487e7',
  'lilolise19@gmail.com',
  'kaiserolise19',
  'Eugène Ambroise Badji ',
  'etudiant',
  'ETU012',
  '',
  TRUE,
  '2026-10-08T13:51:35.737499Z',
  '2026-10-22T19:42:34.139964Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '5593c977-dd8a-46d5-998f-a519cec437ef',
  'authenticated',
  'authenticated',
  'amadoubarro85@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-08T13:50:10.092912Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"AMADOU BARRO","is_active":true,"matricule":"ETU011","niveau":"L1","role":"etudiant","statut_inscription":"valide","username":"amadoubarro"}'::jsonb,
  '2026-10-08T13:50:10.089219Z',
  '2026-11-10T20:06:37.319866Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '5593c977-dd8a-46d5-998f-a519cec437ef',
  '5593c977-dd8a-46d5-998f-a519cec437ef',
  '5593c977-dd8a-46d5-998f-a519cec437ef',
  json_build_object('sub', '5593c977-dd8a-46d5-998f-a519cec437ef', 'email', 'amadoubarro85@gmail.com')::jsonb,
  'email',
  '2026-10-08T13:50:10.092912Z',
  '2026-10-08T13:50:10.089219Z',
  '2026-11-10T20:06:37.319866Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '5593c977-dd8a-46d5-998f-a519cec437ef',
  'amadoubarro85@gmail.com',
  'amadoubarro',
  'AMADOU BARRO',
  'etudiant',
  'ETU011',
  '',
  TRUE,
  '2026-10-08T13:50:10.089219Z',
  '2026-11-10T20:06:37.319866Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '776e3680-4acc-4641-81dc-3e1958e749ee',
  'authenticated',
  'authenticated',
  'fiafatima346@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-08T13:49:56.805655Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-SML","email_verified":true,"filiere":"SML","full_name":"Fatimata dia","is_active":true,"matricule":"ETU010","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"dia"}'::jsonb,
  '2026-10-08T13:49:56.77502Z',
  '2026-11-11T17:16:52.337917Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '776e3680-4acc-4641-81dc-3e1958e749ee',
  '776e3680-4acc-4641-81dc-3e1958e749ee',
  '776e3680-4acc-4641-81dc-3e1958e749ee',
  json_build_object('sub', '776e3680-4acc-4641-81dc-3e1958e749ee', 'email', 'fiafatima346@gmail.com')::jsonb,
  'email',
  '2026-10-08T13:49:56.805655Z',
  '2026-10-08T13:49:56.77502Z',
  '2026-11-11T17:16:52.337917Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '776e3680-4acc-4641-81dc-3e1958e749ee',
  'fiafatima346@gmail.com',
  'dia',
  'Fatimata dia',
  'etudiant',
  'ETU010',
  '',
  TRUE,
  '2026-10-08T13:49:56.77502Z',
  '2026-11-11T17:16:52.337917Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '3b2aca0a-d840-40a8-87aa-9ef6b6c7a59a',
  'authenticated',
  'authenticated',
  'aminabaye13@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-08T13:49:09.748197Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Amina Soumare","is_active":true,"matricule":"ETU009","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"amina.smr"}'::jsonb,
  '2026-10-08T13:49:09.744861Z',
  '2026-11-05T23:07:12.932958Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '3b2aca0a-d840-40a8-87aa-9ef6b6c7a59a',
  '3b2aca0a-d840-40a8-87aa-9ef6b6c7a59a',
  '3b2aca0a-d840-40a8-87aa-9ef6b6c7a59a',
  json_build_object('sub', '3b2aca0a-d840-40a8-87aa-9ef6b6c7a59a', 'email', 'aminabaye13@gmail.com')::jsonb,
  'email',
  '2026-10-08T13:49:09.748197Z',
  '2026-10-08T13:49:09.744861Z',
  '2026-11-05T23:07:12.932958Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '3b2aca0a-d840-40a8-87aa-9ef6b6c7a59a',
  'aminabaye13@gmail.com',
  'amina.smr',
  'Amina Soumare',
  'etudiant',
  'ETU009',
  '',
  TRUE,
  '2026-10-08T13:49:09.744861Z',
  '2026-11-05T23:07:12.932958Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '56b4b793-b911-43fa-ab9a-5798072bd318',
  'authenticated',
  'authenticated',
  'ndeyeaidatall61@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-08T13:47:58.592306Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Ndeye Aïda tall ","is_active":true,"matricule":"ETU008","niveau":"L2","role":"etudiant","statut_inscription":"valide","username":"tall2005"}'::jsonb,
  '2026-10-08T13:47:58.584019Z',
  '2026-11-11T10:42:31.181577Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '56b4b793-b911-43fa-ab9a-5798072bd318',
  '56b4b793-b911-43fa-ab9a-5798072bd318',
  '56b4b793-b911-43fa-ab9a-5798072bd318',
  json_build_object('sub', '56b4b793-b911-43fa-ab9a-5798072bd318', 'email', 'ndeyeaidatall61@gmail.com')::jsonb,
  'email',
  '2026-10-08T13:47:58.592306Z',
  '2026-10-08T13:47:58.584019Z',
  '2026-11-11T10:42:31.181577Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '56b4b793-b911-43fa-ab9a-5798072bd318',
  'ndeyeaidatall61@gmail.com',
  'tall2005',
  'Ndeye Aïda tall ',
  'etudiant',
  'ETU008',
  '',
  TRUE,
  '2026-10-08T13:47:58.584019Z',
  '2026-11-11T10:42:31.181577Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'eac941ca-892b-4b8b-ac84-a15d41cfd86f',
  'authenticated',
  'authenticated',
  'malickniang5010@gmail.com',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-08T13:47:52.251843Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L2-MPI","email_verified":true,"filiere":"MPI","full_name":"Malick Soyibou Niang ","is_active":true,"matricule":"ETU007","niveau":"L2","phone":"+221 77 2944334","role":"etudiant","statut_inscription":"valide","username":"milk"}'::jsonb,
  '2026-10-08T13:47:52.217145Z',
  '2026-11-12T07:03:31.359025Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'eac941ca-892b-4b8b-ac84-a15d41cfd86f',
  'eac941ca-892b-4b8b-ac84-a15d41cfd86f',
  'eac941ca-892b-4b8b-ac84-a15d41cfd86f',
  json_build_object('sub', 'eac941ca-892b-4b8b-ac84-a15d41cfd86f', 'email', 'malickniang5010@gmail.com')::jsonb,
  'email',
  '2026-10-08T13:47:52.251843Z',
  '2026-10-08T13:47:52.217145Z',
  '2026-11-12T07:03:31.359025Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'eac941ca-892b-4b8b-ac84-a15d41cfd86f',
  'malickniang5010@gmail.com',
  'milk',
  'Malick Soyibou Niang ',
  'etudiant',
  'ETU007',
  '',
  TRUE,
  '2026-10-08T13:47:52.217145Z',
  '2026-11-12T07:03:31.359025Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'e07a4dfb-8c6b-4e32-8746-fdbac02a22a3',
  'authenticated',
  'authenticated',
  'samb.papa@uam.edu.sn',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-07T04:16:25.483667Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"classe":"L1-MPI","email_verified":true,"filiere":"MPI","full_name":"Papa Ibrahima SAMB ","is_active":true,"matricule":"ETU002","niveau":"L1","phone":"+221 75 650 20 17","role":"etudiant","statut_inscription":"valide","username":"pis"}'::jsonb,
  '2026-10-07T04:16:25.453978Z',
  '2026-11-12T10:36:13.15743Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'e07a4dfb-8c6b-4e32-8746-fdbac02a22a3',
  'e07a4dfb-8c6b-4e32-8746-fdbac02a22a3',
  'e07a4dfb-8c6b-4e32-8746-fdbac02a22a3',
  json_build_object('sub', 'e07a4dfb-8c6b-4e32-8746-fdbac02a22a3', 'email', 'samb.papa@uam.edu.sn')::jsonb,
  'email',
  '2026-10-07T04:16:25.483667Z',
  '2026-10-07T04:16:25.453978Z',
  '2026-11-12T10:36:13.15743Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'e07a4dfb-8c6b-4e32-8746-fdbac02a22a3',
  'samb.papa@uam.edu.sn',
  'pis',
  'Papa Ibrahima SAMB ',
  'etudiant',
  'ETU002',
  '',
  TRUE,
  '2026-10-07T04:16:25.453978Z',
  '2026-11-12T10:36:13.15743Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b3624bdb-2544-4995-989d-fc38e478d256',
  'authenticated',
  'authenticated',
  'kalidou.ba@has-academie.online',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-02T21:16:01.541604Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"email_verified":true,"full_name":"Kalidou Ba","role":"professeur","username":"kalidou"}'::jsonb,
  '2026-10-02T21:16:01.537189Z',
  '2026-10-02T21:18:06.382005Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'b3624bdb-2544-4995-989d-fc38e478d256',
  'b3624bdb-2544-4995-989d-fc38e478d256',
  'b3624bdb-2544-4995-989d-fc38e478d256',
  json_build_object('sub', 'b3624bdb-2544-4995-989d-fc38e478d256', 'email', 'kalidou.ba@has-academie.online')::jsonb,
  'email',
  '2026-10-02T21:16:01.541604Z',
  '2026-10-02T21:16:01.537189Z',
  '2026-10-02T21:18:06.382005Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'b3624bdb-2544-4995-989d-fc38e478d256',
  'kalidou.ba@has-academie.online',
  'kalidou',
  'Kalidou Ba',
  'professeur',
  '',
  '',
  TRUE,
  '2026-10-02T21:16:01.537189Z',
  '2026-10-02T21:18:06.382005Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '5bfff82c-62a6-48d4-801f-9e9ac5421df5',
  'authenticated',
  'authenticated',
  'pape.thiam@has-academie.online',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-02T21:16:01.357554Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"bio":"Ingénieur Informatique, initiation à la programmation Python et Langage C.","email_verified":true,"full_name":"Pape Thiam","phone":"+221 78 731 84 27","role":"professeur","specialite":"Informatique","username":"pape"}'::jsonb,
  '2026-10-02T21:16:01.354729Z',
  '2026-11-09T00:14:18.614336Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '5bfff82c-62a6-48d4-801f-9e9ac5421df5',
  '5bfff82c-62a6-48d4-801f-9e9ac5421df5',
  '5bfff82c-62a6-48d4-801f-9e9ac5421df5',
  json_build_object('sub', '5bfff82c-62a6-48d4-801f-9e9ac5421df5', 'email', 'pape.thiam@has-academie.online')::jsonb,
  'email',
  '2026-10-02T21:16:01.357554Z',
  '2026-10-02T21:16:01.354729Z',
  '2026-11-09T00:14:18.614336Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '5bfff82c-62a6-48d4-801f-9e9ac5421df5',
  'pape.thiam@has-academie.online',
  'pape',
  'Pape Thiam',
  'professeur',
  '',
  '',
  TRUE,
  '2026-10-02T21:16:01.354729Z',
  '2026-11-09T00:14:18.614336Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '0ffa8cbd-6c98-409a-948d-0988754c1b32',
  'authenticated',
  'authenticated',
  'diop.sow@has-academie.online',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-02T21:16:01.163387Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"email_verified":true,"full_name":"El Hadji Ibrahima Diop Sow","role":"professeur","username":"diopsow"}'::jsonb,
  '2026-10-02T21:16:01.160538Z',
  '2026-10-02T21:18:06.167757Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '0ffa8cbd-6c98-409a-948d-0988754c1b32',
  '0ffa8cbd-6c98-409a-948d-0988754c1b32',
  '0ffa8cbd-6c98-409a-948d-0988754c1b32',
  json_build_object('sub', '0ffa8cbd-6c98-409a-948d-0988754c1b32', 'email', 'diop.sow@has-academie.online')::jsonb,
  'email',
  '2026-10-02T21:16:01.163387Z',
  '2026-10-02T21:16:01.160538Z',
  '2026-10-02T21:18:06.167757Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '0ffa8cbd-6c98-409a-948d-0988754c1b32',
  'diop.sow@has-academie.online',
  'diopsow',
  'El Hadji Ibrahima Diop Sow',
  'professeur',
  '',
  '',
  TRUE,
  '2026-10-02T21:16:01.160538Z',
  '2026-10-02T21:18:06.167757Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '25013b47-9a78-4f97-8552-977450abdad2',
  'authenticated',
  'authenticated',
  'ndiogou.ndiaye@has-academie.online',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-02T21:16:00.981498Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"bio":"Physicien et chimiste, spécialiste en Mécanique Analytique, thermodynamique, électromagnétisme et chimie.","email_verified":true,"full_name":"Ndiogou Ndiaye","phone":"+221 77 277 27 09","role":"professeur","specialite":"Physique","username":"ndiogou"}'::jsonb,
  '2026-10-02T21:16:00.977982Z',
  '2026-11-11T19:33:34.32679Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '25013b47-9a78-4f97-8552-977450abdad2',
  '25013b47-9a78-4f97-8552-977450abdad2',
  '25013b47-9a78-4f97-8552-977450abdad2',
  json_build_object('sub', '25013b47-9a78-4f97-8552-977450abdad2', 'email', 'ndiogou.ndiaye@has-academie.online')::jsonb,
  'email',
  '2026-10-02T21:16:00.981498Z',
  '2026-10-02T21:16:00.977982Z',
  '2026-11-11T19:33:34.32679Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '25013b47-9a78-4f97-8552-977450abdad2',
  'ndiogou.ndiaye@has-academie.online',
  'ndiogou',
  'Ndiogou Ndiaye',
  'professeur',
  '',
  '',
  TRUE,
  '2026-10-02T21:16:00.977982Z',
  '2026-11-11T19:33:34.32679Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '32e74ddd-3e79-410a-8a87-4bfdff1fc099',
  'authenticated',
  'authenticated',
  'ibrahima.anne@has-academie.online',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-02T21:16:00.797884Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"email_verified":true,"full_name":"Ibrahima Anne","role":"professeur","username":"ibusaki"}'::jsonb,
  '2026-10-02T21:16:00.795039Z',
  '2026-10-19T17:36:27.91026Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '32e74ddd-3e79-410a-8a87-4bfdff1fc099',
  '32e74ddd-3e79-410a-8a87-4bfdff1fc099',
  '32e74ddd-3e79-410a-8a87-4bfdff1fc099',
  json_build_object('sub', '32e74ddd-3e79-410a-8a87-4bfdff1fc099', 'email', 'ibrahima.anne@has-academie.online')::jsonb,
  'email',
  '2026-10-02T21:16:00.797884Z',
  '2026-10-02T21:16:00.795039Z',
  '2026-10-19T17:36:27.91026Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '32e74ddd-3e79-410a-8a87-4bfdff1fc099',
  'ibrahima.anne@has-academie.online',
  'ibusaki',
  'Ibrahima Anne',
  'professeur',
  '',
  '',
  TRUE,
  '2026-10-02T21:16:00.795039Z',
  '2026-10-19T17:36:27.91026Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '4ca84133-856c-4e87-8ca5-31eabe0fcc23',
  'authenticated',
  'authenticated',
  'pape.samb@has-academie.online',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-10-02T21:16:00.583416Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"bio":"Directeur de l''académie et enseignant-chercheur en Mathématiques pures et appliquées. Spécialiste de l''analyse réelle, complexe et modélisation numérique stochastique.","email_verified":true,"full_name":"Pape Ibrahima Samb","phone":"+221 75 650 20 17","role":"professeur","specialite":"Math","username":"halilsamb"}'::jsonb,
  '2026-10-02T21:16:00.564827Z',
  '2026-11-11T16:14:59.363489Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '4ca84133-856c-4e87-8ca5-31eabe0fcc23',
  '4ca84133-856c-4e87-8ca5-31eabe0fcc23',
  '4ca84133-856c-4e87-8ca5-31eabe0fcc23',
  json_build_object('sub', '4ca84133-856c-4e87-8ca5-31eabe0fcc23', 'email', 'pape.samb@has-academie.online')::jsonb,
  'email',
  '2026-10-02T21:16:00.583416Z',
  '2026-10-02T21:16:00.564827Z',
  '2026-11-11T16:14:59.363489Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '4ca84133-856c-4e87-8ca5-31eabe0fcc23',
  'pape.samb@has-academie.online',
  'halilsamb',
  'Pape Ibrahima Samb',
  'professeur',
  '',
  '',
  TRUE,
  '2026-10-02T21:16:00.564827Z',
  '2026-11-11T16:14:59.363489Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token,
  recovery_token, email_change_token_new, email_change, email_change_token_current,
  phone, phone_change, phone_change_token, reauthentication_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b4f9e070-f403-40eb-97df-9a79f491e999',
  'authenticated',
  'authenticated',
  'halil@has-academie.online',
  '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im',
  '2026-09-29T13:56:58.689628Z',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"email_verified":true,"full_name":"Administration HAS","is_active":true,"matricule":"ADM001","role":"admin","username":"halil"}'::jsonb,
  '2026-09-29T13:42:28.120492Z',
  '2026-11-12T01:02:15.490992Z',
  '', '', '', '', '', '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmation_token = COALESCE(auth.users.confirmation_token, ''),
  recovery_token = COALESCE(auth.users.recovery_token, ''),
  email_change_token_new = COALESCE(auth.users.email_change_token_new, ''),
  email_change = COALESCE(auth.users.email_change, ''),
  phone = COALESCE(auth.users.phone, ''),
  phone_change = COALESCE(auth.users.phone_change, ''),
  phone_change_token = COALESCE(auth.users.phone_change_token, ''),
  email_change_token_current = COALESCE(auth.users.email_change_token_current, ''),
  reauthentication_token = COALESCE(auth.users.reauthentication_token, '');

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  'b4f9e070-f403-40eb-97df-9a79f491e999',
  'b4f9e070-f403-40eb-97df-9a79f491e999',
  'b4f9e070-f403-40eb-97df-9a79f491e999',
  json_build_object('sub', 'b4f9e070-f403-40eb-97df-9a79f491e999', 'email', 'halil@has-academie.online')::jsonb,
  'email',
  '2026-09-29T13:56:58.689628Z',
  '2026-09-29T13:42:28.120492Z',
  '2026-11-12T01:02:15.490992Z'
) ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  'b4f9e070-f403-40eb-97df-9a79f491e999',
  'halil@has-academie.online',
  'halil',
  'Administration HAS',
  'admin',
  'ADM001',
  '',
  TRUE,
  '2026-09-29T13:42:28.120492Z',
  '2026-11-12T01:02:15.490992Z'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;


-- Sécurité GoTrue : s'assurer qu'aucune colonne interne auth.users n'est NULL (évite l'erreur 'Database error querying schema')
UPDATE auth.users 
SET 
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change = COALESCE(email_change, ''),
  phone = COALESCE(phone, ''),
  phone_change = COALESCE(phone_change, ''),
  phone_change_token = COALESCE(phone_change_token, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  reauthentication_token = COALESCE(reauthentication_token, '')
;

-- Autoriser la lecture de profiles pour la résolution fluide des logins et identifiants
DROP POLICY IF EXISTS "public_read_profiles" ON public.profiles;
CREATE POLICY "public_read_profiles" ON public.profiles FOR SELECT USING (true);

-- ==============================================================================
-- B. RESTAURATION DES TABLES RELATIONNELLES HAS
-- ==============================================================================

-- >>> roles.sql <<<
-- ============================================================
-- Données sauvegardées pour : roles (3 lignes)
-- ============================================================

INSERT INTO "roles" ("id", "nom") VALUES (1, 'admin') ON CONFLICT DO NOTHING;
INSERT INTO "roles" ("id", "nom") VALUES (2, 'enseignant') ON CONFLICT DO NOTHING;
INSERT INTO "roles" ("id", "nom") VALUES (3, 'etudiant') ON CONFLICT DO NOTHING;

-- >>> filieres.sql <<<
-- ============================================================
-- Données sauvegardées pour : filieres (3 lignes)
-- ============================================================

INSERT INTO "filieres" ("id", "nom", "description") VALUES (1, 'MPI', 'Mathématiques, Physique et Informatique — Formation fondamentale et modélisation scientifique.') ON CONFLICT DO NOTHING;
INSERT INTO "filieres" ("id", "nom", "description") VALUES (2, 'SML', 'Sciences de la Mer et du Littoral — Océanographie physique, biologie marine et environnement.') ON CONFLICT DO NOTHING;
INSERT INTO "filieres" ("id", "nom", "description") VALUES (3, 'MIASS', 'Mathématiques et Informatique Appliquées aux Sciences Sociales — Statistiques, analyse de données et économétrie.') ON CONFLICT DO NOTHING;

-- >>> classes.sql <<<
-- ============================================================
-- Données sauvegardées pour : classes (6 lignes)
-- ============================================================

INSERT INTO "classes" ("id", "filiere_id", "nom", "niveau") VALUES (1, 1, 'L1 MPI', 'Licence 1') ON CONFLICT DO NOTHING;
INSERT INTO "classes" ("id", "filiere_id", "nom", "niveau") VALUES (2, 1, 'L2 MPI', 'Licence 2') ON CONFLICT DO NOTHING;
INSERT INTO "classes" ("id", "filiere_id", "nom", "niveau") VALUES (3, 2, 'L1 SML', 'Licence 1') ON CONFLICT DO NOTHING;
INSERT INTO "classes" ("id", "filiere_id", "nom", "niveau") VALUES (4, 2, 'L2 SML', 'Licence 2') ON CONFLICT DO NOTHING;
INSERT INTO "classes" ("id", "filiere_id", "nom", "niveau") VALUES (5, 3, 'L1 MIASS', 'Licence 1') ON CONFLICT DO NOTHING;
INSERT INTO "classes" ("id", "filiere_id", "nom", "niveau") VALUES (6, 3, 'L2 MIASS', 'Licence 2') ON CONFLICT DO NOTHING;

-- >>> matieres.sql <<<
-- ============================================================
-- Données sauvegardées pour : matieres (20 lignes)
-- ============================================================

INSERT INTO "matieres" ("id", "nom") VALUES (1, 'Programmation Orientée Objet Python') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (2, 'Base de données') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (3, 'Mécanique Générale') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (4, 'Analyse 3') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (5, 'Algèbre 3') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (6, 'Thermodynamique') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (7, 'Analyse Numérique Matricielle') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (8, 'Economie') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (9, 'Analyse 1') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (10, 'Algèbre 1') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (11, 'Programmation Python') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (12, 'Mécanique du point') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (13, 'Electricité') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (14, 'Economie Générale') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (15, 'Analyse 2') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (16, 'Algèbre 2') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (17, 'Magnétostatique et Régime Variable') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (18, 'Optique Géométrique') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (19, 'Langage C') ON CONFLICT DO NOTHING;
INSERT INTO "matieres" ("id", "nom") VALUES (20, 'Finance des entreprises') ON CONFLICT DO NOTHING;

-- >>> matiere_classe.sql <<<
-- ============================================================
-- Données sauvegardées pour : matiere_classe (44 lignes)
-- ============================================================

INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (1, 2) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (1, 4) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (1, 6) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (2, 2) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (3, 2) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (3, 4) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (4, 2) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (4, 4) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (4, 6) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (5, 2) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (5, 4) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (5, 6) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (6, 2) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (6, 4) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (7, 2) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (7, 4) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (8, 6) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (9, 1) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (9, 3) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (9, 5) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (10, 1) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (10, 3) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (10, 5) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (11, 1) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (11, 3) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (11, 5) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (12, 1) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (12, 3) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (13, 1) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (13, 3) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (14, 5) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (15, 1) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (15, 3) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (15, 5) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (16, 1) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (16, 3) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (16, 5) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (17, 1) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (17, 3) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (18, 1) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (18, 3) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (19, 1) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (19, 3) ON CONFLICT DO NOTHING;
INSERT INTO "matiere_classe" ("matiere_id", "classe_id") VALUES (19, 5) ON CONFLICT DO NOTHING;

-- >>> users.sql <<<
-- ============================================================
-- Données sauvegardées pour : users (12 lignes)
-- ============================================================

INSERT INTO "users" ("id", "role_id", "login", "password_hash", "nom", "prenom", "telephone", "email", "photo", "two_factor_enabled", "two_factor_code", "two_factor_expires_at") VALUES (1, 1, 'admin', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Samb', 'Pape Ibrahima', '756502017', 'admin@has.sn', 'uploads/profils/directeur.jpg', FALSE, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO "users" ("id", "role_id", "login", "password_hash", "nom", "prenom", "telephone", "email", "photo", "two_factor_enabled", "two_factor_code", "two_factor_expires_at") VALUES (2, 2, 'papa', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Samb', 'Pape Ibrahima', '756502017', 'papa.samb@has.sn', 'uploads/profs/photo_2026-07-20_16-18-59_2.jpg', FALSE, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO "users" ("id", "role_id", "login", "password_hash", "nom", "prenom", "telephone", "email", "photo", "two_factor_enabled", "two_factor_code", "two_factor_expires_at") VALUES (3, 2, 'ibou', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Anne', 'Ibrahima', '775518196', 'ibrahima.anne@has.sn', 'uploads/profs/ibrahima.jpg', FALSE, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO "users" ("id", "role_id", "login", "password_hash", "nom", "prenom", "telephone", "email", "photo", "two_factor_enabled", "two_factor_code", "two_factor_expires_at") VALUES (4, 2, 'ndiogou', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Ndiaye', 'Ndiogou', '772772709', 'ndiogou.ndiaye@has.sn', 'uploads/profs/photo_2026-07-20_16-46-11_2.jpg', FALSE, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO "users" ("id", "role_id", "login", "password_hash", "nom", "prenom", "telephone", "email", "photo", "two_factor_enabled", "two_factor_code", "two_factor_expires_at") VALUES (5, 2, 'diopsow', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Sow', 'El Hadji Ibrahima Diop', '776689777', 'diop.sow@has.sn', 'uploads/profs/photo_2026-07-20_16-29-37.jpg', FALSE, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO "users" ("id", "role_id", "login", "password_hash", "nom", "prenom", "telephone", "email", "photo", "two_factor_enabled", "two_factor_code", "two_factor_expires_at") VALUES (6, 2, 'papethiam', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Thiam', 'Pape', '787318427', 'pape.thiam@has.sn', NULL, FALSE, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO "users" ("id", "role_id", "login", "password_hash", "nom", "prenom", "telephone", "email", "photo", "two_factor_enabled", "two_factor_code", "two_factor_expires_at") VALUES (7, 2, 'kalidou', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Ba', 'Kalidou', '782718397', 'kalidou.ba@has.sn', NULL, FALSE, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO "users" ("id", "role_id", "login", "password_hash", "nom", "prenom", "telephone", "email", "photo", "two_factor_enabled", "two_factor_code", "two_factor_expires_at") VALUES (10, 3, 'etudiant_has', '-', 'Étudiant', 'HAS', NULL, 'etudiant@has.sn', NULL, FALSE, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO "users" ("id", "role_id", "login", "password_hash", "nom", "prenom", "telephone", "email", "photo", "two_factor_enabled", "two_factor_code", "two_factor_expires_at") VALUES (12, 3, 'etu_anne', '-', 'Anne', 'Ibrahima', NULL, 'anneibrahima2005@gmail.com', NULL, FALSE, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO "users" ("id", "role_id", "login", "password_hash", "nom", "prenom", "telephone", "email", "photo", "two_factor_enabled", "two_factor_code", "two_factor_expires_at") VALUES (13, 3, 'halil_has', '-', 'Samb', 'Papa ibrahima', NULL, 'halilalibrahima@gmail.com', NULL, FALSE, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO "users" ("id", "role_id", "login", "password_hash", "nom", "prenom", "telephone", "email", "photo", "two_factor_enabled", "two_factor_code", "two_factor_expires_at") VALUES (14, 2, 'mamour', '.im', 'Diop', 'El Hadji Mamour Seynabou', '776689777', 'mamour@has.sn', NULL, FALSE, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO "users" ("id", "role_id", "login", "password_hash", "nom", "prenom", "telephone", "email", "photo", "two_factor_enabled", "two_factor_code", "two_factor_expires_at") VALUES (15, 2, 'kady', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Ba', 'Papa Kady', '770000000', 'kady.ba@has-academie.online', NULL, FALSE, NULL, NULL) ON CONFLICT DO NOTHING;

-- >>> enseignants.sql <<<
-- ============================================================
-- Données sauvegardées pour : enseignants (8 lignes)
-- ============================================================

INSERT INTO "enseignants" ("id", "user_id", "filiere_id", "biographie") VALUES (1, 2, 3, 'Enseignant-chercheur en Mathématiques et Modélisation stochastique') ON CONFLICT DO NOTHING;
INSERT INTO "enseignants" ("id", "user_id", "filiere_id", "biographie") VALUES (2, 3, 3, 'Spécialiste en Génie Logiciel, Algorithmique et Programmation') ON CONFLICT DO NOTHING;
INSERT INTO "enseignants" ("id", "user_id", "filiere_id", "biographie") VALUES (3, 4, 1, 'Physicien, spécialiste en Mécanique Analytique et Thermodynamique') ON CONFLICT DO NOTHING;
INSERT INTO "enseignants" ("id", "user_id", "filiere_id", "biographie") VALUES (4, 5, 1, 'Enseignant en Physique Appliquée et Ondes') ON CONFLICT DO NOTHING;
INSERT INTO "enseignants" ("id", "user_id", "filiere_id", "biographie") VALUES (5, 6, 3, 'Ingénieur Informatique, architectures Web et Systèmes') ON CONFLICT DO NOTHING;
INSERT INTO "enseignants" ("id", "user_id", "filiere_id", "biographie") VALUES (6, 7, 1, 'Professeur de Sciences Physiques et Électromagnétisme') ON CONFLICT DO NOTHING;
INSERT INTO "enseignants" ("id", "user_id", "filiere_id", "biographie") VALUES (7, 14, 3, 'Enseignant en Finance des entreprises, Gestion financière et Économie pour la filière MIASS.') ON CONFLICT DO NOTHING;
INSERT INTO "enseignants" ("id", "user_id", "filiere_id", "biographie") VALUES (8, 15, 1, 'Professeur de Mathématiques - Nouveaux Bacheliers (NB)') ON CONFLICT DO NOTHING;

-- >>> enseignant_filiere.sql <<<
-- ============================================================
-- Données sauvegardées pour : enseignant_filiere (19 lignes)
-- ============================================================

INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (1, 1) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (1, 2) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (1, 3) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (2, 1) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (2, 2) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (2, 3) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (3, 1) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (3, 2) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (4, 1) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (4, 2) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (5, 1) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (5, 2) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (5, 3) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (6, 1) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (6, 2) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (7, 3) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (8, 1) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (8, 2) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_filiere" ("enseignant_id", "filiere_id") VALUES (8, 3) ON CONFLICT DO NOTHING;

-- >>> enseignant_matiere.sql <<<
-- ============================================================
-- Données sauvegardées pour : enseignant_matiere (25 lignes)
-- ============================================================

INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (1, 4) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (1, 5) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (1, 7) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (1, 9) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (1, 10) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (1, 15) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (1, 16) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (2, 1) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (2, 2) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (3, 6) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (3, 12) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (3, 17) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (3, 18) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (4, 3) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (5, 11) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (5, 19) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (6, 12) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (6, 13) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (6, 17) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (6, 18) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (7, 8) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (7, 14) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (7, 20) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (8, 9) ON CONFLICT DO NOTHING;
INSERT INTO "enseignant_matiere" ("enseignant_id", "matiere_id") VALUES (8, 10) ON CONFLICT DO NOTHING;

-- >>> emplois_du_temps.sql <<<
-- ============================================================
-- Données sauvegardées pour : emplois_du_temps (1 lignes)
-- ============================================================

INSERT INTO "emplois_du_temps" ("id", "classe_id", "titre", "fichier_pdf", "fichier_image", "date_publication", "actif") VALUES (1, 1, 'Planning Semaine L1 MPI — Semestre 1', 'uploads/edt/edt_l1_mpi.pdf', NULL, '2026-09-28', TRUE) ON CONFLICT DO NOTHING;

-- >>> cours.sql <<<
-- ============================================================
-- Données sauvegardées pour : cours (4 lignes)
-- ============================================================

INSERT INTO "cours" ("id", "titre", "description", "matiere_id", "enseignant_id", "filiere_id", "classe_id", "niveau", "lien_externe") VALUES (1, 'Introduction à la Programmation Python & Algorithmique', 'Cours fondamental sur les bases du langage Python, les structures conditionnelles, boucles et fonctions.', 11, 2, 1, 1, 'Licence 1', NULL) ON CONFLICT DO NOTHING;
INSERT INTO "cours" ("id", "titre", "description", "matiere_id", "enseignant_id", "filiere_id", "classe_id", "niveau", "lien_externe") VALUES (2, 'Analyse 1 : Suites numériques et Continuité', 'Définition des limites, théorèmes de comparaison, fonctions continues et dérivabilité.', 9, 1, 1, 1, 'Licence 1', NULL) ON CONFLICT DO NOTHING;
INSERT INTO "cours" ("id", "titre", "description", "matiere_id", "enseignant_id", "filiere_id", "classe_id", "niveau", "lien_externe") VALUES (3, 'Mécanique du Point Matériel', 'Cinématique, lois de Newton, oscillateurs harmoniques et travail-énergie.', 12, 3, 1, 1, 'Licence 1', NULL) ON CONFLICT DO NOTHING;
INSERT INTO "cours" ("id", "titre", "description", "matiere_id", "enseignant_id", "filiere_id", "classe_id", "niveau", "lien_externe") VALUES (4, 'Algèbre Linéaire 1 : Espaces Vectoriels', 'Sous-espaces vectoriels, familles génératrices, bases et dimensions.', 10, 1, 1, 1, 'Licence 1', NULL) ON CONFLICT DO NOTHING;

-- >>> fichiers_cours.sql <<<
-- ============================================================
-- Données sauvegardées pour : fichiers_cours (3 lignes)
-- ============================================================

INSERT INTO "fichiers_cours" ("id", "cours_id", "type_fichier", "nom_original", "chemin_fichier") VALUES (1, 1, 'pdf', 'Support_Python_Chapitre1.pdf', 'uploads/cours/Support_Python_Chapitre1.pdf') ON CONFLICT DO NOTHING;
INSERT INTO "fichiers_cours" ("id", "cours_id", "type_fichier", "nom_original", "chemin_fichier") VALUES (2, 2, 'pdf', 'TD_Analyse_1_Suites.pdf', 'uploads/cours/TD_Analyse_1_Suites.pdf') ON CONFLICT DO NOTHING;
INSERT INTO "fichiers_cours" ("id", "cours_id", "type_fichier", "nom_original", "chemin_fichier") VALUES (3, 3, 'pdf', 'Exercices_Mecanique_Point.pdf', 'uploads/cours/Exercices_Mecanique_Point.pdf') ON CONFLICT DO NOTHING;

-- >>> communiques.sql <<<
-- ============================================================
-- Données sauvegardées pour : communiques (2 lignes)
-- ============================================================

INSERT INTO "communiques" ("id", "titre", "contenu", "image", "fichier_pdf", "auteur_id", "mis_en_avant", "archive", "date_publication") VALUES (1, 'Bienvenue sur la plateforme académique HAS', 'Chers étudiants et professeurs, nous sommes ravis de vous accueillir sur votre nouvel espace numérique dédié aux cours, emplois du temps et communiqués officiels.', NULL, NULL, 1, TRUE, FALSE, '2026-09-28') ON CONFLICT DO NOTHING;
INSERT INTO "communiques" ("id", "titre", "contenu", "image", "fichier_pdf", "auteur_id", "mis_en_avant", "archive", "date_publication") VALUES (2, 'Début des sessions de renforcement intensif', 'Les cours de renforcement en Analyse, Algèbre et Programmation débuteront dès lundi prochain à 09h00 selon le planning affiché dans votre espace.', NULL, NULL, 1, TRUE, FALSE, '2026-09-28') ON CONFLICT DO NOTHING;

-- >>> chat_messages.sql <<<
-- ============================================================
-- Données sauvegardées pour : chat_messages (7 lignes)
-- ============================================================

INSERT INTO "chat_messages" ("id", "user_id", "message", "created_at") VALUES (42, 1, '[[salon:salon-l1]] [[sender:64e8a6b0-974d-40f9-ad36-442b3f2ccbc6||Cheikh Fall ||etudiant||fall.cheikh2@uam.edu.sn||]] Platform extraordinaire 👏👏👏', '2026-10-14T16:12:35.576313+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "chat_messages" ("id", "user_id", "message", "created_at") VALUES (43, 1, '[[salon:salon-l1]] [[sender:64e8a6b0-974d-40f9-ad36-442b3f2ccbc6||Cheikh Fall ||etudiant||fall.cheikh2@uam.edu.sn||]] Donc d''après l''emploi du temps, ce soir on a cours de langage C nous les L1 MPI ???', '2026-10-14T16:13:53.949177+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "chat_messages" ("id", "user_id", "message", "created_at") VALUES (44, 1, '[[salon:salon-l1]] [[sender:5bfff82c-62a6-48d4-801f-9e9ac5421df5||Pape Thiam||professeur||pape.thiam@has-academie.online||]] Salam a tous, oui effectuvement vous aurez langage C', '2026-10-14T19:37:16.175438+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "chat_messages" ("id", "user_id", "message", "created_at") VALUES (45, 1, '[[salon:salon-l1]] [[sender:e07a4dfb-8c6b-4e32-8746-fdbac02a22a3||Papa Ibrahima SAMB ||etudiant||samb.papa@uam.edu.sn||]] Bonjour', '2026-10-17T15:37:51.592584+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "chat_messages" ("id", "user_id", "message", "created_at") VALUES (46, 1, '[[salon:salon-l1]] [[sender:e07a4dfb-8c6b-4e32-8746-fdbac02a22a3||Papa Ibrahima SAMB ||etudiant||samb.papa@uam.edu.sn||]] cv', '2026-10-24T16:17:01.310307+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "chat_messages" ("id", "user_id", "message", "created_at") VALUES (47, 1, '[[salon:salon-l1]] [[sender:e07a4dfb-8c6b-4e32-8746-fdbac02a22a3||Papa Ibrahima SAMB ||etudiant||samb.papa@uam.edu.sn||]] [[voice:data:audio/mp4;codecs=opus;base64,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]]', '2026-10-24T16:17:08.401386+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "chat_messages" ("id", "user_id", "message", "created_at") VALUES (48, 1, '[[salon:salon-nb]] [[sender:25013b47-9a78-4f97-8552-977450abdad2||Ndiogou Ndiaye||professeur||ndiogou.ndiaye@has-academie.online||]] Salam n''oubliez pas de bien reviser les cours avant les prochain séance.', '2026-11-05T00:02:34.754966+00:00') ON CONFLICT DO NOTHING;

-- >>> logs.sql <<<
-- ============================================================
-- Données sauvegardées pour : logs (80 lignes)
-- ============================================================

INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (3, NULL, 'TEST', NULL, '2026-10-10T14:05:06.630336') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (165, NULL, 'DEL_SEANCE:seance-has-l1-partage-info', 'deleted', '2026-10-18T17:55:09.075163') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (288, NULL, 'DEL_SEANCE:seance-has-l2-partage-info', 'deleted', '2026-10-19T14:28:30.573738') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (553, NULL, 'EDT_OFFICIAL_RESET', 'EDT officiel configure: 11 séances (L1 & L2) sans Meet.', '2026-10-19T17:16:38.754934') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (559, NULL, 'MEET:seance-has-l2-partage-info', 'https://meet.google.com/eeo-gxdq-qvv', '2026-10-19T17:26:22.06875') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (359, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par direction@halil-academie.com', '2026-10-19T16:13:15.869021') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (299, NULL, 'DEL_SEANCE:seance-1791595221209', 'deleted', '2026-10-19T14:32:09.640213') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (560, NULL, 'MEET:seance-has-l1-partage-info', 'https://meet.google.com/eeo-gxdq-qvv', '2026-10-19T17:26:22.06875') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (427, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 15 séance(s) par direction@halil-academie.com', '2026-10-19T16:24:05.016779') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (497, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 12 séance(s) par direction@halil-academie.com', '2026-10-19T16:58:47.512885') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (565, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 14 séance(s) par direction@halil-academie.com', '2026-10-19T17:26:22.248123') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (634, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 12 séance(s) par direction@halil-academie.com', '2026-10-25T17:59:02.561232') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (249, NULL, 'DEL_SEANCE:seance-has-l2-partage-info', 'deleted', '2026-10-19T14:20:07.75517') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (309, NULL, 'DEL_SEANCE:seance-1792419667954-xy1', 'deleted', '2026-10-19T14:32:16.827725') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (370, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par direction@halil-academie.com', '2026-10-19T16:13:49.888354') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (440, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 12 séance(s) par direction@halil-academie.com', '2026-10-19T16:31:00.168624') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (197, NULL, 'DEL_SEANCE:seance-1792346128241-8k3', 'deleted', '2026-10-18T17:55:35.35653') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (108, NULL, 'MEETS_RESET_ALL', 'Purge totale de tous les liens Meet. Les enseignants ajouteront leurs vrais liens Meet pour leurs cours.', '2026-10-14T00:56:08.992') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (260, NULL, 'DEL_SEANCE:seance-has-l1-partage-info', 'deleted', '2026-10-19T14:20:31.354904') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (319, NULL, 'DEL_SEANCE:seance-1792346216246-6fe', 'deleted', '2026-10-19T14:33:42.428637') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (508, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 12 séance(s) par direction@halil-academie.com', '2026-10-19T17:00:38.592175') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (830, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par pape.samb@has-academie.online', '2026-11-06T19:23:24.094774') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (381, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 12 séance(s) par direction@halil-academie.com', '2026-10-19T16:17:03.566431') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (856, NULL, 'MEET:seance-has-l2-analyse4', 'https://meet.google.com/eeo-gxdq-qvv', '2026-11-10T19:07:01.326612') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (857, NULL, 'MEET:seance-has-l2-proba', 'https://meet.google.com/nhv-qteu-wga', '2026-11-10T19:07:01.326612') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (647, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 13 séance(s) par direction@halil-academie.com', '2026-10-25T17:59:07.606128') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (858, NULL, 'MEET:seance-has-l2-chimie-org', 'https://meet.google.com/ptd-ushf-pfo', '2026-11-10T19:07:01.326612') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (859, NULL, 'MEET:seance-has-l2-chimie-inorg', 'https://meet.google.com/rfi-erbc-ogj', '2026-11-10T19:07:01.326612') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (122, NULL, 'DEL_COURSE:cr-1791977919272', 'deleted', '2026-10-14T12:54:04.667259') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (123, NULL, 'DEL_COURSE:cr-1791977809089', 'deleted', '2026-10-14T12:54:07.841852') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (124, NULL, 'DEL_COURSE:cr-1791933565513', 'deleted', '2026-10-14T12:54:10.967296') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (125, NULL, 'DEL_COURSE:cr-1791985846348', 'deleted', '2026-10-14T13:52:05.232674') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (451, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 12 séance(s) par direction@halil-academie.com', '2026-10-19T16:53:50.838324') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (127, NULL, 'DEL_COURSE:cr-1791985637548', 'deleted', '2026-10-14T13:55:21.73354') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (860, NULL, 'MEET:seance-has-l2-electromag', 'https://meet.google.com/kxx-rqyv-xha', '2026-11-10T19:07:01.326612') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (861, NULL, 'MEET:seance-has-l1-magneto', 'https://meet.google.com/zro-gapg-bvp', '2026-11-10T19:07:01.326612') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (862, NULL, 'MEET:seance-has-l1-langage-c', 'https://meet.google.com/gkp-shab-gco', '2026-11-10T19:07:01.326612') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (392, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par direction@halil-academie.com', '2026-10-19T16:18:28.348646') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (519, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 12 séance(s) par direction@halil-academie.com', '2026-10-19T17:01:30.602736') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (863, NULL, 'MEET:seance-has-l1-finance', 'https://meet.google.com/qoy-xmfm-qoj', '2026-11-10T19:07:01.326612') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (218, NULL, 'DEL_SEANCE:seance-has-l2-partage-info', 'deleted', '2026-10-18T17:56:22.964848') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (864, NULL, 'MEET:seance-has-l1-analyse2-lundi', 'https://meet.google.com/kaj-wvqs-xsk', '2026-11-10T19:07:01.326612') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (865, NULL, 'MEET:seance-1793047340744-q7a', 'https://meet.google.com/fbw-oxyv-iqm', '2026-11-10T19:07:01.326612') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (866, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par ndiogou.ndiaye@has-academie.online', '2026-11-10T19:07:01.469284') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (462, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 12 séance(s) par direction@halil-academie.com', '2026-10-19T16:55:01.812273') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (661, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 14 séance(s) par direction@halil-academie.com', '2026-10-25T17:59:33.813816') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (74, NULL, 'MEETS_RESET_ALL', 'Tous les liens Meet ont été purgés. Les profs les créeront au moment voulu.', '2026-10-14T00:47:04.855994') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (530, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 12 séance(s) par direction@halil-academie.com', '2026-10-19T17:10:35.29476') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (403, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par direction@halil-academie.com', '2026-10-19T16:18:35.855915') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (473, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 12 séance(s) par direction@halil-academie.com', '2026-10-19T16:55:20.963586') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (541, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par direction@halil-academie.com', '2026-10-19T17:12:57.386421') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (415, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 15 séance(s) par direction@halil-academie.com', '2026-10-19T16:22:08.907527') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (484, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 12 séance(s) par direction@halil-academie.com', '2026-10-19T16:57:49.757053') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (552, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par direction@halil-academie.com', '2026-10-19T17:13:00.782552') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (662, NULL, 'DEL_SEANCE:seance-1792951169521-csg', 'deleted', '2026-10-26T20:38:12.628378') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (721, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par direction@halil-academie.com', '2026-10-26T20:42:25.931333') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (796, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par direction@halil-academie.com', '2026-11-02T20:47:59.784829') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (818, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par ndiogou.ndiaye@has-academie.online', '2026-11-05T20:39:02.954571') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (742, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par direction@halil-academie.com', '2026-10-30T15:39:23.609452') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (676, NULL, 'DEL_SEANCE:seance-has-l1-algebre2-vendredi', 'deleted', '2026-10-26T20:38:25.431881') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (688, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 12 séance(s) par direction@halil-academie.com', '2026-10-26T20:38:29.154287') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (700, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par direction@halil-academie.com', '2026-10-26T20:38:40.565608') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (842, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par ndiogou.ndiaye@has-academie.online', '2026-11-07T17:48:49.195376') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (775, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par ndiogou.ndiaye@has-academie.online', '2026-10-31T20:59:52.077152') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (577, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 12 séance(s) par pape.samb@has-academie.online', '2026-10-19T20:41:43.861703') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (578, NULL, 'DEL_SEANCE:seance-has-l1-analyse2', 'deleted', '2026-10-19T20:48:25.967397') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (675, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 13 séance(s) par direction@halil-academie.com', '2026-10-26T20:38:16.667122') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (732, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par ndiogou.ndiaye@has-academie.online', '2026-10-29T20:48:33.348865') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (588, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par direction@halil-academie.com', '2026-10-19T20:48:29.68873') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (689, NULL, 'DEL_SEANCE:seance-1792951138920-ym9', 'deleted', '2026-10-26T20:38:36.77915') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (807, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par ndiogou.ndiaye@has-academie.online', '2026-11-03T21:00:03.406095') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (753, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par direction@halil-academie.com', '2026-10-30T19:31:48.773567') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (599, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par ndiogou.ndiaye@has-academie.online', '2026-10-20T20:56:03.208197') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (701, NULL, 'DEL_SEANCE:seance-1792951144653-hh4', 'deleted', '2026-10-26T20:38:41.613561') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (711, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 10 séance(s) par direction@halil-academie.com', '2026-10-26T20:38:44.71877') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (764, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par direction@halil-academie.com', '2026-10-30T19:31:54.957672') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (786, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par ndiogou.ndiaye@has-academie.online', '2026-11-01T20:31:45.660783') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (611, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par pape.samb@has-academie.online', '2026-10-23T19:27:55.278108') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (622, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par direction@halil-academie.com', '2026-10-25T17:58:53.32422') ON CONFLICT DO NOTHING;
INSERT INTO "logs" ("id", "user_id", "action", "description", "created_at") VALUES (854, NULL, 'EDT_SEANCES_SYNC', 'EDT synchronisé avec succès : 11 séance(s) par ndiogou.ndiaye@has-academie.online', '2026-11-07T20:14:00.743779') ON CONFLICT DO NOTHING;

-- >>> verification_codes.sql <<<
-- ============================================================
-- Données sauvegardées pour : verification_codes (449 lignes)
-- ============================================================

INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('3bb16e02-9f5e-4d82-b506-04945367499f', 'fatimataanne18@gmail.com', '822615', 'signup_2fa', '2026-10-08T14:48:22.869+00:00', TRUE, 0, '2026-10-08T14:38:23.153753+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('62819542-058f-46a8-9666-af611ae23a2c', 'niang.khoudia@1uam.edu.sn', '932096', 'signup_2fa', '2026-10-08T14:56:11.088+00:00', FALSE, 0, '2026-10-08T14:46:11.851958+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('6ad4c8d5-4fdf-4d29-875a-b45db6ae473d', 'jjj@gmail.com', '738552', 'signup_2fa', '2026-10-04T16:29:59.5+00:00', FALSE, 0, '2026-10-04T16:20:00.050693+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('15958cc1-a7d3-4051-b674-f136f6febb1c', 'samb.papa@uam.edu.sn', '158784', 'signup_2fa', '2026-10-07T04:24:53.464+00:00', TRUE, 0, '2026-10-07T04:14:54.062346+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('3f26a195-f7fe-4026-a0ac-999eaf5599ab', 'niang.khoudia1@uam.edu.sn', '477236', 'signup_2fa', '2026-10-08T15:00:14.992+00:00', TRUE, 0, '2026-10-08T14:50:15.62283+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('daa4ff62-b297-41df-b747-b0ee462eac42', 'nianganta852@gmail.com', '409344', 'signup_2fa', '2026-10-09T11:05:42.326+00:00', TRUE, 0, '2026-10-09T10:55:43.21855+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('ead85bc1-54b2-48f8-a36b-4f9a73e605ff', 'seyni0379@gmail.com', '125424', 'signup_2fa', '2026-10-09T18:01:30.562+00:00', TRUE, 0, '2026-10-09T17:51:31.570605+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b2256119-5e5f-4ef0-9711-bd827b61042d', 'sow.bara@uam.edu.sn', '811697', 'signup_2fa', '2026-10-09T20:36:58.318+00:00', TRUE, 0, '2026-10-09T20:26:59.267149+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('865ebe5b-b200-415d-ad59-495d4aad3bbe', 'fiafatima346@gmail.com', '887276', 'signup_2fa', '2026-10-08T13:54:55.877+00:00', TRUE, 0, '2026-10-08T13:44:56.659663+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c147d299-5c1c-40d7-adbc-dcafbfac8db3', 'malickniang5010@gmail.com', '629832', 'signup_2fa', '2026-10-08T13:55:25.927+00:00', TRUE, 0, '2026-10-08T13:45:26.474034+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('30fbfd4b-f76b-43bf-aa19-357877a02b3d', 'ndeyeaidatall61@gmail.com', '293805', 'signup_2fa', '2026-10-08T13:56:35.3+00:00', TRUE, 0, '2026-10-08T13:46:35.771108+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c2aaa037-82b1-4ba9-a0d4-239fd4d8209d', 'aminabaye13@gmail.com', '770897', 'signup_2fa', '2026-10-08T13:57:11.048+00:00', TRUE, 0, '2026-10-08T13:47:11.13247+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('be707410-51c4-4200-b033-043fcfefd7dd', 'fiafatima346@gmail.com', '101199', 'signup_2fa', '2026-10-08T13:58:44.793+00:00', TRUE, 0, '2026-10-08T13:48:44.866648+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('ac5282bd-e753-4a74-afe6-5e2e8c8439ec', 'amadoubarro85@gmail.com', '549189', 'signup_2fa', '2026-10-08T13:58:42.842+00:00', TRUE, 0, '2026-10-08T13:48:42.941317+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('cd1c063e-687b-4bde-99d6-27fa083b44c8', 'ramsessbodian34@gmail.com', '234326', 'signup_2fa', '2026-10-08T13:59:03.57+00:00', TRUE, 0, '2026-10-08T13:49:03.878233+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('e166df41-c230-4eb4-b528-13b4dcc53e33', 'aichaba221b@gmail.com', '810737', 'signup_2fa', '2026-10-08T13:59:58.827+00:00', TRUE, 0, '2026-10-08T13:49:58.889311+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('443d856b-70ad-4577-b623-37f8af2fade2', 'lilolise19@gmail.com', '798540', 'signup_2fa', '2026-10-08T14:00:22.906+00:00', TRUE, 0, '2026-10-08T13:50:23.180665+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('d8f3b097-6d2d-4098-a25e-56a7d511ce5a', 'fd15122006@gmail.com', '955073', 'signup_2fa', '2026-10-08T14:05:47.618+00:00', TRUE, 0, '2026-10-08T13:55:47.957326+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('e1f8911c-64df-477c-85a9-6498b71fbeec', 'ndiaye.diarra7@uam.edu.sn', '173710', 'signup_2fa', '2026-10-08T14:06:12.174+00:00', TRUE, 0, '2026-10-08T13:56:12.463198+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a8d09cfd-dcca-46a3-947c-ac0d73bfa310', 'thiareadama2005@gmail.com', '136546', 'signup_2fa', '2026-10-08T14:08:14.852+00:00', TRUE, 0, '2026-10-08T13:58:15.455453+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('94992a17-e9b7-4559-aec7-f298fd437414', 'xalile2007@gmail.com', '452090', 'signup_2fa', '2026-10-08T14:10:05.601+00:00', TRUE, 0, '2026-10-08T14:00:05.816427+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('9c8be295-f170-436b-861b-390f7f56a371', 'xalile2007@gmail.com', '147323', 'signup_2fa', '2026-10-08T14:11:25.473+00:00', TRUE, 0, '2026-10-08T14:01:25.864472+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('76b76376-5675-4291-97b9-926a6e981f87', 'bacinemimara2004@gmail.com', '315956', 'signup_2fa', '2026-10-08T14:12:41.214+00:00', TRUE, 0, '2026-10-08T14:02:41.409954+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('cfe5dd8e-3bce-4ed5-bb7d-15a2d9d70df0', 'adamandiaye6002@gmail.com', '562083', 'signup_2fa', '2026-10-08T14:13:16.589+00:00', TRUE, 0, '2026-10-08T14:03:16.703061+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('411cd7eb-66ed-41ca-a797-268a091baeff', 'mbayesouleymaneofficiel@gmail.com', '561194', 'signup_2fa', '2026-10-08T14:29:03.229+00:00', FALSE, 0, '2026-10-08T14:19:04.095849+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c39bf014-a9e4-4146-a823-972a9747d8c4', 'wahbbint05@gmail.com', '697368', 'signup_2fa', '2026-10-08T14:37:31.832+00:00', TRUE, 0, '2026-10-08T14:27:32.64566+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('4b8fcf28-5aad-452a-9ca0-03c359aa2851', 'wahbbint05@gmail.com', '480932', 'signup_2fa', '2026-10-08T14:40:17.169+00:00', FALSE, 0, '2026-10-08T14:30:17.53285+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('9dfe6a69-b005-461e-8dbf-e5ec6d33bfa0', 'wahbbint05@gmail.com', '247534', 'signup_2fa', '2026-10-08T14:40:25.795+00:00', TRUE, 0, '2026-10-08T14:30:26.103368+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('e5d5bd8d-6c98-4171-a7bf-3e0dd236c902', 'mbayesouleymaneofficiel@gmail.com', '399649', 'signup_2fa', '2026-10-08T14:41:24.003+00:00', TRUE, 0, '2026-10-08T14:31:24.284739+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('e4fa40cb-c168-45a1-944f-c2971b9632a2', 'cd5649829@gmail.com', '390466', 'signup_2fa', '2026-10-08T14:46:24.659+00:00', TRUE, 0, '2026-10-08T14:36:25.351786+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('cb6af784-7fe8-40f7-9856-34fadbea8004', 'sow.bara@uam.edu.sn', '116412', 'signup_2fa', '2026-10-09T20:39:50.032+00:00', FALSE, 0, '2026-10-09T20:29:50.577198+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('2c02eabf-7175-4602-bdd9-9b229260958e', 'cdiop683@gmail.com', '539140', 'signup_2fa', '2026-10-09T21:13:23.909+00:00', TRUE, 0, '2026-10-09T21:03:24.746464+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('eb58e933-9546-429a-a9cf-53b9d4934685', 'diop.rassoul@uam.edu.sn', '456825', 'signup_2fa', '2026-10-09T21:15:36.102+00:00', TRUE, 0, '2026-10-09T21:05:36.386858+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('8f613622-be3a-4edd-a3a5-3a6282ac676e', 'cdiop683@gmail.com', '475683', 'signup_2fa', '2026-10-09T21:17:03.671+00:00', TRUE, 0, '2026-10-09T21:07:04.160307+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('44d2c1c0-e043-44c3-a733-ad0001f3b5e0', 'xalile2007@gmail.com', '875481', 'signup_2fa', '2026-10-09T21:17:27.895+00:00', TRUE, 0, '2026-10-09T21:07:27.98548+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('f4365f8f-3eb5-4640-b5ab-a57e9183a8d1', 'astouwade985@gmail.com', '180186', 'signup_2fa', '2026-10-09T21:21:04.129+00:00', FALSE, 0, '2026-10-09T21:11:04.419006+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('78eb7d97-bfc2-4bba-b985-97bfe9b725c3', 'astouwade985@gmail.com', '151132', 'signup_2fa', '2026-10-09T21:21:56.755+00:00', FALSE, 0, '2026-10-09T21:11:57.626454+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('5505fe29-8eb9-4b27-8c3a-a2624807c28c', 'm.ndiour2006@gmail.com', '758776', 'signup_2fa', '2026-10-09T21:27:25.449+00:00', TRUE, 0, '2026-10-09T21:17:26.146947+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('ff8c1f35-b850-49d2-acf5-4280f41f26da', 'sylla.diarra@uam.edu.sn', '528535', 'signup_2fa', '2026-10-09T21:49:51.155+00:00', TRUE, 0, '2026-10-09T21:39:51.888786+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('12a1b10a-5a2a-43f8-b7ad-93e44f028b20', 'ndao.aminata2@uam.edu.sn', '634727', 'signup_2fa', '2026-10-09T21:54:58.313+00:00', TRUE, 0, '2026-10-09T21:44:59.03077+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('d3e42d37-7c39-46c4-bf7c-b2d5ab5c64ec', 'sow.bara@uam.edu.sn', '358520', 'signup_2fa', '2026-10-09T22:11:52.164+00:00', FALSE, 0, '2026-10-09T22:01:52.957271+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('d9bdb4bc-397a-4def-b2f2-46f26bb620e0', 'mbengue.masse@uam.edu.sn', '611136', 'signup_2fa', '2026-10-09T23:21:01.26+00:00', TRUE, 0, '2026-10-09T23:11:02.157305+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('13541aa0-4886-4156-8849-fd96e7c97bbf', 'loo34982@gmail.com', '667481', 'signup_2fa', '2026-10-09T23:26:01.123+00:00', TRUE, 0, '2026-10-09T23:16:01.652944+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('456ab73a-fffe-4bef-aa6a-3653630bff44', 'komekadia00@gmail.com', '185745', 'signup_2fa', '2026-10-10T01:28:03.802+00:00', TRUE, 0, '2026-10-10T01:18:04.177669+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('7667847b-4a7e-47b7-8542-9c7a94103b6d', 'seck.gueye@uam.edu.sn', '560408', 'signup_2fa', '2026-10-10T03:29:12.526+00:00', TRUE, 0, '2026-10-10T03:19:13.375073+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('d9ed5052-77b1-4bec-8cda-d63f717d7d68', 'sammariame385@gmail.com', '623734', 'signup_2fa', '2026-10-10T11:49:59.65+00:00', TRUE, 0, '2026-10-10T11:40:00.130122+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('bf51a54c-2c15-4ed6-9cd9-586efdd31e28', 'astouwade985@gmail.com', '796737', 'signup_2fa', '2026-10-10T12:26:37.326+00:00', FALSE, 0, '2026-10-10T12:16:37.638239+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1b520e06-d942-41c4-848c-19f872d93e6e', 'astouwade985@gmail.com', '210484', 'signup_2fa', '2026-10-10T12:25:45.203+00:00', TRUE, 0, '2026-10-10T12:15:45.924894+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('17021290-f551-484b-b0f3-3ddf447d3067', 'mamadoudiaw1105@gmail.com', '496192', 'signup_2fa', '2026-10-10T16:03:07.074+00:00', TRUE, 0, '2026-10-10T15:53:07.853514+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('f8977f40-f8e7-4f51-8a30-fc07f91335a3', 'mamadoudiaw1105@gmail.com', '163651', 'signup_2fa', '2026-10-10T16:04:12.487+00:00', TRUE, 0, '2026-10-10T15:54:12.782375+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('4ece1d03-56bb-4c0a-a3e8-9a852d366fc3', 'diaw.mamadou@uam.edu.sn', '184945', 'signup_2fa', '2026-10-10T16:06:23.609+00:00', TRUE, 0, '2026-10-10T15:56:24.207302+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c15f83dc-997c-4e4a-ae19-7ca0afbe4746', 'fd15122006@gmail.com', '839171', 'signup_2fa', '2026-10-10T17:07:54.948+00:00', TRUE, 0, '2026-10-10T16:57:55.677478+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('990940ac-e696-4807-beb0-d81be4499f90', 'aissatagangue283@gmail.com', '963164', 'signup_2fa', '2026-10-10T18:44:51.875+00:00', TRUE, 0, '2026-10-10T18:34:52.664626+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('bc23b857-4c5c-4fd0-9901-da3e1fbae755', 'soro21ba@gmail.com', '152345', 'signup_2fa', '2026-10-10T19:26:42.241+00:00', TRUE, 0, '2026-10-10T19:16:42.799989+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1b277d6b-7c8d-4dd0-985b-3c354e9c409a', 'ndeyeguitte05@gmail.com', '470340', 'signup_2fa', '2026-10-10T19:28:48.548+00:00', TRUE, 0, '2026-10-10T19:18:49.240213+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c8834211-95d7-45ca-b490-5910e156a1bc', 'mariediouf219@gmail.com', '891117', 'signup_2fa', '2026-10-10T19:59:56.335+00:00', TRUE, 0, '2026-10-10T19:49:57.050908+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('dfd155b7-e83c-4b9a-a600-8a18e562ed67', 'sarrdame173@gmail.com', '861136', 'signup_2fa', '2026-10-11T00:17:29.172+00:00', TRUE, 0, '2026-10-11T00:07:29.932738+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('5d9b15dd-b33f-4e89-ad68-f080aa0fb577', 'marietheresembengue78@gmail.com', '163635', 'signup_2fa', '2026-10-11T16:00:12.092+00:00', TRUE, 0, '2026-10-11T15:50:12.669509+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('6e63e7e3-aff7-4809-8242-c517b76b106d', 'mamadoudiaw1105@gmail.com', '609325', 'signup_2fa', '2026-10-11T16:10:52.477+00:00', TRUE, 0, '2026-10-11T16:00:53.386024+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a2aea2dd-5ac0-4ad6-bbe0-280e5fc63c2b', 'mamadoudiaw1105@gmail.com', '482265', 'signup_2fa', '2026-10-11T16:12:18.544+00:00', TRUE, 0, '2026-10-11T16:02:18.955827+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('44ddde7c-1598-45be-8dfe-7996c71caba2', 'mamadoudiaw1105@gmail.com', '336714', 'signup_2fa', '2026-10-11T16:26:00.521+00:00', TRUE, 0, '2026-10-11T16:16:00.798488+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('8a4f189f-b8a9-4ecc-9093-36bb1b3bcc4e', 'sarrsokhnafaty5@gmail.com', '726972', 'signup_2fa', '2026-10-11T23:09:58.9+00:00', TRUE, 0, '2026-10-11T22:59:59.874763+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a5320665-bb6e-4817-a541-1781e7302848', 'thiongane.maty@uam.edu.sn', '867507', 'signup_2fa', '2026-10-11T23:14:50.952+00:00', TRUE, 0, '2026-10-11T23:04:51.25198+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('eace7775-9362-4104-8cae-1db9faacf492', 'mamadoudiaw1105@gmail.com', '682592', 'signup_2fa', '2026-10-12T02:11:17.615+00:00', TRUE, 0, '2026-10-12T02:01:18.590069+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1c03d714-835b-4820-bdb5-69c0dc77d273', 'ka.marie@uam.edu.sn', '933455', 'signup_2fa', '2026-10-12T10:37:52.989+00:00', TRUE, 0, '2026-10-12T10:27:53.799985+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('68fe99db-8782-4a18-b9d5-073c4fe44b85', 'salimatacisse2005@gmail.com', '561555', 'signup_2fa', '2026-10-12T21:05:44.571+00:00', TRUE, 0, '2026-10-12T20:55:45.47339+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('cb8f80d8-3e46-44a6-8c21-d4978cb0af41', 'anneibrahima2005@gmail.com', '981016', 'signup_2fa', '2026-10-12T21:14:01.04+00:00', TRUE, 0, '2026-10-12T21:04:01.346948+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('0221cdc4-b4ef-4447-b0f1-13a4d97b3d96', 'thiongane.maty@uam.edu.sn', '749130', 'signup_2fa', '2026-10-12T21:35:26.883+00:00', TRUE, 0, '2026-10-12T21:25:27.602954+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('748901df-9ed7-4d97-a346-8116fa233527', 'thiongane.maty@uam.edu.sn', '264616', 'signup_2fa', '2026-10-12T21:37:18.475+00:00', FALSE, 1, '2026-10-12T21:27:18.75845+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('4ce5ac39-277f-408a-9130-e4dd6596d298', 'thiongane.maty@uam.edu.sn', '626449', 'signup_2fa', '2026-10-12T21:38:46.86+00:00', TRUE, 0, '2026-10-12T21:28:47.276946+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('f4ac09e0-9816-41fb-b43d-bf425378739b', 'd.thiam.sn@gmail.com', '835436', 'signup_2fa', '2026-10-12T21:38:11.573+00:00', TRUE, 0, '2026-10-12T21:28:11.867262+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('134d3f05-4bf3-47be-92b2-2387cadd23f2', 'thiongane.maty@uam.edu.sn', '483579', 'signup_2fa', '2026-10-12T21:40:05.497+00:00', TRUE, 0, '2026-10-12T21:30:05.579946+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('2021096d-f82d-4e82-87ad-b956f626f5dd', 'anneibrahima2005@gmail.com', '574885', 'signup_2fa', '2026-10-12T21:43:20.691+00:00', TRUE, 0, '2026-10-12T21:33:21.257594+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('3744e1ac-bc41-464b-aadf-b16e0dccbd8d', 'thiongane.maty@uam.edu.sn', '135591', 'signup_2fa', '2026-10-12T21:43:54.168+00:00', FALSE, 0, '2026-10-12T21:33:54.440441+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('6186bac0-a0d3-4fd6-9771-15dafdec7358', 'thiongane.maty@uam.edu.sn', '501684', 'signup_2fa', '2026-10-12T21:44:32.366+00:00', TRUE, 0, '2026-10-12T21:34:32.647034+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('017ab1d2-9b68-4228-a075-9d55026099f9', 'abdoulrazaddiallo@gmail.com', '965511', 'signup_2fa', '2026-10-12T21:44:27.104+00:00', TRUE, 0, '2026-10-12T21:34:27.202858+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('8c8de826-4559-4f1a-bb64-0e99c1154e05', 'rokhaya171206@gmail.com', '888290', 'signup_2fa', '2026-10-12T21:45:54.511+00:00', TRUE, 0, '2026-10-12T21:35:54.860858+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('25fc6511-1c66-42e2-9c92-d06a10cd4903', 'dieng.massaer@uam.edu.sn', '766060', 'signup_2fa', '2026-10-12T21:47:47.35+00:00', TRUE, 0, '2026-10-12T21:37:47.628563+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('5ff100aa-e6c7-4aee-82f8-0deb0f04843a', 'thiongane.maty@uam.edu.sn', '113584', 'signup_2fa', '2026-10-12T21:49:21.408+00:00', TRUE, 0, '2026-10-12T21:39:21.649526+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b86a8b3a-7dcb-4cc0-8960-9baa6e7c6ca9', 'niang.anta1@uam.edu.sn', '459668', 'signup_2fa', '2026-10-12T21:54:43.822+00:00', TRUE, 0, '2026-10-12T21:44:44.363578+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1be3e471-e950-47e6-9cdc-8a9b4c0fc307', 'ngomodi1606@gmail.com', '981680', 'signup_2fa', '2026-10-12T21:55:28.227+00:00', TRUE, 0, '2026-10-12T21:45:28.32569+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('eb3a3f83-e9e1-4a33-878d-f1f65efe0290', 'modysy602@gmail.com', '885447', 'signup_2fa', '2026-10-12T21:55:16.908+00:00', TRUE, 0, '2026-10-12T21:45:17.033829+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('0181dbf8-26c4-4619-a08a-8a6da9a20139', 'soro21ba@gmail.com', '437249', 'signup_2fa', '2026-10-12T21:56:23.425+00:00', FALSE, 0, '2026-10-12T21:46:23.539397+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('71a93c00-b854-4869-b299-28c301af8a0e', 'sy.arona@uam.edu.sn', '619817', 'signup_2fa', '2026-10-12T21:56:53.793+00:00', TRUE, 0, '2026-10-12T21:46:53.8803+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('37409c6a-16a3-48bc-8557-89956aad01ab', 'niang.ndeyesokhna95@gmail.com', '752397', 'signup_2fa', '2026-10-12T21:57:02.816+00:00', TRUE, 0, '2026-10-12T21:47:03.063285+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('886c66a4-b327-4dad-bc8b-e8a10a96e146', 'senen7090@gmail.com', '173611', 'signup_2fa', '2026-10-12T21:57:09.862+00:00', TRUE, 0, '2026-10-12T21:47:09.937534+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('3d4a837d-1607-4da7-ba74-7b786125c013', 'mouhamadoulaminediarra493@gmail.com', '973562', 'signup_2fa', '2026-10-12T21:56:40.495+00:00', TRUE, 0, '2026-10-12T21:46:40.769014+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('4046bd5c-7563-4dc0-bc36-72b1a549fa1a', 'limzojr21@gmail.com', '978105', 'signup_2fa', '2026-10-12T21:58:55.396+00:00', TRUE, 0, '2026-10-12T21:48:55.486428+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('41876127-fc5a-473c-9d58-74a26dd8631d', 'thiongane.maty@uam.edu.sn', '536689', 'signup_2fa', '2026-10-12T21:59:04.57+00:00', TRUE, 0, '2026-10-12T21:49:04.839369+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('aa173eea-ca98-4470-a40d-666ae6f913ae', 'laminekhoumajr@gmail.com', '719342', 'signup_2fa', '2026-10-12T21:59:38.45+00:00', TRUE, 0, '2026-10-12T21:49:38.514018+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('5c5ed801-8236-48df-b58d-4619f34cb75b', 'sokhnafatimatoundiaye@gmail.com', '896174', 'signup_2fa', '2026-10-12T21:59:29.814+00:00', TRUE, 0, '2026-10-12T21:49:30.074596+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('ad29c2d8-7093-4154-8bec-537225058f58', 'aminatasene930@gmail.com', '780917', 'signup_2fa', '2026-10-12T21:58:37.863+00:00', TRUE, 0, '2026-10-12T21:48:37.945344+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c5a3a316-459d-41b2-a78f-a8140f97a1d3', 'diagne.maimouna1@uam.edu.sn', '166044', 'signup_2fa', '2026-10-12T22:00:08.084+00:00', TRUE, 0, '2026-10-12T21:50:08.162955+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('06a7621b-3876-4618-aecd-f9de048d6304', 'diouf.aissatou3@uam.edu.sn', '754165', 'signup_2fa', '2026-10-12T22:00:53.92+00:00', TRUE, 0, '2026-10-12T21:50:54.010101+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('ee243785-b2ac-410e-ba44-0bc423d89da4', 'aissataalhousseynoud@gmail.com', '341232', 'signup_2fa', '2026-10-12T22:06:21.938+00:00', TRUE, 0, '2026-10-12T21:56:22.049366+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('e6e303c4-122a-4a0a-8450-e65b09723a6f', 'papaamadoumbaye411@gmail.com', '688974', 'signup_2fa', '2026-10-12T22:05:13.534+00:00', TRUE, 0, '2026-10-12T21:55:13.856231+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('e7c51853-a5ab-4f36-b6c9-15ff007222ec', 'maimounahijab@gmail.com', '275987', 'signup_2fa', '2026-10-12T22:14:28.348+00:00', TRUE, 0, '2026-10-12T22:04:28.641128+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('9aece03a-da28-4600-a1b3-646f1bc18dac', 'diopbayetalla3@gmail.com', '171099', 'signup_2fa', '2026-10-12T22:16:17.795+00:00', TRUE, 0, '2026-10-12T22:06:18.182435+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1c6f1e19-600d-48ac-83d3-658e0d5f0c7d', 'aissataalhousseynoud@gmail.com', '428126', 'signup_2fa', '2026-10-12T22:16:26.097+00:00', TRUE, 0, '2026-10-12T22:06:26.173367+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('8c35081d-6bd3-4c3c-8c2b-e7a5d5c76658', 'alaminedieye12@gmail.com', '297380', 'signup_2fa', '2026-10-12T22:24:37.965+00:00', TRUE, 0, '2026-10-12T22:14:38.493172+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c072dab1-d9b7-4d17-a1f1-c20f05847d8d', 'soro21ba@gmail.com', '294293', 'signup_2fa', '2026-10-12T22:31:58.762+00:00', TRUE, 0, '2026-10-12T22:21:59.106814+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('3e958d82-77c8-41fb-b2d4-89445c29fa1b', 'marietheresembengue78@gmail.com', '139968', 'signup_2fa', '2026-10-12T22:32:01.492+00:00', TRUE, 0, '2026-10-12T22:22:01.756344+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('836dbba7-014d-41d8-8226-5acb435c2912', 'ramsessbodian34@gmail.com', '700008', 'signup_2fa', '2026-10-12T22:33:25.395+00:00', TRUE, 0, '2026-10-12T22:23:25.471196+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('d1b0bdf5-feff-40af-ab28-a53869d7db39', 'marememballo03@gmail.com', '229596', 'signup_2fa', '2026-10-12T22:34:23.971+00:00', TRUE, 0, '2026-10-12T22:24:24.05277+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('704a08c0-8914-4f2d-bc2f-ad888c1c13ae', 'anneibrahima2005@gmail.com', '141357', 'signup_2fa', '2026-10-12T22:37:06.729+00:00', TRUE, 0, '2026-10-12T22:27:07.181948+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a7a6ed28-0e13-4630-bed6-50853d572afa', 'mba386767@gmail.com', '168919', 'signup_2fa', '2026-10-12T22:38:02.936+00:00', TRUE, 0, '2026-10-12T22:28:03.217076+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('15916557-1891-4406-9598-291454c615d1', 'diallo.habybatou@uam.edu.sn', '394792', 'signup_2fa', '2026-10-12T22:35:51.119+00:00', TRUE, 0, '2026-10-12T22:25:51.429656+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c23f43ef-4d66-492d-9997-4fd948f0b0b7', 'amadoudd0920@gmail.com', '400759', 'signup_2fa', '2026-10-12T22:38:45.001+00:00', TRUE, 0, '2026-10-12T22:28:45.275324+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('0b1eeb6a-0e12-45d5-9748-ebbf9355b6e0', 'diop.seynabou3@uam.edu.sn', '315828', 'signup_2fa', '2026-10-12T22:40:53.169+00:00', TRUE, 0, '2026-10-12T22:30:53.569079+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('e1f826c4-d9f8-4209-8761-6be3895ad676', 'maimounahijab@gmail.com', '528757', 'signup_2fa', '2026-10-12T22:42:00.176+00:00', TRUE, 0, '2026-10-12T22:32:00.460328+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('3e7bb8d1-7294-4350-9263-57cbf0de0b61', 'mbodjindeye80@gmail.com', '131774', 'signup_2fa', '2026-10-12T22:45:48.31+00:00', TRUE, 0, '2026-10-12T22:35:48.563513+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('01ce417a-9e9c-4672-bb93-c6072d199609', 'diop.seynabou3@uam.edu.sn', '807419', 'signup_2fa', '2026-10-12T22:47:34.103+00:00', TRUE, 0, '2026-10-12T22:37:34.189968+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('4efc1c12-9d41-43a2-9900-24a9452ab93d', 'astouwade985@gmail.com', '532110', 'signup_2fa', '2026-10-12T22:48:00+00:00', TRUE, 0, '2026-10-12T22:38:00.165545+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('13fd8998-ad7c-42df-9051-107ff0bd8641', 'mboupbayengagne@gmail.com', '742237', 'signup_2fa', '2026-10-12T22:48:49.637+00:00', TRUE, 0, '2026-10-12T22:38:49.937354+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c78e8d89-166f-4f99-9d9f-7d637c9080f8', 'locheikhouna99@gmail.com', '925572', 'signup_2fa', '2026-10-12T22:48:50.739+00:00', TRUE, 0, '2026-10-12T22:38:50.988822+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('fcd58725-fc2e-4170-9f4d-70d3a23064c7', 'aminabaye13@gmail.com', '375030', 'signup_2fa', '2026-10-12T22:48:52.88+00:00', TRUE, 0, '2026-10-12T22:38:52.941202+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('9c3e17dc-f2cf-4798-82fd-90116dda109b', 'walyf316@gmail.com', '206356', 'signup_2fa', '2026-10-12T22:54:58.428+00:00', TRUE, 0, '2026-10-12T22:44:58.679589+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('734e0b45-5799-4374-a4b8-8ba2f294fb28', 'mamadiarra051004@gmail.com', '169125', 'signup_2fa', '2026-10-12T23:00:50.994+00:00', FALSE, 0, '2026-10-12T22:50:51.250495+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('7aa1156a-029b-4f2a-a9cf-1f6439f7c9cb', 'mamadiarra051004@gmail.com', '906178', 'signup_2fa', '2026-10-12T23:02:08.224+00:00', FALSE, 0, '2026-10-12T22:52:08.498428+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a0a58e40-85a1-484f-86a7-34e414a6a97f', 'mamediarra051004@gmail.com', '744746', 'signup_2fa', '2026-10-12T23:02:30.082+00:00', TRUE, 0, '2026-10-12T22:52:30.357107+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('209908b6-58bd-4ff2-bd8f-e20c86385b2e', 'sokhnasenendiogou@gmail.com', '756646', 'signup_2fa', '2026-10-12T23:07:48.257+00:00', TRUE, 0, '2026-10-12T22:57:48.661009+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('68c1de89-4827-4c75-9f9a-73039f2cf943', 'cissecheikhahmadoubamba2024@gmail.com', '636070', 'signup_2fa', '2026-10-12T23:21:16.927+00:00', TRUE, 0, '2026-10-12T23:11:17.54421+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b0026cd4-73de-4564-bda1-b4ab90eb3e5f', 'diop.seynabou3@uam.edu.sn', '984225', 'signup_2fa', '2026-10-12T23:33:41.525+00:00', TRUE, 0, '2026-10-12T23:23:42.186824+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b094f17d-898d-4394-a8ad-763bacd99731', 'astouwade985@gmail.com', '182643', 'signup_2fa', '2026-10-12T23:49:31.639+00:00', FALSE, 0, '2026-10-12T23:39:32.191347+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('91cd0155-9ba7-4793-b498-03ea5fcfb60a', 'astouwade985@gmail.com', '323954', 'signup_2fa', '2026-10-12T23:48:48.349+00:00', TRUE, 0, '2026-10-12T23:38:49.057888+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('8be85da2-c487-4850-ba6e-2f8113c8ee61', 'mouhakmo97@gmail.com', '446811', 'signup_2fa', '2026-10-12T23:49:55.368+00:00', FALSE, 1, '2026-10-12T23:39:55.46418+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('72d7e471-fb80-4da4-b9c8-fe3a777e0d8c', 'mouhakmo97@gmail.com', '421096', 'signup_2fa', '2026-10-12T23:50:38.737+00:00', TRUE, 0, '2026-10-12T23:40:39.003876+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('13a74cfd-d08d-4f6b-82cc-9509581f605e', 'cd5649829@gmail.com', '176532', 'signup_2fa', '2026-10-13T00:09:49.455+00:00', TRUE, 0, '2026-10-12T23:59:50.108945+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('6bbf2a3e-0ce8-423b-8f9d-afa8827f6078', 'diop.seynabou3@uam.edu.sn', '959318', 'signup_2fa', '2026-10-13T01:50:24.021+00:00', TRUE, 0, '2026-10-13T01:40:24.927869+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('6b5b71fe-a48a-4888-9538-3d6fb4a7968b', 'diop.seynabou3@uam.edu.sn', '956182', 'signup_2fa', '2026-10-13T01:52:05.647+00:00', TRUE, 0, '2026-10-13T01:42:06.214079+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('fc3c4432-1685-4580-93df-01dadcab4392', 'diop.seynabou3@uam.edu.sn', '794535', 'signup_2fa', '2026-10-13T10:14:12.5+00:00', TRUE, 0, '2026-10-13T10:04:13.102881+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('4eed4fb1-2874-41ff-a2b2-e2e41f599af1', 'ndeyeamytout@gmail.com', '745702', 'signup_2fa', '2026-10-13T10:25:16.778+00:00', TRUE, 0, '2026-10-13T10:15:17.560635+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('5c37c5c0-d367-4cc4-b4fa-342d71cb7e70', 'adiallo211204@gmail.com', '476793', 'signup_2fa', '2026-10-13T10:26:00.535+00:00', TRUE, 0, '2026-10-13T10:16:00.815126+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('aa9ebf4f-4a91-493f-8f53-884dee2c21e3', 'ndeyeamytout@gmail.com', '180382', 'signup_2fa', '2026-10-13T10:26:57.145+00:00', TRUE, 0, '2026-10-13T10:16:57.377483+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('472c4f2d-61f7-4a96-a99f-b9b9a2327dfe', 'ndoyesokhnaaminata848@gmail.com', '698684', 'signup_2fa', '2026-10-13T15:05:35.148+00:00', TRUE, 0, '2026-10-13T14:55:35.994444+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('110e35bb-f5f0-46e9-b669-9faa295eda7d', 'diarra201204@gmail.com', '615053', 'signup_2fa', '2026-10-13T16:24:59.347+00:00', TRUE, 0, '2026-10-13T16:15:00.209172+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('7f79754a-6cbe-4bbe-8a58-8e8047e819a7', 'gueye.icloud@icloud.com', '593778', 'signup_2fa', '2026-10-13T16:54:26.543+00:00', FALSE, 0, '2026-10-13T16:44:27.286545+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('5bfba4c1-3138-467d-97a3-0a1ba7936a3d', 'gueye.icloud@icloud.com', '720562', 'signup_2fa', '2026-10-13T16:56:58.77+00:00', FALSE, 0, '2026-10-13T16:46:59.047936+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1bf680be-86c0-4d24-8f6b-8b19f0d31d19', 'gabdousalam3@gmail.com', '870672', 'signup_2fa', '2026-10-13T16:58:09.445+00:00', TRUE, 0, '2026-10-13T16:48:09.901359+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('d0a2f0e7-b88a-408d-894a-11ba56a3c185', 'mamenasratabane05@gmail.com', '885687', 'signup_2fa', '2026-10-13T19:06:17.465+00:00', TRUE, 0, '2026-10-13T18:56:18.183048+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('6693fd69-20b3-420a-ae24-d7214e93e406', 'ndiaye.diogob@uam.edu.sn', '463067', 'signup_2fa', '2026-10-13T19:21:28.119+00:00', TRUE, 0, '2026-10-13T19:11:28.411986+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('e8cde422-48ca-4bd7-9661-db866dcbd7da', 'astouwade985@gmail.com', '627826', 'signup_2fa', '2026-10-13T19:35:26.859+00:00', FALSE, 0, '2026-10-13T19:25:27.256948+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c62654dd-de70-45a7-9d95-a9d36d7596ff', 'mendya434@gmail.com', '443988', 'signup_2fa', '2026-10-13T19:52:41.591+00:00', FALSE, 0, '2026-10-13T19:42:42.087369+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c7975344-b4b3-4548-8ea6-5db220bd57cb', 'mendya434@gmail.com', '270947', 'signup_2fa', '2026-10-13T19:53:05.204+00:00', TRUE, 0, '2026-10-13T19:43:05.569133+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('7d410f8a-f1a2-4f11-bc6a-a0d3bda4a4e7', 'myachou077@gmail.com', '354295', 'signup_2fa', '2026-10-13T20:04:12.364+00:00', FALSE, 0, '2026-10-13T19:54:12.452693+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('18879fba-99ec-48b1-b6d4-454eb7cff7c3', 'myachou077@gmail.com', '598983', 'signup_2fa', '2026-10-13T20:04:42.705+00:00', TRUE, 0, '2026-10-13T19:54:43.350049+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('bc392676-2fc6-4b8a-8c5a-91ed5dca49d7', 'ndeyeaichadiouf005@gmail.com', '602632', 'signup_2fa', '2026-10-13T20:10:41.505+00:00', FALSE, 0, '2026-10-13T20:00:42.23379+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('dbdc87f4-4f9b-4d88-855d-bed84db576c4', 'diouf.aicha1@uam.edu.sn', '310896', 'signup_2fa', '2026-10-13T20:13:54.074+00:00', TRUE, 0, '2026-10-13T20:03:54.896262+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('0be2eae6-8bba-44d9-9751-80ae6f3664e3', 'anissadiedhiou@gmail.com', '909864', 'signup_2fa', '2026-10-13T20:34:08.434+00:00', TRUE, 0, '2026-10-13T20:24:09.333306+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a21bb421-d6e3-422f-bf1b-a787335a25e4', 'wade.mouhamed@uam.edu.sn', '583705', 'signup_2fa', '2026-10-13T23:12:02.433+00:00', TRUE, 0, '2026-10-13T23:02:02.900515+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('cfc214a9-5817-4090-834a-9dbcfd9dea5e', 'fatimembengue501@gmail.com', '161770', 'signup_2fa', '2026-10-13T21:00:25.086+00:00', TRUE, 0, '2026-10-13T20:50:25.375953+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a85be623-f952-49e8-b65f-2601497d2216', 'tndeyekhady35@gmail.com', '250933', 'signup_2fa', '2026-10-13T21:00:22.448+00:00', TRUE, 1, '2026-10-13T20:50:22.927877+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1cb4ab75-1255-441a-aa90-d87aa5498608', 'thiernosalmanabarry11@gmail.com', '616867', 'signup_2fa', '2026-10-13T21:02:11.545+00:00', TRUE, 0, '2026-10-13T20:52:11.621856+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('51574aa7-54bb-44d5-8e93-d303b5af3448', 'sokhnafatym93@gmail.com', '765476', 'signup_2fa', '2026-10-13T21:02:57.193+00:00', FALSE, 0, '2026-10-13T20:52:57.525206+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a5441624-997e-4214-9efa-e10f91dbe7e8', 'sokhnafatym93@gmail.com', '738732', 'signup_2fa', '2026-10-13T21:04:13.598+00:00', FALSE, 0, '2026-10-13T20:54:13.690469+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('f01b834c-1768-4f10-b75e-6f13f0783a30', 'ndiaye.diarra7@uam.edu.sn', '397530', 'signup_2fa', '2026-10-13T21:07:56.126+00:00', TRUE, 0, '2026-10-13T20:57:56.435486+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('233aff32-8b54-4627-ac8b-f4f7c0e9c4a9', 'alioukonte2006@gmail.com', '641267', 'signup_2fa', '2026-10-13T21:18:13.354+00:00', TRUE, 0, '2026-10-13T21:08:13.66559+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('f2991478-e160-4e39-b1e0-90c7f6d49b68', 'rokhaya132005@gmail.com', '216301', 'signup_2fa', '2026-10-13T21:18:28.697+00:00', TRUE, 0, '2026-10-13T21:08:28.97167+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('436d366a-4f35-48f0-b2fe-609da5cf6cc8', 'fayeadjiratoukhemesse@gmail.com', '453886', 'signup_2fa', '2026-10-13T21:23:04.152+00:00', FALSE, 0, '2026-10-13T21:13:04.23893+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('03f35ca7-9aab-4eea-a116-e12e4cb8ae2f', 'bahoumouawa195@gmail.com', '386407', 'signup_2fa', '2026-10-13T21:22:34.198+00:00', TRUE, 0, '2026-10-13T21:12:34.277991+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('40bfb83a-857d-43a8-a6e5-950ac32bf822', 'fayeadjiratoukhemesse@gmail.com', '457693', 'signup_2fa', '2026-10-13T21:21:06.049+00:00', TRUE, 0, '2026-10-13T21:11:06.379577+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('7c897ae7-3ba6-416f-aece-9c3a73454ec6', 'adamamariamambaye@gmail.com', '900405', 'signup_2fa', '2026-10-13T21:24:18.178+00:00', TRUE, 1, '2026-10-13T21:14:18.260067+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('dc1683fd-a169-4acd-b5d6-6a9c39c4a459', 'sokhnafatym93@gmail.com', '426415', 'signup_2fa', '2026-10-13T21:44:52.017+00:00', TRUE, 0, '2026-10-13T21:34:52.311857+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a2201a93-0808-40ef-b000-9c9f7df7119d', 'mahmodanendiaye5932@gmail.com', '281870', 'signup_2fa', '2026-10-13T23:44:30.228+00:00', TRUE, 0, '2026-10-13T23:34:31.360193+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('80ddebbc-a07e-4680-9afd-f4600cf3fde3', 'thiamndeyekhady230@gmail.com', '149898', 'signup_2fa', '2026-10-13T21:46:31.012+00:00', TRUE, 0, '2026-10-13T21:36:31.269059+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a37acbdf-009d-41b7-bc4b-36369c554925', 'sokhnafatym93@gmail.com', '177756', 'signup_2fa', '2026-10-13T21:48:50.134+00:00', TRUE, 0, '2026-10-13T21:38:50.258083+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('865f5cb1-ceb9-43cb-a534-8a81d04cb2e2', 'gaye.fatim@uam.edu.sn', '169340', 'signup_2fa', '2026-10-13T21:59:55.28+00:00', TRUE, 0, '2026-10-13T21:49:55.792558+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('08337e7a-60bf-4f82-8d07-bf215523164d', 'adamawadiarra@gmail.com', '155032', 'signup_2fa', '2026-10-13T22:08:27.234+00:00', TRUE, 0, '2026-10-13T21:58:27.333982+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('5faaecfd-cf29-46a0-b0b4-f45664f45f30', 'bacouraniang2006@gmail.com', '633901', 'signup_2fa', '2026-10-13T22:33:00.72+00:00', TRUE, 0, '2026-10-13T22:23:01.118912+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('920e54c1-dcc4-4100-abff-aaf8d2797d77', 'wade.mouhamed@uam.edu.sn', '691702', 'signup_2fa', '2026-10-13T23:08:44.52+00:00', TRUE, 0, '2026-10-13T22:58:45.249256+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('aea50130-2c23-4dd3-8b10-1fd3e5dfbbfe', 'samb.papa@uam.edu.sn', '196184', 'prof_email_verify', '2026-10-14T03:08:10.431+00:00', TRUE, 0, '2026-10-14T02:53:10.732424+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('7c3bfe34-75a7-41a7-827b-2796b9761ec7', 'thiamndeyekhady230@gmail.com', '231717', 'signup_2fa', '2026-10-14T12:47:14.954+00:00', FALSE, 0, '2026-10-14T12:37:15.573954+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('033e44bf-4475-423c-bf69-10130ff92a56', 'thiamndeyekhady230@gmail.com', '710380', 'signup_2fa', '2026-10-14T12:47:42.19+00:00', TRUE, 0, '2026-10-14T12:37:42.366126+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a01cff24-2478-4f49-ad7e-57aeb3c7ee7a', 'cheikhtidianefall992@gmail.com', '417471', 'signup_2fa', '2026-10-14T16:09:27.992+00:00', FALSE, 0, '2026-10-14T15:59:28.318017+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1cb2f21d-168c-4848-bd71-09521f085864', 'fall.cheikh2@uam.edu.sn', '818614', 'signup_2fa', '2026-10-14T16:10:17.956+00:00', FALSE, 0, '2026-10-14T16:00:18.858212+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('87c5297c-fd00-4718-b93c-d090e7a0f66b', 'fall.cheikh2@uam.edu.sn', '902534', 'signup_2fa', '2026-10-14T16:08:48.624+00:00', TRUE, 0, '2026-10-14T15:58:49.375429+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('df6939b1-1f34-4232-b95b-9aa0007ad23b', 'cheikhtidianefall992@gmail.com', '499381', 'signup_2fa', '2026-10-14T16:14:11.727+00:00', TRUE, 0, '2026-10-14T16:04:12.056783+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('e8da1492-dbd7-4b99-bfd9-40a2272eba75', 'diallo.lamine1@uam.edu.sn', '186374', 'signup_2fa', '2026-10-14T16:30:17.628+00:00', TRUE, 0, '2026-10-14T16:20:17.927428+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('570bcbbe-7db7-47b9-83ef-b32e9b0daa40', 'marietoudiengquenrema@gmail.com', '169660', 'signup_2fa', '2026-10-14T17:35:10.18+00:00', TRUE, 0, '2026-10-14T17:25:10.895676+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('41768109-e5f8-4270-982c-fc66fe855b2d', 'wane.fatoumata@uam.edu.sn', '781638', 'signup_2fa', '2026-10-14T19:26:40.345+00:00', TRUE, 0, '2026-10-14T19:16:41.045659+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('6591f41d-fd77-4b5a-bfe7-2a41cbd43dcd', 'latsoukabethiam7@gmail.com', '992558', 'prof_email_verify', '2026-10-14T19:48:58.507+00:00', TRUE, 0, '2026-10-14T19:33:58.979819+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('906d4d05-e1df-4875-ad0d-1c3736fd488b', 'diabirane86@gmail.com', '245047', 'signup_2fa', '2026-10-14T19:47:38.354+00:00', TRUE, 0, '2026-10-14T19:37:38.592025+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('74b41c35-9f76-41c6-9974-79199d2f9552', 'camara.nafi@uam.edu.sn', '767584', 'signup_2fa', '2026-10-14T19:51:26.078+00:00', TRUE, 0, '2026-10-14T19:41:26.426604+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1f0be8e6-dd67-41eb-8642-dbc392290353', 'soro21ba@gmail.com', '618046', 'signup_2fa', '2026-10-14T19:55:17.418+00:00', FALSE, 0, '2026-10-14T19:45:18.103304+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('ac8a8c9b-898e-4047-b4d9-a2bcf70cf650', 'latsoukabethiam7@gmail.com', '426884', 'prof_email_verify', '2026-10-14T21:09:24.454+00:00', TRUE, 0, '2026-10-14T20:54:24.627946+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('d51d5cef-b3fc-4ce8-b3d6-6da1abd14b6b', 'maimounahijab@gmail.com', '735824', 'signup_2fa', '2026-10-14T21:05:41.775+00:00', TRUE, 0, '2026-10-14T20:55:42.040969+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('6bb154c3-c70b-47a0-8b58-dc99307dc7ce', 'ndiaye.mbaye1@uam.edu.sn', '732051', 'signup_2fa', '2026-10-14T21:09:34.953+00:00', TRUE, 0, '2026-10-14T20:59:35.04129+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('4e39988d-2d9c-4f2c-85a2-182757400d5e', 'diop.mamour@uam.edu.sn', '112374', 'signup_2fa', '2026-10-14T21:11:05.092+00:00', TRUE, 0, '2026-10-14T21:01:05.396282+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('eb94e69c-52c8-404f-a691-a4254b30d87f', 'bacouraniang2006@gmail.com', '525152', 'signup_2fa', '2026-10-14T21:18:37.698+00:00', TRUE, 0, '2026-10-14T21:08:37.770435+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('783ed8f2-f8da-4e4a-9dec-dc6d9ad85717', 'samb.diagne@uam.edu.sn', '562284', 'signup_2fa', '2026-10-14T21:19:38.216+00:00', TRUE, 0, '2026-10-14T21:09:38.301081+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('bd35e87d-5468-4f06-b2d1-6f816b2a0afc', 'ndiaye.mbaye1@uam.edu.sn', '433816', 'signup_2fa', '2026-10-14T21:20:15.748+00:00', TRUE, 0, '2026-10-14T21:10:15.838062+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('20555a9e-5d31-4c7f-a72e-e4abee2f7db2', 'thiam.marietou@uam.edu.sn', '777406', 'signup_2fa', '2026-10-14T21:21:01.217+00:00', TRUE, 0, '2026-10-14T21:11:01.294637+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('612eb6b4-ec1e-432a-a375-a873915b7064', 'fayeadjiratoukhemesse@gmail.com', '565335', 'signup_2fa', '2026-10-14T21:23:49.711+00:00', TRUE, 0, '2026-10-14T21:13:50.024531+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('cd36ed60-1c63-47c1-9585-2a5e394997e1', 'thiam.marietou@uam.edu.sn', '324343', 'signup_2fa', '2026-10-14T21:32:48.965+00:00', TRUE, 0, '2026-10-14T21:22:49.176859+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1c93c3bf-142d-4cb4-b7a6-4fa1e543bde5', 'ndiaye.mbaye1@uam.edu.sn', '568440', 'signup_2fa', '2026-10-14T22:26:21.952+00:00', TRUE, 0, '2026-10-14T22:16:22.431185+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('45c5551b-716b-484a-888f-6e62c17afb6e', 'ndiaye.mbaye1@uam.edu.sn', '756647', 'signup_2fa', '2026-10-14T22:35:41.982+00:00', TRUE, 0, '2026-10-14T22:25:42.095939+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('05969a99-f1ca-4d75-865d-07fac4403a84', 'mballofaty0@gmail.com', '777667', 'signup_2fa', '2026-10-14T22:47:05.393+00:00', TRUE, 0, '2026-10-14T22:37:05.675469+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('be09de1d-fba9-4c5b-96fd-d15b3e2f81e5', 'diop.mamour@uam.edu.sn', '948502', 'signup_2fa', '2026-10-14T23:26:43.108+00:00', TRUE, 0, '2026-10-14T23:16:43.843268+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('df22e765-1793-49b7-9aab-38cd4bc336a6', 'fatimagueye101@gmail.com', '338102', 'signup_2fa', '2026-10-14T23:30:08.155+00:00', TRUE, 0, '2026-10-14T23:20:08.79294+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('8abfc9b4-df19-4b5d-b26f-600dcfb4ce82', 'diop.mamour@uam.edu.sn', '376159', 'signup_2fa', '2026-10-14T23:30:23.904+00:00', TRUE, 0, '2026-10-14T23:20:24.224209+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('7b54eb55-67ca-49e2-b43a-faeb00fc7d86', 'ad5660481@gmail.com', '609856', 'signup_2fa', '2026-10-14T23:41:50.253+00:00', TRUE, 0, '2026-10-14T23:31:50.887031+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('ceb8871f-1130-4b0a-b108-9f8f75698dd8', 'baldebabouchou318@gmail.com', '666327', 'signup_2fa', '2026-10-15T02:40:36.067+00:00', TRUE, 0, '2026-10-15T02:30:36.843773+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('9e23b39f-7f91-4c75-8b20-6a8326230c09', 'ndama65@icloud.com', '444656', 'signup_2fa', '2026-10-15T12:18:42.202+00:00', FALSE, 0, '2026-10-15T12:08:43.017344+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('24cfd5db-e743-4d11-9b9f-d60e7c8c460e', 'traore.alima@uam.edu.sn', '598531', 'signup_2fa', '2026-10-15T12:20:58.45+00:00', TRUE, 0, '2026-10-15T12:10:58.969456+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('afe3cf6f-16f2-496b-a938-59656cc67b4a', 'ndour.sadakh@uam.edu.sn', '634449', 'signup_2fa', '2026-10-15T12:21:16.27+00:00', TRUE, 0, '2026-10-15T12:11:16.717647+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('7b5ab26b-4d22-4d69-b0b0-126a5218d45f', 'ndour.sadakh@uam.edu.sn', '465356', 'signup_2fa', '2026-10-15T12:23:44.564+00:00', TRUE, 0, '2026-10-15T12:13:44.970216+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('aa9b917c-d431-40ec-a154-eaa6022d1dcf', 'diouf.faliloulahi@uam.edu.sn', '890775', 'signup_2fa', '2026-10-15T12:30:04.68+00:00', TRUE, 0, '2026-10-15T12:20:05.168998+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('ca7bdf9c-44cf-43ff-bb8c-500f6589ca89', 'diouf.faliloulahi@uam.edu.sn', '377825', 'signup_2fa', '2026-10-15T12:39:33.457+00:00', TRUE, 0, '2026-10-15T12:29:34.305223+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('95740fbf-d971-4df7-91b7-4e0d275104f4', 'ndour.sadakh@uam.edu.sn', '478416', 'signup_2fa', '2026-10-15T13:16:44.107+00:00', TRUE, 0, '2026-10-15T13:06:44.436415+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('bf51d06a-f7f9-4ae7-b23d-a0bb6140aea6', 'dioufndeyejuma2611@gmail.com', '796422', 'signup_2fa', '2026-10-15T14:43:55.131+00:00', TRUE, 0, '2026-10-15T14:33:56.038281+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('731f2155-d95f-4af5-9da0-16d3602c2f07', 'seydinaps@gmail.com', '339796', 'signup_2fa', '2026-10-15T16:06:47.36+00:00', FALSE, 0, '2026-10-15T15:56:48.209072+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a9b8efdd-6818-4fcd-a4fa-7b64bd5f81ff', 'seydinaps1@gmail.com', '737352', 'signup_2fa', '2026-10-15T16:07:09.476+00:00', TRUE, 0, '2026-10-15T15:57:09.820698+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('4b79baab-4bfc-4fb4-947a-601c1062fd9a', 'sokhnafatym93@gmail.com', '742066', 'signup_2fa', '2026-10-15T16:12:39.945+00:00', TRUE, 0, '2026-10-15T16:02:40.671514+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c33d8575-1f2d-4265-b450-05f7dbd86496', 'soxnambenesene@gmail.com', '728588', 'signup_2fa', '2026-10-15T16:53:59.224+00:00', TRUE, 0, '2026-10-15T16:44:00.355608+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('416980ac-a0da-49d3-ab5b-2158006ae967', 'ndiaye.mbaye1@uam.edu.sn', '903615', 'signup_2fa', '2026-10-15T19:54:08.265+00:00', FALSE, 0, '2026-10-15T19:44:09.0824+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a23ef711-775a-43ca-9b24-551a048859bf', 'ndiaye.mbaye1@uam.edu.sn', '578215', 'signup_2fa', '2026-10-15T19:57:13.848+00:00', FALSE, 0, '2026-10-15T19:47:14.168163+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('d4498b12-d983-4335-be1a-713ded458146', 'maleyegueye21@gmail.com', '514132', 'signup_2fa', '2026-10-15T20:49:07.639+00:00', TRUE, 0, '2026-10-15T20:39:08.430999+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b60aa1fa-0f8a-4393-b46b-d1135c79b1af', 'wane.fatoumata@uam.edu.sn', '651572', 'signup_2fa', '2026-10-15T21:01:59.164+00:00', TRUE, 0, '2026-10-15T20:51:59.850597+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('919ff0a9-57f7-4d8e-b7dd-7337582b45b8', 'wane.fatoumata@uam.edu.sn', '691753', 'signup_2fa', '2026-10-15T21:04:18.38+00:00', TRUE, 0, '2026-10-15T20:54:18.773806+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('2b5d684f-4718-4cf6-9a89-ba98b845c971', 'wane.fatoumata@uam.edu.sn', '382578', 'signup_2fa', '2026-10-15T21:07:28.684+00:00', TRUE, 0, '2026-10-15T20:57:28.985158+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('5ff132b2-fc11-4ddb-a099-1344af49e3c0', 'fatimawane1306@gmail.com', '244417', 'signup_2fa', '2026-10-15T21:10:15.376+00:00', FALSE, 0, '2026-10-15T21:00:15.641505+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('aaf8985e-685b-4189-8f78-837b78409b6d', 'fatimawane1306@gmail.com', '772645', 'signup_2fa', '2026-10-15T21:13:18.048+00:00', TRUE, 0, '2026-10-15T21:03:18.127667+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('49432752-62b1-4bd6-ba8c-f446731c747d', 'ba.khadidiatou@uam.edu.sn', '204815', 'signup_2fa', '2026-10-15T21:28:34.621+00:00', TRUE, 0, '2026-10-15T21:18:34.895444+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('bf45953f-cff8-430c-86bf-335453f326e9', 'samb.papa@uam.edu.sn', '669967', 'prof_email_verify', '2026-10-15T23:22:08.113+00:00', TRUE, 0, '2026-10-15T23:07:08.524968+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('02b44bc1-89c6-4b2a-a445-0a7b7744bcfc', 'mc5498460@gmail.com', '166390', 'signup_2fa', '2026-10-16T00:37:56.387+00:00', FALSE, 0, '2026-10-16T00:27:56.970834+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('59e9c8ec-8eac-47d8-a819-e93a9f112ff0', 'mc5498460@gmail.com', '584510', 'signup_2fa', '2026-10-16T00:37:14.569+00:00', TRUE, 0, '2026-10-16T00:27:15.30998+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('4eb66eb7-0522-432b-b9e5-52000eb89ada', 'mbayelucie0@gmail.com', '807740', 'signup_2fa', '2026-10-16T02:13:08.784+00:00', TRUE, 0, '2026-10-16T02:03:09.983896+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('54e642ed-b397-4e3b-ba7d-ba90dffc91c4', 'ly.ramatoulaye@uam.edu.sn', '379719', 'signup_2fa', '2026-10-16T07:45:30.575+00:00', TRUE, 0, '2026-10-16T07:35:31.401031+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('72fb6a2c-9ade-4e90-bb04-7a669bf55d89', 'ndao.amy@uam.edu.sn', '903121', 'signup_2fa', '2026-10-16T18:22:58.879+00:00', FALSE, 0, '2026-10-16T18:12:59.658461+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('ac26ee68-7ee2-4d84-ad72-24bed9b56895', 'ndao.amy@uam.edu.sn', '699866', 'signup_2fa', '2026-10-16T18:24:15.427+00:00', TRUE, 0, '2026-10-16T18:14:15.846294+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('7680b780-34d1-40c7-b739-a61775a8b53f', 'medounembao935@gmail.com', '755717', 'signup_2fa', '2026-10-16T19:16:16.637+00:00', TRUE, 0, '2026-10-16T19:06:17.412676+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b752460c-d487-4a9a-92c8-a2c137c57e1a', 'soxnambenesene@gmail.com', '370987', 'signup_2fa', '2026-10-16T20:00:15.699+00:00', TRUE, 0, '2026-10-16T19:50:16.024079+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('60a33cc3-a57b-45b8-9d64-9999c4dbf634', 'msarr8502@gmal.com', '824446', 'signup_2fa', '2026-10-16T20:05:41.204+00:00', FALSE, 0, '2026-10-16T19:55:41.607876+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('74fd9072-2825-4f4d-bd14-8696b18b6bfb', 'diaw.anta1@uam.edu.sn', '103608', 'signup_2fa', '2026-10-16T21:06:05.013+00:00', TRUE, 0, '2026-10-16T20:56:05.363494+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('07bc6cbc-b552-4cf0-80c3-f10f385b6c0b', 'maimounag259@gmail.com', '861318', 'signup_2fa', '2026-10-16T21:14:14.676+00:00', TRUE, 0, '2026-10-16T21:04:14.756452+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('4ea65c04-a157-49f3-8f53-00a7b33db80f', 'mbengue.katia@uam.edu.sn', '201196', 'signup_2fa', '2026-10-16T21:16:47.286+00:00', TRUE, 0, '2026-10-16T21:06:47.556678+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c612bd36-f7fe-477a-acbd-86bda38fe6b9', 'mouhamadoudiop911@gmail.com', '398945', 'signup_2fa', '2026-10-16T21:23:09.215+00:00', TRUE, 0, '2026-10-16T21:13:09.29603+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c41b8ff3-a537-47ac-9381-56652191c9a6', 'aichadiouma24@gmail.com', '894368', 'signup_2fa', '2026-10-16T21:26:42.257+00:00', TRUE, 0, '2026-10-16T21:16:42.339956+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('77372a7a-1113-437f-aea7-1579165cb8c9', 'famam0702@gmail.com', '961284', 'signup_2fa', '2026-10-16T21:30:19.137+00:00', FALSE, 0, '2026-10-16T21:20:19.612783+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('dd9c5752-9b89-437a-a245-2254a10ed0ad', 'famam0702@gmail.com', '582022', 'signup_2fa', '2026-10-16T21:30:28.618+00:00', FALSE, 0, '2026-10-16T21:20:28.730321+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('e23a5ede-d155-4a43-aec5-72fa7620e3ac', 'famam0702@gmail.com', '741255', 'signup_2fa', '2026-10-16T21:31:34.635+00:00', FALSE, 0, '2026-10-16T21:21:34.97258+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('351e055d-9874-4f80-8609-ced366341652', 'famam0702@gmail.com', '630766', 'signup_2fa', '2026-10-16T21:32:52.683+00:00', FALSE, 0, '2026-10-16T21:22:53.190453+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('7b56c78a-e24f-41a7-8caf-8e61007acb8a', 'famam0702@gmail.com', '906762', 'signup_2fa', '2026-10-16T21:34:04.178+00:00', FALSE, 0, '2026-10-16T21:24:04.744208+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('daa96fa1-666b-4cec-baed-76bfd20250f5', 'famam0702@gmail.com', '721355', 'signup_2fa', '2026-10-16T21:35:22.469+00:00', FALSE, 0, '2026-10-16T21:25:22.750094+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('ce1cbbe4-85d4-495f-9468-b55d9da2afee', 'famam0702@gmail.com', '148018', 'signup_2fa', '2026-10-16T21:38:58.244+00:00', FALSE, 0, '2026-10-16T21:28:58.374464+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('482d11c0-4a99-4327-b698-5e6d9509b1a8', 'famam0702@gmail.com', '938999', 'signup_2fa', '2026-10-16T21:42:03.39+00:00', TRUE, 0, '2026-10-16T21:32:03.740622+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('7d2df092-fea0-4c1b-aa17-e3924403763d', 'msarr8502@gmail.com', '391238', 'signup_2fa', '2026-10-16T23:12:06.292+00:00', TRUE, 0, '2026-10-16T23:02:06.522116+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('f31d24d3-e9cb-4000-99b2-bd7e8783272a', 'biayexavier08@gmail.com', '518026', 'signup_2fa', '2026-10-17T08:55:47.691+00:00', TRUE, 0, '2026-10-17T08:45:48.423798+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('16a4b3a3-2c2e-46fa-84a2-ace26eac6091', 'salioudia751@gmail.com', '336844', 'signup_2fa', '2026-10-17T18:54:10.437+00:00', TRUE, 0, '2026-10-17T18:44:11.056266+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('2d841d2d-bf8b-449f-b42c-0d68efc21b76', 'mamadisgne@gmail.com', '148905', 'signup_2fa', '2026-10-17T20:03:13.865+00:00', TRUE, 0, '2026-10-17T19:53:14.369583+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1ea0a851-53db-413c-b6b7-e892a7c6bc8a', 'ndiaye.ndiogou@uam.edu.sn', '210274', 'prof_email_verify', '2026-10-18T19:57:56.329+00:00', TRUE, 0, '2026-10-18T19:42:56.908828+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('080eed9e-d949-417a-a55a-9fb39c7c842b', 'cheikhtidianefall992@gmail.com', '764159', 'signup_2fa', '2026-10-19T11:07:20.854+00:00', TRUE, 0, '2026-10-19T10:57:21.555619+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('8d201b94-db9d-4146-8b86-a3fc81f7bbad', 'marietoudiengquenrema@gmail.com', '167998', 'signup_2fa', '2026-10-19T15:44:45.92+00:00', FALSE, 0, '2026-10-19T15:34:46.753316+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('fbebe9d4-3b7d-4f9c-a0ef-c64703ac2bfe', 'marietoudiengquenrema@gmail.com', '330329', 'signup_2fa', '2026-10-19T16:04:20.984+00:00', TRUE, 0, '2026-10-19T15:54:21.471123+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('d14bf143-5e14-48f7-943e-f48c3deeba33', 'amadoubarro85@gmail.com', '420094', 'signup_2fa', '2026-10-19T17:02:15.018+00:00', FALSE, 0, '2026-10-19T16:52:15.646672+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('6baa421d-de80-4b4c-9f95-4a11313fe794', 'marietoudiengquenrema@gmail.com', '807229', 'signup_2fa', '2026-10-19T19:56:54.484+00:00', FALSE, 0, '2026-10-19T19:46:54.803354+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c250fd16-39e4-4587-baa1-6d0d6a9e2ece', 'marietoudiengquenrema@gmail.com', '816864', 'signup_2fa', '2026-10-19T19:58:26.265+00:00', TRUE, 0, '2026-10-19T19:48:29.809573+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('80049940-1653-4b09-bb93-373f3f121051', 'aichadiouma24@gmail.com', '971013', 'signup_2fa', '2026-10-19T20:56:39.42+00:00', TRUE, 0, '2026-10-19T20:46:40.181707+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1a12383e-afb6-4ab5-a18a-0b63dcf3a9d3', 'd.thiam.sn@gmail.com', '441150', 'signup_2fa', '2026-10-19T21:03:38.624+00:00', FALSE, 0, '2026-10-19T20:53:38.915265+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('d5632a06-bd4d-439f-9a01-bf2233f54fbb', 'diaw.khadidiatou@uam.edu.sn', '909976', 'signup_2fa', '2026-10-19T21:07:21.16+00:00', TRUE, 0, '2026-10-19T20:57:21.587617+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('6ba0d0a0-5a64-46ea-b06c-8a2ee7125f1d', 'gaye.fatim@uam.edu.sn', '708948', 'signup_2fa', '2026-10-19T21:09:33.696+00:00', TRUE, 0, '2026-10-19T20:59:34.022471+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('214a8f2b-a550-4ab5-992d-43b579488407', 'fatimg826@gmail.com', '771908', 'signup_2fa', '2026-10-19T21:29:39.564+00:00', TRUE, 0, '2026-10-19T21:19:40.031249+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b28acbe4-ed78-4426-8c5c-b95a23c7a8b2', 'fatimg826@gmail.com', '204625', 'signup_2fa', '2026-10-19T21:11:35.407+00:00', TRUE, 1, '2026-10-19T21:01:35.767335+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1b1728fc-c8c9-49f8-970b-4b9c79c931f4', 'papajack27@icloud.com', '988647', 'signup_2fa', '2026-10-20T11:05:03.231+00:00', FALSE, 0, '2026-10-20T10:55:03.959073+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('654906b8-ecc1-462f-b04b-45a911747928', 'adjarasall91@gmail.com', '764289', 'signup_2fa', '2026-10-20T15:09:13.111+00:00', TRUE, 1, '2026-10-20T14:59:13.735224+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c3525838-2d0b-45af-b491-bb7caf585223', 'mc5498460@gmail.com', '581539', 'signup_2fa', '2026-10-20T17:40:45.236+00:00', TRUE, 0, '2026-10-20T17:30:45.948484+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('2ce5d613-c50f-462c-b9b7-279786e5aed4', 'shanne849@gmail.com', '836241', 'signup_2fa', '2026-10-20T20:40:01.841+00:00', FALSE, 0, '2026-10-20T20:30:02.586594+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('756febcf-e3b4-4854-bf3b-c7f6ea628d42', 'shanne849@gmail.com', '223102', 'signup_2fa', '2026-10-20T20:41:32.745+00:00', FALSE, 0, '2026-10-20T20:31:33.370628+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('3104c836-aff3-40d2-ad3c-b6fa89c04f8b', 'shanne849@gmail.com', '320011', 'signup_2fa', '2026-10-20T20:43:20.579+00:00', FALSE, 0, '2026-10-20T20:33:20.927748+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a76f6174-be94-4859-a9bb-1dab1e4cd453', 'shanne849@gmail.com', '554478', 'signup_2fa', '2026-10-20T20:46:20.48+00:00', TRUE, 0, '2026-10-20T20:36:21.068368+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('42c1aa86-c992-4985-8cbb-2f9a2f859a41', 'mballofaty@0gmail.com', '834998', 'signup_2fa', '2026-10-20T21:45:56.815+00:00', FALSE, 0, '2026-10-20T21:35:56.907384+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('924de826-fb6e-4921-89a5-17708a45164f', 'mballofaty0@gmail.com', '595018', 'signup_2fa', '2026-10-20T21:48:14.403+00:00', TRUE, 0, '2026-10-20T21:38:14.667278+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('3364d376-2170-4470-b735-8e98ac852be7', 'ba.khadidiatou@uam.edu.sn', '955299', 'signup_2fa', '2026-10-21T11:44:56.744+00:00', FALSE, 0, '2026-10-21T11:34:57.29211+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1ec88070-801a-4f8c-8b41-b9ec86232a1d', 'ba.khadidiatou@uam.edu.sn', '438472', 'signup_2fa', '2026-10-21T13:45:16.162+00:00', TRUE, 0, '2026-10-21T13:35:16.77867+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('6bf596d1-ad99-4719-a475-0a37fff76561', 'thior.aissatou@uam.edu.sn', '264729', 'signup_2fa', '2026-10-22T19:45:35.328+00:00', FALSE, 0, '2026-10-22T19:35:35.657202+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('57ea85ee-4b1f-4829-a644-78aba512b859', 'thior.aissatou@uam.edu.sn', '686544', 'signup_2fa', '2026-10-22T19:46:54.64+00:00', FALSE, 0, '2026-10-22T19:36:55.233837+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('255789ed-bdd3-4a72-85e2-503b61fff4e8', 'thior.aissatou@uam.edu.sn', '458786', 'signup_2fa', '2026-10-22T19:50:03.051+00:00', FALSE, 0, '2026-10-22T19:40:03.430254+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b31202fb-9c21-47fc-8018-0679395db1dc', 'thior.aissatou@uam.edu.sn', '776313', 'signup_2fa', '2026-10-22T19:50:44.191+00:00', FALSE, 0, '2026-10-22T19:40:44.840335+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('45d1e7a5-43bf-4ff2-93d9-f0aad8bf2cac', 'aissatouthior08@gmail.com', '111156', 'signup_2fa', '2026-10-22T19:51:46.429+00:00', FALSE, 0, '2026-10-22T19:41:46.816306+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('bd3fc7b4-3f36-4d5a-8c7f-fd7cf5735f18', 'aissatouthior08@gmail.com', '577050', 'signup_2fa', '2026-10-22T19:53:09.718+00:00', FALSE, 0, '2026-10-22T19:43:10.04808+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('50b320eb-7651-4661-9e5e-dfa515094d0c', 'thior.aissatou@uam.edu.sn', '271371', 'signup_2fa', '2026-10-22T20:04:20.728+00:00', TRUE, 0, '2026-10-22T19:54:21.567637+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('50d7bf3e-4bfe-42f4-b8ea-3cc51f530295', 'mbengue.katia@uam.edu.sn', '760338', 'signup_2fa', '2026-10-22T20:40:48.816+00:00', TRUE, 0, '2026-10-22T20:30:49.954528+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('ceb9e59d-9936-4a9d-9dcf-d9bec5a1a554', 'thior.aissatou@uam.edu.sn', '599530', 'signup_2fa', '2026-10-22T22:01:55.699+00:00', FALSE, 0, '2026-10-22T21:51:56.812532+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('19583147-1db3-4894-8acd-f58c340c47e8', 'thior.aissatou@uam.edu.sn', '133605', 'signup_2fa', '2026-10-22T22:02:57.019+00:00', FALSE, 1, '2026-10-22T21:52:57.563425+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('96ce2c05-9e3c-46d9-9da7-0c4f4c7927b0', 'aissatouthior08@gmail.com', '864174', 'signup_2fa', '2026-10-22T22:05:37.894+00:00', FALSE, 0, '2026-10-22T21:55:38.463855+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c415ec16-3b0b-4206-a6ce-511b096b8b8e', 'thior.aissatou@uam.edu.sn', '561364', 'signup_2fa', '2026-10-23T08:30:29.075+00:00', TRUE, 0, '2026-10-23T08:20:30.019097+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('650185ef-24b0-4a4e-9f4b-f29dc91ff64e', 'thior.aissatou@uam.edu.sn', '656478', 'signup_2fa', '2026-10-23T08:34:34.092+00:00', TRUE, 0, '2026-10-23T08:24:34.228429+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('3245a74a-46bc-4d28-af45-320550f6e6f7', 'thior.aissatou@uam.edu.sn', '400513', 'signup_2fa', '2026-10-23T09:41:18.957+00:00', TRUE, 0, '2026-10-23T09:31:19.432942+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b664dd58-543d-4cc6-9a82-8db4732b97f7', 'thior.aissatou@uam.edu.sn', '975279', 'signup_2fa', '2026-10-23T10:03:52.58+00:00', TRUE, 0, '2026-10-23T09:53:53.211876+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('f6b66d52-5a8e-4ecf-8e53-61bc2f96fc20', 'thior.aissatou@uam.edu.sn', '897002', 'signup_2fa', '2026-10-23T10:07:38.948+00:00', TRUE, 0, '2026-10-23T09:57:39.454606+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('71dda02f-1e3a-4aa2-a96f-21149e5b580a', 'fayemameawa2@gmail.com', '306000', 'signup_2fa', '2026-10-23T19:22:39.565+00:00', TRUE, 0, '2026-10-23T19:12:40.369881+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('7f0ed824-9c38-4634-96c0-724727e1d168', 'abdoulrazaddiallo@gmail.com', '650834', 'signup_2fa', '2026-10-23T21:18:20.465+00:00', FALSE, 0, '2026-10-23T21:08:20.637771+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('f9336239-26a6-474d-8196-2de89539b41f', 'drame.oumy@uam.edu.sb', '746633', 'signup_2fa', '2026-10-24T14:16:02.673+00:00', FALSE, 0, '2026-10-24T14:06:03.58781+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('ee0fd3b1-2dab-48e5-b020-99f73f49a634', 'drame.oumy@uam.edu.sn', '399094', 'signup_2fa', '2026-10-24T14:16:32.022+00:00', TRUE, 0, '2026-10-24T14:06:32.384166+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b8591024-ccd5-4620-bcff-20150830c4a7', 'habibsakho402@gmail.com', '282588', 'signup_2fa', '2026-10-24T16:13:22.767+00:00', TRUE, 0, '2026-10-24T16:03:23.451737+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('d0cf4b8b-0fe2-4cad-ae6b-3d41b51f950c', 'bpenda764@gmail.com', '153347', 'signup_2fa', '2026-10-24T16:16:02.721+00:00', TRUE, 0, '2026-10-24T16:06:03.02307+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c4aa0635-e082-4608-a0cf-c26f9509c61a', 'sprint-garb6z@icloud.com', '618208', 'signup_2fa', '2026-10-24T17:10:34.359+00:00', FALSE, 1, '2026-10-24T17:00:34.469539+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('938ce778-e928-47ab-ac59-93b8a8982a0d', 'penda0763@gmail.com', '198790', 'signup_2fa', '2026-10-24T17:24:47.719+00:00', TRUE, 0, '2026-10-24T17:14:48.142782+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('55773b61-5f7c-4855-a635-22322f4e5fc6', 'fatimbaba7@gmail.com', '370688', 'signup_2fa', '2026-10-24T16:21:14.123+00:00', FALSE, 0, '2026-10-24T16:11:14.561318+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('d9639dba-b46d-4469-b5dc-d226ddfddb3d', 'fatimzahradiop7@gmail.com', '191462', 'signup_2fa', '2026-10-24T16:23:50.857+00:00', FALSE, 0, '2026-10-24T16:13:51.125447+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a1cccb6d-611d-44cc-935d-447037fd07ca', 'fatimbabadiop7@gmail.com', '619064', 'signup_2fa', '2026-10-24T16:25:03.61+00:00', TRUE, 0, '2026-10-24T16:15:04.306816+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('41823714-df8b-4731-b37e-7a140a4165a6', 'diao28061@gmail.com', '145523', 'signup_2fa', '2026-10-24T16:34:20.221+00:00', FALSE, 0, '2026-10-24T16:24:20.869093+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('18994f7c-d319-40f4-a14b-2085c14a6918', 'sprint-garb6z@icloud.com', '382877', 'signup_2fa', '2026-10-24T17:24:29.056+00:00', FALSE, 1, '2026-10-24T17:14:29.133199+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1125e1e6-48ee-4e2f-8d8f-2426ca9b6610', 'diao28061@gmail.com', '842099', 'signup_2fa', '2026-10-24T16:39:34.067+00:00', FALSE, 0, '2026-10-24T16:29:34.339943+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('21f385d3-46ae-482f-9cf1-57e669346fe9', 'diao28061@gmail.com', '431144', 'signup_2fa', '2026-10-24T16:41:42.4+00:00', FALSE, 0, '2026-10-24T16:31:43.125191+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b32f1a42-59e5-48ef-abbe-efaa76e2d77f', 'sprint-garb6z@icloud.com', '924331', 'signup_2fa', '2026-10-24T17:26:33.522+00:00', FALSE, 0, '2026-10-24T17:16:33.834932+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('9e8e145b-4428-4ba2-86a4-7eb8c16f4333', 'bambindeyependa@gmail.com', '681971', 'signup_2fa', '2026-10-24T16:49:02.458+00:00', TRUE, 0, '2026-10-24T16:39:02.810438+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1ee5e789-172f-466a-84b3-28bb94484937', 'sprint-garb6z@icloud.com', '760326', 'signup_2fa', '2026-10-24T16:49:55.196+00:00', FALSE, 0, '2026-10-24T16:39:55.47041+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('aa7323ff-1671-4b97-afec-98ef0fc12121', 'sprint-garb6z@icloud.com', '608882', 'signup_2fa', '2026-10-24T16:51:16.469+00:00', FALSE, 0, '2026-10-24T16:41:17.00689+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('2d969a59-4b0d-484b-a541-4562cf075d95', 'baldepasha12@gmail.com', '102826', 'signup_2fa', '2026-10-24T16:51:38.857+00:00', TRUE, 0, '2026-10-24T16:41:39.12169+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b2a2203c-c782-4ef1-b5a8-6acc2ec77991', 'mouhamadoubabakane@gmail.com', '935659', 'signup_2fa', '2026-10-24T16:55:14.251+00:00', FALSE, 0, '2026-10-24T16:45:14.862988+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('70762566-6c55-4b72-920a-dead6edda5d3', 'mouhamadoubabakane@gmail.com', '775881', 'signup_2fa', '2026-10-24T16:56:16.877+00:00', FALSE, 0, '2026-10-24T16:46:17.175163+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('12c01a08-42f4-4355-aee2-c1cbb7d95e2c', 'coumbaleye535@gmail.com', '383228', 'signup_2fa', '2026-10-24T16:55:53.424+00:00', TRUE, 0, '2026-10-24T16:45:53.685177+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('6a783a2d-8b1f-4833-b62b-c2dbd666fea4', 'pauljuniora0998@gmail.com', '333570', 'signup_2fa', '2026-10-24T16:59:17.865+00:00', FALSE, 0, '2026-10-24T16:49:18.149005+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a069fa4f-9abb-4a9b-ad9a-2f69ccfa31de', 'bambindeyependa@gmail.com', '631842', 'signup_2fa', '2026-10-24T16:59:25.446+00:00', TRUE, 0, '2026-10-24T16:49:25.527081+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1e12dfb2-8a4f-4ca7-984f-26cf4e675074', 'juni0909.az.099@gmail.com', '130609', 'signup_2fa', '2026-10-24T17:01:08.092+00:00', TRUE, 0, '2026-10-24T16:51:08.189999+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a1057a5d-5200-4b24-b74e-522a18cf05ef', 'baldepasha12@gmail.com', '926316', 'signup_2fa', '2026-10-24T17:01:17.939+00:00', TRUE, 0, '2026-10-24T16:51:18.000766+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('d17510f0-dc93-405a-8ef9-d07da3f487d6', 'coumbaleye535@gmail.com', '166303', 'signup_2fa', '2026-10-24T17:01:11.152+00:00', TRUE, 0, '2026-10-24T16:51:11.401888+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('6f0c70cf-3ece-445f-a354-6cbb3e803050', 'amadoutidianembodji70@gmail.com', '303148', 'signup_2fa', '2026-10-24T17:10:46.662+00:00', TRUE, 0, '2026-10-24T17:00:47.213329+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('5dffc06b-1e95-4a92-803e-abdd03bd254b', 'bpenda764@gmail.com', '340398', 'signup_2fa', '2026-10-24T17:13:43.243+00:00', TRUE, 0, '2026-10-24T17:03:43.895061+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('3f527687-0bd7-4343-a854-1bd2a172dd6c', 'diao28061@gmail.com', '170638', 'signup_2fa', '2026-10-24T17:15:30.302+00:00', FALSE, 0, '2026-10-24T17:05:30.835043+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b2866d04-7f6d-4979-ba17-a664d6aff0bb', 'bafanta005@gmail.com', '508964', 'signup_2fa', '2026-10-24T17:16:00.466+00:00', TRUE, 0, '2026-10-24T17:06:00.535188+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('e63279e4-281a-4e4f-82f5-25d02fccdd5e', 'mouhamedrikudo77@gmail.com', '763693', 'signup_2fa', '2026-10-24T17:18:08.854+00:00', TRUE, 0, '2026-10-24T17:08:09.219747+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('18cfff87-d57d-40fe-9df4-bd47b9c5e86f', 'bafanta005@gmail.com', '344867', 'signup_2fa', '2026-10-24T17:22:21.61+00:00', FALSE, 0, '2026-10-24T17:12:22.079694+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('f689f269-ad72-48ac-9791-57aa8d532ce6', 'diao28061@gmail.com', '135217', 'signup_2fa', '2026-10-24T17:37:49.588+00:00', FALSE, 0, '2026-10-24T17:27:49.685773+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('76211788-b5f2-4b15-bfc4-7b5c72703619', 'fayec7129@gmail.com', '768162', 'signup_2fa', '2026-10-24T17:38:11.864+00:00', TRUE, 0, '2026-10-24T17:28:12.147277+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('7b7d332b-384e-4a9d-a335-0591eb9bd211', 'mouhamadoubabakane@gmail.com', '101009', 'signup_2fa', '2026-10-24T17:39:41.352+00:00', TRUE, 0, '2026-10-24T17:29:41.634275+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('fdd70ebd-6ae2-46a8-b1bf-1d96d577fd3a', 'antadiopbebe3@gmail.com', '892856', 'signup_2fa', '2026-10-24T17:37:26.166+00:00', TRUE, 0, '2026-10-24T17:27:26.962053+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('d4656822-887f-469b-a8e2-71d20f1b4460', 'antadiopbebe3@gmail.com', '874034', 'signup_2fa', '2026-10-24T17:57:56.882+00:00', FALSE, 0, '2026-10-24T17:47:57.5573+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('21073dca-0d82-4e4a-a898-1dcd5a94de6f', 'fatoumatabaro69@gmail.com', '854376', 'signup_2fa', '2026-10-24T18:00:17.294+00:00', TRUE, 0, '2026-10-24T17:50:17.987479+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('ce904744-0d66-4af2-a70c-db1c5f03c221', 'fatoualledieng0@gmail.com', '675452', 'signup_2fa', '2026-10-24T18:02:38.632+00:00', TRUE, 1, '2026-10-24T17:52:39.029222+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('6c934a5e-7426-4fea-a0bd-63c68306eb50', 'imamassanethiam6@gmail.com', '407181', 'signup_2fa', '2026-10-24T18:03:23.202+00:00', FALSE, 0, '2026-10-24T17:53:23.462117+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('2a1528cf-e7ca-44a3-b9d1-2230ad3a5e86', 'antadiopbebe3@gmail.com', '160733', 'signup_2fa', '2026-10-24T18:01:20.241+00:00', TRUE, 0, '2026-10-24T17:51:20.517338+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('3ff38e8e-49f8-4157-82d3-2aa11bedf25a', 'imamassanethiam6@gmail.com', '469099', 'signup_2fa', '2026-10-24T18:06:48.365+00:00', FALSE, 0, '2026-10-24T17:56:48.799248+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('5a6e4094-016d-484e-9244-db6e0449a5fd', 'imamassanethiam6@gmail.com', '758606', 'signup_2fa', '2026-10-24T18:05:22.338+00:00', TRUE, 0, '2026-10-24T17:55:22.592377+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('7160e62f-8bf4-42e1-90a1-e262c2c71e60', 'imamassanethiam6@gmail.com', '893117', 'signup_2fa', '2026-10-24T18:15:56.831+00:00', FALSE, 0, '2026-10-24T18:05:57.419455+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('671c8e20-3b54-4617-9abc-1fcbaae118c9', 'imamassanethiam6@gmail.com', '730503', 'signup_2fa', '2026-10-24T18:14:49.47+00:00', TRUE, 0, '2026-10-24T18:04:50.467103+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('9a1f9438-b585-4c12-b59d-2f04d5ac6aa5', 'hawaseck01012005@gmail.com', '248543', 'signup_2fa', '2026-10-24T18:23:05.378+00:00', TRUE, 0, '2026-10-24T18:13:05.881006+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('00ed89e1-69b3-4aa2-8222-6a5aa0d792ec', 'diao28061@gmail.com', '737784', 'signup_2fa', '2026-10-24T18:25:18.027+00:00', FALSE, 0, '2026-10-24T18:15:18.563959+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('26daa950-30f1-4844-b3c0-7e64265ad4bb', 'ndoyebabacar2023@gmail.com', '365259', 'signup_2fa', '2026-10-24T18:38:32.778+00:00', FALSE, 0, '2026-10-24T18:28:33.417669+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('dc395362-ff5a-4d91-95ec-9d86cb1b9aac', 'seynaboudiop36912@gmail.com', '162709', 'signup_2fa', '2026-10-24T18:36:42.003+00:00', TRUE, 0, '2026-10-24T18:26:42.259203+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('904b290e-8f40-4c28-a1e3-9dc27cae07cc', '1ndoyebabacar2023@gmail.com', '585057', 'signup_2fa', '2026-10-24T18:39:46.024+00:00', TRUE, 0, '2026-10-24T18:29:46.29149+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('d28a2c0f-852d-487c-a7cf-d70754912084', 'binetaniane.17@gmail.com', '937932', 'signup_2fa', '2026-10-24T18:45:47.089+00:00', TRUE, 0, '2026-10-24T18:35:47.659835+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c3524f01-3375-4340-afdf-69371c318c58', 'ousmanesamb267@gmail.com', '898245', 'signup_2fa', '2026-10-24T18:47:19.599+00:00', TRUE, 0, '2026-10-24T18:37:20.13441+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('64ed3af0-a1b7-4daf-bcd7-75758e606f45', 'diengpenda098@gmail.com', '496438', 'signup_2fa', '2026-10-24T22:52:19.552+00:00', TRUE, 0, '2026-10-24T22:42:19.981338+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b3c01df0-1b3a-4ed0-9114-626f452f8ad3', 'diao28061@gmail.com', '257084', 'signup_2fa', '2026-10-24T18:53:12.567+00:00', FALSE, 0, '2026-10-24T18:43:13.086542+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('07c8a194-6b45-48dd-a053-06ffd4fb6e77', 'samatekanglassana@gmail.com', '817895', 'signup_2fa', '2026-10-24T23:27:14.894+00:00', FALSE, 0, '2026-10-24T23:17:15.511014+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('3099ca68-2cf3-4c04-872b-c529c2d5dd6b', 'diengpenda098@gmail.com', '461010', 'signup_2fa', '2026-10-24T19:20:23.636+00:00', TRUE, 0, '2026-10-24T19:10:24.077641+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('6bf87acf-596a-433a-b488-6c8d34a99f63', 'habibsakho402@gmail.com', '797509', 'signup_2fa', '2026-10-24T19:29:48.182+00:00', TRUE, 0, '2026-10-24T19:19:48.728311+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('addd2e3c-ffa1-40cd-b581-73f4d90eb36f', 'habibsakho402@gmail.com', '554540', 'signup_2fa', '2026-10-24T19:40:52.651+00:00', FALSE, 0, '2026-10-24T19:30:53.584634+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('cb9f2ddd-69c0-45e4-93f6-5139a8c08837', 'habibsakho402@gmail.com', '876487', 'signup_2fa', '2026-10-24T19:41:35.874+00:00', TRUE, 0, '2026-10-24T19:31:36.512221+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('512984ce-669e-4156-8003-33035ad4b498', 'awacheikhba301@gmail.com', '747401', 'signup_2fa', '2026-10-24T19:46:27.784+00:00', TRUE, 0, '2026-10-24T19:36:28.472329+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('09531287-4e2a-4703-a421-4a29e530bb4e', 'habibsakho402@gmail.com', '946761', 'signup_2fa', '2026-10-24T19:50:42.991+00:00', FALSE, 0, '2026-10-24T19:40:43.538372+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1efd3f73-fc40-4f3f-a66a-d41b5b30e57a', 'diopsadikh94@gmail.com', '300775', 'signup_2fa', '2026-10-24T20:05:04.505+00:00', TRUE, 0, '2026-10-24T19:55:05.261814+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('730af51a-c64c-4cea-9b0a-27fb72d79914', 'habibsakho402@gmail.com', '791223', 'signup_2fa', '2026-10-24T20:06:04.737+00:00', TRUE, 0, '2026-10-24T19:56:04.998281+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('588bc4d4-277b-4823-8aaf-5066360fd38a', 'habibsakho402@gmail.com', '423970', 'signup_2fa', '2026-10-24T20:07:44.574+00:00', TRUE, 0, '2026-10-24T19:57:44.934891+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('0eeb505f-e8dc-4cf9-9d12-dff16a71cb60', 'samatekanglassana@gmail.com', '951957', 'signup_2fa', '2026-10-24T23:25:53.994+00:00', TRUE, 0, '2026-10-24T23:15:54.807009+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('66208087-81aa-4e1c-abf0-513a47f1acc0', 'diao28061@gmail.com', '605720', 'signup_2fa', '2026-10-24T20:32:30.329+00:00', FALSE, 0, '2026-10-24T20:22:30.599171+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('3d5c96ec-20c1-41ac-884d-2fb0a93e0b59', 'seck280807@gmail.com', '268873', 'signup_2fa', '2026-10-24T20:38:08.269+00:00', FALSE, 0, '2026-10-24T20:28:08.580897+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('f076232f-1ca7-493b-b63d-cc6cb83849e5', 'madinaba96@gmail.co', '953585', 'signup_2fa', '2026-10-24T20:38:28.801+00:00', FALSE, 0, '2026-10-24T20:28:29.08284+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('f721a0e7-c67f-449c-824e-4afe65c87638', 'seck280807@gmail.com', '398194', 'signup_2fa', '2026-10-24T20:37:28.095+00:00', TRUE, 0, '2026-10-24T20:27:28.625748+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('21618f02-42d5-421f-8afd-f131349fcd59', 'seck280807@gmail.com', '172149', 'signup_2fa', '2026-10-24T20:41:06.014+00:00', FALSE, 0, '2026-10-24T20:31:06.28591+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('2ae6e87e-647c-487b-9b80-99cdcedd5b5f', 'woury3757@gmail.com', '928501', 'signup_2fa', '2026-10-24T20:50:53.51+00:00', TRUE, 0, '2026-10-24T20:40:53.781377+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('2e97c311-3f27-4bba-9810-5bd653e9da20', 'madinaba96@gmail.com', '654137', 'signup_2fa', '2026-10-24T20:51:42.143+00:00', TRUE, 0, '2026-10-24T20:41:42.514143+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('46f2431e-3f60-4c2e-ad44-ea7214b3b818', 'hawaseck01012005@gmail.com', '450478', 'signup_2fa', '2026-10-24T20:52:38.058+00:00', FALSE, 0, '2026-10-24T20:42:38.173039+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('17438a14-38bd-4d8f-aeb1-adffbb3b79f8', 'hawaseck01012005@gmail.com', '939638', 'signup_2fa', '2026-10-24T20:53:38.179+00:00', TRUE, 0, '2026-10-24T20:43:38.465218+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('2d40aacd-f17a-4d0c-bdaa-886c064253e6', 'seynabouthioune2004@gmail.com', '178157', 'signup_2fa', '2026-10-24T20:54:52.264+00:00', FALSE, 0, '2026-10-24T20:44:52.533667+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('6046e7bd-4135-4619-ab9a-e4cf67c9531e', 'ndickoug87@gmail.com', '174666', 'signup_2fa', '2026-10-24T20:52:46.375+00:00', TRUE, 0, '2026-10-24T20:42:46.672861+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('d3fd9256-bd33-4093-aed3-f22cbed72f90', 'hawaseck01012005@gmail.com', '207809', 'signup_2fa', '2026-10-24T20:55:32.438+00:00', TRUE, 0, '2026-10-24T20:45:32.501421+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('4e5f113e-2d48-44e5-a12a-34e3eb7f3ff1', 'seynabouthioune2004@gmail.com', '589544', 'signup_2fa', '2026-10-24T20:57:32.793+00:00', FALSE, 0, '2026-10-24T20:47:33.172229+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c0fab86e-0f85-4ae1-b970-e7731fee673f', 'diao28061@gmail.com', '259744', 'signup_2fa', '2026-10-24T21:02:12.087+00:00', FALSE, 0, '2026-10-24T20:52:12.634854+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a0de9f21-cb0b-448b-a8da-34d89986a0db', 'hamidousadio16@gmail.com', '711204', 'signup_2fa', '2026-10-24T21:36:12.062+00:00', TRUE, 0, '2026-10-24T21:26:12.419915+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('e5e7d3c1-9758-4d94-99a5-b2ce103d96bc', 'diengpenda098@gmail.com', '332658', 'signup_2fa', '2026-10-24T22:51:12.247+00:00', FALSE, 0, '2026-10-24T22:41:13.164461+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('88eb00af-af8b-4817-a014-09d0de694b9b', 'samatekanglassana@gmail.com', '629850', 'signup_2fa', '2026-10-24T23:43:57.197+00:00', TRUE, 0, '2026-10-24T23:33:57.481998+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b1a950ca-f44b-4201-b918-f3029fde8707', 'samatekanglassana@gmail.com', '382256', 'signup_2fa', '2026-10-25T00:01:13.693+00:00', FALSE, 0, '2026-10-24T23:51:14.170176+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('441d4dda-8c45-4595-8092-2bbbda0e2e9c', 'samatekanglassana@gmail.com', '846229', 'signup_2fa', '2026-10-25T00:00:21.733+00:00', TRUE, 0, '2026-10-24T23:50:22.464151+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('74a1d508-d84b-485d-99ca-61ac6926f48e', 'lamanelo124@gmail.com', '906505', 'signup_2fa', '2026-10-25T00:27:43.714+00:00', FALSE, 0, '2026-10-25T00:17:44.489025+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('051766a7-0e03-4202-9e6a-4b47ff5b7392', 'trokhaya684@gmail.com', '829430', 'signup_2fa', '2026-10-25T12:36:39.839+00:00', TRUE, 0, '2026-10-25T12:26:40.379023+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('8d66780d-5db6-44d4-9907-3985a3c93cdb', 'lamanelo124@gmail.com', '136990', 'signup_2fa', '2026-10-25T00:30:57.076+00:00', FALSE, 0, '2026-10-25T00:20:57.515156+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('715ec6a4-5f3b-49aa-b2d1-4c1accb43c30', 'lamanelo124@gmail.com', '908337', 'signup_2fa', '2026-10-25T00:23:42.904+00:00', TRUE, 0, '2026-10-25T00:13:43.69031+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c8ae035f-0668-41ca-ade0-485271d832ba', 'hamidousadio16@gmail.com', '947054', 'signup_2fa', '2026-10-25T06:47:11.286+00:00', TRUE, 0, '2026-10-25T06:37:12.224952+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('62b6cf19-80b5-40be-8419-1b7b7a0042d4', 'bapapakady2005@gmail.com', '354419', 'prof_email_verify', '2026-10-25T10:43:19.068+00:00', FALSE, 0, '2026-10-25T10:28:19.765627+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('4ac2d258-cc94-49cb-b351-724fe6896bb9', 'bapapakady2004@gmail.com', '578988', 'prof_email_verify', '2026-10-25T10:43:33.277+00:00', FALSE, 0, '2026-10-25T10:28:33.553621+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('ee37ca49-ca46-405f-8a28-1e245d528b16', 'bapapakady2004@gmail.com', '759261', 'prof_email_verify', '2026-10-25T10:44:25.677+00:00', TRUE, 0, '2026-10-25T10:29:26.011315+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b2e3ecfd-861e-4a2e-af19-5be1998d61e5', 'khaliphathioub4@gmail.com', '967778', 'signup_2fa', '2026-10-25T10:54:37.308+00:00', FALSE, 0, '2026-10-25T10:44:37.976573+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c42a42ab-bd2d-4302-a126-260e2da36f91', 'khaliphathioub4@gmail.com', '583108', 'signup_2fa', '2026-10-25T10:53:47.87+00:00', TRUE, 0, '2026-10-25T10:43:48.534099+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c7d39bfb-53e7-4b3d-9ac6-c0993d0b2ade', 'diao28061@gmail.com', '452334', 'signup_2fa', '2026-10-25T11:07:58.263+00:00', FALSE, 0, '2026-10-25T10:57:59.026728+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('0ef5f210-08a0-46b2-984f-87b40a9121a3', 'diao28061@gmail.com', '230893', 'signup_2fa', '2026-10-25T11:22:42.489+00:00', FALSE, 0, '2026-10-25T11:12:43.388099+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('ca86824e-94b7-4c89-9e38-46d3450a2128', 'diao28061@gmail.com', '936978', 'signup_2fa', '2026-10-25T11:29:17.5+00:00', FALSE, 0, '2026-10-25T11:19:18.385991+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b988e682-ac75-4a8a-81b6-bcac61dd3b61', 'mbengue.katia@uam.edu.sn', '697865', 'signup_2fa', '2026-10-26T18:05:46.107+00:00', TRUE, 0, '2026-10-26T17:55:46.981848+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b58fea4a-a243-490d-9d84-096234a074eb', 'trokhaya684@gmail.com', '229437', 'signup_2fa', '2026-10-25T12:46:17.55+00:00', TRUE, 0, '2026-10-25T12:36:18.080602+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('f277fabb-3e08-4211-b3e7-1f21482257c4', 'diao28061@gmail.com', '396271', 'signup_2fa', '2026-10-25T13:09:10.571+00:00', TRUE, 0, '2026-10-25T12:59:11.34411+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('9a1ebc11-3364-44e9-a174-9f06a5de5830', 'aminatanguira3@gmail.com', '116692', 'signup_2fa', '2026-10-25T13:16:12.941+00:00', TRUE, 0, '2026-10-25T13:06:13.484547+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('6ccc6e3a-32fb-4317-8334-d4ee466decad', 'diao28061@gmail.com', '383420', 'signup_2fa', '2026-10-25T19:41:28.856+00:00', TRUE, 0, '2026-10-25T19:31:29.859369+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('dd9e726f-f7a7-482c-80dd-d26ff64cf6e2', 'sarrdieyla68@gmail.com', '249857', 'signup_2fa', '2026-10-26T20:24:51.521+00:00', TRUE, 0, '2026-10-26T20:14:52.343176+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('20be59ec-e9e3-4930-924f-596cc51bfe70', 'mariehenriettekatiam@gmail.com', '281574', 'signup_2fa', '2026-10-26T18:07:38.106+00:00', TRUE, 1, '2026-10-26T17:57:38.409044+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('eb5328e2-b414-4435-b92a-4a91944df970', 'diarra278282@icloud.com', '456771', 'signup_2fa', '2026-10-26T18:58:54.614+00:00', FALSE, 0, '2026-10-26T18:48:54.934017+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a85aedf7-55da-4f91-882e-0c07223ed328', 'diarra278282@icloud.com', '953269', 'signup_2fa', '2026-10-26T19:15:57.666+00:00', FALSE, 0, '2026-10-26T19:05:57.823018+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('78b4c879-ec4c-4b74-88bd-98f3937a0502', 'diarra278282@icloud.com', '492724', 'signup_2fa', '2026-10-26T19:38:12.247+00:00', FALSE, 0, '2026-10-26T19:28:12.970365+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('5d062901-3df5-41d7-9b9b-fb9880e9ceef', 'diarra278282@icloud.com', '903811', 'signup_2fa', '2026-10-26T19:38:34.012+00:00', FALSE, 0, '2026-10-26T19:28:34.303387+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('9c7ea3d0-6666-4013-81b3-d54c5474ebb5', 'diop.mamour@uam.edu.sn', '967351', 'prof_email_verify', '2026-10-26T20:39:10.903+00:00', TRUE, 0, '2026-10-26T20:24:11.248802+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('bd21bd7d-58ed-4d96-af22-1ed1dd7e6153', 'modou3461@gmail.com', '807669', 'signup_2fa', '2026-10-27T18:55:54.111+00:00', TRUE, 0, '2026-10-27T18:45:54.708966+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('0f559103-83a3-49f8-be48-a672edd3cc92', 'alphinhojraob09@gmail.com', '162153', 'signup_2fa', '2026-10-27T21:59:00.074+00:00', TRUE, 0, '2026-10-27T21:49:00.493553+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('548c71e4-c86a-4507-8d96-d76649cb1eef', 'mballofaty0@gmail.com', '794644', 'signup_2fa', '2026-10-27T22:07:57.348+00:00', TRUE, 0, '2026-10-27T21:57:58.02433+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('79ca0ece-159b-417f-97b4-9dba3e0f7555', 'mballofaty0@gmail.com', '233953', 'signup_2fa', '2026-10-27T22:12:43.043+00:00', TRUE, 0, '2026-10-27T22:02:43.76814+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c59265fa-45fc-4682-aa79-794ccba5e142', 'mballofaty0@gmail.com', '986393', 'signup_2fa', '2026-10-27T22:14:44.828+00:00', TRUE, 0, '2026-10-27T22:04:45.186919+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('61d6d73e-7d9a-4ab5-9bfb-5d9d563b7c98', 'mballofaty0@gmail.com', '716678', 'signup_2fa', '2026-10-27T22:18:53.929+00:00', TRUE, 0, '2026-10-27T22:08:54.220747+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('5def063e-8445-422b-a8a3-4c788d0a3314', 'mballofaty0@gmail.com', '374514', 'signup_2fa', '2026-10-27T23:08:49.277+00:00', TRUE, 0, '2026-10-27T22:58:49.657463+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('88901f16-0b93-418a-8c84-72353d0f35a3', 'mballofaty0@gmail.com', '761033', 'signup_2fa', '2026-10-28T00:29:27.13+00:00', TRUE, 0, '2026-10-28T00:19:27.696477+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('255bad4b-24f6-46f6-969a-fe26e6f0078e', 'aliounebadarasy103@gmail.com', '390031', 'signup_2fa', '2026-10-29T15:14:31.52+00:00', TRUE, 0, '2026-10-29T15:04:32.393834+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('bffe49b2-ccf8-4a12-8103-b52f7658e9c0', 'cisse.mamadou2@uam.edu.sn', '729675', 'signup_2fa', '2026-10-29T18:24:05.248+00:00', FALSE, 0, '2026-10-29T18:14:05.91375+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('cbd5851a-0193-4941-937d-a108cb6afecc', 'cisse.mamadou2@uam.edu.sn', '427558', 'signup_2fa', '2026-10-29T18:27:48.688+00:00', FALSE, 0, '2026-10-29T18:17:49.380856+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c98d0ca5-e203-4486-ab3c-da8f83098094', 'cisse.mamadou2@uam.edu.sn', '154746', 'signup_2fa', '2026-10-29T18:22:22.125+00:00', TRUE, 0, '2026-10-29T18:12:22.965846+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('71002d6b-fa54-4fea-b717-37139ebd5ba4', 'cisse.mamadou2@uam.edu.sn', '707969', 'signup_2fa', '2026-10-29T18:33:55.55+00:00', FALSE, 0, '2026-10-29T18:23:56.268631+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('81127963-c6cf-48ae-b671-263a5140e35e', 'cisse.mamadou2@uam.edu.sn', '413447', 'signup_2fa', '2026-10-29T18:32:44.287+00:00', TRUE, 0, '2026-10-29T18:22:44.918296+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('af56af54-862c-41fe-a065-66e2dce23701', 'mamenasratabane05@gmail.com', '567369', 'signup_2fa', '2026-11-01T20:36:23.641+00:00', FALSE, 0, '2026-11-01T20:26:24.457801+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('608646d6-f098-435f-ba19-a2eb9ed2c13f', 'mamenasratabane05@gmail.com', '429011', 'signup_2fa', '2026-11-01T20:45:03.911+00:00', TRUE, 0, '2026-11-01T20:35:04.591956+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('04592652-baab-48d4-a2a5-82151cb1ab1e', 'tabane.nasra@uam.edu.sn', '899975', 'signup_2fa', '2026-11-01T20:51:34.633+00:00', FALSE, 0, '2026-11-01T20:41:35.31947+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('c62e1928-8aa6-439a-97fa-9b619fabd900', 'tabane.nasra@uam.edu.sn', '126550', 'signup_2fa', '2026-11-01T20:54:27.798+00:00', FALSE, 0, '2026-11-01T20:44:28.30415+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('f8c3afb9-a98e-4b12-973e-03c36cb47e90', 'tabane.nasra@uam.edu.sn', '285826', 'signup_2fa', '2026-11-01T20:56:40.597+00:00', FALSE, 0, '2026-11-01T20:46:41.044563+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('086e8d20-1c6d-4d1f-8747-98fb844d092d', 'mamenasratabane05@gmail.com', '580193', 'signup_2fa', '2026-11-01T21:00:28.214+00:00', TRUE, 0, '2026-11-01T20:50:28.714422+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b2add73d-d1a5-451d-b725-bd4079aa32d9', 'mamenasratabane05@gmail.com', '405403', 'signup_2fa', '2026-11-03T21:20:37.101+00:00', TRUE, 0, '2026-11-03T21:10:37.404027+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('7c62aa1d-b9a5-4cc8-8dd5-41dff7657fad', 'tabane.nasra@uam.edu.sn', '863365', 'signup_2fa', '2026-11-03T21:24:54.683+00:00', TRUE, 0, '2026-11-03T21:14:54.993882+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('e4cbbe24-aaab-4d3a-b87f-1187f02a434e', 'mbacmb10@gmail.com', '953400', 'signup_2fa', '2026-11-04T11:02:55.919+00:00', TRUE, 0, '2026-11-04T10:52:56.441208+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('f179b18d-37e1-4bf7-b180-d858a22ff48a', 'mbacmb10@gmail.com', '100258', 'signup_2fa', '2026-11-05T14:11:35.999+00:00', FALSE, 1, '2026-11-05T14:01:36.792753+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('1c81ae86-a297-4cca-b7a2-4134c3bd4419', 'mbacmb10@gmail.com', '362030', 'signup_2fa', '2026-11-05T14:14:24.01+00:00', FALSE, 0, '2026-11-05T14:04:24.672786+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('d3c91b5f-ac9f-4b1a-b078-72ba6d16d9ca', 'mbackmb10@gmail.com', '219153', 'signup_2fa', '2026-11-05T14:19:07.791+00:00', FALSE, 0, '2026-11-05T14:09:08.569264+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('86724cdc-587b-4707-af4d-8ae6c39a7a71', 'mbackemb912@gmail.com', '713848', 'signup_2fa', '2026-11-05T14:19:54.468+00:00', FALSE, 0, '2026-11-05T14:09:54.781999+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('648ef907-672b-45f2-83b2-5bd0d28e8d5f', 'mbengue.mbacke@uam.edu.sn', '821463', 'signup_2fa', '2026-11-06T10:43:15.229+00:00', FALSE, 0, '2026-11-06T10:33:15.999381+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('dfb33d40-30ad-4313-a9f2-28013a092a8f', 'mariamakessod704@gmail.com', '812703', 'signup_2fa', '2026-11-06T21:53:36.201+00:00', FALSE, 0, '2026-11-06T21:43:36.80643+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('ddbaf632-9b61-46f2-9873-62b545a83eee', 'mamadouseck17112006@gmail.com', '170007', 'signup_2fa', '2026-11-06T23:12:03.349+00:00', FALSE, 0, '2026-11-06T23:02:04.170995+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('204e121c-e69a-48e2-8dc3-55775769cb5b', 'mamadouseck17112006@gmail.com', '961648', 'signup_2fa', '2026-11-06T23:13:59.022+00:00', FALSE, 0, '2026-11-06T23:03:59.535728+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('50511c06-c980-4032-9efc-e2446ba2adb9', 'mamadouseck17112006@gmail.com', '287358', 'signup_2fa', '2026-11-07T10:09:17.744+00:00', FALSE, 0, '2026-11-07T09:59:18.705984+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('26f2ed48-0eec-47f5-8533-bf4e0538f353', 'mamadouseck17112006@gmail.com', '602524', 'signup_2fa', '2026-11-07T10:10:27.167+00:00', FALSE, 0, '2026-11-07T10:00:27.53781+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('7da1d848-b613-4037-b50d-3cb3778e6d80', 'mamadouseck1706@icloud.com', '930089', 'signup_2fa', '2026-11-07T10:12:28.106+00:00', FALSE, 0, '2026-11-07T10:02:28.798495+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('f085ee51-f074-4c78-a746-d11e9e3d2623', 'mamadouszck17112006@gmail.com', '869639', 'signup_2fa', '2026-11-09T06:24:59.669+00:00', FALSE, 0, '2026-11-09T06:15:00.578891+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('cdff319a-db98-41b4-b0ea-759bad4a008a', 'mamadouseck17112006@gmail.com', '497378', 'signup_2fa', '2026-11-09T06:26:05.298+00:00', FALSE, 0, '2026-11-09T06:16:05.647834+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('73734203-9b6f-4a20-a1df-f8c1d8d4010e', 'tidianeomarseme@gmail.com', '428216', 'signup_2fa', '2026-11-11T17:32:40.925+00:00', FALSE, 0, '2026-11-11T17:22:41.754626+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('a94987b4-8e2b-4c34-900f-0890abcdfab3', 'seme.omar@uam.edu.sn', '692902', 'signup_2fa', '2026-11-11T17:35:15.341+00:00', FALSE, 0, '2026-11-11T17:25:16.178676+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b433f29d-485c-435a-aa52-f44721488d1d', 'seme.omar@uam.edu.sn', '532399', 'signup_2fa', '2026-11-11T17:36:51.295+00:00', FALSE, 0, '2026-11-11T17:26:51.985688+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('19c99097-3f75-4233-b963-702b3e521dc3', 'badji.oulimatou@uam.edu.sn', '396944', 'signup_2fa', '2026-11-11T20:22:33.333+00:00', FALSE, 0, '2026-11-11T20:12:33.896733+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('cf83e819-ffeb-4251-9f74-e6c2e786b7ff', 'badji.oulimatou@uam.edu.sn', '460856', 'signup_2fa', '2026-11-11T20:27:34.513+00:00', FALSE, 0, '2026-11-11T20:17:35.287405+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('d40b2252-a2e7-4637-b1b1-84aa60377f26', 'oulimatourosebadji@gmail.com', '281266', 'signup_2fa', '2026-11-11T20:30:18.51+00:00', FALSE, 0, '2026-11-11T20:20:19.22386+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('2264a285-a875-4991-b6d4-491272c8a4a0', 'oulimatourosebadji@gmail.com', '582119', 'signup_2fa', '2026-11-11T20:32:11.481+00:00', FALSE, 0, '2026-11-11T20:22:11.98501+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('6a8254e9-7b70-4cff-ae26-3646f168d57d', 'oulimatourosebadji@gmail.com', '985425', 'signup_2fa', '2026-11-11T20:36:12.531+00:00', FALSE, 0, '2026-11-11T20:26:12.858258+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('fca80fc0-3b40-40bc-903f-38e053ee2433', 'badji.oulimatou@uam.edu.sn', '809860', 'signup_2fa', '2026-11-11T21:51:48.153+00:00', FALSE, 0, '2026-11-11T21:41:48.842867+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('e3a5cac6-2a78-4843-9da5-bb3da09256e6', 'badji.oulimatou@uam.edu.sn', '570203', 'signup_2fa', '2026-11-11T23:17:27.415+00:00', FALSE, 0, '2026-11-11T23:07:28.280349+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('86648ad4-c2cc-414b-babf-4dd38a5c780a', 'oulimatourosebadji@gmail.com', '391688', 'signup_2fa', '2026-11-11T23:18:54.732+00:00', FALSE, 0, '2026-11-11T23:08:55.181758+00:00') ON CONFLICT DO NOTHING;
INSERT INTO "verification_codes" ("id", "email", "code", "type", "expires_at", "verified", "attempts", "created_at") VALUES ('b67381a3-b9dd-4c83-9014-0612fc2e4326', 'oulimatourosebadji@gmail.com', '392693', 'signup_2fa', '2026-11-11T23:20:26.454+00:00', FALSE, 0, '2026-11-11T23:10:27.164946+00:00') ON CONFLICT DO NOTHING;

-- ==============================================================================
-- C. SYNCHRONISATION DES SÉQUENCES D'AUTO-INCRÉMENTATION
-- ==============================================================================
SELECT setval(pg_get_serial_sequence('roles', 'id'), COALESCE((SELECT MAX(id) FROM roles), 1));
SELECT setval(pg_get_serial_sequence('filieres', 'id'), COALESCE((SELECT MAX(id) FROM filieres), 1));
SELECT setval(pg_get_serial_sequence('classes', 'id'), COALESCE((SELECT MAX(id) FROM classes), 1));
SELECT setval(pg_get_serial_sequence('matieres', 'id'), COALESCE((SELECT MAX(id) FROM matieres), 1));
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval(pg_get_serial_sequence('enseignants', 'id'), COALESCE((SELECT MAX(id) FROM enseignants), 1));
SELECT setval(pg_get_serial_sequence('etudiants', 'id'), COALESCE((SELECT MAX(id) FROM etudiants), 1));
SELECT setval(pg_get_serial_sequence('emplois_du_temps', 'id'), COALESCE((SELECT MAX(id) FROM emplois_du_temps), 1));
SELECT setval(pg_get_serial_sequence('edt_classe', 'id'), COALESCE((SELECT MAX(id) FROM edt_classe), 1));
SELECT setval(pg_get_serial_sequence('cours', 'id'), COALESCE((SELECT MAX(id) FROM cours), 1));
SELECT setval(pg_get_serial_sequence('fichiers_cours', 'id'), COALESCE((SELECT MAX(id) FROM fichiers_cours), 1));
SELECT setval(pg_get_serial_sequence('communiques', 'id'), COALESCE((SELECT MAX(id) FROM communiques), 1));
SELECT setval(pg_get_serial_sequence('messages_contact', 'id'), COALESCE((SELECT MAX(id) FROM messages_contact), 1));
SELECT setval(pg_get_serial_sequence('notifications', 'id'), COALESCE((SELECT MAX(id) FROM notifications), 1));
SELECT setval(pg_get_serial_sequence('favoris', 'id'), COALESCE((SELECT MAX(id) FROM favoris), 1));
SELECT setval(pg_get_serial_sequence('chat_messages', 'id'), COALESCE((SELECT MAX(id) FROM chat_messages), 1));
SELECT setval(pg_get_serial_sequence('logs', 'id'), COALESCE((SELECT MAX(id) FROM logs), 1));

-- Réactiver les règles et contraintes
SET session_replication_role = 'origin';

-- Fin de restauration
DO $$
BEGIN
    RAISE NOTICE '✓ Restauration terminée avec succès pour toutes les tables et comptes HAS !';
END $$;
