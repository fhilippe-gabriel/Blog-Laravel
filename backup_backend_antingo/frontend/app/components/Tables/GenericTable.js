import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import CustomToolbar from "./CustomToolbar";
import CustomToolbarSelect from "./CustomToolbarSelect";

const styles = theme => ({
    table: {
        '& > div': {
            overflow: 'auto'
        },
        '& table': {
            '& th': {
                padding: '5px 5px 2px 24px',
            },
            '& td': {
                wordBreak: 'keep-all',
                padding: '5px 5px 2px 24px',
            },
            [theme.breakpoints.down('md')]: {
                '& td': {
                    height: 60,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }
            }
        }
    }
});

const GenericTable = (props) => {

    const { columns, data, rowsSelected, pagination, title, classes, handleEdit, handleDelete, handleImport, ...toolProps } = props;
    const options = {
        filterType: 'dropdown',
        responsive: 'vertical',
        jumpToPage: true,
        print: false,
        rowsPerPage: 10,
        page: pagination.current_page,
        count: pagination.total,
        tableBodyHeight: '400px',
        rowsSelected: rowsSelected,
        rowsPerPageOptions: [10, 50, 100],
        fixedHeader: true,
        serverSide: true,
        fixedSelectColumn: false,
        selectableRowsOnClick: false,
        selectableRows: "none",
        onTableChange: (action, tableState) => {
            const search = tableState.searchText === null ? '' : tableState.searchText;
            const sort = !tableState.sortOrder.name ? '' : `&sort=${tableState.sortOrder.name}`;
            switch (action) {
                case 'changePage':
                    let page;
                    if (pagination.current_page < pagination.last_page) {
                        page = pagination.current_page + 1;
                    }
                    if (pagination.current_page === pagination.last_page) {
                        page = pagination.current_page - 1;
                    }
                    props.paginate({ 'url': `${search}${sort}&per_page=${tableState.rowsPerPage}&page=${page}` })
                    break;
                case 'changeRowsPerPage':
                case 'sort':
                case 'search':
                    if (search.length >= 3 || search.length === 0 ) {
                        props.paginate({ 'url': `${search}${sort}&per_page=${tableState.rowsPerPage}&page=1` })
                    }
                    break;
                default:
            }
        },
        textLabels: {
            body: {
                noMatch: "Desculpe, nenhum registro encontrado",
                toolTip: "Ordenar",
                columnHeaderTooltip: column => `Ordenador por ${column.label}`
            },
            pagination: {
                next: "Próxima Página",
                previous: "Página Anterior",
                rowsPerPage: "Linhas por página:",
                displayRows: "de",
            },
            toolbar: {
                search: "Pesquisar",
                downloadCsv: "Download CSV",
                print: "Imprimir",
                viewColumns: "Ver Colunas",
                filterTable: "Filtrar Tabelas",
            },
            filter: {
                all: "Todos",
                title: "Filtros",
                reset: "RESET",
            },
            viewColumns: {
                title: "Mostrar Colunas",
                titleAria: "Mostrar/Esconder Colunas",
            },
            selectedRows: {
                text: "linha(s) selecionadas",
                delete: "Deletar",
                deleteAria: "Deletar Linhas Selecionadas",
            },
        },
        onRowClick: (rowData, rowMeta) => {
            handleEdit(rowMeta.rowIndex)
        },
        customToolbar: () => {
            return (
                <CustomToolbar handleImport={handleImport} {...toolProps} />
            );
        },
        customToolbarSelect: (selectedRows, displayData) => (
            <CustomToolbarSelect selectedRows={selectedRows} displayData={displayData} handleEdit={handleEdit} handleDelete={handleDelete} />
        ),
    };
    return (
        <div className={classes.table} >
            <MUIDataTable
                title={title}
                data={data}
                columns={columns}
                options={options}
            />
        </div >
    );
}

GenericTable.propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    columns: PropTypes.array.isRequired,
};

export default withStyles(styles)(GenericTable);