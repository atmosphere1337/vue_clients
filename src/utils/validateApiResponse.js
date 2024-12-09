import Joi from "joi";  

const validateApiResponse = (input) => {
  const schema = Joi.object( {
    data: Joi.array().items(
      Joi.object({
      id: Joi.number(),
      first_name: Joi.string(),
      last_name: Joi.string(),
      email: Joi.string().email({tlds: false}),
      avatar: Joi.string().uri(),
      })
    ),
    page: Joi.number(),
    per_page: Joi.number(),
    total: Joi.number(),
    total_pages: Joi.number(),
    support: Joi.object(),
    }
  );
  const result = schema.validate(input);
  if (result.error != null) {
    throw result.error;
  }
} 

export default validateApiResponse;