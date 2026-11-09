import { FileText } from 'lucide-react'
import { loadSpedyConfig, nfseEnvLabel, spedyReady } from '../lib/spedy'
import { Badge } from './ui'

/** Faixa que mostra se a emissão de NFS-e via Spedy está ativa (configurada pelo Super Admin). */
export function SpedyStatus() {
  const cfg = loadSpedyConfig()
  const ready = spedyReady(cfg)
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface px-4 py-2.5">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00b37e] text-white">
        <FileText size={14} />
      </div>
      <p className="min-w-0 flex-1 text-xs text-slate-600">
        <b className="text-ink">Emissão via Spedy</b>
        {ready
          ? ` · notas em ${nfseEnvLabel[cfg.nfse.environmentType]} · autorização assíncrona com retorno automático da prefeitura`
          : ' · integração não configurada pelo administrador da plataforma — as notas ficam como rascunho'}
      </p>
      <Badge tone={ready ? 'green' : 'amber'} dot>
        {ready ? 'Conectado' : 'Pendente'}
      </Badge>
    </div>
  )
}
