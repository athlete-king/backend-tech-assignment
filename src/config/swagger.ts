import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quiz API",
      version: "1.0.0",
      description:
        "A RESTful API for managing quizzes and questions, following JSON:API specification",
      contact: {
        name: "API Support",
      }
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      { name: "Quizzes", description: "Quiz management endpoints" },
      { name: "Questions", description: "Question management endpoints" },
    ],
    components: {
      schemas: {
        Quiz: {
          type: "object",
          required: ["title", "description", "instructions"],
          properties: {
            title: {
              type: "string",
              description: "The title of the quiz",
              example: "Birds Quiz",
            },
            description: {
              type: "string",
              description: "A description of the quiz",
              example: "Test your knowledge of birds fundamentals",
            },
            instructions: {
              type: "string",
              description: "Instructions for candidates taking the quiz",
              example:
                "All questions are designed to develop your intelligence. Show off your skills.",
            },
          },
        },
        Question: {
            type: "object",
            required: ["text", "type", "correctAnswer", "explanation", "timeLimit"],
            properties: {
                quizId: {
                    type: "objectId",
                    description:
                        "Indicates the ID value of the quiz related to the problem.",
                    example: "395d1f79b4f86qo580185263",
                },
                text: {
                    type: "string",
                    description: "The question text",
                    example: "Where do redshanks breed?",
                },
                type: {
                    type: "string",
                    enum: ["free-text", "multiple-choice"],
                    description: "The type of question",
                    example: "free-text",
                },
                choices: {
                    type: "array",
                    description:
                        "If the question type is multiple choice, it's a string array.",
                    items: {
                        type: "string",
                        example: "Scotland"
                    },
                },
                correctAnswer: {
                    type: "string or array",
                    description:
                        "If the question type is multiple choice, the type is single string. If the question type is free-text, the type is string array.",
                    // the question type is multiple choice
                    example: "Scotland",
                    // the question type is free text
                    items: {
                        type: "string",
                        example: "Scotland"
                    }
                },
                explanation: {
                    type: "string",
                    description:
                        "Indicates a description of the problem.",
                    example: 
                        "The time to solve this problem is 30 seconds.",
                },
                timeLimit: {
                    type: "number",
                    description:
                        "Indicates the time required to solve the problem.",
                    example: 30,
                }
            },
        },
        JSONAPIResource: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  example: "quizzes",
                },
                id: {
                  type: "string",
                  example: "507f1f77bcf86cd799439011",
                },
                attributes: {
                  type: "object",
                },
              },
            },
          },
        },
        JSONAPICollection: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                  },
                  id: {
                    type: "string",
                  },
                  attributes: {
                    type: "object",
                  },
                },
              },
            },
          },
        },
        JSONAPIError: {
          type: "object",
          properties: {
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "404",
                  },
                  title: {
                    type: "string",
                    example: "Not Found",
                  },
                  detail: {
                    type: "string",
                    example: "The requested resource was not found",
                  },
                },
              },
            },
          },
        },
      },
    },
    paths: {
      "/quizzes": {
        get: {
          summary: "Get all quizzes",
          tags: ["Quizzes"],
          responses: {
            "200": {
              description: "A list of quizzes",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPICollection",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Create a new quiz",
          tags: ["Quizzes"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Quiz",
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Quiz created successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIResource",
                  },
                },
              },
            },
            "400": {
              description: "Bad request - validation error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
      },
      "/quizzes/{id}": {
        get: {
          summary: "Get a quiz by ID",
          tags: ["Quizzes"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "The quiz ID",
            },
            {
              name: "include",
              in: "query",
              required: false,
              schema: {
                type: "string",
                enum: ["questions"],
              },
              description:
                "Include related resources (use 'questions' to include quiz questions)",
            },
          ],
          responses: {
            "200": {
              description: "Quiz found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIResource",
                  },
                },
              },
            },
            "404": {
              description: "Quiz not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
        patch: {
          summary: "Update a quiz",
          tags: ["Quizzes"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "The quiz ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Quiz",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Quiz updated successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIResource",
                  },
                },
              },
            },
            "404": {
              description: "Quiz not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
        delete: {
          summary: "Delete a quiz",
          tags: ["Quizzes"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "The quiz ID",
            },
          ],
          responses: {
            "204": {
              description: "Quiz deleted successfully",
            },
            "404": {
              description: "Quiz not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
      },
      "/quizzes/{id}/questions": {
        get: {
          summary: "Get all questions for a specific quiz",
          tags: ["Quizzes", "Questions"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "The quiz ID",
            },
          ],
          responses: {
            "200": {
              description: "List of questions for the quiz",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPICollection",
                  },
                },
              },
            },
            "404": {
              description: "Quiz not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
      },
      "/questions": {
        get: {
          summary: "Get all questions",
          tags: ["Questions"],
          parameters: [
            {
              name: "quizId",
              in: "query",
              required: false,
              schema: {
                type: "string",
              },
              description: "Filter questions by quiz ID",
            },
          ],
          responses: {
            "200": {
              description: "A list of questions",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPICollection",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Create a new question",
          tags: ["Questions"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Question",
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Question created successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIResource",
                  },
                },
              },
            },
            "400": {
              description: "Bad request - validation error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
      },
      "/questions/{id}": {
        get: {
          summary: "Get a question by ID",
          tags: ["Questions"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "The question ID",
            },
          ],
          responses: {
            "200": {
              description: "Question found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIResource",
                  },
                },
              },
            },
            "404": {
              description: "Question not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
        patch: {
          summary: "Update a question",
          tags: ["Questions"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "The question ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Question",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Question updated successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIResource",
                  },
                },
              },
            },
            "404": {
              description: "Question not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
        delete: {
          summary: "Delete a question",
          tags: ["Questions"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "The question ID",
            },
          ],
          responses: {
            "204": {
              description: "Question deleted successfully",
            },
            "404": {
              description: "Question not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
