import { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Divider, Grid, Tab, Tabs, Typography } from '@material-ui/core';
import { courseService } from '../../service/course/CourseService';
import {
  CourseEditModal,
  CreateAssignmentModal,
  EditAssignmentModal,
} from '../../components/dashboard/courses';
import CourseOverview from '../../views/course/CourseOverview';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import Assignments from '../../views/course/Assignments';
import Materials from '../../views/course/Materials';
import BoxLoadingScreen from '../../components/screens/BoxLoadingScreen/BoxLoadingScreen';

const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Assignments', value: 'assignments' },
  { label: 'Materials', value: 'materials' },
];

const ProfessorCourseDetails = () => {
  const mounted = useMounted();
  const { courseId } = useParams();
  const { settings } = useSettings();
  const [currentTab, setCurrentTab] = useState('overview');
  const [course, setCourse] = useState(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);
  const [isEditAssignmentOpen, setIsEditAssignmentOpen] = useState({ assignment: null, isOpen: false });

  const getCourse = useCallback(async () => {
    try {
      const { data } = await courseService.fetchCourse(courseId);
      if (mounted.current) {
        setCourse(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
    getCourse();
  }, []);

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const handleApplyModalOpen = () => {
    setIsApplicationOpen(true);
  };

  const handleApplyModalClose = () => {
    setIsApplicationOpen(false);
  };

  const handleAssignmentCreateModalOpen = () => {
    setIsCreateAssignmentOpen(true);
  };

  const handleAssignmentCreateModalClose = () => {
    setIsCreateAssignmentOpen(false);
  };

  const handleAssignmentEditModalOpen = (assignment) => {
    setIsEditAssignmentOpen({ assignment, isOpen: true });
  };

  const handleAssignmentEditModalClose = () => {
    setIsEditAssignmentOpen({ assignment: null, isOpen: false });
  };

  const handleAssignmentAdd = (assignment) => {
    const newAssignments = [...course.assignments, assignment];
    setCourse({ ...course, assignments: newAssignments });
  };

  const handleAssignmentEdit = (assignment) => {
    const newAssignments = course.assignments.map((a) => (a._id === assignment._id ? assignment : a));
    setCourse({ ...course, assignments: newAssignments });
  };

  const handleMaterialAdd = (material) => {
    const newMaterials = [...course.materials, material];
    setCourse({ ...course, materials: newMaterials });
  };

  const handleCourseEdit = (courseUpdated) => {
    setCourse({ ...course, ...courseUpdated });
  };

  const handleAssignmentVisbilityChange = (assignmentId, visibility) => {
    const newAssignments = course.assignments.map((a) => (a._id === assignmentId ? {...a, isAccessible: !visibility} : a));
    setCourse({ ...course, assignments: newAssignments });
  }

  const handleAssignmentProctoringChange = (assignmentId, visibility) => {
    const newAssignments = course.assignments.map((a) => (a._id === assignmentId ? {...a, isProctored: !visibility} : a));
    setCourse({ ...course, assignments: newAssignments });
  }

  if (!course) {
    return <BoxLoadingScreen parentHeight={'90vh'} />
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Course Details</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid
            container
            justifyContent="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography
                color="textPrimary"
                variant="h5"
              >
                {course.name}
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              textColor="primary"
              value={currentTab}
              variant="scrollable"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                />
              ))}
            </Tabs>
          </Box>
          <Divider />
          <Box sx={{ mt: 3 }}>
            {currentTab === 'overview'
            && (
            <CourseOverview
              course={course}
              showEdit
              onClickEdit={handleApplyModalOpen}
            />
            )}
            {currentTab === 'assignments'
            && (
            <Assignments
              assignments={course.assignments}
              isEditable
              onCreateClick={handleAssignmentCreateModalOpen}
              editAssignment={handleAssignmentEditModalOpen}
              handleAssignmentVisbilityChange={handleAssignmentVisbilityChange}
              handleAssignmentProctoringChange={handleAssignmentProctoringChange}
              handleAssignmentCopy={handleAssignmentAdd}
            />
            )}
            {currentTab === 'materials'
            && (
            <Materials
              materials={course.materials}
              isEditable
              courseId={course._id}
              onAdd={handleMaterialAdd}
            />
            )}
          </Box>
        </Container>
      </Box>
      <CourseEditModal
        course={course}
        onApply={handleApplyModalClose}
        onClose={handleApplyModalClose}
        open={isApplicationOpen}
        onUpdateCourse={handleCourseEdit}
      />
      <CreateAssignmentModal
        onApply={handleAssignmentCreateModalClose}
        onClose={handleAssignmentCreateModalClose}
        open={isCreateAssignmentOpen}
        courseId={courseId}
        onAdd={handleAssignmentAdd}
      />
      {
        isEditAssignmentOpen.isOpen
        && (
        <EditAssignmentModal
          assignment={isEditAssignmentOpen.assignment}
          onApply={handleAssignmentEditModalClose}
          onClose={handleAssignmentEditModalClose}
          open={isEditAssignmentOpen.isOpen}
          onUpdateAssignment={handleAssignmentEdit}
        />
        )
      }
    </>
  );
};

export default ProfessorCourseDetails;
