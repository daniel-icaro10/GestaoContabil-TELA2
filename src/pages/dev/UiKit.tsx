import { useState, type ReactNode } from 'react'
import { Download, Eye, FileText, Plus, Receipt, Send, Trash2 } from 'lucide-react'
import {
  Avatar,
  Badge,
  Banner,
  Button,
  Card,
  CardHeader,
  Chips,
  Dropzone,
  EmptyState,
  ErrorState,
  Field,
  IconButton,
  Input,
  Modal,
  PageTitle,
  Progress,
  RowActions,
  SearchInput,
  Select,
  Skeleton,
  SkeletonText,
  StatCard,
  Table,
  Tabs,
  Td,
  Textarea,
  Toggle,
} from '../../components/ui'
import { ThemeToggle } from '../../components/Theme'
import { Logo } from '../../components/Logo'
import { brl, formatDate } from '../../lib/utils'

/**
 * Vitrine dos tokens e componentes base.
 * Rota disponível apenas em desenvolvimento: /ui
 */

const guias = [
  { id: 1, nome: 'DAS — Simples Nacional', comp: '10/2026', venc: '2026-11-20', valor: 1234.56, status: 'pago' },
  { id: 2, nome: 'FGTS', comp: '10/2026', venc: '2026-11-25', valor: 842.1, status: 'aberto' },
  { id: 3, nome: 'INSS (GPS)', comp: '10/2026', venc: '2026-11-18', valor: 2310, status: 'vencido' },
  { id: 4, nome: 'ISS', comp: '10/2026', venc: '2026-12-10', valor: 315.4, status: 'processando' },
] as const

const statusBadge = {
  pago: <Badge tone="success">Paga</Badge>,
  aberto: <Badge tone="warning">A vencer</Badge>,
  vencido: <Badge tone="danger">Vencida</Badge>,
  processando: <Badge tone="info">Processando</Badge>,
}

const swatches: { name: string; var: string; text?: string }[] = [
  { name: 'Primária', var: '--primary' },
  { name: 'Primária hover', var: '--primary-hover' },
  { name: 'Primária suave', var: '--primary-soft', text: 'ink' },
  { name: 'Secundária', var: '--secondary' },
  { name: 'Texto', var: '--ink' },
  { name: 'Texto secundário', var: '--ink-muted' },
  { name: 'Fundo app', var: '--canvas', text: 'ink' },
  { name: 'Card', var: '--surface', text: 'ink' },
  { name: 'Superfície alt.', var: '--surface-alt', text: 'ink' },
  { name: 'Borda', var: '--line', text: 'ink' },
  { name: 'Sucesso', var: '--success' },
  { name: 'Alerta', var: '--warning' },
  { name: 'Erro', var: '--danger' },
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-title-2 text-ink">{title}</h2>
      {children}
    </section>
  )
}

export default function UiKit() {
  const [tab, setTab] = useState<'lista' | 'carregando' | 'vazio' | 'erro'>('lista')
  const [chip, setChip] = useState<'todas' | 'abertas' | 'pagas'>('todas')
  const [toggle, setToggle] = useState(true)
  const [modal, setModal] = useState(false)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState('Outubro/2026')

  return (
    <div className="min-h-full bg-canvas">
      <header className="sticky top-0 z-40 border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden text-label text-muted sm:inline">Tema</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6">
        <PageTitle
          title="Componentes base"
          subtitle="Tokens e componentes do HUBContábil — identidade Premium Contabilidade."
          actions={
            <>
              <Button variant="secondary" icon={<Download size={16} />}>
                Exportar
              </Button>
              <Button icon={<Plus size={16} />}>Nova solicitação</Button>
            </>
          }
        />

        <Section title="Cores">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {swatches.map((s) => (
              <div key={s.var} className="overflow-hidden rounded-xl border border-line bg-surface">
                <div className="h-14 border-b border-line" style={{ background: `var(${s.var})` }} />
                <div className="px-3 py-2">
                  <p className="text-label font-semibold text-ink">{s.name}</p>
                  <p className="text-label text-muted">{s.var}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Tipografia">
          <Card className="space-y-2 p-5">
            <p className="text-title-1">Título 1 — 24px / 700</p>
            <p className="text-title-2">Título 2 — 20px / 600</p>
            <p className="text-title-3">Título 3 — 16px / 600</p>
            <p className="text-body">Corpo — 14px / 400. As guias do mês já estão disponíveis para download.</p>
            <p className="text-body text-muted">Texto secundário — 14px, cor #64748B.</p>
            <p className="text-label font-medium text-subtle">Label — 12px / 500</p>
            <p className="num text-title-2">{brl(1234.56)} · {formatDate('2026-11-23')}</p>
          </Card>
        </Section>

        <Section title="Botões">
          <Card className="space-y-4 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primário</Button>
              <Button variant="secondary">Secundário</Button>
              <Button variant="outline">Contorno</Button>
              <Button variant="soft">Suave</Button>
              <Button variant="ghost">Fantasma</Button>
              <Button variant="danger" icon={<Trash2 size={16} />}>
                Excluir
              </Button>
              <Button loading>Enviando</Button>
              <Button disabled>Desabilitado</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Pequeno</Button>
              <Button size="md">Médio (40px)</Button>
              <Button size="lg" icon={<Download size={16} />}>
                Baixar guia
              </Button>
              <IconButton label="Visualizar">
                <Eye size={16} />
              </IconButton>
              <IconButton label="Baixar PDF">
                <Download size={16} />
              </IconButton>
              <IconButton label="Excluir" variant="ghost">
                <Trash2 size={16} />
              </IconButton>
            </div>
          </Card>
        </Section>

        <Section title="Formulário">
          <Card className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Razão social" required>
              <Input placeholder="Ex.: Padaria Bom Pão Ltda" />
            </Field>
            <Field label="CNPJ" error="CNPJ inválido. Confira os 14 dígitos.">
              <Input defaultValue="12.345.678/0001" invalid />
            </Field>
            <Field label="Competência" hint="Mês de referência da guia.">
              <Select className="w-full" value={sel} onChange={setSel} options={['Outubro/2026', 'Setembro/2026', 'Agosto/2026']} />
            </Field>
            <Field label="Buscar">
              <SearchInput value={q} onChange={setQ} placeholder="Buscar guias..." />
            </Field>
            <Field label="Mensagem para o contador" className="sm:col-span-2">
              <Textarea placeholder="Escreva sua mensagem..." />
            </Field>
            <div className="flex items-center gap-3">
              <Toggle checked={toggle} onChange={setToggle} label="Receber avisos por e-mail" />
              <span className="text-body">Receber avisos por e-mail</span>
            </div>
            <Input placeholder="Campo desabilitado" disabled />
          </Card>
        </Section>

        <Section title="Badges de status">
          <Card className="flex flex-wrap items-center gap-2 p-5">
            <Badge tone="success">Paga</Badge>
            <Badge tone="warning">A vencer</Badge>
            <Badge tone="danger">Vencida</Badge>
            <Badge tone="info">Processando</Badge>
            <Badge tone="primary" icon={<FileText size={13} />}>
              Novo documento
            </Badge>
            <Badge tone="neutral">Rascunho</Badge>
            <Badge tone="success" dot>
              Online
            </Badge>
          </Card>
        </Section>

        <Section title="Cards-resumo">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Guias do mês" value={brl(4702.06)} sub="4 guias · 1 vencida" icon={<Receipt size={18} />} />
            <StatCard label="Notas emitidas" value="38" sub={`${brl(84320)} faturados`} icon={<FileText size={18} />} />
            <StatCard label="Folha do mês" value={brl(28450.9)} sub="12 colaboradores" progress={72} />
            <StatCard label="Mensagens não lidas" value="3" sub="Última há 2 horas" icon={<Send size={18} />} />
          </div>
        </Section>

        <Section title="Banner de pendência">
          <Banner
            tone="warning"
            icon={<Receipt size={18} />}
            title="FGTS vence em 2 dias"
            text={`${brl(842.1)} · vencimento ${formatDate('2026-11-25')}`}
            action={<Button icon={<Download size={16} />}>Baixar guia</Button>}
          />
        </Section>

        <Section title="Tabela e estados">
          <Card>
            <CardHeader
              title="Guias"
              subtitle="Alterne as abas para ver os estados obrigatórios"
              right={
                <Chips
                  value={chip}
                  onChange={setChip}
                  options={[
                    { value: 'todas', label: 'Todas' },
                    { value: 'abertas', label: 'Abertas' },
                    { value: 'pagas', label: 'Pagas' },
                  ]}
                />
              }
            />
            <Tabs
              className="px-5"
              value={tab}
              onChange={setTab}
              tabs={[
                { value: 'lista', label: 'Com dados' },
                { value: 'carregando', label: 'Carregando' },
                { value: 'vazio', label: 'Vazio' },
                { value: 'erro', label: 'Erro' },
              ]}
            />
            <Table
              caption="Guias do mês"
              head={['Guia', 'Competência', 'Vencimento', 'Valor', 'Status', 'Ações']}
              align={['left', 'left', 'left', 'right', 'left', 'right']}
              loading={tab === 'carregando'}
              error={tab === 'erro'}
              onRetry={() => setTab('carregando')}
              empty={
                <EmptyState
                  icon={Receipt}
                  title="Nenhuma guia neste mês"
                  description="Quando o contador gerar suas guias, elas aparecem aqui."
                  action={<Button variant="secondary">Falar com o contador</Button>}
                />
              }
            >
              {tab === 'lista' &&
                guias.map((g) => (
                  <tr key={g.id}>
                    <Td className="font-medium">{g.nome}</Td>
                    <Td>{g.comp}</Td>
                    <Td>{formatDate(g.venc)}</Td>
                    <Td num>{brl(g.valor)}</Td>
                    <Td>{statusBadge[g.status]}</Td>
                    <Td right>
                      <RowActions>
                        <IconButton label="Visualizar" variant="ghost">
                          <Eye size={16} />
                        </IconButton>
                        <IconButton label="Baixar guia" variant="ghost">
                          <Download size={16} />
                        </IconButton>
                      </RowActions>
                    </Td>
                  </tr>
                ))}
            </Table>
          </Card>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="space-y-3 p-5">
              <p className="text-label font-medium text-muted">Skeleton</p>
              <Skeleton className="h-8 w-1/2" />
              <SkeletonText lines={3} />
            </Card>
            <Card>
              <EmptyState title="Nenhuma mensagem" description="Converse com seu contador por aqui." action={<Button size="sm">Nova mensagem</Button>} />
            </Card>
            <Card>
              <ErrorState onRetry={() => {}} />
            </Card>
          </div>
        </Section>

        <Section title="Upload, progresso, avatar e modal">
          <div className="grid gap-4 md:grid-cols-2">
            <Dropzone title="Arraste arquivos aqui ou clique para enviar" hint="PDF, XML ou imagem · até 10 MB" onFiles={() => {}} />
            <Card className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <Avatar text="PC" gradient />
                <Avatar text="MS" />
                <Avatar text="JL" />
                <Avatar text="AR" />
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-label text-muted">
                  <span>extrato-outubro.pdf</span>
                  <span className="num">64%</span>
                </div>
                <Progress value={64} label="Enviando extrato-outubro.pdf" />
              </div>
              <Button variant="secondary" onClick={() => setModal(true)}>
                Abrir modal
              </Button>
            </Card>
          </div>
        </Section>
      </main>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Enviar documento"
        subtitle="O contador será notificado."
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setModal(false)}>Enviar</Button>
          </>
        }
      >
        <Field label="Descrição">
          <Input placeholder="Ex.: extrato bancário de outubro" />
        </Field>
      </Modal>
    </div>
  )
}
