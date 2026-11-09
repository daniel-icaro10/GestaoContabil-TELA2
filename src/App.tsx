import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PortalLayout } from './components/PortalLayout'
import { adminPortal, escritorioPortal, pjPortal, pfPortal } from './portals'
import Login from './pages/Login'
import { RequireAuth } from './lib/auth'

import SaDashboard from './pages/admin/Dashboard'
import SaEscritorios from './pages/admin/Escritorios'
import SaUsuarios from './pages/admin/Usuarios'
import SaPlanos from './pages/admin/Planos'
import SaAssinaturas from './pages/admin/Assinaturas'
import SaConfiguracoes from './pages/admin/Configuracoes'

import EsDashboard from './pages/escritorio/Dashboard'
import EsClientes from './pages/escritorio/Clientes'
import EsClienteDetalhe from './pages/escritorio/ClienteDetalhe'
import EsEquipe from './pages/escritorio/Equipe'
import EsDP from './pages/escritorio/DepartamentoPessoal'
import EsTributos from './pages/escritorio/Tributos'
import EsNotas from './pages/escritorio/NotasFiscais'
import EsDocumentos from './pages/escritorio/Documentos'
import EsSolicitacoes from './pages/escritorio/Solicitacoes'
import EsFinanceiro from './pages/escritorio/Financeiro'
import EsRelatorios from './pages/escritorio/Relatorios'
import EsWhiteLabel from './pages/escritorio/WhiteLabel'
import EsConfiguracoes from './pages/escritorio/Configuracoes'

import PjDashboard from './pages/pj/Dashboard'
import PjGuias from './pages/pj/Guias'
import PjNotas from './pages/pj/NotasFiscais'
import PjFolha from './pages/pj/Folha'
import PjSocios from './pages/pj/Socios'
import PjDocumentos from './pages/pj/Documentos'
import PjCertificado from './pages/pj/Certificado'
import PjSolicitacoes from './pages/pj/Solicitacoes'
import PjFinanceiro from './pages/pj/Financeiro'
import PjEmpresa from './pages/pj/DadosEmpresa'
import PjConfiguracoes from './pages/pj/Configuracoes'

import PfDashboard from './pages/pf/Dashboard'
import PfImpostoRenda from './pages/pf/ImpostoRenda'
import PfObrigacoes from './pages/pf/Obrigacoes'
import PfDocumentos from './pages/pf/Documentos'
import PfSolicitacoes from './pages/pf/Solicitacoes'
import PfFinanceiro from './pages/pf/Financeiro'
import PfDados from './pages/pf/DadosPessoais'
import PfConfiguracoes from './pages/pf/Configuracoes'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<RequireAuth portal="admin"><PortalLayout cfg={adminPortal} /></RequireAuth>}>
          <Route index element={<SaDashboard />} />
          <Route path="escritorios" element={<SaEscritorios />} />
          <Route path="usuarios" element={<SaUsuarios />} />
          <Route path="planos" element={<SaPlanos />} />
          <Route path="assinaturas" element={<SaAssinaturas />} />
          <Route path="configuracoes" element={<SaConfiguracoes />} />
        </Route>

        <Route path="/escritorio" element={<RequireAuth portal="escritorio"><PortalLayout cfg={escritorioPortal} /></RequireAuth>}>
          <Route index element={<EsDashboard />} />
          <Route path="clientes" element={<EsClientes />} />
          <Route path="clientes/:id" element={<EsClienteDetalhe />} />
          <Route path="equipe" element={<EsEquipe />} />
          <Route path="dp" element={<EsDP />} />
          <Route path="tributos" element={<EsTributos />} />
          <Route path="notas" element={<EsNotas />} />
          <Route path="documentos" element={<EsDocumentos />} />
          <Route path="solicitacoes" element={<EsSolicitacoes />} />
          <Route path="financeiro" element={<EsFinanceiro />} />
          <Route path="relatorios" element={<EsRelatorios />} />
          <Route path="white-label" element={<EsWhiteLabel />} />
          <Route path="configuracoes" element={<EsConfiguracoes />} />
        </Route>

        <Route path="/pj" element={<RequireAuth portal="pj"><PortalLayout cfg={pjPortal} /></RequireAuth>}>
          <Route index element={<PjDashboard />} />
          <Route path="guias" element={<PjGuias />} />
          <Route path="notas" element={<PjNotas />} />
          <Route path="folha" element={<PjFolha />} />
          <Route path="socios" element={<PjSocios />} />
          <Route path="documentos" element={<PjDocumentos />} />
          <Route path="certificado" element={<PjCertificado />} />
          <Route path="solicitacoes" element={<PjSolicitacoes />} />
          <Route path="financeiro" element={<PjFinanceiro />} />
          <Route path="empresa" element={<PjEmpresa />} />
          <Route path="configuracoes" element={<PjConfiguracoes />} />
        </Route>

        <Route path="/pf" element={<RequireAuth portal="pf"><PortalLayout cfg={pfPortal} /></RequireAuth>}>
          <Route index element={<PfDashboard />} />
          <Route path="imposto-renda" element={<PfImpostoRenda />} />
          <Route path="obrigacoes" element={<PfObrigacoes />} />
          <Route path="documentos" element={<PfDocumentos />} />
          <Route path="solicitacoes" element={<PfSolicitacoes />} />
          <Route path="financeiro" element={<PfFinanceiro />} />
          <Route path="dados" element={<PfDados />} />
          <Route path="configuracoes" element={<PfConfiguracoes />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
