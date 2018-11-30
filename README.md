# Stolen Vehicle Check Backend

## Auth API
----
#### POST `/auth/signup`
----
Content-Type: `application/x-www-form-urlencoded`

Payload: 
```javascript
{String} email      - required
{String} name       - required
{String} phone      - required
{String} creditCard - required
{Array}  credits    - optional
```

```javascript
credits: [{
  creditType: "Basic",
  generateReport: false
}]

{String}  creditType     - required, "Basic" or "Full"
{Boolean} generateReport - optional, default: false
```
Success Response:
```javascript
status: 200
  JSON: { msg: "Signup successful" }
```
----
#### POST `/auth/login`
----
Content-Type: `application/x-www-form-urlencoded`

Payload: 
```javascript
{String} email     - required
{String} password  - required
```
Success Response:
```javascript
status: 200
  JSON: { msg: "Signed in" }
```
----
#### GET `/auth/logut`
----
Success Response:
```javascript
status: 200
  JSON: { msg: "Signed out" }
```
----
#### POST `/auth/password/update`
----
Content-Type: `application/x-www-form-urlencoded`

Payload: 
```javascript
{String} password        - required
{String} confirmPassword - required
```
Success Response:
```javascript
status: 200
  JSON: { msg: "Password updated" }
```
----
#### POST `/auth/password/reset`
----
Content-Type: `application/x-www-form-urlencoded`

Payload: 
```javascript
{String} email - required
```
Success Response:
```javascript
status: 200
  JSON: { msg: "Email sent" }
```
----
#### GET `/auth/password/reset/:token`
----
Validate token sent with POST `/password/reset`

Success Response:
```javascript
status: 200
  JSON: { msg: "Valid token" }
```
----
#### POST `/auth/password/reset/:token`
----
Content-Type: `application/x-www-form-urlencoded`

Payload: 
```javascript
{String} password        - required
{String} confirmPassword - required
```
Success Response:
```javascript
status: 200
  JSON: { msg: "Password updated" }
```
----
#### DELETE `/auth/delete`
----
Delete user data

Success Response:
```javascript
status: 200
  JSON: { msg: "Account removed" }
```