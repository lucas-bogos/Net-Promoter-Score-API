import { EntityRepository, Repository } from "typeorm";
import { SurveyUser } from "../database/models/SurveyUser";

@EntityRepository(SurveyUser)
class SurveysUsersRepository extends Repository<SurveyUser>{}

export {SurveysUsersRepository};