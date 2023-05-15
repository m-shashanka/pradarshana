import Markdown from 'react-markdown/with-html';
import { Box, Card, CardContent, Grid, Typography } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import HeaderDetailTypography from '../HeaderDetailTypography';

const MarkdownWrapper = experimentalStyled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  '& p': {
    marginBottom: theme.spacing(2)
  }
}));

const sampleFields = ['input', 'output', 'explanation'];

const QuestionDetails = (props) => {
  const { title, description, samples, inputFormat, outputFormat } = props;
  return (
    <Box
      sx={{
        p: 3
      }}
    >
      <Card
        elevation={6}
        sx={{ height: '50rem', overflow: 'auto', bgcolor: 'background.paper' }}
      >
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={6}
              md={12}
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
            <MarkdownWrapper style={{width: "600px"}}>
              <Markdown
                source={description}
                allowDangerousHtml
              />
            </MarkdownWrapper>
          </Box>
          {[inputFormat, outputFormat].map((format, index) => (
            <HeaderDetailTypography
              key={sampleFields[index]}
              header={`${sampleFields[index]} format`}
              detail={format}
              mt={3}
            />
          ))}
          {/*  Sample Inputs, outputs and explanations */}
          {samples && samples.map((sample, index) => (
            <Box
              sx={{ mt: 3 }}
              key={sampleFields[index]}
            >
              {sampleFields.map((field) => (
                field && (
                <HeaderDetailTypography
                  key={field}
                  header={`Sample ${field} ${index}`}
                  detail={sample[field]}
                  mt={3}
                />
                )
              ))}
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

QuestionDetails.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  samples: PropTypes.arrayOf(PropTypes.object).isRequired,
  inputFormat: PropTypes.string.isRequired,
  outputFormat: PropTypes.string.isRequired
};

export default QuestionDetails;
