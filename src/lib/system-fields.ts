// Field definitions for the /sistema Briefing form and Checklist.
// Keeps the UI layer declarative so ordering and labels stay consistent.

export type FieldType = "text" | "textarea" | "date" | "time" | "number" | "boolean" | "select";

export interface BriefingField {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  required?: boolean;
  full?: boolean;
}

export interface BriefingSection {
  id: number;
  title: string;
  fields: BriefingField[];
}

export const BRIEFING_SECTIONS: BriefingSection[] = [
  {
    id: 1,
    title: "Informações Gerais do Evento",
    fields: [
      { name: "nome_evento", label: "Nome do evento", type: "text", required: true },
      { name: "empresa", label: "Empresa / cliente", type: "text" },
      { name: "contato", label: "Contato do cliente (telefone / e-mail)", type: "text", required: true },
      {
        name: "tipo_evento",
        label: "Tipo do evento",
        type: "select",
        options: ["Casamento", "Aniversário", "Corporativo", "Formatura", "Outro"],
      },
      { name: "local_evento", label: "Local do evento", type: "text" },
      { name: "pacote", label: "Pacote do evento", type: "text" },
      { name: "data", label: "Data", type: "date", required: true },
      { name: "horario_inicio", label: "Horário do início", type: "time" },
      { name: "horario_termino", label: "Horário de término", type: "time" },
      { name: "convidados_estimados", label: "Convidados estimados", type: "number" },
    ],
  },
  {
    id: 2,
    title: "Alimentos e Bebidas",
    fields: [
      { name: "buffet", label: "Buffet contratado", type: "text" },
      { name: "tipo_coffee", label: "Tipo de coffee", type: "text" },
      { name: "horario_servico", label: "Horário do serviço", type: "time" },
      { name: "bebida_alcoolica", label: "Haverá bebida alcoólica?", type: "boolean" },
      { name: "restricoes_alimentares", label: "Restrições alimentares?", type: "boolean" },
      { name: "restricoes_obs", label: "Observações de restrições", type: "textarea", full: true },
      { name: "responsavel_buffet", label: "Responsável pelo buffet", type: "text" },
    ],
  },
  {
    id: 3,
    title: "Equipamentos e Operação Técnica",
    fields: [
      { name: "sonorizacao", label: "Sonorização", type: "text" },
      { name: "iluminacao", label: "Iluminação", type: "text" },
      { name: "telao", label: "Telão / LED", type: "text" },
      { name: "microfones", label: "Microfones", type: "text" },
      { name: "atracao", label: "DJ / Banda / Atração", type: "text" },
      { name: "gerador", label: "Gerador", type: "text" },
      { name: "equipamentos_externos", label: "Equipamentos externos", type: "textarea", full: true },
    ],
  },
  {
    id: 4,
    title: "Decoração e Ambientação",
    fields: [
      { name: "decoracao", label: "Haverá decoração / montagem / estrutura?", type: "boolean" },
      { name: "horario_montagem", label: "Horário de montagem", type: "time" },
      { name: "estilo_decoracao", label: "Estilo da decoração", type: "text" },
      { name: "painel_fotografia", label: "Painel / fotografia", type: "text" },
      { name: "observacoes", label: "Observações importantes", type: "textarea", full: true },
    ],
  },
  {
    id: 5,
    title: "Equipe Extra Necessária",
    fields: [
      { name: "credenciamento", label: "Credenciamento?", type: "boolean" },
      { name: "limpeza_durante", label: "Limpeza durante o evento?", type: "boolean" },
      { name: "valet", label: "Valet?", type: "boolean" },
      { name: "cerimonial", label: "Cerimonial?", type: "boolean" },
    ],
  },
];

export const FOOTER_FIELDS: BriefingField[] = [
  { name: "responsavel", label: "Responsável pelo preenchimento", type: "text" },
  { name: "data_preenchimento", label: "Data de preenchimento", type: "date" },
];

export const ALL_BRIEFING_FIELDS: BriefingField[] = [
  ...BRIEFING_SECTIONS.flatMap((s) => s.fields),
  ...FOOTER_FIELDS,
];

export interface ChecklistItem {
  key: string;
  label: string;
  withWho?: boolean;
}

export interface ChecklistBlock {
  id: "auditorio" | "rooftop";
  title: string;
  items: ChecklistItem[];
}

export const CHECKLIST_BLOCKS: ChecklistBlock[] = [
  {
    id: "auditorio",
    title: "Auditório",
    items: [
      { key: "teste_microfones", label: "Teste de microfones" },
      { key: "pilhas_microfones", label: "Pilhas de microfones" },
      { key: "teste_som", label: "Teste de som" },
      { key: "teste_telao", label: "Teste do telão" },
      { key: "teste_projetor", label: "Teste de projetor" },
      { key: "operador_som", label: "Operador de som / telão" },
      { key: "ar_condicionado", label: "Checagem de ar-condicionado" },
      { key: "luzes", label: "Checagem de luzes" },
      { key: "agua_copa", label: "Checagem de água e copa" },
      { key: "descargas", label: "Checagem de descargas de banheiros" },
      { key: "pias", label: "Verificação de pias de banheiros" },
      { key: "portas_trincos", label: "Verificação de portas e trincos" },
      { key: "recepcionista", label: "Recepcionista" },
      { key: "limpeza_pre", label: "Limpeza pré-evento", withWho: true },
      { key: "limpeza_pos", label: "Limpeza pós-evento", withWho: true },
    ],
  },
  {
    id: "rooftop",
    title: "Rooftop",
    items: [
      { key: "teste_televisao", label: "Teste de televisão" },
      { key: "luzes", label: "Checagem de luzes" },
      { key: "ar_condicionado", label: "Checagem de ar-condicionado" },
      { key: "descargas", label: "Checagem de descargas de banheiros" },
      { key: "pias", label: "Verificação de pias de banheiros" },
      { key: "freezer_geladeira", label: "Verificar funcionamento do freezer e geladeira do bar" },
      { key: "portas_trincos", label: "Verificação de portas e trincos" },
      { key: "recepcionista", label: "Recepcionista" },
      { key: "limpeza_pre", label: "Limpeza pré-evento", withWho: true },
      { key: "limpeza_pos", label: "Limpeza pós-evento", withWho: true },
    ],
  },
];

export function computeStatus(event: any): "Briefing pendente" | "Confirmado" | "Realizado" {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const evDate = event?.data ? new Date(event.data) : null;
  if (evDate && evDate < today) return "Realizado";
  const missing = !event?.nome_evento || !event?.contato || !event?.data;
  if (missing) return "Briefing pendente";
  return "Confirmado";
}

export function checklistProgress(items: any, block: ChecklistBlock) {
  const done = block.items.filter((it) => items?.[block.id]?.[it.key]).length;
  return { done, total: block.items.length };
}
