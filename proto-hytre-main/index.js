const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = process.env.PORT || 5000;

// Serve os arquivos estáticos da pasta "public"
app.use(express.static("public"));

// Configura o body-parser para ler JSON
app.use(bodyParser.json());

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("Conectado ao banco de dados SQLite.");
    }
});

// Criação das tabelas
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT NOT NULL UNIQUE,
            email TEXT,
            telefone TEXT,
            endereco TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS barbeiros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT NOT NULL UNIQUE,
            email TEXT,
            telefone TEXT,
            especialidade TEXT,
            endereco TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS servicos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL UNIQUE,
            preco TEXT NOT NULL,
            duracao TEXT,
            descricao TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS agendamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data DATE NOT NULL UNIQUE,
            horario TIME NOT NULL,
            cpf_cliente VARCHAR(11) NOT NULL,
            cpf_barbeiro VARCHAR(14) NOT NULL,
            id_servico INTEGER NOT NULL,
            FOREIGN KEY (cpf_cliente) REFERENCES clientes (cpf),
            FOREIGN KEY (cpf_barbeiro) REFERENCES barbeiros (cpf),
            FOREIGN KEY (id_servico) REFERENCES servicos (id)
        )
    `);

    console.log("Tabelas criadas com sucesso.");
});

///////////////////////////// Rotas para Clientes /////////////////////////////

// Cadastrar cliente
app.post("/clientes", (req, res) => {
    const { nome, cpf, email, telefone, endereco } = req.body;

    if (!nome || !cpf) {
        return res.status(400).send("Nome e CPF são obrigatórios.");
    }

    const query = `INSERT INTO clientes (nome, cpf, email, telefone, endereco) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [nome, cpf, email, telefone, endereco], function (err) {
        if (err) {
            return res.status(500).send("Erro ao cadastrar cliente.");
        }
        res.status(201).send({
            id: this.lastID,
            message: "Cliente cadastrado com sucesso.",
        });
    });
});

// Listar clientes
// Endpoint para listar todos os clientes ou buscar por CPF
app.get("/clientes", (req, res) => {
    const cpf = req.query.cpf || ""; // Recebe o CPF da query string (se houver)

    if (cpf) {
        // Se CPF foi passado, busca clientes que possuam esse CPF ou parte dele
        const query = `SELECT * FROM clientes WHERE cpf LIKE ?`;

        db.all(query, [`%${cpf}%`], (err, rows) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({ message: "Erro ao buscar clientes." });
            }
            res.json(rows); // Retorna os clientes encontrados ou um array vazio
        });
    } else {
        // Se CPF não foi passado, retorna todos os clientes
        const query = `SELECT * FROM clientes`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({ message: "Erro ao buscar clientes." });
            }
            res.json(rows); // Retorna todos os clientes
        });
    }
});

///////////////////////////// Rotas para Barbeiros /////////////////////////////

// Cadastrar barbeiros
app.post("/barbeiros", (req, res) => {
    const { nome, cpf, email, telefone, especialidade, endereco } = req.body;

    if (!nome || !cpf) {
        return res.status(400).send("Nome e CPF são obrigatórios.");
    }

    const query = `INSERT INTO barbeiros (nome, cpf, email, telefone, especialidade, endereco) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(
        query,
        [nome, cpf, email, telefone, especialidade, endereco],
        function (err) {
            if (err) {
                return res.status(500).send("Erro ao cadastrar barbeiro.");
            }
            res.status(201).send({
                id: this.lastID,
                message: "Barbeiro cadastrado com sucesso.",
            });
        },
    );
});

// Listar barbeiros
// Endpoint para listar todos os barbeiros ou buscar por CPF
app.get("/barbeiros", (req, res) => {
    const cpf = req.query.cpf || ""; // Recebe o CPF da query string (se houver)

    if (cpf) {
        // Se CPF foi passado, busca barbeiros que possuam esse CPF ou parte dele
        const query = `SELECT * FROM barbeiros WHERE cpf LIKE ?`;

        db.all(query, [`%${cpf}%`], (err, rows) => {
            if (err) {
                console.error(err);
                    return res.status(500).json({ message: "Erro ao buscar barbeiros." });
            }
            res.json(rows); // Retorna os barbeiros encontrados ou um array vazio
        });
    } else {
        // Se CPF não foi passado, retorna todos os barbeiros
        const query = `SELECT * FROM barbeiros`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Erro ao buscar barbeiros." });
            }
            res.json(rows); // Retorna todos os barbeiros
        });
    }
});

// Atualizar barbeiros
app.put("/barbeiros/cpf/:cpf", (req, res) => {
    const { cpf } = req.params;
    const { nome, email, telefone, especialidade, endereco } = req.body;

    const query = `UPDATE barbeiros SET nome = ?, email = ?, telefone = ?, especialidade = ?, endereco = ? WHERE cpf = ?`;
    db.run(
        query,
        [nome, email, telefone, especialidade, endereco, cpf],
        function (err) {
            if (err) {
                return res.status(500).send("Erro ao atualizar barbeiro.");
            }
            if (this.changes === 0) {
                return res.status(404).send("Barbeiro não encontrado.");
            }
            res.send("Barbeiro atualizado com sucesso.");
        },
    );
});

///////////////////////////// Rotas para Serviços /////////////////////////////
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
// Cadastrar serviços
app.post("/servicos", (req, res) => {
    const { nome, preco, duracao, descricao } = req.body;

    if (!preco || !nome) {
        return res.status(400).send("Nome e Preço são obrigatórios.");
    }

    const query = `INSERT INTO servicos (nome, preco, duracao, descricao) VALUES (?, ?, ?, ?)`;
    db.run(
        query, 
        [nome, preco, duracao, descricao], 
            function (err) {
                if (err) {
                    return res.status(500).send("Erro ao cadastrar serviço.");
        }
        res.status(201).send({
            id: this.lastID,
            message: "Serviço cadastrado com sucesso.",
        });
    });
});

// Listar serviços
// Endpoint para listar todos os serviços ou buscar por NOME
app.get("/servicos", (req, res) => {
    const nome = req.query.nome || ""; // Recebe o NOME da query string (se houver)

    if (nome) {
        // Se NOME foi passado, busca serviços que possuam esse nome ou parte dele
        const query = `SELECT * FROM servicos WHERE nome LIKE ?`;

        db.all(query, [`%${nome}%`], (err, rows) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({ message: "Erro ao buscar serviços." });
            }
            res.json(rows); // Retorna os serviços encontrados ou um array vazio
        });
    } else {
        // Se NOME não foi passado, retorna todos os serviços
        const query = `SELECT * FROM servicos`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({ message: "Erro ao buscar serviços." });
            }
            res.json(rows); // Retorna todos os serviços
        });
    }
});

// Atualizar serviços
app.put("/servicos/nome/:nome", (req, res) => {
    const { nome } = req.params;
    const { preco, duracao, descricao } = req.body;

    const query = `UPDATE servicos SET preco = ?, duracao = ?, descricao = ? WHERE nome = ?`;
    db.run(query, [preco, duracao, descricao, nome], function (err) {
        if (err) {
            return res.status(500).send("Erro ao atualizar serviço.");
        }
        if (this.changes === 0) {
            return res.status(404).send("Serviço não encontrado.");
        }
        res.send("Serviço atualizado com sucesso.");
    });
});



/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Rotas para Agendamentos /////////////////////////////


// ROTA PARA BUSCAR TODOS OS SERVIÇOS NO ATENDAMENTO
app.get('/buscar-servicos', (req, res) => {
    db.all("SELECT id, nome FROM servicos", [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar serviços:', err);
            res.status(500).send('Erro ao buscar serviços');
        } else {
            res.json(rows); // Retorna os serviços em formato JSON
        }
    });
});

// ROTA PARA BUSCAR HORÁRIOS DISPONÍVEIS
app.get('/horarios-disponiveis', (req, res) => {
    const { data, id } = req.query; // id = id do serviço

    const todosHorarios = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00'];

    const sql = `SELECT horario FROM agendamentos WHERE data = ? AND id_servico = ?`;

    db.all(sql, [data, id], (err, rows) => {
      if (err) {
        console.error('Erro ao buscar horários ocupados:', err);
        return res.status(500).send('Erro ao buscar horários ocupados');
      }

      const ocupados = rows.map(r => String(r.horario).slice(0,5));
      const disponiveis = todosHorarios.filter(h => !ocupados.includes(h));
      res.json(disponiveis);
    });
  });

// ROTA PRA CADASTRAR UM AGENDAMENTO
app.post('/cadastrar-agendamento', (req, res) => {
    const { data, horario, cpf_cliente, cpf_barbeiro, id_servico } = req.body;
    db.run("INSERT INTO agendamentos (data, horario, cpf_cliente, cpf_barbeiro, id_servico) VALUES (?, ?, ?, ?, ?)",
        [data, horario, cpf_cliente, cpf_barbeiro, id_servico], function (err) {
        if (err) {
            console.error('Erro ao cadastrar agendamento:', err);
            res.status(500).send('Erro ao cadastrar agendamento');
        } else {
            res.send('Agendamento cadastrado com sucesso!');
        }
    });
}); 

// Listar agendamentos
// Endpoint para listar todos os clientes ou buscar por CPF
app.get("/agendamentos", (req, res) => {
    const data = req.query.date || ""; // Recebe o CPF da query string (se houver)

    if (data) {
        // Se CPF foi passado, busca clientes que possuam esse CPF ou parte dele
        const query = `SELECT * FROM agendamentos WHERE data LIKE ?`;

        db.all(query, [`%${data}%`], (err, rows) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({ message: "Erro ao buscar clientes." });
            }
            res.json(rows); // Retorna os clientes encontrados ou um array vazio
        });
    } else {
        // Se CPF não foi passado, retorna todos os clientes
        const query = `SELECT * FROM agendamentos`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res
                    .status(500)
                    .json({ message: "Erro ao buscar agendamentos." });
            }
            res.json(rows); // Retorna todos os clientes
        });
    }
});

///////////////////////////// Rotas para Relatorio /////////////////////////////
///////////////////////////// Rotas para Relarorio /////////////////////////////
///////////////////////////// Rotas para Relatorio /////////////////////////////



// Rota para buscar vendas com filtros (cpf, produto, data)
app.get('/agendamentos', (req, res) => {
    const { cpf_cliente, servico, dataInicio, dataFim } = req.query;

    let query = `SELECT
                    agendamentos.id,
                    agendamentos.cliente_cpf,
                    agendamentos.servico_nome,
                    agendamentos.horario,
                    agendamentos.data, 
                    servicos.nome AS servico_nome,
                    clientes.nome AS cliente_nome
                 FROM agendamentos
                 JOIN servicos ON agendamentos.servico_id = servicos.id
                 JOIN clientes ON agendamentos.cliente_cpf = clientes.cpf
                 WHERE 1=1`;  // Começar com um WHERE sempre verdadeiro (1=1)

    const params = [];

    // Filtro por CPF do cliente
    if (cpf_cliente) {
        query += ` AND agendamentos.cpf_cliente = ?`;
        params.push(cpf_cliente);
    }

    // Filtro por nome do produto
    if (servico) {
        query += ` AND servicos.nome LIKE ?`;
        params.push(`%${servico}%`);
    }

    // Filtro por data
    if (dataInicio && dataFim) {
        query += ` AND agendamentos.data BETWEEN ? AND ?`;
        params.push(dataInicio, dataFim);
    }

    // Executa a query com os filtros aplicados
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao buscar relatórios.', error: err.message });
        }

        res.json(rows);  // Retorna os resultados da query
    });
});





















//////////////////////////////////////////////////////////////


// Teste para verificar se o servidor está rodando
app.get("/", (req, res) => {
    res.send("Servidor está rodando e tabelas criadas!");
});

// Bind to all interfaces for Replit compatibility
app.listen(port, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${port}`);
});
