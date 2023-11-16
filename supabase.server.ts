// app/utils/supabase.server.ts
import { createServerClient } from "@supabase/auth-helpers-remix";

export default ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) =>
  createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );
