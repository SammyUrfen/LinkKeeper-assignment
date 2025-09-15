import express from 'express';
import { addLink, getLinks, updateLink, deleteLink } from '../controller/link.controller.js';
import isAuth from '../middleware/isAuth.js';

const linkRouter = express.Router();

linkRouter.post('/', isAuth, addLink);
linkRouter.get('/', isAuth, getLinks);
linkRouter.put('/:id', isAuth, updateLink);
linkRouter.delete('/:id', isAuth, deleteLink);

export default linkRouter;
