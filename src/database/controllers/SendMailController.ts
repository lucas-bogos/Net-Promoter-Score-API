import {Request, Response} from "express";
import { getCustomRepository } from "typeorm";
import SendMailService from "../../../services/SendMailService";
import { SurveysRepository } from "../../Repositories/SurveysRepository";
import { SurveysUsersRepository } from "../../Repositories/SurveysUsersRepository";
import { UsersRepository } from "../../Repositories/UserRepository";
import { SurveyUser } from "../models/SurveyUser";
import {resolve} from 'path'

class SendMailController{
    async execute(request:Request, response:Response){
        const {email, survey_id} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({email});

        if(!user){
            return response.status(400).json({
                error:"User does not exists!"
            });
        }
        const survey = await surveysRepository.findOne({id:survey_id})

        if(!survey){
            return response.status(400).json({
                error:"Survey does not exists!"
            });
        }
        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where:{user_id:user.id, value:null}
        });

        const variables = {
            name:user.name,
            title:survey.title,
            description:survey.description,
            id:surveyUserAlreadyExists.id,
            link:process.env.URL_MAIL,
        }
        const npsPath = resolve(__dirname, "../../../", "src","views", "npsMail.hbs")

        if(surveyUserAlreadyExists){
            variables.id = surveyUserAlreadyExists.id;
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }

        //save informations into of table surveyUser
        const surveyUser = surveysUsersRepository.create({
            user_id:user.id,
            survey_id,
        });
        
        await surveysUsersRepository.save(surveyUser);

        variables.id = surveyUser.id;
        await SendMailService.execute(email, survey.title, variables, npsPath);
        return response.json(surveyUser);
    }
}
export{SendMailController}