var nodemailer = require('nodemailer');
module.exports = function(credentials){
        var mailTransport = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: credentials.gmail.user,
            pass: credentials.gmail.password,
          }
        });
        var from = '"Meadowlark Travel" <info@elowingtravel.com>';
        var errorRecipient = 'vanqschege@gmail.com';
        return {
          send: function(to, subj, body){
            mailTransport.sendMail({
              from: from,
              to: to,
              subject: subj,
              html: body,
              generateTextFromHtml: true
            }, function(err){
              if(err) console.error('Unable to send email: ' + err);
            });
          },
          emailError: function(message, filename, exception){
            var body = '<h1>Elowing Travel Site Error</h1>' +
              'message:<br><pre>' + message + '</pre><br>';
            if(exception) body += 'exception:<br><pre>' + exception + '</pre><br>';
            if(filename) body += 'filename:<br><pre>' + filename + '</pre><br>';
            mailTransport.sendMail({
              from: from,
              to: errorRecipient,
              subject: 'Elowing Travel Site Error',
              html: body,
              generateTextFromHtml: true
            }, function(err){
              if(err) console.error('Unable to send email: ' + err);
            });
          },
        };
      };
