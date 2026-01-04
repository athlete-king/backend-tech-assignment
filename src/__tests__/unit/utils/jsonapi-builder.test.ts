import { JsonApiBuilder } from '../../../utils/jsonapi-builder.js';

describe('JsonApiBuilder', () => {
  describe('documentToResource', () => {
    it('should convert MongoDB document to JSON:API resource', () => {
        const mockDoc = {
            _id: '507f1f77bcf86cd799439011',
            title: 'Test Quiz',
            description: 'Test description',
            instruction: 'Test instruction'
        };

        const resource = JsonApiBuilder.documentToResource(
            mockDoc,
            'quizzes',
            {
                'title': 'title',
                'description': 'description',
                'instruction': 'instruction',
            }
        );

        expect(resource).toEqual({
            type: 'quizzes',
            id: '507f1f77bcf86cd799439011',
            attributes: {
                'title': 'Test Quiz',
                'description': 'Test description',
                'instruction': 'Test instruction'
            }
        });
    });

    it('should handle virtual properties', () => {
        const mockDoc = {
            _id: '1',
            title: 'Test',
            questionCount: 5,
        };

        const resource = JsonApiBuilder.documentToResource(
            mockDoc,
            'quizzes',
            {
                'title': 'title',
                'question-count': 'questionCount',
            }
        );

        expect(resource.attributes?.['question-count']).toBe(5);
    });

    it('should handle missing optional fields', () => {
        const mockDoc = {
            _id: '1',
            title: 'Test',
        };

        const resource = JsonApiBuilder.documentToResource(
            mockDoc,
            'quizzes',
            {
                'title': 'title',
                'description': 'description', // Doesn't exist in doc
            }
        );

        expect(resource.attributes).toHaveProperty('title', 'Test');
        expect(resource.attributes).not.toHaveProperty('description');
        expect(resource.relationships).toBeUndefined();
    });
  });

    describe('error handling', () => {
        it('should build error response', () => {
            const builder = new JsonApiBuilder();
            
            builder.addError({
                status: '422',
                title: 'Validation Error',
                detail: 'Title is required',
                source: { pointer: '/data/attributes/title' }
            });

            builder.addError({
                status: '400',
                title: 'Bad Request',
                detail: 'Invalid JSON'
            });

            const result = builder.build();
            
            expect(result.errors).toHaveLength(2);
            expect(result.errors?.[0]).toEqual({
                status: '422',
                title: 'Validation Error',
                detail: 'Title is required',
                source: { pointer: '/data/attributes/title' }
            });
            
            expect(result.data).toBeUndefined();
            expect(result.included).toBeUndefined();
        });
    });
});