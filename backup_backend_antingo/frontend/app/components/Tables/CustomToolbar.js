import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { withStyles } from "@material-ui/core/styles";

const defaultToolbarStyles = {
    iconButton: {
    },
};

class CustomToolbar extends React.Component {

    render() {
        const { classes, handleImport } = this.props;

        return (
            <React.Fragment>
                {handleImport !== undefined ? (
                    <Tooltip title={"Importar Arquivo"}>
                        <IconButton className={classes.iconButton} onClick={handleImport}>
                            <FileCopyIcon className={classes.deleteIcon} />
                        </IconButton>
                    </Tooltip>
                ) : null}
                <Tooltip title={"Adicionar"}>
                    <IconButton className={classes.iconButton} onClick={this.props.handleCreate}>
                        <AddIcon className={classes.deleteIcon} />
                    </IconButton>
                </Tooltip>
            </React.Fragment>
        );
    }

}

export default withStyles(defaultToolbarStyles, { name: "CustomToolbar" })(CustomToolbar);
