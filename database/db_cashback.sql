DROP SCHEMA IF EXISTS projeto_cashback;

CREATE SCHEMA projeto_cashback;

USE projeto_cashback;

CREATE TABLE lojas
(
	id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    PRIMARY KEY(id),
    nome_loja VARCHAR(100),
    cashback_percent DECIMAL(9,2),
	createdAt TIMESTAMP,
    updatedAt TIMESTAMP NULL
);

CREATE TABLE usuarios
(
	id INT UNSIGNED AUTO_INCREMENT NOT NULL,
	PRIMARY KEY (id),
    lojas_id INT UNSIGNED,
    nome VARCHAR(100),
    data_nascimento DATE,
    telefone BIGINT NOT NULL UNIQUE,
    cpf BIGINT,
    sexo TINYINT,
    email VARCHAR(50),
    avaliacao_loja TINYINT,
    saldo_cashback DECIMAL(9,2) DEFAULT 0,
    total_cashback DECIMAL(9,2) DEFAULT 0,
    cashback_resgatado DECIMAL (9,2) DEFAULT 0,
    total_gasto DECIMAL(9,2) DEFAULT 0,
    numero_de_compras INT DEFAULT 0,
    gasto_medio DECIMAL(9,2) DEFAULT 0,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP NULL,
    CONSTRAINT fk_usuarios_lojas foreign key(lojas_id) REFERENCES lojas(id)
);

CREATE TABLE compras
(
	id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    PRIMARY KEY (id),
    valor DECIMAL(9,2),
    usuarios_id INT UNSIGNED,
    cashback_compra DECIMAL(9,2),
    valor_resgate DECIMAL(9,2) DEFAULT 0,
	createdAt TIMESTAMP,
    updatedAt TIMESTAMP NULL,
    CONSTRAINT fk_compras_usuarios foreign key (usuarios_id) REFERENCES usuarios(id)
);

INSERT INTO lojas (id, nome_loja, cashback_percent) VALUES (1, "açai da cidade", 0.05);


/* CREATE TABLE cashback
(
	id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    PRIMARY KEY (id),
    cashback_compra DECIMAL(9,2),
    cashback_total DECIMAL(9,2),
	compras_id INT UNSIGNED NOT NULL,
	createdAt TIMESTAMP,
    updatedAt TIMESTAMP NULL,
    CONSTRAINT fk_cashback_compras foreign key (compras_id) REFERENCES compras(id)
); */