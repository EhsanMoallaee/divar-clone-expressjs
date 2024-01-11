import { Router } from 'express';
import imageRouter_v1 from '../imageModule/imageRoutes/v1.image.routes.js';
import videoRouter_v1 from '../videoModule/videoRoutes/v1.video.routes.js';

const mediaRouter_v1 = Router();

mediaRouter_v1.use('/image', imageRouter_v1); // <domain>/api/v1/media/image
mediaRouter_v1.use('/video', videoRouter_v1); // <domain>/api/v1/media/video

export default mediaRouter_v1;
