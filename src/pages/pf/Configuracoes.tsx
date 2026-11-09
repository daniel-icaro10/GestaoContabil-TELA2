import { useState } from 'react'
import { Monitor, Smartphone, Download, ShieldCheck } from 'lucide-react'
import { Badge, Button, Card, Field, Input, Modal, PageTitle, Select, Tabs, Toggle } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { downloadFile } from '../../lib/utils'

type Tab = 'pref' | 'seg' | 'priv'

export default function Configuracoes() {
  const toast = useToast()
  const [tab, setTab] = useState<Tab>('pref')

  const [notif, setNotif] = useState({
    emailVenc: true,
    emailDocs: true,
    emailNews: false,
    wppVenc: true,
    wppMsg: true,
  })
  const [idioma, setIdioma] = useState('Português (Brasil)')
  const [lembrete, setLembrete] = useState('3 dias antes')

  const [senha, setSenha] = useState({ atual: '', nova: '', conf: '' })
  const [twoFa, setTwoFa] = useState(false)
  const [sessoes, setSessoes] = useState([
    { id: 1, device: 'Chrome · Windows', local: 'São Paulo, SP', quando: 'Sessão atual', icon: Monitor, atual: true },
    { id: 2, device: 'App iPhone', local: 'São Paulo, SP', quando: 'há 2 dias', icon: Smartphone, atual: false },
    { id: 3, device: 'Safari · macOS', local: 'Campinas, SP', quando: 'há 9 dias', icon: Monitor, atual: false },
  ])

  const [consent, setConsent] = useState({ marketing: false, compartilhar: true, analytics: true })
  const [excluir, setExcluir] = useState(false)

  const row = (label: string, desc: string, checked: boolean, onChange: (v: boolean) => void) => (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-[13px] font-semibold text-ink">{label}</p>
        <p className="text-xs text-muted">{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )

  const senhaOk = senha.atual && senha.nova.length >= 8 && senha.nova === senha.conf

  return (
    <div className="max-w-[820px] space-y-5">
      <PageTitle title="Configurações" subtitle="Preferências da conta, segurança e privacidade" />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'pref', label: 'Preferências' },
          { value: 'seg', label: 'Segurança' },
          { value: 'priv', label: 'Privacidade / LGPD' },
        ]}
      />

      {tab === 'pref' && (
        <>
          <Card className="p-5">
            <h3 className="text-[15px] font-bold">Notificações por e-mail</h3>
            <div className="mt-2 divide-y divide-line">
              {row('Vencimentos', 'Aviso de obrigações e honorários a vencer', notif.emailVenc, (v) => setNotif({ ...notif, emailVenc: v }))}
              {row('Novos documentos', 'Quando o contador disponibilizar um arquivo', notif.emailDocs, (v) => setNotif({ ...notif, emailDocs: v }))}
              {row('Novidades e dicas fiscais', 'Conteúdos do escritório', notif.emailNews, (v) => setNotif({ ...notif, emailNews: v }))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="text-[15px] font-bold">Notificações por WhatsApp</h3>
            <div className="mt-2 divide-y divide-line">
              {row('Lembretes de vencimento', 'Enviado para (11) 98765-4321', notif.wppVenc, (v) => setNotif({ ...notif, wppVenc: v }))}
              {row('Mensagens do contador', 'Respostas às suas solicitações', notif.wppMsg, (v) => setNotif({ ...notif, wppMsg: v }))}
            </div>
          </Card>
          <Card className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Idioma">
              <Select className="w-full" value={idioma} onChange={setIdioma} options={['Português (Brasil)', 'English', 'Español']} />
            </Field>
            <Field label="Lembrete de vencimento">
              <Select className="w-full" value={lembrete} onChange={setLembrete} options={['1 dia antes', '3 dias antes', '7 dias antes']} />
            </Field>
          </Card>
          <div className="flex justify-end">
            <Button size="lg" onClick={() => toast('Preferências salvas')}>
              Salvar preferências
            </Button>
          </div>
        </>
      )}

      {tab === 'seg' && (
        <>
          <Card className="p-5">
            <h3 className="mb-4 text-[15px] font-bold">Alterar senha</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Senha atual">
                <Input type="password" value={senha.atual} onChange={(e) => setSenha({ ...senha, atual: e.target.value })} />
              </Field>
              <Field label="Nova senha" hint="Mínimo 8 caracteres">
                <Input type="password" value={senha.nova} onChange={(e) => setSenha({ ...senha, nova: e.target.value })} />
              </Field>
              <Field label="Confirmar nova senha" hint={senha.conf && senha.conf !== senha.nova ? 'As senhas não conferem' : undefined}>
                <Input type="password" value={senha.conf} onChange={(e) => setSenha({ ...senha, conf: e.target.value })} />
              </Field>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                disabled={!senhaOk}
                onClick={() => {
                  setSenha({ atual: '', nova: '', conf: '' })
                  toast('Senha alterada com sucesso')
                }}
              >
                Atualizar senha
              </Button>
            </div>
          </Card>

          <Card className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-[14px] font-bold">Autenticação em dois fatores (2FA)</p>
                <p className="text-xs text-muted">Código de verificação enviado por SMS ou app autenticador</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={twoFa ? 'green' : 'gray'}>{twoFa ? 'Ativado' : 'Desativado'}</Badge>
              <Toggle
                checked={twoFa}
                onChange={(v) => {
                  setTwoFa(v)
                  toast(v ? '2FA ativado' : '2FA desativado', v ? 'success' : 'warning')
                }}
              />
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[15px] font-bold">Sessões ativas</h3>
              {sessoes.length > 1 && (
                <Button
                  size="sm"
                  variant="dangerOutline"
                  onClick={() => {
                    setSessoes((s) => s.filter((x) => x.atual))
                    toast('Outras sessões encerradas')
                  }}
                >
                  Encerrar outras sessões
                </Button>
              )}
            </div>
            <div className="divide-y divide-line">
              {sessoes.map((s) => (
                <div key={s.id} className="flex items-center gap-3 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <s.icon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold">{s.device}</p>
                    <p className="text-xs text-muted">
                      {s.local} · {s.quando}
                    </p>
                  </div>
                  {s.atual ? (
                    <Badge tone="green" dot>
                      Este dispositivo
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSessoes((all) => all.filter((x) => x.id !== s.id))
                        toast('Sessão encerrada', 'info')
                      }}
                    >
                      Encerrar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {tab === 'priv' && (
        <>
          <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="text-[14px] font-bold">Baixar meus dados</p>
              <p className="text-xs text-muted">Cópia de todas as suas informações armazenadas (Art. 18 da LGPD)</p>
            </div>
            <Button
              variant="outline"
              icon={<Download size={14} />}
              onClick={() => {
                downloadFile(
                  'meus_dados_maria_souza.json',
                  JSON.stringify(
                    {
                      nome: 'Maria Aparecida Souza',
                      cpf: '987.654.321-00',
                      email: 'maria.souza@email.com',
                      celular: '(11) 98765-4321',
                      cliente_desde: '2023-01',
                      consentimentos: consent,
                      exportado_em: new Date().toISOString(),
                    },
                    null,
                    2,
                  ),
                  'application/json',
                )
                toast('Exportação dos seus dados gerada')
              }}
            >
              Exportar dados
            </Button>
          </Card>

          <Card className="p-5">
            <h3 className="text-[15px] font-bold">Consentimentos</h3>
            <div className="mt-2 divide-y divide-line">
              {row(
                'Compartilhamento com a Receita Federal',
                'Necessário para transmissão de declarações e obrigações',
                consent.compartilhar,
                (v) => setConsent({ ...consent, compartilhar: v }),
              )}
              {row('Comunicações de marketing', 'Ofertas e novidades do escritório', consent.marketing, (v) =>
                setConsent({ ...consent, marketing: v }),
              )}
              {row('Dados de uso anônimos', 'Ajuda a melhorar o portal', consent.analytics, (v) => setConsent({ ...consent, analytics: v }))}
            </div>
            <div className="mt-3 flex justify-end">
              <Button onClick={() => toast('Consentimentos atualizados')}>Salvar consentimentos</Button>
            </div>
          </Card>

          <Card className="flex flex-wrap items-center justify-between gap-4 border-red-200 p-5">
            <div>
              <p className="text-[14px] font-bold text-red-600">Solicitar exclusão da conta</p>
              <p className="text-xs text-muted">Documentos fiscais serão mantidos pelo prazo legal de 5 anos</p>
            </div>
            <Button variant="dangerOutline" onClick={() => setExcluir(true)}>
              Solicitar exclusão
            </Button>
          </Card>

          <Modal
            open={excluir}
            onClose={() => setExcluir(false)}
            title="Solicitar exclusão da conta"
            footer={
              <>
                <Button variant="secondary" onClick={() => setExcluir(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setExcluir(false)
                    toast('Solicitação de exclusão enviada ao encarregado (DPO)', 'warning')
                  }}
                >
                  Confirmar solicitação
                </Button>
              </>
            }
          >
            <p className="text-[13px] text-slate-600">
              Sua solicitação será analisada pelo encarregado de dados do escritório em até 15 dias. Obrigações fiscais em
              andamento precisam ser concluídas antes do encerramento.
            </p>
          </Modal>
        </>
      )}
    </div>
  )
}
