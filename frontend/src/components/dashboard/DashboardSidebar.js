import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Avatar, Box, Divider, Drawer, Typography } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useAuth from '../../hooks/useAuth';
import ChartSquareBarIcon from '../../icons/ChartSquareBar';
import Logo from '../Logo';
import {useTheme} from '@material-ui/core';
import NavSection from '../NavSection';
import Scrollbar from '../Scrollbar';
import UserAdd from '../../icons/UserAdd';
import Upload from '../../icons/Upload';
import Trash from '../../icons/Trash';

const sections = [
  {
    title: 'General',
    items: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <ChartSquareBarIcon fontSize="small" />
      }
    ]
  }
];

const DashboardSidebar = (props) => {
  const { onMobileClose, openMobile } = props;
  const location = useLocation();
  const { user } = useAuth();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const isDarkTheme = useTheme().palette.mode === 'dark';

  useEffect(() => {
    if (user.roles.includes('admin') && sections.length < 2) {
      sections.push({
        title: 'Admin',
        items: [
          {
            title: 'Add User',
            path: '/dashboard/admin/addUser',
            icon: <UserAdd fontSize="small" />
          },
          {
            title: 'Add Bulk Users',
            path: '/dashboard/admin/addBulkUser',
            icon: <UserAdd fontSize="small" />
          },
          {
            title: 'Upload Dataset',
            path: '/dashboard/admin/uploadDataset',
            icon: <Upload fontSize="small" />
          },
          {
            title: 'Clear Dataset',
            path: '/dashboard/admin/clearDataset',
            icon: <Trash fontSize="small" />
          }
        ]
      });
    }
  }, []);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        marginTop: '25px',
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        <Box
          sx={{
            display: {
              lg: 'none',
              xs: 'flex'
            },
            justifyContent: 'center',
            p: 2
          }}
        >
          <RouterLink to="/">
            <Logo
              dark={isDarkTheme}
              sx={{
                height: 40,
                width: 40
              }}
            />
          </RouterLink>
        </Box>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'background.default',
              borderRadius: 1,
              display: 'flex',
              overflow: 'hidden',
              p: 2
            }}
          >
            <RouterLink to="/dashboard/account">
              <Avatar
                src={user.avatar}
                sx={{
                  cursor: 'pointer',
                  height: 48,
                  width: 48
                }}
              />
            </RouterLink>
            <Box sx={{ ml: 2 }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                {user.name}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          {sections.map((section) => (
            <NavSection
              key={section.title}
              pathname={location.pathname}
              sx={{
                '& + &': {
                  mt: 3
                }
              }}
              {...section}
            />
          ))}
        </Box>
        <Divider />
      </Scrollbar>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            height: 'calc(100% - 64px) !important',
            top: '64px !Important',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onMobileClose}
      open={openMobile}
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          width: 280
        }
      }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default DashboardSidebar;
