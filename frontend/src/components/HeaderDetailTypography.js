import Box from '@mui/material/Box';
import { Typography } from '@material-ui/core';
import React from 'react';
import Markdown from 'react-markdown/with-html';
import PropTypes from 'prop-types';
import { experimentalStyled } from '@material-ui/core/styles';

const MarkdownWrapper = experimentalStyled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  '& p': {
    marginBottom: theme.spacing(2)
  }
}));

const HeaderDetailTypography = (props) => {
  const { header, detail, mt } = props;
  return (
    <Box sx={{ mt: mt || 0 }}>
      <Typography
        variant="overline"
        color="textSecondary"
      >
        {header}
      </Typography>
      {
        detail && (
          <MarkdownWrapper>
            <Markdown
              source={detail.toString()}
              allowDangerousHtml
            />
          </MarkdownWrapper>
        )
      }
    </Box>
  );
};

HeaderDetailTypography.propTypes = {
  header: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired,
  mt: PropTypes.number
};

export default HeaderDetailTypography;
