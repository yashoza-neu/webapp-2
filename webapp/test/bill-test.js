process.env.NODE_ENV ='test';
const supertest = require('supertest');
const checkUser = require('../services/auth');
var server = supertest.agent("http://localhost:3000");



//------------------------------GET-------------------------------------


//----------------------------POST---------------------------------------
describe("post Test",function(){

    it('should not allow to post bill',(done) => {
        server.post('/v2/bill',checkUser.authenticate)
        .send({password :'Cloud@123',username :'cloud200@gmail.com'})     // enter URL for GET
        .expect("Content-type",/json/)
        .expect(401)
        .end(function(err,res){
            res.status.should.equal(401);
            done();
        });
    });
});

//----------------------------delete------------------------
describe("delete Test",function(){

    it('should not allow to delete bill',(done) => {
        server.delete('/v2/bill/',checkUser.authenticate)
        .send({password :'Cloud@123',username :'cloud200@gmail.com'})     // enter URL for GET
        .expect("Content-type",/json/)
        .expect(404)
        .end(function(err,res){
            res.status.should.equal(404);
            done();
        });
    });
});

//----------------------------put------------------------
describe("put Test",function(){

    it('should not allow to update bill',(done) => {
        server.put('/v2/bill/',checkUser.authenticate)
        .send({password :'Cloud@123',username :'cloud200@gmail.com'})     // enter URL for GET
        .expect("Content-type",/json/)
        .expect(404)
        .end(function(err,res){
            res.status.should.equal(404);
            done();
        });
    });
});
