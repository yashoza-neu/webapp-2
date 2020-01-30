# CloudProject

About the field data types in swagger docs:

If a field has readOnly set to true, the value in this field is populated by your application. Example field are timestamp and id. readOnly properties are included in responses but not in requests.
If a field has writeOnly set to true, the value in this field is provided by API caller in POST or PUT request but these fields are not part of GET request. Example is password field. writeOnly properties may be sent in requests but not in responses.
multipleOf keyword is used to specify that a number must be the multiple of another number.
The minimum and maximum keywords are used to specify the range of possible values.
User Stories¶
All API request/response payloads should be in JSON.
No UI should be implemented for the application.
As a user, I expect all APIs call to return with proper HTTP status code.
As a user, I expect the code quality of the application is maintained to highest standards using unit and/or integration tests.
As a user, I want to get my bills from the application. If I try to get a bills owned by someone else, application should return appropriate error.
As a user, I want to create a new bills in the system.
As a user, I want to update a bills that I have created. If I try to update a bills owned by someone else, application should return appropriate error.
As a user, I want to delete a bills that I have created. If I try to delete a bills owned by someone else, application should return appropriate error.