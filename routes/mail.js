const sgMail = require('@sendgrid/mail')
sgMail.setApiKey();

const sendEmail = (reciver, token = 0,type,password) => {
    let subject,title,text1,text2,text3,link,linkText
    if (type == 1) {
        subject = 'Cuenta creada exitosamente';
        title = 'Cuenta creada exitosamente'
        text1 = 'Ya casi terminamos...';
        text2 ='Confirme su cuenta en el enlace que se presenta a continuacion:';
        link = `http://localhost:3020/confirmar/${token}`;
        linkText = 'Confirmar Email'
    } else { 
        subject = 'Usuario creado exitosamente';
        title = 'Usuario creado exitosamente'
        text1 = 'Podra ingresar a la plataforma utilizando las siguientes credenciales:';
        text2 =`Email: ${reciver}`;
        text3 =`Contrasena: ${password}`;
        link = `http://localhost:3020/login`;
        linkText = 'Iniciar sesion'
    }
    
    const msgData = {
        to: reciver, 
        from: 'signalsweb1.0@gmail.com', 
        subject: subject,
        html: `
        <head>
            <title>${title}</title>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
            <meta content="width=device-width" name="viewport">
            <style type="text/css">
                @font-face {
                    font-family: &#x27;Postmates Std&#x27;;
                    font-weight: 600;
                    font-style: normal;
                    src: local(&#x27;Postmates Std Bold&#x27;), url(https://s3-us-west-1.amazonaws.com/buyer-static.postmates.com/assets/email/postmates-std-bold.woff) format(&#x27;woff&#x27;);
                }
        
                @font-face {
                    font-family: &#x27;Postmates Std&#x27;;
                    font-weight: 500;
                    font-style: normal;
                    src: local(&#x27;Postmates Std Medium&#x27;), url(https://s3-us-west-1.amazonaws.com/buyer-static.postmates.com/assets/email/postmates-std-medium.woff) format(&#x27;woff&#x27;);
                }
        
                @font-face {
                    font-family: &#x27;Postmates Std&#x27;;
                    font-weight: 400;
                    font-style: normal;
                    src: local(&#x27;Postmates Std Regular&#x27;), url(https://s3-us-west-1.amazonaws.com/buyer-static.postmates.com/assets/email/postmates-std-regular.woff) format(&#x27;woff&#x27;);
                }
            </style>
            <style media="screen and (max-width: 680px)">
                    @media screen and (max-width: 680px) {
                        .page-center {
                          padding-left: 0 !important;
                          padding-right: 0 !important;
                        }  
                        .footer-center {
                          padding-left: 20px !important;
                          padding-right: 20px !important;
                        }
                    }
            </style>
        </head>
        <body style="background-color: #f4f4f5;">
            <table cellpadding="0" cellspacing="0" style="width: 100%; height: 100%; background-color: #f4f4f5; text-align: center;">
                <tbody>
                    <tr>
                        <td style="text-align: center;">
                            <table align="center" cellpadding="0" cellspacing="0" id="body" style="background-color: #fff; width: 100%; max-width: 680px; height: 100%;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table align="center" cellpadding="0" cellspacing="0" class="page-center" style="text-align: left; padding-bottom: 88px; width: 100%; padding-left: 120px; padding-right: 120px;">
                                                <tbody>
                    
                                                    <tr>
                                                        <td colspan="2" style="padding-top: 72px; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #000000; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 48px; font-smoothing: always; font-style: normal; font-weight: 600; letter-spacing: -2.6px; line-height: 52px; mso-line-height-rule: exactly; text-decoration: none;">
                                                        
                                                        ${title}
                                                        
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding-top: 48px; padding-bottom: 48px;">
                                                            <table cellpadding="0" cellspacing="0" style="width: 100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td style="width: 100%; height: 1px; max-height: 1px; background-color: #d9dbe0; opacity: 0.81"></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="-ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #9095a2; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;">
                                                        
                                                            ${text1}
                                                        
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding-top: 24px; -ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #9095a2; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;">

                                                            ${text2}
                                                        
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding-top: 24px; -ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #9095a2; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;">

                                                            ${text3}
                                                        
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            <a data-click-track-id="37" href=${link} style="margin-top: 36px; -ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #ffffff; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 12px; font-smoothing: always; font-style: normal; font-weight: 600; letter-spacing: 0.7px; line-height: 48px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 220px; background-color: #008080; border-radius: 28px; display: block; text-align: center; text-transform: uppercase" target="_blank">
    
                                                                ${linkText}
    
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </body>`,
      }
      sgMail
        .send(msgData)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        });
};
module.exports = {sendEmail};