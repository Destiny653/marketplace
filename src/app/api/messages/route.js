import nodemailer from 'nodemailer'
import { supabase } from '../../../lib/supabase/client'
import { NextResponse } from 'next/server'




export async function POST(req) { // Only need req parameter when using NextResponse

    try {
        const emailUser = process.env.EMAIL_USER
        const emailPass = process.env.EMAIL_PASSWORD
        const emailAdmin = process.env.ADMIN_EMAIL
        // Check content-type
        const contentType = req.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
            return NextResponse.json(
                { success: false, error: true, message: 'Content-Type must be application/json' },
                { status: 415 }
            )
        }


        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        })

        try {
            await transporter.verify()
            console.log('Server is ready to send emails')
        } catch (verifyError) {
            console.error('Email server verification failed:', verifyError)
            throw new Error('Email service configuration error')
        }
        // Parse the request body
        const body = await req.json() 

        const { name, email, phone, subject, message, userId } = body

        if (!userId) {
            return NextResponse.json(
                { success: false, error: true, message: 'User ID is required' },
                { status: 400 }
            )
        }

        // Database insertion
        const { data, error } = await supabase
            .from('messages')
            .insert([{
                user_id: userId,
                name,
                email,
                phone,
                subject,
                message,
                status: 'new'
            }])
            .select()

        if (error) throw error

        // Email sending (your beautiful template remains the same)
        const mailOptions = {
            from: `"Your Website" <${email}>`,
            to: emailAdmin,
            subject: `New Message: ${subject}`,
            text: `
      New Message Notification
      ========================
      
      You've received a new message from Marketplace contact form.
      
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

        return NextResponse.json(
            { success: true, message: 'Message sent successfully!', data: data[0] },
            { status: 201 }
        )

    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json(
            { success: false, message: 'Error sending message: ' + error.message, error: true },
            { status: 500 }
        )
    }
}