import { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Divider, Grid, Tab, Tabs, Typography } from '@material-ui/core';
import { courseService } from '../../service/course/CourseService';
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

const StudentCourseDetails = () => {
  const mounted = useMounted();
  const { courseId } = useParams();
  const { settings } = useSettings();
  const [currentTab, setCurrentTab] = useState('overview');
  const [course, setCourse] = useState(null);

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

  if (!course) {
    return <BoxLoadingScreen parentHeight={'90vh'} />;
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
                />
              )}
            {currentTab === 'assignments'
              && <Assignments courseName={course.name} assignments={course.assignments} />}
            {currentTab === 'materials'
              && (
              <Materials
                materials={course.materials}
                courseId={course._id}
              />
              )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default StudentCourseDetails;
