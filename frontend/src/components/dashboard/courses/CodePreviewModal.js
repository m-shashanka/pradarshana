import PropTypes from 'prop-types';
import { Dialog, Card } from '@material-ui/core';
import AceCodeEditor from '../../assessment/AceCodeEditor';
const CodePreviewModal = (props) => {
    const { code, open, onClose, ...other } = props;

    return (
        <Dialog
            maxWidth="lg"
            onClose={onClose}

            open={open}
            {...other}
        >
            <Card sx={{ m: 1, minWidth: 600 }}>
                <AceCodeEditor
                    name="uniqueName"
                    code={code}
                    onChange={() => { }}
                    mode="javascript"
                    onBlur={() => { }}
                />
            </Card>
        </Dialog>
    );
};

CodePreviewModal.propTypes = {
    code: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired
};

export default CodePreviewModal;
