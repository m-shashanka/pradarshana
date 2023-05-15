import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { Box, Card, CardHeader, CardContent, Button, Divider, Grid } from '@material-ui/core';
import TrashIcon from '../../icons/Trash';
import { assessmentService } from '../../service/test/AssessmentService';
import TestCaseIOTypography from './TestCaseIOTypography';

const EditableSampleCard = (props) => {
  const { sample, index, questionId, handleDeleteSample, ...others } = props;

  const handleDelete = async () => {
    try {
      const { data } = await assessmentService.deleteSample(questionId, sample._id);
      if (data && data.success) {
        handleDeleteSample(questionId, sample._id);
        toast.success('Sample deleted successfully!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete sample!');
    }
  };

  return (
    <Card {...others}>
      <CardHeader title={`Sample ${index}`} />
      <Divider />
      <CardContent>
        <Box
          sx={{
            mb: 2,
            mt: 1
          }}
        >
          <TestCaseIOTypography
            header="Input"
            data={sample.input}
          />
          <TestCaseIOTypography
            header="Output"
            data={sample.output}
          />
          <TestCaseIOTypography
            header="Explanation"
            data={sample.explanation}
          />
        </Box>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >
          <Grid item>
            <Button
              startIcon={<TrashIcon fontSize="small" />}
              sx={{
                backgroundColor: 'error.main',
                color: 'error.contrastText',
                '&:hover': {
                  backgroundColor: 'error.dark'
                }
              }}
              variant="contained"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

EditableSampleCard.propTypes = {
  sample: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  handleDeleteSample: PropTypes.func.isRequired,
  questionId: PropTypes.string.isRequired
};

export default EditableSampleCard;
