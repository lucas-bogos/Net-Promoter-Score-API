import {Router} from "express";
import { AnswerController } from "./database/controllers/AnswerController";
import { NPsController } from "./database/controllers/NpsController";
import { SendMailController } from "./database/controllers/SendMailController";
import { SurveysController } from "./database/controllers/SurveysController";
import { UserController } from "./database/controllers/UserController";

const router = Router();

const userController = new UserController();
const surveysController = new SurveysController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NPsController();

router.post("/users", userController.create);
router.post("/surveys", surveysController.create);
router.get("/surveys", surveysController.show);
router.post("/sendMail", sendMailController.execute)
router.get("/answers/:value", answerController.execute)
router.get("/nps/:survey_id", npsController.execute)

export {router};