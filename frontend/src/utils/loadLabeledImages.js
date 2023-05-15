import * as faceapi from '@vladmandic/face-api';
import { apiConfig } from '../config';

export const loadLabeledImages = (usn, testId) => {
    const labels = [usn];
    return Promise.all(
        labels.map(async (label)=>{
            const descriptions = [];
            let len = 4;
            for(let i=1; i<=len; i++) {
                const img = await faceapi.fetchImage(`${apiConfig.baseUrl}/uploads/${testId}/dataset/${usn}/${i}.jpg`);
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                // console.log(label + i + JSON.stringify(detections));
                descriptions.push(detections.descriptor);
            }
            return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
    )
}