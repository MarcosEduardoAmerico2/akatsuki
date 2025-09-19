async function cadastrarBarbeiro(event) {
    event.preventDefault();



    const barbeiro = {
        nome: document.getElementById("nome").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        cpf: document.getElementById("cpf").value,
        especialidade: document.getElementById("especialidade").value,
        endereco: document.getElementById("endereco").value
    };

    try {
        const response = await fetch('/barbeiros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(barbeiro)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Barbeiro cadastrado com sucesso!");
            document.getElementById("barbeiro-form").reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar barbeiro.");
    }
}
// Função para listar todos os clientes ou buscar clientes por CPF
async function listarBarbeiros() {
    const cpf = document.getElementById('cpf').value.trim();  // Pega o valor do CPF digitado no input

    let url = '/barbeiros';  // URL padrão para todos os clientes

    if (cpf) {
        // Se CPF foi digitado, adiciona o parâmetro de consulta
        url += `?cpf=${cpf}`;
    }

    try {
        const response = await fetch(url);
        const barbeiros = await response.json();

        const tabela = document.getElementById('tabela-barbeiros');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (barbeiros.length === 0) {
            // Caso não encontre clientes, exibe uma mensagem
            tabela.innerHTML = '<tr><td colspan="6">Nenhum barbeiro encontrado.</td></tr>';
        } else {
            barbeiros.forEach(barbeiro => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${barbeiro.id}</td>
                    <td>${barbeiro.nome}</td>
                    <td>${barbeiro.cpf}</td>
                    <td>${barbeiro.email}</td>
                    <td>${barbeiro.telefone}</td>
                    <td>${barbeiro.especialidade}</td>
                    <td>${barbeiro.endereco}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar barbeiros:', error);
    }
}
// Função para atualizar as informações do cliente
async function atualizarBarbeiro() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const especialidade = document.getElementById('especialidade').value;
    const endereco = document.getElementById('endereco').value;

    const barbeiroAtualizado = {
        nome,
        email,
        telefone,
        endereco,
        especialidade,
        cpf
    };

    try {
        const response = await fetch(`/barbeiros/cpf/${cpf}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(barbeiroAtualizado)
        });

        if (response.ok) {
            alert('Barbeiro atualizado com sucesso!');
        } else {
            const errorMessage = await response.text();
            alert('Erro ao atualizar barbeiro: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar barbeiro:', error);
        alert('Erro ao atualizar barbeiro.');
    }
}


async function limpaBarbeiro() {
    document.getElementById('nome').value = '';
    document.getElementById('cpf').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('especialidade').value = '';
    document.getElementById('endereco').value = '';

}