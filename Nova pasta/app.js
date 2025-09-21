let itens = [];

const elTitulo = document.getElementById('exp-titulo');
const elTexto  = document.getElementById('exp-texto');
const elAcao   = document.getElementById('exp-acao');
const elCodigo = document.getElementById('exp-codigo');

const trechos = {
  aplicarDados: `// Atualiza a identificação do boletim
const aluno = document.getElementById('aluno').value;
const professor = document.getElementById('professor').value;
const turma = document.getElementById('turma').value;
const ano = document.getElementById('ano').value;
document.getElementById('identificacao').textContent =
\`Aluno: \${aluno}, Professor: \${professor}, Turma: \${turma}, Ano \${ano}\`;`,
  adicionarLinha: `// Cria nova linha na tabela
const corpo = document.querySelector('#tabela tbody');
const tr = document.createElement('tr');
// Preenche com dados da disciplina
corpo.appendChild(tr);`,
  recalcularMedias: `// Recalcula médias e faltas
const mediaS = itens.reduce((a, it) => a + it.nota, 0) / itens.length;
const somaPesos = itens.reduce((a, it) => a + it.peso, 0);
const mediaP = itens.reduce((a, it) => a + it.nota * it.peso, 0) / somaPesos;
const faltas = itens.reduce((a, it) => a + it.faltas, 0);`,
  limparTabela: `// Remove todas as disciplinas
itens = [];
renderizar();`
};

function explicarElemento(el) {
  const ajuda = el.getAttribute('data-help') || 'Sem explicação disponível';
  elTitulo.textContent = 'Item selecionado';
  elTexto.textContent = ajuda;
  if (el.tagName === 'INPUT') {
    elCodigo.textContent = `<input id="${el.id}" type="${el.type}" placeholder="${el.placeholder}">`;
  } else if (el.tagName === 'BUTTON') {
    elCodigo.textContent = `<button>${el.textContent}</button>`;
  } else {
    elCodigo.textContent = '// Ação aguardando interação';
  }
}

function situacao(nota) {
  if (nota >= 6) return 'Aprovado';
  if (nota >= 4) return 'Recuperação';
  return 'Reprovado';
}

function mediaSimples() {
  if (itens.length === 0) return 0;
  const soma = itens.reduce((acc, it) => acc + it.nota, 0);
  return soma / itens.length;
}

function mediaPonderada() {
  if (itens.length === 0) return 0;
  const somaPesos = itens.reduce((acc, it) => acc + it.peso, 0);
  if (somaPesos === 0) return 0;
  const soma = itens.reduce((acc, it) => acc + it.nota * it.peso, 0);
  return soma / somaPesos;
}

function totalFaltas() {
  return itens.reduce((acc, it) => acc + it.faltas, 0);
}

function renderizar() {
  const corpo = document.querySelector('#tabela tbody');
  corpo.innerHTML = '';
  itens.forEach(it => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${it.materia}</td>
      <td>${it.nota.toFixed(2).replace('.', ',')}</td>
      <td>${it.peso}</td>
      <td>${it.faltas}</td>
      <td>${situacao(it.nota)}</td>
    `;
    corpo.appendChild(tr);
  });

  document.getElementById('media-simples').textContent = mediaSimples().toFixed(2).replace('.', ',');
  document.getElementById('media-pond').textContent   = mediaPonderada().toFixed(2).replace('.', ',');
  document.getElementById('soma-faltas').textContent  = totalFaltas();

  elAcao.textContent = 'Tabela atualizada e resultados recalculados';
  elCodigo.textContent = trechos.recalcularMedias;
}

document.querySelectorAll('[data-help]').forEach(el => {
  el.addEventListener('focus', () => explicarElemento(el));
  el.addEventListener('click', () => explicarElemento(el));
});

document.getElementById('form-dados').addEventListener('submit', function(e) {
  e.preventDefault();
  const aluno = document.getElementById('aluno').value.trim() || 'Aluno não informado';
  const professor = document.getElementById('professor').value.trim() || 'Professor não informado';
  const turma = document.getElementById('turma').value.trim() || 'Turma não informada';
  const ano = document.getElementById('ano').value || new Date().getFullYear();

  document.getElementById('identificacao').textContent =
    `Aluno: ${aluno}, Professor: ${professor}, Turma: ${turma}, Ano ${ano}`;

  elAcao.textContent = 'Identificação atualizada';
  elCodigo.textContent = trechos.aplicarDados;
});

document.getElementById('form-itens').addEventListener('submit', function(e) {
  e.preventDefault();
  const materia = document.getElementById('materia').value.trim();
  const nota = parseFloat(document.getElementById('nota').value);
  const peso = parseInt(document.getElementById('peso').value, 10);
  const faltas = parseInt(document.getElementById('faltas').value, 10) || 0;

  if (!materia) { alert('Digite a disciplina'); return; }
  if (isNaN(nota) || nota < 0 || nota > 10) { alert('Nota deve estar entre 0 e 10'); return; }
  if (isNaN(peso) || peso < 1) { alert('Peso deve ser um número inteiro ≥ 1'); return; }
  if (isNaN(faltas) || faltas < 0) { alert('Faltas não podem ser negativas'); return; }

  const item = { materia, nota, peso, faltas };
  itens.push(item);
  renderizar();

  document.getElementById('materia').value = '';
  document.getElementById('nota').value = '';
  document.getElementById('peso').value = 1;
  document.getElementById('faltas').value = 0;
  document.getElementById('materia').focus();

  elAcao.textContent = 'Disciplina lançada com sucesso';
  elCodigo.textContent = trechos.adicionarLinha;
});

document.getElementById('limpar').addEventListener('click', function() {
  if (itens.length === 0) { elAcao.textContent = 'Nenhum item para apagar'; return; }
  const ok = confirm('Deseja realmente apagar todas as disciplinas?');
  if (!ok) return;

  itens = [];
  renderizar();
  elAcao.textContent = 'Todas as disciplinas foram removidas';
  elCodigo.textContent = trechos.limparTabela;
});
