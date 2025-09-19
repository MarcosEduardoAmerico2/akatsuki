// Função para buscar o relatório com filtros
function buscarAgendamentos() {
    const cpf = document.getElementById("cpf").value;
    const servico = document.getElementById("servico").value;
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;

    // Construir a URL com os parâmetros de filtro
    let url = `/agendamentos?`;
    if (cpf) url += `cpf=${cpf}&`;
    if (servico) url += `servico=${servico}&`;
    if (dataInicio) url += `dataInicio=${dataInicio}&`;
    if (dataFim) url += `dataFim=${dataFim}&`;

    // Remover o último "&" se presente
    url = url.slice(0, -1);

    // Fazer a requisição para o servidor
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Limpar a tabela
            const tabelaAgendamentos = document.getElementById("tabela-agendamentos");
            tabelaAgendamentos.innerHTML = '';

            // Preencher a tabela com os dados
            data.forEach(agendamento => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${agendamento.id}</td>
                    <td>${agendamento.cpf_cliente}</td>
                    <td>${agendamento.nome_servico}</td>
                    <td>${agendamento.horario}</td>
                    <td>${new Date(agendamento.data).toLocaleString()}</td>
                `;
                tabelaAgendamentos.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar relatórios:', error);
        });
}