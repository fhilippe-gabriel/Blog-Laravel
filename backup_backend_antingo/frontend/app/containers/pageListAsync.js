import Loadable from 'react-loadable';
import Loading from 'enl-components/Loading';

export const DashboardPage = Loadable({
  loader: () => import('./Pages/Dashboard'),
  loading: Loading,
});
export const AuthenticatedPage = Loadable({
  loader: () => import('./Pages/AuthenticatedPage'),
  loading: Loading,
});
export const TiposAtividades = Loadable({
  loader: () => import('./Pages/TiposAtividades'),
  loading: Loading,
});
export const TipoAtividade = Loadable({
  loader: () => import('./Pages/TiposAtividades/TipoAtividade'),
  loading: Loading,
});
export const TiposRecursos = Loadable({
  loader: () => import('./Pages/TiposRecursos'),
  loading: Loading,
});
export const TipoRecurso = Loadable({
  loader: () => import('./Pages/TiposRecursos/TipoRecurso'),
  loading: Loading,
});
export const Users = Loadable({
  loader: () => import('./Pages/Users'),
  loading: Loading,
});
export const User = Loadable({
  loader: () => import('./Pages/Users/User'),
  loading: Loading,
});
export const Clientes = Loadable({
  loader: () => import('./Pages/Clientes'),
  loading: Loading,
});
export const Atividades = Loadable({
  loader: () => import('./Pages/Atividades'),
  loading: Loading,
});
export const Atividade = Loadable({
  loader: () => import('./Pages/Atividades/Atividade'),
  loading: Loading,
});
export const Cliente = Loadable({
  loader: () => import('./Pages/Clientes/Cliente'),
  loading: Loading,
});
export const Certificados = Loadable({
  loader: () => import('./Pages/Certificados'),
  loading: Loading,
});
export const Certificado = Loadable({
  loader: () => import('./Pages/Certificados/Certificado'),
  loading: Loading,
});
export const Funcionarios = Loadable({
  loader: () => import('./Pages/Funcionarios'),
  loading: Loading,
});
export const Funcionario = Loadable({
  loader: () => import('./Pages/Funcionarios/Funcionario'),
  loading: Loading,
});
export const Jornadas = Loadable({
  loader: () => import('./Pages/Jornadas'),
  loading: Loading,
});
export const Jornada = Loadable({
  loader: () => import('./Pages/Jornadas/Jornada'),
  loading: Loading,
});
export const Cargos = Loadable({
  loader: () => import('./Pages/Cargos'),
  loading: Loading,
});
export const Cargo = Loadable({
  loader: () => import('./Pages/Cargos/Cargo'),
  loading: Loading,
});
export const Exames = Loadable({
  loader: () => import('./Pages/Exames'),
  loading: Loading,
});
export const Exame = Loadable({
  loader: () => import('./Pages/Exames/Exame'),
  loading: Loading,
});
export const Equipamentos = Loadable({
  loader: () => import('./Pages/Equipamentos'),
  loading: Loading,
});
export const Equipamento = Loadable({
  loader: () => import('./Pages/Equipamentos/Equipamento'),
  loading: Loading,
});
export const Projetos = Loadable({
  loader: () => import('./Pages/Projetos'),
  loading: Loading,
});
export const Projeto = Loadable({
  loader: () => import('./Pages/Projetos/Projeto'),
  loading: Loading,
});
export const PontosMarcacoes = Loadable({
  loader: () => import('./Pages/PontosMarcacoes'),
  loading: Loading,
});
export const PontoMarcacao = Loadable({
  loader: () => import('./Pages/PontosMarcacoes/PontoMarcacao'),
  loading: Loading,
});
export const Tarifas = Loadable({
  loader: () => import('./Pages/Tarifas'),
  loading: Loading,
});
export const Tarifa = Loadable({
  loader: () => import('./Pages/Tarifas/Tarifa'),
  loading: Loading,
});
export const TarifasPrecos = Loadable({
  loader: () => import('./Pages/TarifasPrecos'),
  loading: Loading,
});
export const TarifaPreco = Loadable({
  loader: () => import('./Pages/TarifasPrecos/TarifaPreco'),
  loading: Loading,
});
export const Table = Loadable({
  loader: () => import('./Pages/Table/BasicTable'),
  loading: Loading,
});
export const Form = Loadable({
  loader: () => import('./Pages/Forms/ReduxForm'),
  loading: Loading,
});
export const Login = Loadable({
  loader: () => import('./Pages/Users/Login'),
  loading: Loading,
});
export const ResetPassword = Loadable({
  loader: () => import('./Pages/Users/ResetPassword'),
  loading: Loading,
});
export const ComingSoon = Loadable({
  loader: () => import('./Pages/ComingSoon'),
  loading: Loading,
});
export const BlankPage = Loadable({
  loader: () => import('./Pages/BlankPage'),
  loading: Loading,
});
export const NotFound = Loadable({
  loader: () => import('./NotFound/NotFound'),
  loading: Loading,
});
export const Error = Loadable({
  loader: () => import('./Pages/Error'),
  loading: Loading,
});
export const Maintenance = Loadable({
  loader: () => import('./Pages/Maintenance'),
  loading: Loading,
});
export const Parent = Loadable({
  loader: () => import('./Parent'),
  loading: Loading,
});
export const NotFoundDedicated = Loadable({
  loader: () => import('./Pages/Standalone/NotFoundDedicated'),
  loading: Loading,
});
