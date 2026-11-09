import { useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Badge, Button, Modal, Toggle } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { cn } from '../../lib/utils'
import {
  MODULES,
  PLAN_MODULES,
  getOfficeModules,
  hasCustomModules,
  setOfficeModules,
  type ModuleKey,
} from '../../lib/modules'
import type { Office } from './data'
import { PlanBadge } from './shared'

const GROUPS = ['Operação do Escritório', 'Portal dos Clientes', 'Avançado'] as const

/** Modal onde o Super Admin liga/desliga os módulos de um escritório. */
export function OfficeModulesModal({ office, onClose }: { office: Office | null; onClose: () => void }) {
  const toast = useToast()
  const [active, setActive] = useState<ModuleKey[]>([])

  useEffect(() => {
    if (office) setActive(getOfficeModules(office.id, office.plan))
  }, [office])

  if (!office) return null
  const planMods = PLAN_MODULES[office.plan]
  const extras = active.filter((k) => !planMods.includes(k))
  const removed = planMods.filter((k) => !active.includes(k))

  const toggle = (k: ModuleKey, on: boolean) => setActive((a) => (on ? [...a, k] : a.filter((x) => x !== k)))

  function save() {
    const same = active.length === planMods.length && planMods.every((k) => active.includes(k))
    setOfficeModules(office!.id, same ? null : active)
    toast(`Módulos de ${office!.name} atualizados (${active.length} ativos).`)
    onClose()
  }

  return (
    <Modal
      open
      onClose={onClose}
      width="max-w-2xl"
      title={`Módulos — ${office.name}`}
      subtitle="Defina o que este escritório e os clientes dele podem acessar"
      footer={
        <>
          <Button variant="ghost" icon={<RotateCcw size={14} />} onClick={() => setActive(planMods)} className="mr-auto">
            Restaurar padrão do plano
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={save}>Salvar módulos</Button>
        </>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-slate-50 px-4 py-3 text-xs text-slate-600">
        Plano <PlanBadge plan={office.plan} /> inclui <b className="text-ink">{planMods.length}</b> módulos.
        <span className="ml-auto flex gap-2">
          {extras.length > 0 && <Badge tone="violet">+{extras.length} adicional(is)</Badge>}
          {removed.length > 0 && <Badge tone="amber">−{removed.length} removido(s)</Badge>}
          {extras.length === 0 && removed.length === 0 && <Badge tone="green">Padrão do plano</Badge>}
        </span>
      </div>

      <div className="space-y-5">
        {GROUPS.map((g) => (
          <div key={g}>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted">{g}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {MODULES.filter((m) => m.group === g).map((m) => {
                const on = active.includes(m.key)
                const inPlan = planMods.includes(m.key)
                return (
                  <label
                    key={m.key}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition',
                      on ? 'border-brand/30 bg-brand/5' : 'border-line bg-surface hover:bg-slate-50',
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[13px] font-semibold text-ink">{m.label}</span>
                        {inPlan ? <Badge tone="gray">no plano</Badge> : on && <Badge tone="violet">adicional</Badge>}
                      </div>
                      <p className="mt-0.5 text-[11px] leading-snug text-muted">{m.desc}</p>
                    </div>
                    <Toggle checked={on} onChange={(v) => toggle(m.key, v)} />
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

/** Resumo "8/14" usado na tabela de escritórios. */
export function ModulesCount({ office, onClick }: { office: Office; onClick: () => void }) {
  const n = getOfficeModules(office.id, office.plan).length
  const custom = hasCustomModules(office.id)
  return (
    <button
      onClick={onClick}
      title="Configurar módulos"
      className={cn(
        'num inline-flex cursor-pointer items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] transition hover:border-brand/40 hover:text-brand',
        custom ? 'border-violet-200 bg-violet-50 text-violet-600' : 'border-line text-slate-600',
      )}
    >
      {n}/{MODULES.length}
    </button>
  )
}
