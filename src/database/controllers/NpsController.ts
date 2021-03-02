import { getCustomRepository, Not, IsNull } from "typeorm"
import { SurveysRepository } from "../../Repositories/SurveysRepository";
import { SurveysUsersRepository } from "../../Repositories/SurveysUsersRepository"
import {Request, Response} from "express";


class NPsController{
    /**
     * 0-6 = detratores
     * 7-8 = passivos
     * >8 = promotores
     * Fórmula: (num_promotores - num_detratores)/(num_respondentes) * 100
     */
    async execute(request:Request, response:Response){
        const {survey_id} = request.params;
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            value:Not(IsNull()),
        });
        const detractor = surveysUsers.filter(
            (survey) =>  survey.value >= 0 && survey.value <= 6
        ).length;
        const promoters = surveysUsers.filter(
            (survey) => survey.value >= 9 && survey.value <= 10
        ).length;
        const passive = surveysUsers.filter(
            (survey) => survey.value >= 7 && survey.value <= 8
        ).length;

        const totalAnswers = surveysUsers.length;
        const calculate = (promoters - detractor)/totalAnswers * 100;

        return response.json({
            detractor,
            promoters,
            passive,
            totalAnswers,
            nps:calculate
        });

    }
}

export {NPsController}