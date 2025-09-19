   
        document.addEventListener('DOMContentLoaded', function() {
            const connectBtn = document.getElementById('connectDB');
            const clearBtn = document.getElementById('clearDB');
            const dbStatus = document.getElementById('dbStatus');
            const dataTable = document.getElementById('dataTable');
            
            let dbConnected = false;
            let database = [];
            
            // Conectar ao banco de dados (simulado)
            connectBtn.addEventListener('click', function() {
                dbConnected = !dbConnected;
                
                if (dbConnected) {
                    dbStatus.textContent = "Conectado ao banco de dados";
                    dbStatus.className = "db-status connected";
                    connectBtn.innerHTML = '<i class="fas fa-plug"></i> Desconectar do BD';
                    connectBtn.classList.add('btn-clear');
                    connectBtn.classList.remove('btn-connect');
                    
                    // Carregar dados do localStorage se existirem
                    const savedData = localStorage.getItem('barberShopMinors');
                    if (savedData) {
                        database = JSON.parse(savedData);
                        updateDataTable();
                    }
                } else {
                    dbStatus.textContent = "Banco de dados desconectado";
                    dbStatus.className = "db-status disconnected";
                    connectBtn.innerHTML = '<i class="fas fa-plug"></i> Conectar ao BD';
                    connectBtn.classList.add('btn-connect');
                    connectBtn.classList.remove('btn-clear');
                    
                    dataTable.querySelector('tbody').innerHTML = `
                        <tr>
                            <td colspan="6">
                                <div class="empty-data">
                                    <i class="fas fa-database" style="font-size: 50px; margin-bottom: 15px;"></i>
                                    <p>Nenhum dado cadastrado ainda.</p>
                                    <p>Conecte ao banco de dados e preencha o formulário.</p>
                                </div>
                            </td>
                        </tr>
                    `;
                }
            });
            
            // Limpar banco de dados
            clearBtn.addEventListener('click', function() {
                if (dbConnected) {
                    if (confirm("Tem certeza que deseja limpar todos os dados do banco?")) {
                        database = [];
                        localStorage.removeItem('barberShopMinors');
                        updateDataTable();
                    }
                } else {
                    alert("Conecte ao banco de dados primeiro.");
                }
            });
            
            // Validar formulário e salvar no banco
            document.getElementById('registrationForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!dbConnected) {
                    alert("Conecte ao banco de dados primeiro.");
                    return;
                }
                
                const minorName = document.getElementById('minorName').value;
                const minorBirthdate = document.getElementById('minorBirthdate').value;
                const minorGender = document.getElementById('minorGender').value;
                const responsibleName = document.getElementById('responsibleName').value;
                const responsibleCPF = document.getElementById('responsibleCPF').value;
                const responsiblePhone = document.getElementById('responsiblePhone').value;
                const responsibleRelation = document.getElementById('responsibleRelation').value;
                const agreeTerms = document.getElementById('agreeTerms').checked;
                
                if (!minorName || !minorBirthdate || !minorGender || !responsibleName || !responsibleCPF || !responsiblePhone || !responsibleRelation) {
                    alert('Por favor, preencha todos os campos obrigatórios do menor de idade e do responsável.');
                    return;
                }
                
                if (!agreeTerms) {
                    alert('Você precisa concordar com os termos de responsabilidade para cadastrar um menor.');
                    return;
                }
                
                // Verificar se é realmente menor de idade
                const birthDate = new Date(minorBirthdate);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                
                if (age >= 18) {
                    alert('A pessoa cadastrada deve ser menor de 18 anos.');
                    return;
                }
                
                // Coletar dados do formulário
                const formData = {
                    id: Date.now(), // ID único baseado no timestamp
                    minor: {
                        name: minorName,
                        birthdate: minorBirthdate,
                        gender: minorGender,
                        allergies: document.getElementById('minorAllergies').value,
                        sensoryInfo: document.getElementById('sensoryInfo').value
                    },
                    responsible: {
                        name: responsibleName,
                        cpf: responsibleCPF,
                        phone: responsiblePhone,
                        relation: responsibleRelation
                    },
                    agreedToTerms: agreeTerms,
                    registrationDate: new Date().toLocaleString('pt-BR')
                };
                
                // Adicionar ao banco de dados
                database.push(formData);
                
                // Salvar no localStorage (simulando banco de dados)
                localStorage.setItem('barberShopMinors', JSON.stringify(database));
                
                // Atualizar a tabela
                updateDataTable();
                
                // Limpar formulário
                this.reset();
                
                alert('Cadastro realizado com sucesso e salvo no banco de dados!');
            });
            
            // Atualizar tabela de dados
            function updateDataTable() {
                const tbody = dataTable.querySelector('tbody');
                
                if (database.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="6">
                                <div class="empty-data">
                                    <i class="fas fa-database" style="font-size: 50px; margin-bottom: 15px;"></i>
                                    <p>Nenhum dado cadastrado ainda.</p>
                                    <p>Preencha o formulário para adicionar registros.</p>
                                </div>
                            </td>
                        </tr>
                    `;
                    return;
                }
                
                tbody.innerHTML = '';
                
                database.forEach(item => {
                    // Calcular idade
                    const birthDate = new Date(item.minor.birthdate);
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    
                    // Definir classe de idade
                    let ageClass = 'age-high';
                    if (age < 10) ageClass = 'age-low';
                    else if (age < 15) ageClass = 'age-medium';
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.minor.name}</td>
                        <td><span class="age-badge ${ageClass}">${age} anos</span></td>
                        <td>${item.responsible.name}</td>
                        <td>${item.responsible.relation}</td>
                        <td>${item.responsible.phone}</td>
                        <td>
                            <button class="action-btn btn-edit" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                            <button class="action-btn btn-delete" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                        </td>
                    `;
                    
                    tbody.appendChild(row);
                });
                
                // Adicionar eventos aos botões
                document.querySelectorAll('.btn-delete').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = parseInt(this.getAttribute('data-id'));
                        deleteRecord(id);
                    });
                });
                
                document.querySelectorAll('.btn-edit').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = parseInt(this.getAttribute('data-id'));
                        editRecord(id);
                    });
                });
            }
            
            // Excluir registro
            function deleteRecord(id) {
                if (confirm("Tem certeza que deseja excluir este registro?")) {
                    database = database.filter(item => item.id !== id);
                    localStorage.setItem('barberShopMinors', JSON.stringify(database));
                    updateDataTable();
                }
            }
            
            // Editar registro (simulação)
            function editRecord(id) {
                const record = database.find(item => item.id === id);
                if (record) {
                    alert(`Editar registro: ${record.minor.name}\n\nEm um sistema real, isso abriria um formulário de edição.`);
                }
            }
        });
    
    