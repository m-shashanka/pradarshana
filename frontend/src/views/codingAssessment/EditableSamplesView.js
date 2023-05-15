import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Box,
  Typography,
  Button
} from '@material-ui/core';
import Plus from '../../icons/Plus';
import EditableSampleCard from '../../components/assessment/EditableSampleCard';
import AddSamplesModal from '../../components/assessment/AddSamplesModal';

const EditableSamplesView = (props) => {
  const { samples, questionId, handleAddSample, handleDeleteSample, ...other } = props;
  const [isAddSampleModalOpen, setIsAddSampleModalOpen] = useState(false);

  const handleAddSampleModalOpen = () => {
    setIsAddSampleModalOpen(true);
  };

  const handleAddSampleModalClose = () => {
    setIsAddSampleModalOpen(false);
  };

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Box sx={{ p: 2, display: 'flex' }}>
          <Grid
            container
            justifyContent="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography
                variant="h6"
              >
                Samples
              </Typography>
            </Grid>
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                onClick={handleAddSampleModalOpen}
                startIcon={<Plus fontSize="small" />}
              >
                Add Samples
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Grid
          container
          spacing={3}
          {...other}
        >
          {samples.map((sample, index) => (
            <Grid
              item
              key={sample.id}
              md={4}
              sm={6}
              xs={12}
            >
              <EditableSampleCard
                sample={sample}
                index={index}
                handleDeleteSample={handleDeleteSample}
                questionId={questionId}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <AddSamplesModal
        onApply={handleAddSampleModalClose}
        onClose={handleAddSampleModalClose}
        open={isAddSampleModalOpen}
        questionId={questionId}
        onAdd={handleAddSample}
      />
    </>
  );
};

EditableSamplesView.propTypes = {
  questionId: PropTypes.string.isRequired,
  samples: PropTypes.array.isRequired,
  handleAddSample: PropTypes.func.isRequired,
  handleDeleteSample: PropTypes.func.isRequired,
};

export default EditableSamplesView;
