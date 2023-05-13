DROP SCHEMA IF EXISTS projeto_cashback;

CREATE SCHEMA projeto_cashback;

USE projeto_cashback;

CREATE TABLE lojas
(
	id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    PRIMARY KEY(id),
    nome_loja VARCHAR(100),
    cashback_percent DECIMAL(9,2),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE logins
(
	id INT UNSIGNED AUTO_INCREMENT NOT NULL,
	PRIMARY KEY (id),
    nome_usuario VARCHAR(50),
    senha varchar(64),
    lojas_id INT UNSIGNED,
    adm tinyint,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT fk_logins_lojas foreign key (lojas_id) REFERENCES lojas(id)
);

CREATE TABLE usuarios
(
	id INT UNSIGNED AUTO_INCREMENT NOT NULL,
	PRIMARY KEY (id),
    nome VARCHAR(100),
    data_nascimento DATE,
    telefone BIGINT NOT NULL UNIQUE,
    cpf BIGINT,
    sexo TINYINT,
    email VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE avaliacoes
(
    lojas_id INT UNSIGNED,
    usuarios_id INT UNSIGNED,
    avaliacao TINYINT,
    texto TEXT,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (lojas_id, usuarios_id),
	CONSTRAINT fk_avalicao_lojas foreign key (lojas_id) REFERENCES lojas(id),
	CONSTRAINT fk_avaliacao_usuarios foreign key (usuarios_id) REFERENCES usuarios(id)
);


CREATE TABLE compras
(
	id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    PRIMARY KEY (id),
    valor DECIMAL(9,2),
    usuarios_id INT UNSIGNED,
    cashback_compra DECIMAL(9,2),
    valor_resgate DECIMAL(9,2) DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_compras_usuarios foreign key (usuarios_id) REFERENCES usuarios(id)
);

CREATE TABLE cashback
(
	id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    PRIMARY KEY (id),
    lojas_id INT UNSIGNED NOT NULL,
    usuarios_id INT UNSIGNED NOT NULL,
    total_cashback DECIMAL(9,2) DEFAULT 0,
	total_gasto DECIMAL(9,2) DEFAULT 0,
    numero_de_compras INT DEFAULT 0,
    gasto_medio DECIMAL(9,2) DEFAULT 0,
    saldo_cashback DECIMAL(9,2) DEFAULT 0,
    cashback_resgatado DECIMAL(9,2) DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cashback_lojas foreign key (lojas_id) REFERENCES lojas(id),
    CONSTRAINT fk_cashback_usuarios foreign key (usuarios_id) REFERENCES usuarios(id)
);

INSERT INTO lojas (id, nome_loja, cashback_percent) VALUES 
(1, "açai da cidade", 0.05),
(2, "sorvete da cidade", 0.05);

INSERT INTO usuarios (nome, data_nascimento, telefone, sexo, email) VALUES 
("Erick", "1997-03-17", "11910716382", "1", "erick@erick.com"),
("Erick", "1997-03-17", "11910716482", "1", "erick@erick.com"),
("Erick", "1997-03-17", "11910716582", "1", "erick@erick.com"),
("Erick", "1997-03-17", "11910716682", "1", "erick@erick.com"),
("Erick", "1997-03-17", "11910716383", "1", "erick@erick.com"),
("Erick", "1997-03-17", "11910716384", "1", "erick@erick.com"),
("Erick", "1997-03-17", "11910716385", "1", "erick@erick.com"),
("Erick", "1997-03-17", "11910716386", "1", "erick@erick.com"),
("Erick", "1997-03-17", "11910716387", "1", "erick@erick.com"),
("Erick", "1997-03-17", "11910716388", "1", "erick@erick.com"),
("Erick", "1997-03-17", "11910716389", "1", "erick@erick.com"),
("Erick", "1997-03-17", "11910716379", "1", "erick@erick.com"),
("Erick", "1997-03-17", "11910726389", "1", "erick@erick.com");

INSERT INTO cashback (lojas_id, usuarios_id, saldo_cashback, total_cashback, total_gasto, numero_de_compras, gasto_medio) VALUES
("1", "1", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "11.00", "11.00", "11.00", "5", "500.00");

INSERT INTO avaliacoes (usuarios_id, lojas_id, avaliacao, texto, createdAt) VALUES
(1, 1, 4, "Gostei bastante do produto, recomendo!", NOW()),
(2, 2, 3, "O produto é bom, mas não atendeu todas as minhas expectativas", NOW()),
(3, 2, 5, "Produto excelente, superou minhas expectativas", NOW()),
(4, 1, 2, "Infelizmente não gostei do produto, não compraria novamente", NOW()),
(5, 2, 4, "Produto muito bom, recomendo para quem está procurando algo de qualidade", NOW());

INSERT INTO logins (nome_usuario, senha, lojas_id, adm) VALUES
("acaicaieiras", "$2b$10$DRNCIbY.eflzCZZsR/uJU.LxmUJuXohpFDc6PfWAszHiRUBb0UUka", "1", "0"),
("zicoflamengo", "$2b$10$DRNCIbY.eflzCZZsR/uJU.LxmUJuXohpFDc6PfWAszHiRUBb0UUka", "1", "1");