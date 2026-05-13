import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GA_MEASUREMENT_ID = Deno.env.get("GA_MEASUREMENT_ID")!;
const GA_API_SECRET = Deno.env.get("GA_API_SECRET")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

Deno.serve(async (req) => {
  try {
    const { events } = await req.json();

    if (!Array.isArray(events) || events.length === 0) {
      return new Response(JSON.stringify({ error: "No events provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const results = [];
    const recordsToInsert = [];

    for (const event of events) {
      const { event_name, user_id, entity_id, entity_type, metadata, source, session_id, timestamp } = event;

      recordsToInsert.push({
        event_name,
        user_id: user_id || null,
        entity_id: entity_id || null,
        entity_type: entity_type || null,
        metadata: metadata || {},
        source: source || "web",
        session_id: session_id || null,
        created_at: timestamp || new Date().toISOString(),
      });

      try {
        await fetch(
          `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              client_id: session_id || "unknown",
              events: [
                {
                  name: event_name,
                  params: {
                    ...metadata,
                    session_id,
                    entity_id,
                    entity_type,
                  },
                },
              ],
            }),
          }
        );
        results.push({ event_name, status: "success" });
      } catch (err) {
        results.push({ event_name, status: "ga_failed", error: err.message });
      }
    }

    if (recordsToInsert.length > 0) {
      const { error } = await supabase.from("analytics_events").insert(recordsToInsert);
      if (error) {
        console.error("Failed to insert events to Supabase:", error);
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});