# Stolen Vehicle Check Backend
----
----
## Auth API
----
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
#### GET `/auth/session`
----
Validate and get decoded session cookie

Success Response:
```javascript
status: 200
  JSON: { user: "userEmail@mailingService" }
```
----
#### GET `/auth/logout`
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

----
----
## Account API
----
----
### Credits
#### GET `/account/credits`
----
Get all credits

Success Response:
```javascript
status: 200
  JSON: { credits: [...] }
```
----
#### POST `/account/credits`
----
Save new credit/s with/without report/s

Content-Type: `application/x-www-form-urlencoded`

Payload: 
```javascript
{Array}  credits - required
```

```javascript
credits: [{
  creditType: "Basic",
  generateReport: false,
  registration: "KM12AKK"
}]

{String}  creditType     - required, "Basic" || "Full"
{Boolean} generateReport - optional, default: false
{String}  registration   - required, if generateReport: true
```

Success Response:
```javascript
status: 200
  JSON: {
    credits: [...],
    reports: [...]
  }
```
----
#### GET `/account/credit/:creditId`
----
Get credit by creditId

Success Response:
```javascript
status: 200
  JSON: { credit: {...} }
```
----
#### PUT `/account/credit`
----
Use credit on report

Content-Type: `application/x-www-form-urlencoded`

Payload: 
```javascript
{String}  creditId      - required
{String}  registration  - required
```

Success Response:
```javascript
status: 200
  JSON: {
    credit: {...},
    report: {...}
  }
```
----
### Reports
#### GET `/account/reports`
----
Get all reports

Success Response:
```javascript
status: 200
  JSON: { reports: [...] }
```
----
#### GET `/account/reports/type/:reportType`
----
Get reports by reportType

Params Options:
```javascript
"Basic" || "Full"
```

Success Response:
```javascript
status: 200
  JSON: { reports: [...] }
```
----
#### GET `/account/reports/vrm/:registration`
----
Get reports by registration

Success Response:
```javascript
status: 200
  JSON: { reports: [...] }
```
----
#### GET `/account/report/:reportId`
----
Get report by reportId

Success Response:
```javascript
status: 200
  JSON: { report: {...} }
```

----
----
## SVC API
----
----
#### GET `/svc/full/:registration`
----
Get VdiCheckFull by VRM

Success Response:
```javascript
status: 200
  JSON: { msg: "Success", data: {...} }
```
----
#### GET `/svc/:datapackage/:registration`
----
Get data by Data Package and VRM

Params Options (Case-Insensitive):

`:datapackage`
```javascript
'BatteryData'
'MotHistoryAndTaxStatusData'
'MotHistoryData'
'PostcodeLookup'
'SpecAndOptionsData'
'TyreData'
'ValuationCanPrice'
'ValuationData'
'VdiCheckFull'
'VehicleAndMotHistory'
'VehicleData'
'VehicleDataIRL'
'VehicleImageData'
'VehicleTaxData'
```

Success Response:
```javascript
status: 200
  JSON: { msg: "Success", data: {...} }
```