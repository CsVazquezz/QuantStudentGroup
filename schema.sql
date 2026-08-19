-- QUANT[TEC] — Application database schema
-- Run once: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS quanttec
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE quanttec;

CREATE TABLE IF NOT EXISTS applications (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  full_name        VARCHAR(255) NOT NULL,
  email            VARCHAR(255) NOT NULL,
  major            VARCHAR(50)  NOT NULL,
  academic_stage   VARCHAR(50)  NOT NULL,
  technical_level  TINYINT      NOT NULL,
  interests        JSON         NOT NULL,
  desired_role     VARCHAR(50)  NOT NULL,
  campus_confirmed TINYINT(1)   NOT NULL DEFAULT 0,
  open_sandbox     TEXT         NOT NULL,
  submitted_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_posts (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  slug         VARCHAR(255) NOT NULL,
  author       VARCHAR(255) NOT NULL,
  title_en     VARCHAR(255) NOT NULL,
  title_es     VARCHAR(255) NOT NULL,
  excerpt_en   TEXT         NOT NULL,
  excerpt_es   TEXT         NOT NULL,
  content_en   MEDIUMTEXT   NOT NULL,
  content_es   MEDIUMTEXT   NOT NULL,
  published_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
