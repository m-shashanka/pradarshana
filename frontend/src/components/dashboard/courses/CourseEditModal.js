import { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { Avatar, Box, Button, Dialog, TextField, Typography } from '@material-ui/core';
import getInitials from '../../../utils/getInitials';
import { courseService } from '../../../service/course/CourseService';
import QuillEditor from '../../QuillEditor';

const CourseEditModal = (props) => {
  const { course, onApply, onClose, open, onUpdateCourse, ...other } = props;
  const [title, setTitle] = useState(course.name);
  const [details, setDetails] = useState(course.description);

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleApply = async () => {
    try {
      const { data } = await courseService.editCourse(course._id, { title, details });
      if (data && data.success) {
        onUpdateCourse({
          name: title,
          description: details,
        });
        toast.success('Updated Details!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update course details!');
    }
    if (onApply) {
      onApply();
    }
  };

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      {...other}
    >
      <Box sx={{ p: 3 }}>
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="h4"
        >
          Edit Course Details
        </Typography>
        <Box sx={{ mt: 3 }}>
          <TextField
            autoFocus
            FormHelperTextProps={{
              sx: {
                textAlign: 'right',
                mr: 0
              }
            }}
            fullWidth
            helperText={`${50 - title.length} characters left`}
            label="Course Name"
            onChange={handleChangeTitle}
            placeholder="Enter Course Name"
            value={title}
            variant="outlined"
          />
          <QuillEditor
            onChange={(value) => setDetails(value)}
            placeholder="Write a description for the course"
            sx={{ height: 400 }}
            value={details}
          />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              mt: 6
            }}
          >
            <Avatar>
              {getInitials(course.createdBy.name)}
            </Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                {course.createdBy.name}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            mt: 3,
            p: 3
          }}
        >
          <Button
            color="primary"
            fullWidth
            onClick={handleApply}
            variant="contained"
          >
            Save details
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

CourseEditModal.propTypes = {
  course: PropTypes.object.isRequired,
  onApply: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  onUpdateCourse: PropTypes.func.isRequired
};

export default CourseEditModal;
