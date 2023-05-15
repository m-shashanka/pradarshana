import { useState } from 'react';
import Markdown from 'react-markdown/with-html';
import { Box, Card, CardContent, Grid, Typography, Button, CardActions, Chip } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import PencilAlt from '../../icons/PencilAlt';
import EditCodingQuestionDetailsModal from './EditCodingQuestionDetailsModal';
import { LANGS } from '../../constants';

const MarkdownWrapper = experimentalStyled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  '& p': {
    marginBottom: theme.spacing(2)
  }
}));

const EditableQuestionDetails = (props) => {
  const { title, description, inputFormat, outputFormat, questionId, handleEditQuestion, lang, codeTemplate } = props;
  const [isEditDetailsModalOpen, setIsEditDetailsModalOpen] = useState(false);

  const handleEditDetailsModalOpen = () => {
    setIsEditDetailsModalOpen(true);
  };

  const handleEditDetailsModalClose = () => {
    setIsEditDetailsModalOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          p: 3
        }}
      >
        <Card
          elevation={6}
          sx={{ height: '35rem', overflow: 'auto', bgcolor: 'background.paper' }}
        >
          <CardContent>
            <Grid
              container
              spacing={3}
              xs={12}
            >
              <Grid
                item
              >
                <Typography
                  color="textSecondary"
                  variant="overline"
                >
                  Problem Name
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="h5"
                >
                  {title}
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Typography
                color="textSecondary"
                sx={{ mb: 1 }}
                variant="overline"
              >
                Description
              </Typography>
              <MarkdownWrapper>
                <Markdown allowDangerousHtml>
                  {description}
                </Markdown>
              </MarkdownWrapper>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography
                color="textSecondary"
                sx={{ mb: 1 }}
                variant="overline"
              >
                Input Format
              </Typography>
              <MarkdownWrapper>
                <Markdown allowDangerousHtml>
                  {inputFormat}
                </Markdown>
              </MarkdownWrapper>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography
                color="textSecondary"
                sx={{ mb: 1 }}
                variant="overline"
              >
                Output Format
              </Typography>
              <MarkdownWrapper>
                <Markdown allowDangerousHtml>
                  {outputFormat}
                </Markdown>
              </MarkdownWrapper>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography
                color="textSecondary"
                sx={{ mb: 1 }}
                variant="overline"
              >
                Language
              </Typography>
              <br />
              <Chip
                variant="outlined"
                color="primary"
                label={LANGS.find(langs => langs.id === Number(lang)).name}
              />
            </Box>
          </CardContent>
          <CardActions
            sx={{ justifyContent: 'flex-end' }}
          >
            <Button
              color="primary"
              sx={{ mr: 2 }}
              variant="outlined"
              startIcon={<PencilAlt />}
              onClick={handleEditDetailsModalOpen}
            >
              Edit
            </Button>
          </CardActions>
        </Card>
      </Box>
      <EditCodingQuestionDetailsModal
        onApply={handleEditDetailsModalClose}
        onClose={handleEditDetailsModalClose}
        open={isEditDetailsModalOpen}
        questionId={questionId}
        onEdit={handleEditQuestion}
        details={{
          title,
          description,
          inputFormat,
          outputFormat,
          codeTemplate
        }}
      />
    </>
  );
};

EditableQuestionDetails.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  inputFormat: PropTypes.string.isRequired,
  outputFormat: PropTypes.string.isRequired,
  questionId: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
  handleEditQuestion: PropTypes.func.isRequired
};

export default EditableQuestionDetails;
