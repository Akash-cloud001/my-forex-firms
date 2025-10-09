import { NextResponse } from "next/server";
// import sendgrid from "@sendgrid/mail";
import connectDB from "@/lib/mongodb";
import EmailSubscription from "@/models/EmailSubscription";

// sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Check if email already exists
    const existingSubscription = await EmailSubscription.findOne({ email: email.toLowerCase() });
    
    if (existingSubscription) {
      return NextResponse.json(
        { success: false, message: "This email is already subscribed" },
        { status: 409 }
      );
    }

    // Get IP and User Agent
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Save to database
    try {
      await EmailSubscription.create({
        email: email.toLowerCase(),
        ipAddress,
        userAgent,
      });
    } catch (error) {
      console.error("Error saving email subscription:", error);
      if ((error as { code?: number }).code === 11000) {
        // Duplicate key error
        return NextResponse.json(
          { success: false, message: "This email is already subscribed" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, message: "Failed to save subscription" },
        { status: 500 }
      );
    }

    // TODO: Send thank you email (SendGrid temporarily disabled)
    /* 
    if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
      console.error("Missing SendGrid or FROM address config");
      return NextResponse.json(
        { success: true, message: "Subscribed successfully, but email notification failed" },
        { status: 200 }
      );
    }

    const thankYouEmail = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "Thank You for Subscribing - My Forex Firms",
      text: `
Thank you for subscribing to My Forex Firms!

We're excited to have you on board. You'll be among the first to know when we launch.

Stay tuned for updates!

Best regards,
My Forex Firms Team
      `,
      html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Thank You - My Forex Firms</title>
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    a {
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .wrapper {
        width: 100% !important;
        min-width: 320px !important;
      }
      .mobile-padding {
        padding: 16px !important;
      }
      h1 {
        font-size: 20px !important;
        line-height: 26px !important;
      }
      .message {
        font-size: 14px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f9f9f9;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9f9f9;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" class="wrapper" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #1a1a1a; padding: 40px 20px;">
              <h1 style="margin: 0; font-family: 'Montserrat', Arial, sans-serif; font-size: 28px; color: #00d4ff; font-weight: 600;">
                My Forex Firms
              </h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td class="mobile-padding" style="padding: 40px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding-bottom: 20px;">
                    <h2 style="margin: 0; font-family: Arial, sans-serif; font-size: 24px; color: #333333; line-height: 30px;">
                      Thank You for Subscribing! 🎉
                    </h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 20px;">
                    <p class="message" style="margin: 0; font-family: Arial, sans-serif; font-size: 16px; color: #555555; line-height: 24px;">
                      We're thrilled to have you on board! You'll be among the first to know when <strong>My Forex Firms</strong> launches.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 20px;">
                    <p class="message" style="margin: 0; font-family: Arial, sans-serif; font-size: 16px; color: #555555; line-height: 24px;">
                      Stay tuned for exclusive updates, features, and launch announcements coming your way soon.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px;">
                    <p class="message" style="margin: 0; font-family: Arial, sans-serif; font-size: 16px; color: #555555; line-height: 24px;">
                      Best regards,<br/>
                      <strong style="color: #00d4ff;">My Forex Firms Team</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #f9f9f9; padding: 24px 20px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-family: Arial, sans-serif; font-size: 14px; color: #777777; line-height: 20px;">
                    &copy; 2025 My Forex Firms. All rights reserved.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family: Arial, sans-serif; font-size: 12px; color: #999999; line-height: 18px; padding-top: 8px;">
                    If you didn't subscribe to this list, please ignore this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    };

    // Send email (don't block the response on this)
    try {
      await sendgrid.send(thankYouEmail);
    } catch (emailError) {
      console.error("SendGrid send error:", emailError);
      if ((emailError as { response?: { body: unknown } }).response) {
        console.error("SendGrid response error:", (emailError as { response: { body: unknown } }).response.body);
      }
      // Still return success since we saved the subscription
    }
    */

    return NextResponse.json(
      { success: true, message: "Thank you for subscribing! You'll be notified when we launch." },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
