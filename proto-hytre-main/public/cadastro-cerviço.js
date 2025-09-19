async function cadastrarServico(event) {
    event.preventDefault();



    const cliente = {
        nome: document.getElementById("nome").value,
        preco: document.getElementById("preco").value,
        duracao: document.getElementById("duracao").value,
        descricao: document.getElementById("descricao").value
    };

    try {
        const response = await fetch('/servicos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Serviço cadastrado com sucesso!");
            document.getElementById("cliente-form").reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar Serviço.");
    }
}
// Função para listar todos os clientes ou buscar clientes por CPF
async function listarClientes() {
    const nome = document.getElementById('nome').value.trim();  // Pega o valor do nome digitado no input

    let url = '/servicos';  // URL padrão para todos os serviços

    if (nome) {
        // Se nome foi digitado, adiciona o parâmetro de consulta
        url += `?nome=${nome}`;
    }

    try {
        const response = await fetch(url);
        const clientes = await response.json();

        const tabela = document.getElementById('tabela-clientes');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (clientes.length === 0) {
            // Caso não encontre clientes, exibe uma mensagem
            tabela.innerHTML = '<tr><td colspan="6">Nenhum cliente encontrado.</td></tr>';
        } else {
            clientes.forEach(cliente => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${cliente.id}</td>
                    <td>${cliente.nome}</td>
                    <td>${cliente.preco}</td>
                    <td>${cliente.duracao}</td>
                    <td>${cliente.descricao}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar servicos:', error);
    }
}
// Função para atualizar as informações do cliente
async function atualizarCliente() {
    const nome = document.getElementById('nome').value;
    const preco = document.getElementById('preco').value;
    const duracao = document.getElementById('duracao').value;
    const descricao = document.getElementById('descricao').value;

    const clienteAtualizado = {
        nome,
        preco,
        duracao,
        descricao
    };

    try {
        const response = await fetch(`/servicos/nome/${nome}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteAtualizado)
        });

        if (response.ok) {
            alert('Serviço atualizado com sucesso!');
        } else {
            const errorMessage = await response.text();
            alert('Erro ao atualizar serviço: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar serviço:', error);
        alert('Erro ao atualizar serviço.');
    }
}


async function limpaCliente() {
    document.getElementById('nome').value = '';
    document.getElementById('preco').value = '';
    document.getElementById('duracao').value = '';
    document.getElementById('descricao').value = '';

}