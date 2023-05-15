import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Button,
} from '@material-ui/core';
import ArrowRightIcon from '../../../icons/ArrowRight';
import Save from '../../../icons/Save';
import getDateTime from '../../../utils/getDateTime';
import StatsDetailsModal from './StatsDetailsModal';
import Scrollbar from '../../Scrollbar';
import CodePreviewModal from './CodePreviewModal';
import findTimeTaken from '../../../utils/findTimeTaken';
import * as XLSX from 'xlsx/xlsx.mjs';
import HexagonLoadingScreen from '../../screens/HexagonLoadingScreen/HexagonLoadingScreen';

import * as fs from 'fs';
XLSX.set_fs(fs);

const displayOptions = [
  {
    label: 'All Attempts',
    value: 'all'
  },
];

const columns = [
  "Name",
  "USN",
  "Attempt",
  "Full Screen Exit Count",
  "Start Time",
  "Time Taken",
  "End Reason"
];


const StatisticsTable = (props) => {
  const { details, totalAttempts, questions, testName, warningDetails } = props;
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(25);
  const [filteredDetails, setFilteredDetails] = useState(details);
  const [displayFilter, setDisplayFilter] = useState('all');
  const [filterOptions, setFilterOptions] = useState(displayOptions);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailInModal, setDetailInModal] = useState(null);
  const [isCodePreviewOpen, setIsCodePreviewOpen] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    const tmpFilterOptions = [...displayOptions];
    for (let index = 1; index <= totalAttempts; index++) {
      tmpFilterOptions.push({
        label: `Attempt ${index}`,
        value: `${index}`
      });
      setFilterOptions(tmpFilterOptions);
    }
  }, [totalAttempts]);

  useEffect(() => {
    if (details) {
      setFilteredDetails(filterByAttempt(details, displayFilter));
      setPage(0);
      setRpp(25);
    }
  }, [details, displayFilter]);

  useEffect(() => {
    setFilteredDetails(filterByPage(details, page, rpp));
  }, [details, page, rpp]);

  const filterByAttempt = (det, fil) => {
    return det.filter((d) => (fil === 'all' ? true : (d.attempt === Number.parseInt(fil))))
  }

  const filterByPage = (det, p, rpp) => {
    if (p * rpp < det.length)
      return det.slice(p * rpp, p * rpp + rpp);
    return [];
  }

  const handleShowCode = (code) => {
    setDetailInModal(null);
    setIsDetailsModalOpen(false);
    setCode(code);
    setIsCodePreviewOpen(true);
  }

  const exportFile = () => {
    const tempCols = [...columns];
    const condingExtraCols = tempCols.map(() => null);
    const merges = [];
    const questionsIndexMap = {};
    let curIndex = tempCols.length;

    // Add questions to the columns
    for (let index = 0; index < questions.mcqQuestions.length; index++) {
      const element = questions.mcqQuestions[index];
      questionsIndexMap[element._id] = curIndex;
      tempCols.push(`MCQ - ${element.title}`);
      condingExtraCols.push(null);
      curIndex++;
    }

    for (let index = 0; index < questions.subjectiveQuestions.length; index++) {
      const element = questions.subjectiveQuestions[index];
      questionsIndexMap[element._id] = curIndex;
      tempCols.push(`Subjective - ${element.title}`);
      condingExtraCols.push(null);
      curIndex++;
    }

    for (let index = 0; index < questions.codingQuestions.length; index++) {
      const element = questions.codingQuestions[index];
      questionsIndexMap[element._id] = curIndex;
      tempCols.push(`Code - ${element.title}`);
      tempCols.push(null);
      merges.push({ s: { r: 0, c: curIndex }, e: { r: 0, c: curIndex+1 } }); // Merge the two columns
      condingExtraCols.push("Testcases","Time Taken");
      curIndex+=2;
    }

    // Add Labels to the first rows
    const data = [];
    data.push(tempCols);
    if(questions.codingQuestions.length > 0)
      data.push(condingExtraCols);

    // Add data to the table
    for (let index = 0; index < details.length; index++) {
      const element = details[index];
      const row = [];
      row.push(element.student.name);
      row.push(element.student.usn);
      row.push(element.attempt);
      row.push(element.fullScreenExitCount? element.fullScreenExitCount : 0);
      row.push(getDateTime(element.startTime));
      row.push(element.endTime?findTimeTaken(element.startTime, element.endTime):'-');
      row.push(element.endReason?element.endReason:'-');
      for (let index = 0; index < questions.mcqQuestions.length; index++) {
        const element2 = questions.mcqQuestions[index];
        const match = element.mcqDetails.find((x) => x.mcqId === element2._id);
        row.push(match?`${Number.parseInt(element2.answer) === Number.parseInt(element.mcqDetails.find((x) => x.mcqId === element2._id).selectedAnswer) ? 1 : 0}/1`:'-');
      }

      for (let index = 0; index < questions.subjectiveQuestions.length; index++) {
        const element2 = questions.subjectiveQuestions[index];
        const match = element.simpleDetails.find((x) => x.quesId === element2._id);
        row.push(match? match.score*100:'-');
      }

      for (let index = 0; index < questions.codingQuestions.length; index++) {
        const element2 = questions.codingQuestions[index];
        const match = element.codingDetails.find((x) => x.questionId === element2._id);
        row.push(match?`${match.passed.length}/${element2.testCases.length}`:'-');
        row.push(match? getTimeTaken(match._id, element.startTime, element.codingDetails):'-');
      }

      data.push(row);
    }



    /* convert state to workbook */
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!merges'] = merges;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, `${testName}-stats.xlsx`);
  }

  const getTimeTaken = (id, startTime, dets) => {
    const tmp = [...dets];
    tmp.sort((a,b) => (new Date(a.time) === new Date(b.time)? 0:(new Date(a.time) < new Date(b.time)? -1:1)))
    for (let index = 0; index < tmp.length; index++) {
      const element = tmp[index];
      if(element._id === id)
      { 
        if(index === 0)
        return findTimeTaken(startTime, element.time)
      return findTimeTaken(tmp[index-1].time, element.time)
      }
    }
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.default',
          p: 3
        }}
      >
        <Card>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexWrap: 'wrap',
              m: -1,
              p: 2
            }}
          >
            <Box
              sx={{
                m: 1,
                maxWidth: '100%',
                width: 240
              }}
            >
              <TextField
                fullWidth
                label="Display"
                name="display"
                select
                onSelect={(event) => {
                  console.log(event);
                }}

                SelectProps={{ native: true, onChange: (event, child) => { setDisplayFilter(event.target.value) }, value: displayFilter }}
                variant="outlined"
              >
                {filterOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Box>
            {
              details && details.length > 0 && (
                <Box sx={{ m: 2 }}>
                  <Button
                    color="secondary"
                    startIcon={<Save fontSize="small" />}
                    variant="contained"
                    onClick={exportFile}
                  >
                    Export
                  </Button>
                </Box>
              )
            }
          </Box>
          <Scrollbar>
            <Box sx={{ minWidth: 1200 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Name
                    </TableCell>
                    <TableCell>
                      Usn
                    </TableCell>
                    <TableCell>
                      Attempt
                    </TableCell>
                    <TableCell>
                      Full Screen Exit Count
                    </TableCell>
                    <TableCell>
                      Start Time
                    </TableCell>
                    <TableCell>
                      Time taken
                    </TableCell>
                    <TableCell>
                      End Reason
                    </TableCell>
                    <TableCell>
                      Details
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { filteredDetails.length > 0 ?
                    filteredDetails.map((detail, index) => (
                      <TableRow>
                        <TableCell>
                          {detail.student.name}
                        </TableCell>
                        <TableCell>
                          {detail.student.usn}
                        </TableCell>
                        <TableCell>
                          {detail.attempt}
                        </TableCell>
                        <TableCell>
                          {detail.fullScreenExitCount !== undefined && detail.fullScreenExitCount !== null && detail.fullScreenExitCount >= 0 ? detail.fullScreenExitCount : '-'}
                        </TableCell>
                        <TableCell>
                          {getDateTime(detail.startTime)}
                        </TableCell>
                        <TableCell>
                          {detail.endTime ? findTimeTaken(detail.startTime, detail.endTime) : '-'}
                        </TableCell>
                        <TableCell>
                          {detail.endReason ? detail.endReason : '-'}
                        </TableCell>
                        <TableCell>
                          <Button
                            color="primary"
                            endIcon={<ArrowRightIcon fontSize="small" />}
                            variant="text"
                            onClick={() => {
                              setDetailInModal(detail);
                              setIsDetailsModalOpen(true);
                            }}
                          >
                            Show Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    )) : <HexagonLoadingScreen />
                  }

                </TableBody>
              </Table>
            </Box>
          </Scrollbar>
          <TablePagination
            component="div"
            count={details.length ? details.length : 0}
            onPageChange={(event, page) => {
              setPage(page);
            }}
            onRowsPerPageChange={(event) => {
              setRpp(event.target.value);
            }}
            page={page}
            rowsPerPage={rpp}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Card>
      </Box>
      <StatsDetailsModal
        open={isDetailsModalOpen && detailInModal}
        onClose={() => {
          setDetailInModal(null);
          setIsDetailsModalOpen(false);
        }}
        codingDetails={detailInModal ? detailInModal.codingDetails : []}
        mcqDetails={detailInModal ? detailInModal.mcqDetails : []}
        subjectiveDetails = {detailInModal ? detailInModal.simpleDetails : []}
        questions={questions}
        handleShowCode={handleShowCode}
        startTime={detailInModal ? detailInModal.startTime : ''}
      />
      <CodePreviewModal
        open={isCodePreviewOpen}
        onClose={() => setIsCodePreviewOpen(false)}
        code={code}
      />
    </>
  );
};

StatisticsTable.propTypes = {
  details: PropTypes.array.isRequired,
  totalAttempts: PropTypes.number.isRequired,
  questions: PropTypes.object.isRequired,
  testName: PropTypes.string.isRequired,
};

export default StatisticsTable;
