CREATE TABLE IF NOT EXISTS tbChatMensagem (
  idMensagem INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  idRemetente INT UNSIGNED NOT NULL,
  idDestinatario INT UNSIGNED NOT NULL,
  modo ENUM('rede','equipe') NOT NULL,
  texto TEXT NOT NULL,
  clienteId CHAR(36) NOT NULL,
  criadaEm DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  lidaEm DATETIME(3) NULL,
  UNIQUE KEY uq_chat_envio (idRemetente, clienteId),
  INDEX ix_chat_conversa (idRemetente, idDestinatario, modo, idMensagem),
  INDEX ix_chat_recebidas (idDestinatario, lidaEm, idRemetente),
  FOREIGN KEY (idRemetente) REFERENCES tbUsuario(idUsuario) ON DELETE CASCADE,
  FOREIGN KEY (idDestinatario) REFERENCES tbUsuario(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tbChatAssistente (
  idMensagem INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT UNSIGNED NOT NULL,
  papel ENUM('user','assistant') NOT NULL,
  texto TEXT NOT NULL,
  criadaEm DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX ix_chat_assistente (idUsuario, idMensagem),
  FOREIGN KEY (idUsuario) REFERENCES tbUsuario(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
