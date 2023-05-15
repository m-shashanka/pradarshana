import PropTypes from 'prop-types';
import Markdown from 'react-markdown/with-html';
import { Box, Button, Card, CardContent, Grid, Typography } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import PencilAlt from '../../../icons/PencilAlt';

const MarkdownWrapper = experimentalStyled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  '& p': {
    marginBottom: theme.spacing(2)
  }
}));

const CourseBrief = (props) => {
  const { details, name, showEdit, onClickEdit, ...other } = props;

  return (
    <Card {...other}>
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              variant="overline"
            >
              Course Name
            </Typography>
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              {name}
            </Typography>
          </Grid>
          {
            showEdit && (
              <Grid item>
                <Button
                  color="primary"
                  onClick={onClickEdit}
                  variant="contained"
                  startIcon={<PencilAlt fontSize="small" />}
                >
                  Edit
                </Button>
              </Grid>
            )
          }
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Typography
            color="textSecondary"
            sx={{ mb: 2 }}
            variant="overline"
          >
            Description
          </Typography>
          <MarkdownWrapper>
            <Markdown
              source={details}
              allowDangerousHtml
            />
          </MarkdownWrapper>
        </Box>
      </CardContent>
    </Card>
  );
};

CourseBrief.propTypes = {
  details: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  showEdit: PropTypes.bool.isRequired,
  onClickEdit: PropTypes.func
};

export default CourseBrief;
