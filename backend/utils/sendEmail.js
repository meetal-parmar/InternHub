const nodemailer = require("nodemailer");

const sendEmail = async (to,password)=>{
    try{
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user : "internhub123@gmail.com",
                pass : "kvej sccd fatd xquz"
            }
        });

        const mailOptions ={
            from : "internhub123@gmail.com",
            to : to,
            subject : "Intern Account Created",
            text : `Hello 
            
            Your account has been created successfully.
            
            Email: ${to}
            Password: ${password}
            
            plese login.
            
            Thank You.`
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    }
    catch(error)
    {
        console.log("Email error :",error);
    }
    
}

module.exports = sendEmail;