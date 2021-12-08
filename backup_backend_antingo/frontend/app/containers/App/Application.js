import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Dashboard from '../Templates/Dashboard';
import withAuthorizationRouter from '../Session/withAuthorizationRouter';
import {
  DashboardPage,
  Error,
  NotFound,
  Form,
  Table,
  Parent,
  AuthenticatedPage,
  Atividades,
  Atividade,
  Clientes,
  Cliente,
  Funcionarios,
  Funcionario,
  Jornadas,
  Jornada,
  Cargos,
  Cargo,
  Projetos,
  Projeto,
  Certificados,
  Certificado,
  Exames,
  Exame,
  Equipamentos,
  Equipamento,
  PontoMarcacao,
  PontosMarcacoes,
  Tarifas,
  Tarifa,
  TarifasPrecos,
  TarifaPreco,
  TiposAtividades,
  TipoAtividade,
  TiposRecursos,
  TipoRecurso,
  Users,
  User
} from '../pageListAsync';

class Application extends React.Component {
  render() {
    const { changeMode, history } = this.props;
    return (
      <Dashboard history={history} changeMode={changeMode}>
        <Switch>
          { /* Home */}
          <Route exact path="/app" component={withAuthorizationRouter(DashboardPage)} />
          <Route path="/app/dashboard" component={withAuthorizationRouter(DashboardPage)} />
          <Route path="/app/pages/authenticated-page" component={withAuthorizationRouter(AuthenticatedPage)} />
          <Route exact path="/app/pages/tiposAtividades" component={withAuthorizationRouter(TiposAtividades)} />
          <Route path="/app/pages/tiposAtividades/tipoAtividade/:_id?" component={withAuthorizationRouter(TipoAtividade)} />
          <Route exact path="/app/pages/atividades" component={withAuthorizationRouter(Atividades)} />
          <Route path="/app/pages/atividades/atividade/:_id?" component={withAuthorizationRouter(Atividade)} />
          <Route exact path="/app/pages/tiposRecursos" component={withAuthorizationRouter(TiposRecursos)} />
          <Route path="/app/pages/tiposRecursos/tipoRecurso/:_id?" component={withAuthorizationRouter(TipoRecurso)} />
          <Route exact path="/app/pages/clientes" component={withAuthorizationRouter(Clientes)} />
          <Route path="/app/pages/clientes/cliente/:_id?" component={withAuthorizationRouter(Cliente)} />
          <Route exact path="/app/pages/certificados" component={withAuthorizationRouter(Certificados)} />
          <Route path="/app/pages/certificados/certificado/:_id?" component={withAuthorizationRouter(Certificado)} />
          <Route exact path="/app/pages/exames" component={withAuthorizationRouter(Exames)} />
          <Route path="/app/pages/exames/exame/:_id?" component={withAuthorizationRouter(Exame)} />
          <Route exact path="/app/pages/equipamentos" component={withAuthorizationRouter(Equipamentos)} />
          <Route path="/app/pages/equipamentos/equipamento/:_id?" component={withAuthorizationRouter(Equipamento)} />
          <Route exact path="/app/pages/jornadas" component={withAuthorizationRouter(Jornadas)} />
          <Route path="/app/pages/jornadas/jornada/:_id?" component={withAuthorizationRouter(Jornada)} />
          <Route exact path="/app/pages/cargos" component={withAuthorizationRouter(Cargos)} />
          <Route path="/app/pages/cargos/cargo/:_id?" component={withAuthorizationRouter(Cargo)} />
          <Route exact path="/app/pages/funcionarios" component={withAuthorizationRouter(Funcionarios)} />
          <Route path="/app/pages/funcionarios/funcionario/:_id?" component={withAuthorizationRouter(Funcionario)} />
          <Route exact path="/app/pages/users" component={withAuthorizationRouter(Users)} />
          <Route path="/app/pages/users/user/:_id?" component={withAuthorizationRouter(User)} />
          <Route exact path="/app/pages/tarifas" component={withAuthorizationRouter(Tarifas)} />
          <Route path="/app/pages/tarifas/tarifa/:_id?" component={withAuthorizationRouter(Tarifa)} />
          <Route exact path="/app/pages/tarifasPrecos" component={withAuthorizationRouter(TarifasPrecos)} />
          <Route path="/app/pages/tarifasPrecos/tarifaPreco/:_id?" component={withAuthorizationRouter(TarifaPreco)} />
          <Route exact path="/app/pages/projetos" component={withAuthorizationRouter(Projetos)} />
          <Route path="/app/pages/projetos/projeto/:_id?" component={withAuthorizationRouter(Projeto)} />
          <Route exact path="/app/pages/pontosMarcacoes" component={withAuthorizationRouter(PontosMarcacoes)} />
          <Route path="/app/pages/pontosMarcacoes/pontoMarcacao/:_id?" component={withAuthorizationRouter(PontoMarcacao)} />
          <Route path="/app/form" component={Form} />
          <Route path="/app/table" component={Table} />
          <Route path="/app/page-list" component={Parent} />
          <Route path="/app/pages/not-found" component={NotFound} />
          <Route path="/app/pages/error" component={Error} />
          <Route component={NotFound} />
        </Switch>
      </Dashboard>
    );
  }
}

Application.propTypes = {
  changeMode: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default Application;
