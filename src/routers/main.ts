import { Router } from "express";
import * as pingController from "../controllers/ping";
import * as authController from "../controllers/auth";
import * as postagenController from "../controllers/postagens";
import * as userController from "../controllers/user";
import * as feedController from "../controllers/feed";
import * as searchController from "../controllers/search";
import * as trendController from "../controllers/trend";
import * as suggestionsController from "../controllers/suggestion";
import { verifyJWT } from "../utils/jwt";

export const mainRouter = Router();

mainRouter.get('/ping', pingController.ping);
mainRouter.get('/privateping', verifyJWT, pingController.privatePing);

mainRouter.post('/auth/signup', authController.signup);
mainRouter.post('/auth/signin', authController.signin);

mainRouter.post('/postagen', verifyJWT, postagenController.addPostagen);
mainRouter.get('/postagen/:id', verifyJWT, postagenController.getPostagen);
mainRouter.get('/postagen/:id/answers', verifyJWT, postagenController.getAnswers);
mainRouter.post('/postagen/:id/like', verifyJWT, postagenController.likeToggle);

mainRouter.get('/user/:slug', verifyJWT, userController.getUser);
mainRouter.get('/user/:slug/postagens', verifyJWT, userController.getUserPostagens);
mainRouter.post('/user/:slug/follow', verifyJWT, userController.followToggle);
mainRouter.put('/user', verifyJWT, userController.updateUser);
//mainRouter.put('/user/avatar');
//mainRouter.put('/user/cover');

mainRouter.get('/feed', verifyJWT, feedController.getFeed);
mainRouter.get('/search', verifyJWT, searchController.searchPostagens);
mainRouter.get('/trending', verifyJWT, trendController.getTrends);
mainRouter.get('/suggestions', verifyJWT, suggestionsController.getSuggestions);