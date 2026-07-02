## Módulo /sistema — Gestão de Eventos Rooftop Piazza Aldeota

Área interna autenticada para cadastrar clientes/eventos, preencher briefing completo e operar checklist no dia do evento.

### 1. Banco de dados (Supabase)

Nova tabela `events` (todos os campos do briefing como colunas — seções 1 a 5 + responsável e data de preenchimento) com RLS restrito a admins (`has_role(auth.uid(),'admin')`).

Nova tabela `event_checklist` com:
- `event_id` (FK)
- `responsavel` (text)
- `items` (jsonb) — mapa `{ auditorio: { microfones: true, ... , limpeza_pre_quem: "Maria" }, rooftop: {...} }`
- `briefing_done` (jsonb) — mapa `{ nome_evento: true, buffet: false, ... }` para os checkboxes "Tarefa realizada" de cada campo do briefing
- timestamps

Ambas com GRANT para authenticated/service_role, RLS admin-only.

### 2. Rotas

- `/sistema` → login (se não logado) + lista de clientes
- `/sistema/clientes/novo` → formulário de criação
- `/sistema/clientes/:id` → detalhe com abas Briefing / Checklist

Guarda de rota reaproveita fluxo do `/admin` (mesma auth + `has_role`).

### 3. Lista de clientes (`/sistema`)

- Header com logo Piazza Aldeota, título "Sistema de Eventos", botões "Novo Cliente/Evento" e "Exportar Leads"
- Busca por nome do evento / cliente / data
- Cards/tabela: nome do evento, empresa, data, contato, status derivado (`Briefing pendente` se faltam obrigatórios, `Confirmado` se completo e data futura, `Realizado` se data passada)
- Botão "Abrir" em cada linha

### 4. Formulário Novo/Editar (5 seções + rodapé)

Todos os campos listados na especificação, cada um com checkbox "Tarefa realizada" ao lado (guardado em `briefing_done`). Validação obrigatória: nome do evento, data, contato. Autosave com debounce de 800ms + botão "Salvar" visível.

### 5. Detalhe do cliente

Abas (shadcn Tabs):
- **Briefing**: mesmo formulário em modo edição, layout com cabeçalho verde escuro numerado (Seção 1..5), checkboxes à direita
- **Checklist**: blocos AUDITÓRIO e ROOFTOP com todos os itens da spec, checkboxes com autosave; campos "Quem?" ao lado de limpeza pré/pós; cabeçalho preenche evento/data automaticamente + campo responsável editável

### 6. Exportar Leads

Botão gera CSV client-side (sem depender de biblioteca xlsx pesada) com todas as colunas do briefing + colunas `auditorio_progresso` e `rooftop_progresso` no formato "X/Y". Download direto via Blob.

### 7. Identidade visual

- Verde escuro `#0F3D2E` em cabeçalhos de seção (nova classe utilitária no módulo)
- Fundo bege claro no corpo do /sistema
- Título com fonte serifada já existente no projeto (Playfair)
- Layout responsivo, checkboxes grandes para uso mobile no dia do evento
- Logo do Piazza no topo da área /sistema

### Notas técnicas

- Reutiliza `supabase` client existente e componente `Logo`
- Autosave via `useEffect` + debounce; feedback discreto "Salvo" no canto
- Checklist items definidos em constante para facilitar manutenção
- CSV escapa aspas e quebras de linha corretamente
- Não altera rotas públicas do site nem o admin existente
