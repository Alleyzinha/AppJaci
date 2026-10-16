-- Estrutura do arquivo bdJaci.sql convertida para MySQL 8.4.
-- Extensoes abaixo preservam as rotas existentes de autenticacao, notificacoes e chat.
CREATE TABLE IF NOT EXISTS tbProtegida (
  idProtegida INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pinHash VARCHAR(255) NULL,
  dataNascimento DATE NULL,
  endereco VARCHAR(225) NULL,
  informacoesEmergencia TEXT NULL,
  dataCadastro DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  dataAtualizacao DATETIME(3) NULL ON UPDATE CURRENT_TIMESTAMP(3),
  idUsuario INT UNSIGNED NOT NULL UNIQUE,
  FOREIGN KEY (idUsuario) REFERENCES tbUsuario(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Atualiza bancos existentes de forma aditiva; colunas atuais continuam disponiveis
-- durante a transicao. tbGuardiao segue guardando o contato e tbVinculo formaliza a relacao.
CREATE TABLE IF NOT EXISTS tbVinculo (
  idVinculo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  status ENUM('Pendente','Ativo','Inativo') NOT NULL DEFAULT 'Ativo',
  dataCriacao DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  dataAtualizacao DATETIME(3) NULL ON UPDATE CURRENT_TIMESTAMP(3),
  idProtegida INT UNSIGNED NOT NULL,
  idGuardiao INT UNSIGNED NOT NULL,
  UNIQUE KEY uq_vinculo_protegida_guardiao (idProtegida, idGuardiao),
  FOREIGN KEY (idProtegida) REFERENCES tbProtegida(idProtegida) ON DELETE CASCADE,
  FOREIGN KEY (idGuardiao) REFERENCES tbGuardiao(idGuardiao) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tbAdmin (
  idAdmin INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT UNSIGNED NOT NULL UNIQUE,
  nivelAcesso ENUM('SUPER_ADMIN','ADMIN','ATENDENTE') NOT NULL,
  dataCadastro DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  dataAtualizacao DATETIME(3) NULL ON UPDATE CURRENT_TIMESTAMP(3),
  FOREIGN KEY (idUsuario) REFERENCES tbUsuario(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tbConversa (
  idConversa INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  status ENUM('Ativa','Encerrada') NOT NULL DEFAULT 'Ativa',
  dataCriacao DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  dataAtualizacao DATETIME(3) NULL ON UPDATE CURRENT_TIMESTAMP(3),
  idProtegida INT UNSIGNED NOT NULL,
  idGuardiao INT UNSIGNED NOT NULL,
  FOREIGN KEY (idProtegida) REFERENCES tbProtegida(idProtegida) ON DELETE CASCADE,
  FOREIGN KEY (idGuardiao) REFERENCES tbGuardiao(idGuardiao) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tbMensagem (
  idMensagem INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  mensagem TEXT NOT NULL,
  lidaEm DATETIME(3) NULL,
  dataCriacao DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  idConversa INT UNSIGNED NOT NULL,
  FOREIGN KEY (idConversa) REFERENCES tbConversa(idConversa) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tbNotificacao (
  idNotificacao INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('AlertaSos','VINCULO','MENSAGEM','SISTEMA','OUTRO') NOT NULL,
  mensagem TEXT NOT NULL,
  lidaEm DATETIME(3) NULL,
  dataCriacao DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  idUsuario INT UNSIGNED NOT NULL,
  FOREIGN KEY (idUsuario) REFERENCES tbUsuario(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tbDispositivo (
  idDispositivo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tokenDispositivo VARCHAR(225) NOT NULL UNIQUE,
  plataforma ENUM('ANDROID','IOS','WEB') NOT NULL,
  nomeDispositivo VARCHAR(225) NULL,
  ultimoAcesso DATETIME(3) NULL,
  dataCadastro DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  idUsuario INT UNSIGNED NOT NULL,
  FOREIGN KEY (idUsuario) REFERENCES tbUsuario(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tbLogAdmin (
  idLog INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  acao VARCHAR(100) NOT NULL,
  modulo VARCHAR(100) NOT NULL,
  tipoAlvo VARCHAR(100) NULL,
  dataCriacao DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  idAdmin INT UNSIGNED NOT NULL,
  FOREIGN KEY (idAdmin) REFERENCES tbAdmin(idAdmin) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cria os perfis das contas protegidas cadastradas antes desta migracao.
INSERT IGNORE INTO tbProtegida (idUsuario, pinHash)
SELECT idUsuario, pinHash FROM tbUsuario WHERE perfil = 'protegida';

-- Converte os vinculos existentes para a nova tabela de relacionamento.
INSERT IGNORE INTO tbVinculo (idProtegida, idGuardiao, status)
SELECT p.idProtegida, g.idGuardiao,
  CASE WHEN g.status = 'ativo' THEN 'Ativo' ELSE 'Inativo' END
FROM tbGuardiao g
JOIN tbProtegida p ON p.idUsuario = g.idUsuario;

-- A compatibilidade de data/hora com alertas existentes e aplicada por preparar.ts,
-- que consulta information_schema antes de incluir colunas no MySQL 8.4.
