import { Router } from 'express';
import IndexController from '../controllers/index';
import { ChatController } from '../controllers/chatController';

const router = Router();

export function setRoutes(app: any) {
    const indexController = new IndexController();
    const chatController = new ChatController();

    app.use('/api', router);
    router.get('/', indexController.getIndex.bind(indexController));
    router.post('/chat', chatController.handleChat.bind(chatController));
}
