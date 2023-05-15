import Chart from 'react-apexcharts';
import { Box, Card, CardHeader } from '@material-ui/core';
import { alpha, useTheme } from '@material-ui/core/styles';
import Scrollbar from '../Scrollbar';
import PropTypes from 'prop-types';

const BarChartMinsOnY = (props) => {
  const theme = useTheme();
  const {data, title, unit} = props;

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: ['#00ab57', alpha('#00ab57', 0.25)],
    dataLabels: {
      enabled: false
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2
    },
    states: {
      active: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          type: 'none'
        }
      }
    },
    legend: {
      show: false
    },
    plotOptions: {
      bar: {
        columnWidth: '20px'
      }
    },
    stroke: {
      colors: ['transparent'],
      show: true,
      width: 2
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
        show: true
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
        formatter: (value) => (value > 0 ? `${value} ${unit?unit:''}` : value),
        offsetX: -10,
        style: {
          colors: theme.palette.text.secondary
        }
      }
    }
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
          title={title?title:''}
        />
        <Scrollbar>
          <Box
            sx={{
              minWidth: 700,
              px: 2
            }}
          >
            <Chart
              height="375"
              options={chartOptions}
              series={chartSeries}
              type="bar"
            />
          </Box>
        </Scrollbar>
      </Card>
    </Box>
  );
};
BarChartMinsOnY.propTypes = {
    data: PropTypes.object.isRequired,
    title: PropTypes.string,
    unit: PropTypes.string
  };
export default BarChartMinsOnY;
