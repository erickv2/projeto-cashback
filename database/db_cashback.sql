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
    avaliacao_loja INT DEFAULT 0,
    cashback_resgatado DECIMAL(9,2) DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cashback_lojas foreign key (lojas_id) REFERENCES lojas(id),
    CONSTRAINT fk_cashback_usuarios foreign key (usuarios_id) REFERENCES usuarios(id)
);

INSERT INTO lojas (id, nome_loja, cashback_percent) VALUES (1, "açai da cidade", 0.05);

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

/* INSERT INTO cashback (lojas_id, usuarios_id, avaliacao_loja, saldo_cashback, total_cashback, total_gasto, numero_de_compras, gasto_medio) VALUES
("1", "1", "4", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "4", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "4", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "4", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "4", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "4", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "4", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "4", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "4", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "4", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "4", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "4", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "4", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "4", "11.00", "11.00", "11.00", "5", "500.00"),
("1", "1", "4", "11.00", "11.00", "11.00", "5", "500.00");
*/