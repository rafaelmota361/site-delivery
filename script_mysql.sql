CREATE DATABASE delivery_italiano
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE delivery_italiano;


CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome         VARCHAR(40) NOT NULL
) ENGINE=InnoDB;


CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50)  NOT NULL,
    sobrenome VARCHAR(80)  NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    cpf  CHAR(11)     NOT NULL,
    telefone VARCHAR(11)  NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
 
CREATE TABLE produtos (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    nome VARCHAR(60)  NOT NULL,
    descricao VARCHAR(255),
    preco DECIMAL(8,2) NOT NULL,
    imagem_url VARCHAR(255),
    ativo TINYINT(1) NOT NULL DEFAULT 1, 
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
) ENGINE=InnoDB;
 
CREATE TABLE enderecos (
    id_endereco INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario  INT NOT NULL,
    apelido VARCHAR(30)  NOT NULL,
    cep         CHAR(8) NOT NULL,
    rua         VARCHAR(100) NOT NULL,
    numero      VARCHAR(10)  NOT NULL,
    complemento VARCHAR(50),
    bairro      VARCHAR(60) NOT NULL,
    cidade      VARCHAR(60) NOT NULL,
    uf          CHAR(2)  NOT NULL,
    referencia  VARCHAR(100),
    frete       DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_endereco  INT NOT NULL,
    forma_pagamento ENUM('pix','cartao_na_entrega','dinheiro') NOT NULL,
    status ENUM('recebido','em_preparo','saiu_para_entrega','entregue','cancelado')
			NOT NULL DEFAULT 'recebido',
    subtotal DECIMAL(8,2) NOT NULL,  
    frete DECIMAL(8,2) NOT NULL,  
    total DECIMAL(8,2) NOT NULL,  
    criado_em  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario)  REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_endereco) REFERENCES enderecos(id_endereco)
) ENGINE=InnoDB;
create table cartoes(
    id_cartao    INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario   INT NOT NULL,
    bandeira     VARCHAR(20) NOT NULL,
    ultimos4     CHAR(4)     NOT NULL,
    nome_titular VARCHAR(80) NOT NULL,
    validade     CHAR(5)     NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE itens_pedido (
    id_pedido  INT NOT NULL,
    id_produto  INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(8,2) NOT NULL,
    PRIMARY KEY (id_pedido, id_produto),
    FOREIGN KEY (id_pedido)  REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
) ENGINE=InnoDB;
CREATE TABLE carrinho_itens (
    id_usuario INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    PRIMARY KEY (id_usuario, id_produto),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
) ENGINE=InnoDB;
 
 
INSERT INTO categorias (nome) VALUES ('aaa'), ('aaa'), ('aaa');
 
INSERT INTO produtos (id_categoria, nome, descricao, preco,  imagem_url, ativo) VALUES
(1, 'aaa', 'aaa', 0.00, 'aaa', 1),
(2, 'aaa', 'aaa', 0.00, 'aaa', 1),
(3, 'aaa', 'aaa', 0.00, 'aaa', 1);
 
SHOW TABLES;
SELECT * FROM produtos;