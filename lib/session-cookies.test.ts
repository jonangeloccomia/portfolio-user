import assert from "node:assert/strict";
import { NextResponse } from "next/server";
import { clearSessionCookies } from "@/lib/session-cookies";

// Test 1: clears both possible session cookie names
{
  const response = NextResponse.json({ ok: true });
  clearSessionCookies(response);

  const setCookieHeaders = response.headers.getSetCookie();
  const names = setCookieHeaders.map((header) => header.split("=")[0]);

  assert.ok(
    names.includes("authjs.session-token"),
    "must clear authjs.session-token"
  );
  assert.ok(
    names.includes("__Secure-authjs.session-token"),
    "must clear __Secure-authjs.session-token"
  );

  for (const header of setCookieHeaders) {
    assert.match(
      header,
      /Expires=Thu, 01 Jan 1970/,
      `${header} must expire immediately`
    );
  }

  console.log("PASS: clearSessionCookies clears both session cookie names");
}

console.log("All auth middleware tests passed.");
