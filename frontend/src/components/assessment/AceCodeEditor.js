import React from 'react';
import AceEditor from 'react-ace';
import PropTypes from 'prop-types';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-monokai';
import { Card } from '@material-ui/core';

const AceCodeEditor = React.memo((props) => {
  const { name, placeholder, mode, onBlur, fontSize, enableBasicAutocompletion, enableLiveAutocompletion, onLoad, onChange, code } = props;

  return (
    <Card elevation={6}>
      <AceEditor
        style={{ borderRadius: 5, width: '100%' }}
        height="50rem"
        name={name}
        placeholder={placeholder || 'Code editor'}
        mode={mode}
        theme="monokai"
        onLoad={onLoad}
        onChange={onChange}
        fontSize={fontSize || 16}
        value={code}
        onBlur={() => onBlur(code)}
        setOptions={{
          enableBasicAutocompletion: !!enableBasicAutocompletion,
          enableLiveAutocompletion: !!enableLiveAutocompletion,
        }}
      />
    </Card>
  );
});

AceCodeEditor.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  mode: PropTypes.oneOf(['java', 'python', 'javascript', 'c_cpp']).isRequired,
  onLoad: PropTypes.func,
  onChange: PropTypes.func,
  onBlur: PropTypes.func.isRequired,
  fontSize: PropTypes.number,
  code: PropTypes.string.isRequired,
  enableBasicAutocompletion: PropTypes.bool,
  enableLiveAutocompletion: PropTypes.bool
};

export default AceCodeEditor;
