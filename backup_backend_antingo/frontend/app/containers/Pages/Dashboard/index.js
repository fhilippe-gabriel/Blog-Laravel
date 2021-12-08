import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { PapperBlock } from 'enl-components';
import CompossedLineBarArea from './CompossedLineBarArea';
import StrippedTable from '../Table/StrippedTable';

class BasicTable extends Component {
  render() {
    const title = brand.name + ' - Dashboard';
    const description = brand.desc;
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <PapperBlock title="Gráfico Estatístico" icon="insert_chart" desc="" overflowX>
          <div>
            <CompossedLineBarArea />
          </div>
        </PapperBlock>
        <PapperBlock title="Tabela" whiteBg icon="grid_on" desc="Tabela de exemplo">
          <div>
            <StrippedTable />
          </div>
        </PapperBlock>
      </div>
    );
  }
}

export default BasicTable;
