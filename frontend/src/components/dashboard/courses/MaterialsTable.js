import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import Scrollbar from '../../Scrollbar';
import Download from '../../../icons/Download';
import { apiConfig } from '../../../config';

const MaterialsTable = (props) => {
  const { materials } = props;

  return (
    <Box
      sx={{
        backgroundColor: 'background.default'
      }}
    >
      <Card>
        <CardHeader
          title="Materials"
        />
        <Divider />
        <Scrollbar>
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Name
                  </TableCell>
                  <TableCell align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materials.map((material) => (
                  <TableRow
                    hover
                    key={material._id}
                  >
                    <TableCell>
                      <Typography
                        color="textPrimary"
                        variant="subtitle2"
                      >
                        {material.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => {
                          window.open(`${apiConfig.baseUrl}/uploads/materials/${material.fileName}`, '_blank');
                        }}
                      >
                        <Download fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </Card>
    </Box>
  );
};

MaterialsTable.propTypes = {
  materials: PropTypes.array.isRequired
};

export default MaterialsTable;
