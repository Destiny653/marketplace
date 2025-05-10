import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export default async function POST (req, res) { 

  try {
    const { name, email, phone, subject, message, userId } = req.body
    console.log('Received data:', req.body)

    // Insert message into database
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          user_id: userId,
          name,
          email,
          phone,
          subject,
          message,
          status: 'new'
        }
      ])
      .select()

    if (error) throw error

    // Send email using Nodemailer
const mailOptions = {
    from: `"Your Website" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Message: ${subject}`,
    text: `
      New Message Notification
      ========================
      
      You've received a new message through your website contact form.
      
      Contact Details:
      ---------------
      Name:    ${name}
      Email:   ${email}
      Phone:   ${phone || 'Not provided'}
      Subject: ${subject}
      
      Message:
      --------
      ${message}
      
      Sent at: ${new Date().toLocaleString()}
    `,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title>New Message Notification</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: 600;
            color: #000;
            text-decoration: none;
          }
          .card {
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            padding: 25px;
            margin-bottom: 20px;
          }
          h1 {
            font-size: 20px;
            margin-top: 0;
            color: #000;
          }
          .divider {
            height: 1px;
            background: #eaeaea;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            margin-bottom: 10px;
          }
          .detail-label {
            font-weight: 500;
            width: 80px;
            color: #666;
          }
          .detail-value {
            flex: 1;
          }
          .message-content {
            background: #f9f9f9;
            border-radius: 4px;
            padding: 15px;
            margin-top: 15px;
            white-space: pre-wrap;
          }
          .footer {
            text-align: center;
            color: #999;
            font-size: 14px;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <a href="https://yourwebsite.com" class="logo">Your Brand</a>
        </div>
        
        <div class="card">
          <h1>New Message Notification</h1>
          <p>You've received a new message through your website contact form.</p>
          
          <div class="divider"></div>
          
          <div class="detail-row">
            <div class="detail-label">Name:</div>
            <div class="detail-value">${name}</div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">Email:</div>
            <div class="detail-value">
              <a href="mailto:${email}">${email}</a>
            </div>
          </div>
          
          ${phone ? `
          <div class="detail-row">
            <div class="detail-label">Phone:</div>
            <div class="detail-value">${phone}</div>
          </div>
          ` : ''}
          
          <div class="detail-row">
            <div class="detail-label">Subject:</div>
            <div class="detail-value">${subject}</div>
          </div>
          
          <div class="divider"></div>
          
          <h2>Message:</h2>
          <div class="message-content">${message}</div>
        </div>
        
        <div class="footer">
          <p>This message was sent at ${new Date().toLocaleString()}</p>
          <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </body>
      </html>
    `
  }
    await transporter.sendMail(mailOptions)

    return res.status(200).json({ success: true, message: data[0] })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ success: false, error: true, message:error.message })
  }
}