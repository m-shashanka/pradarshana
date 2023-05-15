import Chart from 'react-apexcharts';
import { Box, Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import Scrollbar from '../Scrollbar';
import PropTypes from 'prop-types';

const TimePerStudentChart = (props) => {
    const {data} = props;
  const theme = useTheme();

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: ['#00ab57'],
    dataLabels: {
      enabled: false
    },
    fill: {
      gradient: {
        opacityFrom: 0.4,
        opacityTo: 0.1,
        shadeIntensity: 1,
        stops: [0, 100],
        type: 'vertical'
      },
      type: 'gradient'
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2
    },
    markers: {
      size: 6,
      strokeColors: theme.palette.background.default,
      strokeWidth: 3
    },
    stroke: {
      curve: 'smooth'
    },
    theme: {
      mode: theme.palette.mode
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true,
      },
      categories: data.categories,
      labels: {
        offsetY: 5,
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (value) => (value > 0 ? `${value.toFixed(1)} mins` : value),
        offsetX: -10,
        style: {
          colors: theme.palette.text.secondary
        }
      },
      axisTicks: {
        precision: 0
      }
    },
    
  };

  const chartSeries = data.series;

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        p: 3
      }}
    >
      <Card>
        <CardHeader
          title="Time taken by each student"
        />
        <Divider />
        <CardContent>
          <Scrollbar>
            <Box
              sx={{
                height: 375,
                minWidth: 500,
                position: 'relative'
              }}
            >
              <Chart
                height="350"
                options={chartOptions}
                series={chartSeries}
                type="area"
              />
            </Box>
          </Scrollbar>
        </CardContent>
      </Card>
    </Box>
  );
};

TimePerStudentChart.propTypes = {
    data: PropTypes.object.isRequired,
  };

export default TimePerStudentChart;
