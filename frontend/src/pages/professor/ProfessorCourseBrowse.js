import { useCallback, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Container, Grid, Link, Typography } from '@material-ui/core';
import useMounted from '../../hooks/useMounted';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import { CourseBrowseResults } from '../../components/dashboard/courses';
import { courseService } from '../../service/course/CourseService';
import BoxLoadingScreen from '../../components/screens/BoxLoadingScreen/BoxLoadingScreen';

const ProfessorCourseBrowse = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [courses, setCourses] = useState([]);

  const getCourses = useCallback(async () => {
    try {
      const { data } = await courseService.fetchCourses();
      if (mounted.current && data) {
        setCourses(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
    getCourses();
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard: Course Browse</title>
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
            alignItems="center"
            container
            justifyContent="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography
                color="textPrimary"
                variant="h5"
              >
                All Courses
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small" />}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  Dashboard
                </Link>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Courses
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box sx={{ mt: 6 }}>
            {courses.length > 0 ? <CourseBrowseResults
              courses={courses}
              isEditable
            />: <BoxLoadingScreen parentHeight={'50vh'} />}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ProfessorCourseBrowse;
