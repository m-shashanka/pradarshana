const {TestSchema: Test} = require('../models/Test');

const tests = [];
/*
{
    [testId]: {
        teacher: socketId,
        students: [socketId, socketId, ...],
        queries: [{query: string, usn: string}, {query: string, usn: string}, ...],
        resolution: [string, string, ...]
    }
}
*/
const socketToTestMapping = {};
/*
{
    [socketId]: [testId]
} 
*/

const addUser = async (user, testId, socketId) => {
    try{
        const testExists = await Test.findById(testId);
        if(!user || !testExists)
            return false;
        const existingTest = tests.find(test => testId in test);
        if(existingTest){
            if(user.isProfessor)
                existingTest[testId].teacher = socketId;
            else
                existingTest[testId].students.push(socketId);
        }
        else{
            const newTest = {
                [testId]: {
                    teacher: null,
                    students: [],
                    queries: [],
                    resolution: []
                }
            }
            if(user.isProfessor)
                newTest[testId].teacher = socketId;
            else
                newTest[testId].students.push(socketId);
            tests.push(newTest);
        }
        socketToTestMapping[socketId] = testId;
    } catch(e){
        console.log(e);
        return false;
    }
    return true;
}

const removeUser = (socketId) => {
    if(socketId in socketToTestMapping){
        const testId = socketToTestMapping[socketId];
        const existingTest = tests.find(test => testId in test);
        if(existingTest){
            if(existingTest[testId].teacher == socketId)
                existingTest[testId].teacher = null;
            else if(existingTest[testId].students.includes(socketId))
                existingTest[testId].students.splice(existingTest[testId].students.indexOf(socketId), 1);
            
            if(existingTest[testId].teacher === null && existingTest[testId].students.length == 0)
                tests.splice(tests.indexOf(existingTest), 1);
        }
    }
}

const getQueries = (testId) => {
    const existingTest = tests.find(test => testId in test);
    if(!existingTest)
        return [];
    return existingTest[testId].queries;
}

const getResolution = (testId) => {
    const existingTest = tests.find(test => testId in test);
    if(!existingTest)
        return [];
    return existingTest[testId].resolution;
}

const addQuery = (query, usn, socketId) => {
    let teacherSocket = null;
    if(socketId in socketToTestMapping){
        const testId = socketToTestMapping[socketId];
        const existingTest = tests.find(test => testId in test);
        if(existingTest){
            if(existingTest[testId].teacher)
                teacherSocket = existingTest[testId].teacher;
            existingTest[testId].queries.push({query, usn});
        }
    }
    return teacherSocket;
}

const addResolution = (resolution, socketId) => {
    let isTeacher = false;
    if(socketId in socketToTestMapping){
        const testId = socketToTestMapping[socketId];
        const existingTest = tests.find(test => testId in test);
        if(existingTest){
            if(existingTest[testId].teacher == socketId){
                isTeacher = true;
                existingTest[testId].resolution.push(resolution);
            }
        }
    }
    return isTeacher;
}

module.exports = {addUser, removeUser, getQueries, getResolution, addQuery, addResolution};