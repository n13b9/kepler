const request = require('supertest');
const app = require('../../app.js');

describe('Test GET /launches',()=>{
    test('it should respond with 200 success',async ()=>{
        const response = await request(app)
            .get('/launches')
            .expect('Content-type',/json/)
            .expect(200)
    })
})

describe('Test POST /launch',()=>{
    const completeLaunchData = {
        mission:'USS E',
        rocket:"faclcon",
        target:'Kepler',
        launchDate:'January 4, 2029'
    }

    const launchDataWithoutDate = {
        mission:'USS E',
        rocket:"faclcon",
        target:'Kepler',
    }

    const launchDataWithInvalidDate = {
        mission:'USS E',
        rocket:"faclcon",
        target:'Kepler',
        launchDate:'hello'
    }

    test('it should respond with 201 created',async()=>{
        const response = await request(app)
            .post('/launches')
            .send(completeLaunchData)
            .expect('Content-type',/json/)
            .expect(201); 

        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(responseDate).toBe(requestDate);

        expect(response.body).toMatchObject(launchDataWithoutDate)
    })

    test('missing required catch',async ()=>{
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithoutDate)
            .expect('Content-type',/json/)
            .expect(400); 

        expect(response.body).toStrictEqual({
            error:'mission required property'
        })
    })
    test('invalid date',async ()=>{
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithInvalidDate)
            .expect('Content-type',/json/)
            .expect(400); 

        expect(response.body).toStrictEqual({
            error:'invalid date'
        })
    })
})
