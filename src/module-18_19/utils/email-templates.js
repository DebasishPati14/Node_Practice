exports.getSignUpMessage = (mailId, userName) => {
  return {
    from: 'mr.debasish005@gmail.com',
    to: mailId,
    subject: 'Account Creation Successful! ✌',
    html: `
          <h1>Welcome ${userName}</h1>
          <div style=" background-color: #acacac;  border-radius: 10px;  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  padding: 20px;
          margin: 20px auto;  max-width: 400px;">
            <h3 style="color: #0073e6;">Your Account is Created Successfully 🌹</h3>
            <p style="color: #333;">Your account with ${mailId} has been successfully created. Welcome to our shopping application!</p>
          </div>
      `,
  };
};

exports.resetPasswordMessage = (mailId, token) => {
  return {
    from: 'mr.debasish005@gmail.com',
    to: mailId,
    subject: 'Create New Password',
    html: `
          <h1>Reset Your Password!</h1>
          <div style=" background-color: #ffffcc;  border-radius: 10px;  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  padding: 20px;
          margin: 20px auto;  max-width: 400px;">
            <h3 style="color: #0073e6;">Click the below link to reset your password.</h3>
            <a style="color: #000;" href = "http://localhost:2400/auth/new-password/${token}">Click me here</a>
          </div>
      `,
  };
};

exports.getChangePasswordMessage = (mailId) => {
  return {
    from: 'mr.debasish005@gmail.com',
    to: mailId,
    subject: 'New Password Successfully Updated! 😃',
    html: `
          <div style=" background-color: #acacac;  border-radius: 10px;  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  padding: 20px;
          margin: 20px auto;  max-width: 400px;">
            <h3 style="color: #0073e6;">Password Changed Successfully 🌹</h3>
            <p style="color: #333;">Your email password has been successfully changed. This step enhances the security of your account, safeguarding your personal information. Please ensure to remember your new password and avoid sharing it with anyone. If you encounter any issues or did not initiate this change, kindly contact our support team immediately. Thank you for choosing us for your email services!</p>
          </div>
      `,
  };
};
