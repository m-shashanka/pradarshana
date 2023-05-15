import './CodingAssessment.css';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Fab } from '@material-ui/core';
import { assessmentService } from '../../service/test/AssessmentService';
import SideBar from '../../views/codingAssessment/SideBar';
import gtm from '../../lib/gtm';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import Countdown from 'react-countdown';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as faceapi from '@vladmandic/face-api';
import { loadLabeledImages } from '../../utils/loadLabeledImages';

const WARNING_TIME = 4000;
const LEFT_CUTOFF = 0;
const RIGHT_CUTOFF = window.innerWidth;
const TOP_CUTOFF = 0;
const BOTTOM_CUTOFF = window.innerHeight;

let startLookTime = Number.POSITIVE_INFINITY;
let danger = false;

function parser(time) {
  const len = `${time}`;
  if (len.length === 1) {
    return `0${time}`;
  }
  return len;
}

const CodingAssessment = () => {

  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const faceMatcher = useRef(null);
  const volumeCallback = useRef(null);
  const audioIntervalId = useRef(null);
  const imageCapture = useRef(null);

  const { testId } = useParams();
  const {user} = useAuth();

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [audioWarning, setAudioWarning] = useState(false);
  const [circleCount, setCircleCount] = useState(0);
  const [irisWarning, setIrisWarning] = useState(false);
  const [personCount, setPersonCount] = useState(1);
  const [phoneDetected, setPhoneDetected] = useState(false);
  const [faceRecognized,setFaceRecognized] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [screenshots, setScreenshots] = useState([]);
  const [warningDetails, setWarningDetails] = useState({});
  const [shouldCheckForWarnings, setShouldCheckForWarnings] = useState(false);

  const addWarningType = (warningType) => {
    if(shouldCheckForWarnings){
      if(warningType == 'VOICE_DETECTED'){
        takeScreenshot();
        setAudioWarning(true);
      }
      else
        setAudioWarning(false);
      
      if(circleCount == 20 && warningType == 'LOOKING_AWAY_FROM_SCREEN'){
        takeScreenshot();
        setIrisWarning(true);
      }
      else
        setIrisWarning(false);
    }
    if(warningType == 'NULL')
      return;
    const temp = warningDetails;
    if(temp[warningType])
      temp[warningType]++;
    else
      temp[warningType] = 0;
    setWarningDetails(temp);
  }

  const startWarningCheck = () => {
    const intervalId = setInterval(()=>{
      if(shouldCheckForWarnings)
        addWarningType('NULL');
      setShouldCheckForWarnings(shouldCheckForWarnings => !shouldCheckForWarnings);
    }, 20000);
    return intervalId;
  }

  useEffect(()=>{
    let intervalId;
    if(circleCount == 20)
      intervalId = startWarningCheck();
      
    return ()=>{
      intervalId && clearInterval(intervalId);
    }
  },[circleCount]);

  useEffect(()=>{

    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
    document.addEventListener('keydown', (e)=> {
      if(e.ctrlKey || e.altKey || e.metaKey)
      {
        e.preventDefault();
      }
    });

    const intervalId = setInterval(async() => {
      try{
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
          if(typeof videoRef.current !== "undefined" && videoRef.current !== null 
            && videoRef.current.readyState === 4 && videoRef.current.srcObject && videoRef.current.srcObject.active) 
              return;
          let stream = await navigator.mediaDevices.getUserMedia({video: true, audio: {echoCancellation: true}});
          imageCapture.current = new ImageCapture(stream.getVideoTracks()[0]);
          const audioContext = new AudioContext();
          const audioSource = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 512;
          analyser.minDecibels = -127;
          analyser.maxDecibels = 0;
          analyser.smoothingTimeConstant = 0.2;
          audioSource.connect(analyser);
          const volumes = new Uint8Array(analyser.frequencyBinCount);
          volumeCallback.current = () => {
            analyser.getByteFrequencyData(volumes);
            let volumeSum = 0;
            for(const volume of volumes)
              volumeSum += volume;
            const averageVolume = volumeSum / volumes.length;
            const volume = averageVolume * 100 / 127;
            // console.log(volume);
            if(volume >= 60)
              addWarningType('VOICE_DETECTED');
            else
              addWarningType('NULL');
          };
          videoRef.current.srcObject = stream;
          setPermissionGranted(true);
        }
        else
          throw new Error('Media Device not supported');
      }catch(e){
        setPermissionGranted(false);
        console.log(e);
      }
    }, 1500);

    window.webgazer.showVideoPreview(false).showPredictionPoints(false);
    window.webgazer.setGazeListener(function(data, elapsedTime) {
        if (data == null) return;

        if(data.x <= LEFT_CUTOFF || data.x >= RIGHT_CUTOFF || data.y <= TOP_CUTOFF){
            if(!danger)
                startLookTime = elapsedTime;
            danger = true;
        }
        else{
            startLookTime = Number.POSITIVE_INFINITY;
            danger = false;
            addWarningType('NULL');
        }
        
        if(startLookTime + WARNING_TIME < elapsedTime)
          addWarningType('LOOKING_AWAY_FROM_SCREEN');

    }).begin();

    async function loadModel(){
      try{
        modelRef.current = await cocoSsd.load();
        const MODEL_URL = process.env.PUBLIC_URL + '/static/models';
        await Promise.all([
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL) //heavier/accurate version of tiny face detector
        ]);
        const labeledDescriptors = await loadLabeledImages(user.usn, testId);
        faceMatcher.current = new faceapi.FaceMatcher(labeledDescriptors, 0.55);
      }
      catch(e){
        setLoadingError(true);
      }
      setModelsLoaded(true);
    }

    loadModel();
    
    return () => {
      audioIntervalId && audioIntervalId.current && clearInterval(audioIntervalId.current);
      clearInterval(intervalId);
    };
  },[]);

  useEffect(()=>{
    if(permissionGranted)
      window.webgazer.resume();
    else
      window.webgazer.pause();
  },[permissionGranted]);

  // useEffect(()=>{
  //   const takeSS = async () => {
  //     let blob = await imageCapture.current.takePhoto();
  //     let file = new File([blob], `${user.usn}_${screenshots.length + 1}.jpg`);
  //     setScreenshots([...screenshots, file]);
  //   }
  //   if(circleCount == 20 && irisWarning)
  //     takeSS();
  // }, [circleCount, irisWarning, imageCapture, screenshots, user]);

  const takeScreenshot = async () => {
    let blob = await imageCapture.current.takePhoto();
    let file = new File([blob], `${user.usn}_${screenshots.length + 1}.jpg`);
    setScreenshots([...screenshots, file]);
  }

  const handleCircleClick = (e) => {
    const styles = getComputedStyle(e.target);
    if(styles.backgroundColor[4] == '2'){ //red color 255
      e.target.style.backgroundColor = 'greenyellow';
      setCircleCount(prev=>prev+1);
    }
  }

  const startPrediction = async () => {
    const predictions = await modelRef.current.detect(videoRef.current);
    let count = 0, phone = false;
    predictions.forEach(prediction => {
      if(prediction.class === 'person')
        count++;
      else if(prediction.class === 'cell phone')
        phone = true;
    });

    if(phone || count != 1)
      await takeScreenshot();

    if(phone)
      addWarningType('PHONE_DETECTED');
    if(count == 0)
      addWarningType('NO_PERSON_DETECTED');
    if(count > 1)
      addWarningType('MULTIPLE_PERSONS_DETECTED');

    setPhoneDetected(phone);
    setPersonCount(count);
    requestAnimationFrame(startPrediction);
  }

  const recognizeFaces = async () => {
    const detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks().withFaceDescriptors();
    const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight }
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const results = resizedDetections.map((d) => {
      return faceMatcher.current.findBestMatch(d.descriptor);
    });
    results.forEach( (result) => {
        if(result.toString().includes(user.usn))
          setFaceRecognized(true);
        else
          setFaceRecognized(false);
    });
    if(!faceRecognized){
      await takeScreenshot();
      addWarningType('FACE_NOT_RECOGNIZED');
    }
    requestAnimationFrame(recognizeFaces);
  }

  const startTest = () => {
    audioIntervalId.current = setInterval(volumeCallback.current, 500);
    startPrediction();
    setTimeout(recognizeFaces, 10000);
  }

  const endTest = async () => {
    const formData = new FormData();
    formData.append('testId', testId);
    for(let file of screenshots)
      formData.append('files', file);
    await assessmentService.uploadScreenshots(formData);
    await assessmentService.addWarningDetails({warningDetails, userId: user.id, testId});
  }

  //If page is refreshed or permissions are denied, test will end

  let loadText = null;

  if(!modelsLoaded)
    loadText = <>
      <h1 style={{textAlign: 'center'}}>Initializing Test</h1>
      <h1 style={{textAlign: 'center'}}>Please Wait</h1>
    </>;
  else if(!permissionGranted)
    loadText = <h1 style={{textAlign: 'center'}}>You need to allow webcam & microphone access to continue</h1>;

  if(loadingError)
    return <h1 style={{textAlign: 'center'}}>Images not found for facial recognition</h1>;

  return <>
    {loadText && loadText}
    <video className='feed' ref={videoRef} autoPlay muted
      style={{visibility: permissionGranted && circleCount < 20 ? 'visible' : 'hidden'}}
    ></video>
    {permissionGranted && modelsLoaded && circleCount < 20 && <div className='calibrationPage'>
      <div className='row'>
        <div onClick={handleCircleClick} className='circle'></div>
        <div onClick={handleCircleClick} className='circle'></div>
        <div onClick={handleCircleClick} className='circle'></div>
        <div onClick={handleCircleClick} className='circle'></div>
        <div onClick={handleCircleClick} className='circle'></div>
      </div>
      <div className='row'>
        <div onClick={handleCircleClick} className='circle'></div>
        <div onClick={handleCircleClick} className='circle'></div>
        <div onClick={handleCircleClick} className='circle'></div>
        <div onClick={handleCircleClick} className='circle'></div>
        <div onClick={handleCircleClick} className='circle'></div>
      </div>
      <h1>Click on all the circles to complete the calibration process.</h1>
      <div className='row'>
        <div onClick={handleCircleClick} className='circle'></div>
        <div onClick={handleCircleClick} className='circle'></div>
        <div onClick={handleCircleClick} className='circle'></div>
        <div onClick={handleCircleClick} className='circle'></div>
        <div onClick={handleCircleClick} className='circle'></div>
      </div>
      <div className='row'>
        <div onClick={handleCircleClick} className='circle'></div>
        <div onClick={handleCircleClick} className='circle'></div>
        <div onClick={handleCircleClick} className='circle'></div>
        <div onClick={handleCircleClick} className='circle'></div>
        <div onClick={handleCircleClick} className='circle'></div>
      </div>
    </div>}
    {/* {circleCount == 20  && irisWarning && <div className='parent'>
        <div className='danger'>
            <h1>Warning</h1>
        </div>
    </div>} */}
    {circleCount == 20 && <Assessment audioWarning={audioWarning} stream={videoRef.current.srcObject} 
     startTest={startTest} endTest={endTest} irisWarning={irisWarning} phoneDetected={phoneDetected} personCount={personCount}
     faceRecognized={faceRecognized} testId={testId} user={user} />}
  </>
  
}

const Assessment = ({irisWarning, stream, audioWarning, startTest, endTest,
  phoneDetected, personCount, faceRecognized, testId, user}) => {
  const navigate = useNavigate();
  const [fullScreenExitCount, setFullScreenExitCount] = useState(-1);
  const handleFullScreen = useFullScreenHandle();
  const [questions, setQuestions] = useState(null);
  const [mcq, setMcq] = useState(null);
  const [subjectiveQuestions, setSubjectiveQuestions] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [customTestcaseForQuestion, setCustomTestcaseForQuestion] = useState({});
  const [statusOfTestcases, setStatusOfTestcases] = useState({});
  const [codeForQuestion, setCodeForQuestion] = useState({});
  const [timeSpent, setTimeSpent] = useState();
  const [isEndTestOpen, setisEndTestOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState({});
  const [isCustomSubmitting, setIsCustomSubmitting] = useState({});

  const videoRef = useRef(null);

  const courseName = localStorage.getItem('courseName');

  const getCodingQuestions = async () => {
    setLoading(true);
    try {
      const response = await assessmentService.fetchCodingQuestionsForTest(testId);
      setDetails(response.data.details);
      setMcq(response.data.mcqQuestions);
      setQuestions(response.data.codingQuestions);
      setSubjectiveQuestions(response.data.subjectiveQuestions);
      setCustomTestcaseForQuestion(response.data.codingQuestions.reduce((p, c) => ({
        ...p, [c._id]: {
          input: '',
          output: '',
          token: null,
          status: 0,
          indervalId: null
        }
      }), {}));
      setStatusOfTestcases(response.data.codingQuestions.reduce((p, c) => ({
        ...p, [c._id]:
        {
          status: c.testCases.reduce(
            (p2, c2) => ({
              ...p2,
              [c2._id]: {
                status: 0,
                executionOutput: null,
              }
            }), {}),
          lastSaved: null,
        }
      }), {}))
      setIsSubmitting(response.data.codingQuestions.reduce((p, c) => ({
        ...p,
        [c._id]: false
      }), {}));
      setIsCustomSubmitting(response.data.codingQuestions.reduce((p, c) => ({
        ...p,
        [c._id]: false
      }), {}));
      setCodeForQuestion(response.data.codingQuestions.reduce((p, c) => ({ ...p, [c._id]: c.codeTemplate}), {}));
      setTimeSpent((response.data.details.minutes || 0) * 60 * 1000);
      setLoading(false);
    }
    catch (error) {
      toast.error(error.response && error.response.data.message);
      navigate('/');
    }
  };

  const updateCustomTestCase = (id, val) => {
    setCustomTestcaseForQuestion({ ...customTestcaseForQuestion, [id]: { ...customTestcaseForQuestion[id], ...val } });
  }

  const updateCode = (id, val) => {
    setCodeForQuestion({ ...codeForQuestion, [id]: val });
  }

  const compileAndRun = async (questionId) => {
    try {
      setIsCustomSubmitting({
        ...isSubmitting,
        [questionId]: true
      });
      const resp = await assessmentService.compileAndRun({
        source_code: codeForQuestion[questionId],
        stdin: customTestcaseForQuestion[questionId].input,
        language_id: questions.find(x => x._id === questionId).lang,
        enable_network: true,
      });
      setTimeout(()=> checkCompileStatus(resp.data.token, questionId), 5000);
    } catch (error) {
      setIsCustomSubmitting({
        ...isSubmitting,
        [questionId]: false
      });
    }
  }

  const checkCompileStatus = (token, questionId) => {
    if (token) {
      assessmentService.checkCustomStatus({ submissionToken: token }).then((resp) => {
        if (resp.data.status.id > 2) {
          updateCustomTestCase(questionId, {
            output: resp.data.stdout ? resp.data.stdout : resp.data.stderr,
            status: resp.data.status.id === 3 ? 1 : 2,
          });
          setIsCustomSubmitting({
            ...isSubmitting,
            [questionId]: false
          });
        }
        else {
          setTimeout(()=> checkCompileStatus(token, questionId), 5000);
        }
      });
    }
  };

  const updateTestCaseStatus = (stats, questionId, lastSaved) => {
    setStatusOfTestcases({
      ...statusOfTestcases,
      [questionId]: {
        status: Object.keys(statusOfTestcases[questionId].status).reduce((p, c, index) => ({
          ...p,
          [c]: {
            status: stats[index].status_id < 3 ? 0 : ((stats[index].status_id === 3) ? 1 : 2),
            executionOutput: stats[index].status_id < 3 ? null : (stats[index].stdout ? stats[index].stdout : stats[index].stderr),
          }
        }
        ), statusOfTestcases[questionId].status),
        lastSaved
      }
    }
    )
  }

  const submitQuestion = async (questionId) => {
    try {
      setIsSubmitting({
        ...isSubmitting,
        [questionId]: true
      })
      const resp = await assessmentService.submitQuestion({
        source_code: codeForQuestion[questionId],
        question_id: questionId
      });
      setTimeout(()=>checkSubmitStatus(resp.data.map(v => v.token), questionId), 5000);
    } catch (error) {
      setIsSubmitting({
        ...isSubmitting,
        [questionId]: false
      })
    }
  }

  const checkSubmitStatus = (tokens, questionId) => {
    if (tokens.length>0) {
      assessmentService.checkSubmitStatus({ submissionTokens: tokens.reduce((p, c, i) => (p + ((i !== 0) ? ',' : '') + c), ''), questionId, detailsId: details._id }).then((resp) => {
        if (resp.data.submissions) {
          let flag = true;
          for (const sub of resp.data.submissions) {
            if (sub.status_id < 3) {
              flag = false;
            }
          }
          if (!flag) {
            setTimeout(() => checkSubmitStatus(tokens, questionId), 5000);
          }
          else {
            setIsSubmitting({
              ...isSubmitting,
              [questionId]: false
            })
          }
          updateTestCaseStatus(resp.data.submissions, questionId, resp.data.lastSaved);
        }
      });
    }
  }

  // Save finish time and reason as ended by student
  const handleTestEnd = async (reason) => {
    if(! isEndTestOpen && reason !== 'Time up' && reason !== 'Exited full screen more than twice') {
      setisEndTestOpen(true);
    }
    else {
      // Hide test by showing loading
      setLoading(true);

      await endTest();

      const resp = await assessmentService.endTest({
        detailsId: details._id,
        endReason: reason,
        fullScreenExitCount
      })
      if(resp.data && resp.data.success) {
        setTimeout(()=>{
          window.location.reload();
          setTimeout(()=>{
            toast.success('Test Submitted, please provide feedback for the test in assignment tab');
          }, 3000);
        },1000);
        navigate('/');
      }
    }
  }

  const reportChange = useCallback((state, handle) => {
    if (handle === handleFullScreen) {
      setIsFullscreen(state);
      if (!state) {
        if((fullScreenExitCount+1)>2)
          setTimeout(()=> handleTestEnd("Exited full screen more than twice"), 5000);
        setFullScreenExitCount(fullScreenExitCount + 1);
      }
    }
  }, [handleFullScreen]);

  useEffect(async () => {
    gtm.push({ event: 'page_view' });
    await getCodingQuestions();
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
    document.addEventListener('keydown', (e)=> {
      if(e.ctrlKey || e.altKey || e.metaKey)
      {
        e.preventDefault();
      }
    })
    videoRef.current.srcObject = stream;
    startTest();
  }, []);

  return (
    <Box>
      {loading && 'Loading'}
      {!loading && (
        <FullScreen
          handle={handleFullScreen}
          onChange={reportChange}
        >
          {(irisWarning || audioWarning || phoneDetected || personCount != 1 || !faceRecognized) && <div className='parent'>
              <div className='danger'>
                  <h1>Warning</h1>
                  {audioWarning && <h2>Voice detected</h2>}
                  {irisWarning && <h2>Looking away from screen</h2>}
                  {phoneDetected && <h2>Phone detected</h2>}
                  {personCount == 0 && <h2>No person detected</h2>}
                  {personCount > 1 && <h2>Multiple persons detected</h2>}
                  {!faceRecognized && <h2>Face not recognized</h2>}
              </div>
          </div>}
          <div style={{backgroundColor: '#222B36', padding: '0 10px', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} >
            <h2>{user.usn}</h2>
            <h1 style={{textAlign: 'center',margin: 0}}>{`Course: ${courseName}`}</h1>
            <Countdown
              onTick={(timedelta) => {
                setTimeSpent(timedelta.total);
              }}
              onComplete={() => handleTestEnd('Time up')}
              renderer={(props2) => (
                <Button style={{fontSize: '24px'}} >
                  {`${parser(props2.hours)}:${parser(props2.minutes)}:${parser(props2.seconds)}`}
                </Button>
              )}
              date={Date.now() + timeSpent}
            />
          </div>
          <div style={{ position: 'absolute', left: '10px', bottom: '10px' }}>
            <video className='feed' ref={videoRef} autoPlay muted 
              style={{zIndex: 100}}
            ></video>
            {/* <h3>{user.usn}</h3>
            <Countdown
              onTick={(timedelta) => {
                setTimeSpent(timedelta.total);
              }}
              onComplete={() => handleTestEnd('Time up')}
              renderer={(props2) => (
                <Button>
                  {`${parser(props2.hours)}:${parser(props2.minutes)}:${parser(props2.seconds)}`}
                </Button>
              )}
              date={Date.now() + timeSpent}
            /> */}
          </div>

          <SideBar
            detail={details}
            mcq={mcq}
            questions={questions}
            subjectiveQuestions = {subjectiveQuestions}
            customTestCase={customTestcaseForQuestion}
            codeForQuestion={codeForQuestion}
            handleCustomTestCaseUpdate={updateCustomTestCase}
            handleFullScreenEnter={handleFullScreen.enter}
            isFullScreen={isFullscreen}
            fullScreenExitCount={fullScreenExitCount}
            setCodeForQuestion={updateCode}
            compileAndRun={compileAndRun}
            testCaseStatus={statusOfTestcases}
            submitQuestion={submitQuestion}
            isQuestionSubmitting={isSubmitting}
            isCustomSubmitting={isCustomSubmitting}
          />
          <Box
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              position: 'fixed',
              marginRight: 20,
              marginBottom: 25,
              bottom: 0,
              right: 0
            }}
          >
            {
              isEndTestOpen && (
                <Fab
                  color="secondary"
                  variant="extended"
                  aria-label="add"
                  size="small"
                  onClick={() => { setisEndTestOpen(false) }}
                  sx={{
                    pl: 2,
                    mx: 1
                  }}
                >
                  Cancel
                </Fab>
              )
            }
            <Fab
              color="primary"
              variant="extended"
              aria-label="add"
              size="small"
              onClick={() => { handleTestEnd('Test ended by student') }}
              sx={{
                pl: 2,
              }}
            >
              { isEndTestOpen? 'Proceed':'End Test'}
            </Fab>
          </Box>
        </FullScreen>
      )}
    </Box>
  );
};

export default CodingAssessment;
