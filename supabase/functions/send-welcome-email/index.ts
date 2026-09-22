import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "TWHMU <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY secret is not set");
    return json({ error: "Email service not configured" }, 500);
  }

  let email: string | undefined;
  try {
    const body = await req.json();
    email = body.email;
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  if (!email || typeof email !== "string") {
    return json({ error: "Email is required" }, 400);
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to Saturday Letters",
      html: `
        <div style="font-family: Georgia, serif; background:#0E0F12; color:#EBE4D4; padding:40px; max-width:520px; margin:0 auto;">
          <p style="font-family: monospace; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#E89968; margin:0 0 16px;">
            Saturday Letters
          </p>
          <h1 style="color:#7FCFCF; font-size:32px; margin:0 0 16px;">You're in.</h1>
          <p style="font-size:15px; line-height:1.6; color:#A39A87;">
            Thanks for subscribing. Backstage stories, early ticket access, and the women behind the show — every Saturday morning, straight to your inbox.
          </p>
          <p style="font-family: monospace; font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#6B6353; margin-top:32px;">
            The Women Who Made Us
          </p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Resend error:", errText);
    return json({ error: "Failed to send email" }, 502);
  }

  return json({ success: true });
});
