import PropTypes from 'prop-types';
import { Box, Dialog, Card, CardHeader, Divider } from '@material-ui/core';
import StatisticsQuestionTable from './StatisticsQuestionTable';
import Scrollbar from '../../Scrollbar';

const StatsDetailsModal = (props) => {
    const { mcqDetails, subjectiveDetails, codingDetails, open, onClose, questions, handleShowCode, startTime, ...other } = props;

    return (
        <Dialog
            maxWidth="lg"
            onClose={onClose}
            open={open}
            {...other}
        >
            <Scrollbar>
                <Card sx={{m:1, minWidth: 600}}>
                    <CardHeader
                        title="Coding Questions"
                    />
                    <Divider />
                    <Box>
                        <StatisticsQuestionTable
                            questionsDetails={codingDetails}
                            questions={questions.codingQuestions}
                            type={'coding'}
                            handleShowCode={handleShowCode}
                            startTime={startTime}
                        />
                    </Box>
                </Card>
                <Card sx={{m:1}}>
                    <CardHeader
                        title="MCQ Questions"
                    />
                    <Divider />
                    <Box>
                        <StatisticsQuestionTable
                            questionsDetails={mcqDetails}
                            questions={questions.mcqQuestions}
                            type={'mcq'}
                            handleShowCode={handleShowCode}
                        />
                    </Box>
                </Card>
                <Card sx={{m:1}}>
                    <CardHeader
                        title="Subjective Questions"
                    />
                    <Divider />
                    <Box>
                        <StatisticsQuestionTable
                            questionsDetails={subjectiveDetails}
                            questions={questions.subjectiveQuestions}
                            type={'subjective'}
                            handleShowCode={handleShowCode}
                        />
                    </Box>
                </Card>
            </Scrollbar>
        </Dialog>
    );
};

StatsDetailsModal.propTypes = {
    mcqDetails: PropTypes.array,
    codingDetails: PropTypes.array,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    questions: PropTypes.object.isRequired,
    handleShowCode: PropTypes.func.isRequired,
    startTime: PropTypes.string.isRequired
};

export default StatsDetailsModal;
