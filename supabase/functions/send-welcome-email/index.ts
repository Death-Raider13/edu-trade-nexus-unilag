
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  confirmationUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmationUrl }: WelcomeEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "WHAT DO U WANNA DO <whatdouwannado@gmail.com>",
      to: [email],
      subject: "Welcome to WHAT DO U WANNA DO - Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 10px;">
              WELCOME TO WHAT DO U WANNA DO
            </h1>
            <p style="color: #64748b; font-size: 16px; margin-bottom: 20px;">
              UR ONE STOP SOLUTION TO ALL THINGS TECH AND INFORMATION
            </p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #334155; font-size: 16px; margin-bottom: 20px;">
              Please verify your email address to complete your registration and access all platform features.
            </p>
            
            <div style="text-align: center;">
              <a href="${confirmationUrl}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Verify Email Address
              </a>
            </div>
          </div>
          
          <div style="text-align: center; color: #64748b; font-size: 14px;">
            <p>If you didn't create an account, you can safely ignore this email.</p>
            <p style="margin-top: 20px;">
              Best regards,<br>
              The WHAT DO U WANNA DO Team<br>
              UNILAG Platform
            </p>
          </div>
        </div>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
