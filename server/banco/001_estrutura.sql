
CREATE TABLE IF NOT EXISTS tbUsuario (
  idUsuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefone VARCHAR(30) NOT NULL,
  senha VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt, nunca senha em texto',
  pinHash VARCHAR(255) NULL,
  perfil ENUM('protegida','guardiao') NOT NULL,
  emailConfirmadoEm DATETIME(3) NULL,
  versaoSessao INT NOT NULL DEFAULT 0,
  criadoEm DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  atualizadoEm DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tbGuardiao (
  idGuardiao INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT UNSIGNED NOT NULL COMMENT 'Conta da protegida',
  idContaGuardiao INT UNSIGNED NOT NULL,
  nome VARCHAR(100) NOT NULL,
  telefone VARCHAR(30) NOT NULL,
  email VARCHAR(100) NOT NULL,
  parentesco VARCHAR(100) NOT NULL,
  disponibilidade VARCHAR(100) NOT NULL DEFAULT 'Não informada',
  cep VARCHAR(10) NULL,
  observacao VARCHAR(500) NULL,
  status ENUM('ativo','recusado') NOT NULL DEFAULT 'ativo',
  criadoEm DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_guardiao_usuario (idUsuario, idContaGuardiao),
  FOREIGN KEY (idUsuario) REFERENCES tbUsuario(idUsuario) ON DELETE CASCADE,
  FOREIGN KEY (idContaGuardiao) REFERENCES tbUsuario(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tbLocalizacaoUsuario (
  idLocalizacaoUsuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT UNSIGNED NOT NULL UNIQUE,
  cep VARCHAR(10) NULL,
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  compartilhada BOOLEAN NOT NULL DEFAULT FALSE,
  atualizadoEm DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  FOREIGN KEY (idUsuario) REFERENCES tbUsuario(idUsuario) ON DELETE CASCADE,
  CHECK (latitude BETWEEN -90 AND 90),
  CHECK (longitude BETWEEN -180 AND 180)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tbDiario (
  idDiario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT UNSIGNED NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descricao VARCHAR(500) NOT NULL,
  dataHora DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  tipoConteudo ENUM('texto') NOT NULL DEFAULT 'texto',
  INDEX ix_diario_usuario_data (idUsuario, dataHora),
  FOREIGN KEY (idUsuario) REFERENCES tbUsuario(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tbAlertaSos (
  idAlertaSos INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT UNSIGNED NOT NULL,
  dataHora DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  status ENUM('ativo','encerrado') NOT NULL DEFAULT 'ativo',
  encerradoEm DATETIME(3) NULL,
  INDEX ix_alerta_usuario_data (idUsuario, dataHora),
  FOREIGN KEY (idUsuario) REFERENCES tbUsuario(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tbCodigoAcesso (
  idCodigo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT UNSIGNED NOT NULL,
  finalidade ENUM('email','senha','pin') NOT NULL,
  codigoHash VARCHAR(255) NOT NULL,
  expiraEm DATETIME(3) NOT NULL,
  tentativas INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_codigo_usuario_finalidade (idUsuario, finalidade),
  FOREIGN KEY (idUsuario) REFERENCES tbUsuario(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
