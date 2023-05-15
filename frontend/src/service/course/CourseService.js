import axios from 'axios';
import { apiConfig } from '../../config';

// Expected Sample Response
// [{
//   "id":"1",
//   "name":"Course 1",
//   "professor":"John Doe",
//   "details":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
// }]
const fetchCourses = () => axios.post(`${apiConfig.baseUrl}/api/fetch-courses`);

// TODO: Need to implemet this route in backend
// Expected Sample Response
// {
//   "name":"Course 1",
//   "professor": "Jhon Doe",
//   "details": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
//   "materials":[],
//   "assignments":[]
// }
const fetchCourse = (courseId) => axios.post(`${apiConfig.baseUrl}/api/fetch-course`, { courseId });

const addCourse = (values) => axios.post(`${apiConfig.baseUrl}/api/add-course`, values, { headers: { 'Content-Type': 'multipart/form-data' } });

const addMaterial = (values) => axios.post(`${apiConfig.baseUrl}/api/add-material`, values, { headers: { 'Content-Type': 'multipart/form-data' } });

const editCourse = (courseId, course) => axios.post(`${apiConfig.baseUrl}/api/edit-course`, { courseId, course });

const addAsssignment = (courseId, assignment) => axios.post(`${apiConfig.baseUrl}/api/test/add`, { courseId, assignment });

const updateAssignment = (assignmentId, assignment) => axios.post(`${apiConfig.baseUrl}/api/test/update-assignment`, {
  assignmentId,
  assignment
});

const updateAssignmentVisibility = (id, isAccessible) => axios.post(`${apiConfig.baseUrl}/api/test/change-assignment-visibility`, {
  id,
  isAccessible
});

const updateAssignmentProctoring = (id, isProctored) => axios.post(`${apiConfig.baseUrl}/api/test/change-assignment-proctoring`, {
  id,
  isProctored
});

export const courseService = {
  fetchCourses,
  fetchCourse,
  addCourse,
  editCourse,
  addAsssignment,
  updateAssignment,
  addMaterial,
  updateAssignmentVisibility,
  updateAssignmentProctoring
};
