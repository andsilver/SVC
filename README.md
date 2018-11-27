# Stolen Vehicle Check Backend #

## Account API ##


### Route - /account/login ###
<details>
  <summary>GET</summary>
  <h4>Login Page</h4>
  <p>Check user Login status</p>
  <p>True - Return JSON response 'Already Logged In.'</p>
  <p>False - Return JSON response 'Login Page.'</p>
</details>

<details>
  <summary>POST</summary>
  <h4>Login with `email` and `password`</h4>
  <p>Success - Login and set session cookie. Return JSON response 'Success! You are logged in.'</p>
  <p>Error - Return JSON response errors</p>
</details>

----
### Route - /account/logout ###
<details>
  <summary>GET</summary>
  <h4>Logout user</h4>
  <p>Destroy session and redirect to `/`</p>
</details>

----
### Route - /account/signup ###
<details>
  <summary>GET</summary>
  <h4>Signup Page</h4>
  <p>Check user Login status</p>
  <p>True - Return JSON response 'Already Signed up.'</p>
  <p>False - Return JSON response 'Signup Page.'</p>
</details>

<details>
  <summary>POST</summary>
  <h4>Signup with `email`</h4>
  <p>Success - Login and set session cookie. Return JSON response 'Success!'</p>
  <p>Error - Return JSON response errors</p>
  <p>User Exists - Return JSON response 'Account with that email address already exists.'</p>
</details>

----
### Route - /account/password ###
<details>
  <summary>GET</summary>
  <h4>Create or Update user password page</h4>
  <p>Check user Login status</p>
  <p>False - Redirect to `/`</p>
  <p>True - Return JSON response 'Update/Create Password page.'</p>
</details>

<details>
  <summary>POST</summary>
  <h4>Post `password` and `confirmPassword`</h4>
  <p>Check user Login status</p>
  <p>False - Redirect to `/`</p>
  <p>True & Success - Update Password. Return JSON response 'Password updated.'</p>
  <p>True & Error - Return JSON response errors</p>
</details>

----
### Route - /account/password/reset ###
<details>
  <summary>GET</summary>
  <h4>Password reset page with `email`</h4>
  <p>Check user Login status</p>
  <p>True - Redirect to `/account/password` instead</p>
  <p>False - Return JSON response 'Reset Password page.'</p>
</details>

<details>
  <summary>POST</summary>
  <h4>Post `email` to get reset link.</h4>
  <p>Check user Login status</p>
  <p>True - Redirect to `/account/password` instead</p>
  <p>False & Success - Email reset link. Return JSON response 'An e-mail has been sent to `${user.email}` with further instructions.'</p>
  <p>False & Error - Return JSON response errors</p>
</details>

----
### Route - /account/password/reset/:token ###
<details>
  <summary>GET</summary>
  <h4>Password reset page with `password` and `confirmPassword`</h4>
  <p>Check user Login status</p>
  <p>True - Redirect to `/account/password` instead</p>
  <p>False & Valid Token - Return JSON response 'Token Valid! Post new password & confirmPassword.'</p>
  <p>False & Invalid Token - Return JSON response 'Password reset token is invalid or has expired.'</p>
</details>

<details>
  <summary>POST</summary>
  <h4>Post `password` and `confirmPassword`</h4>
  <p>Check user Login status</p>
  <p>True - Redirect to `/account/password` instead</p>
  <p>False & Success - Update password and email password change success. Return JSON response 'Success! Your password has been changed.'</p>
  <p>False & Error - Return JSON response errors</p>
</details>

----
### Route - /account/delete ###
<details>
  <summary>POST</summary>
  <h4>Delete user account</h4>
  <p>Delete data, Destroy session. Return JSON response 'Your account has been deleted.'</p>
</details>

----