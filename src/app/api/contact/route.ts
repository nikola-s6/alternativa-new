import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// This would typically come from environment variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_TO = process.env.EMAIL_TO;

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: 'carl.dnsserve.rs',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  debug: true,
  logger: true,
});

export async function POST(request: NextRequest) {
  try {
    console.log(EMAIL_USER);
    console.log(EMAIL_PASS);
    console.log(EMAIL_TO);
    // Parse the request body
    const body = await request.json();
    const { name, email, phone, neighborhood, comment } = body;

    // Get neighborhood title if available
    let neighborhoodTitle = '';
    if (neighborhood) {
      try {
        // Dynamically import the neighborhoods to avoid server/client mismatch
        const { neighborhoods } = await import('@/config/site');
        const found = neighborhoods.find((n) => n.value === neighborhood);
        if (found) {
          neighborhoodTitle = found.title;
        }
      } catch (error) {
        console.error('Error loading neighborhoods:', error);
      }
    }

    // Format the email content
    const emailContent = `
      NOVA PRIJAVA
      --------------------------
      Ime i prezime: ${name}
      Email: ${email}
      Broj telefona: ${phone}
      ${neighborhood ? `Mesna zajednica: ${neighborhoodTitle || neighborhood}` : ''}
      ${comment ? `Dodatni komentar ili pitanje: ${comment}` : ''}
      --------------------------
      Poslato: ${new Date().toLocaleString()}
    `;

    // Email options
    const mailOptions = {
      from: EMAIL_USER,
      // try changing this to other address whel ssl is configured
      to: EMAIL_USER,
      subject: 'Nova prijava',
      text: emailContent,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send email',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
