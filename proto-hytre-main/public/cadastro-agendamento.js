async function buscarServico() {
    fetch("/buscar-servicos")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao buscar serviços");
            }
            return response.json();
        })
        .then((servicos) => {
            const select = document.getElementById("servicoSelecionado");
            servicos.forEach((servico) => {
                const option = document.createElement("option");
                option.value = servico.id; // Usa o id como valor
                option.textContent = servico.nome; // Nome do serviço exibido
                select.appendChild(option);
            });
        })
        .catch((error) => {
            console.error("Erro ao carregar os serviços:", error);
        });
}

async function buscaHorariosDisponiveis() {
    const data = document.getElementById("data").value;
    const id = document.getElementById("servicoSelecionado").value;
    // Verifica se ambos os campos estão preenchidos
    if (!data || !id) {
        return; // Aguarde até que ambos os campos estejam preenchidos
    }

    fetch(`/horarios-disponiveis?data=${data}&id=${id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao buscar horários disponíveis");
            }

            return response.json();
        })
        .then((horariosDisponiveis) => {
            const selectHorario = document.getElementById("horaSelecionada");
            selectHorario.innerHTML =
                '<option value="">Selecione o Horário</option>';

            if (horariosDisponiveis.length > 0) {
                horariosDisponiveis.forEach((horario) => {
                    const option = document.createElement("option");
                    option.value = horario;
                    option.textContent = horario;
                    selectHorario.appendChild(option);
                });
            } else {
                alert("Não há horários disponíveis para esta data e serviço.");
            }
        })
        .catch((error) => {
            console.error("Erro ao carregar horários disponíveis:", error);
        });
}

async function cadastrarAgendamento(event) {
    event.preventDefault();

    const data = document.getElementById("data").value;
    const horario = document.getElementById("horaSelecionada").value;
    const cpf_cliente = document.getElementById("cpf_cli").value;
    const cpf_barbeiro = document.getElementById("cpf_bar").value;
    const id_servico = document.getElementById("servicoSelecionado").value;

    if (!data || !horario || !cpf_cliente || !cpf_barbeiro || !id_servico) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const resp = await fetch("/cadastrar-agendamento", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                data,
                horario,
                cpf_cliente,
                cpf_barbeiro,
                id_servico,
            }),
        });

        const texto = await resp.text();

        if (!resp.ok) {
            console.error("Falha no cadastro:", texto);
            alert(`Erro ao cadastrar: ${texto}`);
            return;
        }

        alert("Agendamento cadastrado com sucesso!");
        document.getElementById("filters").reset();
        document.getElementById("horaSelecionada").innerHTML =
            '<option value="">Selecione o Horário</option>';
    } catch (e) {
        console.error("Erro ao cadastrar agendamento:", e);
        alert("Erro de rede ao cadastrar.");
    }
}

// Função para listar todos os clientes ou buscar clientes por CPF
async function listarAgendamentos() {
    const data = document.getElementById("data").value.trim(); // Pega o valor do CPF digitado no input

    let url = "/agendamentos"; // URL padrão para todos os clientes

    if (data) {
        // Se CPF foi digitado, adiciona o parâmetro de consulta
        url += `?data=${data}`;
    }

    try {
        const response = await fetch(url);
        const agendamentos = await response.json();

        const tabela = document.getElementById("tabela-agendamentos");
        tabela.innerHTML = ""; // Limpa a tabela antes de preencher

        if (agendamentos.length === 0) {
            // Caso não encontre clientes, exibe uma mensagem
            tabela.innerHTML =
                '<tr><td colspan="6">Nenhum agendamento encontrado.</td></tr>';
        } else {
            agendamentos.forEach(agendamento => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${agendamento.id}</td>
                    <td>${agendamento.data}</td>
                    <td>${agendamento.horario}</td>
                    <td>${agendamento.cpf_cliente}</td>
                    <td>${agendamento.cpf_barbeiro}</td>
                    <td>${agendamento.id_servico}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error("Erro ao listar agendamentos:", error);
    }
}
