
// // This agent refers to PORT where program is runninng.

process.env.NODE_ENV ='test';
const expect = require('chai').expect;
const supertest = require('supertest');
const should = require("should");
const request = require('request');
const mysql = require('../services/db');
const checkUser = require('../services/auth');
var server = supertest.agent("http://localhost:3000");
const main =require('../routes/user.js');




//----------------------------POST------------------------------------
describe('POST Test', () => {
    
    it('Create new User expect code 201',(done) => {
        server.post('/v1/user')   // enter URL for POST
        .send({first_name:'cloud',last_name:'fall',password:'Cloud@123',email_address:'cloudfall100@gmail.com'})
        .expect("Content-type",/json/)
        .end((err,res)=>{
            const body=res.body;
            expect(body).to.contain.property('id');
            expect(body).to.contain.property('first_name');
            expect(body).to.contain.property('last_name');
            expect(body).to.contain.property('email_address');
            expect(body).to.contain.property('account_created');
            expect(body).to.contain.property('account_updated');
            res.status.should.equal(201);
            done();
        });
        //.catch((err)=> done(err));
    });
    
    it('Error Creating new User status 400',(done) => {
        server.post('/v1/user')   // enter URL for POST
        .send({first_name :'cloud',last_name :'fall',password :'Cloud@123',email_address :'cloudfall100@gmail.com'})
        .expect("Content-type",/json/)
        .end((err,res)=>{
            const body=res.body;
            console.log(res.body);
            res.status.should.equal(400);
            done();
        });
    });
});

// // -----------------------------------GET------------------------------------------

describe("GET Test",function(){


    it("Wrong API request --> 404",function(done){
        server
        .get('/v1/user')
        .expect("Content-type",/json/)
        .expect(404)
        .end(function(err,res){
            var json_body = res.body;
            var msg = json_body.error;
            var code = msg.messsage;
            expect(code).to.equal('NOT FOUND');
            done();
        });
    });

    it('Unauthorized User --> 401 : Unauthorized ',(done) => {
        server.get('/v1/user/self',checkUser.authenticate)
        .send({password :'Cloud@123',username :'cloud200@gmail.com'})     // enter URL for GET
        .expect("Content-type",/json/)
        .expect(401)
        .end(function(err,res){
            var json_body = res.body;
            console.log(json_body);
            var msg = json_body.message;
            expect(msg).to.equal('Unauthorized');
            done();
        });
    });

});

//--------------------------Invalid URL----------------------------------
describe('Basic URL Test', () => {

    it('Main page content',function(done){
        this.timeout(15000);
        setTimeout(done, 15000);
        request('http://localhost:3000',function(error,response,body){
            var json_body = JSON.parse(body);
            //console.log(json_body);
            var msg = json_body.error;
            //console.log(msg);
            var code = msg.messsage;
            //console.log(code);
            expect(code).to.equal('NOT FOUND');
            done();
        });
    });


    it('Invalid URL', function(done) {
        this.timeout(15000);
        setTimeout(done, 15000);
        request('http://localhost:3000/cloud@gmail.com' , function(error, response, body) {
            expect(response.statusCode).to.equal(404);
            done();
        });
    });

    it("should return 404",function(done){
        server
        .get("/user")
        .expect(404)
        .end(function(err,res){
            res.status.should.equal(404);
            done();
        });
    });
});

//-------------------------------PUT---------------------------------------------

describe('PUT request', () => {

    it('Update Invalid User Details --> 400 : BAD request',(done) => {
        server.put('/v1/user/self',checkUser.authenticate)     // enter URL for PUT
        .expect("Content-type",/json/)
        .expect(400)
        .end(function(err,res){
            var json_body = res.body;
            var msg = json_body.message;
            expect(msg).to.equal('Bad Request');
            done();
        });
    });

    it('Unautherized User --> 401 : Unautherized ',(done) => {
        server.put('/v1/user/self',checkUser.authenticate)
        .send({password :'Cloud@123',email_address :'cloud5@gmail.com'})     // enter URL for PUT
        .expect("Content-type",/json/)
        .expect(401)
        .end(function(err,res){
            var json_body = res.body;
            console.log(json_body);
            var msg = json_body.message;
            expect(msg).to.equal('Unauthorized');
            done();
        });
    });
});
